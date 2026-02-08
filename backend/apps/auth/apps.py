from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    """Configuration for the authentication app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.auth'
    label = 'authentication'  # Avoid conflict with Django's built-in 'auth'
    verbose_name = 'Authentication & RBAC'
