# Campus Tour Handoff

This folder is a portable handoff bundle for the campus-tour React application. Copy its contents into the target repository root.

## Included

- `src/` — current Vite/React/TypeScript implementation through Task 7
- Root Vite, TypeScript, ESLint, and package-lock configuration
- `docs/superpowers/specs/` — approved product and architecture design
- `docs/superpowers/plans/` — approved implementation plan
- `.superpowers/sdd/2026-09-12-campus-tour/` — task briefs, reports, review packages, snapshots, and execution ledger

## Current implementation status

- Tasks 1–5 are implemented and independently reviewed.
- Task 1 coordinate corrections and Task 4 stale-reading error handling were fixed and re-reviewed.
- Task 6 (MapLibre home experience) and Task 7 (styling/documentation) are implemented.
- Task 8 verification is complete in the source workspace; rerun the commands below after copying.

## Run locally

From this folder after copying it into a repository:

```powershell
npm install
npm run dev
```

Verification commands:

```powershell
npm run test:run
npm run lint
npm run build
```

Geolocation requires `https://` in deployed environments (localhost is allowed). The app is intentionally foreground-only. It evaluates the latest reading immediately and every 3 seconds, requires two qualifying readings, uses a 20-foot radius, and rejects reported accuracy worse than 10 meters.

The MapLibre style can be overridden with `VITE_MAP_STYLE_URL`; the current fallback is the MapLibre demo style. The two sample coordinates are building-center estimates and should be field-tested before production use.

## Repository hygiene

Dependencies (`node_modules`), the local npm cache, build output (`dist`), and Git metadata are intentionally excluded. The `.superpowers/sdd` files are included because they preserve the implementation context and review history.
