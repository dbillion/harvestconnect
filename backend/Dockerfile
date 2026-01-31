FROM python:3.12-alpine

# Build argument for cache busting
ARG CACHEBUST=1

WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install system dependencies and uv (Astral's ultra-fast package installer)
RUN apk add --no-cache \
    postgresql-dev \
    gcc \
    musl-dev \
    linux-headers \
    libffi-dev \
    curl \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && export PATH="/root/.local/bin:$PATH" \
    && uv pip install --system --no-cache -r requirements.txt \
    && echo "Build timestamp: $CACHEBUST"

# Add uv to PATH
ENV PATH="/root/.local/bin:$PATH"

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Collect static files - skip during build, do at runtime
# RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run application
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "harvestconnect.asgi:application"]
