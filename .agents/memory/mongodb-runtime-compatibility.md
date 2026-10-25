---
name: MongoDB runtime compatibility
description: Notes for using the official MongoDB Node driver in Cloudflare Workers and Bun-based local development.
---

Cloudflare Worker builds must use Nitro's `cloudflare-module` preset with `nodejs_compat` enabled. In Bun, BSON calls `process.getBuiltinModule("v8").startupSnapshot.isBuildingSnapshot()`, but Bun's placeholder throws instead of returning a value. Keep the MongoDB driver dynamically imported only when database access is needed, and return `false` from that capability check only when `process.versions.bun` is present.

**Why:** An eager MongoDB import can break local app startup before the application attempts to connect to a database, even though the Cloudflare Worker build itself is valid.

**How to apply:** Preserve lazy imports in server-only data code. Guard the snapshot API only for Bun; do not replace Cloudflare's normal Node.js compatibility behavior.
