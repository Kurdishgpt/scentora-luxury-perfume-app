---
name: Portable package lockfiles
description: Check resolved package tarball hosts when installations fail only in external CI.
---

Inspect the exact resolved tarball URL when an external deployment runner reports package download failures; do not infer a missing package from a connection error. If a public package resolves through `package-firewall.replit.internal`, change only that host to `https://registry.npmjs.org/`, preserving the package path, version, and integrity hash. Do not rewrite other hosts unless their reachability is verified.

**Why:** Replit-generated Bun locks can contain private firewall URLs that external runners cannot resolve. In this project, the committed `pg` entries already pointed at npmjs.org, so their `ConnectionRefused` errors were not evidence of missing dependencies or private `pg` URLs.

**How to apply:** Compare failed package URLs with lockfile entries first; repair only confirmed private hosts, then retry a runner-side registry failure after a cache-cleared deploy.
