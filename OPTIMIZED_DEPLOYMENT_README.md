# HarvestConnect Optimized Koyeb Backend Deployment

## Overview

This document describes the optimized deployment process for the HarvestConnect Django backend to Koyeb, featuring:
- **Alpine Linux base image** for smaller footprint
- **uv package manager** for faster dependency installation
- **Redis integration** with Upstash for caching and sessions
- **Production-optimized settings** with security enhancements
- **Efficient startup script** with health checks

## Key Optimizations

### 1. Alpine Linux + uv Package Manager
- **Smaller image size**: ~50% reduction compared to standard Python images
- **Faster builds**: uv installs packages 5-10x faster than pip
- **Better security**: Minimal attack surface with fewer packages

### 2. Redis Integration
- **Upstash Redis**: Managed Redis service with global edge locations
- **Caching**: Django cache backed by Redis for better performance
- **Sessions**: Redis-backed sessions for scalability
- **Channels**: Redis-backed WebSocket channels support

### 3. Production Security
- **Non-root user**: Runs as non-root user for security
- **Health checks**: Built-in health monitoring
- **Resource limits**: Optimized worker configuration
- **SSL enforcement**: Production-ready security headers

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Netlify       │────│   Koyeb          │────│   Upstash       │
│   Frontend      │    │   Django         │    │   Redis         │
│   harvesting-   │    │   (Alpine+uv)    │    │   (Global CDN) │
│   connect.app   │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                       ┌──────────────────┐
                       │   SQLite/PostgreSQL │
                       │   Database        │
                       └──────────────────┘
```

## Deployment Process

### Option 1: Automated Deployment (Recommended)
```bash
# Run the full stack deployment script (will use optimized version)
./deploy-full-stack.sh

# Or deploy optimized backend only
./scripts/deploy-koyeb-optimized.sh
```

### Option 2: Manual Deployment

#### Step 1: Prepare for Deployment
```bash
cd backend

# Ensure optimized Dockerfile exists
ls -la Dockerfile.optimized

# Check requirements
cat requirements.txt
```

#### Step 2: Deploy with Optimized Configuration
```bash
koyeb service deploy \
    --name=harvestconnect-backend-optimized-$(date +%s) \
    --ports=8000:http \
    --routes=/:8000 \
    --env="PORT=8000" \
    --env="DEBUG=False" \
    --env="SECRET_KEY=$(openssl rand -base64 32)" \
    --env="DATABASE_URL=sqlite:///db.sqlite3" \
    --env="REDIS_URL=redis://localhost:6379" \
    --env="UPSTASH_REDIS_URL=https://intimate-cicada-9814.upstash.io" \
    --env="UPSTASH_REDIS_TOKEN=ASZWAAImcDI1MjE5NzczZGU2N2Y0Zjc0OGVmM2EzYmFkZWQwNDUwY3AyOTgxNA" \
    --env="ALLOWED_HOSTS=.koyeb.app,localhost,127.0.0.1" \
    --env="CORS_ALLOWED_ORIGINS=https://harvestingconnect.netlify.app,https://www.harvestingconnect.netlify.app,http://localhost:3000,http://localhost:3001" \
    --dockerfile="Dockerfile.optimized" \
    --context="." \
    --force
```

## Environment Variables

### Backend (Django) - Required for Production
```bash
# Core Django Settings
PORT=8000
DEBUG=False
SECRET_KEY=your-super-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis Configuration
REDIS_URL=redis://host:port
UPSTASH_REDIS_URL=https://your-cluster.upstash.io
UPSTASH_REDIS_TOKEN=your-upstash-token

# Security Settings
ALLOWED_HOSTS=.koyeb.app,your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com,https://localhost:3000
CSRF_TRUSTED_ORIGINS=https://your-domain.koyeb.app

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=app-password

# OAuth Settings
GOOGLE_OAUTH2_CLIENT_ID=your-google-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-secret
GITHUB_OAUTH2_CLIENT_ID=your-github-id
GITHUB_OAUTH2_CLIENT_SECRET=your-github-secret
```

## Performance Benefits

### Build Time Improvements
- **uv**: 5-10x faster dependency installation
- **Alpine**: Smaller base image downloads
- **Layer caching**: Optimized Docker layer reuse

### Runtime Improvements
- **Redis caching**: Sub-millisecond response times
- **Connection pooling**: Efficient database connections
- **Worker optimization**: Better resource utilization

### Security Improvements
- **Minimal base**: Fewer attack vectors
- **Non-root user**: Reduced privilege escalation risk
- **Production settings**: Hardened security configuration

## Health Monitoring

### Built-in Health Checks
- **Docker health check**: Monitors Django health endpoint
- **Koyeb health monitoring**: Platform-level health checks
- **Redis connectivity**: Ensures Redis availability

### Health Endpoints
```
GET /health/          # Django health check
GET /api/health/      # API health check
GET /api/status/      # Application status
```

## Troubleshooting

### Common Issues

1. **Redis Connection Timeout**
   ```bash
   # Check Redis configuration
   koyeb service logs <service-name> | grep redis
   
   # Verify Upstash credentials
   koyeb service update <service-name> --env="UPSTASH_REDIS_TOKEN=correct-token"
   ```

2. **Build Failures**
   ```bash
   # Check if uv is available
   docker run --rm python:3.12-alpine uv --version
   
   # Verify requirements.txt format
   cat requirements.txt | head -10
   ```

3. **Startup Delays**
   ```bash
   # Check startup script execution
   koyeb service logs <service-name> | grep startup
   
   # Monitor Redis connection
   koyeb service logs <service-name> | grep "Redis is ready"
   ```

### Useful Commands

```bash
# Check service status
koyeb service list

# View detailed logs
koyeb service logs <service-name> --lines=100

# Monitor health
koyeb service ps <service-name>

# Scale instances
koyeb service scale <service-name> --instances=2

# Check resource usage
koyeb service metrics <service-name>
```

## Migration from Previous Version

If migrating from the previous deployment:

1. **Backup current service**
   ```bash
   koyeb service backup <old-service-name>
   ```

2. **Deploy optimized version**
   ```bash
   ./scripts/deploy-koyeb-optimized.sh
   ```

3. **Update DNS/custom domains** to new service URL

4. **Verify functionality** before decommissioning old service

## Performance Tuning

### Worker Configuration
```bash
# Adjust based on traffic patterns
--env="WEB_CONCURRENCY=3"     # Number of worker processes
--env="WORKER_TIMEOUT=120"    # Worker timeout (seconds)
--env="MAX_REQUESTS=1000"     # Restart worker after requests
```

### Redis Configuration
```bash
# Optimize for your use case
--env="REDIS_MAX_CONNECTIONS=20"
--env="REDIS_SOCKET_TIMEOUT=5"
--env="REDIS_RETRY_ON_TIMEOUT=true"
```

## Scaling Recommendations

### Traffic-Based Scaling
- **Low traffic**: 1 instance, basic Redis plan
- **Medium traffic**: 2-3 instances, standard Redis
- **High traffic**: Auto-scaling, premium Redis cluster

### Resource Allocation
- **CPU**: 0.5-2 vCPUs depending on workload
- **RAM**: 1-4 GB based on concurrent users
- **Storage**: SSD for database performance

This optimized deployment provides significantly better performance, security, and resource efficiency compared to the standard deployment.