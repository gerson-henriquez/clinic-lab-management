"""
Custom Permission Classes for Role-Based Access Control (RBAC)
Provides granular permission checking for API endpoints
"""
import logging

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from .models import RolePermission, AuditLog

logger = logging.getLogger(__name__)


class HasPermission(permissions.BasePermission):
    """
    Custom permission class that checks if user has specific permission code

    Usage in views:
        permission_classes = [HasPermission]
        required_permission = 'orders.create'
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        required_permission = getattr(view, 'required_permission', None)
        if not required_permission:
            return True

        return user_has_permission(request.user, required_permission)


class IsSuperAdmin(permissions.BasePermission):
    """Permission class that only allows superadmin role"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role == 'superadmin'
        except AttributeError:
            logger.warning('User %s has no profile', request.user.id)
            return False


class IsDoctor(permissions.BasePermission):
    """Permission class that allows doctor or superadmin role"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role in ('doctor', 'superadmin')
        except AttributeError:
            logger.warning('User %s has no profile', request.user.id)
            return False


class IsLabTechnician(permissions.BasePermission):
    """Permission class that allows lab technician or superadmin role"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role in ('lab_technician', 'superadmin')
        except AttributeError:
            logger.warning('User %s has no profile', request.user.id)
            return False


class IsFinanceUser(permissions.BasePermission):
    """Permission class that allows finance user or superadmin role"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role in ('finance_user', 'superadmin')
        except AttributeError:
            logger.warning('User %s has no profile', request.user.id)
            return False


class IsManager(permissions.BasePermission):
    """Permission class that allows manager or superadmin role"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role in ('manager', 'superadmin')
        except AttributeError:
            logger.warning('User %s has no profile', request.user.id)
            return False


class BelongsToSameBranch(permissions.BasePermission):
    """
    Object-level permission: checks if the object belongs to the user's branch.
    Superadmin can access all branches.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            user_profile = request.user.profile
            if user_profile.role == 'superadmin':
                return True
            if hasattr(obj, 'branch'):
                return obj.branch == user_profile.branch
            return True
        except AttributeError:
            logger.warning('User %s has no profile', request.user.id)
            return False


# ── Utility functions ──────────────────────────────────────────


def user_has_permission(user, permission_code):
    """
    Check if user has specific permission.

    Args:
        user: User instance
        permission_code: Permission code string (e.g., 'orders.create')

    Returns:
        True if user has permission, False otherwise
    """
    try:
        role = user.profile.role
        if role == 'superadmin':
            return True
        return RolePermission.objects.filter(
            role=role,
            permission__code=permission_code,
        ).select_related('permission').exists()
    except AttributeError:
        logger.warning('User %s has no profile for permission check', user.id)
        return False


def check_permission_with_audit(user, permission_code, request, details=None):
    """
    Check permission and log denial via AuditLog.

    Raises:
        PermissionDenied: If user doesn't have permission
    """
    if user_has_permission(user, permission_code):
        return True

    from .views import get_client_ip, get_user_agent

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
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        details=audit_details,
    )

    raise PermissionDenied(
        f'No tienes permiso para realizar esta acción. Permiso requerido: {permission_code}'
    )
