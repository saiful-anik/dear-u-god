# Cloudflare Lightweight Template

Tiny Cloudflare Worker.

What it has:

- Wrangler local run
- Wrangler deploy
- Neon database connection
- Health endpoints only

## Setup

```bash
npm install
copy .dev.vars.example .dev.vars
```

Put your Neon connection string in `.dev.vars`:

```env
DATABASE_URL=postgresql://...
```

## Run

```bash
npm run dev
```

Worker runs local. Test these:

- `GET /`
- `GET /health`
- `GET /health/db`

## Deploy

```bash
npm run deploy
```

## User Flow

1. Start worker.
2. Hit `/health` to see app alive.
3. Hit `/health/db` to see database alive.
4. Deploy same worker with Wrangler when ready.
