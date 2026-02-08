"""
Django Admin Configuration for Authentication Models
Provides user-friendly interface for managing users, profiles, permissions, and audit logs
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile, Permission, RolePermission, AuditLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User admin with security fields"""
    
    list_display = [
        'email',
        'username',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'get_role',
        'failed_login_attempts',
        'is_locked_display',
        'last_login',
    ]
    
    list_filter = [
        'is_active',
        'is_staff',
        'is_superuser',
        'profile__role',
        'date_joined',
    ]
    
    search_fields = [
        'email',
        'username',
        'first_name',
        'last_name',
    ]
    
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {
            'fields': ('email', 'username', 'password')
        }),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Security'), {
            'fields': (
                'failed_login_attempts',
                'locked_until',
                'last_login_ip',
                'last_failed_login_ip',
                'password_changed_at',
            ),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = [
        'date_joined',
        'last_login',
        'failed_login_attempts',
        'locked_until',
        'last_login_ip',
        'last_failed_login_ip',
        'password_changed_at',
    ]
    
    def get_role(self, obj):
        """Get user role from profile"""
        try:
            return obj.profile.role
        except:
            return '-'
    get_role.short_description = 'Role'
    
    def is_locked_display(self, obj):
        """Display lock status with color"""
        if obj.is_account_locked():
            return format_html(
                '<span style="color: red; font-weight: bold;">🔒 Locked</span>'
            )
        return format_html(
            '<span style="color: green;">✓ Active</span>'
        )
    is_locked_display.short_description = 'Lock Status'
    
    actions = ['unlock_accounts', 'lock_accounts', 'reset_failed_attempts']
    
    def unlock_accounts(self, request, queryset):
        """Unlock selected user accounts"""
        count = 0
        for user in queryset:
            if user.is_account_locked():
                user.unlock_account()
                count += 1
        self.message_user(request, f'{count} accounts unlocked successfully.')
    unlock_accounts.short_description = 'Unlock selected accounts'
    
    def lock_accounts(self, request, queryset):
        """Lock selected user accounts"""
        count = 0
        for user in queryset:
            if not user.is_account_locked():
                user.lock_account(duration_minutes=60)
                count += 1
        self.message_user(request, f'{count} accounts locked for 1 hour.')
    lock_accounts.short_description = 'Lock selected accounts (1 hour)'
    
    def reset_failed_attempts(self, request, queryset):
        """Reset failed login attempts"""
        count = queryset.update(failed_login_attempts=0)
        self.message_user(request, f'Reset failed attempts for {count} accounts.')
    reset_failed_attempts.short_description = 'Reset failed login attempts'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin for user profiles"""
    
    list_display = [
        'user_email',
        'user_username',
        'role',
        'branch',
        'phone',
        'created_at',
    ]
    
    list_filter = ['role', 'branch', 'created_at']
    
    search_fields = [
        'user__email',
        'user__username',
        'user__first_name',
        'user__last_name',
        'phone',
    ]
    
    ordering = ['-created_at']
    
    raw_id_fields = ['user', 'branch']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'role', 'branch')
        }),
        (_('Contact'), {
            'fields': ('phone', 'avatar')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'
    user_email.admin_order_field = 'user__email'
    
    def user_username(self, obj):
        return obj.user.username
    user_username.short_description = 'Username'
    user_username.admin_order_field = 'user__username'


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    """Admin for permissions"""
    
    list_display = [
        'code',
        'name',
        'module',
        'get_role_count',
        'created_at',
    ]
    
    list_filter = ['module', 'created_at']
    
    search_fields = ['code', 'name', 'description']
    
    ordering = ['module', 'code']
    
    fieldsets = (
        (None, {
            'fields': ('code', 'name', 'module')
        }),
        (_('Details'), {
            'fields': ('description',)
        }),
        (_('Metadata'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']
    
    def get_role_count(self, obj):
        """Count how many roles have this permission"""
        return obj.rolepermission_set.count()
    get_role_count.short_description = 'Roles'


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    """Admin for role-permission mappings"""
    
    list_display = [
        'role',
        'permission_code',
        'permission_name',
        'permission_module',
        'created_at',
    ]
    
    list_filter = ['role', 'permission__module', 'created_at']
    
    search_fields = [
        'permission__code',
        'permission__name',
        'permission__description',
    ]
    
    ordering = ['role', 'permission__module', 'permission__code']
    
    raw_id_fields = ['permission']
    
    def permission_code(self, obj):
        return obj.permission.code
    permission_code.short_description = 'Permission Code'
    permission_code.admin_order_field = 'permission__code'
    
    def permission_name(self, obj):
        return obj.permission.name
    permission_name.short_description = 'Permission Name'
    permission_name.admin_order_field = 'permission__name'
    
    def permission_module(self, obj):
        return obj.permission.module
    permission_module.short_description = 'Module'
    permission_module.admin_order_field = 'permission__module'


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin for audit logs"""
    
    list_display = [
        'created_at',
        'user',
        'action',
        'ip_address',
        'get_details_preview',
    ]
    
    list_filter = [
        'action',
        'created_at',
    ]
    
    search_fields = [
        'user__email',
        'user__username',
        'ip_address',
        'user_agent',
        'details',
    ]
    
    ordering = ['-created_at']
    
    readonly_fields = [
        'user',
        'action',
        'ip_address',
        'user_agent',
        'details',
        'created_at',
    ]
    
    fieldsets = (
        (None, {
            'fields': ('user', 'action', 'created_at')
        }),
        (_('Request Info'), {
            'fields': ('ip_address', 'user_agent')
        }),
        (_('Details'), {
            'fields': ('details',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        """Prevent manual creation of audit logs"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of audit logs (for compliance)"""
        # Only superusers can delete audit logs
        return request.user.is_superuser
    
    def get_details_preview(self, obj):
        """Show preview of details JSON"""
        if obj.details:
            details_str = str(obj.details)
            if len(details_str) > 50:
                return details_str[:50] + '...'
            return details_str
        return '-'
    get_details_preview.short_description = 'Details Preview'
    
    actions = None  # Disable bulk actions for security


# Customize admin site headers
admin.site.site_header = 'Clinical Lab Management - Admin'
admin.site.site_title = 'Clinical Lab Admin'
admin.site.index_title = 'Administration Panel'
