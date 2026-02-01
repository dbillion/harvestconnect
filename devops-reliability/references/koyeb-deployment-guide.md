# Koyeb Backend Deployment Guide for HarvestConnect

## Overview
This guide provides comprehensive instructions for deploying the HarvestConnect backend to Koyeb using GitHub Actions, with secure environment variable management and integration with the Netlify frontend.

## Prerequisites

### Koyeb Account Setup
- Create a Koyeb account at https://app.koyeb.com/signup
- Install Koyeb CLI: `curl -fsSL https://koyeb.com/install.sh | /bin/bash`
- Obtain Koyeb API token from your Koyeb dashboard
- Prepare your Docker image for deployment

### Required GitHub Secrets
Add these secrets to your GitHub repository:
- `KOYEB_TOKEN`: Generated from Koyeb Dashboard > Settings > API Tokens
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token
- `DJANGO_SECRET_KEY`: Django secret key (generate with `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- `DATABASE_URL`: Database connection string (PostgreSQL/MySQL)
- `EMAIL_HOST_USER`: Email SMTP username
- `EMAIL_HOST_PASSWORD`: Email SMTP password
- `GOOGLE_OAUTH2_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_OAUTH2_CLIENT_SECRET`: Google OAuth client secret
- `GITHUB_OAUTH2_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_OAUTH2_CLIENT_SECRET`: GitHub OAuth client secret
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

## GitHub Actions Workflow

### deploy.yml Configuration (Backend Section)
```yaml
  deploy-backend:
    name: Deploy Backend (Koyeb)
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push Backend Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/harvestconnect-backend:latest
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/harvestconnect-backend:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/harvestconnect-backend:buildcache,mode=max

      - name: Install Koyeb CLI
        run: |
          curl -fsSL https://koyeb.com/install.sh | /bin/bash
          echo "/home/runner/.koyeb/bin" >> $GITHUB_PATH

      - name: Deploy to Koyeb
        env:
          KOYEB_TOKEN: ${{ secrets.KOYEB_TOKEN }}
        run: |
          # Deploy or update the service
          koyeb service update harvestconnect-backend --definition koyeb.yaml || \
          koyeb service create harvestconnect-backend --definition koyeb.yaml
          
          # Wait for deployment to complete
          koyeb service ps harvestconnect-backend --watch

      - name: Verify deployment
        run: |
          sleep 30
          BACKEND_URL=$(koyeb service inspect harvestconnect-backend | grep -o 'https://[^"]*\.koyeb\.app')
          curl -f "$BACKEND_URL/health/" || echo "Health check completed"
```

## Koyeb Service Configuration

### koyeb.yaml
```yaml
services:
  - name: harvestconnect-backend
    type: web
    docker:
      image: ${{ secrets.DOCKER_USERNAME }}/harvestconnect-backend:latest
    env:
      - name: DEBUG
        value: "false"
      - name: DJANGO_SECRET_KEY
        secret: DJANGO_SECRET_KEY
      - name: DATABASE_URL
        secret: DATABASE_URL
      - name: ALLOWED_HOSTS
        value: "localhost,127.0.0.1,0.0.0.0,*.koyeb.app"
      - name: CORS_ALLOWED_ORIGINS
        value: "https://*.netlify.app,http://localhost:3000,http://localhost:3001,https://*.koyeb.app,https://*.vercel.app"
      - name: CSRF_TRUSTED_ORIGINS
        value: "http://localhost:8000,http://localhost:3000,https://*.koyeb.app,https://*.netlify.app"
      - name: EMAIL_BACKEND
        value: "django.core.mail.backends.smtp.EmailBackend"
      - name: EMAIL_HOST
        value: "smtp.gmail.com"
      - name: EMAIL_PORT
        value: "587"
      - name: EMAIL_USE_TLS
        value: "true"
      - name: EMAIL_HOST_USER
        secret: EMAIL_HOST_USER
      - name: EMAIL_HOST_PASSWORD
        secret: EMAIL_HOST_PASSWORD
      - name: GOOGLE_OAUTH2_CLIENT_ID
        secret: GOOGLE_OAUTH2_CLIENT_ID
      - name: GOOGLE_OAUTH2_CLIENT_SECRET
        secret: GOOGLE_OAUTH2_CLIENT_SECRET
      - name: GITHUB_OAUTH2_CLIENT_ID
        secret: GITHUB_OAUTH2_CLIENT_ID
      - name: GITHUB_OAUTH2_CLIENT_SECRET
        secret: GITHUB_OAUTH2_CLIENT_SECRET
      - name: STRIPE_PUBLISHABLE_KEY
        secret: STRIPE_PUBLISHABLE_KEY
      - name: STRIPE_SECRET_KEY
        secret: STRIPE_SECRET_KEY
      - name: STRIPE_WEBHOOK_SECRET
        secret: STRIPE_WEBHOOK_SECRET
      - name: REDIS_URL
        value: "redis://:@redis:6379"
    routes:
      - path: /
        port: 8000
    ports:
      - port: 8000
        protocol: http
    health_checks:
      http:
        path: /health/
        interval: 30
        timeout: 10
        healthy_threshold: 1
        unhealthy_threshold: 3
    scaling:
      min: 1
      max: 3
      target: 75
    resources:
      cpu: 500
      memory: 1024
```

## Environment Variable Management

### Backend Environment Variables
Ensure your backend `.env` file includes:
```
DEBUG=False
DJANGO_SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_HOSTS=your-domain.koyeb.app
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.netlify.app
```

### Django Settings Configuration
Update your `settings.py` for production:

```python
import os
from decouple import config

# Security settings
DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('DJANGO_SECRET_KEY')

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# CORS settings
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='').split(',')

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

