import { Link } from 'react-router-dom'
import { wines as wineDB } from '../../data/wines'
import { CATEGORY_COLORS } from './constants'

export default function WishlistCard({ item, onRemove }) {
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
