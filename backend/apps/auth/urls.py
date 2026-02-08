"""
Authentication URL Configuration
Maps endpoints to views
"""
from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('refresh', views.refresh_token_view, name='refresh'),
    path('me', views.current_user_view, name='me'),
    path('change-password', views.change_password_view, name='change-password'),
    path('permissions', views.user_permissions_view, name='permissions'),
]
