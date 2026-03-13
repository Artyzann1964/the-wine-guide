import { useState } from 'react'
import { CATEGORY_COLORS } from './constants'
import CellarStatsDashboard from './CellarStatsDashboard'
import DrinkWindowAlerts from './DrinkWindowAlerts'
import BottleCard from './BottleCard'
import EmptyState from './EmptyState'

const SORT_OPTIONS = [
  { id: 'added-desc', label: 'Recently Added' },
  { id: 'added-asc',  label: 'Oldest First' },
  { id: 'name-asc',   label: 'Name A–Z' },
  { id: 'name-desc',  label: 'Name Z–A' },
  { id: 'rating-desc', label: 'Highest Rated' },
  { id: 'price-desc', label: 'Price High–Low' },
  { id: 'price-asc',  label: 'Price Low–High' },
]

export default function CellarBottlesTab({ bottles, stats, onAddBottle, onEditBottle, onMarkTasted, onRemoveBottle }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('added-desc')

  const filtered = bottles
    .filter(b => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        (b.name     || '').toLowerCase().includes(q) ||
        (b.producer || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.vintage  || '').toString().includes(q) ||
        (b.location || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      switch (sort) {
        case 'name-asc':    return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':   return (b.name || '').localeCompare(a.name || '')
        case 'rating-desc': return (b.rating || 0) - (a.rating || 0)
        case 'price-desc':  return (parseFloat(b.purchasePrice) || 0) - (parseFloat(a.purchasePrice) || 0)
        case 'price-asc':   return (parseFloat(a.purchasePrice) || 0) - (parseFloat(b.purchasePrice) || 0)
        case 'added-asc':   return (a.addedAt || '').localeCompare(b.addedAt || '')
        default:            return (b.addedAt || '').localeCompare(a.addedAt || '')
      }
    })

  if (bottles.length === 0) {
    return (
      <>
        <CellarStatsDashboard bottles={bottles} />
        <EmptyState
          icon="🍾"
          title="Your cellar is empty"
          body="Start tracking your wine collection — add bottles you own, record purchase prices, and never forget a great wine."
          cta="Add Your First Bottle"
          onCta={onAddBottle}
        />
      </>
    )
  }

  return (
    <>
      <CellarStatsDashboard bottles={bottles} />
      <DrinkWindowAlerts bottles={bottles} />

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bottles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream bg-white font-body text-sm text-slate placeholder:text-slate-lt/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-lt/50 hover:text-slate-lt"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-cream bg-white font-body text-sm text-slate focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
        >
          {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      {search.trim() && (
        <p className="font-body text-xs text-slate-lt mb-3">
          {filtered.length} of {bottles.length} bottle{bottles.length !== 1 ? 's' : ''} matching "{search.trim()}"
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-slate-lt">No bottles match your search.</p>
          <button onClick={() => setSearch('')} className="btn-ghost text-xs mt-2">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => (
            <BottleCard
              key={b.id}
              bottle={b}
              onEdit={() => onEditBottle(b)}
              onMarkTasted={() => onMarkTasted(b)}
              onRemove={() => onRemoveBottle(b.id)}
            />
          ))}
        </div>
      )}

      {/* Category breakdown */}
      {filtered.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display font-semibold text-xl text-slate mb-5">Cellar Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(stats.byCategory).filter(([, v]) => v > 0).map(([cat, count]) => (
              <div key={cat} className={`rounded-xl border px-4 py-3 text-center ${CATEGORY_COLORS[cat] || 'bg-cream border-cream text-slate-lt'}`}>
                <p className="font-display font-bold text-2xl">{count}</p>
                <p className="font-body text-xs mt-0.5 capitalize">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
