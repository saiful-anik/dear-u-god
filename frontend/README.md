# Dear U

This project now stores notes in Supabase instead of `localStorage`.

## 1. Create the Supabase table and policies

Open your Supabase project, go to **SQL Editor**, and run this SQL:

```sql
create extension if not exists pgcrypto;

create table if not exists public.notes (
	id uuid primary key default gen_random_uuid(),
	recipient text not null,
	sender text not null default 'Someone who cares',
	message text not null,
	created_at timestamptz not null default now()
);


alter table public.notes enable row level security;

do $$
begin
	if not exists (
		select 1
		from pg_policies
		where schemaname = 'public'
			and tablename = 'notes'
			and policyname = 'Allow public insert notes'
	) then
		create policy "Allow public insert notes"
			on public.notes
			for insert
			to anon, authenticated
			with check (true);
	end if;

	if not exists (
		select 1
		from pg_policies
		where schemaname = 'public'
			and tablename = 'notes'
			and policyname = 'Allow public read notes'
	) then
		create policy "Allow public read notes"
			on public.notes
			for select
			to anon, authenticated
			using (true);
	end if;
end
$$;
```

## 2. Add environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

You can find both values in Supabase: **Project Settings -> API**.

## 3. Install dependencies and run

If you use Bun:

```bash
bun install
bun run dev
```

If you use npm:

```bash
npm install
npm run dev
```

## Notes

- The app creates notes in `public.notes` and generates links like `/note/<id>`.
- Anyone with a valid link can read that note (public share behavior).
- Supabase connectivity test is available at `/health` (for example: `http://localhost:5173/health`).
