---
name: Portable package lockfiles
description: Check resolved package tarball hosts when installations fail only in external CI.
---

Inspect the lockfile's resolved tarball URLs when an external deployment runner reports package download failures, even if the package manifest and lockfile are present. A Bun lockfile generated in this environment may record Replit-private package-firewall URLs; external CI cannot resolve those hosts. Replace only inaccessible tarball hosts with the corresponding public registry URLs when the packages are publicly available, keeping versions and integrity hashes unchanged.

**Why:** Netlify could not fetch PostgreSQL packages because their locked tarball URLs used Replit's private package firewall, not because the dependencies were absent.

**How to apply:** For external CI install failures, compare failed package URLs in the lockfile to the runner's reachable registries before attributing the failure to a transient network issue.
