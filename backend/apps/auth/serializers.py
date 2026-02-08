"""
Serializers for Authentication & User Management
Handles data validation and transformation for auth endpoints
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProfile, Permission, RolePermission


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile information"""
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    branch_code = serializers.CharField(source='branch.code', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'role',
            'phone',
            'avatar',
            'branch',
            'branch_name',
            'branch_code',
        ]
        read_only_fields = ['role', 'branch']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'is_active',
            'date_joined',
            'last_login',
            'profile',
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    remember_me = serializers.BooleanField(default=False)

    def validate(self, attrs):
        """
        Validate user credentials and check account status
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError(
                'Debe proporcionar email y contraseña.',
                code='required'
            )

        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                'Email o contraseña incorrectos.',
                code='invalid_credentials'
            )

        # Check if account is locked
        if user.is_account_locked():
            raise serializers.ValidationError(
                'Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente más tarde.',
                code='account_locked'
            )

        # Check if account is active
        if not user.is_active:
            raise serializers.ValidationError(
                'Esta cuenta ha sido desactivada. Contacte al administrador.',
                code='account_disabled'
            )

        # Authenticate user
        user = authenticate(
            request=self.context.get('request'),
            username=email,  # We use email as username
            password=password
        )

        if not user:
            # Get user again to increment failed attempts
            try:
                user = User.objects.get(email=email)
                user.record_failed_login(
                    ip_address=self.context.get('ip_address')
                )
            except User.DoesNotExist:
                pass
            
            raise serializers.ValidationError(
                'Email o contraseña incorrectos.',
                code='invalid_credentials'
            )

        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate_old_password(self, value):
        """Validate that old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                'La contraseña actual es incorrecta.',
                code='invalid_password'
            )
        return value

    def validate_new_password(self, value):
        """Validate new password meets security requirements"""
        user = self.context['request'].user
        try:
            validate_password(value, user=user)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        """Validate that passwords match and are different"""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Las contraseñas no coinciden.'},
                code='password_mismatch'
            )
        
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError(
                {'new_password': 'La nueva contraseña debe ser diferente a la actual.'},
                code='password_same'
            )
        
        return attrs

    def save(self):
        """Change user password"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.record_password_change()
        user.save()
        return user


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer for permissions"""
    class Meta:
        model = Permission
        fields = ['code', 'name', 'description', 'module']


class UserPermissionsSerializer(serializers.Serializer):
    """Serializer for user permissions response"""
    role = serializers.CharField()
    permissions = serializers.ListField(child=serializers.CharField())
    is_superadmin = serializers.BooleanField()


class TokenRefreshResponseSerializer(serializers.Serializer):
    """Serializer for token refresh response"""
    access = serializers.CharField()
    access_expiration = serializers.DateTimeField()


class LoginResponseSerializer(serializers.Serializer):
    """Serializer for login response"""
    user = UserSerializer()
    access = serializers.CharField()
    refresh = serializers.CharField()
    access_expiration = serializers.DateTimeField()
    refresh_expiration = serializers.DateTimeField()
