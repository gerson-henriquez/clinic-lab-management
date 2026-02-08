"""
Quick setup script to create initial user with profile
Run with: python manage.py quick_setup
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.auth.models import User, UserProfile
from apps.branches.models import Branch
from getpass import getpass


class Command(BaseCommand):
    help = 'Quick setup: Create superuser with profile in one command'

    def handle(self, *args, **options):
        """Execute the command"""
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('🚀 Quick Setup - Create Admin User'))
        self.stdout.write('='*60 + '\n')
        
        try:
            # Get user input
            email = input('Email: ')
            username = input('Username: ')
            password = getpass('Password: ')
            password_confirm = getpass('Confirm password: ')
            
            if password != password_confirm:
                self.stdout.write(self.style.ERROR('\n❌ Passwords do not match!'))
                return
            
            first_name = input('First name (optional): ')
            last_name = input('Last name (optional): ')
            
            with transaction.atomic():
                # Create or get default branch
                branch, branch_created = Branch.objects.get_or_create(
                    code='MAIN',
                    defaults={
                        'name': 'Main Branch',
                        'address': '123 Main Street',
                        'phone': '+1234567890',
                        'email': 'main@lab.com',
                        'is_active': True
                    }
                )
                
                if branch_created:
                    self.stdout.write(self.style.SUCCESS(f'\n✓ Created branch: {branch.name}'))
                else:
                    self.stdout.write(f'\n✓ Using existing branch: {branch.name}')
                
                # Create superuser
                user = User.objects.create_superuser(
                    email=email,
                    username=username,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user.email}'))
                
                # Create profile
                profile = UserProfile.objects.create(
                    user=user,
                    role='superadmin',
                    branch=branch,
                    phone=''
                )
                self.stdout.write(self.style.SUCCESS(f'✓ Created profile: role={profile.role}'))
                
                # Display summary
                self.stdout.write('\n' + '='*60)
                self.stdout.write(self.style.SUCCESS('✅ Setup Complete!'))
                self.stdout.write('='*60)
                self.stdout.write(f'\n📋 User Details:')
                self.stdout.write(f'  Email:    {user.email}')
                self.stdout.write(f'  Username: {user.username}')
                self.stdout.write(f'  Role:     {profile.role}')
                self.stdout.write(f'  Branch:   {profile.branch.name}')
                self.stdout.write('\n✅ You can now login!')
                self.stdout.write('\n🔗 Login at: http://localhost:8000/api/auth/login')
                self.stdout.write('🔗 Admin at: http://localhost:8000/admin\n')
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error: {str(e)}'))
