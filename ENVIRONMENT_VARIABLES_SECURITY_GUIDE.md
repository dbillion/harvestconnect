# Environment Variables Security Guide for HarvestConnect

## Current Security Configuration

The HarvestConnect project is properly configured to protect sensitive environment variables:

### Git Ignore Rules (`.gitignore`)
```
# Environment variables
.env
.env.local
.env.*.local
```

### Current Protected Files:
- `backend/.env` - Contains Django secrets, database config, email passwords, OAuth credentials
- `harvestconnect/.env.local` - Contains Next.js API keys, Stripe secrets, OAuth client IDs

## Best Practices for Environment Variable Management

### 1. Frontend vs Backend Secrets
- **Frontend (Next.js)**: Only use `NEXT_PUBLIC_*` variables for client-side accessible data
- **Backend (Django)**: Store all sensitive keys, passwords, and secrets server-side only

### 2. Current Secure Setup Analysis

**Backend (.env)** - Properly secured with real secrets:
```
# Django Settings
DJANGO_SECRET_KEY=django-insecure-your-secret-key-change-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Email Configuration (sensitive)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# OAuth Secrets (sensitive)
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
GITHUB_OAUTH2_CLIENT_SECRET=your-github-client-secret
```

**Frontend (.env.local)** - Properly uses NEXT_PUBLIC for client-safe data:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
STRIPE_SECRET_KEY=sk_live_... # Should be moved to backend
```

### 3. Security Recommendations

#### ❌ Issues to Fix:
1. **Stripe Secret Key** - Should be moved to backend, not frontend
2. **OAuth Client IDs** - While less sensitive, should be considered for backend-only access

#### ✅ Current Good Practices:
1. Proper `.gitignore` configuration
2. Backend handles sensitive OAuth secrets
3. Frontend only exposes public-facing variables

### 4. Secure Implementation Pattern

#### Backend Environment Variables:
```bash
# backend/.env
DJANGO_SECRET_KEY=your-real-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/db
EMAIL_HOST_PASSWORD=your-app-password-here
GOOGLE_OAUTH2_CLIENT_SECRET=real-google-secret-here
GITHUB_OAUTH2_CLIENT_SECRET=real-github-secret-here
STRIPE_SECRET_KEY=sk_live_real_stripe_secret_here
```

#### Frontend Environment Variables:
```bash
# harvestconnect/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id (public info only)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id (public info only)
```

### 5. How to Use Environment Variables Safely

#### In Backend (Django):
```python
# settings.py
import os
from django.core.management.utils import get_random_secret_key

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', get_random_secret_key())
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
```

#### In Frontend (Next.js):
```typescript
// lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Never access sensitive backend-only variables in frontend
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // ❌ This won't work!
```

### 6. Development Workflow

#### Creating Environment Files:
```bash
# Backend
cd backend
cp .env.example .env  # if example exists
# Edit .env with your actual values

# Frontend
cd harvestconnect
cp .env.local.example .env.local  # if example exists
# Edit .env.local with your actual values
```

#### Example Template Files:

**backend/.env.example:**
```bash
# Django Settings
DJANGO_SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=harvestconnect
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432

# Email
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# OAuth
GOOGLE_OAUTH2_CLIENT_ID=
GOOGLE_OAUTH2_CLIENT_SECRET=
GITHUB_OAUTH2_CLIENT_ID=
GITHUB_OAUTH2_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**harvestconnect/.env.local.example:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

### 7. Security Checklist

- [ ] All sensitive keys are in backend `.env`, not frontend
- [ ] Frontend only has `NEXT_PUBLIC_*` variables
- [ ] `.gitignore` properly excludes all `.env*` files
- [ ] Production uses different secrets than development
- [ ] No hardcoded secrets in source code
- [ ] OAuth secrets never exposed to frontend
- [ ] Stripe secret key moved to backend API endpoints

This configuration ensures that sensitive information like database passwords, email credentials, OAuth secrets, and payment processing keys remain secure and never get committed to version control.