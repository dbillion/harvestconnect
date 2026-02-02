#!/bin/bash
# HarvestConnect Optimized Koyeb Backend Deployment Script

set -e

echo "🚀 Starting HarvestConnect Optimized Django Backend deployment to Koyeb..."

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
    echo "   koyeb auth login"
    echo "   Then run this script again"
    exit 1
fi

# Navigate to backend directory
cd backend || { echo "❌ Backend directory not found"; exit 1; }

echo "🔧 Preparing deployment files..."

# Create Procfile if it doesn't exist (using optimized Dockerfile)
if [ ! -f Procfile ]; then
    echo "web: /app/startup.sh" > Procfile
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
Dockerfile.*
.dockerignore
*.env
.env.local
.env.production
node_modules/
*.log
.coverage
*.swp
*.swo
.DS_Store
Thumbs.db
tests/
test_*
*.test.py
EOF

echo "✅ Created .koyebignore"

# Deploy to Koyeb using optimized Dockerfile
echo "🚀 Deploying optimized backend to Koyeb..."

SERVICE_NAME="harvestconnect-backend-optimized-$(date +%s)"

koyeb service deploy \
    --name="$SERVICE_NAME" \
    --ports=8000:http \
    --routes=/:8000 \
    --env="PORT=8000" \
    --env="DEBUG=False" \
    --env="SECRET_KEY=$(openssl rand -base64 32)" \
    --env="DATABASE_URL=sqlite:///db.sqlite3" \
    --env="REDIS_URL=redis://localhost:6379" \
    --env="UPSTASH_REDIS_URL=https://intimate-cicada-9814.upstash.io" \
    --env="UPSTASH_REDIS_TOKEN=ASZWAAImcDI1MjE5NzczZGU2N2Y0Zjc0OGVmM2EzYmFkZWQwNDUwY3AyOTgxNA" \
    --env="ALLOWED_HOSTS=.koyeb.app,localhost,127.0.0.1" \
    --env="CORS_ALLOWED_ORIGINS=https://harvestingconnect.netlify.app,https://www.harvestingconnect.netlify.app,http://localhost:3000,http://localhost:3001" \
    --env="CSRF_TRUSTED_ORIGINS=https://*.koyeb.app,https://harvestingconnect.netlify.app,http://localhost:8000" \
    --dockerfile="Dockerfile.optimized" \
    --context="." \
    --force

if [ $? -eq 0 ]; then
    echo "✅ Optimized deployment initiated successfully!"
    echo ""
    echo "📋 Deployment details:"
    echo "   Service: $SERVICE_NAME"
    echo "   Status: Deployment in progress"
    echo "   Dockerfile: Dockerfile.optimized"
    echo ""
    echo "🌐 Your optimized backend will be available at:"
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

echo "🎉 Optimized Koyeb deployment process completed!"