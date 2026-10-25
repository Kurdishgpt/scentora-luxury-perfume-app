# Running SCENTORA on Replit

This import keeps its existing React, TanStack Start, Vite, Tailwind, and Bun setup.

## Development

- Install dependencies with `bun install --frozen-lockfile`.
- Use the **Start application** workflow (the Run button), or run `bun run dev`.
- Vite listens on `0.0.0.0:5000` so Replit Preview can reach it.
- `/` is the perfume storefront; `/admin` is the password-protected admin interface.
- Run the existing tests with `bun run test`.

The app requires these server-side Replit Secrets:

- `NETLIFY_DB_URL`: the existing Netlify/PostgreSQL database connection string.
- `ADMIN_PASSWORD`: the password used to sign in to store administration.
- `SESSION_SECRET`: at least 32 characters for encrypted admin sessions.

Keep the existing external database; do not switch this app to the Replit
database without explicit approval. Catalog and admin edits are persisted in
PostgreSQL. Cart state lives in React state, and checkout opens WhatsApp.
The database schema is in `db/schema.ts`, with the existing SQL migration under
`netlify/database/migrations/`. Do not apply migrations to an existing database
without first checking its schema and confirming any required changes.

The repository remains connected to Lovable. Follow `AGENTS.md`; do not rewrite
published Git history or replace the existing stack for routine changes.

## Vercel

- Vercel builds use Nitro's detected Vercel preset and emit `.vercel/output`.
- The existing Netlify deployment continues to use `NETLIFY_DB_URL`. On Vercel,
  the catalog uses `POSTGRES_URL` (or `DATABASE_URL`) with the Neon serverless
  driver; Vercel's `DATABASE_URL` is not selected during Replit development.
- Add `POSTGRES_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` to the Vercel
  project's server-side environment variables. Never expose them with a `VITE_`
  prefix. A new Vercel database needs the existing SQL migration applied and
  catalog data migrated separately; connecting a new database does not copy the
  current catalog.

## Cloudflare Workers and Pages

- The production build targets Nitro's Cloudflare Worker runtime.
- Configure `POSTGRES_URL` (or `DATABASE_URL` for a Neon-compatible Postgres
  connection), `ADMIN_PASSWORD`, and `SESSION_SECRET` as server-side Worker
  variables/secrets. Do not add these with a `VITE_` prefix.
- Keep using the existing database if it is reachable from Cloudflare; a new
  database needs the existing SQL migration and catalog data transferred
  separately.
