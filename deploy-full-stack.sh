#!/bin/bash
# HarvestConnect Full Stack Deployment Script

set -e

echo "🌾 HarvestConnect Full Stack Deployment"
echo "======================================"

echo ""
echo "This script will:"
echo "1. Deploy Django backend to Koyeb"
echo "2. Wait for backend to be ready"
echo "3. Configure frontend with backend URL"
echo "4. Provide deployment summary"
echo ""

# Function to display menu
show_menu() {
    echo ""
    echo "Choose deployment option:"
    echo "1) Deploy backend to Koyeb only"
    echo "2) Configure frontend after backend deployment"
    echo "3) Full stack deployment (backend first, then frontend)"
    echo "4) Check deployment status"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
}

# Function to deploy backend
deploy_backend() {
    echo "🚀 Deploying Django backend to Koyeb..."
    
    if [ -f "scripts/deploy-koyeb-optimized.sh" ]; then
        chmod +x scripts/deploy-koyeb-optimized.sh
        ./scripts/deploy-koyeb-optimized.sh
    elif [ -f "scripts/deploy-koyeb-backend.sh" ]; then
        chmod +x scripts/deploy-koyeb-backend.sh
        ./scripts/deploy-koyeb-backend.sh
    else
        echo "❌ Backend deployment script not found"
        exit 1
    fi
}

# Function to configure frontend
configure_frontend() {
    echo "🔧 Configuring frontend with backend URL..."
    
    if [ -f "scripts/configure-frontend-after-deployment.sh" ]; then
        chmod +x scripts/configure-frontend-after-deployment.sh
        ./scripts/configure-frontend-after-deployment.sh
    else
        echo "❌ Frontend configuration script not found"
        exit 1
    fi
}

# Function to check deployment status
check_status() {
    echo "📊 Checking deployment status..."
    
    if command -v koyeb &> /dev/null; then
        echo "Koyeb services:"
        koyeb service list || echo "❌ Could not get Koyeb services"
    else
        echo "❌ Koyeb CLI not installed"
    fi
    
    echo ""
    echo "Netlify sites:"
    if command -v netlify &> /dev/null; then
        netlify sites:list || echo "❌ Could not get Netlify sites"
    else
        echo "❌ Netlify CLI not installed"
    fi
}

# Main menu loop
while true; do
    show_menu
    
    case $choice in
        1)
            deploy_backend
            ;;
        2)
            configure_frontend
            ;;
        3)
            echo "🚀 Starting full stack deployment..."
            deploy_backend
            echo ""
            echo "⏳ Waiting for backend to be ready (this may take 2-5 minutes)..."
            sleep 300  # Wait 5 minutes for deployment to complete
            
            echo "🔧 Now configuring frontend..."
            configure_frontend
            ;;
        4)
            check_status
            ;;
        5)
            echo "👋 Exiting deployment script..."
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1-5."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done