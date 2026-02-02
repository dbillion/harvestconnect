#!/usr/bin/env python3
"""
Koyeb Deployment Configuration for HarvestConnect Django Backend
"""

import os
import subprocess
import sys
from pathlib import Path

class KoyebDeployer:
    def __init__(self):
        self.backend_path = Path("backend")
        self.service_name = "harvestconnect-backend"
        
    def check_prerequisites(self):
        """Check if required tools are available"""
        print("🔍 Checking prerequisites...")
        
        # Check if koyeb CLI is installed
        try:
            result = subprocess.run(["koyeb", "--version"], capture_output=True, text=True)
            print(f"✅ Koyeb CLI: {result.stdout.strip()}")
        except FileNotFoundError:
            print("❌ Koyeb CLI not found. Installing...")
            subprocess.run(["curl", "-sfL", "https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh"], 
                         stdout=subprocess.PIPE)
            subprocess.run(["sh", "-c", "curl -sfL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh"])
            
        # Check if logged in to Koyeb
        try:
            result = subprocess.run(["koyeb", "whoami"], capture_output=True, text=True)
            if result.returncode != 0:
                print("❌ Not logged in to Koyeb. Please run: koyeb auth login")
                return False
        except FileNotFoundError:
            print("❌ Koyeb CLI not available after installation attempt")
            return False
            
        return True
    
    def prepare_deployment(self):
        """Prepare files for deployment"""
        print("📦 Preparing deployment files...")
        
        # Ensure Procfile exists
        procfile = self.backend_path / "Procfile"
        if not procfile.exists():
            procfile.write_text("web: gunicorn harvestconnect.wsgi:application --bind 0.0.0.0:$PORT\n")
            print("✅ Created Procfile")
        
        # Create .koyebignore
        koyebignore = self.backend_path / ".koyebignore"
        koyebignore_content = """*.pyc
__pycache__/
.git
.gitignore
README.md
Dockerfile
.dockerignore
*.env
.env.local
node_modules/
*.log
.coverage
"""
        koyebignore.write_text(koyebignore_content)
        print("✅ Created .koyebignore")
        
        # Update Django settings for production
        settings_file = self.backend_path / "harvestconnect" / "settings.py"
        if settings_file.exists():
            content = settings_file.read_text()
            
            # Add production-specific settings
            if "SECURE_SSL_REDIRECT = True" not in content:
                # Find the end of the security settings section and add production settings
                security_settings = """
# Production Security Settings
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Koyeb-specific settings
ALLOWED_HOSTS = ['.koyeb.app', 'localhost', '127.0.0.1']

# CORS for Netlify frontend
CORS_ALLOWED_ORIGINS = [
    'https://*.netlify.app',
    'https://www.harvestconnect.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
]
"""
                # Insert after the existing settings
                content += "\n" + security_settings
                settings_file.write_text(content)
                print("✅ Updated Django settings for production")
        
        return True
    
    def deploy_service(self):
        """Deploy the service to Koyeb"""
        print(f"🚀 Deploying {self.service_name} to Koyeb...")
        
        # Change to backend directory
        original_dir = os.getcwd()
        os.chdir(self.backend_path)
        
        try:
            # Build and deploy command
            cmd = [
                "koyeb", "service", "deploy",
                f"--name={self.service_name}",
                "--ports=8000:http",
                "--routes=/:8000",
                "--env=PORT=800",
                "--env=DEBUG=False",
                f"--env=SECRET_KEY={os.environ.get('SECRET_KEY', 'insecure-default-key-for-testing')}",
                f"--env=DATABASE_URL={os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3')}",
                "--env=ALLOWED_HOSTS=.koyeb.app",
                f"--env=CORS_ALLOWED_ORIGINS={os.environ.get('NETLIFY_FRONTEND_URL', 'https://*.netlify.app')}",
                "--dockerfile=.",
                "--force"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Service {self.service_name} deployed successfully!")
                print("📋 Deployment details:")
                print(result.stdout)
                
                # Get the service URL
                inspect_cmd = ["koyeb", "service", "inspect", self.service_name, "--output=json"]
                inspect_result = subprocess.run(inspect_cmd, capture_output=True, text=True)
                
                if inspect_result.returncode == 0:
                    print("\n🌐 Service URL will be available shortly at:")
                    print(f"   https://{self.service_name}.<app-name>.koyeb.app")
                    
                return True
            else:
                print(f"❌ Deployment failed:")
                print(result.stderr)
                return False
                
        finally:
            os.chdir(original_dir)
    
    def run_migrations(self):
        """Run database migrations"""
        print("🔄 Running database migrations...")
        
        # Note: In production, migrations should be run via a separate deployment step
        # or through a management command
        print("⚠️  Migrations should be run separately in production")
        print("   You can run: koyeb exec service {service-name} -- python manage.py migrate")
        
    def deploy(self):
        """Main deployment workflow"""
        if not self.check_prerequisites():
            print("❌ Prerequisites check failed. Please install and configure Koyeb CLI.")
            return False
        
        if not self.prepare_deployment():
            print("❌ Failed to prepare deployment files")
            return False
        
        if not self.deploy_service():
            print("❌ Service deployment failed")
            return False
        
        self.run_migrations()
        
        print("\n🎉 Deployment completed!")
        print("📋 Next steps:")
        print("   1. Wait for the deployment to be active (check Koyeb dashboard)")
        print("   2. Get the backend URL from Koyeb dashboard")
        print("   3. Update your Netlify frontend with the backend URL")
        print("   4. Test the API connectivity")
        
        return True

if __name__ == "__main__":
    deployer = KoyebDeployer()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--dry-run":
        print("Dry run mode - would deploy to Koyeb")
        print(f"Service name: {deployer.service_name}")
        print(f"Path: {deployer.backend_path}")
    else:
        success = deployer.deploy()
        sys.exit(0 if success else 1)