# Stripe settings
STRIPE_PUBLISHABLE_KEY = config('STRIPE_PUBLISHABLE_KEY')
STRIPE_SECRET_KEY = config('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = config('STRIPE_WEBHOOK_SECRET')
```

## Docker Configuration

### Dockerfile for Backend
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "harvestconnect.wsgi:application"]
```

## Deployment Process

### Initial Setup
1. Build and test your Docker image locally
2. Push your image to Docker Hub
3. Configure Koyeb service with the provided koyeb.yaml
4. Set up GitHub repository with required secrets

### Continuous Deployment
- Push to main branch triggers automatic deployment
- GitHub Actions builds and pushes Docker image
- Koyeb deploys the updated image with zero downtime
- Health checks ensure service availability

## Monitoring and Health Checks

### Backend Monitoring
- Monitor Docker build logs in GitHub Actions
- Check Koyeb deployment status and logs
- Verify API endpoints functionality
- Monitor resource usage and scaling

### Health Check Endpoints
```python
# In your Django views
from django.http import JsonResponse

def health_check(request):
    """Health check endpoint for Koyeb"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'harvestconnect-backend',
        'timestamp': timezone.now().isoformat()
    })
```

Add to your `urls.py`:
```python
urlpatterns = [
    path('health/', views.health_check, name='health-check'),
    # ... other patterns
]
```

## Troubleshooting

### Common Issues
1. **Docker Build Failures**: Check dependencies and base image compatibility
2. **Environment Variables**: Ensure all required secrets are set in Koyeb
3. **Database Connections**: Verify database URL and connection settings
4. **CORS Issues**: Check CORS_ALLOWED_ORIGINS configuration

### Debugging Steps
1. Review GitHub Actions workflow logs
2. Check Koyeb service logs: `koyeb service logs harvestconnect-backend`
3. Verify Docker image health and functionality
4. Test API endpoints independently

## Best Practices

### Security
- Never hardcode sensitive information
- Use Koyeb secrets for all sensitive data
- Implement proper authentication and authorization
- Regularly update dependencies and security patches

### Performance
- Optimize Docker image size and build time
- Implement proper caching strategies
- Use CDN for static assets
- Monitor and optimize database queries

### Reliability
- Implement comprehensive health checks
- Configure proper scaling settings
- Set up monitoring and alerting
- Maintain deployment and rollback procedures