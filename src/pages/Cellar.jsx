import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCellar } from '../hooks/useCellar'
import { wines as wineDB } from '../data/wines'

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
  const [activeTab, setActiveTab] = useState('bottles')
  const [showAddModal, setShowAddModal] = useState(false)
  const { bottles, wishlist, tasted, removeBottle, removeFromWishlist, stats } = useCellar()

  // Estimated cellar value
  const cellarValue = bottles.reduce((sum, b) => {
    const price = parseFloat(b.purchasePrice) || 0
    return sum + price * (b.quantity || 1)
  }, 0)
  const hasValue = cellarValue > 0

  return (
    <div className="min-h-screen bg-ivory pt-20">

      {/* Hero */}
      <section className="bg-slate text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold/10 translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-terracotta/10 translate-y-12" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 relative">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(w => (
                  <WishlistCard key={w.id} item={w} onRemove={() => removeFromWishlist(w.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Tasted */}
        {activeTab === 'tasted' && (
          <div>
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

// ── Sub-components ──────────────────────────────────────────────

function BottleCard({ bottle, onRemove }) {
  const dbWine = wineDB.find(w => w.id === bottle.wineId)
  const cat    = bottle.category || dbWine?.category || 'red'
  const window = drinkWindowStatus(bottle)

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
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Rack 3, Bin B"
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
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
