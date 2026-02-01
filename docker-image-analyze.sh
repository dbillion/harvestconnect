#!/bin/bash
# Docker Image Analysis Script for HarvestConnect Frontend

echo "🔍 Analyzing HarvestConnect Frontend Docker Image"
echo "================================================="

IMAGE_NAME="dbillion/harvestconnect-frontend"

# Check if image exists
if ! docker inspect $IMAGE_NAME > /dev/null 2>&1; then
    echo "❌ Image $IMAGE_NAME does not exist locally"
    echo "Pulling image..."
    docker pull $IMAGE_NAME
    if [ $? -ne 0 ]; then
        echo "❌ Failed to pull image $IMAGE_NAME"
        exit 1
    fi
fi

echo ""
echo "📦 Image Size:"
docker images $IMAGE_NAME

echo ""
echo "📋 Image History (layers):"
docker history $IMAGE_NAME

echo ""
echo "🔍 File sizes in typical locations:"
echo "Root directory sizes:"
docker run --rm $IMAGE_NAME sh -c "ls -lah / 2>/dev/null | head -20"

echo ""
echo "App directory listing:"
docker run --rm $IMAGE_NAME sh -c "ls -lah /app 2>/dev/null || ls -lah /app 2>/dev/null || echo 'App directory not found'"

echo ""
echo "Node modules size (if exists):"
docker run --rm $IMAGE_NAME sh -c "if [ -d '/app/node_modules' ]; then echo 'node_modules size:'; du -sh /app/node_modules 2>/dev/null; else echo 'No node_modules in /app'; fi"

echo ""
echo "📦 Largest directories in /app:"
docker run --rm $IMAGE_NAME sh -c "cd /app && find . -type d -exec du -sh {} \; 2>/dev/null | sort -hr | head -10"

echo ""
if command -v dive >/dev/null 2>&1; then
    echo "🔬 You can also use 'dive $IMAGE_NAME' for interactive analysis if you have dive installed"
else
    echo "💡 TIP: Install 'dive' tool for detailed interactive analysis of Docker image layers:"
    echo "   Linux: sudo apt-get install dive (or equivalent for your distro)"
    echo "   Then run: dive $IMAGE_NAME"
fi

echo ""
echo "📋 Image details:"
docker inspect --format='Size: {{.Size}} bytes
Created: {{.Created}}
OS: {{.Os}}
Architecture: {{.Architecture}}
{{range \$key, \$value := .Config.Labels }}Label: {{$key}}={{$value}}
{{end}}' $IMAGE_NAME