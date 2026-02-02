#!/bin/bash

echo "🔍 Checking local docker-compose status..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check compose status
echo ""
echo "📊 Docker Compose Services:"
docker compose ps

echo ""
echo "📈 Service Status:"

# Check backend
BACKEND_STATUS=$(docker compose ps backend --format "{{.Status}}" 2>/dev/null || echo "Not running")
if [[ "$BACKEND_STATUS" =~ "Up" ]]; then
    echo "✅ Backend: Running (${BACKEND_STATUS})"
else
    echo "❌ Backend: ${BACKEND_STATUS}"
fi

# Check frontend
FRONTEND_STATUS=$(docker compose ps frontend --format "{{.Status}}" 2>/dev/null || echo "Not running")
if [[ "$FRONTEND_STATUS" =~ "Up" ]]; then
    echo "✅ Frontend: Running (${FRONTEND_STATUS})"
else
    echo "❌ Frontend: ${FRONTEND_STATUS}"
fi

# Check redis
REDIS_STATUS=$(docker compose ps redis --format "{{.Status}}" 2>/dev/null || echo "Not running")
if [[ "$REDIS_STATUS" =~ "Up" ]]; then
    echo "✅ Redis: Running (${REDIS_STATUS})"
else
    echo "❌ Redis: ${REDIS_STATUS}"
fi

# Check nginx
NGINX_STATUS=$(docker compose ps nginx --format "{{.Status}}" 2>/dev/null || echo "Not running")
if [[ "$NGINX_STATUS" =~ "Up" ]]; then
    echo "✅ Nginx: Running (${NGINX_STATUS})"
else
    echo "❌ Nginx: ${NGINX_STATUS}"
fi

echo ""
echo "🌐 Access URLs:"
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   Admin: http://localhost:8000/admin"

echo ""
echo "📝 To view logs:"
echo "   Backend: docker compose logs backend"
echo "   Frontend: docker compose logs frontend"
echo "   Redis: docker compose logs redis"
echo "   Nginx: docker compose logs nginx"

echo ""
echo "🔄 To restart services:"
echo "   docker compose down && docker compose up --build -d"