# Koyeb Cache Busting Guide

## Overview

This project implements a cache-busting mechanism for Koyeb deployments to ensure fresh builds when needed. The system uses Docker build arguments to invalidate cache layers without modifying source code.

## How It Works

### Dockerfile Implementation

The `backend/Dockerfile` includes a `CACHEBUST` build argument:

```dockerfile
# Build argument for cache busting (change this value to force rebuild)
ARG CACHEBUST=1

# Use CACHEBUST to invalidate cache when needed
RUN echo "Build timestamp: $CACHEBUST"
```

This argument is used before copying source code, ensuring that changing its value invalidates all subsequent Docker layers.

### Automatic Cache Busting (CI/CD)

Every deployment via GitHub Actions automatically uses a unique timestamp:

```yaml
koyeb service update harvestconnect-backend/api \
  --docker-args "--build-arg CACHEBUST=$(date +%s)"
```

This means **every push to main automatically forces a fresh build**.

## Manual Cache Busting

### Method 1: Using the Helper Script (Easiest)

```bash
# Set your Koyeb token
export KOYEB_TOKEN="your-koyeb-token-here"

# Run the script
./force-koyeb-rebuild.sh
```

### Method 2: Using Koyeb CLI Directly

```bash
# Install Koyeb CLI (if not installed)
curl -L https://github.com/koyeb/koyeb-cli/releases/latest/download/koyeb-linux-amd64 -o koyeb
chmod +x koyeb
sudo mv koyeb /usr/local/bin/

# Set token
export KOYEB_TOKEN="your-token"

# Force redeploy with cache bust
koyeb service redeploy harvestconnect-backend/api \
  --docker-args "--build-arg CACHEBUST=$(date +%s)" \
  --skip-cache
```

### Method 3: Via Koyeb Dashboard

1. Go to [app.koyeb.com](https://app.koyeb.com)
2. Navigate to **harvestconnect-backend** → **api** service
3. Click **Settings** → **Advanced**
4. Click **Redeploy**
5. Enable **"Clear build cache"** option

## When to Force Cache Bust

You typically need to manually force a cache bust when:

1. **Environment variables changed** but code didn't
2. **Base image updated** (e.g., Python security patch)
3. **Debugging deployment issues** where cache might be stale
4. **After major infrastructure changes**

## Monitoring Deployment

After triggering a rebuild, monitor the status:

```bash
# Watch deployment status
koyeb service get harvestconnect-backend/api

# View deployment logs
koyeb service logs harvestconnect-backend/api --follow
```

Or via GitHub Actions:

```bash
gh run watch
```

## Troubleshooting

### Issue: Koyeb still using old code

**Solution**: The automatic cache bust should prevent this, but if it persists:

1. Check that the `CACHEBUST` argument is being passed in the deployment workflow
2. Verify the Dockerfile includes the `ARG CACHEBUST` declaration
3. Try the nuclear option: delete and recreate the service

### Issue: Build fails with cache bust

**Solution**: The `CACHEBUST` argument is optional (defaults to `1`), so builds should still work without it. Check:

1. Dockerfile syntax is correct
2. The `RUN echo` command is valid
3. No other breaking changes were introduced

### Issue: "KOYEB_TOKEN not set" error

**Solution**: 

```bash
# Get your token from Koyeb dashboard
# Settings → API → Create Token

export KOYEB_TOKEN="koyeb_xxx..."

# Or add to your shell profile
echo 'export KOYEB_TOKEN="koyeb_xxx..."' >> ~/.bashrc
source ~/.bashrc
```

## Best Practices

1. **Let CI/CD handle it**: The automatic cache bust on every push is usually sufficient
2. **Manual rebuilds**: Only use for debugging or when you need to force a rebuild without code changes
3. **Monitor deployments**: Always check deployment logs after forcing a rebuild
4. **Document reasons**: If you manually force a rebuild, document why in your commit message or team chat

## Architecture Notes

This implementation follows the **Senior Fullstack Developer** principles:

- **DRY**: Single source of truth for cache busting logic
- **YAGNI**: Simple timestamp-based approach, no complex cache invalidation
- **First Principles**: Solves the root cause (Docker layer caching) rather than symptoms
- **Incremental**: Can be enabled/disabled without breaking existing deployments

## Related Files

- `backend/Dockerfile` - Contains the `CACHEBUST` argument
- `.github/workflows/deploy.yml` - Automatic cache bust on deployment
- `force-koyeb-rebuild.sh` - Helper script for manual rebuilds
- `INFRASTRUCTURE.md` - Overall deployment architecture
