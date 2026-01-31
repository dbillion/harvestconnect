#!/bin/bash
# Force Koyeb to rebuild without cache
# Usage: ./force-koyeb-rebuild.sh

set -e

echo "🔄 Forcing Koyeb rebuild without cache..."

# Check if KOYEB_TOKEN is set
if [ -z "$KOYEB_TOKEN" ]; then
    echo "❌ Error: KOYEB_TOKEN environment variable is not set"
    echo "Please set it with: export KOYEB_TOKEN='your-token-here'"
    exit 1
fi

# Generate timestamp for cache busting
CACHEBUST=$(date +%s)
echo "📅 Using cache bust timestamp: $CACHEBUST"

# Redeploy with cache bust
echo "🚀 Triggering Koyeb redeploy..."
koyeb service redeploy harvestconnect-backend/api \
    --docker-args "--build-arg CACHEBUST=$CACHEBUST" \
    --skip-cache

echo "✅ Redeploy triggered successfully!"
echo "📊 Monitor deployment status with: koyeb service get harvestconnect-backend/api"
