"""
Management command to create a complete user with profile and branch
Run with: python manage.py create_user
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.auth.models import User, UserProfile
from apps.branches.models import Branch


class Command(BaseCommand):
    help = 'Create a new user with profile and branch assignment'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='User email address')
        parser.add_argument('--username', type=str, help='Username')
        parser.add_argument('--password', type=str, help='Password')
        parser.add_argument('--first-name', type=str, default='', help='First name')
        parser.add_argument('--last-name', type=str, default='', help='Last name')
        parser.add_argument(
            '--role',
            type=str,
            choices=['superadmin', 'doctor', 'lab_technician', 'finance_user', 'manager'],
            default='doctor',
            help='User role'
        )
        parser.add_argument('--branch-code', type=str, help='Branch code')
        parser.add_argument('--phone', type=str, default='', help='Phone number')
        parser.add_argument('--superuser', action='store_true', help='Make user a Django superuser')

    def handle(self, *args, **options):
        """Execute the command"""
        try:
            # Get inputs
            email = options.get('email')
            username = options.get('username')
            password = options.get('password')
            
            # Interactive mode if not provided
            if not email:
                email = input('Email address: ')
            if not username:
                username = input('Username: ')
            if not password:
                from getpass import getpass
                password = getpass('Password: ')
                password_confirm = getpass('Password (again): ')
                if password != password_confirm:
                    self.stdout.write(self.style.ERROR('Passwords do not match!'))
                    return
            
            first_name = options.get('first_name')
            last_name = options.get('last_name')
            role = options.get('role')
            branch_code = options.get('branch_code')
            phone = options.get('phone')
            is_superuser = options.get('superuser')
            
            # Interactive role selection if not provided
            if not role:
                self.stdout.write('\nAvailable roles:')
                self.stdout.write('  1. superadmin      - Full system access')
                self.stdout.write('  2. doctor          - Patient & order management')
                self.stdout.write('  3. lab_technician  - Process orders, submit results')
                self.stdout.write('  4. finance_user    - View financial data')
                self.stdout.write('  5. manager         - Team lead, user management')
                role_choice = input('\nSelect role (1-5) [2]: ') or '2'
                role_map = {
                    '1': 'superadmin',
                    '2': 'doctor',
                    '3': 'lab_technician',
                    '4': 'finance_user',
                    '5': 'manager'
                }
                role = role_map.get(role_choice, 'doctor')
            
            with transaction.atomic():
                # Get or create default branch
                if branch_code:
                    branch = Branch.objects.get(code=branch_code)
                else:
                    branch, created = Branch.objects.get_or_create(
                        code='MAIN',
                        defaults={
                            'name': 'Main Branch',
                            'address': '123 Main Street',
                            'phone': '+1234567890',
                            'email': 'main@lab.com',
                            'is_active': True
                        }
                    )
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f'✓ Created default branch: {branch.name}')
                        )
                
                # Create user
                if is_superuser:
                    user = User.objects.create_superuser(
                        email=email,
                        username=username,
                        password=password,
                        first_name=first_name,
                        last_name=last_name
                    )
                else:
                    user = User.objects.create_user(
                        email=email,
                        username=username,
                        password=password,
                        first_name=first_name,
                        last_name=last_name
                    )
                
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created user: {user.email} ({user.username})')
                )
                
                # Create profile
                profile = UserProfile.objects.create(
                    user=user,
                    role=role,
                    branch=branch,
                    phone=phone
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created profile: role={profile.role}, branch={branch.name}')
                )
                
                # Display summary
                self.stdout.write('\n' + '='*50)
                self.stdout.write(self.style.SUCCESS('✅ User created successfully!'))
                self.stdout.write('='*50)
                self.stdout.write(f'Email:      {user.email}')
                self.stdout.write(f'Username:   {user.username}')
                self.stdout.write(f'Role:       {profile.role}')
                self.stdout.write(f'Branch:     {profile.branch.name} ({profile.branch.code})')
                self.stdout.write(f'Active:     {user.is_active}')
                if is_superuser:
                    self.stdout.write(f'Superuser:  Yes')
                self.stdout.write('='*50)
                self.stdout.write('\n✅ User can now login at /api/auth/login\n')
                
        except Branch.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'❌ Branch with code "{branch_code}" not found!')
            )
            self.stdout.write('Available branches:')
            for b in Branch.objects.all():
                self.stdout.write(f'  - {b.code}: {b.name}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error creating user: {str(e)}')
            )
