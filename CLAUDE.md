# The Wine Guide - CLAUDE.md

Project memory for future coding sessions. Keep this aligned with the live codebase.

## Overview

The Wine Guide is a React 18 + Vite wine reference app with a personal cellar tracker, curated venue guide, pairing tools, and editorial bottle pages.

Current architecture:
- Frontend: React 18, React Router 6, Tailwind CSS 3
- Server: Express (`server.mjs`)
- Routing: `HashRouter`
- Build: Vite 5
- Persistence:
  - local `localStorage` for cellar state on each device
  - normalized internal cellar `items` model in the frontend
  - optional cross-device sync via `/api/cellar-items/:syncId`
  - sync sessions bootstrapped via `/api/cellar-sync-session/:syncId`
  - new device sessions require the shared sync code plus the shared sync passphrase
  - new sync spaces record an owner email and return a recovery key
  - owner-management sessions are bootstrapped via `/api/cellar-sync-owner/:syncId/session`
  - passphrase rotation and session revocation are handled by `/api/cellar-sync-owner/:syncId/rotate-passphrase`
  - linked device tokens can be listed and revoked via `/api/cellar-sync-owner/:syncId/devices`
  - item sync uses PostgreSQL when `DATABASE_URL` is set, otherwise file-backed storage
  - removals are propagated as tombstones via `deletedAt`

Current dataset facts:
- 321 wines
- 22+ countries, 103+ region strings
- Categories: approx 125 red, 106 white, 55 sparkling, 21 rosé, 11 dessert/fortified
- 267 wines currently have a source `labelImage`
- 69 venues in Amanda's Places across 21 towns in 4 region groups (UK / Europe / Asia / Americas)
- 13 venue wine-list sources in `src/data/venueWineLists.js`
- `src/utils/wineVisuals.js` resolves retailer-mark visuals to honest equivalent bottle, estate, or region visuals for Explore and Wine Detail

## Commands

```bash
npm run dev         # Vite dev server
npm run build       # production build -> dist/
npm run preview     # Vite preview
npm start           # Express server, serves dist/ and the sync APIs
npm test            # Vitest invariants
npm run test:watch  # Vitest watch mode
```

Notes:
- `npm start` is not Vite preview. It runs `node server.mjs`.
- `npm run build` is currently clean.
- `npm test` is currently clean (`102/102`).

## Important Files

