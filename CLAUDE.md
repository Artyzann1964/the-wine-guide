# The Wine Guide — CLAUDE.md

Project memory for Claude Code sessions. Keep this updated as the project evolves.

---

## Project Overview

A React SPA wine reference and personal cellar tracker aimed at UK consumers. Covers 232 wines sourced from UK supermarkets (Tesco, Sainsbury's, Waitrose, Asda, M&S, Aldi, Lidl, Morrisons), specialist retailers (Majestic, Co-op) and Sheffield specialist Le Bon Vin, with full tasting profiles, food pairings, and vintage guides.

**Stack:** React 18 · React Router 6 (HashRouter) · Vite 5 · Tailwind CSS v3 · localStorage for cellar persistence · No backend

---

## Commands

```bash
npm run dev       # dev server on :5173
npm run build     # production build → dist/
npm run preview   # serve dist/ on :3000 (same as Railway)
npm start         # alias for preview with $PORT support
```

Build is clean — zero errors, zero warnings. Code-split via `React.lazy()` — wine data lands in its own chunk, pages are separate chunks.

---

## File Structure

```
src/
  App.jsx                   # Routes + React.lazy() page imports + Suspense wrapper
  main.jsx                  # Entry, BrowserRouter wrapper uses HashRouter internally
  index.css                 # Tailwind directives + custom utilities

  data/
    wines.js                # All wine entries (232 wines) + REGIONS array

  hooks/
    useCellar.js            # localStorage cellar state: bottles / wishlist / tasted

  components/
    WineCard.jsx            # Card with compact mode, showPrice prop, pairing chips, quick ♡ wishlist button
    TasteProfile.jsx        # SVG radar/spider chart for taste profile
    Nav.jsx                 # Top navigation bar

  pages/
    Home.jsx                # Landing page with featured wines
    Explorer.jsx            # Browse/filter/sort 232 wines
    WineDetail.jsx          # Full detail: tabs (overview/tasting/pairings/vintages/buy), add to cellar modal
    Cellar.jsx              # Personal cellar tracker (bottles/wishlist/tasting notes)
    Education.jsx           # Wine School: production, labels, vintages, tasting vocab
    Sparkling.jsx           # Sparkling wine guide
    Pairing.jsx             # Food pairing wizard
    Critics.jsx             # Critics page — Tom Gilby picks + staff picks
```

---

## Wine Data Schema (`src/data/wines.js`)

Each entry in the `wines` array:

```js
{
  id: 'kebab-case-unique-id',        // used in URL: /explore/:id
  name: `Wine Name`,
  producer: `Producer Name`,
  vintage: 2022,                     // number, or 'NV' string
  category: 'red',                   // 'red' | 'white' | 'sparkling' | 'rosé' | 'dessert'
  subcategory: `Barolo DOCG`,        // optional, more specific
  region: `Piedmont`,
  subregion: `Langhe`,               // optional
  country: `Italy`,
  grapes: [`Nebbiolo`],              // array of strings
  grapeNotes: `...`,                 // prose about the grape variety
  style: [`full-bodied`, `tannic`],  // array of style descriptors
  priceRange: 'premium',             // 'budget' | 'mid' | 'premium' | 'luxury'
  price: `£45.00`,                   // display string, used for actual price sort
  rating: 94,                        // numeric 0–100
  tasteProfile: {
    sweetness: 1, acidity: 4, tannin: 5, body: 5, fruitiness: 3,  // 1–5
  },
  cardColor: `#6B1F3A`,
  cardGradient: `linear-gradient(135deg, #6B1F3A, #8B2050)`,
  tastingNotes: {
    colour: `...`,
    nose: `...`,
    palate: `...`,
    finish: `...`,
  },
  background: `...`,                 // producer/wine background prose
  terroir: `...`,                    // terroir description
  servingTemp: `16–18°C`,
  decant: `2 hours`,                 // or null
  glassware: `Bordeaux glass`,
  processType: `oak aged`,
  pairings: [
    { dish: `Beef Wellington`, cuisine: `British`, reason: `...` },
  ],
  vintageGuide: [
    { year: 2021, rating: 'great', notes: `...` },  // 'exceptional'|'great'|'good'|'average'
  ],
  whereToBuy: [
    { name: `Tesco`, type: `supermarket`, note: `...` },
    { name: `Wine Society`, type: `specialist`, note: `...` },
  ],
  tags: [`award winner`, `organic`],
  drinkFrom: 2025,                   // optional year number — used for drinking window in Cellar
  drinkBy: 2035,                     // optional year number
  // Tom Gilby critic fields (optional — only on wines rated by Tom Gilby)
  gilbyRating: 'class',              // 'class' | 'arse'
  gilbyNote: `...`,                  // one-line summary of Gilby's verdict
  gilbyVideoUrl: `https://...`,      // optional YouTube link to his review
}
```

**`REGIONS` array** at the bottom of `wines.js` — keep in sync when adding new regions.

All prose strings use backtick template literals, not single/double quotes.

---

## Key Patterns & Conventions

### Routing
Uses `HashRouter` — all routes are `/#/path`. Wine detail URLs: `/#/explore/:id`. The `id` field in wines.js IS the route param, so it must be kebab-case and URL-safe.

