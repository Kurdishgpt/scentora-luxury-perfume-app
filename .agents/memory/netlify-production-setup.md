---
name: Netlify and Vercel database setup
description: Keep the existing Netlify database working while enabling a separate Vercel Postgres connection.
---

The storefront supports both database paths: Netlify uses `NETLIFY_DB_URL`; Vercel uses a Neon-compatible `POSTGRES_URL` (or `DATABASE_URL`) with the Neon serverless driver. Only select generic Postgres variables when the runtime is Vercel, so Replit's own `DATABASE_URL` is never mistaken for the storefront's production database.

**Why:** The user asked to make the existing Netlify-backed store work on Vercel too. The catalog and admin changes need durable PostgreSQL storage, and a new Vercel database does not automatically contain existing catalog data.

**How to apply:** Keep `NETLIFY_DB_URL` for Netlify. On Vercel, set `POSTGRES_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` as server-side environment variables. If using a new database, apply the existing SQL migration and transfer catalog data explicitly; do not silently switch to Replit's database.
