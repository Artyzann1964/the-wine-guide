import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCellar } from '../hooks/useCellar'
import { wines as wineDB } from '../data/wines'
import { buildWishlistSharePayload, buildWishlistShareUrl, encodeWishlistPayload } from '../utils/wishlistShare'
import { parseVivinoCsv, vivinoRowsToTastedEntries } from '../utils/vivinoImport'
import { buildCellarSyncPayload, decodeCellarSyncPayload, encodeCellarSyncPayload } from '../utils/cellarSync'

const TABS = [
  { id: 'bottles', label: 'My Bottles' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'tasted', label: 'Tasting Notes' },
]

const CATEGORY_COLORS = {
  sparkling: 'bg-amber-50 text-amber-700 border-amber-200',
  white:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  red:       'bg-rose-50 text-rose-700 border-rose-200',
  rosé:      'bg-pink-50 text-pink-700 border-pink-200',
  dessert:   'bg-orange-50 text-orange-700 border-orange-200',
}

const PURCHASE_CHANNELS = [
  { id: 'supermarket', label: 'Supermarket' },
  { id: 'merchant', label: 'Wine merchant' },
  { id: 'wine-bar', label: 'Wine bar' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'online', label: 'Online' },
  { id: 'gift', label: 'Gift' },
  { id: 'other', label: 'Other' },
]

const RETAILER_OPTIONS = [
  'Waitrose',
  "Sainsbury's",
  'Tesco',
  'M&S',
  'Asda',
  'Aldi',
  'Lidl',
  'Morrisons',
  'Co-op',
  'Majestic',
  'Le Bon Vin Sheffield',
  'Gill & Co.',
  'The Harritt Wine Bar',
  'Rafters Restaurant',
  'Other',
]

const WISHLIST_OWNER_KEY = 'wine-guide-wishlist-owner'

// Returns drinking window status for a cellar bottle
function drinkWindowStatus(bottle) {
  const parseYear = (val) => {
    if (!val) return null
    const n = parseInt(String(val))
    return isNaN(n) ? null : n
  }
  const from = parseYear(bottle.drinkFrom)
  const to   = parseYear(bottle.drinkBy)
  if (!from && !to) return null
  const year = new Date().getFullYear()
  if (from && year < from)
    return { status: 'wait',  icon: '🔵', label: `Not ready — opens ${from}`,    cls: 'text-blue-700 bg-blue-50 border-blue-200' }
  if (to && year > to)
    return { status: 'over',  icon: '🔴', label: `Past peak — drink now`,         cls: 'text-rose-700 bg-rose-50 border-rose-200' }
  return       { status: 'ready', icon: '🟢', label: to ? `In window — enjoy by ${to}` : 'Ready to drink', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
}

export default function Cellar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('bottles')
  const [showAddModal, setShowAddModal] = useState(false)
  const [syncSeed, setSyncSeed] = useState('')
  const { bottles, wishlist, tasted, removeBottle, removeFromWishlist, importTastedEntries, importCellarData, stats } = useCellar()
  const [vivinoStatus, setVivinoStatus] = useState({ tone: '', message: '' })
  const [importingVivino, setImportingVivino] = useState(false)

  // Estimated cellar value
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
                  <BottleCard key={b.id} bottle={b} onRemove={() => removeBottle(b.id)} />
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
              <div className="space-y-4">
                {tasted.map(t => (
                  <TastedCard key={t.id} note={t} />
                ))}
              </div>
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

      {/* Add Modal */}
      {showAddModal && <AddBottleModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}

function VivinoImportPanel({ status, importing, onImport }) {
  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-label mb-2">Vivino</p>
          <h3 className="font-display font-semibold text-2xl text-slate mb-1">Import your Vivino history</h3>
          <p className="font-body text-sm text-slate-lt">Loads wines from `public/vivino_wines_export.csv` into Tasting Notes with duplicate protection.</p>
        </div>
        <button onClick={onImport} disabled={importing} className={`btn-primary ${importing ? 'opacity-65 cursor-wait' : ''}`}>
          {importing ? 'Importing…' : 'Import Vivino CSV'}
        </button>
      </div>

      {status?.message && (
        <div className={`mt-3 rounded-xl border px-3 py-2.5 ${
          status.tone === 'success'
            ? 'bg-emerald-50 border-emerald-200'
            : status.tone === 'error'
              ? 'bg-rose-50 border-rose-200'
              : 'bg-gold/10 border-gold/30'
        }`}>
          <p className="font-body text-xs text-slate">{status.message}</p>
        </div>
      )}
    </div>
  )
}

