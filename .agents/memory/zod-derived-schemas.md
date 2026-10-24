---
name: Zod 3 derived schemas
description: Compose object variants and refinements safely with the Zod 3 API used by this project.
---

When a validator needs both a refined object and a derived variant (such as a create draft), derive the variant from the base `z.object()` before calling `.refine()`, then apply the shared refinement to each final schema. In Zod 3, `.refine()` returns a `ZodEffects` wrapper that does not provide object methods such as `.omit()`.

**Why:** Calling `.omit()` after `.refine()` caused a server-side runtime error during route loading, so the page failed before it could render.

**How to apply:** Keep the object shape as a base schema, define reusable refinement predicates, then create `base.refine(...)` and `base.omit(...).refine(...)` separately.
