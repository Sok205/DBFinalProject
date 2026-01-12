# Solid.js Frontend

Modern frontend built with Solid.js and TypeScript.

## Tech Stack

- Solid.js
- TypeScript
- Vite
- CSS

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## API Integration

The project includes an API utility (`src/config.ts`) for making requests to the Django backend.

### Usage Example

```typescript
import { api } from './config';

// GET request
const data = await api.get('/api/endpoint');

// POST request
const result = await api.post('/api/endpoint', { key: 'value' });

// PUT request
const updated = await api.put('/api/endpoint', { key: 'value' });

// DELETE request
const deleted = await api.delete('/api/endpoint');
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── public/         # Static assets
├── src/            # Source files
│   ├── config.ts   # API configuration
│   ├── App.tsx     # Main app component
│   └── index.tsx   # Entry point
├── index.html      # HTML template
└── vite.config.ts  # Vite configuration
```

## Development

The development server runs on `http://localhost:5173` by default.

Vite is configured with a proxy for `/api` requests that forwards them to the Django backend at `http://localhost:8000`.
