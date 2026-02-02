# HarvestConnect Koyeb Backend Deployment

## Overview

This document describes the deployment process for the HarvestConnect Django backend to Koyeb, with integration to the Netlify frontend.

## Prerequisites

### 1. Install Koyeb CLI
```bash
curl -sfL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
```

### 2. Log in to Koyeb
```bash
koyeb auth login
```

### 3. Verify Installation
```bash
koyeb --version
koyeb whoami
```

## Deployment Process

### Option 1: Automated Deployment (Recommended)
```bash
# Run the full stack deployment script
./deploy-full-stack.sh

# Or deploy backend only
./scripts/deploy-koyeb-backend.sh
```

### Option 2: Manual Deployment Steps

#### Step 1: Prepare Backend for Deployment
```bash
cd backend

# Ensure Procfile exists
echo "web: gunicorn harvestconnect.wsgi:application --bind 0.0.0.0:\$PORT" > Procfile

# Create .koyebignore
cat > .koyebignore << 'EOF'
*.pyc
__pycache__/
.git
.gitignore
README.md
Dockerfile
.dockerignore
*.env
.env.local
node_modules/
*.log
.coverage
*.swp
*.swo
.DS_Store
Thumbs.db
EOF
```

#### Step 2: Deploy to Koyeb
```bash
koyeb service deploy \
    --name=harvestconnect-backend-$(date +%s) \
    --ports=8000:http \
    --routes=/:8000 \
    --env="PORT=8000" \
    --env="DEBUG=False" \
    --env="SECRET_KEY=$(openssl rand -base64 32)" \
    --env="DATABASE_URL=sqlite:///db.sqlite3" \
    --env="KOYEB_DEPLOYMENT=true" \
    --dockerfile=. \
    --force
```

#### Step 3: Get Backend URL
```bash
koyeb service list
# Or check the specific service
koyeb service inspect <service-name>
```

#### Step 4: Configure Frontend
```bash
# Set the backend URL in frontend environment
cd harvestconnect
echo "NEXT_PUBLIC_API_URL=<your-backend-url>" > .env.local
```

## Environment Variables

### Backend (Django) - Set in Koyeb
- `PORT`: Port number (8000)
- `DEBUG`: Debug mode (False for production)
- `SECRET_KEY`: Django secret key
- `DATABASE_URL`: Database connection string
- `KOYEB_DEPLOYMENT`: Flag for production settings

### Frontend (Next.js) - Set in Netlify
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_BASE_URL`: Base application URL

## Security Configuration

### Django Production Settings
- SSL redirection enabled
- HSTS headers configured
- Secure cookie settings
- CORS configured for Netlify domains
- CSRF protection enhanced

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    'https://*.netlify.app',           # Netlify deployments
    'https://harvestconnect.netlify.app',  # Specific site
    'http://localhost:3000',          # Local development
    'http://localhost:3001',          # Alternative port
]
```

## Health Checks

### Backend Health Endpoint
```
GET /api/health/
```

### Frontend API Connectivity
The frontend will automatically test connectivity to the backend API.

## Troubleshooting

### Common Issues

1. **Deployment fails due to build timeout**
   - Check Dockerfile for large dependencies
   - Optimize requirements.txt
   - Use multi-stage builds

2. **CORS errors**
   - Verify CORS_ALLOWED_ORIGINS in Django settings
   - Check frontend NEXT_PUBLIC_API_URL

3. **Database migration issues**
   - Run migrations manually if needed:
   ```bash
   koyeb exec service <service-name> -- python manage.py migrate
   ```

### Useful Commands

```bash
# Check service status
koyeb service list

# View logs
koyeb service logs <service-name>

# Inspect service
koyeb service inspect <service-name>

# Scale service
koyeb service scale <service-name> --instances=1

# Rollback deployment
koyeb deployment rollback <service-name>/<deployment-id>
```

## Post-Deployment Steps

1. Verify backend health: `curl https://<your-service>.koyeb.app/api/health/`
2. Update frontend environment variables
3. Test API connectivity
4. Monitor logs for any issues
5. Set up custom domain if needed

## Rollback Procedure

If issues occur, you can rollback to a previous deployment:
```bash
koyeb deployment list <service-name>
koyeb deployment rollback <service-name>/<previous-deployment-id>
```

## Monitoring

Monitor your deployment through:
- Koyeb Dashboard: https://app.koyeb.com
- Service logs: `koyeb service logs <service-name>`
- Health endpoints: `/api/health/`