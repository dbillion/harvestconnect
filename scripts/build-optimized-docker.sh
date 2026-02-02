#!/bin/bash

# Optimized script to build Docker images with proper caching and error handling

set -e

echo "🚀 Starting optimized Docker build for HarvestConnect..."

# Function to build frontend
build_frontend() {
    echo "🏗️ Building frontend image..."
    
    # Check if package-lock.json exists
    if [ ! -f "harvestconnect/package-lock.json" ]; then
        echo "⚠️ package-lock.json not found, creating it..."
        cd harvestconnect
        npm install --package-lock-only
        cd ..
    fi
    
    # Build with proper caching
    docker build \
        --target runner \
        --cache-from ${DOCKERHUB_USERNAME:-local}/harvestconnect-frontend:latest \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        -t ${DOCKERHUB_USERNAME:-local}/harvestconnect-frontend:latest \
        -t ${DOCKERHUB_USERNAME:-local}/harvestconnect-frontend:${GITHUB_SHA:-dev} \
        -f harvestconnect/Dockerfile ./harvestconnect
    
    echo "✅ Frontend build completed"
}

# Function to build backend
build_backend() {
    echo "🏗️ Building backend image..."
    
    docker build \
        --target production \
        --cache-from ${DOCKERHUB_USERNAME:-local}/harvestconnect-backend:latest \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        -t ${DOCKERHUB_USERNAME:-local}/harvestconnect-backend:latest \
        -t ${DOCKERHUB_USERNAME:-local}/harvestconnect-backend:${GITHUB_SHA:-dev} \
        -f backend/Dockerfile ./backend
    
    echo "✅ Backend build completed"
}

# Main execution
if [ "$1" = "frontend" ] || [ -z "$1" ]; then
    build_frontend
fi

if [ "$1" = "backend" ] || [ -z "$1" ]; then
    build_backend
fi

echo "📊 Built images:"
docker images | grep harvestconnect | head -10

echo "🎉 Docker build process completed successfully!"