function WishlistSharePanel({ wishlist }) {
  const [ownerName, setOwnerName] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  useEffect(() => {
    try {
      setOwnerName(localStorage.getItem(WISHLIST_OWNER_KEY) || '')
    } catch {
      setOwnerName('')
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_OWNER_KEY, ownerName)
    } catch {
      // Ignore write failures
    }
  }, [ownerName])

  const shareUrl = useMemo(() => {
    const payload = buildWishlistSharePayload({
      ownerName,
      wishlist,
      wineLookup: wineId => wineDB.find(w => w.id === wineId),
    })
    const encoded = encodeWishlistPayload(payload)
    return buildWishlistShareUrl(encoded)
  }, [ownerName, wishlist])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setCopyError('')
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopyError('Could not copy automatically. Long-press to copy the link below.')
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      copyLink()
      return
    }
    try {
      await navigator.share({
        title: `${ownerName || 'Amanda'}'s Wine Wishlist`,
        text: 'Gift ideas by price tier from Amanda’s Wine Guide',
        url: shareUrl,
      })
    } catch {
      // User cancelled share sheet.
    }
  }

  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-label mb-2">Wishlist Share</p>
          <h3 className="font-display font-semibold text-2xl text-slate mb-1">Share gift ideas with friends</h3>
          <p className="font-body text-sm text-slate-lt">Generate a private link that organises wines by budget so people can choose the right gift quickly.</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button onClick={nativeShare} className="btn-primary flex-1 lg:flex-none">Share</button>
          <button onClick={copyLink} className="btn-secondary flex-1 lg:flex-none">
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3 mt-4">
        <label className="block">
          <span className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Wishlist owner</span>
          <input
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
            placeholder="Amanda"
            className="w-full rounded-xl border border-cream bg-ivory px-4 py-2.5 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
          />
        </label>
        <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-xs font-mono text-slate/75 break-all">
          {shareUrl}
        </div>
      </div>

      {copyError && (
        <p className="font-body text-xs text-terracotta mt-2">{copyError}</p>
      )}
    </div>
  )
}

