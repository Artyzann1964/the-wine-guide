# The Wine Guide - Project Status

Last updated: 2026-04-02
Build status: `npm run build` passes cleanly
Test status: `npm test` passes cleanly (`102/102`)
Deployment: Railway live at [the-wine-guide-production.up.railway.app](https://the-wine-guide-production.up.railway.app)
Latest deployment: `d86df9f5-d230-4ee4-a879-1d9089f8edfc`

## Current Snapshot

- App architecture: React 18 + Vite SPA behind an Express server (`server.mjs`)
- Routing: `HashRouter`
- Wine data: 321 wines (+9 in session 2026-04-01 session 2)
- Geography coverage: 22+ countries, 103+ region strings
- Categories: approx 125 red, 106 white, 55 sparkling, 21 rosé, 11 dessert/fortified (estimated)
- Wine visuals:
  - 267 wines currently carry a source `labelImage`
  - Explore and Wine Detail route those through [src/utils/wineVisuals.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/utils/wineVisuals.js), which suppresses retailer-logo imagery in the main guide and swaps in honest equivalent bottle, estate, or region visuals where needed
- Places guide: 75 venues across 24 towns in 4 region groups
  - Sheffield: 9 · Stannington: 3 · Walton-on-Thames: 2 · Stroud: 2 · Morpeth: 2
  - Valencia: 13 · London: 6 · New York: 2 · Chelmsford: 1
  - Leeds: 2 · Harrogate: 1 · York: 1
  - Wentworth: 3 · Penistone: 1 · Doncaster: 1 · Barnsley: 1 · Rotherham: 1
  - Munich: 4 · Arcachon: 2 · Cap Ferret: 5 · Málaga: 2
  - Singapore: 4 · Poole: 1 · Weymouth: 2 · Miami: 2 · Panama City: 2
- Venue imagery: many newer venues are deliberately text-led — app gracefully falls back to VenueFallback when images fail to load
- Text-led venues (deliberate): `forastera-valencia`, `taberna-la-samorra`, `flama-valencia`, `rausell-valencia`, `tannin-level-harrogate`, `le-patio-arcachon`, plus all new South Yorkshire venues and the new Arcachon/Cap Ferret additions
- Venue wine lists: 13 sourced venue lists in [src/data/venueWineLists.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/data/venueWineLists.js)
- Cellar architecture: [src/pages/Cellar.jsx](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/pages/Cellar.jsx) is the top-level orchestrator; detailed UI lives in [src/components/cellar/](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/components/cellar/)
- Global search: Cmd+K / Ctrl+K overlay with quick-start lanes, top-result treatment, and keyboard navigation
- Producer pages: live producer index and producer detail flow
- Vintage Guide: live 19-region quality grid with filters and summary cues
- Tests: data invariants cover both [src/data/wines.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/data/wines.js) and [src/data/venueWineLists.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/data/venueWineLists.js)

## Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Home | Live |
| `/explore` | Explorer | Live |
| `/explore/:id` | Wine Detail | Live |
| `/sparkling` | Sparkling Guide | Live |
| `/pairing` | Pairing Wizard | Live |
| `/taste-quiz` | Taste Profiler | Live |
| `/critics` | Critics | Live |
| `/shop` | Know Your Shop | Live |
| `/cellar` | My Cellar | Live |
| `/places` | Amanda's Places | Live |
| `/sheffield` | Amanda's Places alias | Live |
| `/wishlist-share` | Wishlist Share | Live |
| `/learn` | Wine School | Live |
| `/vintages` | Vintage Guide | Live |
| `/producers` | Producer Index | Live |
| `/producers/:slug` | Producer Detail | Live |

## Latest Build Output

Verified on 2026-03-13:

| Chunk | Size | Gzip |
|-------|------|------|
| `index` | 731.30 kB | 175.68 kB |
| `vendor` | 162.98 kB | 53.24 kB |
| `Sheffield` | 180.89 kB | 49.57 kB |
| `Education` | 102.48 kB | 30.77 kB |
| `Cellar` | 89.57 kB | 19.38 kB |
| `WineDetail` | 45.15 kB | 10.52 kB |
| `wineVisuals` | 40.25 kB | 11.70 kB |

PWA output is still generated (`sw.js` + Workbox, 31 precached entries).

## Recent Changes (2026-04-02)

- Places guide expanded from 69 to 75 venues (+6): 3 new South Yorkshire towns (Doncaster, Barnsley, Rotherham) and 2 more Arcachon/Cap Ferret venues added
  - South Yorkshire: DN1 Delicatessen & Dining (Doncaster · 2 AA Rosettes · 130-wine list), Beatson House (Barnsley/Cawthorne · 18th-century cottage fine dining · Lightfoot Wines connection), Seasons Restaurant (Rotherham/Wickersley · seasonal bistro · Courtyard wine list)
  - Arcachon: La Plancha du Bassin (beachfront plancha grill · year-round · basin views)
  - Cap Ferret: La Maison du Bassin (boutique hotel bistro near lighthouse · Maître Restaurateur), Le Sail Fish (institution since 1984 · stunning 2022 redesign)
- Town filter TOWN_GROUPS updated: UK group now covers 17 towns (Doncaster, Barnsley, Rotherham added)
- Brenner Operngrill Munich: corrected attribution to `richardFavourite` — it is Richard's favourite, not Amanda's
- All new South Yorkshire and Arcachon/Cap Ferret venues are text-led with proper `imageFallbackLabel` and `imageFallbackNote`
- Build: Sheffield chunk grew to 263.66 kB · index 793.03 kB (both under warning limit)

## Recent Changes (2026-04-01 session 2)

- Wine count pushed to 321: 9 new wines added — Muscadet Clisson (first Muscadet in dataset), Douro Superior, Priorat Les Terrasses, Campo Viejo Reserva, Casillero del Diablo, Waitrose No.1 Saint-Émilion Grand Cru 2022, Sainsbury's TTD Wachau Riesling (first Austrian Riesling in dataset), Morrisons Best Limoux Chardonnay, Waitrose Loved & Found Old Vine Mataro
- Muscadet added for the first time — Domaine de la Pépière Clisson, the benchmark producer for shellfish pairing
- Austrian Riesling (Wachau) added for the first time via the Sainsbury's TTD range
- Álvaro Palacios Les Terrasses added — entry point to serious Priorat, 93 pts across vintages
- Goodwood Park Singapore: **Alma at Goodwood Park** replaced with **Gordon Grill** (Alma permanently closed; Gordon Grill has been in the same building since 1963, tableside carving trolley, Michelin listed)
- Town filter overhauled: 21 towns now displayed in four regional groups (UK / Europe / Asia / Americas) with inline region labels rather than a flat overflow pill row
- 2 venues converted to honest text-led treatment: The Tannin Level Harrogate (site down), Le Patio Arcachon (domain dead)

## Recent Changes (2026-04-01)

- Wine count pushed to 312: 10 new wines added covering Gigondas, Sancerre, Georgian Saperavi, Grüner Veltliner, Carménère (first in dataset), Pedro Ximénez sherry, Puglia Primitivo, South African Chenin Blanc, Provence rosé (Mirabeau), and Coonawarra Cabernet
- Carménère is now covered for the first time in the dataset (the "lost Bordeaux grape" rediscovered in Chile)
- Morrisons coverage expanded with a Georgian Saperavi entry (previously only 2 Morrisons wines in dataset)
- Tom Gilbey picks featured: Waitrose Organic Primitivo, Ken Forrester Chenin Blanc, Mirabeau Pure Rosé
- Places guide expanded from 36 to 69 venues (+33): 9 new cities/regions added including Munich, Singapore, Arcachon/Cap Ferret, Málaga, Leeds/Harrogate/York, Poole/Weymouth, Miami, Panama City

## Previous Session Changes (2026-03-13)

- Wine count was pushed to 302 with a broader balance across sparkling, white, rosé, and red
- Non-vintage and numbered-edition bottle display is now handled cleanly via [src/utils/wineDisplay.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/utils/wineDisplay.js)
- Wine Detail, Explorer, Home, search, shell pages, and supporting guide pages have been heavily polished for a more editorial feel
- Places now use venue-led imagery rather than retailer or bottle stand-ins
- Places card layout was repaired after a broken image-card treatment:
  - blue under-image banner removed
  - image labels returned to the image itself
  - cards realigned as full-height columns
  - local official image assets added for `Jöro`, `Fallow`, and `Scott's Mayfair`
  - text-led fallback copy added for the four remaining no-photo Valencia venues
- Venue wine-list coverage has expanded to 13 sourced lists
- [src/data/wines.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/data/wines.js) now normalizes legacy source issues at export time, including:
  - string vintages -> numeric or `null`
  - non-breaking hyphens in `region` / `subcategory` -> ASCII hyphens
  - non-numeric `vintageGuide` years -> filtered from the exported guide data

## Deployment and Persistence

- Railway runs `npm start`, which starts `server.mjs`
- The Express server serves `dist/` and exposes the cellar sync APIs
- If `DATABASE_URL` is present, item sync uses PostgreSQL; otherwise it falls back to the volume/file-backed JSON store
- Production Railway environment is configured with:
  - `CELLAR_SYNC_STORE_PATH=/app/data/cellar-sync-store.json`
  - `RAILWAY_VOLUME_MOUNT_PATH=/app/data`

Result:
- automatic cellar sync is centralized and durable when Railway Postgres is attached
- file-backed persistence still works when only the Railway volume is configured

## Current Risks

1. Sync is intentionally untouched in the current polish phase.
   It has been left alone on purpose because it was working. Any sync work should be treated as a separate, cautious project.

2. The shared wine dataset is still large.
   The app remains performant enough to build and ship, but the shared `index` chunk is still the main weight hotspot.

3. Some Places venues still lack honest official room photography.
   `Forastera`, `Taberna La Samorra`, `Flama`, and `Rausell` are intentionally text-led because the currently exposed official assets are food, slogan, menu, or promo graphics rather than real venue shots.

## Suggested Next Improvements

- Keep enriching [src/data/wines.js](/Volumes/WD%208TB/AI%20Projects/The%20Wine%20Guide/src/data/wines.js) with deeper house, vineyard, and historical storytelling now that the Wine Detail layout can carry it
- Continue Places sourcing with real menus and official venue photography only
- Add more curated bottle or estate imagery for wines that still have no source image at all
- Consider a future performance pass on the shared wine-data chunk if load weight becomes user-visible
