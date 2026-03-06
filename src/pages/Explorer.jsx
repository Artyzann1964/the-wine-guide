import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'
import { RetailerLogo } from '../utils/retailerBrands'

const CATEGORIES = [
  { id: 'all', label: 'All Wines' },
  { id: 'sparkling', label: 'Sparkling' },
  { id: 'white', label: 'White' },
  { id: 'red', label: 'Red' },
  { id: 'rosé', label: 'Rosé' },
  { id: 'dessert', label: 'Dessert & Fortified' },
]

const PRICE_RANGES = [
  { id: 'all', label: 'Any Price' },
  { id: 'budget', label: '£ Budget' },
  { id: 'mid', label: '££ Mid-range' },
  { id: 'premium', label: '£££ Premium' },
  { id: 'luxury', label: '££££ Luxury' },
]

const SORT_OPTIONS = [
  { id: 'rating', label: 'Highest Rated' },
  { id: 'value', label: 'Best Value' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'name', label: 'A - Z' },
  { id: 'country', label: 'By Country' },
  { id: 'vintage', label: 'By Vintage' },
]

const CATEGORY_LEGEND = [
  { id: 'red', label: 'Red', start: '#4A1020', end: '#7A2238' },
  { id: 'white', label: 'White', start: '#1E3A2A', end: '#3A6050' },
  { id: 'sparkling', label: 'Sparkling', start: '#2C2208', end: '#6B5518' },
  { id: 'rosé', label: 'Rosé', start: '#4A1525', end: '#8B3548' },
  { id: 'dessert', label: 'Dessert', start: '#3A1E05', end: '#7A4518' },
]

const FRANCE_REGION_FILTERS = [
  'Champagne',
  'Bordeaux',
  'Burgundy & Beaujolais',
  'Rhone Valley',
  'Loire Valley',
  'Provence',
  'Alsace',
]

const GLOBAL_REGION_FILTERS = [
  'Rioja',
  'Tuscany',
  'Piedmont',
  'Veneto',
  'Douro Valley',
  'Marlborough',
]

const TOP_GRAPES_VISIBLE = 10

