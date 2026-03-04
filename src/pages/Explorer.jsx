import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'

const CATEGORIES = [
  { id: 'all',       label: 'All Wines' },
  { id: 'sparkling', label: 'Sparkling' },
  { id: 'white',     label: 'White' },
  { id: 'red',       label: 'Red' },
  { id: 'rosé',      label: 'Rosé' },
  { id: 'dessert',   label: 'Dessert & Fortified' },
]

const PRICE_RANGES = [
  { id: 'all',     label: 'Any Price' },
  { id: 'budget',  label: '£ Budget' },
  { id: 'mid',     label: '££ Mid-range' },
  { id: 'premium', label: '£££ Premium' },
  { id: 'luxury',  label: '££££ Luxury' },
]

const SORT_OPTIONS = [
  { id: 'rating',     label: 'Highest Rated' },
  { id: 'value',      label: 'Best Value' },
  { id: 'price_asc',  label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'name',       label: 'A – Z' },
  { id: 'country',    label: 'By Country' },
  { id: 'vintage',    label: 'By Vintage' },
]

const RETAILER_ICONS = {
  'Tesco': '🔵', 'Sainsbury\'s': '🟠', 'Waitrose': '🟢',
  'Asda': '🟡', 'M&S': '🟤', 'Aldi': '🔴', 'Lidl': '🟣',
  'Morrisons': '🟡', 'Le Bon Vin': '🍷',
}

