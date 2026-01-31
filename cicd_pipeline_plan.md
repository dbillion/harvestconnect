# Implementation Plan - CI/CD Pipeline for HarvestConnect

This plan outlines the creation of a professional-grade, zero-cost CI/CD pipeline for the HarvestConnect project using GitHub Actions.

## Objective
Implement a secure, automated pipeline that handles testing, security scanning (SAST/DAST), and multi-platform deployment (Frontend to Netlify, Backend to Railway/Fly.io) while leveraging free tiers and GitHub Secrets.

## Proposed Stack
- **Frontend**: Next.js -> **Netlify** (Free Tier).
- **Backend**: Django -> **Fly.io** (3 Free micro-VMs).
- **Database**: **Neon** (Serverless Postgres Free Tier).
- **Blobs/Storage**: **Cloudflare R2** (10GB Free, No Egress fees).
- **Security Scanners**: Bandit (Backend), ESLint (Frontend), CodeQL (Unified).

## Pipeline Steps

### 1. Continuous Integration (CI)
- Trigger: Push/PR to `main` and `develop`.
- **Backend Job**:
  - Setup Python.
  - Install dependencies.
  - Run SAST (Bandit).
  - Run tests (Pytest) with coverage.
- **Frontend Job**:
  - Setup Node.js.
  - Install dependencies (Bun).
  - Run SAST (ESLint).
  - Run tests (Vitest).

### 2. Security Scanning (SAST/DAST)
- **SAST**: GitHub CodeQL for automated code analysis.
- **DAST**: OWASP ZAP baseline scan against the preview/staging URL (Post-deployment step).

### 3. Continuous Deployment (CD)
- Trigger: Successful CI on `main`.
- **Frontend Deployment**:
  - Use `netlify-cli` to deploy to Netlify.
  - Use GitHub Secrets for `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`.
- **Backend Deployment**:
  - Use `flyctl`. (Integrated with GitHub Actions).
  - Use GitHub Secrets for `FLY_API_TOKEN`.
- **Environment Management**:
  - Secrets injected from GitHub to platforms.

## File Changes
1. `.github/workflows/ci.yml`: CI logic.
2. `.github/workflows/security.yml`: SAST logic.
3. `.github/workflows/deploy.yml`: CD logic.
4. `github-secrets-guide.md`: Instructions for the user to set up required secrets.

## Execution Order
1. Create the workflow directory.
2. Create the `ci.yml` file.
3. Create the `security.yml` file.
4. Create the `deploy.yml` file.
5. Create the setup guide.