### Tailwind Custom Palette (tailwind.config.js)
```
slate      = #2C3A47   (primary dark)
slate-lt   = #6B7C8D   (muted text)
gold       = #D4AF37   (primary accent)
cream      = #F0EAD6   (light bg / borders)
ivory      = #FAFAF7   (page bg)
terracotta = #C4622D   (CTA / warning)
sage       = #5C7A5C   (success / "in cellar")
```
Custom utilities defined in `index.css`: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.tag`, `.section-label`, `.wine-dot`, `.animate-fade-in`, `.animate-scale-in`.

### useCellar Hook
Returns: `{ cellar, bottles, wishlist, tasted, stats, addBottle, removeBottle, updateBottle, markTasted, addToWishlist, removeFromWishlist, isInCellar, isInWishlist }`

Note: `bottles`, `wishlist`, `tasted` are returned **directly** (not just nested in `cellar`) — this is intentional, both forms are available.

`stats` object: `{ totalBottles, totalWines, wishlistCount, tastedCount, byCategory{} }`

### WineCard Props
`wine` (required), `compact` (bool, default false), `showPrice` (bool — shows actual price string instead of £/££/£££ tier)

Card body layout (standard mode): category badge → status badges → wine name (`line-clamp-2`) → producer (`truncate`) → region/vintage row → grape chips (cream, up to 2) → pairing chips (sage-green `bg-sage/10 border-sage/20 text-sage`, up to 2) → Our Take quote → footer (rating / price tier / wishlist button). Handles both `{dish}` pairing objects and raw string pairings.

### Explorer Filters
All filters synced to URL search params (except `sort` and `search` which are local state). URL params: `category`, `country`, `price`, `retailer`, `grape`.

### Retailer Branding (`src/utils/retailerBrands.jsx`)
Exports `RETAILER_BRANDS` (bg/text/border colour config) and `RetailerBadge` component. Covers all 11 retailers: Tesco, Sainsbury's, Waitrose, Asda, M&S, Aldi, Lidl, Morrisons, Le Bon Vin, Majestic, Co-op. Import and use `<RetailerBadge name="Waitrose" />` wherever a styled retailer pill is needed.

### Schema Normalizer (`src/data/wines.js`)
The wines array is exported via `normalizeWine()` — the internal array is `const _wines = [...]`, the public export is `export const wines = _wines.map(normalizeWine)`. The normalizer reconciles two schemas (original hand-crafted wines vs bulk-generated wines):
- `category` → always lowercase
- `priceRange` → `'£'/'££'/'£££'` symbol strings → `'budget'/'mid'/'premium'` named tiers
- `price` → number → `'£X.XX'` display string
- `pairings` → string[] → `[{dish, cuisine, reason}][]`
- `vintageGuide` → string[] → `[{year, rating, notes}][]`
- `whereToBuy` → `{store}` shape → `{name, type, note}` shape

**Never write new wines using the old bulk schema** — always use the correct schema (lowercase category, named priceRange, £string price, object arrays).

### Cellar Drinking Window
`drinkWindowStatus(bottle)` in `Cellar.jsx` — parses `drinkFrom`/`drinkBy` as year integers, returns `{ status, icon, label, cls }` or `null`.

---

## Bulk Wine Generation

**Latest script:** `/tmp/generate_supermarket80.py` — reads `top_wines_dataset_updated3.csv`, skips Le Bon Vin rows (no price/year/rating) and already-imported Gilby rows, infers category/priceRange/tasteProfile/style from grape + region + notes, deduplicates against existing IDs and wine names, outputs to `/tmp/supermarket_wines_80.js`. Used to add 76 wines (sprint 6 — total 232).

**Legacy script:** `/tmp/generate_wines2.py` — earlier hand-encoded template approach, output to `/tmp/wines_additions2.js`.

**Key generation gotchas:**
- Use `json.dumps(x, ensure_ascii=False)` — prevents £ being escaped as `\u00a3`
- Category inference must check `row['Region'].lower()` in addition to name/grapes — e.g. Champagne wines don't always have "champagne" in their name
- Fall back to `row['Stockist']` when `row['Producer']` is empty (some M&S wines)
- CSV from this project starts with a leading newline — use `content.lstrip('\n')` before `csv.DictReader`

**Injection pattern:**
```python
# Find last `},` before the `// Schema normalizer` comment, insert after it
insert_at = content[:marker_idx].rfind('},') + 2
content = content[:insert_at] + insertion + content[insert_at:]
```

Always update `REGIONS` array at the bottom of `wines.js` when adding new countries/regions.

---

## Railway Deployment

**Status: Ready.** Config already in place:

- `railway.toml` — nixpacks builder, `npm install && npm run build`, start with `npm start`
- `package.json` `start` script — `vite preview --host 0.0.0.0 --port ${PORT:-3000}`
- `vite.config.js` — preview host `0.0.0.0`, reads `process.env.PORT`

**Deploy steps:**
1. Push to GitHub (or connect repo in Railway dashboard)
2. Railway auto-detects `railway.toml`, runs nixpacks build
3. No environment variables required — fully static SPA, cellar data in browser localStorage
4. HashRouter means no server-side routing config needed

**Known Railway gotcha:** `vite preview` serves the pre-built `dist/` directory. If you change source files, you must rebuild — Railway does this automatically on each deploy.

---

## Known Issues / Watch-outs

- **Chunk sizes (post code-split)** — `vendor.js` 163 kB/53 kB gzip · `wines.js` 477 kB/100 kB gzip · pages 8–60 kB each. Zero warnings. If the DB grows past ~400 wines, consider lazy-loading wine data by category.
- **localStorage only** — cellar data is browser-local, not synced across devices. Fine for v1 but noted for future backend consideration.
- **whereToBuy retailer names** — must be exactly consistent across wines for the Explorer retailer filter to work correctly (case-sensitive string match). The 11 retailers are: `Tesco`, `Sainsbury's`, `Waitrose`, `Asda`, `M&S`, `Aldi`, `Lidl`, `Morrisons`, `Majestic`, `Co-op`, `Le Bon Vin`.

