FROM python:3.12-alpine

# Build argument for cache busting
ARG CACHEBUST=1

WORKDIR /app

# Install system dependencies required for Python packages
RUN apk add --no-cache \
    postgresql-dev \
    gcc \
    musl-dev \
    linux-headers \
    libffi-dev \
    && echo "Build timestamp: $CACHEBUST"

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run application
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "harvestconnect.asgi:application"]
