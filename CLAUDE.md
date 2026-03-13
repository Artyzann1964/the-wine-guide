# The Wine Guide - CLAUDE.md

Project memory for future coding sessions. Keep this aligned with the live codebase.

## Overview

The Wine Guide is a React 18 + Vite wine reference app with a personal cellar tracker.

Current architecture:
- Frontend: React 18, React Router 6, Tailwind CSS 3
- Server: Express (`server.mjs`)
- Routing: `HashRouter`
- Build: Vite 5
- Persistence:
  - local `localStorage` for cellar state on each device
  - normalized internal cellar `items` model in the frontend
  - optional cross-device sync via `/api/cellar-items/:syncId`
  - sync sessions are bootstrapped via `/api/cellar-sync-session/:syncId`
  - new device sessions require the shared sync code plus a shared sync passphrase
  - new sync spaces record an owner email and return a recovery key
  - owner-management sessions are bootstrapped via `/api/cellar-sync-owner/:syncId/session`
  - passphrase rotation and session revocation are handled by `/api/cellar-sync-owner/:syncId/rotate-passphrase`
  - linked device tokens can be listed and revoked via `/api/cellar-sync-owner/:syncId/devices`
  - item sync uses PostgreSQL when `DATABASE_URL` is set, otherwise file-backed storage
  - removals are propagated as tombstones via `deletedAt`