// Extract numeric price from strings like "£8.07", "from £7.99", "£120 per bottle"
function parsePrice(priceStr) {
  if (!priceStr) return 0
  const match = String(priceStr).match(/£(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : 0
}

const TOP_GRAPES_VISIBLE = 10

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch]           = useState('')
  const [sort, setSort]               = useState('rating')
  const [showAllGrapes, setShowAllGrapes] = useState(false)

  // All filters synced to URL params
  const categoryFilter = searchParams.get('category') || 'all'
  const countryFilter  = searchParams.get('country')  || 'all'
  const priceFilter    = searchParams.get('price')    || 'all'
  const retailerFilter = searchParams.get('retailer') || 'all'
  const grapeFilter    = searchParams.get('grape')    || 'all'

  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value === 'all') next.delete(key)
      else next.set(key, value)
      return next
    })
  }

  // Unique countries
  const countries = useMemo(() => {
    const c = [...new Set(wines.map(w => w.country))].sort()
    return [{ id: 'all', label: 'All Countries' }, ...c.map(c => ({ id: c, label: c }))]
  }, [])

  // Unique retailers derived from whereToBuy — supermarkets first
  const retailers = useMemo(() => {
    const seen = new Map()
    wines.forEach(w => {
      w.whereToBuy?.forEach(r => {
        if (r.name && !seen.has(r.name)) seen.set(r.name, r.type || 'other')
      })
    })
    const sorted = [...seen.entries()].sort((a, b) => {
      if (a[1] === 'supermarket' && b[1] !== 'supermarket') return -1
      if (a[1] !== 'supermarket' && b[1] === 'supermarket') return 1
      return a[0].localeCompare(b[0])
    })
    return [
      { id: 'all', label: 'All Retailers' },
      ...sorted.map(([name]) => ({ id: name, label: `${RETAILER_ICONS[name] ?? '🏪'} ${name}` })),
    ]
  }, [])

  // Unique grapes, sorted by frequency
  const allGrapes = useMemo(() => {
    const counts = {}
    wines.forEach(w => w.grapes?.forEach(g => { counts[g] = (counts[g] || 0) + 1 }))
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return [{ id: 'all', label: 'All Varieties' }, ...sorted.map(([g, n]) => ({ id: g, label: g, count: n }))]
  }, [])

  const visibleGrapes = showAllGrapes ? allGrapes : allGrapes.slice(0, TOP_GRAPES_VISIBLE + 1)
  const hiddenGrapeCount = allGrapes.length - TOP_GRAPES_VISIBLE - 1

  // Filtered & sorted wines
  const filtered = useMemo(() => {
    let result = wines

    if (categoryFilter !== 'all') result = result.filter(w => w.category === categoryFilter)
    if (countryFilter  !== 'all') result = result.filter(w => w.country === countryFilter)
    if (priceFilter    !== 'all') result = result.filter(w => w.priceRange === priceFilter)
    if (retailerFilter !== 'all') result = result.filter(w =>
      w.whereToBuy?.some(r => r.name === retailerFilter)
    )
    if (grapeFilter !== 'all') result = result.filter(w =>
      w.grapes?.includes(grapeFilter)
    )

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.producer.toLowerCase().includes(q) ||
        w.region.toLowerCase().includes(q) ||
        w.country.toLowerCase().includes(q) ||
        w.grapes.some(g => g.toLowerCase().includes(q))
      )
    }

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'rating':     return b.rating - a.rating
        case 'value': {
          const ap = parsePrice(a.price), bp = parsePrice(b.price)
          const av = ap > 0 ? a.rating / ap : 0
          const bv = bp > 0 ? b.rating / bp : 0
          return bv - av
        }
        case 'price_asc':  return parsePrice(a.price) - parsePrice(b.price)
        case 'price_desc': return parsePrice(b.price) - parsePrice(a.price)
        case 'name':       return a.name.localeCompare(b.name)
        case 'country':    return a.country.localeCompare(b.country) || a.name.localeCompare(b.name)
        case 'vintage': {
          const av = typeof a.vintage === 'number' ? a.vintage : 0
          const bv = typeof b.vintage === 'number' ? b.vintage : 0
          return bv - av
        }
        default: return 0
      }
    })
  }, [categoryFilter, countryFilter, priceFilter, retailerFilter, grapeFilter, search, sort])

  const hasFilters = categoryFilter !== 'all' || countryFilter !== 'all' ||
    priceFilter !== 'all' || retailerFilter !== 'all' || grapeFilter !== 'all' || search

  // Active filter chips for the results bar
  const activeChips = [
    categoryFilter !== 'all' && { key: 'category', label: categoryFilter },
    retailerFilter !== 'all' && { key: 'retailer', label: retailers.find(r => r.id === retailerFilter)?.label ?? retailerFilter },
    grapeFilter    !== 'all' && { key: 'grape',    label: grapeFilter },
    countryFilter  !== 'all' && { key: 'country',  label: countryFilter },
    priceFilter    !== 'all' && { key: 'price',    label: PRICE_RANGES.find(p => p.id === priceFilter)?.label ?? priceFilter },
  ].filter(Boolean)

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <p className="section-label mb-2">The collection</p>
          <h1 className="font-display text-5xl text-slate mb-4">Explore Wines</h1>
          <p className="font-body text-slate-lt max-w-xl">
            {wines.length} wines across {[...new Set(wines.map(w => w.country))].length} countries — filter by retailer, grape, style or price.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── SIDEBAR FILTERS ───────────────── */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* Search */}
            <div className="mb-6">
              <label className="section-label block mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Wine, grape, region..."
                  className="w-full font-body text-sm px-4 py-2.5 pl-9 rounded-xl border border-cream bg-white
                             focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-lt" fill="none" viewBox="0 0 20 20">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Category */}
            <FilterGroup
              label="Category"
              options={CATEGORIES}
              value={categoryFilter}
              onChange={v => setFilter('category', v)}
            />

            {/* Shop At (Retailer) */}
            <FilterGroup
              label="Shop At"
              options={retailers}
              value={retailerFilter}
              onChange={v => setFilter('retailer', v)}
            />

            {/* Grape Variety */}
            <div className="mb-6">
              <p className="section-label mb-2">Grape Variety</p>
              <div className="flex flex-col gap-1">
                {visibleGrapes.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFilter('grape', opt.id)}
                    className={`text-left font-body text-sm px-3 py-2 rounded-lg transition-colors ${
                      grapeFilter === opt.id
                        ? 'bg-gold/15 text-gold font-medium'
                        : 'text-slate-lt hover:bg-cream hover:text-slate'
                    }`}
                  >
                    {opt.label}
                    {opt.count && (
                      <span className="ml-1.5 text-[10px] opacity-50">({opt.count})</span>
                    )}
                  </button>
                ))}
                {hiddenGrapeCount > 0 && (
                  <button
                    onClick={() => setShowAllGrapes(s => !s)}
                    className="text-left font-body text-xs text-gold/70 hover:text-gold px-3 py-1.5 transition-colors"
                  >
                    {showAllGrapes ? '↑ Show fewer' : `+ ${hiddenGrapeCount} more varieties`}
                  </button>
                )}
              </div>
            </div>

            {/* Country */}
            <FilterGroup
              label="Country"
              options={countries}
              value={countryFilter}
              onChange={v => setFilter('country', v)}
            />

            {/* Price */}
            <FilterGroup
              label="Price"
              options={PRICE_RANGES}
              value={priceFilter}
              onChange={v => setFilter('price', v)}
            />

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={() => { setSearchParams({}); setSearch('') }}
                className="font-body text-xs text-terracotta hover:text-[#A8501F] transition-colors"
              >
                ✕ Clear all filters
              </button>
            )}
          </aside>

          {/* ── RESULTS GRID ──────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort + results bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-body text-sm text-slate-lt">
                  <strong className="text-slate">{filtered.length}</strong> wine{filtered.length !== 1 ? 's' : ''}
                </p>
                {activeChips.map(chip => (
                  <button
                    key={chip.key}
                    onClick={() => setFilter(chip.key, 'all')}
                    className="tag bg-gold/10 border border-gold/30 text-gold text-[10px] hover:bg-gold/20 transition-colors cursor-pointer"
                  >
                    {chip.label} ✕
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="font-body text-xs text-slate-lt">Sort:</label>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="font-body text-sm px-3 py-1.5 rounded-lg border border-cream bg-white focus:outline-none focus:border-gold"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Best Value explanation */}
            {sort === 'value' && (
              <div className="mb-5 px-4 py-3 bg-gold/5 border border-gold/20 rounded-xl">
                <p className="font-body text-xs text-slate-lt">
                  <span className="text-gold font-medium">Best Value</span> ranks wines by rating-per-pound — the highest score for the lowest price.
                </p>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-slate-lt mb-3">No wines found</p>
                <p className="font-body text-sm text-slate-lt">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(wine => (
                  <WineCard key={wine.id} wine={wine} showPrice={sort === 'price_asc' || sort === 'price_desc' || sort === 'value'} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="mb-6">
      <p className="section-label mb-2">{label}</p>
      <div className="flex flex-col gap-1">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`text-left font-body text-sm px-3 py-2 rounded-lg transition-colors ${
              value === opt.id
                ? 'bg-gold/15 text-gold font-medium'
                : 'text-slate-lt hover:bg-cream hover:text-slate'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
