#!/bin/sh

# Wait for database - support both DATABASE_URL and individual env vars
if [ -n "$DATABASE_URL" ]; then
    # Use Python to accurately parse the DATABASE_URL
    DB_HOST=$(python3 -c "from urllib.parse import urlparse; print(urlparse('$DATABASE_URL').hostname)")
    DB_PORT=$(python3 -c "from urllib.parse import urlparse; print(urlparse('$DATABASE_URL').port or 5432)")
fi

echo "Waiting for postgres at $DB_HOST:$DB_PORT..."
# If DB_HOST is still empty (e.g. DATABASE_URL was invalid), skip nc to avoid hanging
if [ -n "$DB_HOST" ]; then
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done
    echo "PostgreSQL started"
fi

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec "$@"
