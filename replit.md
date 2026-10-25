# Running SCENTORA on Replit

This import keeps its existing React, TanStack Start, Vite, Tailwind, and Bun setup.

## Development

- Install dependencies with `bun install --frozen-lockfile`.
- Use the **Start application** workflow (the Run button), or run `bun run dev`.
- Vite listens on `0.0.0.0:5000` so Replit Preview can reach it.
- `/` is the perfume storefront; `/admin` is the password-protected admin interface.
- Run the existing tests with `bun run test`.

The app requires these server-side Replit Secrets:

- `ADMIN_PASSWORD`: the password used to sign in to store administration.
- `SESSION_SECRET`: at least 32 characters for encrypted admin sessions.

Catalog data is stored in MongoDB. Cart state lives in React state, and checkout
opens WhatsApp. Local development can show the built-in sample catalog without
MongoDB, but admin edits require a MongoDB connection.

The repository remains connected to Lovable. Follow `AGENTS.md`; do not rewrite
published Git history or replace the existing stack for routine changes.

## Cloudflare Workers and Pages

- The production build targets Nitro's Cloudflare Worker runtime and enables
  Cloudflare's Node.js compatibility required by the MongoDB driver.
- Configure `MONGODB_URI`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in Cloudflare
  Worker variables/secrets. Keep them server-side; never use a `VITE_` prefix.
- The default MongoDB database name is `maya_collection`; set
  `MONGODB_DATABASE` to use another name.
- Before the first Cloudflare deploy, preserve the saved catalog with
  `NETLIFY_DB_URL` and `MONGODB_URI` configured securely in the environment,
  then run `bun run db:migrate-to-mongodb`. The importer refuses to overwrite
  an existing MongoDB catalog and never changes the old database. Do not remove
  the old database until the migrated storefront has been verified.
