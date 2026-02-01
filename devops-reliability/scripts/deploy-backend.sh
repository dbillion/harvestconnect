#!/bin/bash

# HarvestConnect Backend Deployment Script for Koyeb
# This script automates the deployment process for the backend to Koyeb

set -e  # Exit on any error

# Configuration
BACKEND_DIR="./backend"
DOCKER_USERNAME="${DOCKER_USERNAME:-}"
DOCKER_PASSWORD="${DOCKER_PASSWORD:-}"
KOYEB_TOKEN="${KOYEB_TOKEN:-}"
IMAGE_NAME="${DOCKER_USERNAME}/harvestconnect-backend"
IMAGE_TAG="latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[INFO]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]$(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if [ -z "$DOCKER_USERNAME" ]; then
        log_error "DOCKER_USERNAME environment variable is not set"
        exit 1
    fi
    
    if [ -z "$DOCKER_PASSWORD" ]; then
        log_error "DOCKER_PASSWORD environment variable is not set"
        exit 1
    fi
    
    if [ -z "$KOYEB_TOKEN" ]; then
        log_error "KOYEB_TOKEN environment variable is not set"
        exit 1
    fi
    
    if [ ! -d "$BACKEND_DIR" ]; then
        log_error "Backend directory $BACKEND_DIR does not exist"
        exit 1
    fi
    
    if [ ! -f "$BACKEND_DIR/Dockerfile" ]; then
        log_error "Dockerfile not found in $BACKEND_DIR"
        exit 1
    fi
    
    if [ ! -f "$BACKEND_DIR/requirements.txt" ]; then
        log_error "requirements.txt not found in $BACKEND_DIR"
        exit 1
    fi
    
    # Check if required tools are installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl is not installed"
        exit 1
    fi
    
    # Install Koyeb CLI if not present
    if ! command -v koyeb &> /dev/null; then
        log "Installing Koyeb CLI..."
        curl -fsSL https://koyeb.com/install.sh | /bin/bash
        export PATH="$PATH:$HOME/.koyeb/bin"
    fi
    
    log_success "All prerequisites met"
}

# Login to Docker Hub
docker_login() {
    log "Logging in to Docker Hub..."
    
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    
    log_success "Successfully logged in to Docker Hub"
}

# Build Docker image
build_image() {
    log "Building Docker image..."
    
    cd "$BACKEND_DIR"
    
    # Build with cache optimization
    docker build \
        --platform linux/amd64 \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        -t "$IMAGE_NAME:$IMAGE_TAG" \
        --cache-from "$IMAGE_NAME:buildcache" \
        -f Dockerfile .
    
    log_success "Docker image built successfully: $IMAGE_NAME:$IMAGE_TAG"
}

# Tag image for cache
tag_cache_image() {
    log "Tagging image for cache..."
    
    docker tag "$IMAGE_NAME:$IMAGE_TAG" "$IMAGE_NAME:buildcache"
    
    log_success "Image tagged for cache: $IMAGE_NAME:buildcache"
}

# Push Docker image to registry
push_image() {
    log "Pushing Docker image to registry..."
    
    docker push "$IMAGE_NAME:$IMAGE_TAG"
    docker push "$IMAGE_NAME:buildcache"
    
    log_success "Docker image pushed successfully"
}

# Deploy to Koyeb
deploy_to_koyeb() {
    log "Deploying to Koyeb..."
    
    # Set Koyeb token
    export KOYEB_TOKEN="$KOYEB_TOKEN"
    
    # Check if service exists, create or update accordingly
    if koyeb service list | grep -q "harvestconnect-backend"; then
        log "Updating existing service..."
        koyeb service update harvestconnect-backend --definition koyeb.yaml
    else
        log "Creating new service..."
        koyeb service create harvestconnect-backend --definition koyeb.yaml
    fi
    
    log_success "Deployment initiated to Koyeb"
}

# Wait for deployment to complete
wait_for_deployment() {
    log "Waiting for deployment to complete..."
    
    # Wait for service to be deployed
    koyeb service ps harvestconnect-backend --watch
    
    log_success "Deployment completed successfully"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Get service information
    SERVICE_INFO=$(koyeb service inspect harvestconnect-backend 2>/dev/null || echo "")
    
    if [ -n "$SERVICE_INFO" ]; then
        # Extract the URL
        SERVICE_URL=$(echo "$SERVICE_INFO" | grep -o 'https://[^"]*\.koyeb\.app')
        
        if [ -n "$SERVICE_URL" ]; then
            log_success "Service URL: $SERVICE_URL"
            
            # Wait a bit for the service to be ready
            sleep 30
            
            # Test health endpoint
            if curl -f -s "$SERVICE_URL/health/" > /dev/null; then
                log_success "Health check passed - service is running"
            else
                log_warn "Health check failed - service may still be starting up"
            fi
        else
            log_warn "Could not extract service URL from inspection"
        fi
    else
        log_error "Could not inspect service - deployment may have failed"
        exit 1
    fi
}

# Main deployment function
deploy_backend() {
    log "Starting HarvestConnect backend deployment to Koyeb..."
    
    check_prerequisites
    docker_login
    build_image
    tag_cache_image
    push_image
    deploy_to_koyeb
    wait_for_deployment
    verify_deployment
    
    log_success "Backend deployment completed successfully!"
    
    # Print deployment information
    echo ""
    echo "=========================================="
    echo "BACKEND DEPLOYMENT SUMMARY"
    echo "=========================================="
    echo "Backend Directory: $BACKEND_DIR"
    echo "Docker Image: $IMAGE_NAME:$IMAGE_TAG"
    echo "Deployment Time: $(date)"
    echo "=========================================="
}

# Rollback function (if needed)
rollback_deployment() {
    log_warn "Rollback functionality would go here"
    # Implementation would involve Koyeb's rollback capabilities
}

# Clean up Docker images (optional)
cleanup_images() {
    log "Cleaning up Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Optionally remove the built images
    if [ "${CLEANUP_ALL:-false}" = "true" ]; then
        docker rmi "$IMAGE_NAME:$IMAGE_TAG" 2>/dev/null || true
        docker rmi "$IMAGE_NAME:buildcache" 2>/dev/null || true
    fi
    
    log_success "Docker images cleaned up"
}

# Parse command line arguments
case "${1:-}" in
    deploy)
        deploy_backend
        ;;
    rollback)
        rollback_deployment
        ;;
    check-prereqs)
        check_prerequisites
        ;;
    cleanup)
        cleanup_images
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|check-prereqs|cleanup}"
        echo "  deploy         - Deploy backend to Koyeb"
        echo "  rollback       - Rollback to previous deployment"
        echo "  check-prereqs  - Check if all prerequisites are met"
        echo "  cleanup        - Clean up Docker images"
        exit 1
        ;;
esac