# --- Build Stage ---
FROM ghcr.io/astral-sh/uv:latest as builder

WORKDIR /app

# Enable bytecode compilation for faster starts
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Copy only requirements to leverage cache
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

# --- Production Stage ---
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the rest of the backend code
COPY . .

# Environment setup
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/usr/local/bin:$PATH"

# Collect static files for the admin panel
RUN python manage.py collectstatic --noinput

# Run with Daphne (essential for Chat/WebSockets)
EXPOSE 8000
CMD daphne -b 0.0.0.0 -p ${PORT:-8000} harvestconnect.asgi:application