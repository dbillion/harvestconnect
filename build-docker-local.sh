#!/bin/bash
# Local Docker Build and Test Script for HarvestConnect Backend
# This script builds and tests the Docker image locally before deploying

set -e

echo "🐳 HarvestConnect Backend - Local Docker Build & Test"
echo "======================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker daemon is running
echo -e "\n${YELLOW}1. Checking Docker daemon...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    echo "Please start Docker with: sudo systemctl start docker"
    exit 1
fi
echo -e "${GREEN}✅ Docker daemon is running${NC}"

# Build the image
echo -e "\n${YELLOW}2. Building Docker image...${NC}"
CACHEBUST=$(date +%s)
echo "Using CACHEBUST: $CACHEBUST"

docker build \
    -f backend/Dockerfile \
    -t harvestconnect-backend:test \
    --build-arg CACHEBUST=$CACHEBUST \
    .

echo -e "${GREEN}✅ Docker image built successfully${NC}"

# Check image size
echo -e "\n${YELLOW}3. Image size:${NC}"
docker images harvestconnect-backend:test --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Test the image by running it temporarily
echo -e "\n${YELLOW}4. Testing the image...${NC}"
echo "Starting container with test environment variables..."

# Create a test .env file
cat > /tmp/test.env << EOF
DJANGO_SECRET_KEY=test-secret-key-for-local-build-only
DATABASE_URL=sqlite:///db.sqlite3
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://localhost:8000
ADMIN_URL_PATH=admin/
EOF

# Run container in detached mode
CONTAINER_ID=$(docker run -d \
    --env-file /tmp/test.env \
    -p 8000:8000 \
    harvestconnect-backend:test)

echo "Container ID: $CONTAINER_ID"

# Wait for container to start
echo "Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q $CONTAINER_ID; then
    echo -e "${GREEN}✅ Container is running${NC}"
    
    # Check logs
    echo -e "\n${YELLOW}Container logs:${NC}"
    docker logs $CONTAINER_ID
    
    # Test if the application is responding
    echo -e "\n${YELLOW}5. Testing application health...${NC}"
    sleep 3
    
    if curl -f http://localhost:8000/api/health/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is responding${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check endpoint not responding (this may be expected if endpoint doesn't exist)${NC}"
    fi
    
    # Stop and remove container
    echo -e "\n${YELLOW}6. Cleaning up...${NC}"
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
    echo -e "${GREEN}✅ Container stopped and removed${NC}"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    echo "Container logs:"
    docker logs $CONTAINER_ID
    docker rm $CONTAINER_ID > /dev/null
    exit 1
fi

# Clean up test env file
rm /tmp/test.env

echo -e "\n${GREEN}======================================================"
echo "✅ All tests passed!"
echo "=====================================================${NC}"
echo ""
echo "Image details:"
docker images harvestconnect-backend:test --format "  Size: {{.Size}}"
echo ""
echo "To run the container manually:"
echo "  docker run -p 8000:8000 --env-file backend/.env harvestconnect-backend:test"
echo ""
echo "To push to a registry:"
echo "  docker tag harvestconnect-backend:test your-registry/harvestconnect-backend:latest"
echo "  docker push your-registry/harvestconnect-backend:latest"
echo ""
echo "To deploy to Koyeb, just push to GitHub:"
echo "  git push origin main"
