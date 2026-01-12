# Docker Deployment Guide

This guide explains how to run the F1 Garage Management Dashboard using Docker.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

## Quick Start (Development)

```bash
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Database**: PostgreSQL on port 5433

## Production Deployment

### Option 1: Railway (Recommended)

Railway supports deploying multi-service Docker applications directly from GitHub.

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add production deployment configuration"
git push origin main
```

#### Step 2: Create Railway Project

1. Go to [Railway](https://railway.com) and create a new project
2. Select "Deploy from GitHub repo"
3. Connect your repository

#### Step 3: Add PostgreSQL

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically set `DATABASE_URL`

#### Step 4: Deploy Backend Service

1. Click "New" → "GitHub Repo"
2. Select your repo and set **Root Directory** to `/backend`
3. Railway will detect the Dockerfile and deploy
4. In the service settings, set these environment variables:
   - `DEBUG=False`
   - `SECRET_KEY=<generate-a-secure-key>`
   - `ALLOWED_HOSTS=<your-backend-domain>.railway.app`
   - `CORS_ALLOW_ALL=False`
5. Generate a domain under Settings → Networking → Generate Domain

#### Step 5: Deploy Frontend Service

1. Click "New" → "GitHub Repo"  
2. Select your repo and set **Root Directory** to `/frontend`
3. Set the Dockerfile path to `Dockerfile.prod`
4. In the service settings, set:
   - `VITE_API_URL=https://<your-backend-domain>.railway.app`
5. Generate a domain for the frontend

#### Step 6: Update Backend CORS

After getting your frontend domain, add it to the backend:
- `FRONTEND_URL=https://<your-frontend-domain>.railway.app`

### Option 2: Local Production Build

Build and run the production setup locally:

```bash
# Copy and configure environment
cp .env.production.example .env.production

# Edit .env.production with your values
nano .env.production

# Build and run
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build
```

The app will be available at http://localhost (port 80).

### Option 3: VPS Deployment

For a VPS (DigitalOcean, Hetzner, etc.):

```bash
# SSH into your server
ssh user@your-server

# Clone repository
git clone https://github.com/your-username/DBFinal.git
cd DBFinal

# Setup production environment
cp .env.production.example .env.production
nano .env.production  # Fill in production values

# Deploy
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `DEBUG` | Debug mode (False for production) | Yes |
| `SECRET_KEY` | Django secret key | Yes |
| `DATABASE_URL` | PostgreSQL connection URL (Railway format) | Yes* |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Individual DB settings | Alt to DATABASE_URL |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | Yes |
| `CORS_ALLOW_ALL` | Allow all CORS origins | No |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## File Structure

```
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── .env.production.example     # Production env template
├── backend/
│   ├── Dockerfile              # Development Dockerfile
│   ├── Dockerfile.prod         # Production Dockerfile (gunicorn)
│   └── railway.toml            # Railway config
└── frontend/
    ├── Dockerfile              # Development Dockerfile
    ├── Dockerfile.prod         # Production Dockerfile (nginx)
    ├── nginx.conf              # Nginx configuration
    └── railway.toml            # Railway config
```

## Troubleshooting

### Database Connection Issues

Check if DATABASE_URL is set correctly:
```bash
# Railway sets this automatically when you add PostgreSQL
echo $DATABASE_URL
```

### Static Files Not Loading

Ensure collectstatic runs during deployment:
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

### CORS Errors

Make sure `FRONTEND_URL` is set correctly in the backend environment:
```bash
FRONTEND_URL=https://your-frontend.railway.app
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```
