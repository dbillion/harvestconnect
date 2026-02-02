# Koyeb Deployment Instructions

## Prerequisites

1. **Install Koyeb CLI:**
```bash
curl -fsSL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
export PATH="$HOME/.koyeb/bin:$PATH"
```

2. **Get Koyeb API Token:**
   - Go to https://app.koyeb.com/account/api-tokens
   - Create a new API token
   - Set it as an environment variable: `export KOYEB_TOKEN=your_token_here`

3. **Install Docker** (for local development)

## Local Development

### 1. Set up environment variables
Make sure your `.env` file is properly configured with all the required variables.

### 2. Start local services
```bash
docker compose up --build -d
```

### 3. Check services status
```bash
docker compose ps
```

### 4. View logs
```bash
docker compose logs backend
docker compose logs frontend
```

### 5. Stop services
```bash
docker compose down
```

## Koyeb Deployment

### 1. Manual Deployment (Recommended for first time)
```bash
./deploy-to-koyeb.sh
```

### 2. GitHub Actions Deployment (Automated)
The workflow is configured in `.github/workflows/deploy-koyeb.yml` and will automatically deploy on pushes to main branch.

### 3. Manual CLI Deployment
```bash
# Log in to Koyeb
koyeb login --token $KOYEB_TOKEN

# Create app
koyeb app init harvestconnect

# Deploy backend
koyeb service deploy harvestconnect-backend \
    --app harvestconnect \
    --git https://github.com/dbillion/harvestconnect.git \
    --git-branch main \
    --git-builder docker \
    --git-docker-dockerfile backend/Dockerfile \
    --ports "8000:http" \
    --env-file .env \
    --instance-type free

# Deploy frontend
koyeb service deploy harvestconnect-frontend \
    --app harvestconnect \
    --git https://github.com/dbillion/harvestconnect.git \
    --git-branch main \
    --git-builder docker \
    --git-docker-dockerfile harvestconnect/Dockerfile \
    --ports "3000:http" \
    --env NEXT_PUBLIC_API_URL=https://harvestconnect-backend-koyeb.app/api \
    --env-file .env \
    --instance-type free
```

## Environment Variables Required for Koyeb

The following environment variables should be configured in your Koyeb service or GitHub Secrets:

### Database Configuration
- `DATABASE_URL`: PostgreSQL database URL (Neon or other)
- `POSTGRES_URL`: Primary PostgreSQL connection string

### Django Configuration
- `DJANGO_SECRET_KEY`: Django secret key
- `DEBUG`: Set to False for production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

### OAuth Configuration
- `GOOGLE_OAUTH2_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_OAUTH2_CLIENT_SECRET`: Google OAuth client secret
- `BBGITHUB_OAUTH2_CLIENT_SECRET`: GitHub OAuth client secret
- `BBGITHUB_TOKEN`: GitHub token

### Cloud Services
- `GOOGLE_GEMINI_API_KEY`: Google Gemini API key
- `KOYEB_TOKEN`: Koyeb API token
- `NETLIFY_AUTH_TOKEN`: Netlify auth token
- `REDIS_URL`: Redis connection URL

### Frontend Configuration
- `NEXT_PUBLIC_API_URL`: API URL for frontend
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## URLs After Deployment

- **Backend API**: `https://harvestconnect-backend-koyeb.app`
- **Frontend**: `https://harvestconnect-frontend-koyeb.app`
- **Admin Panel**: `https://harvestconnect-backend-koyeb.app/admin`

## Monitoring

Check deployment status:
```bash
koyeb service list --app harvestconnect
koyeb deployment list --service harvestconnect-backend
koyeb deployment list --service harvestconnect-frontend
```

View logs:
```bash
koyeb logs -s harvestconnect-backend
koyeb logs -s harvestconnect-frontend
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all required environment variables are set
2. **Database connection fails**: Verify PostgreSQL connection string format
3. **Redis connection fails**: Check Redis URL format
4. **Migration issues**: Ensure database is accessible during deployment

### Health Checks:
- Backend health: `https://harvestconnect-backend-koyeb.app/health/`
- Frontend: `https://harvestconnect-frontend-koyeb.app/`

## Scaling

To scale your services:
```bash
koyeb service update harvestconnect-backend --scale-min 1 --scale-max 3
koyeb service update harvestconnect-frontend --scale-min 1 --scale-max 3
```

## Rollback

To rollback to a previous deployment:
```bash
koyeb deployment list --service harvestconnect-backend
koyeb deployment rollback --deployment-id DEPLOYMENT_ID