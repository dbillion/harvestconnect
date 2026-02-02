#!/bin/bash

# Script to build and push optimized Docker images to Docker Hub

set -e

# Check if required environment variables are set
if [ -z "$DOCKERHUB_USERNAME" ] || [ -z "$DOCKERHUB_TOKEN" ]; then
    echo "Error: DOCKERHUB_USERNAME and DOCKERHUB_TOKEN environment variables must be set"
    exit 1
fi

# Login to Docker Hub
echo "Logging in to Docker Hub..."
echo $DOCKERHUB_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin

# Get the current git branch for tagging
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
    TAG="latest"
else
    TAG="$BRANCH"
fi

# Build and push frontend image
echo "Building frontend image..."
docker build -t $DOCKERHUB_USERNAME/harvestconnect-frontend:$TAG -f frontend/Dockerfile ./frontend
echo "Pushing frontend image..."
docker push $DOCKERHUB_USERNAME/harvestconnect-frontend:$TAG

# Build and push backend image
echo "Building backend image..."
docker build -t $DOCKERHUB_USERNAME/harvestconnect-backend:$TAG -f backend/Dockerfile ./backend
echo "Pushing backend image..."
docker push $DOCKERHUB_USERNAME/harvestconnect-backend:$TAG

echo "Docker images built and pushed successfully!"
echo "Frontend: $DOCKERHUB_USERNAME/harvestconnect-frontend:$TAG"
echo "Backend: $DOCKERHUB_USERNAME/harvestconnect-backend:$TAG"

# Logout from Docker Hub
docker logout