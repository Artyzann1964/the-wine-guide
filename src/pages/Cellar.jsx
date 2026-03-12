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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bottles.map(b => (
                  <BottleCard
                    key={b.id}
                    bottle={b}
                    onMarkTasted={() => setTastingBottle(b)}
                    onRemove={() => removeBottle(b.id)}
                  />
                ))}
              </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map(w => (
                    <WishlistCard key={w.id} item={w} onRemove={() => removeFromWishlist(w.id)} />
                  ))}
                </div>
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
        {activeTab === 'bottles' && bottles.length > 0 && (
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
