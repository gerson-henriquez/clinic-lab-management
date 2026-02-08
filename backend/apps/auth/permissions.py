"""
Custom Permission Classes for Role-Based Access Control (RBAC)
Provides granular permission checking for API endpoints
"""
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from .models import RolePermission, AuditLog


class HasPermission(permissions.BasePermission):
    """
    Custom permission class that checks if user has specific permission code
    
    Usage in views:
        permission_classes = [HasPermission]
        required_permission = 'orders.create'
    """
    
    def has_permission(self, request, view):
        """Check if user has required permission"""
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Get required permission from view
        required_permission = getattr(view, 'required_permission', None)
        
        if not required_permission:
            # No specific permission required
            return True
        
        # Check if user has permission
        return user_has_permission(request.user, required_permission)


class IsSuperAdmin(permissions.BasePermission):
    """
    Permission class that only allows superadmin role
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.role == 'superadmin'
        except:
            return False


class IsDoctor(permissions.BasePermission):
    """
    Permission class that only allows doctor role
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.role in ['doctor', 'superadmin']
        except:
            return False


class IsLabTechnician(permissions.BasePermission):
    """
    Permission class that only allows lab technician role
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.role in ['lab_technician', 'superadmin']
        except:
            return False


class IsFinanceUser(permissions.BasePermission):
    """
    Permission class that only allows finance user role
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.role in ['finance_user', 'superadmin']
        except:
            return False


class IsManager(permissions.BasePermission):
    """
    Permission class that only allows manager role
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.role in ['manager', 'superadmin']
        except:
            return False


class BelongsToSameBranch(permissions.BasePermission):
    """
    Permission class that checks if the object belongs to user's branch
    Used for object-level permissions
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_profile = request.user.profile
            
            # Superadmin can access all branches
            if user_profile.role == 'superadmin':
                return True
            
            # Check if object has branch attribute
            if hasattr(obj, 'branch'):
                return obj.branch == user_profile.branch
            
            # If no branch attribute, allow access
            return True
        except:
            return False


# Utility functions

def user_has_permission(user, permission_code):
    """
    Check if user has specific permission
    
    Args:
        user: User instance
        permission_code: Permission code string (e.g., 'orders.create')
    
    Returns:
        bool: True if user has permission, False otherwise
    """
    try:
        profile = user.profile
        role = profile.role
        
        # Superadmin has all permissions
        if role == 'superadmin':
            return True
        
        # Check if role has the permission
        has_perm = RolePermission.objects.filter(
            role=role,
            permission__code=permission_code
        ).exists()
        
        return has_perm
    except:
        return False


def get_user_permissions(user):
    """
    Get all permission codes for a user
    
    Args:
        user: User instance
    
    Returns:
        list: List of permission code strings
    """
    try:
        profile = user.profile
        role = profile.role
        
        # Superadmin has all permissions
        if role == 'superadmin':
            from .models import Permission
            return list(Permission.objects.values_list('code', flat=True))
        
        # Get role permissions
        return list(
            RolePermission.objects.filter(role=role)
            .values_list('permission__code', flat=True)
        )
    except:
        return []


def check_permission_with_audit(user, permission_code, request, details=None):
    """
    Check permission and log denial if access is denied
    
    Args:
        user: User instance
        permission_code: Permission code string
        request: Django request object
        details: Additional details to log
    
    Returns:
        bool: True if user has permission, False otherwise
    
    Raises:
        PermissionDenied: If user doesn't have permission
    """
    has_perm = user_has_permission(user, permission_code)
    
    if not has_perm:
        # Log permission denial
        from .views import get_client_ip, get_user_agent
        
        ip_address = get_client_ip(request)
        user_agent = get_user_agent(request)
        
        audit_details = {
            'permission_code': permission_code,
            'path': request.path,
            'method': request.method,
        }
        
        if details:
            audit_details.update(details)
        
        AuditLog.objects.create(
            user=user,
            action='permission_denied',
            ip_address=ip_address,
            user_agent=user_agent,
            details=audit_details
        )
        
        raise PermissionDenied(
            f'No tienes permiso para realizar esta acción. Permiso requerido: {permission_code}'
        )
    
    return True
