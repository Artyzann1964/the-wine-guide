# The Wine Guide — Project Status

**Last updated:** 2026-03-06
**Build status:** ✅ Clean (zero errors, expected chunk size warning)
**Deployment:** 🚀 Live on Railway — auto-deploys on every push to `main`

---

## Current State

### Wine Database
- **232 wines** sourced from UK supermarkets + Le Bon Vin Sheffield
- **~37 countries/regions** represented
- Price range: £4.99 (Aldi) → £120 (Giacomo Conterno Barolo)
- Ratings: 82–98 pts
- **41 Vivino tasted wines** importable via `/public/vivino_import.js` console script

### Retailers Covered
| Retailer | Wines in Guide | Logo |
|----------|---------------|------|
| Tesco | ~18 | ✅ |
| Sainsbury's | ~10 | ✅ |
| Waitrose | ~12 | ✅ |
| Asda | 8 | ✅ |
| M&S | 9 | ✅ |
| Aldi | 7 | ✅ |
| Lidl | 6 | ✅ |
| Morrisons | 6 | ✅ |
| Le Bon Vin Sheffield | 8 | ✅ |
| Majestic | — | ✅ |
| Co-op | — | ✅ |

### All Pages
| Route | Page | Status | Notes |
|-------|------|--------|-------|
| `/` | Home | ✅ | Featured wines, hero, Amanda bio |
| `/explore` | Explorer | ✅ | Colour legend, all filters, sort options |
| `/explore/:id` | Wine Detail | ✅ | 5 tabs, cellar modal, retailer logos in Buy tab |
| `/sparkling` | Sparkling Guide | ✅ | Full sparkling guide page |
| `/pairing` | Pairing Wizard | ✅ | Food → wine matcher |
| `/taste-quiz` | Taste Profiler | ✅ | 4-question quiz → matched wines |
| `/critics` | Critics | ✅ | Real critic photos, reviews |
| `/shop` | Know Your Shop | ✅ | Retailer profiles + logos, wines by store |
| `/cellar` | My Cellar | ✅ | Bottles/wishlist/tasted, drinking windows, cellar value, wishlist share |
| `/places` | Amanda's Places | ✅ | 13 venue picks (Sheffield, Stannington, Walton-on-Thames, Stroud, Morpeth), venue wine lists |
| `/wishlist-share` | Wishlist Share | ✅ | Shareable wishlist view from base64url link |
| `/learn` | Wine School | ✅ | 8 sections incl. Sparkling Wines, Grape Varieties, glass guide image |

---

## Recent Session Work (2026-03-06)

### 🏠 Amanda's Places Page (`/places`)
- 13 venue picks across Sheffield, Stannington, Walton-on-Thames, Stroud, Morpeth
- Venue wine lists from sourced PDFs/websites (2,300-line data file `venueWineLists.js`)
- Wine lists sourced for 7 of 13 venues
- Venue Source Inbox — submit new venue URLs for future wine list sourcing
- Nav bar updated with "Places" link (desktop + mobile dock)

