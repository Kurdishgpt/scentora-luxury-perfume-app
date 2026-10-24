# Running SCENTORA on Replit

This import keeps its existing React, TanStack Start, Vite, Tailwind, and Bun setup.

## Development

- Install dependencies with `bun install --frozen-lockfile`.
- Use the **Start application** workflow (the Run button), or run `bun run dev`.
- Vite listens on `0.0.0.0:5000` so Replit Preview can reach it.
- `/` is the perfume storefront showcase; `/admin` is the admin interface showcase.
- Run the existing tests with `bun run test`.

No external service credentials are needed for the current app. The imported
screens are prototypes: product/cart state lives in the browser's React state,
checkout opens WhatsApp, and the admin interface is not an authenticated,
persistent store-management backend.

The repository remains connected to Lovable. Follow `AGENTS.md`; do not rewrite
published Git history or replace the existing stack for routine changes.
