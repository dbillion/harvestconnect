# Deploy HarvestConnect

## Goal
Deploy the HarvestConnect application (frontend and backend) to production environment.

## Inputs
- Environment: `production` | `staging`
- Backend: Django application on port 8000
- Frontend: Next.js application on port 3001

## Execution Scripts
- `execution/deploy_backend.py` - Deploy Django backend
- `execution/deploy_frontend.py` - Deploy Next.js frontend
- `execution/health_check.py` - Verify deployment health

## Prerequisites
1. Backend server is running (`python backend/manage.py runserver 0.0.0.0:8000`)
2. Frontend dev server is running (`npm run dev -- --port 3001`)
3. Database migrations are applied
4. Environment variables are configured in `.env`

## Steps

### Backend Deployment
1. Run database migrations: `python backend/manage.py migrate`
2. Collect static files: `python backend/manage.py collectstatic --noinput`
3. Run tests: `python backend/manage.py test`
4. Deploy via Docker or direct server deployment

### Frontend Deployment
1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Build production: `npm run build`
4. Deploy to hosting service (Vercel, InsForge, etc.)

## Expected Output
- Backend accessible at production URL with `/api/` endpoints working
- Frontend accessible at production URL with full functionality
- Health check endpoints returning 200 OK

## Edge Cases & Learnings
- **Database connection timeout**: Increase connection timeout in Django settings
- **Static files not loading**: Ensure `STATIC_URL` and `STATIC_ROOT` are configured correctly
- **CORS errors**: Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
- **Build fails with memory error**: Increase Node.js memory limit with `NODE_OPTIONS=--max_old_space_size=4096`

## Status
🟡 Directive created - Scripts not yet implemented
