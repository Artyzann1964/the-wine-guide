import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCellar } from '../hooks/useCellar'
import { parseVivinoCsv, vivinoRowsToTastedEntries } from '../utils/vivinoImport'

import { TABS, CATEGORY_COLORS } from '../components/cellar/constants'
import CellarSyncPanel from '../components/cellar/CellarSyncPanel'
import BottleCard from '../components/cellar/BottleCard'
import WishlistCard from '../components/cellar/WishlistCard'
import WishlistSharePanel from '../components/cellar/WishlistSharePanel'
import TastedReviewTable from '../components/cellar/TastedReviewTable'
import VivinoImportPanel from '../components/cellar/VivinoImportPanel'
import EmptyState from '../components/cellar/EmptyState'
import AddBottleModal from '../components/cellar/AddBottleModal'
import TastingNoteModal from '../components/cellar/TastingNoteModal'

export default function Cellar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('bottles')
  const [showAddModal, setShowAddModal] = useState(false)
  const [tastingBottle, setTastingBottle] = useState(null)
  const [syncSeed, setSyncSeed] = useState('')
  const { bottles, wishlist, tasted, removeBottle, removeFromWishlist, importTastedEntries, importCellarData, markTasted, stats } = useCellar()
  const [vivinoStatus, setVivinoStatus] = useState({ tone: '', message: '' })
  const [importingVivino, setImportingVivino] = useState(false)
  const [bottleSearch, setBottleSearch] = useState('')
  const [bottleSort, setBottleSort] = useState('added-desc')
  const [wishlistSearch, setWishlistSearch] = useState('')
  const [wishlistSort, setWishlistSort] = useState('added-desc')

  const SORT_OPTIONS = [
    { id: 'added-desc', label: 'Recently Added' },
    { id: 'added-asc', label: 'Oldest First' },
    { id: 'name-asc', label: 'Name A–Z' },
    { id: 'name-desc', label: 'Name Z–A' },
    { id: 'rating-desc', label: 'Highest Rated' },
    { id: 'price-desc', label: 'Price High–Low' },
    { id: 'price-asc', label: 'Price Low–High' },
  ]

  const WISHLIST_SORT_OPTIONS = [
    { id: 'added-desc', label: 'Recently Added' },
    { id: 'added-asc', label: 'Oldest First' },
    { id: 'name-asc', label: 'Name A–Z' },
    { id: 'name-desc', label: 'Name Z–A' },
    { id: 'category-asc', label: 'Category A–Z' },
  ]

  const filteredBottles = bottles
    .filter(b => {
      if (!bottleSearch.trim()) return true
      const q = bottleSearch.toLowerCase()
      return (
        (b.name || '').toLowerCase().includes(q) ||
        (b.producer || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.vintage || '').toString().includes(q) ||
        (b.location || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      switch (bottleSort) {
        case 'name-asc': return (a.name || '').localeCompare(b.name || '')
        case 'name-desc': return (b.name || '').localeCompare(a.name || '')
        case 'rating-desc': return (b.rating || 0) - (a.rating || 0)
        case 'price-desc': return (parseFloat(b.purchasePrice) || 0) - (parseFloat(a.purchasePrice) || 0)
        case 'price-asc': return (parseFloat(a.purchasePrice) || 0) - (parseFloat(b.purchasePrice) || 0)
        case 'added-asc': return (a.addedAt || '').localeCompare(b.addedAt || '')
        default: return (b.addedAt || '').localeCompare(a.addedAt || '') // added-desc
      }
    })

  const filteredWishlist = wishlist
    .filter(w => {
      if (!wishlistSearch.trim()) return true
      const q = wishlistSearch.toLowerCase()
      return (
        (w.name || '').toLowerCase().includes(q) ||
        (w.producer || '').toLowerCase().includes(q) ||
        (w.category || '').toLowerCase().includes(q) ||
        (w.vintage || '').toString().includes(q) ||
        (w.region || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      switch (wishlistSort) {
        case 'name-asc': return (a.name || '').localeCompare(b.name || '')
        case 'name-desc': return (b.name || '').localeCompare(a.name || '')
        case 'category-asc': return (a.category || '').localeCompare(b.category || '')
        case 'added-asc': return (a.addedAt || '').localeCompare(b.addedAt || '')
        default: return (b.addedAt || '').localeCompare(a.addedAt || '')
      }
    })

  const cellarValue = bottles.reduce((sum, b) => {
    const price = parseFloat(b.purchasePrice) || 0
    return sum + price * (b.quantity || 1)
  }, 0)
  const hasValue = cellarValue > 0

  useEffect(() => {
    const syncFromUrl = searchParams.get('cs')
    if (!syncFromUrl) return
    setSyncSeed(syncFromUrl)
    const next = new URLSearchParams(searchParams)
    next.delete('cs')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  async function importVivinoHistory() {
    setImportingVivino(true)
    setVivinoStatus({ tone: '', message: '' })
    try {
      const response = await fetch('/vivino_wines_export.csv', { cache: 'no-store' })
      if (!response.ok) {
        setVivinoStatus({ tone: 'error', message: 'Could not load `vivino_wines_export.csv` from public/. Please confirm the file exists.' })
        return
      }
      const csvText = await response.text()
      const rows = parseVivinoCsv(csvText)
      const entries = vivinoRowsToTastedEntries(rows)
      const result = importTastedEntries(entries)

      if (result.added > 0) {
        setVivinoStatus({ tone: 'success', message: `Imported ${result.added} Vivino wines into Tasting Notes.` })
        setActiveTab('tasted')
      } else {
        setVivinoStatus({ tone: 'info', message: 'Vivino wines are already in your tasting notes (no new additions).' })
      }
    } catch {
      setVivinoStatus({ tone: 'error', message: 'Vivino import failed. Please try again in a few seconds.' })
    } finally {
      setImportingVivino(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="hero-mesh text-white relative overflow-hidden pt-24 lg:pt-28 pb-14 border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold/10 translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-terracotta/10 translate-y-12" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="section-label text-gold/70 mb-3">Personal</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">My Cellar</h1>
              <p className="font-body text-white/60">Track your collection, record tasting notes, build your wishlist.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary self-start sm:self-auto flex-shrink-0"
            >
              + Add a Bottle
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {[
              { label: 'Bottles',   value: stats.totalBottles },
              { label: 'Wines',     value: stats.totalWines },
              { label: 'Wishlist',  value: stats.wishlistCount },
              { label: 'Tasted',    value: stats.tastedCount },
              hasValue
                ? { label: 'Est. Value', value: `£${cellarValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` }
                : { label: 'Est. Value', value: '—' },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/10 px-4 py-3 text-center">
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="font-body text-xs text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        {/* Tabs */}
        <div className="flex gap-1 bg-cream rounded-2xl p-1 mb-8 w-full sm:w-auto sm:inline-flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeTab === t.id
                  ? 'bg-white text-slate shadow-card'
                  : 'text-slate-lt hover:text-slate'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CellarSyncPanel
          bottles={bottles}
          wishlist={wishlist}
          tasted={tasted}
          importCellarData={importCellarData}
          syncSeed={syncSeed}
          onSyncSeedConsumed={() => setSyncSeed('')}
        />

        {/* Tab: Bottles */}
        {activeTab === 'bottles' && (
          <div>
            {bottles.length === 0 ? (
              <EmptyState
                icon="🍾"
                title="Your cellar is empty"
                body="Start tracking your wine collection — add bottles you own, record purchase prices, and never forget a great wine."
                cta="Add Your First Bottle"
                onCta={() => setShowAddModal(true)}
              />
            ) : (
              <>
                {/* Search + Sort bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                      type="text"
                      value={bottleSearch}
                      onChange={e => setBottleSearch(e.target.value)}
                      placeholder="Search bottles..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream bg-white font-body text-sm text-slate placeholder:text-slate-lt/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
                    />
                    {bottleSearch && (
                      <button
                        onClick={() => setBottleSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-lt/50 hover:text-slate-lt"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <select
                    value={bottleSort}
                    onChange={e => setBottleSort(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-cream bg-white font-body text-sm text-slate focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Results info when searching */}
                {bottleSearch.trim() && (
                  <p className="font-body text-xs text-slate-lt mb-3">
                    {filteredBottles.length} of {bottles.length} bottle{bottles.length !== 1 ? 's' : ''} matching "{bottleSearch.trim()}"
                  </p>
                )}

                {filteredBottles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-body text-slate-lt">No bottles match your search.</p>
                    <button onClick={() => setBottleSearch('')} className="btn-ghost text-xs mt-2">Clear search</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBottles.map(b => (
                      <BottleCard
                        key={b.id}
                        bottle={b}
                        onMarkTasted={() => setTastingBottle(b)}
                        onRemove={() => removeBottle(b.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <EmptyState
                icon="⭐"
                title="Your wishlist is empty"
                body="Browse the wine explorer and save bottles you want to try. Build your dream cellar."
                cta="Explore Wines"
                ctaLink="/explore"
              />
            ) : (
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
                      value={wishlistSearch}
                      onChange={e => setWishlistSearch(e.target.value)}
                      placeholder="Search wishlist..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream bg-white font-body text-sm text-slate placeholder:text-slate-lt/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
                    />
                    {wishlistSearch && (
                      <button
                        onClick={() => setWishlistSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-lt/50 hover:text-slate-lt"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <select
                    value={wishlistSort}
                    onChange={e => setWishlistSort(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-cream bg-white font-body text-sm text-slate focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
                  >
                    {WISHLIST_SORT_OPTIONS.map(o => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {wishlistSearch.trim() && (
                  <p className="font-body text-xs text-slate-lt">
                    {filteredWishlist.length} of {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} matching "{wishlistSearch.trim()}"
                  </p>
                )}

                {filteredWishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-body text-slate-lt">No wishlist items match your search.</p>
                    <button onClick={() => setWishlistSearch('')} className="btn-ghost text-xs mt-2">Clear search</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWishlist.map(w => (
                      <WishlistCard key={w.id} item={w} onRemove={() => removeFromWishlist(w.id)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Tasted */}
        {activeTab === 'tasted' && (
          <div className="space-y-4">
            <VivinoImportPanel
              status={vivinoStatus}
              importing={importingVivino}
              onImport={importVivinoHistory}
            />
            {tasted.length === 0 ? (
              <EmptyState
                icon="📓"
                title="No tasting notes yet"
                body="When you open a bottle from your cellar, mark it as tasted and record your impressions."
                cta="Go to My Bottles"
                onCta={() => setActiveTab('bottles')}
              />
            ) : (
              <TastedReviewTable tasted={tasted} />
            )}
          </div>
        )}

        {/* By Category breakdown */}
        {activeTab === 'bottles' && filteredBottles.length > 0 && (
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
      </div>

      {/* Modals */}
      {showAddModal && <AddBottleModal onClose={() => setShowAddModal(false)} />}
      {tastingBottle && (
        <TastingNoteModal
          bottle={tastingBottle}
          onClose={() => setTastingBottle(null)}
          onSave={(note) => {
            markTasted(tastingBottle.id, note)
            setTastingBottle(null)
            setActiveTab('tasted')
          }}
        />
      )}
    </div>
  )
}
