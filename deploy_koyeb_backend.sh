#!/bin/bash

# HarvestConnect Django Backend Deployment Script for Koyeb

set -e

echo "Starting HarvestConnect Django Backend deployment to Koyeb..."

# Check if koyeb CLI is installed
if ! command -v koyeb &> /dev/null; then
    echo "Koyeb CLI not found. Installing..."
    curl -sfL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
fi

# Login to Koyeb (you'll need to set up authentication)
echo "Please ensure you're logged in to Koyeb:"
echo "koyeb auth login"
echo ""

# Navigate to backend directory
cd backend

# Create or update the .koyobignore file
cat > .koyebignore << EOF
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
EOF

# Deploy the application
echo "Deploying Django backend to Koyeb..."
koyeb service deploy \
  --name harvestconnect-backend \
  --ports 8000:http \
  --routes /:8000 \
  --env PORT=800 \
  --env DEBUG=False \
  --env SECRET_KEY=${SECRET_KEY:-$(openssl rand -base64 32)} \
  --env DATABASE_URL=${DATABASE_URL:-sqlite:///db.sqlite3} \
  --env ALLOWED_HOSTS=*.koyeb.app \
  --env CORS_ALLOWED_ORIGINS=${FRONTEND_URL:-https://*.netlify.app} \
  --env REDIS_URL=${REDIS_URL:-redis://localhost:6379} \
  --dockerfile .

if [ $? -eq 0 ]; then
    echo "✅ Django backend deployed successfully!"
    echo "Backend URL: https://harvestconnect-backend.\$KOYEB_APP_NAME.koyeb.app"
    echo ""
    echo "Next steps:"
    echo "1. Get the actual deployment URL: koyeb service inspect harvestconnect-backend"
    echo "2. Update your frontend environment variables with the backend URL"
    echo "3. Configure CORS settings in your Django settings"
else
    echo "❌ Deployment failed!"
    exit 1
fi