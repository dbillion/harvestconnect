# Multi-stage build for optimized Next.js frontend
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package*.json ./
# Copy package-lock.json if it exists (using a workaround for the conditional copy)
RUN if [ -f ../package-lock.json ]; then cp ../package-lock.json .; fi
RUN npm ci --only=production --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN if [ -f ../package-lock.json ]; then cp ../package-lock.json .; fi
RUN npm ci --no-audit --no-fund
COPY . .
# Configure Next.js for standalone output
ENV NEXT_PRIVATE_STANDALONE=true
ENV NEXT_PRIVATE_OUTPUT_TRACE=true
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