Current dataset facts:
- 267 wines
- 21 countries
- 97 region strings
- Categories: 106 red, 93 white, 39 sparkling, 10 dessert, 19 rosé
- 14 venues in Amanda's Places
- 8 venue wine-list sources in `src/data/venueWineLists.js`
- 17 wines have `labelImage` fields (Dom Pérignon, Bollinger, Château Margaux, Penfolds Grange, Opus One, Vega Sicilia Único, Château Rayas, Château d'Yquem, Trimbach Clos Sainte Hune, Giacomo Conterno Barolo, Faustino I Gran Reserva, plus 6 others)

## Commands

```bash
npm run dev       # Vite dev server on :5173
npm run build     # production build -> dist/
npm run preview   # Vite preview on :3000 (or $PORT)
npm start         # Express server, serves dist/ and the sync APIs
```

Notes:
- `npm start` is not Vite preview. It runs `node server.mjs`.
- `npm run build` is currently clean.

## Important Files

```text
server.mjs                              Express server + cellar sync API + static dist serving
src/App.jsx                             Route table + lazy page loading
src/main.jsx                            React entry point
src/index.css                           Tailwind entry + app utility classes

src/data/wines.js                       Main wine dataset + schema normalizer
src/data/pairings.js                    Pairing wizard data
src/data/venueWineLists.js              Venue wine-list data keyed by venue id

src/hooks/useCellar.js                  Cellar state, persistence, import helpers
src/hooks/useVenueSourceInbox.js        Venue source inbox local storage hook

src/components/CellarCloudSyncBridge.jsx  Background push/pull sync bridge
src/components/GlobalSearch.jsx         Cmd+K full-screen search overlay (pre-built index, keyboard nav)
src/components/Nav.jsx                  Navigation (search button wired to GlobalSearch)
src/components/Footer.jsx               Footer
src/components/Logo.jsx                 Brand marks and Amanda visuals
src/components/TasteProfile.jsx         Radar chart
src/components/WineCard.jsx             Standard wine card (shows labelImage as subtle overlay)

src/components/cellar/constants.js      TABS, CATEGORY_COLORS, PURCHASE_CHANNELS, RETAILER_OPTIONS, drinkWindowStatus()
src/components/cellar/StarRating.jsx    StarIcon, StarDisplay, StarInput (shared star components)
src/components/cellar/CellarHero.jsx    Hero section with stats cards
src/components/cellar/CellarTabs.jsx    Tab bar
src/components/cellar/BottleCard.jsx    Bottle card with star rating display + Edit button (onEdit prop)
src/components/cellar/WishlistCard.jsx  Wishlist card
src/components/cellar/TastedReviewTable.jsx  Review table (desktop + mobile; renders structured tasting tags)
src/components/cellar/EmptyState.jsx    Empty state component
src/components/cellar/AddBottleModal.jsx     Add bottle form with optional star rating
src/components/cellar/EditBottleModal.jsx    Edit existing bottle (pre-populated, calls updateBottle)
src/components/cellar/TastingNoteModal.jsx   Mark-as-tasted form with structured notes (colour/nose/body/acidity/tannins/finish)
src/components/cellar/CellarStatsDashboard.jsx  Cellar overview: donut chart, summary cards, 6-month timeline
src/components/cellar/VivinoImportPanel.jsx  Vivino CSV import
src/components/cellar/WishlistSharePanel.jsx Wishlist share URL generation
src/components/cellar/DrinkWindowAlerts.jsx  Drink window alert banners (over-peak/ready/opening-soon)
src/components/cellar/CellarBottlesTab.jsx  Bottles tab: search/sort, BottleCard grid, category breakdown
src/components/cellar/CellarWishlistTab.jsx Wishlist tab: search/sort, WishlistCard grid
src/components/cellar/CellarSyncPanel.jsx    Cloud sync + manual backup

src/pages/Home.jsx                      Homepage (single amanda-eindhoven.jpg ghost hero, right-anchored, opacity 0.18)
src/pages/Explorer.jsx                  Main explorer/filter page
src/pages/WineDetail.jsx                Detail page + add-to-cellar modal (similarity-based related wines)
src/pages/Cellar.jsx                    Cellar orchestrator (~155 lines; bottles/wishlist/tasted tabs delegated to sub-components)
src/pages/Shop.jsx                      Retailer guide and retailer-specific wine views
src/pages/Sheffield.jsx                 Amanda's Places page
src/pages/WishlistShare.jsx             Shared wishlist page
src/pages/Education.jsx                 Wine school
src/pages/Sparkling.jsx                 Sparkling guide
src/pages/Pairing.jsx                   Pairing wizard
src/pages/Critics.jsx                   Critics page
src/pages/TasteProfiler.jsx             Taste quiz
src/pages/VintageGuide.jsx              Vintage quality grid — 19 regions × 2010-2024, colour-coded scores, country+category filters
src/pages/Producers.jsx                 Producer index with search + producer cards
src/pages/ProducerDetail.jsx            Producer detail — wines grid + aggregate taste profile radar

src/utils/cellarSync.js                 Cloud sync id/payload helpers
src/utils/wishlistShare.js              Wishlist share encoding/decoding helpers
src/utils/vivinoImport.js               CSV parser and Vivino -> tasted entry mapper
src/utils/retailerBrands.jsx            Retailer logo/badge config
src/utils/ourTake.js                    Generated "Our Take" copy
src/utils/wineRecommendations.js        Similarity engine: getRecommendations() + getCellarRecommendations()
```

## Routing

Routes currently registered in `App.jsx`:

- `/`
- `/explore`
- `/explore/:id`
- `/sparkling`
- `/pairing`
- `/cellar`
- `/wishlist-share`
- `/learn`
- `/shop`
- `/places`
- `/sheffield`
- `/critics`
- `/taste-quiz`
- `/vintages`
- `/producers`
- `/producers/:slug`

Because the app uses `HashRouter`, deployed links resolve as `/#/route`.

## Data Notes

`src/data/wines.js` exports `wines`, which is the normalized result of `_wines.map(normalizeWine)`.

The normalizer currently standardizes:
- `category`
- `priceRange`
- `price`
- `grapes`
- `style`
- `pairings`
- `vintageGuide`
- `whereToBuy`
- `decant`

The normalizer uses spread (`{ ...w, ... }`) so additional fields like `labelImage` pass through without changes.

Do not add new wines using the old bulk-generation schema. Write new entries in the normalized shape.

Retailer names matter. Current canonical branded set:
- `Tesco`
- `Sainsbury's`
- `Waitrose`
- `Asda`
- `M&S`
- `Aldi`
- `Lidl`
- `Morrisons`
- `Le Bon Vin`
- `Majestic`
- `Co-op`

## Cellar and Sync

`useCellar()` returns:
- `cellar`
- `items`
- `bottles`
- `wishlist`
- `tasted`
- `cellarRevision`
- `stats`
- `addBottle`
- `removeBottle`
- `updateBottle`
- `markTasted`
- `addToWishlist`
- `removeFromWishlist`
- `importTastedEntries`
- `importCellarData`
- `isInCellar`
- `isInWishlist`

Cellar item model (via `normalizeCellarItem` in `useCellar.js`):
- `rating`: 1-5 star quality rating (nullable, settable from AddBottleModal and TastingNoteModal)
- `wouldBuyAgain`: 1-5 star "would buy again" rating (nullable, settable from TastingNoteModal)
- Both are sync-safe: nullable fields propagate through JSON sync payload; old devices ignore unknown fields

Cross-device sync flow:
- Local cellar state is persisted in `localStorage`
- The hook stores a single normalized `items` list and derives legacy bucket views from it
- `CellarCloudSyncBridge.jsx` watches local revisions
- The bridge first mints or refreshes a device session through `/api/cellar-sync-session/:syncId`
- Session bootstrap requires the shared sync passphrase stored by the Cellar settings UI
- New sync spaces also store an owner email and issue a recovery key back to the UI
- `Cellar.jsx` can mint a separate owner-management session through `/api/cellar-sync-owner/:syncId/session`
- Owner-management sessions can fetch `/api/cellar-sync-owner/:syncId/devices` and revoke stale device tokens
- `Cellar.jsx` can rotate the passphrase with either the current passphrase or the recovery key, and the server revokes existing sessions when that happens
- The bridge talks to `/api/cellar-items/:syncId`
- Item sync requests require a bearer token returned by the session bootstrap endpoint
- `server.mjs` supports PostgreSQL-backed item sync when `DATABASE_URL` is available
- legacy `/api/cellar-sync/:syncId` remains for the manual snapshot sync path

Production Railway variables currently in use:
- `CELLAR_SYNC_STORE_PATH=/app/data/cellar-sync-store.json`
- `RAILWAY_VOLUME_MOUNT_PATH=/app/data`

This means production sync can run in two modes:
- Postgres-backed centralized item sync when Railway Postgres is attached
- volume-backed file persistence when only the Railway volume is configured

## Wishlist Share

Wishlist sharing is handled by `src/utils/wishlistShare.js`.

Flow:
- build payload from wishlist entries
- encode to base64url
- generate `#/wishlist-share?wl=...`
- decode on `WishlistShare.jsx`

The shared page resolves wishlist entries back against the local wine dataset when possible.

## Vivino Import

Current preferred flow:
- Cellar page button loads `public/vivino_wines_export.csv`
- `parseVivinoCsv()` reads rows
- `vivinoRowsToTastedEntries()` converts them to tasted entries
- `importTastedEntries()` merges with duplicate protection

Legacy support still present:
- `public/vivino_import.js` can still be pasted into the browser console

## Build and Deployment

Build config:
- `vite.config.js` manually extracts a `vendor` chunk
- chunk size warning limit is raised to `800`
- the wine dataset still lands in its own large shared chunk

Current verified build output from 2026-03-13:
- `index` (wines dataset): 579.59 kB / 126.69 kB gzip
- `Education`: 100.69 kB / 30.46 kB gzip
- `Sheffield`: 105.57 kB / 29.59 kB gzip
- `Cellar`: 86.33 kB / 18.44 kB gzip
- `VintageGuide`: 18.66 kB / 4.46 kB gzip
- `vendor`: 162.98 kB / 53.24 kB gzip
- PWA: sw.js + workbox generated, 30 entries precached

Railway notes:
- `railway.toml` starts the app with `npm start`
- `nixpacks.toml` installs with `npm ci` and builds with `npm run build`
- the Express server serves the built SPA and the sync API together

## Current Known Issues

These are active review findings and should be assumed true until fixed:

1. `src/components/CellarCloudSyncBridge.jsx` and `server.mjs`
   Sync now merges item adds, updates, and removals centrally. Ownership has an owner email, recovery key, passphrase rotation, and linked-device revocation, but there is still no signed-in account model or verified email channel.
2. Wine label images cover 17 wines. More could be added via Wikimedia Commons CC-licensed images (verify URLs with MD5 hash path before adding).
3. ~~`Cellar.jsx` is growing (~400+ lines) and could be split further~~ — resolved: Cellar.jsx is now ~155 lines; bottles/wishlist tabs extracted to dedicated sub-components.

## Session Guidance

When updating docs or status notes:
- prefer exact current counts over rough estimates
- verify data counts from `src/data/wines.js`
- verify route tables from `src/App.jsx`
- verify deployment claims from `server.mjs`, `railway.toml`, `nixpacks.toml`, and Railway variables

When changing retailer-related code:
- keep canonical retailer names aligned between `wines.js`, `retailerBrands.jsx`, `Explorer.jsx`, and `Shop.jsx`

When changing cellar features:
- check `useCellar.js`, `Cellar.jsx`, `CellarCloudSyncBridge.jsx`, and `server.mjs` together

When changing the GlobalSearch overlay:
- The search index is pre-built at module load time in `GlobalSearch.jsx`
- Scoring: name-start(100) > producer-start(80) > name-includes(60) > producer-includes(50) > full-text(30) > multi-token(20)
- Triggered by Cmd+K (Mac) / Ctrl+K (Windows) or the search icon in Nav

When adding new pages/routes:
- Add lazy import + Route in `src/App.jsx`
- Add Nav link in `src/components/Nav.jsx` (mobile menu list + desktop if appropriate)
