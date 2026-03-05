# The Wine Guide — CLAUDE.md

Project memory for Claude Code sessions. Keep this updated as the project evolves.

---

## Project Overview

A React SPA wine reference and personal cellar tracker aimed at UK consumers. Covers 156 wines sourced from UK supermarkets (Tesco, Sainsbury's, Waitrose, Asda, M&S, Aldi, Lidl, Morrisons), specialist retailers (Majestic, Co-op) and Sheffield specialist Le Bon Vin, with full tasting profiles, food pairings, and vintage guides.

**Stack:** React 18 · React Router 6 (HashRouter) · Vite 5 · Tailwind CSS v3 · localStorage for cellar persistence · No backend

---

## Commands

```bash
npm run dev       # dev server on :5173
npm run build     # production build → dist/
npm run preview   # serve dist/ on :3000 (same as Railway)
npm start         # alias for preview with $PORT support
```

Build is clean — only a chunk size warning (expected: wine data is large). Zero errors, zero unused-variable errors.

---

## File Structure

```
src/
  App.jsx                   # Routes: / /explore /explore/:id /sparkling /pairing /cellar /learn
  main.jsx                  # Entry, BrowserRouter wrapper uses HashRouter internally
  index.css                 # Tailwind directives + custom utilities

  data/
    wines.js                # All wine entries (156 wines) + REGIONS array

  hooks/
    useCellar.js            # localStorage cellar state: bottles / wishlist / tasted

  components/
    WineCard.jsx            # Card with compact mode, showPrice prop, quick ♡ wishlist button
    TasteProfile.jsx        # SVG radar/spider chart for taste profile
    Nav.jsx                 # Top navigation bar

  pages/
    Home.jsx                # Landing page with featured wines
    Explorer.jsx            # Browse/filter/sort 144 wines
    WineDetail.jsx          # Full detail: tabs (overview/tasting/pairings/vintages/buy), add to cellar modal
    Cellar.jsx              # Personal cellar tracker (bottles/wishlist/tasting notes)
    Education.jsx           # Wine School: production, labels, vintages, tasting vocab
    Sparkling.jsx           # Sparkling wine guide
    Pairing.jsx             # Food pairing wizard
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

Reference script at `/tmp/generate_wines2.py` — Python script that encodes raw wine data as dicts and generates full JS object strings using template functions per grape/region. Output goes to `/tmp/wines_additions2.js`.

**Injection pattern:**
```python
# Find last ] in wines array, insert before it
# Use re.sub() to replace REGIONS array
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

- **Chunk size warning** — `dist/assets/index-*.js` ~757 kB (gzip: ~207 kB). Due to wine data size. Not a blocker but worth code-splitting the `wines.js` data in future if database grows past ~300 wines.
- **No `.gitignore`** — should add one before pushing to GitHub to exclude `node_modules/`, `dist/`, `.DS_Store`, the PDF reference files.
- **localStorage only** — cellar data is browser-local, not synced across devices. Fine for v1 but noted for future backend consideration.
- **whereToBuy retailer names** — must be exactly consistent across wines for the Explorer retailer filter to work correctly (case-sensitive string match). The 11 retailers are: `Tesco`, `Sainsbury's`, `Waitrose`, `Asda`, `M&S`, `Aldi`, `Lidl`, `Morrisons`, `Majestic`, `Co-op`, `Le Bon Vin`.

---

## Pages Reference

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | Featured wines, hero |
| `/explore` | Explorer | Filter/sort 156 wines |
| `/explore/:id` | WineDetail | Full wine page, 5 tabs, cellar modal |
| `/sparkling` | Sparkling | Sparkling wine guide |
| `/pairing` | Pairing | Food pairing wizard |
| `/cellar` | Cellar | Personal tracker (localStorage) |
| `/learn` | Education | Wine school content |

---

## Reference PDFs (project root, not in repo)

- `UK Supermarket Wine Database Creation.pdf` — 2025–2026 audit of ~180 wines across UK supermarkets with prices, awards, vintages. Used to bulk-generate the 72 new supermarket wines.
- `The Wine Bible.pdf`, `The Wine Encyclopedia.pdf`, `Wine A Tasting Course.pdf`, `The Instant Sommelier.pdf` — reference library for tasting notes, regional info, grape variety descriptions.
