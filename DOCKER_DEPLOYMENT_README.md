# Optimized Docker Deployment Guide for HarvestConnect

This guide covers the advanced Docker deployment setup for HarvestConnect, featuring optimized multi-stage builds, efficient caching, and automated deployment pipelines.

## Architecture Overview

The deployment consists of:
- **Multi-stage optimized Docker images** for frontend (Next.js) and backend (Django)
- **Efficient caching strategies** with Docker BuildKit
- **Security-hardened containers** with non-root users
- **Docker Compose orchestration** with proper service dependencies
- **Automated CI/CD pipeline** with Docker Hub and Koyeb integration

## Docker Image Optimization

### Frontend (Next.js) - Optimized Build
- **Multi-stage build** with dependency caching
- **Standalone output** for minimal runtime
- **Alpine Linux base** (~50MB base image)
- **Non-root user** execution (UID 1001)
- **Production-only dependencies** (~150MB final image)
- **Health checks** and proper signal handling

### Backend (Django) - Optimized Build
- **Multi-stage build** with production dependencies only
- **Slim Python base** with minimal system packages
- **Static file optimization** with proper collection
- **Security hardening** with non-root user
- **Health checks** and monitoring integration
- **Optimized final size** (~200MB)

## Advanced Build Features

### Build Caching Strategy
- **Layer caching** with BuildKit inline cache
- **Dependency caching** between builds
- **Incremental builds** for faster development cycles
- **Cross-platform support** (amd64/arm64)

### Security Features
- **Non-root users** in all containers
- **Read-only root filesystem** where possible
- **Restricted capabilities** and security options
- **Secret management** via environment variables

## Building Docker Images

### Local Development
```bash
# Quick build with caching
./scripts/build-optimized-docker.sh

# Build specific service
./scripts/build-optimized-docker.sh frontend
./scripts/build-optimized-docker.sh backend

# With custom Docker Hub username
export DOCKERHUB_USERNAME="your_username"
./scripts/build-optimized-docker.sh
```

### Production Deployment
```bash
# Full deployment with Docker Hub publishing
export DOCKERHUB_USERNAME="your_username"
export DOCKERHUB_TOKEN="your_token"
./scripts/deploy-docker-hub.sh
```

## Docker Compose Configuration

The compose file includes:
- **Service dependencies** with proper startup order
- **Volume management** for persistent data
- **Environment variable** injection from .env files
- **Network isolation** with custom bridge network
- **Resource limits** and restart policies
- **Health monitoring** with logging configuration

### Environment Variables
Create `.env` file with:
```bash
# Port configurations
FRONTEND_PORT=3000
BACKEND_PORT=8000
NGINX_PORT=80

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=production

# Database and Security
DATABASE_URL=postgresql://user:pass@db:5432/harvestconnect
SECRET_KEY=your-production-secret-key
DEBUG=False

# Social Authentication
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=your-google-key
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=your-google-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
```

## GitHub Actions Pipeline

### Automated Build Process
1. **Multi-platform builds** (Linux amd64/arm64)
2. **Build cache optimization** with GitHub Actions cache
3. **Security scanning** integrated
4. **Automated testing** before deployment
5. **Rolling updates** with zero downtime

### Deployment Triggers
- **Main branch**: Production deployment
- **Develop branch**: Staging deployment  
- **Pull requests**: Build verification only

## Koyeb Production Deployment

### Service Configuration
- **Auto-scaling** based on traffic
- **Load balancing** with health checks
- **Environment management** with secrets
- **Monitoring and alerts** integration
- **Rolling updates** with blue-green deployment

### Resource Allocation
- **Free tier**: 256MB RAM, 0.5 vCPU
- **Production**: 512MB+ RAM, auto-scaling
- **Database**: External PostgreSQL/Redis
- **Storage**: CDN-backed asset delivery

## Performance Optimizations

### Container Optimizations
- **Minimal base images** (Alpine Linux)
- **Multi-stage builds** eliminating build artifacts
- **Dependency deduplication** and pruning
- **Proper .dockerignore** usage

### Runtime Optimizations
- **Resource limits** and requests
- **Health check intervals** optimized
- **Graceful shutdown** handling
- **Connection pooling** for databases

## Security Best Practices

### Container Security
- **Non-root execution** in all containers
- **Read-only filesystems** where possible
- **Restricted capabilities** and syscalls
- **Secrets management** via environment

### Network Security
- **Isolated networks** for service communication
- **TLS termination** at load balancer
- **Rate limiting** and DDoS protection
- **CORS and CSRF** protection configured

## Monitoring and Operations

### Health Checks
- **Application-level** health endpoints
- **Database connectivity** checks
- **Resource utilization** monitoring
- **Log aggregation** and analysis

### Backup and Recovery
- **Database backups** automated
- **Configuration versioning** with Git
- **Rollback procedures** documented
- **Disaster recovery** planning

## Troubleshooting

### Common Issues
1. **Build failures**: Check package-lock.json exists
2. **Memory issues**: Increase Docker memory limits
3. **Port conflicts**: Verify available ports
4. **Permission errors**: Check non-root user setup

### Debugging Commands
```bash
# View container logs
docker-compose logs -f --tail=100

# Check container status
docker-compose ps

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Monitor resource usage
docker stats
```

## Deployment Verification

### Post-Deployment Checks
1. **Service health** status verification
2. **Environment variables** loaded correctly
3. **Database migrations** applied
4. **Static files** served properly
5. **SSL certificates** configured (if applicable)

### Performance Validation
- **Response times** under acceptable thresholds
- **Memory usage** within allocated limits
- **Error rates** below tolerance levels
- **Throughput** meeting expected benchmarks

## Scaling Guidelines

### Horizontal Scaling
- **Stateless services** for easy scaling
- **Database connection pooling**
- **Load balancer configuration**
- **Auto-scaling policies**

### Vertical Scaling
- **Resource allocation** increases
- **Database optimization** strategies
- **Caching layer** implementation
- **CDN integration** for static assets

This optimized deployment ensures security, performance, and reliability while maintaining developer productivity and operational efficiency.
