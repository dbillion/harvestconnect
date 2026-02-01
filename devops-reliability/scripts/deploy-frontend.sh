#!/bin/bash

# HarvestConnect Frontend Deployment Script for Netlify
# This script automates the deployment process for the frontend to Netlify

set -e  # Exit on any error

# Configuration
FRONTEND_DIR="./harvestconnect"
NETLIFY_SITE_ID="${NETLIFY_SITE_ID:-}"
NETLIFY_AUTH_TOKEN="${NETLIFY_AUTH_TOKEN:-}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:-}"

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
    
    if [ -z "$NETLIFY_SITE_ID" ]; then
        log_error "NETLIFY_SITE_ID environment variable is not set"
        exit 1
    fi
    
    if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
        log_error "NETLIFY_AUTH_TOKEN environment variable is not set"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        log_error "NEXT_PUBLIC_API_URL environment variable is not set"
        exit 1
    fi
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "Frontend directory $FRONTEND_DIR does not exist"
        exit 1
    fi
    
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        log_error "package.json not found in $FRONTEND_DIR"
        exit 1
    fi
    
    # Check if netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        log_error "Netlify CLI is not installed. Please install it with: npm install -g netlify-cli"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Install dependencies
install_dependencies() {
    log "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Dependencies installed"
}

# Build the frontend
build_frontend() {
    log "Building frontend..."
    
    # Set environment variables for build
    export NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL"
    export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    export NODE_OPTIONS="--max_old_space_size=4096"
    
    npm run build
    
    log_success "Frontend built successfully"
}

# Deploy to Netlify
deploy_to_netlify() {
    log "Deploying to Netlify..."
    
    # Set Netlify environment variables
    export NETLIFY_SITE_ID="$NETLIFY_SITE_ID"
    export NETLIFY_AUTH_TOKEN="$NETLIFY_AUTH_TOKEN"
    
    # Deploy to production
    netlify deploy --dir=.next --prod --message="Automated deployment $(date)" --auth="$NETLIFY_AUTH_TOKEN"
    
    log_success "Frontend deployed to Netlify"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Get the deployment URL
    DEPLOY_URL=$(netlify status --json | jq -r '.site.urls.primary')
    
    if [ -n "$DEPLOY_URL" ] && [ "$DEPLOY_URL" != "null" ]; then
        log_success "Deployment verified: $DEPLOY_URL"
        
        # Basic health check
        sleep 10 # Wait for deployment to be ready
        if curl -f -s "$DEPLOY_URL" > /dev/null; then
            log_success "Site is accessible"
        else
            log_warn "Site may not be fully ready yet, but deployment appears successful"
        fi
    else
        log_warn "Could not verify deployment URL automatically"
    fi
}

# Main deployment function
deploy_frontend() {
    log "Starting HarvestConnect frontend deployment to Netlify..."
    
    check_prerequisites
    install_dependencies
    build_frontend
    deploy_to_netlify
    verify_deployment
    
    log_success "Frontend deployment completed successfully!"
    
    # Print deployment information
    echo ""
    echo "=========================================="
    echo "DEPLOYMENT SUMMARY"
    echo "=========================================="
    echo "Frontend Directory: $FRONTEND_DIR"
    echo "Netlify Site ID: $NETLIFY_SITE_ID"
    echo "API URL: $NEXT_PUBLIC_API_URL"
    echo "Deployment Time: $(date)"
    echo "=========================================="
}

# Rollback function (if needed)
rollback_deployment() {
    log_warn "Rollback functionality would go here"
    # Implementation depends on Netlify's rollback capabilities
}

# Parse command line arguments
case "${1:-}" in
    deploy)
        deploy_frontend
        ;;
    rollback)
        rollback_deployment
        ;;
    check-prereqs)
        check_prerequisites
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|check-prereqs}"
        echo "  deploy         - Deploy frontend to Netlify"
        echo "  rollback       - Rollback to previous deployment"
        echo "  check-prereqs  - Check if all prerequisites are met"
        exit 1
        ;;
esac