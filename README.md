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

## Development

- Backend runs on port `8000`
- Frontend runs on port `5173`
- CORS is configured to allow requests from the frontend to the backend
- API requests can be made using the `api` utility in `frontend/src/config.ts`

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:8000` by default.
You can change this by setting the `VITE_API_URL` environment variable in `frontend/.env`
