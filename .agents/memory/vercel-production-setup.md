---
name: Vercel production setup
description: The user's production database, admin-auth, and preferred domain choices for Vercel.
---

For the Vercel deployment, use a separate production PostgreSQL database rather than the Replit development database. Keep the admin password server-side in Vercel environment settings; never hard-code it or persist it in browser storage. The preferred hostname is `e-app.vercel.app`, only if Vercel confirms it can be attached to this project.

**Why:** The user selected these production settings to avoid sharing development data and exposing the admin credential.

**How to apply:** Configure Vercel with a production database connection and server-side auth variables. Verify domain availability before changing the project alias.
