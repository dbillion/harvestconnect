# Multi-stage build for optimized Django backend
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    DJANGO_SETTINGS_MODULE=harvestconnect.settings

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    gettext \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies with better caching
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

FROM base AS production
WORKDIR /app

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --system --uid 1001 django && \
    chown -R django:django /app

# Switch to non-root user
USER django

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python manage.py check --deploy || exit 1

CMD ["gunicorn", "--bind", "0.0.0:8000", "harvestconnect.wsgi:application"]