function CellarSyncPanel({ bottles, wishlist, tasted, importCellarData, syncSeed, onSyncSeedConsumed }) {
  const [showImport, setShowImport] = useState(false)
  const [syncInput, setSyncInput] = useState('')
  const [syncStatus, setSyncStatus] = useState({ tone: '', message: '' })

  useEffect(() => {
    if (!syncSeed) return
    setSyncInput(syncSeed)
    setShowImport(true)
    setSyncStatus({ tone: 'info', message: 'Sync code detected in this link. Tap Merge on this device to import it.' })
    onSyncSeedConsumed?.()
  }, [syncSeed, onSyncSeedConsumed])

  const syncCode = useMemo(() => {
    const payload = buildCellarSyncPayload({ bottles, wishlist, tasted })
    return encodeCellarSyncPayload(payload)
  }, [bottles, wishlist, tasted])

  const syncLink = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const safe = encodeURIComponent(syncCode)
    return `${window.location.origin}${window.location.pathname}#/cellar?cs=${safe}`
  }, [syncCode])

  async function copySyncCode() {
    try {
      await navigator.clipboard.writeText(syncCode)
      setSyncStatus({ tone: 'success', message: 'Sync code copied. Paste it on your other device and import.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Clipboard was blocked. Copy the code manually from the box below.' })
    }
  }

  async function copySyncLink() {
    try {
      await navigator.clipboard.writeText(syncLink)
      setSyncStatus({ tone: 'success', message: 'Sync link copied. Open it on your other device to import quickly.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Clipboard was blocked. Copy the link manually from the box below.' })
    }
  }

  function importFromCode(mode = 'merge') {
    const parsed = decodeCellarSyncPayload(syncInput.trim())
    if (!parsed) {
      setSyncStatus({ tone: 'error', message: 'Invalid sync code. Copy it again from the source device and retry.' })
      return
    }

    if (mode === 'replace') {
      const confirmed = window.confirm('Replace all cellar data on this device with the imported data?')
      if (!confirmed) return
    }

    const result = importCellarData(parsed, mode)
    if (mode === 'replace') {
      setSyncStatus({
        tone: 'success',
        message: `Replaced this device: ${result.totals.bottles} bottles, ${result.totals.wishlist} wishlist, ${result.totals.tasted} tasted.`,
      })
      return
    }

    const totalAdded = result.added.bottles + result.added.wishlist + result.added.tasted
    const totalSkipped = result.skipped.bottles + result.skipped.wishlist + result.skipped.tasted
    setSyncStatus({
      tone: 'success',
      message: `Merged ${totalAdded} items (${result.added.bottles} bottles, ${result.added.wishlist} wishlist, ${result.added.tasted} tasted). Skipped ${totalSkipped} duplicates.`,
    })
  }

  return (
    <div className="surface-panel p-5 sm:p-6 mb-8">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-label mb-2">Cross-device Sync</p>
          <h3 className="font-display font-semibold text-2xl text-slate mb-1">Move your cellar to another device</h3>
          <p className="font-body text-sm text-slate-lt">
            Cellar data is local to each browser. Copy a sync code (or link) from this device, then import it on your other phone/laptop.
          </p>
        </div>
        <div className="flex gap-2 w-full xl:w-auto">
          <button onClick={copySyncCode} className="btn-primary flex-1 xl:flex-none">Copy Sync Code</button>
          <button onClick={copySyncLink} className="btn-secondary flex-1 xl:flex-none">Copy Sync Link</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-[11px] font-mono text-slate/75 break-all max-h-32 overflow-y-auto">
          {syncCode}
        </div>
        <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-[11px] font-mono text-slate/75 break-all max-h-32 overflow-y-auto">
          {syncLink}
        </div>
      </div>

      <div className="mt-4">
        <button onClick={() => setShowImport(v => !v)} className="btn-ghost text-xs">
          {showImport ? 'Hide Import' : 'Import on This Device'}
        </button>
      </div>

      {showImport && (
        <div className="mt-3 rounded-xl border border-cream bg-white/80 p-3 space-y-3">
          <label className="block">
            <span className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Paste sync code</span>
            <textarea
              value={syncInput}
              onChange={e => setSyncInput(e.target.value)}
              rows={4}
              placeholder="Paste the WGCS1_... code from your other device"
              className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-mono text-xs text-slate focus:outline-none focus:border-gold resize-y"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => importFromCode('merge')} className="btn-primary text-xs">Merge into This Device</button>
            <button onClick={() => importFromCode('replace')} className="btn-secondary text-xs">Replace This Device</button>
          </div>
        </div>
      )}

      {syncStatus.message && (
        <div className={`mt-3 rounded-xl border px-3 py-2.5 ${
          syncStatus.tone === 'success'
            ? 'bg-emerald-50 border-emerald-200'
            : syncStatus.tone === 'error'
              ? 'bg-rose-50 border-rose-200'
              : 'bg-gold/10 border-gold/30'
        }`}>
          <p className="font-body text-xs text-slate">{syncStatus.message}</p>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────

function BottleCard({ bottle, onRemove }) {
  const dbWine = wineDB.find(w => w.id === bottle.wineId)
  const cat    = bottle.category || dbWine?.category || 'red'
  const window = drinkWindowStatus(bottle)

  const boughtFrom = bottle.purchaseRetailer === 'Other'
    ? bottle.purchaseRetailerOther
    : bottle.purchaseRetailer

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-slate text-lg leading-tight">{bottle.name}</p>
          {bottle.producer && (
            <p className="font-body text-xs text-slate-lt mt-0.5">{bottle.producer}</p>
          )}
        </div>
        <span className={`tag flex-shrink-0 border capitalize ${CATEGORY_COLORS[cat] || 'bg-cream border-cream text-slate-lt'}`}>
          {cat}
        </span>
      </div>

      {/* Drinking window alert */}
      {window && (
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${window.cls}`}>
          <span className="text-sm leading-none">{window.icon}</span>
          <span className="font-body text-xs font-medium">{window.label}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center">
        {bottle.vintage && (
          <div className="rounded-lg bg-cream px-2 py-2">
            <p className="font-body text-xs text-slate-lt">Vintage</p>
            <p className="font-body font-semibold text-sm text-slate">{bottle.vintage}</p>
          </div>
        )}
        {bottle.quantity && (
          <div className="rounded-lg bg-cream px-2 py-2">
            <p className="font-body text-xs text-slate-lt">Bottles</p>
            <p className="font-body font-semibold text-sm text-slate">{bottle.quantity}</p>
          </div>
        )}
        {bottle.purchasePrice && (
          <div className="rounded-lg bg-cream px-2 py-2">
            <p className="font-body text-xs text-slate-lt">Paid</p>
            <p className="font-body font-semibold text-sm text-slate">£{bottle.purchasePrice}</p>
          </div>
        )}
      </div>

      {(bottle.purchaseSourceType || boughtFrom || bottle.location) && (
        <div className="rounded-xl border border-cream bg-white/75 px-3 py-2.5 space-y-1">
          {bottle.purchaseSourceType && (
            <p className="font-body text-xs text-slate-lt">
              <strong className="text-slate">Bought via:</strong> {PURCHASE_CHANNELS.find(c => c.id === bottle.purchaseSourceType)?.label || bottle.purchaseSourceType}
            </p>
          )}
          {boughtFrom && (
            <p className="font-body text-xs text-slate-lt">
              <strong className="text-slate">Bought from:</strong> {boughtFrom}
            </p>
          )}
          {bottle.location && (
            <p className="font-body text-xs text-slate-lt">
              <strong className="text-slate">Stored:</strong> {bottle.location}
            </p>
          )}
        </div>
      )}

      {bottle.notes && (
        <p className="font-body text-xs text-slate-lt leading-relaxed border-t border-cream pt-3 italic">
          "{bottle.notes}"
        </p>
      )}

      <div className="flex gap-2 mt-auto pt-2">
        {dbWine && (
          <Link to={`/explore/${dbWine.id}`} className="btn-ghost text-xs flex-1 text-center">
            View Wine
          </Link>
        )}
        <button
          onClick={onRemove}
          className="btn-ghost text-xs text-terracotta/70 hover:text-terracotta flex-1"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

function WishlistCard({ item, onRemove }) {
  const dbWine = wineDB.find(w => w.id === item.wineId)
  const cat = item.category || dbWine?.category || 'red'

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-slate text-lg leading-tight">{item.name}</p>
          {item.producer && (
            <p className="font-body text-xs text-slate-lt mt-0.5">{item.producer}</p>
          )}
          {item.vintage && (
            <p className="font-body text-xs text-slate-lt">{item.vintage}</p>
          )}
        </div>
        <span className={`tag flex-shrink-0 border capitalize ${CATEGORY_COLORS[cat] || 'bg-cream border-cream text-slate-lt'}`}>
          {cat}
        </span>
      </div>

      {item.addedAt && (
        <p className="font-body text-xs text-slate-lt/60">
          Added {new Date(item.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      )}

      <div className="flex gap-2 mt-auto">
        {dbWine && (
          <Link to={`/explore/${dbWine.id}`} className="btn-ghost text-xs flex-1 text-center">
            View Wine
          </Link>
        )}
        <button onClick={onRemove} className="btn-ghost text-xs text-terracotta/70 hover:text-terracotta flex-1">
          Remove
        </button>
      </div>
    </div>
  )
}

function TastedCard({ note }) {
  const STARS = Array.from({ length: 5 }, (_, i) => i < (note.rating || 0))
  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <p className="font-display font-semibold text-xl text-slate">{note.name}</p>
          <div className="flex items-center gap-3 mt-1">
            {note.producer && <p className="font-body text-xs text-slate-lt">{note.producer}</p>}
            {note.vintage && <p className="font-body text-xs text-slate-lt">{note.vintage}</p>}
          </div>
        </div>
        {note.rating > 0 && (
          <div className="flex gap-0.5">
            {STARS.map((filled, i) => (
              <svg key={i} className={`w-4 h-4 ${filled ? 'text-gold fill-gold' : 'text-cream fill-cream stroke-cream/40'}`} viewBox="0 0 16 16">
                <path d="M8 1.5l1.65 3.35L13.5 5.5l-2.75 2.68.65 3.77L8 10.15l-3.4 1.8.65-3.77L2.5 5.5l3.85-.65L8 1.5z" />
              </svg>
            ))}
          </div>
        )}
      </div>
      {note.notes && (
        <p className="font-body text-sm text-slate-lt leading-relaxed mt-4 italic">"{note.notes}"</p>
      )}
      {note.tastedAt && (
        <p className="font-body text-xs text-slate-lt/50 mt-3">
          Tasted {new Date(note.tastedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}

function EmptyState({ icon, title, body, cta, onCta, ctaLink }) {
  return (
    <div className="text-center py-20">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="font-display font-semibold text-xl text-slate mb-2">{title}</h3>
      <p className="font-body text-sm text-slate-lt max-w-sm mx-auto mb-6">{body}</p>
      {ctaLink ? (
        <Link to={ctaLink} className="btn-primary">{cta}</Link>
      ) : (
        <button onClick={onCta} className="btn-primary">{cta}</button>
      )}
    </div>
  )
}

function AddBottleModal({ onClose }) {
  const { addBottle } = useCellar()
  const [form, setForm] = useState({
    name: '', producer: '', vintage: '', category: 'red',
    quantity: 1, purchasePrice: '', location: '', notes: '',
    purchaseSourceType: 'supermarket',
    purchaseRetailer: '',
    purchaseRetailerOther: '',
  })
  const [saved, setSaved] = useState(false)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    addBottle({ ...form, quantity: Number(form.quantity) || 1 })
    setSaved(true)
    setTimeout(onClose, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-cream flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl text-slate">Add a Bottle</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-slate-lt hover:bg-gold/20 transition-colors">
            ✕
          </button>
        </div>

        {saved ? (
          <div className="p-10 text-center">
            <span className="text-4xl mb-3 block">🥂</span>
            <p className="font-display font-semibold text-lg text-slate">Added to your cellar!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Wine Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Château Margaux"
                required
                className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Producer / House</label>
                <input
                  type="text"
                  value={form.producer}
                  onChange={e => set('producer', e.target.value)}
                  placeholder="e.g. Château Margaux"
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Vintage</label>
                <input
                  type="text"
                  value={form.vintage}
                  onChange={e => set('vintage', e.target.value)}
                  placeholder="e.g. 2018"
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                >
                  {['sparkling', 'white', 'red', 'rosé', 'dessert'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={e => set('quantity', e.target.value)}
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Purchase Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={e => set('purchasePrice', e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Storage location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Rack 3, Bin B"
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Bought via</label>
                <select
                  value={form.purchaseSourceType}
                  onChange={e => set('purchaseSourceType', e.target.value)}
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                >
                  {PURCHASE_CHANNELS.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Bought from</label>
                <select
                  value={form.purchaseRetailer}
                  onChange={e => set('purchaseRetailer', e.target.value)}
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="">Select retailer / venue</option>
                  {RETAILER_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            {form.purchaseRetailer === 'Other' && (
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Other retailer / venue</label>
                <input
                  type="text"
                  value={form.purchaseRetailerOther}
                  onChange={e => set('purchaseRetailerOther', e.target.value)}
                  placeholder="Enter store or venue name"
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            )}
            <div>
              <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
                placeholder="Any notes — occasion, gift, where purchased..."
                className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full text-base py-3">
              Add to Cellar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
