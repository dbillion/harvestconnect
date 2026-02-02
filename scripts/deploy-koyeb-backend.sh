#!/bin/bash
# HarvestConnect Koyeb Backend Deployment Script

set -e

echo "🚀 Starting HarvestConnect Django Backend deployment to Koyeb..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Koyeb CLI if not present
if ! command_exists koyeb; then
    echo "📦 Installing Koyeb CLI..."
    curl -sfL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
fi

# Check if user is logged in
if ! koyeb whoami &>/dev/null; then
    echo "🔐 Please log in to Koyeb:"
    echo "   koyeb login"
    echo "   Then run this script again"
    exit 1
fi

# Navigate to backend directory
cd backend || { echo "❌ Backend directory not found"; exit 1; }

echo "🔧 Preparing deployment files..."

# Create Procfile if it doesn't exist
if [ ! -f Procfile ]; then
    echo "web: gunicorn harvestconnect.wsgi:application --bind 0.0.0.0:\$PORT" > Procfile
    echo "✅ Created Procfile"
fi

# Create .koyebignore
cat > .koyebignore << 'EOF'
*.pyc
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
*.swp
*.swo
.DS_Store
Thumbs.db
EOF

echo "✅ Created .koyebignore"

# Update Django settings for production (backup first)
if [ -f harvestconnect/settings.py ]; then
    cp harvestconnect/settings.py harvestconnect/settings.py.backup
    echo "
# Production settings for Koyeb deployment
import os

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
CSRF_COOKIE_SECURE = os.getenv('CSRF_COOKIE_SECURE', 'False').lower() == 'true'

# Host configuration
ALLOWED_HOSTS = [
    '.koyeb.app',
    os.getenv('HOSTNAME', 'localhost'),
    'localhost', 
    '127.0.0.1',
]

# CORS configuration for Netlify frontend
CORS_ALLOWED_ORIGINS = [
    'https://' + os.getenv('NETLIFY_SITE_NAME', 'harvestconnect') + '.netlify.app',
    'https://www.' + os.getenv('NETLIFY_SITE_NAME', 'harvestconnect') + '.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
] + os.getenv('ADDITIONAL_CORS_ORIGINS', '').split(',')

print('✅ Updated Django settings for production deployment')
EOF

    # Append production settings to existing settings
    cat >> harvestconnect/settings.py << 'PRODUCTION_SETTINGS'

# Production-specific settings
if os.getenv('KOYEB_DEPLOYMENT'):
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # Koyeb deployment settings
    ALLOWED_HOSTS = ['.koyeb.app'] + os.getenv('ADDITIONAL_ALLOWED_HOSTS', '').split(',')
    
    # CORS for frontend
    CORS_ALLOWED_ORIGINS = [
        'https://*.netlify.app',
        'https://harvestconnect.netlify.app',
        'https://www.harvestconnect.netlify.app',
        'http://localhost:3000',
        'http://localhost:3001',
    ]

PRODUCTION_SETTINGS
fi

echo "✅ Updated Django settings for production"

# Deploy to Koyeb
echo "🚀 Deploying to Koyeb..."

SERVICE_NAME="harvestconnect-backend-$(date +%s)"

koyeb service deploy \
    --name="$SERVICE_NAME" \
    --ports=8000:http \
    --routes=/:8000 \
    --env="PORT=800" \
    --env="DEBUG=False" \
    --env="SECRET_KEY=$(openssl rand -base64 32)" \
    --env="DATABASE_URL=sqlite:///db.sqlite3" \
    --env="KOYEB_DEPLOYMENT=true" \
    --env="NETLIFY_SITE_NAME=harvestconnect" \
    --dockerfile=. \
    --force

if [ $? -eq 0 ]; then
    echo "✅ Deployment initiated successfully!"
    echo ""
    echo "📋 Deployment details:"
    echo "   Service: $SERVICE_NAME"
    echo "   Status: Deployment in progress"
    echo ""
    echo "🌐 Your backend will be available at:"
    echo "   https://$SERVICE_NAME.<app-name>.koyeb.app"
    echo ""
    echo "🔄 To check deployment status:"
    echo "   koyeb service list"
    echo "   koyeb service logs $SERVICE_NAME"
    echo ""
    echo "🔗 Once deployed, update your Netlify frontend with the backend URL"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 Koyeb deployment process completed!"