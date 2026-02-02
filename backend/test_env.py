#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.insert(0, '/app')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestconnect.settings')
django.setup()

# Test database connection
from django.db import connection
from django.core.management import execute_from_command_line

def test_database_connection():
    try:
        connection.ensure_connection()
        print("✅ Database connection successful!")
        print(f"Database engine: {settings.DATABASES['default']['ENGINE']}")
        if settings.DATABASES['default']['ENGINE'] != 'django.db.backends.sqlite3':
            print(f"Database host: {settings.DATABASES['default'].get('HOST', 'N/A')}")
            print(f"Database name: {settings.DATABASES['default'].get('NAME', 'N/A')}")
        else:
            print(f"Database file: {settings.DATABASES['default'].get('NAME', 'N/A')}")
        
        # Test if we can run migrations
        from django.core.management.commands.migrate import Command as MigrateCommand
        print("✅ Migration capability test passed!")
        
        # Test environment variables
        print("\n📋 Loaded Environment Variables:")
        print(f"- DATABASE_URL: {'SET' if os.environ.get('DATABASE_URL') else 'NOT SET'}")
        print(f"- POSTGRES_URL: {'SET' if os.environ.get('POSTGRES_URL') else 'NOT SET'}")
        print(f"- DJANGO_SECRET_KEY: {'SET' if os.environ.get('DJANGO_SECRET_KEY') else 'NOT SET'}")
        print(f"- DEBUG: {os.environ.get('DEBUG', 'False')}")
        
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_database_connection()
    sys.exit(0 if success else 1)