function parsePrice(priceStr) {
  if (!priceStr) return 0
  const match = String(priceStr).match(/£(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : 0
}

function categorySummary(categoryId) {
  if (categoryId === 'sparkling') return 'Celebration bottles and food-friendly fizz.'
  if (categoryId === 'white') return 'Mineral, aromatic, and textured white wines.'
  if (categoryId === 'red') return 'From silky Pinot to structured power reds.'
  if (categoryId === 'rosé') return 'Dry, bright rosés with seasonal flexibility.'
  if (categoryId === 'dessert') return 'Sweet and fortified styles for finishes.'
  return 'Curated benchmark bottles with context and buying routes.'
}

function normaliseRegionFamily(region) {
  const raw = String(region || '').trim()
  if (!raw) return ''
  const key = raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‑–—]/g, '-')
    .toLowerCase()

  if (key.includes('champagne')) return 'Champagne'
  if (key.includes('bordeaux') || key.includes('medoc') || key.includes('saint-emilion') || key.includes('pessac') || key.includes('sauternes') || key.includes('moulis')) return 'Bordeaux'
  if (key.includes('burgundy') || key.includes('chablis') || key.includes('beaujolais') || key.includes('cote chalonnaise') || key.includes('beaune') || key.includes('macon') || key.includes('pouilly-fuisse') || key.includes('pouilly fuisse')) return 'Burgundy & Beaujolais'
  if (key.includes('rhone')) return 'Rhone Valley'
  if (key.includes('loire') || key.includes('anjou') || key.includes('saumur')) return 'Loire Valley'
  if (key.includes('provence')) return 'Provence'
  if (key.includes('alsace')) return 'Alsace'
  if (key.includes('languedoc')) return 'Languedoc'
  if (key.includes('rioja')) return 'Rioja'
  if (key.includes('ribera del duero')) return 'Ribera del Duero'
  if (key.includes('tuscany') || key.includes('chianti')) return 'Tuscany'
  if (key.includes('piedmont') || key.includes('barolo') || key.includes('gavi')) return 'Piedmont'
  if (key.includes('veneto') || key.includes('prosecco') || key.includes('valdobbiadene') || key.includes('ripasso')) return 'Veneto'
  if (key.includes('douro')) return 'Douro Valley'
  if (key.includes('marlborough')) return 'Marlborough'
  if (key.includes('mendoza') || key.includes('uco')) return 'Mendoza'
  if (key.includes('barossa')) return 'Barossa'
  if (key.includes('south australia')) return 'South Australia'
  if (key.includes('hampshire') || key.includes('southern england') || key.includes('south east england') || key.includes('english')) return 'England (Sparkling)'
  return raw
}

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('rating')
  const [showAllGrapes, setShowAllGrapes] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const categoryFilter = searchParams.get('category') || 'all'
  const regionFilter = searchParams.get('region') || 'all'
  const countryFilter = searchParams.get('country') || 'all'
  const priceFilter = searchParams.get('price') || 'all'
  const retailerFilter = searchParams.get('retailer') || 'all'
  const grapeFilter = searchParams.get('grape') || 'all'

  useEffect(() => {
    if (countryFilter !== 'all' || retailerFilter !== 'all' || grapeFilter !== 'all') {
      setShowAdvancedFilters(true)
    }
  }, [countryFilter, retailerFilter, grapeFilter])

  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value === 'all') next.delete(key)
      else next.set(key, value)
      return next
    })
  }

  const countries = useMemo(() => {
    const values = [...new Set(wines.map(w => w.country))].sort()
    return [{ id: 'all', label: 'All Countries' }, ...values.map(v => ({ id: v, label: v }))]
  }, [])

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
      ...sorted.map(([name, type]) => ({ id: name, label: name, name, type })),
    ]
  }, [])

  const regions = useMemo(() => {
    const counts = new Map()
    wines.forEach(w => {
      const family = normaliseRegionFamily(w.region)
      if (!family) return
      counts.set(family, (counts.get(family) || 0) + 1)
    })

    const sorted = [...counts.entries()].sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]
      return a[0].localeCompare(b[0])
    })

    return [
      { id: 'all', label: 'All Regions' },
      ...sorted.map(([name, count]) => ({ id: name, label: name, count })),
    ]
  }, [])

  const allGrapes = useMemo(() => {
    const counts = {}
    wines.forEach(w => w.grapes?.forEach(g => { counts[g] = (counts[g] || 0) + 1 }))
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return [{ id: 'all', label: 'All Varieties' }, ...sorted.map(([g, n]) => ({ id: g, label: g, count: n }))]
  }, [])

  const visibleGrapes = showAllGrapes ? allGrapes : allGrapes.slice(0, TOP_GRAPES_VISIBLE + 1)
  const hiddenGrapeCount = allGrapes.length - TOP_GRAPES_VISIBLE - 1

  const filtered = useMemo(() => {
    let result = wines

    if (categoryFilter !== 'all') result = result.filter(w => w.category === categoryFilter)
    if (regionFilter !== 'all') result = result.filter(w => normaliseRegionFamily(w.region) === regionFilter)
    if (countryFilter !== 'all') result = result.filter(w => w.country === countryFilter)
    if (priceFilter !== 'all') result = result.filter(w => w.priceRange === priceFilter)
    if (retailerFilter !== 'all') result = result.filter(w => w.whereToBuy?.some(r => r.name === retailerFilter))
    if (grapeFilter !== 'all') result = result.filter(w => w.grapes?.includes(grapeFilter))

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(w => (
        w.name.toLowerCase().includes(q) ||
        w.producer.toLowerCase().includes(q) ||
        w.region.toLowerCase().includes(q) ||
        normaliseRegionFamily(w.region).toLowerCase().includes(q) ||
        w.country.toLowerCase().includes(q) ||
        w.grapes.some(g => g.toLowerCase().includes(q))
      ))
    }

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'rating': return b.rating - a.rating
        case 'value': {
          const ap = parsePrice(a.price)
          const bp = parsePrice(b.price)
          const av = ap > 0 ? a.rating / ap : 0
          const bv = bp > 0 ? b.rating / bp : 0
          return bv - av
        }
        case 'price_asc': return parsePrice(a.price) - parsePrice(b.price)
        case 'price_desc': return parsePrice(b.price) - parsePrice(a.price)
        case 'name': return a.name.localeCompare(b.name)
        case 'country': return a.country.localeCompare(b.country) || a.name.localeCompare(b.name)
        case 'vintage': {
          const av = typeof a.vintage === 'number' ? a.vintage : 0
          const bv = typeof b.vintage === 'number' ? b.vintage : 0
          return bv - av
        }
        default: return 0
      }
    })
  }, [categoryFilter, regionFilter, countryFilter, grapeFilter, priceFilter, retailerFilter, search, sort])

  const hasFilters = categoryFilter !== 'all' || regionFilter !== 'all' || countryFilter !== 'all' ||
    priceFilter !== 'all' || retailerFilter !== 'all' || grapeFilter !== 'all' || !!search.trim()

  const activeFilterCount = [
    categoryFilter !== 'all',
    regionFilter !== 'all',
    countryFilter !== 'all',
    priceFilter !== 'all',
    retailerFilter !== 'all',
    grapeFilter !== 'all',
    !!search.trim(),
  ].filter(Boolean).length

  const activeChips = [
    categoryFilter !== 'all' && { key: 'category', label: categoryFilter },
    regionFilter !== 'all' && { key: 'region', label: regionFilter },
    retailerFilter !== 'all' && { key: 'retailer', label: retailers.find(r => r.id === retailerFilter)?.label ?? retailerFilter },
    grapeFilter !== 'all' && { key: 'grape', label: grapeFilter },
    countryFilter !== 'all' && { key: 'country', label: countryFilter },
    priceFilter !== 'all' && { key: 'price', label: PRICE_RANGES.find(p => p.id === priceFilter)?.label ?? priceFilter },
  ].filter(Boolean)

  const countriesCount = useMemo(() => new Set(wines.map(w => w.country)).size, [])
  return (
    <main className="min-h-screen">
      <section className="hero-mesh relative overflow-hidden pt-24 lg:pt-28 pb-8 border-b border-white/10">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="hero-orb w-56 h-56 bg-gold/30 right-[18%] top-[10%] animate-drift" />
          <div className="hero-orb w-44 h-44 bg-terracotta/25 left-[42%] bottom-[8%] animate-drift" style={{ animationDelay: '1.1s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
            <div>
              <p className="section-label text-gold-lt/85 mb-2">Amanda's Wine Explorer</p>
              <h1 className="font-display text-5xl lg:text-6xl text-white leading-[1.04] mb-3">
                Explore with
                <span className="block text-gradient-gold">clarity, speed, and confidence.</span>
              </h1>
              <p className="font-body text-white/80 max-w-2xl text-base lg:text-lg leading-relaxed">
                Filter by region, style, shop and budget in one place, then shortlist bottles for tonight or your cellar.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter('category', categoryFilter === cat.id ? 'all' : cat.id)}
                    className={`chip ${categoryFilter === cat.id ? 'bg-gold text-white' : 'premium-chip'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 max-w-3xl">
                <div className="rounded-2xl border border-white/15 bg-white/8 p-3 interactive-lift">
                  <p className="font-body text-[10px] tracking-[0.18em] uppercase text-gold-lt/85 mb-2">France Classics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {FRANCE_REGION_FILTERS.map(region => (
                      <button
                        key={region}
                        onClick={() => setFilter('region', regionFilter === region ? 'all' : region)}
                        className={`chip ${regionFilter === region ? 'bg-gold text-white' : 'premium-chip'}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/8 p-3 interactive-lift">
                  <p className="font-body text-[10px] tracking-[0.18em] uppercase text-gold-lt/85 mb-2">World Classics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {GLOBAL_REGION_FILTERS.map(region => (
                      <button
                        key={region}
                        onClick={() => setFilter('region', regionFilter === region ? 'all' : region)}
                        className={`chip ${regionFilter === region ? 'bg-gold text-white' : 'premium-chip'}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-panel interactive-lift p-4 lg:p-5">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-slate-lt mb-3">Collection Snapshot</p>
              <div className="grid grid-cols-2 gap-3 stagger">
                {[
                  { label: 'Bottles', value: wines.length },
                  { label: 'Countries', value: countriesCount },
                  { label: 'Filtered', value: filtered.length },
                  { label: 'Active filters', value: activeFilterCount },
                ].map(stat => (
                  <div key={stat.label} className="card interactive-lift p-3 text-center">
                    <p className="font-display text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-slate-lt mt-3">
                {categorySummary(categoryFilter)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="md:hidden sticky top-16 z-30 mb-4 glass-panel p-2.5 flex items-center gap-2">
          <button
            onClick={() => setShowMobileFilters(v => !v)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate text-white font-body text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 5h14M6 10h8M9 15h2" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold text-white text-[10px] font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex-1">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full font-body text-sm px-3 py-2.5 rounded-xl border border-cream bg-white focus:outline-none focus:border-gold"
              aria-label="Sort wines"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-72 lg:w-80 flex-shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-7rem)] md:overflow-y-auto thin-scroll md:pr-1">
            <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block space-y-4 md:space-y-3 md:menu-rail`}>
              <div className="hidden md:block px-1 pb-1 border-b border-cream">
                <p className="font-body text-[10px] tracking-[0.18em] uppercase text-slate-lt/70">Filter Menu</p>
                <p className="font-body text-xs text-slate-lt mt-1">Start with region and budget. Open advanced filters only if needed.</p>
              </div>
              <div className="surface-panel p-4">
                <div className="md:hidden flex items-center justify-between mb-2">
                  <p className="section-label">Filters</p>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="font-body text-xs text-slate-lt hover:text-slate px-2 py-1"
                  >
                    Done
                  </button>
                </div>

                <label className="section-label block mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Wine, grape, region..."
                    className="w-full font-body text-sm px-4 py-2.5 pl-9 rounded-xl border border-cream bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-lt" fill="none" viewBox="0 0 20 20">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {hasFilters && (
                  <button
                    onClick={() => { setSearchParams({}); setSearch('') }}
                    className="font-body text-xs text-terracotta hover:text-terra-dk transition-colors mt-3"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <FilterGroup
                label="Category"
                options={CATEGORIES}
                value={categoryFilter}
                onChange={v => setFilter('category', v)}
                menuStyle
              />

              <FilterGroup
                label="Region"
                options={regions}
                value={regionFilter}
                onChange={v => setFilter('region', v)}
                menuStyle
                renderOption={(option) => (
                  <span className="inline-flex items-center justify-between w-full gap-2">
                    <span className="truncate">{option.label}</span>
                    {option.count ? <span className="text-[10px] opacity-70">{option.count}</span> : null}
                  </span>
                )}
              />

              <FilterGroup
                label="Price"
                options={PRICE_RANGES}
                value={priceFilter}
                onChange={v => setFilter('price', v)}
                menuStyle
              />

              <div className="surface-panel p-3.5">
                <button
                  onClick={() => setShowAdvancedFilters(v => !v)}
                  className="menu-item menu-item-idle flex items-center justify-between"
                >
                  <span className="font-body text-sm">Advanced filters</span>
                  <span className="font-body text-xs">{showAdvancedFilters ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              {showAdvancedFilters && (
                <>
                  <FilterGroup
                    label="Shop At"
                    options={retailers}
                    value={retailerFilter}
                    onChange={v => setFilter('retailer', v)}
                    menuStyle
                    renderOption={(option, active) => {
                      if (option.id === 'all') return option.label
                      return (
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <span className={`inline-flex items-center justify-center rounded-lg border h-6 w-9 px-1 ${active ? 'border-white/25 bg-white/15' : 'border-cream bg-white'}`}>
                            <RetailerLogo name={option.name || option.label} size={14} className="h-full w-full" />
                          </span>
                          <span className="truncate">{option.label}</span>
                        </span>
                      )
                    }}
                  />

                  <FilterGroup
                    label="Country"
                    options={countries}
                    value={countryFilter}
                    onChange={v => setFilter('country', v)}
                    menuStyle
                  />

                  <div className="surface-panel p-4">
                    <p className="section-label mb-2">Grape Variety</p>
                    <div className="flex flex-wrap gap-2 md:flex-col">
                      {visibleGrapes.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setFilter('grape', opt.id)}
                          className={`chip menu-item md:w-full md:justify-between ${
                            grapeFilter === opt.id
                              ? 'text-white menu-item-active'
                              : 'menu-item-idle'
                          }`}
                        >
                          {opt.label}
                          {opt.count && <span className="text-[10px] opacity-70">({opt.count})</span>}
                        </button>
                      ))}
                    </div>
                    {hiddenGrapeCount > 0 && (
                      <button
                        onClick={() => setShowAllGrapes(v => !v)}
                        className="font-body text-xs text-gold/80 hover:text-gold mt-3"
                      >
                        {showAllGrapes ? 'Show fewer varieties' : `Show ${hiddenGrapeCount} more varieties`}
                      </button>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden btn-primary w-full"
              >
                See Results
              </button>
            </div>
          </aside>

          <section className="flex-1 min-w-0">
            <div className="surface-panel p-4 mb-5 sticky top-[4.7rem] z-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                      {chip.label} x
                    </button>
                  ))}
                </div>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <label className="font-body text-xs text-slate-lt">Sort:</label>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="font-body text-sm px-3 py-1.5 rounded-lg border border-cream bg-white focus:outline-none focus:border-gold"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {sort === 'value' && (
              <div className="mb-5 px-4 py-3 bg-gold/5 border border-gold/20 rounded-xl">
                <p className="font-body text-xs text-slate-lt">
                  <span className="text-gold font-medium">Best Value</span> ranks wines by rating-per-pound.
                </p>
              </div>
            )}

            <div className="flex flex-wrap md:flex-nowrap items-center gap-x-5 gap-y-2 mb-5 px-4 py-3 bg-white rounded-xl border border-cream overflow-x-auto thin-scroll">
              <span className="font-body text-[10px] uppercase tracking-widest text-slate-lt/70 font-medium">Card colours</span>
              {CATEGORY_LEGEND.map(({ id, label, start, end }) => (
                <button
                  key={id}
                  onClick={() => setFilter('category', categoryFilter === id ? 'all' : id)}
                  className={`flex items-center gap-1.5 group transition-opacity ${
                    categoryFilter !== 'all' && categoryFilter !== id ? 'opacity-35' : ''
                  }`}
                  title={categoryFilter === id ? `Clear ${label} filter` : `Show ${label} wines only`}
                >
                  <span
                    className="w-5 h-3.5 rounded-sm shadow-sm flex-shrink-0 border border-black/10"
                    style={{ background: `linear-gradient(135deg, ${start}, ${end})` }}
                  />
                  <span className={`font-body text-xs transition-colors ${
                    categoryFilter === id ? 'text-slate font-semibold' : 'text-slate-lt group-hover:text-slate'
                  }`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-slate-lt mb-3">No wines found</p>
                <p className="font-body text-sm text-slate-lt">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
                {filtered.map(wine => (
                  <WineCard
                    key={wine.id}
                    wine={wine}
                    showPrice={sort === 'price_asc' || sort === 'price_desc' || sort === 'value'}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function FilterGroup({ label, options, value, onChange, renderOption, menuStyle = false }) {
  return (
    <div className="surface-panel p-4">
      <p className="section-label mb-2">{label}</p>
      <div className={`flex flex-wrap gap-2 ${menuStyle ? 'md:flex-col' : ''}`}>
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={
              menuStyle
                ? `chip menu-item md:w-full md:justify-between ${
                    value === option.id
                      ? 'text-white menu-item-active'
                      : 'menu-item-idle'
                  }`
                : `chip ${
                    value === option.id
                      ? 'bg-slate text-white'
                      : 'bg-white border border-cream text-slate-lt hover:border-gold/45'
                  }`
            }
          >
            {renderOption ? renderOption(option, value === option.id) : option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