---

## Pages Reference

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | Featured wines, hero |
| `/explore` | Explorer | Filter/sort 232 wines |
| `/explore/:id` | WineDetail | Full wine page, 5 tabs, cellar modal |
| `/sparkling` | Sparkling | Sparkling wine guide |
| `/pairing` | Pairing | Food pairing wizard |
| `/cellar` | Cellar | Personal tracker (localStorage) |
| `/learn` | Education | Wine school content |
| `/shop` | Shop | Buy wines — retailer links |
| `/critics` | Critics | Tom Gilby verdicts + staff picks |

---

## Code Splitting

`App.jsx` imports all pages via `React.lazy()` wrapped in a single `<Suspense fallback={<PageLoader />}>`. Rollup automatically places the shared `wines.js` data in its own chunk.

`vite.config.js` build config:
```js
build: {
  chunkSizeWarningLimit: 800,   // wines chunk is large by design
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],  // long-lived cache
      },
    },
  },
},
```

`PageLoader` fallback: `<div className="min-h-screen bg-ivory pt-16" aria-hidden="true" />` — matches nav height, prevents layout shift.

---

## Reference PDFs (project root, not in repo)

- `UK Supermarket Wine Database Creation.pdf` — 2025–2026 audit of ~180 wines across UK supermarkets with prices, awards, vintages. Used to bulk-generate the 72 new supermarket wines.
- `The Wine Bible.pdf`, `The Wine Encyclopedia.pdf`, `Wine A Tasting Course.pdf`, `The Instant Sommelier.pdf` — reference library for tasting notes, regional info, grape variety descriptions.
