---
name: Stable catalog image paths
description: Rules for product image URLs persisted in catalog JSON and database rows.
---

Persist product images using stable public paths such as `/images/example.jpg`, or a gallery-upload data URI. Do not store Vite development paths like `/src/assets/...` or build-hashed `/assets/...` paths in catalog data. Normalize legacy values when reading and saving persisted catalog rows.

**Why:** Existing catalog rows saved Vite development asset paths that were unavailable in the deployed Netlify build, so the product images disappeared.

**How to apply:** When changing catalog image storage or adding built-in images, keep deployed paths stable and retain backward-compatible normalization for saved rows.
