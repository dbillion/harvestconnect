# --- Build Stage ---
FROM python:3.12-slim AS builder

WORKDIR /app

# Install uv (requires shell access)
RUN pip install --no-cache-dir uv

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Copy requirements from repo root
COPY backend/requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

# --- Production Stage ---
FROM python:3.12-slim

# Build argument for cache busting (change this value to force rebuild)
ARG CACHEBUST=1

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Use CACHEBUST to invalidate cache when needed
RUN echo "Build timestamp: $CACHEBUST"

COPY backend/ .

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/usr/local/bin:$PATH"

RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD daphne -b 0.0.0.0 -p ${PORT:-8000} harvestconnect.asgi:application# cache bust Sat Jan 31 08:41:09 AM EST 2026