### 🏘️ Venue Corrections (latest)
- Split `swan-and-anchor` into two separate Walton-on-Thames pubs: **The Swan** (Young's riverside, swanwalton.com) and **The Anglers** (restaurant pub)
- Added **The Crown & Glove** (Stannington, crownandglove.com) with 16-wine list scraped from website
- Added Peacock Inn website URL (peacock-stannington.co.uk)
- Removed Explorer Queue feature entirely (was not requested, added by mistake in earlier session)
- Deleted dead `useExplorerQueue.js` hook file

### 🎁 Wishlist Share (`/wishlist-share`)
- Base64url-encoded shareable wishlist links generated from Cellar page
- Groups wines by price tier (everyday / mid / premium / luxury)
- Resolves shared wine IDs against the local database for full detail
- Clean fallback UI for invalid/empty share links

### 📋 Documentation Sync
- Fixed wine count: 144 → **232 wines** (STATUS.md was stale after bulk generation sprint)
- Added missing pages to CLAUDE.md + STATUS.md: Places, WishlistShare, TasteProfiler
- Removed all Explorer Queue references from docs

---

## Earlier Session Work (2026-03-05)

### 🥂 Site Logo
- New `src/components/Logo.jsx` — hand-crafted SVG Champagne flute
- Proper flute proportions: narrow bowl widest at rim (12px in 40px viewBox), tapers to 6px at stem join, long thin stem, small refined foot
- Golden champagne fill at ~78%, with 6 independently animated rising bubbles (SVG-native `animateTransform` — no CSS dependency)
- Three variants: `NavLogo` (nav bar), `HeroLogo` (large stacked, ready for home hero), `LogoMark` (icon-only)
- Replaces the previous simple line-art glass in `Nav.jsx`

### 🏪 Real Retailer Logos
- All 11 retailer logos uploaded to `/public` and wired up in `retailerBrands.jsx`
- `RetailerBadge` — now shows logo image in a clean white pill; graceful fallback to coloured lettermark
- `RetailerLogo` — new icon-only component for use in tighter spaces
- **Shop page** — logos in selector card thumbnails (32×32) and large profile header (64×64)
- **WineDetail Buy tab** — logos in where-to-buy cards

### 📚 Learn / Wine School Enrichment
- **Glassware section** — `eWine_Glass_Guide.webp` infographic added at top
- **Sparkling Wines section** (new nav item) — interactive tab comparison: Champagne, Prosecco, Cava, Crémant. Each card has method, grapes, style, price, description, grape detail, what to look for, serving notes, pro tip. Sweetness decoder bar chart (Brut Nature → Doux, 7 levels)
- **Grape Varieties section** (new nav item) — 3 tabs: 6 white grapes, 8 red grapes, 5 classic blends with visual grape-proportion bars

### 🍷 Vivino Import
- 41 tasted wines from Vivino CSV import
- Self-contained console script at `/public/vivino_import.js`
- Deduplicates on `id`, merges into existing tasted list, reloads page
- Chrome requires typing `allow pasting` before pasting in DevTools console

---

## Earlier Session Work (2026-03-04 to 2026-03-05)

### Database Expansion (72 → 144 → 232 wines)
- Bulk Python generation script parsing the UK Supermarket Wine Database Creation PDF
- Added entirely new retailers: Asda (8 wines) and M&S (9 wines)
- Expanded existing: Tesco, Sainsbury's, Waitrose, Aldi, Lidl, Morrisons, Le Bon Vin
- REGIONS array updated with 15+ new regions

### UI & Feature Additions
- **Explorer** — retailer filter, grape filter, sort by Best Value/Price, active filter chips, colour legend by category
- **WineCard** — label-style header redesign with cardColor gradient
- **Cellar** — drinking window alerts (🔵/🟢/🔴), estimated cellar value stat
- **Home** — quick wishlist heart button on cards
- **Know Your Shop page** (`/shop`) — full retailer profile page built from scratch
- **Taste Profiler Quiz** (`/taste-quiz`) — 4-question flow returning personalised matches
- **Critics page** (`/critics`) — real critic photos, reviews
- **Mobile responsiveness** — nav, Explorer filters, Cellar tabs, Home stats all fixed

### Bug Fixes
- Cellar page crash — `useCellar.js` missing top-level `bottles`/`wishlist`/`tasted` exports
- Blank Education/Learn page — hot-reload side effect of the Cellar crash

---

## Backlog

### Completed ✅
- ~~`.gitignore`~~ — in place
- ~~Railway deploy~~ — live and auto-deploying
- ~~Wine taste quiz~~ — `/taste-quiz` live
- ~~Shop by Retailer~~ — `/shop` live
- ~~Retailer logos~~ — all 11 in place

### Medium Priority
- [ ] **Cellar: mark as tasted flow** — `markTasted()` exists in hook, needs UI trigger in BottleCard
- [ ] **Cellar: search within cellar** — search bar on Bottles tab
- [ ] **Home hero** — wire in `HeroLogo` component for the landing page
- [ ] **Wine comparison** — side-by-side of 2–3 wines (taste profiles, price, rating)
- [ ] **Producer pages** — all wines grouped by producer

### Low Priority / Future
- [ ] Code-split `wines.js` (worthwhile when database exceeds ~300 wines)
- [ ] Dark mode toggle
- [ ] Mobile bottom navigation bar
- [ ] Backend + auth for cross-device cellar sync
- [ ] Retailer logo links — make Buy tab logos clickable to retailer websites

---

## Technical Notes

### Railway Deploy
- Auto-deploys on every push to `main` via GitHub integration
- Nixpacks builder: `npm install && npm run build && npm start`
- No environment variables required — fully static SPA
- HashRouter = no server routing config needed
- Build time: ~45s; bundle: ~166 kB gzip (within acceptable range for v1)

### Known Watch-outs
- `whereToBuy` retailer names must match `RETAILER_LOGOS` keys exactly (case-sensitive)
- The 8 canonical supermarket names: `Tesco`, `Sainsbury's`, `Waitrose`, `Asda`, `M&S`, `Aldi`, `Lidl`, `Morrisons`
- Logo filenames with spaces were renamed: `aldi logo.webp` → `aldi-logo.webp`, `Co opLogo.jpg.avif` → `coop-logo.avif`
- Champagne flute SVG bubbles use SVG-native `animateTransform` — no external CSS required, works in all modern browsers

### Bundle Sizes (latest build)
| Chunk | Size | Gzip |
|-------|------|------|
| wines.js (data) | 478 kB | 100 kB |
| Education.jsx | 97 kB | 29 kB |
| vendor (React) | 163 kB | 53 kB |
| All others | ~230 kB | ~70 kB |
| **Total** | **~968 kB** | **~252 kB** |

---

## Reference Files (project root — not committed)

| File | Purpose |
|------|---------|
| `UK Supermarket Wine Database Creation.pdf` | 2025–26 supermarket audit used for bulk wine generation |
| `The Wine Bible.pdf` | Regional/grape reference |
| `The Wine Encyclopedia.pdf` | Regional/grape reference |
| `Wine A Tasting Course.pdf` | Tasting methodology |
| `The Instant Sommelier.pdf` | Serving/pairing reference |
| `eWine_Glass_Guide.webp` | Wine glass guide (also in `/public`) |
| `public/vivino_import.js` | Console script for Vivino tasted wine import |
| `public/vivino_wines_export.csv` | Source CSV from Vivino export (41 wines) |
