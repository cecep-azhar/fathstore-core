# ⚠️ Legacy App Directory

**This directory has been migrated to the new monorepo structure.**

**Status:** DEPRECATED - Do not use for new development

## What happened here?

This was the original monolithic Next.js application that has been refactored into the `apps/` monorepo structure:

- **`apps/store/`** — Customer storefront (active)
- **`apps/admin/`** — Payload CMS admin panel (active)
- **`apps/member/`** — Member dashboard (active)

## Why archive?

1. **Duplicate code** — This directory contains pages that are duplicated in `apps/store/`
2. **Outdated configuration** — Uses old Payload CMS setup
3. **Maintenance burden** — Keeping two codebases in sync is error-prone

## Actions taken

- [x] Copied all files to `apps/legacy/` for reference
- [x] Removed from main build (root `app/` no longer exists)
- [ ] Delete after confirmation (optional cleanup)

## If you need to reference old code

Look in `apps/legacy/` but prefer `apps/store/` for any storefront work.

**Date archived:** 2026-04-22