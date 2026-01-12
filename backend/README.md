# Django Backend

REST API backend built with Django and Django REST Framework.

## Tech Stack

- Django 6.0
- Django REST Framework
- django-cors-headers
- SQLite (default database)

## Quick Start

1. Install dependencies:
   ```bash
   uv sync
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

4. Run the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## Configuration

### CORS Settings

CORS is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative frontend port)

You can modify these settings in `DBFinal/settings.py` under `CORS_ALLOWED_ORIGINS`.

### Database

By default, the project uses SQLite. The database file will be created as `db.sqlite3` in the backend directory.

To use a different database (PostgreSQL, MySQL, etc.), update the `DATABASES` setting in `DBFinal/settings.py`.

## Creating Django Apps

To create a new Django app:
```bash
python manage.py startapp <app_name>
```

Don't forget to add the app to `INSTALLED_APPS` in `DBFinal/settings.py`.
