#!/bin/sh
# Startup script for HarvestConnect Django backend

set -e

echo "Starting HarvestConnect Django backend..."

# Wait for Redis to be ready
if [ -n "$REDIS_URL" ]; then
    echo "Waiting for Redis at $REDIS_URL..."
    until python -c "import redis; r = redis.from_url('$REDIS_URL'); r.ping()" 2>/dev/null; do
        echo "Waiting for Redis..."
        sleep 2
    done
    echo "Redis is ready!"
fi

# Wait for database to be ready
echo "Waiting for database..."
until python manage.py check --database default; do
    echo "Waiting for database..."
    sleep 2
done

echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create superuser if it doesn't exist
echo "Ensuring superuser exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
"

# Start the application
echo "Starting Django application..."
exec gunicorn --bind 0.0.0.0:$PORT --workers 3 --threads 2 --timeout 120 --keep-alive 5 --max-requests 1000 --max-requests-jitter 10 harvestconnect.wsgi:application