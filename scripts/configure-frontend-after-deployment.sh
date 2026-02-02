#!/bin/bash
# Script to configure frontend after backend deployment

set -e

echo "🔧 Configuring frontend after backend deployment..."

# Get the backend URL from environment or prompt user
if [ -z "$BACKEND_URL" ]; then
    echo "Please enter the deployed backend URL:"
    echo "Example: https://harvestconnect-backend-xxxx.koyeb.app"
    read -p "Backend URL: " BACKEND_URL
    
    if [ -z "$BACKEND_URL" ]; then
        echo "❌ No backend URL provided"
        exit 1
    fi
fi

# Validate URL format
if [[ ! "$BACKEND_URL" =~ ^https?:// ]]; then
    echo "❌ Invalid URL format. Please use http:// or https://"
    exit 1
fi

FRONTEND_DIR="harvestconnect"

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend directory $FRONTEND_DIR not found"
    exit 1
fi

cd $FRONTEND_DIR

# Create or update .env.local
cat > .env.local << EOF
# HarvestConnect Frontend Configuration
NEXT_PUBLIC_API_URL=$BACKEND_URL
NEXT_PUBLIC_BASE_URL=$BACKEND_URL

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-""}
NEXT_PUBLIC_GITHUB_CLIENT_ID=${NEXT_PUBLIC_GITHUB_CLIENT_ID:-""}

# Stripe (if needed)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:-""}

# Sentry (if needed)
NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN:-""}

# Other configurations
NEXT_PUBLIC_APP_NAME="HarvestConnect"
NEXT_PUBLIC_ENVIRONMENT="production"
EOF

echo "✅ Frontend configured with backend URL: $BACKEND_URL"

# Display configuration summary
echo ""
echo "📋 Configuration Summary:"
echo "   Frontend directory: $FRONTEND_DIR"
echo "   Backend API URL: $BACKEND_URL"
echo "   Environment file: .env.local"
echo ""
echo "🔄 To rebuild and redeploy frontend to Netlify:"
echo "   cd $FRONTEND_DIR"
echo "   npm run build"
echo "   netlify deploy --prod"

cd ..

echo "✅ Frontend configuration completed!"