# Dear U God

Cute note app.

User writes a note. App saves it in Neon. App gives back a share link. Other person opens link and reads the note.

## What it has

- Cloudflare Worker API
- React frontend
- Neon Postgres storage
- Health page for API and DB check

## User flow

1. Open home page.
2. Hit `Write a Note`.
3. Fill `To`, `From`, and message.
4. Hit `Generate Link`.
5. Copy share link.
6. Other person opens `/note/:id`.

## Local setup

Install all packages from root:

```bash
npm install
```

Copy env files:

```bash
copy .dev.vars.example .dev.vars
copy frontend\.env.example frontend\.env
```

Set these values:

`.dev.vars`

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

`frontend/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8787
```

## Database

App expects a `messages` table with these fields:

- `id`
- `from`
- `to`
- `message`
- `created_at`

One simple Neon/Postgres shape:

```sql
create extension if not exists pgcrypto;

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  "from" text not null,
  "to" text not null,
  message text not null,
  created_at timestamptz not null default now()
);
```

## Run local

Start both backend and frontend from root:

```bash
npm run dev
```

What opens:

- frontend: `http://localhost:8080`
- worker api: `http://127.0.0.1:8787`

## API routes

- `GET /` basic app info
- `GET /health` worker health
- `GET /health/db` database health
- `POST /api/message` create note
- `GET /api/message/:id` read note

## Quick test

1. Open `http://localhost:8080`
2. Write a note and make link
3. Open the new `/note/:id` page
4. Open `http://localhost:8080/health`
5. Run health check button

## Deploy

Put real DB secret in Cloudflare:

```bash
npx wrangler secret put DATABASE_URL
```

Deploy worker:

```bash
npm run deploy
```

Then point frontend `VITE_API_BASE_URL` to your live Worker URL and ship frontend where you want.
