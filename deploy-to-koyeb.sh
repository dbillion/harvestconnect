#!/bin/bash

# Deploy HarvestConnect to Koyeb
set -e

echo "🚀 Starting Koyeb deployment..."

# Add Koyeb to PATH
export PATH="$HOME/.koyeb/bin:$PATH"

# Check if Koyeb CLI is installed
if ! command -v koyeb &> /dev/null; then
    echo "📦 Installing Koyeb CLI..."
    curl -fsSL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
    export PATH="$HOME/.koyeb/bin:$PATH"
fi

# Check if logged in to Koyeb
if ! koyeb whoami &> /dev/null; then
    echo "🔐 Please log in to Koyeb first:"
    echo "  1. Go to https://app.koyeb.com/account/api-tokens"
    echo "  2. Create a new API token"
    echo "  3. Run: koyeb login --token YOUR_TOKEN_HERE"
    echo "  4. Or set KOYEB_TOKEN environment variable: export KOYEB_TOKEN=your_token_here"
    exit 1
fi

echo "✅ Logged in to Koyeb as $(koyeb whoami)"

# Verify environment variables are set
echo "📋 Checking environment variables..."
REQUIRED_VARS=(
    "DJANGO_SECRET_KEY"
    "POSTGRES_URL"
    "GOOGLE_OAUTH2_CLIENT_ID"
    "GOOGLE_OAUTH2_CLIENT_SECRET"
    "BBGITHUB_OAUTH2_CLIENT_SECRET"
    "BBGITHUB_TOKEN"
    "REDIS_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "⚠️ Warning: $var is not set in environment"
    else
        echo "✅ $var is set"
    fi
done

# Create app if it doesn't exist
echo "🏗️ Creating/verifying Koyeb app..."
koyeb app init harvestconnect || echo "App harvestconnect already exists"

# Deploy backend service with all environment variables
echo " ↑ Deploying backend service..."
koyeb service init harvestconnect-backend --app harvestconnect --type web || echo "Backend service already exists"

koyeb service deploy harvestconnect-backend \
    --app harvestconnect \
    --git https://github.com/dbillion/harvestconnect.git \
    --git-branch main \
    --git-builder docker \
    --git-dockerfile backend/Dockerfile \
    --ports "8000:http" \
    --env DJANGO_SECRET_KEY="${DJANGO_SECRET_KEY}" \
    --env DATABASE_URL="${POSTGRES_URL:-${DATABASE_URL}}" \
    --env GOOGLE_OAUTH2_CLIENT_ID="${GOOGLE_OAUTH2_CLIENT_ID}" \
    --env GOOGLE_OAUTH2_CLIENT_SECRET="${GOOGLE_OAUTH2_CLIENT_SECRET}" \
    --env BBGITHUB_OAUTH2_CLIENT_SECRET="${BBGITHUB_OAUTH2_CLIENT_SECRET}" \
    --env BBGITHUB_TOKEN="${BBGITHUB_TOKEN}" \
    --env REDIS_URL="${REDIS_URL}" \
    --env GOOGLE_GEMINI_API_KEY="${GOOGLE_GEMINI_API_KEY}" \
    --env KOYEB_TOKEN="${KOYEB_TOKEN}" \
    --env NETLIFY_AUTH_TOKEN="${NETLIFY_AUTH_TOKEN}" \
    --env DEBUG="False" \
    --instance-type free \
    --scale-min 1 \
    --scale-max 1

# Deploy frontend service
echo " ↑ Deploying frontend service..."
koyeb service init harvestconnect-frontend --app harvestconnect --type web || echo "Frontend service already exists"

koyeb service deploy harvestconnect-frontend \
    --app harvestconnect \
    --git https://github.com/dbillion/harvestconnect.git \
    --git-branch main \
    --git-builder docker \
    --git-docker-dockerfile harvestconnect/Dockerfile \
    --ports "3000:http" \
    --env NEXT_PUBLIC_API_URL="https://harvestconnect-backend-koyeb.app/api" \
    --env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}" \
    --env GOOGLE_GEMINI_API_KEY="${GOOGLE_GEMINI_API_KEY}" \
    --env GOOGLE_OAUTH2_CLIENT_ID="${GOOGLE_OAUTH2_CLIENT_ID}" \
    --env NODE_ENV="production" \
    --instance-type free \
    --scale-min 1 \
    --scale-max 1

echo "🎉 Deployment initiated!"
echo ""
echo "📊 Check deployment status with:"
echo "   koyeb service list --app harvestconnect"
echo "   koyeb deployment list --service harvestconnect-backend"
echo "   koyeb deployment list --service harvestconnect-frontend"
echo ""
echo "🌐 Your app will be available at:"
echo "   Backend: https://harvestconnect-backend-koyeb.app"
echo "   Frontend: https://harvestconnect-frontend-koyeb.app"
echo "   Combined: https://harvestconnect-koyeb.app"
echo ""
echo "📝 Note: The first deployment may take 5-10 minutes to complete."
echo "   Monitor progress with the commands above."

# Show quick access commands
echo ""
echo "🔗 Quick access commands:"
echo "   Check status: koyeb service list --app harvestconnect"
echo "   View backend logs: koyeb logs -s harvestconnect-backend"
echo "   View frontend logs: koyeb logs -s harvestconnect-frontend"
echo "   Open in browser: koyeb app open harvestconnect"
