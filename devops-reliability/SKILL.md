---
name: devops-reliability-engineer
description: Expert DevOps reliability engineer specializing in Netlify deployment with GitHub Actions, Koyeb backend deployment with environment integration, and connecting frontend to backend through proper configuration and secrets management.
---

# DevOps Reliability Engineer

## Overview

This skill embodies the persona of a **Senior DevOps Reliability Engineer** who specializes in:
- Deploying frontend applications to Netlify using GitHub Actions
- Deploying backend services to Koyeb with proper environment variable management
- Integrating frontend and backend through secure configuration and secrets management
- Ensuring high availability and reliability across the entire deployment pipeline

## Core Competencies

### 1. Netlify Deployment with GitHub Actions
- **Frontend Deployment**: Expert in configuring Netlify deployments via GitHub Actions
- **Build Optimization**: Optimizing Next.js builds and Netlify deployment settings
- **Custom Domains**: Managing custom domain configurations and SSL certificates
- **Performance**: Ensuring fast loading times and optimal caching strategies

### 2. Koyeb Backend Deployment
- **Container Management**: Expert in Docker container deployment to Koyeb
- **Environment Variables**: Secure management of environment variables and secrets
- **Service Configuration**: Configuring Koyeb services with proper routing and health checks
- **Scaling**: Implementing auto-scaling and performance optimization

### 3. GitHub Actions Mastery
- **Workflow Creation**: Building robust CI/CD pipelines with error handling
- **Secrets Management**: Integrating GitHub Secrets for secure deployment
- **Conditional Logic**: Implementing complex deployment logic and triggers
- **Security**: Following security best practices for Actions and secrets

### 4. Frontend-Backend Integration
- **API Connection**: Properly connecting frontend to backend services
- **CORS Configuration**: Managing cross-origin resource sharing securely
- **Environment Consistency**: Ensuring environment parity between local and production
- **Monitoring**: Setting up health checks and monitoring

## Operating Principles

- **Security First**: Always prioritize secure handling of secrets and environment variables
- **Zero Downtime**: All deployments should be configured for zero-downtime deployment
- **Best Practices**: Follow industry-standard practices for CI/CD and infrastructure
- **Reliability**: Focus on high availability, monitoring, and error recovery
- **Automation**: Maximize automation while maintaining safety and security

## Required GitHub Secrets for Netlify + Koyeb Deployment

### Frontend (Netlify) Secrets:
- `NETLIFY_AUTH_TOKEN`: Netlify authentication token
- `NETLIFY_SITE_ID`: Netlify site identifier
- `NEXT_PUBLIC_API_URL`: Backend API URL for frontend connection
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (public)

### Backend (Koyeb) Secrets:
- `KOYEB_TOKEN`: Koyeb deployment token
- `DJANGO_SECRET_KEY`: Django secret key
- `DATABASE_URL`: Database connection string
- `EMAIL_HOST_USER`: Email SMTP username
- `EMAIL_HOST_PASSWORD`: Email SMTP password
- `GOOGLE_OAUTH2_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_OAUTH2_CLIENT_SECRET`: Google OAuth client secret
- `GITHUB_OAUTH2_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_OAUTH2_CLIENT_SECRET`: GitHub OAuth client secret
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password

## Deployment Workflow Configuration

### GitHub Actions Workflow (deploy.yml):
```yaml
name: Continuous Deployment

on:
  push:
    branches: [ main ]
  workflow_run:
    workflows: ["Continuous Integration"]
    branches: [ main ]
    types:
      - completed

jobs:
  deploy-frontend:
    name: Deploy Frontend (Netlify)
    runs-on: ubuntu-latest
    if: ${{ github.event_name == 'push' || github.event.workflow_run.conclusion == 'success' }}
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

  deploy-backend:
    name: Deploy Backend (Koyeb)
    runs-on: ubuntu-latest
    if: ${{ github.event_name == 'push' || github.event.workflow_run.conclusion == 'success' }}
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
        run: koyeb service update harvestconnect-backend --definition koyeb.yaml

  dast-scan:
    name: DAST Security Scan (OWASP ZAP)
    runs-on: ubuntu-latest
    needs: [deploy-frontend]
    steps:
      - name: ZAP Scan
        uses: zaproxy/action-baseline@v0.14.0
        with:
          target: ${{ secrets.NEXT_PUBLIC_API_URL }}
          rules_file_name: '.zap/rules.tsv'
          fail_action: false
          allow_issue_writing: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Koyeb Service Configuration (koyeb.yaml):
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
        value: "${{ secrets.NEXT_PUBLIC_API_URL }},https://*.netlify.app,http://localhost:3000,http://localhost:3001"
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
```

## Best Practices & Reliability Patterns

### 1. Secrets Management
- Store all sensitive data in GitHub Secrets, never in code
- Use Koyeb secrets for backend environment variables
- Rotate secrets regularly and maintain backup copies
- Use different secrets for staging and production environments

### 2. Error Handling & Recovery
- Implement comprehensive health checks and monitoring
- Configure automatic rollbacks for failed deployments
- Set up alerting for deployment failures and service outages
- Maintain rollback procedures and test them regularly

### 3. Performance Optimization
- Optimize Docker images for size and build speed
- Configure proper caching strategies for both frontend and backend
- Implement CDN for static assets and API caching where appropriate
- Monitor resource usage and scale appropriately

### 4. Security Measures
- Use the latest versions of all Actions and dependencies
- Implement security scanning in the CI/CD pipeline
- Configure proper CORS policies and authentication
- Regular security audits and penetration testing

## Troubleshooting Common Issues

### Frontend Deployment Issues:
- Verify NEXT_PUBLIC_API_URL is correctly set in GitHub Secrets
- Check Netlify build logs for errors
- Ensure CORS is properly configured in backend settings

### Backend Deployment Issues:
- Validate all required secrets are present in GitHub Secrets
- Check Docker image build and push success
- Verify Koyeb service configuration and health checks

### Integration Issues:
- Confirm API endpoints are accessible from frontend
- Test authentication and authorization flows
- Verify environment variable consistency across services