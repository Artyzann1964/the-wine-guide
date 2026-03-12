# The Wine Guide - Project Status

Last updated: 2026-03-12
Build status: `npm run build` passes cleanly
Deployment: live on Railway, auto-deploying from `main`

## Current Snapshot

- App architecture: React 18 + Vite SPA behind an Express server (`server.mjs`)
- Routing: `HashRouter`
- Wine data: 267 wines
- Geography coverage: 21 countries, 97 region strings
- Categories:
  - Red: 106
  - White: 93
  - Sparkling: 39
  - Rosé: 19
  - Dessert/Fortified: 10
- Wine labels: 8 wines have `labelImage` (Dom Pérignon, Bollinger, Château Margaux, Penfolds Grange, Opus One, Vega Sicilia Único, Château Rayas, Château d'Yquem); displayed as subtle overlay on WineCard and standalone on WineDetail
- Places guide: 14 venues across Sheffield, Stannington, Walton-on-Thames, Stroud, and Morpeth
- Venue wine lists: 8 sourced venue lists in `src/data/venueWineLists.js`
- Cellar architecture: `Cellar.jsx` is a ~200-line orchestrator; all sub-components live in `src/components/cellar/`
- Cellar features: local persistence, wishlist sharing, manual sync code/link import, automatic cloud sync, star ratings on bottles, "would buy again" rating on tasting notes, review table for tasted wines
- Cellar data model: normalized internal `items` list with derived `bottles`, `wishlist`, and `tasted` views
- Cellar item fields: `rating` (1-5 quality stars), `wouldBuyAgain` (1-5 repurchase stars) — both nullable, sync-safe
- Automatic sync transport: item-level sync via `/api/cellar-items/:syncId`
- Sync authentication: per-device session bootstrap via `/api/cellar-sync-session/:syncId`, gated by a shared sync passphrase
- Sync ownership: new sync spaces now record an owner email and issue a recovery key for passphrase rotation and session revocation
- Linked device management: owner sessions can list and revoke device tokens from the Cellar UI
- Removal sync: bottle and wishlist removals now propagate as tombstones instead of local-only deletes
- Vivino import: CSV import is available in the Cellar UI; legacy console import script still exists at `public/vivino_import.js`

## Retailer Coverage

| Retailer | whereToBuy mentions |
|----------|---------------------|
| Waitrose | 25 |
| Sainsbury's | 21 |
| Tesco | 20 |
| Lidl | 11 |
| Morrisons | 10 |
| Aldi | 9 |
| Le Bon Vin | 8 |
| M&S | 5 |
| Co-op | 4 |
| Asda | 4 |
| Majestic | 4 |

Notes:
- The shop/branding layer supports `Tesco`, `Sainsbury's`, `Waitrose`, `Asda`, `M&S`, `Aldi`, `Lidl`, `Morrisons`, `Le Bon Vin`, `Majestic`, and `Co-op`.
- The data set also includes unbranded specialist merchants on some fine-wine entries.

## Routes

| Route | Page | Current status |
|-------|------|----------------|
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

## Deployment and Persistence

- Railway runs `npm start`, which starts `server.mjs`
- The Express server serves `dist/` and exposes `/api/cellar-sync/:syncId`, `/api/cellar-sync-session/:syncId`, `/api/cellar-sync-owner/:syncId/session`, `/api/cellar-sync-owner/:syncId/devices`, `/api/cellar-sync-owner/:syncId/rotate-passphrase`, and `/api/cellar-items/:syncId`
- If `DATABASE_URL` is present, item sync uses PostgreSQL; otherwise it falls back to the volume/file-backed JSON store
- Production Railway environment is configured with:
  - `CELLAR_SYNC_STORE_PATH=/app/data/cellar-sync-store.json`
  - `RAILWAY_VOLUME_MOUNT_PATH=/app/data`
- Result: automatic cellar sync is centralized and durable when Railway Postgres is attached, and still volume-backed when running on file storage

## Latest Build Output

Verified on 2026-03-12:

| Chunk | Size | Gzip |
|-------|------|------|
| `wines` | 537.52 kB | 113.20 kB |
| `Education` | 100.69 kB | 30.46 kB |
| `Sheffield` | 88.94 kB | 24.56 kB |
| `Cellar` | 59.22 kB | 13.37 kB |
| `vendor` | 162.98 kB | 53.24 kB |

## Open Review Findings

1. Sync still lacks full account auth:
   owner email, recovery key rotation, and linked-device revocation now exist, but there is still no email/login-based sign-in, verified email delivery, or hosted recovery channel.
2. Wine label images cover 8 iconic wines sourced from Wikimedia Commons. More wines could benefit from labels if suitable CC-licensed images are found.

## Suggested Next Improvements

- Add email or magic-link sign-in on top of the current owner-email, passphrase, and recovery-key sync path
- Add more `labelImage` entries to iconic wines (Bollinger, Veuve Clicquot, Krug, etc.)
- Add cellar search on the Bottles tab
- Consider producer pages and wine comparison
