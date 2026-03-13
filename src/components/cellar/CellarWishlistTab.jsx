import { useState } from 'react'
import WishlistCard from './WishlistCard'
import WishlistSharePanel from './WishlistSharePanel'
import EmptyState from './EmptyState'

const SORT_OPTIONS = [
  { id: 'added-desc',   label: 'Recently Added' },
  { id: 'added-asc',    label: 'Oldest First' },
  { id: 'name-asc',     label: 'Name A–Z' },
  { id: 'name-desc',    label: 'Name Z–A' },
  { id: 'category-asc', label: 'Category A–Z' },
]

export default function CellarWishlistTab({ wishlist, onRemove }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('added-desc')

  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="Your wishlist is empty"
        body="Browse the wine explorer and save bottles you want to try. Build your dream cellar."
        cta="Explore Wines"
        ctaLink="/explore"
      />
    )
  }

  const filtered = wishlist
    .filter(w => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        (w.name     || '').toLowerCase().includes(q) ||
        (w.producer || '').toLowerCase().includes(q) ||
        (w.category || '').toLowerCase().includes(q) ||
        (w.vintage  || '').toString().includes(q) ||
        (w.region   || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      switch (sort) {
        case 'name-asc':     return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':    return (b.name || '').localeCompare(a.name || '')
        case 'category-asc': return (a.category || '').localeCompare(b.category || '')
        case 'added-asc':    return (a.addedAt || '').localeCompare(b.addedAt || '')
        default:             return (b.addedAt || '').localeCompare(a.addedAt || '')
      }
    })

  return (
    <div className="space-y-4">
      <WishlistSharePanel wishlist={wishlist} />

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search wishlist..."
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
        <p className="font-body text-xs text-slate-lt">
          {filtered.length} of {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} matching "{search.trim()}"
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-slate-lt">No wishlist items match your search.</p>
          <button onClick={() => setSearch('')} className="btn-ghost text-xs mt-2">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(w => (
            <WishlistCard key={w.id} item={w} onRemove={() => onRemove(w.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
