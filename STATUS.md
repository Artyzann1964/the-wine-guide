# The Wine Guide — Project Status

**Last updated:** 2026-03-04
**Build status:** ✅ Clean (zero errors, chunk size warning only)
**Deployment:** 🚀 Ready for Railway — deploy tomorrow

---

## Current State

### Database
- **144 wines** across 8 UK supermarkets + Le Bon Vin Sheffield
- **~37 countries/regions** represented
- Price range: £4.99 (Aldi) → £120 (Giacomo Conterno Barolo)
- Ratings: 82–98 pts

### Retailers covered
| Retailer | Wines |
|----------|-------|
| Tesco | ~18 |
| Sainsbury's | ~10 |
| Waitrose | ~12 |
| Asda | 8 (all new this session) |
| M&S | 9 (all new this session) |
| Aldi | 7 |
| Lidl | 6 |
| Morrisons | 6 |
| Le Bon Vin Sheffield | 8 |

### All Pages Working
| Page | Status | Notes |
|------|--------|-------|
| Home | ✅ | Featured wines, hero |
| Explorer | ✅ | Filters + new features this session |
| Wine Detail | ✅ | Full tabs, add to cellar modal, related wines |
| Sparkling Guide | ✅ | |
| Pairing Wizard | ✅ | |
| Cellar | ✅ | Fixed blank screen bug this session |
| Wine School / Learn | ✅ | Fixed blank screen bug this session |

---

## What Was Built This Session (2026-03-04)

### 🗄️ Database Expansion (72 → 144 wines)
- Bulk Python generation script (`/tmp/generate_wines2.py`) parsing the UK Supermarket Wine Database Creation PDF
- Added entirely new retailers: **Asda** (8 wines) and **M&S** (9 wines)
- Expanded existing: Tesco, Sainsbury's, Waitrose, Aldi, Lidl, Morrisons, Le Bon Vin
- REGIONS array in `wines.js` updated with 15+ new regions (Georgia, Romania, Bulgaria, Moldova, Lower Austria, Coonawarra, Napa Valley, etc.)

### 🐛 Bug Fixes
- **Cellar page crash** — `useCellar.js` didn't export `bottles`, `wishlist`, `tasted` at the top level; `Cellar.jsx` destructured them directly → TypeError. Fixed by adding the direct exports to the hook's return object.
- **Education/Learn page blank** — Was a hot-reload side effect of the Cellar crash. Fixed automatically once Cellar was fixed.

### ✨ Explorer Improvements
- **Retailer filter ("Shop At")** — sidebar filter derived from `whereToBuy` data. Supermarkets listed first. "I'm in Tesco, what should I buy?"
- **Grape variety filter** — sorted by frequency, top 10 visible with expand toggle, shows wine count per grape
- **New sort options** — "Best Value" (rating ÷ price), "Price: Low → High", "Price: High → Low"
- **Best Value explanation banner** — brief note appears when this sort is active
- **Active filter chips** — removable pill chips in the results bar for each active filter
- **WineCard shows actual price** when sorting by price/value (instead of £/££/£££ tier symbol)

### 🍾 Cellar Improvements
- **Drinking window alerts** on each bottle card: 🔵 Not ready / 🟢 In window / 🔴 Past peak (uses `drinkFrom`/`drinkBy` year fields)
- **Estimated cellar value** — 5th stat in the hero bar, sums `purchasePrice × quantity`; shows "—" when no prices entered

### ❤️ Quick Wishlist on Cards
- Heart button in WineCard footer — adds to wishlist without navigating to detail page
- `stopPropagation` prevents card link from firing
- Brief "✓ Added" flash in status badge area, settles to gold heart

---

## Railway Deployment — Tomorrow

### What's already in place
- `railway.toml` — nixpacks builder configured
- `package.json` `start` script — `vite preview --host 0.0.0.0 --port ${PORT:-3000}`
- `vite.config.js` — reads `process.env.PORT`, binds to `0.0.0.0`
- No environment variables needed (fully static SPA)
- HashRouter = no server routing config needed

### Steps to deploy
1. **Add `.gitignore`** before first push:
   ```
   node_modules/
   dist/
   .DS_Store
   *.pdf
   ```
2. **Create GitHub repo** and push
3. **Connect to Railway** → New Project → Deploy from GitHub repo
4. Railway auto-detects `railway.toml` and runs nixpacks build
5. Done — Railway will give you a `.railway.app` URL

### Potential gotchas
- `vite preview` serves `dist/` — Railway rebuilds on each push, so always up to date
- First deploy may take 2–3 min (nixpacks + npm install + build)
- The 625 kB JS bundle is fine for a v1 — consider code-splitting `wines.js` if the database grows past ~300 wines

---

## Next Steps / Backlog

### High priority
- [ ] `.gitignore` (before any git push)
- [ ] Railway deploy

### Medium priority (discussed, not yet built)
- [ ] **Wine taste quiz/recommender** — 4-question flow (red/white/sparkling → light/bold → dry/fruity → budget) returns 3–5 matches
- [ ] **"Shop by Retailer" page** (`/shop`) — wines grouped by store with store hero and filter
- [ ] **Cellar: search within cellar** — search bar on the Bottles tab
- [ ] **Cellar: mark as tasted flow** — currently `markTasted()` exists in the hook but there's no UI trigger in `BottleCard` to call it
- [ ] **Wine comparison** — side-by-side of 2–3 wines (taste profiles, price, rating)

### Low priority / future
- [ ] Code-split `wines.js` to reduce initial bundle size
- [ ] Dark mode toggle
- [ ] Mobile bottom navigation bar (better UX on phone)
- [ ] Backend + auth for cross-device cellar sync
- [ ] Producer pages — all wines by a given producer

---

## Reference Files (project root, not committed)

| File | Purpose |
|------|---------|
| `UK Supermarket Wine Database Creation.pdf` | 2025–26 supermarket audit used for bulk generation |
| `The Wine Bible.pdf` | Regional/grape reference |
| `The Wine Encyclopedia.pdf` | Regional/grape reference |
| `Wine A Tasting Course.pdf` | Tasting methodology |
| `The Instant Sommelier.pdf` | Serving/pairing reference |
