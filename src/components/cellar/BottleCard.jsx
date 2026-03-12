import { Link } from 'react-router-dom'
import { wines as wineDB } from '../../data/wines'
import { CATEGORY_COLORS, PURCHASE_CHANNELS, drinkWindowStatus } from './constants'
import { StarDisplay } from './StarRating'

export default function BottleCard({ bottle, onMarkTasted, onRemove }) {
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

      {/* Rating */}
      {bottle.rating > 0 && (
        <div className="flex items-center gap-2">
          <StarDisplay rating={bottle.rating} />
          <span className="font-body text-xs text-slate-lt">My rating</span>
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

      <div className="flex gap-2 mt-auto pt-2 flex-wrap">
        {dbWine && (
          <Link to={`/explore/${dbWine.id}`} className="btn-ghost text-xs flex-1 text-center">
            View Wine
          </Link>
        )}
        <button
          onClick={onMarkTasted}
          className="btn-secondary text-xs flex-1"
        >
          Mark Tasted
        </button>
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
