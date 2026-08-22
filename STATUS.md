# The Wine Guide - Project Status

Last updated: 2026-08-22
Build status: `npm run build` passes cleanly
Test status: `npm test -- --run` passes cleanly (`122/122`)
Deployment: Railway production at [the-wine-guide-production.up.railway.app](https://the-wine-guide-production.up.railway.app)
Release state: Sheffield and Valencia Places refresh verified locally; production deployment pending
Latest deployed source commit: `a87a593 feat: expand Valencia places guide`

## Current Snapshot

- App architecture: React 18 + Vite SPA behind an Express server (`server.mjs`)
- Routing: `HashRouter`
- Wine data: 321 wines
- Places guide: 98 venues across 26 towns in 4 region groups
- Sheffield coverage: 15 venues, including 5 newly researched wine-led or independent additions
- Valencia coverage: 29 venues, with trip-planning cues and two new near-Calle-de-Escolano additions
- Venue wine-list sources: 15 sourced venue lists in `src/data/venueWineLists.js`
- Places imagery follows a strict provenance policy: genuine venue photography or a deliberate text-led fallback
- Cellar sync: intentionally untouched during this Places work

## Release Candidate - 2026-08-22

### Sheffield guide and UI

- Rebuilt Amanda's Places as a more editorial, city-guide experience with:
  - a high-impact Sheffield hero and live guide statistics
  - a swipeable themed shortlist rail
  - clearer region, town and venue navigation
  - a dark, immersive venue detail panel
  - practical occasion, atmosphere, bottle and nearby-venue cues
  - improved responsive behaviour at a 390 x 844 mobile viewport
- Made Sheffield the default Places destination and Gillson's Brasserie the opening venue.
- Added five current Sheffield candidates:
  - Gillson's Brasserie
  - Restaurant Elm
  - Bench La Cave
  - Bark's Wine
  - Grub Records

### Valencia guide

- Added 2 Estaciones and Nuvo, taking Valencia to 29 entries.
- Added trip-mode and near-Calle-de-Escolano guidance alongside practical booking, timing and ordering cues.
- Preserved the existing evidence-led venue descriptions and intentional text-led fallbacks.

## Local Verification - 2026-08-22

- `npm test -- --run`: passed, `122/122`
- `npm run build`: passed
- `git diff --check`: passed
- Desktop browser QA: passed with no runtime errors
- Mobile browser QA at 390 x 844: passed with no runtime errors
- Verified key UI states:
  - Sheffield opens by default
  - all five new Sheffield venues are navigable
  - the themed shortlist rail and venue detail transitions work
  - town chips remain usable as a horizontal swipe rail on mobile

## Important Files

- `src/data/places.js`
  - Main Places dataset
  - Current Sheffield count: 15
  - Current Valencia count: 29
  - Current total venue count: 98
- `src/pages/Sheffield.jsx`
  - Amanda's Places page structure, filters and editorial experience
- `src/index.css`
  - Places visual system, motion and responsive treatments
- `src/data/venueWineLists.js`
  - Sourced venue wine-list data
- `src/__tests__/venueWineLists.invariants.test.js`
  - Venue wine-list and venue image invariants
- `public/venue-images/`
  - Local verified venue images

## Deployment and Persistence

- Railway project: `lucid-surprise`
- Railway environment: `production`
- Railway service: `the-wine-guide`
- Railway runs `npm start`, which starts `server.mjs`
- The Express server serves `dist/` and exposes the cellar sync APIs
- Production Railway domain:
  - [https://the-wine-guide-production.up.railway.app](https://the-wine-guide-production.up.railway.app)
- Production persistence variables documented for the project:
  - `CELLAR_SYNC_STORE_PATH=/app/data/cellar-sync-store.json`
  - `RAILWAY_VOLUME_MOUNT_PATH=/app/data`

## Current Risks and Notes

1. Cellar sync remains intentionally untouched.
   Treat sync/auth work as a separate cautious project.

2. Places image quality policy still matters.
   Do not use retailer logos, bottle labels, vineyard stand-ins, food-only shots, slogans or guessed CDN paths for venue cards. If there is no honest venue image, keep the card text-led.

3. Several venues are deliberately text-led.
   This is preferable to weak, misleading or unstable imagery.

4. The shared data bundle remains the main performance hotspot.
   The app builds cleanly, but future performance work should start with splitting or lazy-loading the guide data.

5. Unrelated local workspace files remain untracked.
   Local notes, source images, scripts, output folders and CSVs are excluded from this release.

## Suggested Next Improvements

- Add stable official venue photography where it can be verified without weakening provenance.
- Add sourced wine-list data for the highest-priority Sheffield and Valencia venues where public lists exist.
- Add URL support for `region` and `town` query parameters; deep-linking is currently venue-based via `?venue=...`.
- Profile and split the shared wine and guide data bundle as a separate performance tranche.
