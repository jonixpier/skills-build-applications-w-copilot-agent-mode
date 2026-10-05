# OctoFit Tracker frontend

React 19 presentation tier for the OctoFit Tracker API.

## Run locally

```sh
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```

Vite serves on port `5173`. When `VITE_CODESPACE_NAME` is unset, API requests use `http://localhost:8000`.

## Run in Codespaces

`VITE_CODESPACE_NAME` must be defined so browser requests reach the forwarded API. Add the Codespace name to `octofit-tracker/frontend/.env.local`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Restart Vite after changing `.env.local`. The API base URL is `https://<VITE_CODESPACE_NAME>-8000.app.github.dev`.

Collection views support JSON arrays and paginated payloads with `results`, `items`, `docs`, `records`, or nested `data` collections.

