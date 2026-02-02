#!/bin/bash

# Script to build and deploy optimized Docker images to Docker Hub

set -e

echo "🚀 Starting Docker Hub deployment for HarvestConnect..."

# Check if required environment variables are set
if [ -z "$DOCKERHUB_USERNAME" ] || [ -z "$DOCKERHUB_TOKEN" ]; then
    echo "❌ Error: DOCKERHUB_USERNAME and DOCKERHUB_TOKEN environment variables must be set"
    echo "Please set them using:"
    echo "export DOCKERHUB_USERNAME='your_username'"
    echo "export DOCKERHUB_TOKEN='your_token'"
    exit 1
fi

# Get the current git branch for tagging
BRANCH=$(git rev-parse --abbrev-ref HEAD | sed 's/\//_/g')
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    TAG="latest"
else
    TAG="$BRANCH"
fi

echo "📦 Building Docker images with tag: $TAG"

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo $DOCKERHUB_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin

# Build images using optimized script
./scripts/build-optimized-docker.sh

# Tag and push images to Docker Hub
echo "📤 Pushing images to Docker Hub..."
docker tag ${DOCKERHUB_USERNAME:-local}/harvestconnect-frontend:latest $DOCKERHUB_USERNAME/harvestconnect-frontend:$TAG
docker tag ${DOCKERHUB_USERNAME:-local}/harvestconnect-frontend:latest $DOCKERHUB_USERNAME/harvestconnect-frontend:latest
docker tag ${DOCKERHUB_USERNAME:-local}/harvestconnect-backend:latest $DOCKERHUB_USERNAME/harvestconnect-backend:$TAG
docker tag ${DOCKERHUB_USERNAME:-local}/harvestconnect-backend:latest $DOCKERHUB_USERNAME/harvestconnect-backend:latest

docker push $DOCKERHUB_USERNAME/harvestconnect-frontend:$TAG
docker push $DOCKERHUB_USERNAME/harvestconnect-frontend:latest
docker push $DOCKERHUB_USERNAME/harvestconnect-backend:$TAG
docker push $DOCKERHUB_USERNAME/harvestconnect-backend:latest

echo "✅ Docker images built and pushed successfully!"
echo ""
echo "Frontend: $DOCKERHUB_USERNAME/harvestconnect-frontend:$TAG"
echo "Backend: $DOCKERHUB_USERNAME/harvestconnect-backend:$TAG"
echo ""
echo "📊 Image sizes:"
docker images | grep harvestconnect-frontend
docker images | grep harvestconnect-backend
echo ""
echo "🔄 To deploy to Koyeb, set up the following secrets in your GitHub repository:"
echo "   - DOCKERHUB_USERNAME: your_dockerhub_username"
echo "   - DOCKERHUB_TOKEN: your_dockerhub_token"
echo "   - KOYEB_TOKEN: your_koyeb_api_token"
echo "   - All application environment variables (DATABASE_URL, SECRET_KEY, etc.)"
echo ""
echo "🚀 The GitHub Actions workflow (.github/workflows/docker-hub-deploy.yml) will handle automatic deployment on push to main branch."

# Logout from Docker Hub
docker logout
