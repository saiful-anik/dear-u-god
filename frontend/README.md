# Dear U

This frontend talks to the Worker API for creating notes, loading note links, and running health checks.

## 1. Configure the API endpoint

Create a `.env` file in `frontend` or copy from `.env.example`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8787
```

Point it at whatever host is serving the Worker API.

## 2. Install dependencies and run

If you use Bun:

```bash
bun install
bun run dev:frontend
```

If you use npm:

```bash
npm install
npm run dev
```

## Notes

- `POST /api/message` creates a new note.
- `GET /api/message/:id` loads a shared note.
- `GET /health` checks the API.
- `GET /health/db` checks database connectivity through the API.
- The frontend share page remains `/note/<id>`.
