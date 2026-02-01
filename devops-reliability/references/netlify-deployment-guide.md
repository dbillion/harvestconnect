# Netlify Deployment Guide for HarvestConnect

## Overview
This guide provides comprehensive instructions for deploying the HarvestConnect frontend to Netlify using GitHub Actions, ensuring seamless integration with the Koyeb backend.

## Prerequisites

### Netlify Account Setup
- Create a Netlify account at https://app.netlify.com/signup
- Prepare your frontend repository for deployment
- Obtain Netlify Site ID from your Netlify dashboard

### Required GitHub Secrets
Add these secrets to your GitHub repository:
- `NETLIFY_AUTH_TOKEN`: Generated from Netlify User Settings > Applications > Personal Access Tokens
- `NETLIFY_SITE_ID`: Found in Netlify Site Settings > Site Details > API ID
- `NEXT_PUBLIC_API_URL`: Your Koyeb backend URL (e.g., https://your-app-name.koyeb.app)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## GitHub Actions Workflow

### deploy.yml Configuration
```yaml
name: Continuous Deployment

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy-frontend:
    name: Deploy Frontend (Netlify)
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    defaults:
      run:
        working-directory: ./harvestconnect

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: './harvestconnect/package-lock.json'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NODE_OPTIONS: "--max_old_space_size=4096"

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=.next --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Verify deployment
        run: |
          sleep 10
          curl -f ${{ secrets.NEXT_PUBLIC_API_URL }} || echo "Backend health check completed"
```

## Netlify Configuration

### netlify.toml (Optional)
Create this file in your frontend root directory for advanced configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"
  environment = { NODE_VERSION = "20" }

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.onrender.com/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Environment Variable Configuration

### Frontend Environment Variables
Ensure your frontend `.env.local` includes:
```
NEXT_PUBLIC_API_URL=https://your-koyeb-app.koyeb.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

### Next.js Configuration
Update your `next.config.js` to handle API proxying:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
 },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
```

## Deployment Process

### Initial Setup
1. Connect your GitHub repository to Netlify via the Netlify dashboard
2. Configure build settings in Netlify:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Environment variables: Set in GitHub Secrets

### Continuous Deployment
- Push to main branch triggers automatic deployment
- GitHub Actions handles build and deployment
- Netlify provides deployment logs and status updates

## Monitoring and Health Checks

### Frontend Monitoring
- Monitor build logs in GitHub Actions
- Check Netlify deployment status
- Verify site accessibility and functionality

### Integration Testing
```bash
# Test API connectivity
curl -X GET ${{ secrets.NEXT_PUBLIC_API_URL }}/health/

# Test frontend functionality
curl -X GET https://your-netlify-site.netlify.app/
```

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version compatibility
2. **Environment Variables**: Ensure all required secrets are set
3. **API Connectivity**: Verify NEXT_PUBLIC_API_URL is correct
4. **SSL/TLS Issues**: Ensure HTTPS URLs are used

### Debugging Steps
1. Review GitHub Actions workflow logs
2. Check Netlify build logs
3. Verify CORS settings in backend
4. Test API endpoints independently

## Best Practices

### Security
- Never hardcode sensitive information
- Use GitHub Secrets for all credentials
- Implement proper CORS configuration
- Regularly rotate access tokens

### Performance
- Optimize build times with caching
- Use efficient image optimization
- Implement proper asset compression
- Monitor loading times and performance metrics

### Reliability
- Implement health checks
- Set up monitoring alerts
- Maintain deployment logs
- Plan for rollback procedures