import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { wines } from '../data/wines'
import { useCellar } from '../hooks/useCellar'
import TasteProfile from '../components/TasteProfile'
import { generateOurTake } from '../utils/ourTake'
import { RetailerBadge } from '../utils/retailerBrands'
import { getRecommendations } from '../utils/wineRecommendations'

const RATING_LABEL = { exceptional: '★★★ Exceptional', great: '★★ Great', good: '★ Good', average: '— Average' }
const RATING_COLOR = { exceptional: 'text-gold', great: 'text-sage', good: 'text-slate-lt', average: 'text-slate-lt/50' }
const CAT_DOT = { sparkling:'#D4AF37', white:'#C9B840', red:'#8B1A2F', rosé:'#E07090', dessert:'#C9973A' }

export default function WineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const wine = wines.find(w => w.id === id)
  const [activeTab, setActiveTab] = useState('overview')
  const [cellarModal, setCellarModal] = useState(false)
  const [wishlistDone, setWishlistDone] = useState(false)

  const { isInCellar, isInWishlist, addBottle, addToWishlist } = useCellar()

  if (!wine) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-slate mb-4">Wine not found</p>
          <Link to="/explore" className="btn-primary">Back to Explorer</Link>
        </div>
      </main>
    )
  }

  const related = getRecommendations(wine, wines, 3)

  const handleWishlist = () => {
    addToWishlist({ wineId: wine.id, name: wine.name, producer: wine.producer, vintage: wine.vintage, region: wine.region, category: wine.category })
    setWishlistDone(true)
    setTimeout(() => setWishlistDone(false), 2500)
  }

  const TABS = ['overview', 'tasting', 'pairings', 'vintages', 'buy']

  return (
    <main className="pt-16 min-h-screen">
      {/* ── HERO ─────────────────────────────── */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-body text-xs text-slate-lt mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-gold transition-colors">Explore</Link>
            <span>/</span>
            <Link to={`/explore?category=${wine.category}`} className="hover:text-gold transition-colors capitalize">{wine.category}</Link>
            <span>/</span>
            <span className="text-slate">{wine.name}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Main info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="wine-dot" style={{ background: CAT_DOT[wine.category] || '#888' }} />
                <span className="font-body text-sm text-slate-lt capitalize">{wine.category}</span>
                {wine.subcategory && (
                  <>
                    <span className="text-slate-lt/40">·</span>
                    <span className="font-body text-sm text-slate-lt capitalize">{wine.subcategory}</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-semibold text-slate leading-tight mb-2">
                {wine.name}
              </h1>
              <Link to={`/producers/${wine.producer?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="font-display text-xl text-slate-lt italic mb-4 hover:text-gold transition-colors inline-block">{wine.producer}</Link>

              <div className="flex flex-wrap items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gold fill-gold" viewBox="0 0 16 16">
                    <path d="M8 1.5l1.65 3.35L13.5 5.5l-2.75 2.68.65 3.77L8 10.15l-3.4 1.8.65-3.77L2.5 5.5l3.85-.65L8 1.5z" />
                  </svg>
                  <span className="font-body font-semibold text-lg text-slate">{wine.rating}</span>
                  <span className="font-body text-sm text-slate-lt">/100</span>
                </div>
                <span className="font-body text-sm text-slate-lt">{wine.region}, {wine.country}</span>
                <span className="font-body text-sm font-medium text-slate">{wine.vintage}</span>
                <span className="font-body text-sm text-slate-lt">{wine.price}</span>
              </div>

              {/* Grapes */}
              <div className="flex flex-wrap gap-2 mb-6">
                {wine.grapes.map(g => (
                  <span key={g} className="tag bg-cream text-slate border border-cream/80">{g}</span>
                ))}
              </div>

              <p className="font-body text-slate-lt leading-relaxed">{wine.background}</p>

              {/* Our Take */}
              <div className="mt-6 p-5 rounded-2xl bg-gold/5 border border-gold/20">
                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-gold font-medium mb-2">
                  Our Take
                </p>
                <p className="font-body text-sm text-slate italic leading-relaxed">
                  "{wine.ourTake || generateOurTake(wine)}"
                </p>
              </div>

              {/* Tom Gilby rating — only shown when wine has gilbyRating data */}
              {wine.gilbyRating && (
                <div className="mt-4 p-5 rounded-2xl bg-navy border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <a
                      href={wine.gilbyVideoUrl || 'https://www.youtube.com/@TomGilby'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-gold transition-colors"
                    >
                      Tom Gilby says ↗
                    </a>
                    <GilbyBadge rating={wine.gilbyRating} />
                  </div>
                  {wine.gilbyNote && (
                    <p className="font-body text-sm text-white/70 italic leading-relaxed">"{wine.gilbyNote}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-4">
              {/* Label image */}
              {wine.labelImage && (
                <div className="card p-5 flex justify-center">
                  <img
                    src={wine.labelImage}
                    alt={`${wine.name} label`}
                    className="max-h-40 object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}
              {/* Taste profile */}
              <div className="card p-5">
                <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-4">Tasting Profile</h3>
                <div className="flex justify-center">
                  <TasteProfile profile={wine.tasteProfile} color={CAT_DOT[wine.category]} size={160} />
                </div>
              </div>

              {/* Serving */}
              <div className="card p-5">
                <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-3">Serving</h3>
                <ul className="space-y-2 font-body text-sm">
                  <li className="flex gap-2">
                    <span className="text-gold">🌡</span>
                    <span className="text-slate-lt">Serve at <strong className="text-slate">{wine.servingTemp}</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">⏱</span>
                    <span className="text-slate-lt">
                      Decant: <strong className="text-slate">{wine.decant ? wine.decant : 'Not needed'}</strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">🍷</span>
                    <span className="text-slate-lt">{wine.glassware}</span>
                  </li>
                </ul>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCellarModal(true)}
                  disabled={isInCellar(wine.id)}
                  className={isInCellar(wine.id) ? 'btn-secondary opacity-60 cursor-default' : 'btn-primary'}
                >
                  {isInCellar(wine.id) ? '✓ In My Cellar' : '+ Add to My Cellar'}
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={isInWishlist(wine.id) || wishlistDone}
                  className="btn-secondary"
                >
                  {wishlistDone || isInWishlist(wine.id) ? '✓ On Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-8 border-b border-cream overflow-x-auto scrollbar-none">
            {TABS.map(tab => {
              const label = tab === 'buy' ? 'Buy'
                : tab === 'vintages' ? 'Vintages'
                : tab.charAt(0).toUpperCase() + tab.slice(1)
              const labelLg = tab === 'buy' ? 'Where to Buy'
                : tab === 'vintages' ? 'Vintage Guide'
                : label
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-[13px] px-3 sm:px-5 py-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? 'border-gold text-gold font-medium'
                      : 'border-transparent text-slate-lt hover:text-slate'
                  }`}
                >
                  <span className="sm:hidden">{label}</span>
                  <span className="hidden sm:inline">{labelLg}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
            <div>
              <h2 className="font-display text-3xl text-slate mb-4">Background & Terroir</h2>
              <p className="font-body text-slate-lt leading-relaxed mb-6">{wine.background}</p>
              {wine.terroir && (
                <>
                  <h3 className="font-display text-xl text-slate mb-3">The Terroir</h3>
                  <p className="font-body text-slate-lt leading-relaxed">{wine.terroir}</p>
                </>
              )}
            </div>
            <div>
              <h3 className="font-display text-xl text-slate mb-4">The Grape</h3>
              <p className="font-body text-slate-lt leading-relaxed mb-6">{wine.grapeNotes}</p>
              <div className="card p-5 bg-cream/50">
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-4">At a Glance</h4>
                <dl className="space-y-2 font-body text-sm">
                  {[
                    ['Region',    wine.subregion || wine.region],
                    ['Country',   wine.country],
                    ['Vintage',   String(wine.vintage)],
                    ['Grapes',    wine.grapes.join(', ')],
                    ['Style',     wine.style.join(', ')],
                    ['Price',     wine.price],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-slate-lt">{label}</dt>
                      <dd className="text-slate font-medium text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* TASTING */}
        {activeTab === 'tasting' && (
          <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
            <div>
              <h2 className="font-display text-3xl text-slate mb-6">Tasting Notes</h2>
              <div className="space-y-5">
                {[
                  { label: 'Colour', icon: '👁', key: 'colour' },
                  { label: 'Nose',   icon: '👃', key: 'nose' },
                  { label: 'Palate', icon: '👅', key: 'palate' },
                  { label: 'Finish', icon: '✨', key: 'finish' },
                ].map(({ label, icon, key }) => (
                  <div key={key} className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{icon}</span>
                      <span className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt">{label}</span>
                    </div>
                    <p className="font-body text-slate leading-relaxed">{wine.tastingNotes?.[key]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl text-slate mb-4">Style Tags</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {wine.style.map(s => (
                  <span key={s} className="tag bg-gold/10 border border-gold/30 text-gold capitalize">{s}</span>
                ))}
              </div>
              <h3 className="font-display text-xl text-slate mb-4">Tasting Profile</h3>
              <div className="card p-6 flex justify-center">
                <TasteProfile profile={wine.tasteProfile} color={CAT_DOT[wine.category]} size={200} />
              </div>
            </div>
          </div>
        )}

        {/* PAIRINGS */}
        {activeTab === 'pairings' && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-slate mb-2">Food Pairings</h2>
            <p className="font-body text-slate-lt mb-8">What to cook — and why it works.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wine.pairings?.map((pair, i) => (
                <div key={i} className="card p-6">
                  <h3 className="font-display text-xl font-semibold text-slate mb-2">{pair.dish}</h3>
                  {pair.cuisine && (
                    <span className="tag bg-terracotta/10 text-terracotta border border-terracotta/20 text-[10px] mb-3 capitalize">
                      {pair.cuisine}
                    </span>
                  )}
                  <p className="font-body text-sm text-slate-lt leading-relaxed">{pair.reason}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-cream/50 rounded-2xl">
              <p className="font-body text-sm text-slate-lt">
                <strong className="text-slate">Looking for more pairings?</strong>{' '}
                <Link to="/pairing" className="text-gold hover:underline">Open the full pairing wizard</Link> to explore what wines match the dishes you love to cook.
              </p>
            </div>
          </div>
        )}

        {/* VINTAGES */}
        {activeTab === 'vintages' && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-slate mb-2">Vintage Guide</h2>
            <p className="font-body text-slate-lt mb-8">How different years shape this wine.</p>
            <div className="space-y-3 max-w-2xl">
              {wine.vintageGuide?.map(v => (
                <div key={v.year} className="card p-5 flex items-start gap-4">
                  <div className="text-center w-16 flex-shrink-0">
                    <p className="font-display text-2xl font-semibold text-slate">{v.year}</p>
                  </div>
                  <div className="flex-1">
                    <span className={`font-body text-sm font-medium ${RATING_COLOR[v.rating]}`}>
                      {RATING_LABEL[v.rating]}
                    </span>
                    <p className="font-body text-sm text-slate-lt mt-1">{v.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUY */}
        {activeTab === 'buy' && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-slate mb-2">Where to Buy</h2>
            <p className="font-body text-slate-lt mb-8">Trusted sources for this wine in the UK and internationally.</p>
            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
              {wine.whereToBuy?.map((source, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <RetailerBadge name={source.name} />
                    <span className="tag bg-cream text-slate-lt text-[10px] capitalize whitespace-nowrap">{source.type}</span>
                  </div>
                  <p className="font-body text-sm text-slate-lt">{source.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-5 bg-gold/5 rounded-2xl max-w-3xl">
              <p className="font-body text-sm text-slate-lt">
                <strong className="text-slate">Tip:</strong> Use{' '}
                <span className="text-gold font-medium">Wine Searcher</span> to compare current prices across retailers worldwide, or check{' '}
                <span className="text-gold font-medium">Wine-Searcher Pro</span> for auction and fine wine specialist pricing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── RELATED WINES ────────────────────── */}
      {related.length > 0 && (
        <div className="bg-cream/30 border-t border-cream py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display text-3xl text-slate mb-6">You Might Also Like</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map(w => (
                <Link key={w.id} to={`/explore/${w.id}`} className="card p-5 group hover:-translate-y-1 transition-all duration-300">
                  <p className="section-label mb-2">{w.region}, {w.country}</p>
                  <h3 className="font-display text-xl font-semibold text-slate mb-1">{w.name}</h3>
                  <p className="font-body text-sm text-slate-lt">{w.producer}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-body font-semibold text-sm text-gold">{w.rating}</span>
                    <span className="font-body text-xs text-slate-lt">· {w.vintage}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD TO CELLAR MODAL ──────────────── */}
      {cellarModal && (
        <AddToCellarModal wine={wine} onClose={() => setCellarModal(false)} />
      )}
    </main>
  )
}

function AddToCellarModal({ wine, onClose }) {
  const { addBottle } = useCellar()
  const [form, setForm] = useState({
    name: wine.name,
    producer: wine.producer,
    vintage: String(wine.vintage),
    region: wine.region,
    country: wine.country,
    category: wine.category,
    quantity: 1,
    purchasePrice: '',
    notes: ``,
    location: '',
  })

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    addBottle({ ...form, wineId: wine.id, quantity: Number(form.quantity) || 1 })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-hover max-w-md w-full p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl text-slate">Add to Cellar</h2>
            <p className="font-body text-sm text-slate-lt mt-1">{wine.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream transition-colors text-slate-lt">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vintage" value={form.vintage} onChange={v => handle('vintage', v)} />
            <Field label="Quantity" type="number" value={form.quantity} onChange={v => handle('quantity', v)} min="1" />
          </div>
          <Field label="Purchase Price (optional)" value={form.purchasePrice} onChange={v => handle('purchasePrice', v)} placeholder="e.g. £45" />
          <Field label="Cellar Location (optional)" value={form.location} onChange={v => handle('location', v)} placeholder="e.g. Rack 2, Row 3" />
          <div>
            <label className="block font-body text-xs text-slate-lt mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => handle('notes', e.target.value)}
              rows={2}
              className="w-full font-body text-sm px-3 py-2 rounded-xl border border-cream focus:outline-none focus:border-gold resize-none"
              placeholder="Where you bought it, occasion..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add to Cellar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Tom Gilby badge ────────────────────────────────────────────────────────────
const GILBY_CONFIG = {
  class: { label: 'CLASS ✨',  bg: '#C9973A', text: '#1A1A2E', title: 'Tom\'s top pick'      },
  pass:  { label: 'PASS 👍',  bg: '#4A6741', text: '#FFFFFF', title: 'Decent, drinks well'  },
  arse:  { label: 'ARSE 💀',  bg: '#8B2040', text: '#FFFFFF', title: 'Tom says avoid it'    },
}

function GilbyBadge({ rating }) {
  const cfg = GILBY_CONFIG[rating]
  if (!cfg) return null
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-bold tracking-widest"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
      title={cfg.title}
    >
      {cfg.label}
    </span>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder = '', min }) {
  return (
    <div>
      <label className="block font-body text-xs text-slate-lt mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className="w-full font-body text-sm px-3 py-2 rounded-xl border border-cream focus:outline-none focus:border-gold"
      />
    </div>
  )
}
