#!/bin/sh

# Wait for database using Python for robust connection testing
echo "Checking database connection..."
python3 - << END
import os
import socket
import time
from urllib.parse import urlparse

db_url = os.getenv('DATABASE_URL')
host = os.getenv('DB_HOST', 'localhost')
port = int(os.getenv('DB_PORT', 5432))

if db_url:
    print("Found DATABASE_URL, parsing...")
    parsed = urlparse(db_url)
    host = parsed.hostname
    port = parsed.port or 5432
else:
    print("DATABASE_URL not found in environment.")

if not host or host == 'localhost':
    print("WARNING: No remote database host defined. If you are on Railway, ensure DATABASE_URL is connected.")
    print(f"Falling back to host: {host}, port: {port}")

print(f"Waiting for database connection at {host}:{port}...")
start_time = time.time()
while time.time() - start_time < 60:  # Timeout after 60 seconds
    try:
        with socket.create_connection((host, port), timeout=2):
            print("Database is up!")
            exit(0)
    except (socket.error, socket.timeout):
        time.sleep(1)

print("Database connection timed out!")
exit(1)
END

if [ $? -ne 0 ]; then
    echo "Database connection failed. Exiting."
    exit 1
fi

echo "Running migrations..."
if [ "$FORCE_MIGRATE" = "true" ]; then
    echo "!!! FORCE_MIGRATE is true. NUKING DATABASE SCHEMA FOR FRESH START !!!"
    python manage.py shell -c "from django.db import connection; cursor = connection.cursor(); cursor.execute('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;'); print('Schema wiped!')"
fi

# Run migrate without --fake-initial to ensure tables are actually created
python manage.py migrate --noinput

echo "Migration status:"
python manage.py showmigrations garage

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec "$@"
