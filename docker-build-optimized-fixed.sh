#!/bin/bash
# Optimized Build Script for HarvestConnect Docker Images

echo \"🚀 HarvestConnect - Optimized Docker Build\"
echo \"==========================================\"

# Colors for output
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Check if Docker daemon is running
echo -e \"${YELLOW}1. Checking Docker daemon...${NC}\"
if ! docker info > /dev/null 2>&1; then
    echo -e \"${RED}❌ Docker daemon is not running${NC}\"
    echo \"Please start Docker with: sudo systemctl start docker\"
    exit 1
fi
echo -e \"${GREEN}✅ Docker daemon is running${NC}\"

# Build the frontend with the optimized Dockerfile
echo -e \"\\n${YELLOW}2. Building Optimized Frontend Image...${NC}\"
echo \"Building from Dockerfile.frontend...\"

# Make sure we're in the right directory
cd /home/deeone/Documents/HarvestConnect

# Create temporary .dockerignore if needed
if [ ! -f .dockerignore ]; then
    echo \"Creating .dockerignore for build context...\"
    cat > .dockerignore << 'EOF'
.git
.gitignore
README.md
Dockerfile*
.dockerignore
node_modules
npm-debug.log
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.next
out
.nyc_output
coverage
*.log
__pycache__
*.pyc
*.pyo
*.pyd
.Python
.pytest_cache
.hypothesis
.DS_Store
.vscode
.idea
dist
build
target
Dockerfile*
docker-compose*
*.tgz
.yarn
.pnp.*
.pnpm-store
EOF
fi

# Build frontend
CACHEBUST=$(date +%s)
echo \"Cache bust value: $CACHEBUST\"
echo \"Running: docker build -f Dockerfile.frontend -t harvestconnect-frontend:optimized .\"
docker build \\
    -f Dockerfile.frontend \\
    -t harvestconnect-frontend:optimized \\
    .

if [ $? -eq 0 ]; then
    echo -e \"${GREEN}✅ Frontend image built successfully${NC}\"
    echo -e \"${YELLOW}New frontend image size:${NC}\"
    docker images harvestconnect-frontend:optimized --format \"table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}\"
else
    echo -e \"${RED}❌ Frontend build failed${NC}\"
    exit 1
fi

# Build the backend with optimized Dockerfile
echo -e \"\\n${YELLOW}3. Building Backend Image...${NC}\"
echo \"Building from Dockerfile.corrected...\"

docker build \\
    -f Dockerfile.corrected \\
    -t harvestconnect-backend:optimized \\
    .

if [ $? -eq 0 ]; then
    echo -e \"${GREEN}✅ Backend image built successfully${NC}\"
    echo -e \"${YELLOW}Backend image size:${NC}\"
    docker images harvestconnect-backend:optimized --format \"table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}\"
else
    echo -e \"${RED}❌ Backend build failed${NC}\"
    exit 1
fi

# Show comparison of image sizes
echo -e \"\\n${BLUE}📊 Image Size Comparison:${NC}\"
echo \"Current built images:\"
docker images --format \"table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}\" | grep harvestconnect

echo -e \"\\n${GREEN}=========================================================\"
echo \"✅ Build completed successfully!\"
echo \"=========================================================${NC}\"
echo \"\"
echo \"To test the new optimized images, run:\"
echo \"  docker run -d -p 3000:3000 harvestconnect-frontend:optimized\"
echo \"\"
echo \"To push the optimized images to Docker Hub:\"
echo \"  docker tag harvestconnect-frontend:optimized dbillion/harvestconnect-frontend:latest\"
echo \"  docker tag harvestconnect-backend:optimized dbillion/harvestconnect-backend:latest\"
echo \"  docker push dbillion/harvestconnect-frontend:latest\"
echo \"  docker push dbillion/harvestconnect-backend:latest\"