# The Wine Guide - Project Status

Last updated: 2026-08-25
Build status: `npm run build` passes
Test status: `npm test -- --run` passes (`124/124`)
Deployment: Railway production at [the-wine-guide-production.up.railway.app](https://the-wine-guide-production.up.railway.app)
Release state: Berlin Places release candidate verified locally; production release evidence will be added after deployment
Release target: `lucid-surprise` / `production` / `the-wine-guide`

## Current Snapshot

- Architecture: React 18 + Vite SPA served by Express (`server.mjs`)
- Routing: `HashRouter`
- Wine data: 321 wines
- Places guide: 114 venues across 27 towns in 4 region groups
- Berlin coverage: 16 venues, led by 10 relaxed wine-bar, bistro and sharing-plate recommendations
- Sheffield coverage: 15 venues
- Valencia coverage: 29 venues
- Venue wine-list sources: 15 sourced venue lists in `src/data/venueWineLists.js`
- Places imagery policy: genuine venue photography or a deliberate text-led fallback
- Cellar sync: intentionally untouched during this Places release

## Berlin Places Release - 2026-08-25

### Relaxed wine-bar and bistro shortlist

The Berlin guide now leads with the social, wine-led brief rather than formal destination dining:

1. Trio
2. Pluto
3. Ottorink Weinbar
4. ORA
5. Jaja
6. La Buvette
7. Briefmarken Weine / Il Brief
8. Der Weinlobbyist
9. Barra
10. Standard Serious Pizza

These sit ahead of the six previously researched Berlin entries:

- Muret la Barba
- Freundschaft
- Restaurant Chateau Royal
- Bandol sur mer
- Cookies Cream
- Rutz

The set covers lean, mid-range, premium and luxury occasions across Mitte and well-connected nearby neighbourhoods. Trio is the modern German Wirtshaus answer; Pluto, Ottorink, Jaja and Der Weinlobbyist are the closest Gill & Co-style matches; ORA and Briefmarken supply the more unusual settings.

### Data integrity and imagery

- Added Berlin to the Europe town filter.
- Added invariant coverage for unique venue IDs.
- Added invariant coverage ensuring every venue `wineIds` reference exists in the wine dataset.
- Verified all exposed Berlin images in a real browser.
- Jaja remains deliberately text-led because its official site exposes no stable room image.
- Ottorink remains deliberately text-led because its official image host returned HTTP 429 in browser use.

## Local Verification - 2026-08-25

- `npm test -- --run`: passed, `124/124`
- `npm run build`: passed
- `git diff --check`: passed
- Desktop browser QA at 1280px: passed
- Mobile browser QA at 390 x 844: passed
- Berlin town filter: 16 considered places
- Ten new relaxed Berlin cards present in the intended order
- Failed venue images: 0
- Horizontal overflow: none
- Browser console errors: 0
- Existing non-blocking warnings: React Router future flags and stale Browserslist metadata

## Production Verification - Pending

Record the following after the release is deployed:

- committed source revision
- GitHub `origin/main` parity
- Railway deployment ID and final status
- production `/healthz` response
- production root HTTP response
- live Berlin Places browser evidence

## Release Files

- `src/data/places.js`
  - 16 researched Berlin venues and Berlin town-group registration
- `src/__tests__/venueWineLists.invariants.test.js`
  - unique venue-ID and wine-reference invariants
- `STATUS.md`
  - current release and verification record
- `CLAUDE.md`
  - current project facts for future sessions
- `AGENTS.md`
  - current project facts for Codex sessions
- `CODEX_HANDOFF.md`
  - release-specific handoff

## Deployment and Persistence

- Railway project: `lucid-surprise`
- Railway environment: `production`
- Railway service: `the-wine-guide`
- Railway runs `npm start`, which starts `server.mjs`
- The Express server serves `dist/` and exposes the cellar sync APIs
- Production persistence variables documented for the project:
  - `CELLAR_SYNC_STORE_PATH=/app/data/cellar-sync-store.json`
  - `RAILWAY_VOLUME_MOUNT_PATH=/app/data`

## Current Risks and Notes

1. Cellar sync remains intentionally untouched. Treat sync/auth work as a separate cautious project.
2. Do not weaken the Places image provenance policy to fill text-led cards.
3. Remote opening hours, prices, awards and menus can change; refresh venue facts before later trip use.
4. The shared data bundle remains the main performance hotspot.
5. Unrelated local images, datasets, sourcing notes, scripts and output folders are outside this release and must remain untouched.

## Suggested Next Improvements

- Add URL support for `region` and `town` query parameters so Berlin can be deep-linked directly.
- Add sourced wine-list data for the highest-priority Berlin wine bars where stable public lists exist.
- Re-check Berlin opening hours shortly before travel.
- Profile and split the shared wine and guide data bundle as a separate performance tranche.
