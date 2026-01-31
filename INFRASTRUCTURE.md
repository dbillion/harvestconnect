# HarvestConnect Zero-Cost Infrastructure Guide

This guide explains how to set up the "Always Free" infrastructure for HarvestConnect as implemented in the CI/CD pipeline.

## 1. Recommended Platforms (Free Tiers)

| Component | Platform | Free Tier Benefits |
| :--- | :--- | :--- |
| **Frontend** | [Netlify](https://www.netlify.com/) | 100GB Bandwidth, 300 build minutes/mo. |
| **Backend** | [Fly.io](https://fly.io/) | 3 shared-cpu-1x micro VMs (256MB RAM) for free. |
| **Database** | [Neon](https://neon.tech/) | 0.5GiB storage, unlimited databases (serverless Postgres). |
| **Blobs (Storage)** | [Cloudflare R2](https://www.cloudflare.com/products/r2/) | 10GB storage, **Zero Egress Fees**. |
| **Auth** | [InSforge](https://insforge.com/) | Built-in (Current Implementation). |

## 2. GitHub Secrets Setup

To enable the CI/CD pipeline, go to **Settings > Secrets and variables > Actions** in your GitHub repository and add the following:

### Frontend (Netlify)
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token.
- `NETLIFY_SITE_ID`: The API ID of your Netlify site.
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g., `https://backend-production.up.railway.app/api`).

### Backend (Fly.io)
- `FLY_API_TOKEN`: Your Fly.io auth token (get it via `fly auth token`).
- `DJANGO_SECRET_KEY`: A secure random string for Django.
- `DATABASE_URL`: Connection string from Neon (e.g., `postgres://user:pass@host/db`).
- `ALLOWED_HOSTS`: Comma-separated list of domains (e.g., `harvestconnect.netlify.app,harvestconnect.fly.dev`).

### Storage (Cloudflare R2 - S3 Compatible)
- `USE_S3`: `True`
- `SUPABASE_S3_ACCESS_KEY_ID`: R2 Access Key ID.
- `SUPABASE_S3_SECRET_ACCESS_KEY`: R2 Secret Access Key.
- `SUPABASE_S3_BUCKET_NAME`: Your R2 bucket name.
- `SUPABASE_S3_ENDPOINT_URL`: Your R2 endpoint (e.g., `https://<account_id>.r2.cloudflarestorage.com`).

### Security Tools (Optional)
- `SNYK_TOKEN`: If you want deep dependency scanning.
- `CODECOV_TOKEN`: For test coverage reports.
- `PRODUCTION_URL`: The final production URL for the DAST (OWASP ZAP) scan.

## 3. How to Deploy

1.  **Initialize Git**: If not done, `git init`, `git add .`, `git commit`.
2.  **Push to GitHub**: Create a repository and push your code.
3.  **Automatic CI**: The `Continuous Integration` workflow will run on every push to verify tests and SAST.
4.  **Automatic CD**: Pushing to the `main` branch will trigger deployment to Netlify and Fly.io.
5.  **Security Monitoring**: CodeQL will run weekly and on pushes to find vulnerabilities.

## 4. Cost Management Tips
- **Cold Starts**: Netlify and Fly.io handle cold starts well. Fly.io apps can be configured to "autostop" to save resources.
- **Database Sleep**: Neon has an "auto-suspend" feature that keeps you within the free tier.
- **Egress**: By using Cloudflare R2 for images/blobs, you avoid the high egress fees of Vercel or AWS, ensuring the app stays free as it grows.
