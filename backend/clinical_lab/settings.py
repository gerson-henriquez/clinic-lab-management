"""
Django settings for clinical_lab project.

This configuration file manages all Django settings for the Clinical Laboratory
Management Application. It uses environment variables for security and flexibility.

For development teams new to Django:
- Environment variables are loaded from .env file (not committed to git)
- Different settings for development vs production
- All sensitive data (passwords, keys) stored in environment variables
"""

from pathlib import Path
import environ
import os

# Initialize environment variables
env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Read .env file if it exists
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY', default='django-insecure-dev-key-change-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

# Allowed hosts for the application
# In development: localhost, 127.0.0.1
# In production: your domain name
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])


# Application definition
# 
# INSTALLED_APPS: List of all Django applications used in the project
# - Django built-in apps (admin, auth, sessions, etc.)
# - Third-party packages (rest_framework, corsheaders)
# - Our custom apps (located in apps/ folder)

INSTALLED_APPS = [
    # Django built-in apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',  # Django REST Framework for API
    'corsheaders',     # CORS headers for frontend communication
    'django_filters',  # Advanced filtering for API endpoints
    
    # Our custom apps (all clinical lab modules)
    'apps.auth',            # User authentication & RBAC
    'apps.patients',        # Patient management & clinical records
    'apps.exams',           # Exam orders & types
    'apps.reports',         # Exam results & reporting
    'apps.search',          # Search & history functionality
    'apps.pdf_generator',   # PDF generation for reports
    'apps.billing',         # Invoices & payments
    'apps.finance',         # Financial reports & analytics
    'apps.branches',        # Multi-branch management
    'apps.common',          # Shared utilities & audit logs
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS must be before CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Custom middleware for audit logging (to be implemented)
    # 'apps.common.middleware.AuditLogMiddleware',
]

ROOT_URLCONF = 'clinical_lab.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'clinical_lab.wsgi.application'


# Database Configuration
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
#
# PostgreSQL is used for production-grade features:
# - ACID compliance for financial transactions
# - Full-text search capabilities
# - JSON field support for flexible data storage
# - Better performance at scale
#
# Configuration is loaded from environment variables for security

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DATABASE_NAME', default='clinical_lab_db'),
        'USER': env('DATABASE_USER', default='postgres'),
        'PASSWORD': env('DATABASE_PASSWORD', default='postgres'),
        'HOST': env('DATABASE_HOST', default='db'),  # 'db' is Docker service name
        'PORT': env('DATABASE_PORT', default='5432'),
        'CONN_MAX_AGE': 600,  # Keep connections alive for 10 minutes
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

# Timezone: Adjust to your lab's timezone
# Common options: 'America/New_York', 'America/Los_Angeles', 'UTC'
TIME_ZONE = 'UTC'

USE_I18N = True

# USE_TZ=True ensures all datetimes are stored as UTC in database
# This prevents timezone-related bugs in multi-branch scenarios
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (User-uploaded content: PDFs, documents)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ==============================================================================
# REST FRAMEWORK CONFIGURATION
# ==============================================================================
#
# Django REST Framework settings for API behavior
# - Authentication: Session-based (cookies) for web app
# - Permissions: Custom RBAC permissions per endpoint
# - Pagination: 25 items per page by default
# - Filtering: django-filter integration for advanced queries

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}


# ==============================================================================
# CORS CONFIGURATION
# ==============================================================================
#
# Cross-Origin Resource Sharing (CORS) settings
# Allows frontend (Next.js on port 3000) to communicate with backend API
#
# In production: Only allow your actual domain

CORS_ALLOWED_ORIGINS = env.list(
    'CORS_ALLOWED_ORIGINS',
    default=[
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]
)

CORS_ALLOW_CREDENTIALS = True  # Allow cookies to be sent cross-origin


# ==============================================================================
# SESSION CONFIGURATION
# ==============================================================================
#
# Session settings for user authentication
# - Uses Redis for session storage (fast, scalable)
# - Sessions expire after 24 hours of inactivity
# - HTTP-only cookies prevent XSS attacks

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

SESSION_COOKIE_SECURE = env.bool('SESSION_COOKIE_SECURE', default=False)  # True in production (HTTPS)
SESSION_COOKIE_HTTPONLY = env.bool('SESSION_COOKIE_HTTPONLY', default=True)  # Prevent JavaScript access
SESSION_COOKIE_SAMESITE = env('SESSION_COOKIE_SAMESITE', default='Lax')  # CSRF protection
SESSION_COOKIE_AGE = env.int('SESSION_COOKIE_AGE', default=86400)  # 24 hours


# ==============================================================================
# CACHE CONFIGURATION (Redis)
# ==============================================================================
#
# Redis cache configuration for:
# - Session storage (fast user sessions)
# - Query caching (reduce database load)
# - Temporary data storage

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://{env('REDIS_HOST', default='redis')}:{env('REDIS_PORT', default='6379')}/{env('REDIS_DB', default='0')}",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PASSWORD': env('REDIS_PASSWORD', default=''),
        },
        'KEY_PREFIX': 'clinical_lab',
        'TIMEOUT': 300,  # 5 minutes default timeout
    }
}


# ==============================================================================
# SECURITY SETTINGS
# ==============================================================================
#
# Security hardening for production
# Most are disabled in development for easier debugging

if not DEBUG:
    # HTTPS/SSL
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    # Cookie security
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # HSTS (HTTP Strict Transport Security)
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Content Security
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'


# ==============================================================================
# LOGGING CONFIGURATION
# ==============================================================================
#
# Logging configuration for debugging and monitoring
# - Console output in development
# - File logging in production
# - Error tracking with Sentry (production)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}


# ==============================================================================
# GOOGLE CLOUD STORAGE (Optional - for production)
# ==============================================================================
#
# Configuration for storing PDFs and media files in Google Cloud Storage
# Uncomment and configure when deploying to production

# if not DEBUG:
#     DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
#     GS_BUCKET_NAME = env('GCP_STORAGE_BUCKET')
#     GS_PROJECT_ID = env('GCP_PROJECT_ID')
#     GS_AUTO_CREATE_BUCKET = False
#     GS_DEFAULT_ACL = 'private'
#     GS_FILE_OVERWRITE = False
