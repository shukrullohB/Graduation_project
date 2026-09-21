## Vercel deployment

This repository is configured for Vercel Services in `vercel.json`:

- `frontend/` is deployed as a Vite service.
- `backend/` is deployed as a FastAPI service with entrypoint `app.main:app`.
- Requests under `/api/*` are routed to the backend service.
- All other requests are routed to the Vite frontend service.

The frontend uses same-origin API requests (`/api/v1`) and local development keeps using the Vite proxy in `frontend/vite.config.js`.

### Required Vercel environment variables

Set these on the backend service in Vercel:

- `DATABASE_URL`: a persistent PostgreSQL database URL. Do not use the local SQLite default for production.
- `JWT_SECRET_KEY`: a strong production secret.
- `BACKEND_CORS_ORIGINS`: your deployed frontend origin, for example `https://your-project.vercel.app`.
- `NLP_SERVICE_BASE_URL`: the URL of the separately deployed NLP service.

Recommended production values:

- `ENVIRONMENT=production`
- `DEBUG=false`
- `AUTO_CREATE_TABLES=false`
- `REQUEST_LOGGING_ENABLED=true`
- `API_V1_PREFIX=/api/v1`
- `JWT_ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=120`

### Deployment limitations

Vercel does not provide persistent local filesystem storage for the FastAPI service. The backend defaults to SQLite only for local development, so production needs an external PostgreSQL database and migrations run against that database.

The `nlp_service/` application is a separate FastAPI service with heavy ML dependencies. It is not included in the Vercel backend service and must be deployed separately, then connected through `NLP_SERVICE_BASE_URL`.
