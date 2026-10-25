---
name: Hosted database setup
description: Preserve the existing Netlify database while supporting Vercel and Cloudflare Postgres connections.
---

The storefront supports Netlify, Vercel, and Cloudflare. Netlify uses `NETLIFY_DB_URL`; Vercel and Cloudflare use a Neon-compatible `POSTGRES_URL` (or `DATABASE_URL`) with the Neon serverless driver. Only select generic Postgres variables on those hosted runtimes, so Replit's own `DATABASE_URL` is never mistaken for the storefront's production database. Cloudflare Workers can be identified by `navigator.userAgent === "Cloudflare-Workers"`; Pages also provides `CF_PAGES`.

**Why:** The user runs Maya Collection on Cloudflare and the existing catalog needs durable PostgreSQL storage across deployments, without silently switching to Replit's database.

**How to apply:** Keep `NETLIFY_DB_URL` for Netlify. On Vercel or Cloudflare, set `POSTGRES_URL` (or `DATABASE_URL`), `ADMIN_PASSWORD`, and `SESSION_SECRET` as server-side environment variables. If using a new database, apply the existing SQL migration and transfer catalog data explicitly; do not silently switch to Replit's database.
