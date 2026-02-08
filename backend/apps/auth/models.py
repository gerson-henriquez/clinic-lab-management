"""
Authentication Models
====================

Custom User model and authentication-related models for the Clinical Lab Management System.

Security Features:
- Custom User model with email as username
- Argon2 password hashing
- Account lockout after failed attempts
- Audit logging for all auth events
- Fine-grained permission system

Models:
- User: Custom user with enhanced security
- UserProfile: Extended user info with role and branch
- Permission: Granular permission codes
- RolePermission: Maps roles to permissions
- AuditLog: Comprehensive audit trail
"""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from datetime import timedelta


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with email and password."""
        if not email:
            raise ValueError('El email es obligatorio')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model with email as primary identifier.
    
    Security Features:
    - Email as username (unique identifier)
    - Failed login attempt tracking
    - Account lockout mechanism
    - IP address logging
    - Timezone-aware timestamps
    
    Fields:
    - email: Primary login identifier (unique)
    - username: Display name (unique, can be different from email)
    - is_active: Account active status
    - failed_login_attempts: Counter for failed logins
    - locked_until: Account lockout timestamp
    - last_login_ip: Last successful login IP
    - last_failed_login_ip: Last failed login attempt IP
    - password_changed_at: Last password change timestamp
    """
    
    # Override email to make it unique and required
    email = models.EmailField(
        'email address',
        unique=True,
        max_length=255,
        error_messages={
            'unique': 'Ya existe un usuario con este email.',
        }
    )
    
    # Username is now optional (display name)
    username = models.CharField(
        'nombre de usuario',
        max_length=150,
        unique=True,
        validators=[MinLengthValidator(3)],
        help_text='Nombre para mostrar. Debe ser único.',
        error_messages={
            'unique': 'Ya existe un usuario con este nombre.',
        }
    )
    
    # Security fields
    failed_login_attempts = models.IntegerField(
        'intentos fallidos',
        default=0,
        help_text='Número de intentos de login fallidos consecutivos'
    )
    
    locked_until = models.DateTimeField(
        'bloqueado hasta',
        null=True,
        blank=True,
        help_text='Cuenta bloqueada hasta esta fecha/hora'
    )
    
    last_login_ip = models.GenericIPAddressField(
        'última IP de login',
        null=True,
        blank=True,
        help_text='Dirección IP del último login exitoso'
    )
    
    last_failed_login_ip = models.GenericIPAddressField(
        'última IP de intento fallido',
        null=True,
        blank=True
    )
    
    password_changed_at = models.DateTimeField(
        'contraseña cambiada en',
        null=True,
        blank=True,
        help_text='Fecha del último cambio de contraseña'
    )
    
    # Timestamps
    created_at = models.DateTimeField('creado en', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado en', auto_now=True)
    
    # Use email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Required when creating superuser
    
    objects = UserManager()
    
    class Meta:
        db_table = 'users'
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
            models.Index(fields=['locked_until']),
        ]
    
    def __str__(self):
        return f'{self.email} ({self.username})'
    
    def is_account_locked(self):
        """Check if account is currently locked."""
        if self.locked_until is None:
            return False
        return timezone.now() < self.locked_until
    
    def lock_account(self, duration_minutes=30):
        """Lock account for specified duration."""
        self.locked_until = timezone.now() + timedelta(minutes=duration_minutes)
        self.save(update_fields=['locked_until'])
    
    def unlock_account(self):
        """Unlock account and reset failed attempts."""
        self.locked_until = None
        self.failed_login_attempts = 0
        self.save(update_fields=['locked_until', 'failed_login_attempts'])
    
    def record_failed_login(self, ip_address=None):
        """Record a failed login attempt and increment counter."""
        self.failed_login_attempts += 1
        if ip_address:
            self.last_failed_login_ip = ip_address
        
        # Lock account after 5 failed attempts
        if self.failed_login_attempts >= 5:
            self.lock_account(duration_minutes=15)
        
        save_fields = ['failed_login_attempts']
        if ip_address:
            save_fields.append('last_failed_login_ip')
        if self.locked_until:
            save_fields.append('locked_until')
        
        self.save(update_fields=save_fields)
    
    def reset_failed_login_attempts(self):
        """Reset failed login counter on successful login."""
        self.failed_login_attempts = 0
        self.save(update_fields=['failed_login_attempts'])
    
    def record_password_change(self):
        """Record timestamp of password change."""
        self.password_changed_at = timezone.now()
        self.save(update_fields=['password_changed_at'])


class UserProfile(models.Model):
    """
    Extended user profile with role, branch, and additional information.
    
    Roles:
    - superadmin: Full system access, no branch restriction
    - doctor: Create patients, orders, view results
    - lab_technician: Process orders, submit results
    - finance_user: View financial data
    - manager: Manage branch and users
    
    Fields:
    - user: OneToOne relationship with User
    - role: User's role (determines permissions)
    - branch: Associated branch (null for superadmin)
    - phone: Contact phone number
    - avatar: Profile picture URL (optional)
    """
    
    ROLE_CHOICES = [
        ('superadmin', 'Super Administrador'),
        ('doctor', 'Doctor'),
        ('lab_technician', 'Técnico de Laboratorio'),
        ('finance_user', 'Usuario Financiero'),
        ('manager', 'Gerente'),
    ]
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='usuario'
    )
    
    role = models.CharField(
        'rol',
        max_length=20,
        choices=ROLE_CHOICES,
        help_text='Rol del usuario que determina sus permisos'
    )
    
    branch = models.ForeignKey(
        'branches.Branch',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        verbose_name='sucursal',
        help_text='Sucursal asignada (null para superadmin)'
    )
    
    phone = models.CharField(
        'teléfono',
        max_length=20,
        blank=True,
        help_text='Número de teléfono de contacto'
    )
    
    avatar = models.URLField(
        'avatar',
        max_length=500,
        blank=True,
        help_text='URL de la imagen de perfil'
    )
    
    # Timestamps
    created_at = models.DateTimeField('creado en', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado en', auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'perfil de usuario'
        verbose_name_plural = 'perfiles de usuario'
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['branch']),
        ]
    
    def __str__(self):
        return f'{self.user.username} - {self.get_role_display()}'
    
    def get_permissions(self):
        """Get all permissions for this user's role."""
        return Permission.objects.filter(
            rolepermission__role=self.role
        ).distinct()
    
    def has_permission(self, permission_code):
        """Check if user has specific permission."""
        return self.get_permissions().filter(code=permission_code).exists()


