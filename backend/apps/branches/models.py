"""
Branch Models
=============

Branch management models for multi-branch laboratory support.

Models:
- Branch: Laboratory branch/location with contact information
"""

from django.db import models
from django.core.validators import MinLengthValidator


class Branch(models.Model):
    """
    Laboratory branch/location.
    
    Represents a physical laboratory location where exams are processed.
    Users are assigned to branches (except superadmin who can access all).
    
    Fields:
    - name: Branch name
    - code: Unique branch code (for internal reference)
    - address: Physical address
    - phone: Contact phone
    - email: Contact email
    - is_active: Whether branch is currently active
    """
    
    name = models.CharField(
        'nombre',
        max_length=200,
        help_text='Nombre de la sucursal'
    )
    
    code = models.CharField(
        'código',
        max_length=20,
        unique=True,
        validators=[MinLengthValidator(2)],
        help_text='Código único de la sucursal (ej: LAB-01)'
    )
    
    address = models.TextField(
        'dirección',
        help_text='Dirección física de la sucursal'
    )
    
    phone = models.CharField(
        'teléfono',
        max_length=20,
        help_text='Teléfono de contacto'
    )
    
    email = models.EmailField(
        'email',
        help_text='Email de contacto de la sucursal'
    )
    
    is_active = models.BooleanField(
        'activo',
        default=True,
        help_text='Si la sucursal está actualmente operativa'
    )
    
    # Timestamps
    created_at = models.DateTimeField('creado en', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado en', auto_now=True)
    
    class Meta:
        db_table = 'branches'
        verbose_name = 'sucursal'
        verbose_name_plural = 'sucursales'
        ordering = ['name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f'{self.code} - {self.name}'
    
    def get_active_users_count(self):
        """Get count of active users assigned to this branch."""
        return self.users.filter(user__is_active=True).count()
