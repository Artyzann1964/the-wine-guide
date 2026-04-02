import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCellar } from '../hooks/useCellar'
import { generateOurTake } from '../utils/ourTake'
import { getWineVisual, getWineVisualTreatment } from '../utils/wineVisuals'
import { getWineVintageLabel } from '../utils/wineDisplay'

const CATEGORY_CONFIG = {
  sparkling: { dot: '#D4AF37', label: 'Sparkling', bg: 'bg-amber-50',   border: 'border-amber-200' },
  white:     { dot: '#C9B840', label: 'White',     bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  red:       { dot: '#8B1A2F', label: 'Red',       bg: 'bg-rose-50',    border: 'border-rose-200' },
  rosé:      { dot: '#E07090', label: 'Rosé',      bg: 'bg-pink-50',    border: 'border-pink-200' },
  dessert:   { dot: '#C9973A', label: 'Dessert',   bg: 'bg-orange-50',  border: 'border-orange-200' },
}

const PRICE_LABEL = {
  budget:  '£',
  mid:     '££',
  premium: '£££',
  luxury:  '££££',
}

// Dark, bottle-inspired backgrounds — used for all cards so they always look rich,
// even for wines whose cardGradient is a Tailwind class string (invalid in style={})
const BOTTLE_BG = {
  red:       'linear-gradient(150deg, #4A1020 0%, #6B1F2E 60%, #7A2238 100%)',
  white:     'linear-gradient(150deg, #1E3A2A 0%, #2D5040 60%, #3A6050 100%)',
  sparkling: 'linear-gradient(150deg, #2C2208 0%, #4A3A10 60%, #6B5518 100%)',
  rosé:      'linear-gradient(150deg, #4A1525 0%, #7B2D3E 60%, #8B3548 100%)',
  dessert:   'linear-gradient(150deg, #3A1E05 0%, #6B3A10 60%, #7A4518 100%)',
}

const FALLBACK_BG = 'linear-gradient(150deg, #1A1A2E 0%, #2C2C3E 100%)'

// Always use the category bottle background for consistent, rich card headers.
// Individual cardGradient values are unreliable (72 wines have invalid Tailwind class
// strings; many CSS gradient values are light pastels that clash with the white label).
function resolveBackground(wine) {
  return BOTTLE_BG[wine.category] || FALLBACK_BG
}

export default function WineCard({ wine, compact = false, showPrice = false }) {
  const { isInCellar, isInWishlist, addToWishlist } = useCellar()
  const [flashed, setFlashed] = useState(false)
  const config     = CATEGORY_CONFIG[wine.category] || CATEGORY_CONFIG.red
  const inCellar   = isInCellar(wine.id)
  const onWishlist = isInWishlist(wine.id)
  const bgStyle    = resolveBackground(wine)
  const wineVisual = getWineVisual(wine)
  const visualTreatment = getWineVisualTreatment(wine)
  const leadPairing = wine.pairings?.[0]
  const pairingLabel = typeof leadPairing === 'string' ? leadPairing : leadPairing?.dish
  const originLabel = [wine.subregion, wine.region, wine.country].filter(Boolean).join(' · ')
  const vintageLabel = getWineVintageLabel(wine)

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onWishlist || flashed) return
    addToWishlist({
      wineId: wine.id, name: wine.name, producer: wine.producer,
      vintage: wine.vintage, region: wine.region, category: wine.category,
    })
    setFlashed(true)
    setTimeout(() => setFlashed(false), 2000)
  }

  if (compact) {
    return (
      <Link to={`/explore/${wine.id}`} className="card flex items-center gap-4 p-4 group">
        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
          <span className="wine-dot" style={{ background: config.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-slate text-base leading-tight truncate">
            {wine.name}
          </p>
          <p className="font-body text-xs text-slate-lt mt-0.5 truncate">
            {[wine.producer, vintageLabel].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span className="font-body text-xs font-medium text-gold">{wine.rating}</span>
      </Link>
    )
  }

  return (
    <Link
      to={`/explore/${wine.id}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300"
    >
      {/* Card header — dark bottle background + label insert */}
      <div className="px-4 pt-4 pb-4 relative" style={{ background: bgStyle }}>

        {/* Top row: category badge + status badges */}
        <div className="flex items-start justify-between mb-3">
          <span className="tag bg-white/10 border border-white/20 text-white/70 text-[10px]">
            <span className="wine-dot" style={{ background: config.dot }} />
            {config.label}
          </span>
          <div className="flex flex-col gap-1 items-end">
            {inCellar && (
              <span className="tag bg-white/20 border border-white/30 text-white text-[10px]">
                In Cellar
              </span>
            )}
            {(onWishlist || flashed) && !inCellar && (
              <span className="tag bg-gold/30 border border-gold/50 text-gold text-[10px]">
                {flashed && !onWishlist ? '✓ Added' : 'Wishlist'}
              </span>
            )}
          </div>
        </div>

        {/* Wine label */}
        <div className="rounded-xl px-4 pt-2.5 pb-3 text-center shadow-md relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)' }}>
          {wineVisual && (
            <img
              src={wineVisual.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
              loading="lazy"
            />
          )}
          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <p className="font-body text-[9px] tracking-[0.18em] uppercase text-slate-lt truncate text-left">
                {[wine.country, wine.region, vintageLabel].filter(Boolean).join(' · ')}
              </p>
              {wineVisual && (
                <span className="rounded-full bg-slate/5 px-2 py-0.5 font-body text-[8px] uppercase tracking-[0.18em] text-slate-lt/80 border border-slate/10 whitespace-nowrap">
                  {visualTreatment.shortBadge}
                </span>
              )}
            </div>
            <h3 className="font-display font-semibold text-slate text-[15px] leading-snug mt-1 line-clamp-2">
              {wine.name}
            </h3>
            <p className="font-body text-[10px] text-slate-lt mt-0.5 truncate">{wine.producer}</p>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="rounded-2xl bg-[#fbf7ee] border border-cream/80 px-3.5 py-3 mb-3">
          <p className="font-body text-[9px] tracking-[0.16em] uppercase text-slate-lt/70">Origin</p>
          <p className="font-body text-xs text-slate mt-1 leading-relaxed line-clamp-2">{originLabel}</p>
        </div>

        {/* Grapes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {wine.grapes.slice(0, 2).map(g => (
            <span key={g} className="tag bg-cream text-slate-lt text-xs">{g}</span>
          ))}
          {wine.grapes.length > 2 && (
            <span className="tag bg-cream/50 text-slate-lt/60 text-xs">+{wine.grapes.length - 2}</span>
          )}
        </div>

        {/* Pairing chips */}
        {wine.pairings?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {wine.pairings.slice(0, 2).map((p, i) => (
              <span key={i} className="tag bg-sage/10 border border-sage/20 text-sage text-[10px]">
                {typeof p === 'string' ? p : p.dish}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4 rounded-2xl border border-cream/80 bg-white px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-body text-[9px] tracking-[0.16em] uppercase text-slate-lt/70">Guide cue</p>
            {wineVisual && (
              <span className="font-body text-[9px] uppercase tracking-[0.16em] text-gold">{visualTreatment.shortBadge}</span>
            )}
          </div>
          <p className="font-body text-xs text-slate mt-1 leading-relaxed line-clamp-2">
            {pairingLabel ? `Start with ${pairingLabel}.` : 'A strong candidate for a closer look in the guide.'} {visualTreatment.summary}
          </p>
        </div>

        {/* Our Take */}
        <p className="font-body text-xs text-slate-lt italic leading-relaxed line-clamp-2 mb-4 flex-1">
          "{wine.ourTake || generateOurTake(wine)}"
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-cream">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <StarIcon className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="font-body font-semibold text-sm text-slate">{wine.rating}</span>
          </div>

          {/* Price */}
          <span className="font-body text-xs text-slate-lt">
            {showPrice && wine.price ? wine.price : (PRICE_LABEL[wine.priceRange] || '–')}
          </span>

          {/* Quick wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={onWishlist ? 'On wishlist' : 'Add to wishlist'}
            aria-pressed={onWishlist || flashed}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${
              onWishlist || flashed
                ? 'text-gold bg-gold/10 border border-gold/30'
                : 'text-slate-lt/50 hover:text-gold hover:bg-gold/10 hover:border-gold/20 border border-transparent'
            }`}
          >
            <HeartIcon filled={onWishlist || flashed} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}

function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16">
      <path d="M8 1.5l1.65 3.35L13.5 5.5l-2.75 2.68.65 3.77L8 10.15l-3.4 1.8.65-3.77L2.5 5.5l3.85-.65L8 1.5z" />
    </svg>
  )
}

function HeartIcon({ filled, className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8 3.27 3.5 3.5 0 0 1 14 5.5C14 9.5 8 13.5 8 13.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