```text
server.mjs                              Express server + cellar sync API + static dist serving
src/App.jsx                             Route table + lazy page loading + shell states
src/main.jsx                            React entry point
src/index.css                           Tailwind entry + app utility classes

src/data/wines.js                       Main wine dataset + schema normalizer
src/data/pairings.js                    Pairing wizard data
src/data/venueWineLists.js              Venue wine-list data keyed by venue id

src/__tests__/wines.invariants.test.js          Data invariants + normalization tests for wines.js
src/__tests__/venueWineLists.invariants.test.js Venue-list schema + cross-reference tests

src/hooks/useCellar.js                  Cellar state, persistence, import helpers
src/hooks/useVenueSourceInbox.js        Venue source inbox local storage hook

src/components/CellarCloudSyncBridge.jsx  Background push/pull sync bridge
src/components/GlobalSearch.jsx         Cmd+K full-screen search overlay
src/components/Nav.jsx                  Main navigation
src/components/Footer.jsx               Footer
src/components/InstallPrompt.jsx        PWA install prompt
src/components/Logo.jsx                 Brand marks and Amanda visuals
src/components/TasteProfile.jsx         Radar chart
src/components/WineCard.jsx             Standard wine card

src/components/cellar/constants.js      TABS, CATEGORY_COLORS, PURCHASE_CHANNELS, RETAILER_OPTIONS, drinkWindowStatus()
src/components/cellar/StarRating.jsx    Shared star components
src/components/cellar/CellarHero.jsx    Hero section with stats cards
src/components/cellar/CellarTabs.jsx    Tab bar
src/components/cellar/BottleCard.jsx    Bottle card
src/components/cellar/WishlistCard.jsx  Wishlist card
src/components/cellar/TastedReviewTable.jsx  Review table
src/components/cellar/EmptyState.jsx    Empty state component
src/components/cellar/AddBottleModal.jsx     Add bottle form
src/components/cellar/EditBottleModal.jsx    Edit existing bottle
src/components/cellar/TastingNoteModal.jsx   Tasting-note modal
src/components/cellar/CellarStatsDashboard.jsx  Cellar overview dashboard
src/components/cellar/VivinoImportPanel.jsx  Vivino CSV import
src/components/cellar/WishlistSharePanel.jsx Wishlist share URL generation
src/components/cellar/DrinkWindowAlerts.jsx  Drink-window banners
src/components/cellar/CellarBottlesTab.jsx   Bottles tab
src/components/cellar/CellarWishlistTab.jsx  Wishlist tab
src/components/cellar/CellarSyncPanel.jsx    Cloud sync + manual backup

src/pages/Home.jsx                      Homepage
src/pages/Explorer.jsx                  Main explorer/filter page
src/pages/WineDetail.jsx                Detail page with editorial story layout
src/pages/Cellar.jsx                    Cellar orchestrator
src/pages/Shop.jsx                      Retailer guide and retailer-specific wine views
src/pages/Sheffield.jsx                 Amanda's Places page
src/pages/WishlistShare.jsx             Shared wishlist page
src/pages/Education.jsx                 Wine school
src/pages/Sparkling.jsx                 Sparkling guide
src/pages/Pairing.jsx                   Pairing wizard
src/pages/Critics.jsx                   Critics page
src/pages/TasteProfiler.jsx             Taste quiz
src/pages/VintageGuide.jsx              Vintage quality grid
src/pages/Producers.jsx                 Producer index
src/pages/ProducerDetail.jsx            Producer detail

src/utils/cellarSync.js                 Cloud sync id/payload helpers
src/utils/wishlistShare.js              Wishlist share encoding/decoding helpers
src/utils/vivinoImport.js               CSV parser and Vivino -> tasted entry mapper
src/utils/retailerBrands.jsx            Retailer logo/badge config
src/utils/ourTake.js                    Generated "Our Take" copy
src/utils/wineRecommendations.js        Similarity engine
src/utils/wineVisuals.js                Visual resolver for Explore / Wine Detail / cards
src/utils/wineDisplay.js                NV / edition / display helper text

public/venue-images/fallow-room.jpg         Local official room image for Fallow
public/venue-images/scotts-mayfair-room.png Local official room image for Scott's Mayfair
public/venue-images/joro-room-wide.jpg      Local official room image for Jöro
```

## Routing

Routes currently registered in `src/App.jsx`:

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
- `/producers`
- `/producers/:slug`
- `/vintages`

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
- `region`
- `subcategory`
- `vintage`

Important practical note:
- raw source entries in `_wines` still contain a mix of older hand-written and bulk-generated styles
- the exported `wines` array is the clean source of truth used by the app and tests
- when adding new wines, prefer writing the normalized shape directly rather than depending on cleanup logic

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

## Places Guide Notes

The live `VENUES` array in `src/pages/Sheffield.jsx` contains 69 venues across 21 towns in 4 region groups.

Town filter groups (defined in `TOWN_GROUPS` constant):
- UK: Sheffield, Stannington, Morpeth, Stroud, Walton-on-Thames, London, Chelmsford, Leeds, Harrogate, York, Poole, Weymouth
- Europe: Valencia, Málaga, Munich, Arcachon, Cap Ferret
- Asia: Singapore
- Americas: New York, Miami, Panama City

Venue counts by town:
- Sheffield: 9 · Stannington: 3 · Walton-on-Thames: 2 · Stroud: 2 · Morpeth: 2
- Valencia: 13 · London: 6 · New York: 2 · Chelmsford: 1
- Leeds: 2 · Harrogate: 1 · York: 1
- Munich: 4 · Arcachon: 1 · Cap Ferret: 3 · Málaga: 2
- Singapore: 4 (Long Bar Raffles, CÉ LA VI, Gordon Grill Goodwood Park, temper.)
- Poole: 1 · Weymouth: 2 · Miami: 2 · Panama City: 2

Current Places image policy:
- use actual venue photography where possible
- do not use retailer logos, bottle labels, or vineyard stand-ins for venue cards
- if no honest venue image is available, keep the venue text-led rather than using weak food, menu, or slogan graphics

