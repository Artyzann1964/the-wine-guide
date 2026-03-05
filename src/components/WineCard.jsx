import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCellar } from '../hooks/useCellar'
import { generateOurTake } from '../utils/ourTake'

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

export default function WineCard({ wine, compact = false, showPrice = false }) {
  const { isInCellar, isInWishlist, addToWishlist } = useCellar()
  const [flashed, setFlashed] = useState(false)
  const config     = CATEGORY_CONFIG[wine.category] || CATEGORY_CONFIG.red
  const inCellar   = isInCellar(wine.id)
  const onWishlist = isInWishlist(wine.id)

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
            {wine.producer} · {wine.vintage}
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
      {/* Card header / visual */}
      <div className={`${config.bg} px-5 pt-6 pb-4 relative`}>
        {/* Category badge */}
        <span className={`tag ${config.bg} border ${config.border} text-slate-lt`}>
          <span className="wine-dot" style={{ background: config.dot }} />
          {config.label}
        </span>

        {/* Status badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
          {inCellar && (
            <span className="tag bg-sage/20 border border-sage/40 text-sage text-[10px]">
              In Cellar
            </span>
          )}
          {(onWishlist || flashed) && !inCellar && (
            <span className="tag bg-gold/15 border border-gold/30 text-gold text-[10px]">
              {flashed && !onWishlist ? '✓ Added' : 'Wishlist'}
            </span>
          )}
        </div>

        {/* Wine name */}
        <h3 className="font-display font-semibold text-slate text-xl mt-3 leading-tight">
          {wine.name}
        </h3>
        <p className="font-body text-sm text-slate-lt mt-1">{wine.producer}</p>
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Region / vintage row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="font-body text-xs text-slate-lt">{wine.region}, {wine.country}</span>
          <span className="text-slate-lt/40">·</span>
          <span className="font-body text-xs font-medium text-slate">{wine.vintage}</span>
        </div>

        {/* Grapes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {wine.grapes.slice(0, 3).map(g => (
            <span key={g} className="tag bg-cream text-slate-lt text-xs">{g}</span>
          ))}
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
            {showPrice && wine.price ? wine.price : PRICE_LABEL[wine.priceRange]}
          </span>

          {/* Quick wishlist button */}
          <button
            onClick={handleWishlist}
            title={onWishlist ? 'On wishlist' : 'Add to wishlist'}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              onWishlist || flashed
                ? 'text-gold'
                : 'text-slate-lt/40 hover:text-gold hover:bg-gold/10'
            }`}
          >
            <HeartIcon filled={onWishlist || flashed} className="w-3.5 h-3.5" />
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
