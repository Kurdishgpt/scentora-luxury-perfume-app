---
name: Netlify production setup
description: Production database and admin credential requirements for the storefront's current Netlify deployment target.
---

The current deployment target is Netlify. Use a separate persistent production PostgreSQL database rather than the Replit development database. Keep the admin password and session secret server-side in Netlify environment settings; never hard-code them or persist them in browser storage.

**Why:** The user chose a separate production database and server-side admin credential handling, then switched the deployment target from Vercel to Netlify.

**How to apply:** Configure `DATABASE_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in Netlify before deploying. A local or function-filesystem database is not durable for catalog edits.
