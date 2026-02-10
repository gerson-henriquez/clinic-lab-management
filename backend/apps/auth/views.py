"""
Authentication Views
Handles user authentication, token management, and password operations
"""
import logging

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django_ratelimit.decorators import ratelimit
from django.views.decorators.csrf import csrf_protect
from django.utils import timezone
from datetime import timedelta
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

from .models import User, AuditLog
from .serializers import (
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    UserPermissionsSerializer,
    LoginResponseSerializer,
    TokenRefreshResponseSerializer,
)

logger = logging.getLogger(__name__)

# Cache TTL for permission queries (seconds) – configurable via settings
from django.conf import settings as django_settings
PERM_CACHE_TTL = getattr(django_settings, 'PERMISSION_CACHE_TTL', 300)


def get_client_ip(request):
    """Extract client IP from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """Extract user agent from request"""
    return request.META.get('HTTP_USER_AGENT', '')


def create_tokens_for_user(user):
    """
    Create access and refresh tokens for user
    Returns tokens with expiration times
    """
    refresh = RefreshToken.for_user(user)
    
    # Get token expiration times from settings
    from django.conf import settings
    access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
    refresh_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'access_expiration': timezone.now() + access_lifetime,
        'refresh_expiration': timezone.now() + refresh_lifetime,
    }


@extend_schema(
    tags=['Authentication'],
    summary='User Login',
    description='Authenticate user with email and password. Returns JWT access and refresh tokens.',
    request=LoginSerializer,
    responses={
        200: OpenApiResponse(
            response=LoginResponseSerializer,
            description='Login successful',
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        'user': {
                            'id': 1,
                            'email': 'user@example.com',
                            'username': 'username',
                            'profile': {
                                'role': 'doctor',
                                'branch_name': 'Main Branch'
                            }
                        },
                        'access': 'eyJ0eXAiOiJKV1Qi...',
                        'refresh': 'eyJ0eXAiOiJKV1Qi...',
                        'access_expiration': '2024-02-08T17:00:00Z',
                        'refresh_expiration': '2024-02-15T16:00:00Z'
                    }
                )
            ]
        ),
        400: OpenApiResponse(description='Invalid credentials or account locked'),
        429: OpenApiResponse(description='Rate limit exceeded (5 attempts per minute)')
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
@csrf_protect
def login_view(request):
    """
    User login endpoint
    
    POST /api/auth/login
    
    Request:
    {
        "email": "user@example.com",
        "password": "password123",
        "remember_me": false
    }
    
    Response:
    {
        "user": {...},
        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "access_expiration": "2024-02-08T17:00:00Z",
        "refresh_expiration": "2024-02-09T16:00:00Z"
    }
    """
    # Add IP address to context
    ip_address = get_client_ip(request)
    user_agent = get_user_agent(request)
    
    serializer = LoginSerializer(
        data=request.data,
        context={
            'request': request,
            'ip_address': ip_address
        }
    )
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = serializer.validated_data['user']
    remember_me = serializer.validated_data.get('remember_me', False)
    
    # Reset failed login attempts
    user.reset_failed_login_attempts()
    user.last_login_ip = ip_address
    user.save(update_fields=['failed_login_attempts', 'last_login_ip', 'last_login'])
    
    # Create tokens
    tokens = create_tokens_for_user(user)
    
    # Adjust refresh token expiration if remember_me is True
    if remember_me:
        from django.conf import settings
        remember_days = getattr(settings, 'REMEMBER_ME_DAYS', 30)
        tokens['refresh_expiration'] = timezone.now() + timedelta(days=remember_days)
    
    # Log successful login
    AuditLog.objects.create(
        user=user,
        action='login',
        ip_address=ip_address,
        user_agent=user_agent,
        details={
            'remember_me': remember_me,
            'method': 'email_password'
        }
    )
    
    # Prepare response
    user_serializer = UserSerializer(user)
    
    response_data = {
        'user': user_serializer.data,
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'access_expiration': tokens['access_expiration'],
        'refresh_expiration': tokens['refresh_expiration'],
    }
    
    return Response(response_data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Authentication'],
    summary='User Logout',
    description='Logout user and blacklist refresh token to prevent reuse.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'refresh': {'type': 'string', 'description': 'Refresh token to blacklist'}
            },
            'required': ['refresh']
        }
    },
    responses={
        200: OpenApiResponse(
            description='Logout successful',
            examples=[OpenApiExample('Success', value={'message': 'Logout exitoso.'})]
        ),
        400: OpenApiResponse(description='Missing or invalid refresh token'),
        401: OpenApiResponse(description='Not authenticated')
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_protect
def logout_view(request):
    """
    User logout endpoint
    Blacklists the refresh token to prevent reuse
    
    POST /api/auth/logout
    
    Request:
    {
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
    
    Response:
    {
        "message": "Logout exitoso."
    }
    """
    try:
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'error': 'Se requiere el token de actualización.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Blacklist the token
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        # Log logout
        ip_address = get_client_ip(request)
        user_agent = get_user_agent(request)
        
        AuditLog.objects.create(
            user=request.user,
            action='logout',
            ip_address=ip_address,
            user_agent=user_agent,
            details={'method': 'manual'}
        )
        
        return Response(
            {'message': 'Logout exitoso.'},
            status=status.HTTP_200_OK
        )
    
    except TokenError as e:
        return Response(
            {'error': 'Token inválido o ya expirado.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception('Unexpected error during logout for user %s', request.user.id)
        return Response(
            {'error': 'Error al cerrar sesión.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    tags=['Authentication'],
    summary='Refresh Access Token',
    description='Get a new access token using a valid refresh token.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'refresh': {'type': 'string', 'description': 'Valid refresh token'}
            },
            'required': ['refresh']
        }
    },
    responses={
        200: TokenRefreshResponseSerializer,
        400: OpenApiResponse(description='Missing refresh token'),
        401: OpenApiResponse(description='Invalid or expired refresh token'),
        429: OpenApiResponse(description='Rate limit exceeded (10 attempts per minute)')
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def refresh_token_view(request):
    """
    Refresh access token using refresh token
    
    POST /api/auth/refresh
    
    Request:
    {
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
    
    Response:
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "access_expiration": "2024-02-08T17:00:00Z"
    }
    """
    try:
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'error': 'Se requiere el token de actualización.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify and decode the refresh token
        token = RefreshToken(refresh_token)
        
        # Get new access token
        from django.conf import settings
        access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        
        response_data = {
            'access': str(token.access_token),
            'access_expiration': timezone.now() + access_lifetime,
        }
        
        # Log token refresh
        user_id = token.payload.get('user_id')
        if user_id:
            ip_address = get_client_ip(request)
            user_agent = get_user_agent(request)
            
            AuditLog.objects.create(
                user_id=user_id,
                action='token_refresh',
                ip_address=ip_address,
                user_agent=user_agent,
                details={'method': 'refresh_token'}
            )
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except TokenError as e:
        return Response(
            {'error': 'Token de actualización inválido o expirado.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        logger.exception('Unexpected error during token refresh')
        return Response(
            {'error': 'Error al actualizar el token.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    tags=['Authentication'],
    summary='Get Current User',
    description='Retrieve information about the currently authenticated user.',
    responses={
        200: UserSerializer,
        401: OpenApiResponse(description='Not authenticated or invalid token')
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get current authenticated user information
    
    GET /api/auth/me
    
    Response:
    {
        "id": 1,
        "email": "user@example.com",
        "username": "username",
        "first_name": "John",
        "last_name": "Doe",
        "profile": {
            "role": "doctor",
            "phone": "+1234567890",
            "branch_name": "Main Branch",
            "branch_code": "MB01"
        }
    }
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Authentication'],
    summary='Change Password',
    description='Change the password for the currently authenticated user.',
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiResponse(
            description='Password changed successfully',
            examples=[OpenApiExample('Success', value={'message': 'Contraseña cambiada exitosamente.'})]
        ),
        400: OpenApiResponse(description='Validation error (incorrect old password, passwords don\'t match, etc.)'),
        401: OpenApiResponse(description='Not authenticated')
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='5/m', method='POST', block=True)
@csrf_protect
def change_password_view(request):
    """
    Change user password
    
    POST /api/auth/change-password
    
    Request:
    {
        "old_password": "oldpass123",
        "new_password": "newpass123",
        "confirm_password": "newpass123"
    }
    
    Response:
    {
        "message": "Contraseña cambiada exitosamente."
    }
    """
    serializer = ChangePasswordSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Save new password
    serializer.save()
    
    # Log password change
    ip_address = get_client_ip(request)
    user_agent = get_user_agent(request)
    
    AuditLog.objects.create(
        user=request.user,
        action='password_change',
        ip_address=ip_address,
        user_agent=user_agent,
        details={'method': 'manual'}
    )
    
    return Response(
        {'message': 'Contraseña cambiada exitosamente.'},
        status=status.HTTP_200_OK
    )


@extend_schema(
    tags=['Authentication'],
    summary='Get User Permissions',
    description='Retrieve the role and list of permissions for the currently authenticated user.',
    responses={
        200: UserPermissionsSerializer,
        401: OpenApiResponse(description='Not authenticated'),
        500: OpenApiResponse(description='Error retrieving permissions')
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions_view(request):
    """
    Get current user's permissions
    
    GET /api/auth/permissions
    
    Response:
    {
        "role": "doctor",
        "permissions": ["orders.create", "orders.view", "patients.create"],
        "is_superadmin": false
    }
    """
    user = request.user
    
    try:
        profile = user.profile
        role = profile.role
        is_superadmin = role == 'superadmin'
        
        if is_superadmin:
            from .models import Permission
            from django.core.cache import cache
            cache_key = 'all_permission_codes'
            permission_codes = cache.get(cache_key)
            if permission_codes is None:
                permission_codes = list(
                    Permission.objects.values_list('code', flat=True)
                )
                cache.set(cache_key, permission_codes, PERM_CACHE_TTL)
        else:
            from .models import RolePermission
            from django.core.cache import cache
            cache_key = f'role_permissions_{role}'
            permission_codes = cache.get(cache_key)
            if permission_codes is None:
                permission_codes = list(
                    RolePermission.objects.filter(role=role)
                    .select_related('permission')
                    .values_list('permission__code', flat=True)
                )
                cache.set(cache_key, permission_codes, PERM_CACHE_TTL)
        
        data = {
            'role': role,
            'permissions': permission_codes,
            'is_superadmin': is_superadmin
        }
        
        serializer = UserPermissionsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.exception('Error fetching permissions for user %s', user.id)
        return Response(
            {'error': 'Error al obtener permisos del usuario.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
