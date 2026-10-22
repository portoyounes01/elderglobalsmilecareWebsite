# Global Smile Care — Care-Centre Portal

This is the standalone frontend for care-centre accounts. It can be developed,
built, or copied into another website project without the internal dashboard.
The portal still uses the existing FastAPI backend; it does not connect directly
to the database.

## Requirements

- Node.js 20 or newer
- The Global Smile Care backend running with the `/portal` routes enabled

## Local development

From this directory:

```sh
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5174/portal`. Set `VITE_API_URL` in `.env` to the
reachable backend base URL. The example uses `http://localhost:8001`, the
repository's local backend host port. If omitted, the API client defaults to
`http://localhost:8000`.

The optional demo-centre picker is loaded from `/portal/demo-centres`; if that
helper endpoint is unavailable, the normal username/password login remains
available.

## Build and test

```sh
npm run build
npm test
```

The app uses bearer-token authentication and the backend determines the
account's care-centre scope. Portal requests use the existing `/portal/...`
API paths. Deploy the frontend with `VITE_API_URL` configured for the website's
backend and the required cross-origin policy configured server-side if the
frontend and API use different origins.
