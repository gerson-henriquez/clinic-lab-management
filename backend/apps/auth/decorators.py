"""
Custom Decorators for RBAC
Provides convenient decorators for function-based views
"""
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .permissions import user_has_permission, check_permission_with_audit


def require_permission(permission_code):
    """
    Decorator to require specific permission for a view
    
    Usage:
        @api_view(['POST'])
        @permission_classes([IsAuthenticated])
        @require_permission('orders.create')
        def create_order(request):
            ...
    
    Args:
        permission_code: Permission code string (e.g., 'orders.create')
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user or not request.user.is_authenticated:
                return Response(
                    {'error': 'Autenticación requerida.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            try:
                check_permission_with_audit(
                    request.user,
                    permission_code,
                    request
                )
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_role(allowed_roles):
    """
    Decorator to require specific role(s) for a view
    
    Usage:
        @api_view(['GET'])
        @require_role(['superadmin', 'manager'])
        def admin_dashboard(request):
            ...
    
    Args:
        allowed_roles: List of allowed role strings or single role string
    """
    if isinstance(allowed_roles, str):
        allowed_roles = [allowed_roles]
    
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user or not request.user.is_authenticated:
                return Response(
                    {'error': 'Autenticación requerida.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            try:
                user_role = request.user.profile.role
                
                if user_role not in allowed_roles:
                    from .models import AuditLog
                    from .views import get_client_ip, get_user_agent
                    
                    # Log unauthorized access attempt
                    AuditLog.objects.create(
                        user=request.user,
                        action='permission_denied',
                        ip_address=get_client_ip(request),
                        user_agent=get_user_agent(request),
                        details={
                            'required_roles': allowed_roles,
                            'user_role': user_role,
                            'path': request.path,
                            'method': request.method,
                        }
                    )
                    
                    return Response(
                        {'error': f'Acceso denegado. Roles permitidos: {", ".join(allowed_roles)}'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except AttributeError:
                return Response(
                    {'error': 'Perfil de usuario no encontrado.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            except Exception as e:
                return Response(
                    {'error': 'Error al verificar permisos.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_superadmin(view_func):
    """
    Decorator to require superadmin role
    
    Usage:
        @api_view(['POST'])
        @require_superadmin
        def create_user(request):
            ...
    """
    return require_role('superadmin')(view_func)


def require_same_branch(view_func):
    """
    Decorator to ensure user can only access data from their own branch
    Superadmins can access all branches
    
    Usage:
        @api_view(['GET'])
        @permission_classes([IsAuthenticated])
        @require_same_branch
        def get_branch_orders(request, branch_id):
            ...
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            user_profile = request.user.profile
            
            # Superadmin can access all branches
            if user_profile.role == 'superadmin':
                return view_func(request, *args, **kwargs)
            
            # Check if branch_id is in kwargs or query params
            target_branch_id = kwargs.get('branch_id')
            if not target_branch_id:
                target_branch_id = request.query_params.get('branch_id')
            
            if target_branch_id:
                if str(user_profile.branch_id) != str(target_branch_id):
                    from .models import AuditLog
                    from .views import get_client_ip, get_user_agent
                    
                    # Log unauthorized access attempt
                    AuditLog.objects.create(
                        user=request.user,
                        action='permission_denied',
                        ip_address=get_client_ip(request),
                        user_agent=get_user_agent(request),
                        details={
                            'reason': 'branch_access_denied',
                            'user_branch': user_profile.branch_id,
                            'requested_branch': target_branch_id,
                            'path': request.path,
                        }
                    )
                    
                    return Response(
                        {'error': 'No tienes acceso a esta sucursal.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
        except AttributeError:
            return Response(
                {'error': 'Perfil de usuario no encontrado.'},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {'error': 'Error al verificar permisos de sucursal.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return view_func(request, *args, **kwargs)
    return wrapper


def audit_action(action_name):
    """
    Decorator to automatically log actions to audit log
    
    Usage:
        @api_view(['POST'])
        @permission_classes([IsAuthenticated])
        @audit_action('order_created')
        def create_order(request):
            ...
    
    Args:
        action_name: Name of the action to log
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Execute the view
            response = view_func(request, *args, **kwargs)
            
            # Log the action (only if successful)
            if response.status_code < 400:
                try:
                    from .models import AuditLog
                    from .views import get_client_ip, get_user_agent
                    
                    AuditLog.objects.create(
                        user=request.user if request.user.is_authenticated else None,
                        action=action_name,
                        ip_address=get_client_ip(request),
                        user_agent=get_user_agent(request),
                        details={
                            'path': request.path,
                            'method': request.method,
                            'status_code': response.status_code,
                        }
                    )
                except:
                    pass  # Don't fail the request if audit logging fails
            
            return response
        return wrapper
    return decorator
