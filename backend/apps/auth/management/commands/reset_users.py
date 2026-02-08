"""
Management command to reset all users and start fresh
Run with: python manage.py reset_users
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.auth.models import User, UserProfile, AuditLog
from apps.branches.models import Branch


class Command(BaseCommand):
    help = 'Delete all users, profiles, and optionally branches to start fresh'

    def add_arguments(self, parser):
        parser.add_argument(
            '--keep-branches',
            action='store_true',
            help='Keep existing branches (only delete users and profiles)'
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Skip confirmation prompt'
        )

    def handle(self, *args, **options):
        """Execute the command"""
        keep_branches = options.get('keep_branches')
        confirm = options.get('confirm')
        
        # Count current data
        user_count = User.objects.count()
        profile_count = UserProfile.objects.count()
        branch_count = Branch.objects.count()
        audit_count = AuditLog.objects.count()
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('⚠️  WARNING: This will delete data!'))
        self.stdout.write('='*60)
        self.stdout.write(f'\nCurrent data:')
        self.stdout.write(f'  - Users: {user_count}')
        self.stdout.write(f'  - User Profiles: {profile_count}')
        self.stdout.write(f'  - Branches: {branch_count}')
        self.stdout.write(f'  - Audit Logs: {audit_count}')
        
        if keep_branches:
            self.stdout.write(f'\n⚠️  Will delete: Users, Profiles, Audit Logs')
            self.stdout.write(f'✓  Will keep: Branches')
        else:
            self.stdout.write(f'\n⚠️  Will delete: EVERYTHING (Users, Profiles, Branches, Audit Logs)')
        
        if not confirm:
            self.stdout.write('\n')
            response = input('Are you sure? Type "yes" to continue: ')
            if response.lower() != 'yes':
                self.stdout.write(self.style.ERROR('\n❌ Cancelled'))
                return
        
        try:
            with transaction.atomic():
                # Delete audit logs
                deleted_audits = AuditLog.objects.all().delete()[0]
                self.stdout.write(self.style.SUCCESS(f'\n✓ Deleted {deleted_audits} audit logs'))
                
                # Delete profiles (will cascade delete due to OneToOne)
                deleted_profiles = UserProfile.objects.all().delete()[0]
                self.stdout.write(self.style.SUCCESS(f'✓ Deleted {deleted_profiles} user profiles'))
                
                # Delete users
                deleted_users = User.objects.all().delete()[0]
                self.stdout.write(self.style.SUCCESS(f'✓ Deleted {deleted_users} users'))
                
                # Delete branches if requested
                if not keep_branches:
                    deleted_branches = Branch.objects.all().delete()[0]
                    self.stdout.write(self.style.SUCCESS(f'✓ Deleted {deleted_branches} branches'))
            
            self.stdout.write('\n' + '='*60)
            self.stdout.write(self.style.SUCCESS('✅ Database reset complete!'))
            self.stdout.write('='*60)
            
            self.stdout.write('\n📝 Next steps:')
            self.stdout.write('  1. Create a new user with:')
            self.stdout.write('     python manage.py create_user')
            self.stdout.write('  or')
            self.stdout.write('     python manage.py createsuperuser')
            self.stdout.write('     (then create profile via admin or shell)')
            self.stdout.write('\n')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error: {str(e)}'))
