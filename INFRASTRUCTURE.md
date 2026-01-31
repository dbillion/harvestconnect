# HarvestConnect Zero-Cost Infrastructure Guide

This guide explains how to set up the "Always Free" infrastructure for HarvestConnect as implemented in the CI/CD pipeline.

## 1. Recommended Platforms (Free Tiers)

| Component | Platform | Free Tier Benefits |
| :--- | :--- | :--- |
| **Frontend** | [Netlify](https://www.netlify.com/) | 100GB Bandwidth, 300 build minutes/mo. |
| **Backend** | [Koyeb](https://www.koyeb.com/) | 1 micro VM (512MB RAM) + 1 Postgres instance for free. |
| **Database** | [Neon](https://neon.tech/) | 0.5GiB storage, unlimited databases (serverless Postgres). |
| **Redis (Chat)** | [Koyeb](https://www.koyeb.com/) | Built-in support for Redis services. |
| **Blobs (Storage)** | [Cloudflare R2](https://www.cloudflare.com/products/r2/) | 10GB storage, **Zero Egress Fees**. |
| **Auth** | [InSforge](https://insforge.com/) | Built-in (Current Implementation). |

## 2. GitHub Secrets Setup

To enable the CI/CD pipeline, go to **Settings > Secrets and variables > Actions** in your GitHub repository and add the following:

### Frontend (Netlify)
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token.
- `NETLIFY_SITE_ID`: The API ID of your Netlify site.
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g., `https://backend-production.up.railway.app/api`).

### Backend (Koyeb)
- `KOYEB_TOKEN`: Your Koyeb personal access token (Settings > API Keys).
- `DJANGO_SECRET_KEY`: A secure random string for Django.
- `DATABASE_URL`: Connection string from Neon (or Koyeb internal Database).
- `ALLOWED_HOSTS`: Comma-separated list of domains (e.g., `harvestconnect.netlify.app,harvestconnect.fly.dev`).

### Storage (Cloudflare R2 - S3 Compatible)
- `USE_S3`: `True`
- `SUPABASE_S3_ACCESS_KEY_ID`: R2 Access Key ID.
- `SUPABASE_S3_SECRET_ACCESS_KEY`: R2 Secret Access Key.
- `SUPABASE_S3_BUCKET_NAME`: Your R2 bucket name.
- `SUPABASE_S3_ENDPOINT_URL`: Your R2 endpoint (e.g., `https://<account_id>.r2.cloudflarestorage.com`).

### Payment Processing (Stripe)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (`sk_test_...` for dev, `sk_live_...` for prod).
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.

### Security Tools (Optional)
- `SNYK_TOKEN`: If you want deep dependency scanning.
- `CODECOV_TOKEN`: For test coverage reports.
- `PRODUCTION_URL`: The final production URL for the DAST (OWASP ZAP) scan.

## 3. How to Deploy

1.  **Initialize Git**: If not done, `git init`, `git add .`, `git commit`.
2.  **Push to GitHub**: Create a repository and push your code.
3.  **Automatic CI**: The `Continuous Integration` workflow will run on every push to verify tests and SAST.
4.  **Automatic CD**: Pushing to the `main` branch will trigger deployment to Netlify and Koyeb.
5.  **Security Monitoring**: CodeQL will run weekly and on pushes to find vulnerabilities.

## 4. Cost Management Tips
- **Cold Starts**: Netlify and Koyeb handle cold starts well. Koyeb Hobby instances do not sleep, ensuring instant responses.
- **Database Sleep**: Neon has an "auto-suspend" feature that keeps you within the free tier.
- **Egress**: By using Cloudflare R2 for images/blobs, you avoid the high egress fees of Vercel or AWS, ensuring the app stays free as it grows.
- **Stripe Security**: Never commit `STRIPE_SECRET_KEY` to Git. Currently, it is used in Next.js API routes (Server Side), but for maximum security, it is recommended to move all Stripe logic to the Django backend so the secret never even exists in the frontend environment.