Current intentional text-led venues:
- `forastera-valencia`
- `taberna-la-samorra`
- `flama-valencia`
- `rausell-valencia`
- `tannin-level-harrogate` (official site down)
- `le-patio-arcachon` (official domain dead)

Note on Singapore: **Alma at Goodwood Park was permanently closed** and has been replaced with **Gordon Grill** (`gordon-grill-goodwood-park`) at the same 22 Scotts Road address. Gordon Grill has been operating since 1963 in the same heritage building. Alma (`alma-goodwood-park-singapore`) no longer exists in the VENUES array.

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
- `updateTastedEntry`
- `addToWishlist`
- `removeFromWishlist`
- `importTastedEntries`
- `importCellarData`
- `isInCellar`
- `isInWishlist`

Cellar item model (via `normalizeCellarItem` in `useCellar.js`):
- `rating`: 1-5 star quality rating
- `wouldBuyAgain`: 1-5 repurchase rating
- `tastingNote`: free-text tasting note string
- `score`: numeric critic score 0-100
- Structured tasting fields: `colour`, `nose`, `body`, `acidity`, `tannins`, `finish`

Cross-device sync flow:
- Local cellar state is persisted in `localStorage`
- The hook stores a single normalized `items` list and derives legacy bucket views from it
- `CellarCloudSyncBridge.jsx` watches local revisions
- The bridge mints or refreshes a device session through `/api/cellar-sync-session/:syncId`
- Session bootstrap requires the shared sync passphrase stored by the Cellar settings UI
- New sync spaces also store an owner email and issue a recovery key back to the UI
- `Cellar.jsx` can mint a separate owner-management session through `/api/cellar-sync-owner/:syncId/session`
- Owner-management sessions can fetch `/api/cellar-sync-owner/:syncId/devices` and revoke stale device tokens
- `Cellar.jsx` can rotate the passphrase with either the current passphrase or the recovery key
- The bridge talks to `/api/cellar-items/:syncId`
- Item sync requests require a bearer token returned by the session bootstrap endpoint
- `server.mjs` supports PostgreSQL-backed item sync when `DATABASE_URL` is available
- legacy `/api/cellar-sync/:syncId` remains for the manual snapshot sync path

Important working rule:
- sync has been intentionally left alone during the current UI/data polish phase because it was already working
- do not casually refactor sync/auth code while doing guide or Places work

Production Railway variables currently in use:
- `CELLAR_SYNC_STORE_PATH=/app/data/cellar-sync-store.json`
- `RAILWAY_VOLUME_MOUNT_PATH=/app/data`

## Build and Deployment

Build config:
- `vite.config.js` manually extracts a `vendor` chunk
- chunk size warning limit is raised to `800`
- the wine dataset still lands in its own large shared chunk

Current verified build output from 2026-03-13:
- `index`: 731.30 kB / 175.68 kB gzip
- `vendor`: 162.98 kB / 53.24 kB gzip
- `Sheffield`: 180.89 kB / 49.57 kB gzip
- `Education`: 102.48 kB / 30.77 kB gzip
- `Cellar`: 89.57 kB / 19.38 kB gzip
- `WineDetail`: 45.15 kB / 10.52 kB gzip
- `wineVisuals`: 40.25 kB / 11.70 kB gzip
- PWA output: `sw.js` + Workbox, 31 precached entries

Railway notes:
- `railway.toml` starts the app with `npm start`
- `nixpacks.toml` installs with `npm ci` and builds with `npm run build`
- the Express server serves the built SPA and the sync API together
- latest successful Railway deployment: `d86df9f5-d230-4ee4-a879-1d9089f8edfc`

## Current Known Issues

1. Sync still has no full signed-in account model.
   The owner-email / passphrase / recovery-key flow exists, but there is still no complete hosted login or verified recovery channel.

2. The shared wine-data bundle is still the main performance hotspot.
   It builds successfully, but any future performance work should start there.

3. A small number of Places venues still have no honest official room image.
   The current fallback treatment is deliberate and acceptable, but those four Valencia venues are the main remaining sourcing gap.
