# Deploy to Render

This project is prepared for Render with three services in `render.yaml`:

- `platformforteachers-backend`: Django REST API
- `platformforteachers-frontend`: Vite static site
- `platformforteachers-db`: PostgreSQL database

## Deploy with Blueprint

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Render, open **Blueprints** and create a new Blueprint instance from this repository.
3. Render will read `render.yaml`, create the database, build the backend, and build the frontend.
4. After the first deploy, open the backend service shell and create an admin user:

```bash
python manage.py createsuperuser
```

## Important URLs

The frontend is configured to call:

```text
https://platformforteachers-backend.onrender.com/api
```

If you rename the Render services or add custom domains, update these values in `render.yaml`:

- backend `ALLOWED_HOSTS`
- backend `CORS_ALLOWED_ORIGINS`
- backend `CSRF_TRUSTED_ORIGINS`
- frontend `VITE_API_URL`

## Manual Settings

If you deploy without Blueprint, use these settings.

Backend:

- Root Directory: `backend`
- Build Command: `bash build.sh`
- Start Command: `python -m gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- Environment variables: `SECRET_KEY`, `DEBUG=False`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`

Frontend:

- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://platformforteachers-backend.onrender.com/api`
