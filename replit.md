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
