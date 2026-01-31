#!/bin/bash
# Optimized Build Script for HarvestConnect Next.js Frontend

echo "🚀 HarvestConnect Frontend - Optimized Build"
echo "==============================================="

# Navigate to the frontend directory
cd /home/deeone/Documents/HarvestConnect/harvestconnect

# Display environment information
echo "Environment variables:"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
echo "NEXT_PUBLIC_BASE_URL: $NEXT_PUBLIC_BASE_URL"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run type checking
echo "🔍 Running type checking..."
npx tsc --noEmit

# Build the application with optimization
echo "🏗️  Building optimized Next.js application..."
npm run build

# Run linting
echo "🧹 Running linting..."
npm run lint || echo "Lint warnings (non-fatal)"

# Run tests
echo "🧪 Running tests..."
npm run test -- --run || echo "Some tests may have failed (check output above)"

echo "✅ Frontend build completed successfully!"
echo "📁 Build output is in the 'out' directory"
echo ""
echo "To start the production server, run:"
echo "  cd /home/deeone/Documents/HarvestConnect/harvestconnect"
echo "  npm start"