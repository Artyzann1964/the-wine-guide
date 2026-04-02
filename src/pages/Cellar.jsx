import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCellar } from '../hooks/useCellar'
import { parseVivinoCsv, vivinoRowsToTastedEntries } from '../utils/vivinoImport'

import { TABS } from '../components/cellar/constants'
import CellarSyncPanel from '../components/cellar/CellarSyncPanel'
import CellarBottlesTab from '../components/cellar/CellarBottlesTab'
import CellarWishlistTab from '../components/cellar/CellarWishlistTab'
import TastedReviewTable from '../components/cellar/TastedReviewTable'
import VivinoImportPanel from '../components/cellar/VivinoImportPanel'
import EmptyState from '../components/cellar/EmptyState'
import AddBottleModal from '../components/cellar/AddBottleModal'
import EditBottleModal from '../components/cellar/EditBottleModal'
import TastingNoteModal from '../components/cellar/TastingNoteModal'

export default function Cellar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('bottles')
  const [showAddModal, setShowAddModal] = useState(false)
  const [tastingBottle, setTastingBottle] = useState(null)
  const [editingBottle, setEditingBottle] = useState(null)
  const [editingTastingNote, setEditingTastingNote] = useState(null)
  const [syncSeed, setSyncSeed] = useState('')
  const [vivinoStatus, setVivinoStatus] = useState({ tone: '', message: '' })
  const [importingVivino, setImportingVivino] = useState(false)

  const {
    bottles, wishlist, tasted, stats,
    removeBottle, removeFromWishlist,
    importTastedEntries, importCellarData, markTasted, updateTastedEntry,
  } = useCellar()

  const cellarValue = bottles.reduce((sum, b) => sum + (parseFloat(b.purchasePrice) || 0) * (b.quantity || 1), 0)

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
      const rows = parseVivinoCsv(await response.text())
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
            <button onClick={() => setShowAddModal(true)} className="btn-primary self-start sm:self-auto flex-shrink-0">
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
              cellarValue > 0
                ? { label: 'Est. Value', value: `£${cellarValue.toLocaleString('en-GB', { maximumFractionDigits: 0 })}` }
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
        <div className="surface-panel overflow-hidden mb-8">
          <div className="grid lg:grid-cols-[1.2fr_0.95fr] gap-6 items-center p-5 sm:p-6">
            <div>
              <p className="section-label mb-2">Amanda's Cellar Notes</p>
              <h2 className="font-display text-3xl sm:text-4xl text-slate leading-tight">
                Keep this page calm, bright, and useful.
              </h2>
              <p className="font-body text-slate-lt mt-3 max-w-2xl leading-relaxed">
                Track what is ready to drink, save the bottles worth repeating, and keep gift ideas visible without turning the cellar into admin.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Drink what is peaking', 'Note what you loved', 'Keep the wishlist giftable'].map((item) => (
                  <span key={item} className="chip bg-white border border-cream text-slate-lt">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gold/15 bg-gradient-to-br from-white via-[#fbf6ee] to-[#f3eadc] p-4 sm:p-5 shadow-card">
              <div className="grid grid-cols-[112px_1fr] sm:grid-cols-[136px_1fr] gap-4 items-center">
                <div className="relative h-40 sm:h-44 overflow-hidden rounded-[1.5rem] bg-white">
                  <img
                    src="/amanda-wine.png"
                    alt="Amanda Holmes"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.24em] text-gold mb-2">House style</p>
                  <p className="font-display text-2xl text-slate leading-tight">A lighter page for the practical side of collecting.</p>
                  <p className="font-body text-sm text-slate-lt mt-3 leading-relaxed">
                    Use the cellar for memory as much as stock control: what to open now, what to buy again, and what deserves a place on the next good table.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream rounded-2xl p-1 mb-8 w-full sm:w-auto sm:inline-flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeTab === t.id ? 'bg-white text-slate shadow-card' : 'text-slate-lt hover:text-slate'}`}
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

        {activeTab === 'bottles' && (
          <CellarBottlesTab
            bottles={bottles}
            stats={stats}
            onAddBottle={() => setShowAddModal(true)}
            onEditBottle={setEditingBottle}
            onMarkTasted={setTastingBottle}
            onRemoveBottle={removeBottle}
          />
        )}

        {activeTab === 'wishlist' && (
          <CellarWishlistTab wishlist={wishlist} onRemove={removeFromWishlist} />
        )}

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
              <TastedReviewTable tasted={tasted} onEdit={setEditingTastingNote} />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddBottleModal onClose={() => setShowAddModal(false)} />}
      {editingBottle && <EditBottleModal bottle={editingBottle} onClose={() => setEditingBottle(null)} />}
      {tastingBottle && (
        <TastingNoteModal
          bottle={tastingBottle}
          onClose={() => setTastingBottle(null)}
          onSave={note => {
            markTasted(tastingBottle.id, note)
            setTastingBottle(null)
            setActiveTab('tasted')
          }}
        />
      )}
      {editingTastingNote && (
        <TastingNoteModal
          bottle={editingTastingNote}
          editMode
          onClose={() => setEditingTastingNote(null)}
          onSave={note => {
            updateTastedEntry(editingTastingNote.id, {
              rating: note.rating,
              wouldBuyAgain: note.wouldBuyAgain,
              tastingNote: note.note,
              score: note.score,
              colour: note.colour,
              nose: note.nose,
              body: note.body,
              acidity: note.acidity,
              tannins: note.tannins,
              finish: note.finish,
            })
            setEditingTastingNote(null)
          }}
        />
      )}
    </div>
  )
}