class Permission(models.Model):
    """
    Granular permission codes for RBAC system.
    
    Permission codes follow pattern: module.action
    Examples:
    - orders.create
    - patients.view
    - financial.view_reports
    
    Fields:
    - code: Unique permission identifier (e.g., 'orders.create')
    - name: Human-readable name
    - description: Detailed description
    - module: Module/feature this permission belongs to
    """
    
    code = models.CharField(
        'código',
        max_length=100,
        unique=True,
        help_text='Código único de permiso (ej: orders.create)'
    )
    
    name = models.CharField(
        'nombre',
        max_length=200,
        help_text='Nombre legible del permiso'
    )
    
    description = models.TextField(
        'descripción',
        blank=True,
        help_text='Descripción detallada del permiso'
    )
    
    module = models.CharField(
        'módulo',
        max_length=50,
        help_text='Módulo al que pertenece (orders, patients, billing, etc.)'
    )
    
    created_at = models.DateTimeField('creado en', auto_now_add=True)
    
    class Meta:
        db_table = 'permissions'
        verbose_name = 'permiso'
        verbose_name_plural = 'permisos'
        ordering = ['module', 'code']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['module']),
        ]
    
    def __str__(self):
        return f'{self.code} - {self.name}'


class RolePermission(models.Model):
    """
    Maps roles to permissions.
    
    This table defines which permissions each role has.
    Managed by management commands and admin interface.
    
    Fields:
    - role: User role (from UserProfile.ROLE_CHOICES)
    - permission: Permission granted to this role
    """
    
    ROLE_CHOICES = UserProfile.ROLE_CHOICES
    
    role = models.CharField(
        'rol',
        max_length=20,
        choices=ROLE_CHOICES
    )
    
    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE,
        verbose_name='permiso'
    )
    
    created_at = models.DateTimeField('creado en', auto_now_add=True)
    
    class Meta:
        db_table = 'role_permissions'
        verbose_name = 'permiso de rol'
        verbose_name_plural = 'permisos de roles'
        unique_together = ('role', 'permission')
        indexes = [
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return f'{self.get_role_display()} -> {self.permission.code}'


class AuditLog(models.Model):
    """
    Comprehensive audit logging for security and compliance.
    
    Logs all authentication events and security-related actions:
    - Login attempts (success/failure)
    - Logout events
    - Password changes
    - Account lockouts
    - Permission denied events
    
    Fields:
    - user: User who performed the action (null for failed logins)
    - action: Type of action performed
    - ip_address: IP address of the request
    - user_agent: Browser/client information
    - details: Additional context (JSON)
    - created_at: Timestamp of the event
    """
    
    ACTION_TYPES = [
        ('login', 'Login Exitoso'),
        ('logout', 'Logout'),
        ('login_failed', 'Intento de Login Fallido'),
        ('password_change', 'Cambio de Contraseña'),
        ('password_reset', 'Reseteo de Contraseña'),
        ('account_locked', 'Cuenta Bloqueada'),
        ('account_unlocked', 'Cuenta Desbloqueada'),
        ('permission_denied', 'Permiso Denegado'),
        ('token_refresh', 'Token Renovado'),
        ('token_blacklist', 'Token Revocado'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
        verbose_name='usuario',
        help_text='Usuario que realizó la acción (null para intentos fallidos)'
    )
    
    action = models.CharField(
        'acción',
        max_length=50,
        choices=ACTION_TYPES
    )
    
    ip_address = models.GenericIPAddressField(
        'dirección IP',
        help_text='IP desde donde se realizó la acción'
    )
    
    user_agent = models.TextField(
        'user agent',
        help_text='Información del navegador/cliente'
    )
    
    details = models.JSONField(
        'detalles',
        default=dict,
        blank=True,
        help_text='Información adicional en formato JSON'
    )
    
    created_at = models.DateTimeField('creado en', auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'registro de auditoría'
        verbose_name_plural = 'registros de auditoría'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action', '-created_at']),
            models.Index(fields=['ip_address', '-created_at']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        user_str = self.user.email if self.user else 'Desconocido'
        return f'{self.get_action_display()} - {user_str} - {self.created_at}'
    
    @classmethod
    def log_action(cls, action, user=None, ip_address=None, user_agent=None, **details):
        """
        Convenience method to create audit log entries.
        
        Usage:
            AuditLog.log_action(
                action='login',
                user=user,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT'),
                branch=user.profile.branch.name if user.profile.branch else None
            )
        """
        return cls.objects.create(
            action=action,
            user=user,
            ip_address=ip_address or '0.0.0.0',
            user_agent=user_agent or 'Unknown',
            details=details
        )
