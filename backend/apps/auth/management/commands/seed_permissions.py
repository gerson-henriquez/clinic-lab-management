"""
Management command to seed roles and permissions
Run with: python manage.py seed_permissions
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.auth.models import Permission, RolePermission


class Command(BaseCommand):
    help = 'Seeds the database with roles and permissions for RBAC'

    def handle(self, *args, **options):
        """Execute the command"""
        self.stdout.write(self.style.SUCCESS('\n🔐 Seeding Roles & Permissions...\n'))
        
        try:
            with transaction.atomic():
                self._create_permissions()
                self._assign_role_permissions()
            
            self.stdout.write(self.style.SUCCESS('\n✅ Successfully seeded all permissions!\n'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error seeding permissions: {str(e)}\n'))
            raise

    def _create_permissions(self):
        """Create all permission entries"""
        self.stdout.write('📝 Creating permissions...')
        
        permissions_data = [
            # Order Management Permissions
            {
                'code': 'orders.create',
                'name': 'Crear Órdenes',
                'description': 'Puede crear nuevas órdenes de exámenes',
                'module': 'orders'
            },
            {
                'code': 'orders.view',
                'name': 'Ver Órdenes',
                'description': 'Puede ver órdenes de exámenes',
                'module': 'orders'
            },
            {
                'code': 'orders.view_all',
                'name': 'Ver Todas las Órdenes',
                'description': 'Puede ver órdenes de todas las sucursales',
                'module': 'orders'
            },
            {
                'code': 'orders.edit',
                'name': 'Editar Órdenes',
                'description': 'Puede modificar órdenes existentes',
                'module': 'orders'
            },
            {
                'code': 'orders.cancel',
                'name': 'Cancelar Órdenes',
                'description': 'Puede cancelar órdenes',
                'module': 'orders'
            },
            {
                'code': 'orders.transfer',
                'name': 'Transferir Órdenes',
                'description': 'Puede transferir órdenes entre sucursales',
                'module': 'orders'
            },
            {
                'code': 'orders.view_pending',
                'name': 'Ver Órdenes Pendientes',
                'description': 'Puede ver lista de órdenes pendientes',
                'module': 'orders'
            },
            
            # Patient Management Permissions
            {
                'code': 'patients.create',
                'name': 'Crear Pacientes',
                'description': 'Puede registrar nuevos pacientes',
                'module': 'patients'
            },
            {
                'code': 'patients.view',
                'name': 'Ver Pacientes',
                'description': 'Puede ver información de pacientes',
                'module': 'patients'
            },
            {
                'code': 'patients.edit',
                'name': 'Editar Pacientes',
                'description': 'Puede modificar información de pacientes',
                'module': 'patients'
            },
            {
                'code': 'patients.edit_clinical_records',
                'name': 'Editar Registros Clínicos',
                'description': 'Puede editar registros clínicos de pacientes',
                'module': 'patients'
            },
            {
                'code': 'patients.view_clinical_records',
                'name': 'Ver Registros Clínicos',
                'description': 'Puede ver registros clínicos completos',
                'module': 'patients'
            },
            
            # Results & Reports Permissions
            {
                'code': 'results.submit',
                'name': 'Enviar Resultados',
                'description': 'Puede ingresar resultados de exámenes',
                'module': 'results'
            },
            {
                'code': 'results.view',
                'name': 'Ver Resultados',
                'description': 'Puede ver resultados de exámenes',
                'module': 'results'
            },
            {
                'code': 'results.view_readonly',
                'name': 'Ver Resultados (Solo Lectura)',
                'description': 'Puede ver resultados sin editar',
                'module': 'results'
            },
            {
                'code': 'results.approve',
                'name': 'Aprobar Resultados',
                'description': 'Puede aprobar resultados antes de enviar',
                'module': 'results'
            },
            {
                'code': 'results.download_pdf',
                'name': 'Descargar PDF',
                'description': 'Puede descargar reportes en PDF',
                'module': 'results'
            },
            
            # Billing & Invoice Permissions
            {
                'code': 'billing.create_invoice',
                'name': 'Crear Facturas',
                'description': 'Puede generar facturas',
                'module': 'billing'
            },
            {
                'code': 'billing.view_invoices',
                'name': 'Ver Facturas',
                'description': 'Puede ver facturas',
                'module': 'billing'
            },
            {
                'code': 'billing.edit_invoices',
                'name': 'Editar Facturas',
                'description': 'Puede modificar facturas',
                'module': 'billing'
            },
            {
                'code': 'billing.cancel_invoices',
                'name': 'Cancelar Facturas',
                'description': 'Puede cancelar facturas',
                'module': 'billing'
            },
            {
                'code': 'billing.process_payment',
                'name': 'Procesar Pagos',
                'description': 'Puede registrar pagos',
                'module': 'billing'
            },
            {
                'code': 'billing.search',
                'name': 'Buscar Facturas',
                'description': 'Puede buscar en el sistema de facturación',
                'module': 'billing'
            },
            
            # Financial Reports Permissions
            {
                'code': 'finance.view_dashboard',
                'name': 'Ver Dashboard Financiero',
                'description': 'Puede ver el dashboard financiero',
                'module': 'finance'
            },
            {
                'code': 'finance.view_reports',
                'name': 'Ver Reportes Financieros',
                'description': 'Puede ver reportes financieros detallados',
                'module': 'finance'
            },
            {
                'code': 'finance.export_data',
                'name': 'Exportar Datos Financieros',
                'description': 'Puede exportar datos financieros',
                'module': 'finance'
            },
            {
                'code': 'finance.view_all_branches',
                'name': 'Ver Finanzas de Todas las Sucursales',
                'description': 'Puede ver finanzas de todas las sucursales',
                'module': 'finance'
            },
            
            # User & Branch Management
            {
                'code': 'users.manage',
                'name': 'Gestionar Usuarios',
                'description': 'Puede crear, editar y desactivar usuarios',
                'module': 'users'
            },
            {
                'code': 'users.view',
                'name': 'Ver Usuarios',
                'description': 'Puede ver lista de usuarios',
                'module': 'users'
            },
            {
                'code': 'users.assign_roles',
                'name': 'Asignar Roles',
                'description': 'Puede asignar roles a usuarios',
                'module': 'users'
            },
            {
                'code': 'users.assign_branch',
                'name': 'Asignar Sucursal',
                'description': 'Puede asignar usuarios a sucursales',
                'module': 'users'
            },
            {
                'code': 'branches.manage',
                'name': 'Gestionar Sucursales',
                'description': 'Puede crear y editar sucursales',
                'module': 'branches'
            },
            {
                'code': 'branches.view',
                'name': 'Ver Sucursales',
                'description': 'Puede ver información de sucursales',
                'module': 'branches'
            },
            
            # Search & History
            {
                'code': 'search.patients',
                'name': 'Buscar Pacientes',
                'description': 'Puede buscar en el sistema de pacientes',
                'module': 'search'
            },
            {
                'code': 'search.orders',
                'name': 'Buscar Órdenes',
                'description': 'Puede buscar órdenes',
                'module': 'search'
            },
            {
                'code': 'search.view_history',
                'name': 'Ver Historial',
                'description': 'Puede ver historial de búsquedas',
                'module': 'search'
            },
            
            # Audit & Logs
            {
                'code': 'audit.view_logs',
                'name': 'Ver Logs de Auditoría',
                'description': 'Puede ver registros de auditoría',
                'module': 'audit'
            },
            {
                'code': 'audit.export_logs',
                'name': 'Exportar Logs',
                'description': 'Puede exportar logs de auditoría',
                'module': 'audit'
            },
            
            # System Settings
            {
                'code': 'settings.manage',
                'name': 'Gestionar Configuración',
                'description': 'Puede modificar configuración del sistema',
                'module': 'settings'
            },
            {
                'code': 'settings.view',
                'name': 'Ver Configuración',
                'description': 'Puede ver configuración del sistema',
                'module': 'settings'
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for perm_data in permissions_data:
            permission, created = Permission.objects.get_or_create(
                code=perm_data['code'],
                defaults={
                    'name': perm_data['name'],
                    'description': perm_data['description'],
                    'module': perm_data['module'],
                }
            )
            
            if created:
                created_count += 1
            else:
                # Update existing permission
                permission.name = perm_data['name']
                permission.description = perm_data['description']
                permission.module = perm_data['module']
                permission.save()
                updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'   ✓ Created {created_count} new permissions, updated {updated_count} existing'
            )
        )

    def _assign_role_permissions(self):
        """Assign permissions to roles"""
        self.stdout.write('\n🔗 Assigning permissions to roles...')
        
        role_permissions_map = {
            'superadmin': 'all',  # Special case: gets all permissions
            
            'doctor': [
                # Orders
                'orders.create',
                'orders.view',
                'orders.edit',
                # Patients
                'patients.create',
                'patients.view',
                'patients.edit',
                'patients.edit_clinical_records',
                'patients.view_clinical_records',
                # Results
                'results.view',
                'results.download_pdf',
                # Billing
                'billing.create_invoice',
                'billing.view_invoices',
                # Search
                'search.patients',
                'search.orders',
            ],
            
            'lab_technician': [
                # Orders
                'orders.create',
                'orders.view',
                'orders.view_pending',
                'orders.transfer',
                # Patients
                'patients.view',
                # Results
                'results.submit',
                'results.view',
                'results.download_pdf',
                # Billing
                'billing.create_invoice',
                'billing.view_invoices',
                'billing.search',
                # Search
                'search.orders',
            ],
            
            'finance_user': [
                # Orders (readonly)
                'orders.view',
                # Results (readonly)
                'results.view_readonly',
                # Billing
                'billing.view_invoices',
                'billing.process_payment',
                'billing.search',
                # Finance
                'finance.view_dashboard',
                'finance.view_reports',
                'finance.export_data',
                # Search
                'search.orders',
            ],
            
            'manager': [
                # All technician permissions
                'orders.create',
                'orders.view',
                'orders.view_pending',
                'orders.transfer',
                'orders.cancel',
                'patients.view',
                'results.submit',
                'results.view',
                'results.approve',
                'results.download_pdf',
                'billing.create_invoice',
                'billing.view_invoices',
                'billing.edit_invoices',
                'billing.process_payment',
                'billing.search',
                # Plus management permissions
                'users.manage',
                'users.view',
                'users.assign_branch',
                'branches.view',
                'finance.view_dashboard',
                'finance.view_reports',
                'audit.view_logs',
                # Search
                'search.patients',
                'search.orders',
                'search.view_history',
            ],
        }
        
        for role, permission_codes in role_permissions_map.items():
            # Delete existing role permissions
            RolePermission.objects.filter(role=role).delete()
            
            if permission_codes == 'all':
                # Superadmin gets all permissions
                all_permissions = Permission.objects.all()
                role_perms_to_create = [
                    RolePermission(role=role, permission=perm)
                    for perm in all_permissions
                ]
            else:
                # Get permission objects
                permissions = Permission.objects.filter(code__in=permission_codes)
                role_perms_to_create = [
                    RolePermission(role=role, permission=perm)
                    for perm in permissions
                ]
            
            # Bulk create
            RolePermission.objects.bulk_create(role_perms_to_create)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'   ✓ {role}: {len(role_perms_to_create)} permissions'
                )
            )
