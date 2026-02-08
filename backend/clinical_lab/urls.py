"""
URL configuration for clinical_lab project.

This is the main URL router for the entire application.
It includes URL patterns from all app modules.

For development teams new to Django:
- Each app has its own urls.py that is included here
- API endpoints follow RESTful conventions
- Admin interface is available at /admin/
- All API routes are prefixed with /api/
- API documentation available at /api/docs/

URL Structure:
    /api/auth/          - Authentication (login, logout, profile)
    /api/patients/      - Patient management
    /api/exams/         - Exam orders and types
    /api/reports/       - Exam results and reporting
    /api/search/        - Search functionality
    /api/billing/       - Invoices and payments
    /api/finance/       - Financial reports
    /api/branches/      - Branch management
    /admin/             - Django admin interface
    /api/docs/          - Swagger UI (interactive API documentation)
    /api/redoc/         - ReDoc (alternative API documentation)
    /api/schema/        - OpenAPI schema (JSON)
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API endpoints - all apps will be added here as we build them
    path('api/auth/', include('apps.auth.urls', namespace='authentication')),
    # path('api/patients/', include('apps.patients.urls')),
    # path('api/exams/', include('apps.exams.urls')),
    # path('api/reports/', include('apps.reports.urls')),
    # path('api/search/', include('apps.search.urls')),
    # path('api/billing/', include('apps.billing.urls')),
    # path('api/finance/', include('apps.finance.urls')),
    # path('api/branches/', include('apps.branches.urls')),
]

# Serve media files in development
# In production, Nginx will handle static/media file serving
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
