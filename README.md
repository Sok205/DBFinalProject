# DBFinal Project

A full-stack application with:
- **Backend**: Django REST Framework API
- **Frontend**: Solid.js with TypeScript

## Project Structure

```
DBFinal/
├── backend/          # Django REST API
│   ├── DBFinal/      # Django project settings
│   ├── manage.py     # Django management script
│   └── ...
├── frontend/         # Solid.js application
│   ├── src/          # Source files
│   ├── public/       # Static assets
│   └── ...
└── README.md
```

## Setup & Installation

### Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

### Frontend (Solid.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Production Architecture

The application is designed for a professional, scalable deployment:

- **Frontend**: [Solid.js](https://www.solidjs.com/) SPA served by **Nginx** for high performance and static asset caching.
- **Backend**: [Django REST Framework](https://www.django-rest-framework.org/) served by **Gunicorn** for a robust, production-ready WSGI server.
- **Static Files**: Managed via **WhiteNoise** with compression and persistent caching.
- **Infrastructure**: Containerized using **Docker** and **Docker Compose**, optimized for **Railway** cloud deployment.
- **Database**: **PostgreSQL** for reliable relational data storage.

## Deployment

### Railway (Recommended)

This project is configured for automated deployment via Railway. Every push to `main` triggers a rebuild of both services.

For detailed, step-by-step instructions on deploying to Railway or other platforms, see the [Docker Deployment Guide](DOCKER.md).

### Quick Production Launch

If you have Docker installed, you can launch the production build locally:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build
```

### Environment Variables

| Service | Key | Purpose |
|---------|-----|---------|
| **Backend** | `DATABASE_URL` | PostgreSQL connection string |
| **Backend** | `DEBUG` | Set to `False` in production |
| **Backend** | `FRONTEND_URL` | Frontend origin for CORS |
| **Frontend**| `VITE_API_URL` | URL of the Backend API |

---

Developed for the F1 Garage Management simulation. 🏁🏎️
