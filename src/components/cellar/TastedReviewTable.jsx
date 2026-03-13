import { useState } from 'react'
import { Link } from 'react-router-dom'
import { wines as wineDB } from '../../data/wines'
import { CATEGORY_COLORS } from './constants'
import { StarDisplay } from './StarRating'

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Newest first' },
  { id: 'date-asc', label: 'Oldest first' },
  { id: 'rating-desc', label: 'Highest rated' },
  { id: 'buyagain-desc', label: 'Would buy again' },
]

const FILTER_PILLS = [
  { id: 'all', label: 'All' },
  { id: '4-5', label: '4-5 Stars' },
  { id: '3', label: '3 Stars' },
  { id: '1-2', label: '1-2 Stars' },
  { id: 'unrated', label: 'Unrated' },
]

function matchesFilter(note, filter) {
  const r = note.wouldBuyAgain || 0
  if (filter === 'all') return true
  if (filter === '4-5') return r >= 4
  if (filter === '3') return r === 3
  if (filter === '1-2') return r >= 1 && r <= 2
  if (filter === 'unrated') return r === 0
  return true
}

function sortNotes(notes, sortId) {
  const copy = [...notes]
  switch (sortId) {
    case 'date-asc':
      return copy.sort((a, b) => (a.tastedAt || '').localeCompare(b.tastedAt || ''))
    case 'rating-desc':
      return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'buyagain-desc':
      return copy.sort((a, b) => (b.wouldBuyAgain || 0) - (a.wouldBuyAgain || 0))
    default: // date-desc
      return copy.sort((a, b) => (b.tastedAt || '').localeCompare(a.tastedAt || ''))
  }
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TastedReviewTable({ tasted, onEdit }) {
  const [sort, setSort] = useState('date-desc')
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = sortNotes(tasted.filter(n => matchesFilter(n, filter)), sort)

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_PILLS.map(p => (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all
                ${filter === p.id
                  ? 'bg-slate text-white shadow-sm'
                  : 'bg-cream text-slate-lt hover:text-slate'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="rounded-xl border border-cream bg-white px-3 py-2 font-body text-xs text-slate focus:outline-none focus:border-gold transition-colors"
        >
          {SORT_OPTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <p className="font-body text-xs text-slate-lt">
        {filtered.length} {filtered.length === 1 ? 'wine' : 'wines'}
        {filter !== 'all' && ` (filtered from ${tasted.length})`}
      </p>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="rounded-2xl border border-cream overflow-hidden bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/50 border-b border-cream">
                <th className="text-left px-4 py-3 font-body text-xs text-slate-lt uppercase tracking-widest">Wine</th>
                <th className="text-center px-3 py-3 font-body text-xs text-slate-lt uppercase tracking-widest w-20">Vintage</th>
                <th className="text-center px-3 py-3 font-body text-xs text-slate-lt uppercase tracking-widest w-24">Type</th>
                <th className="text-center px-3 py-3 font-body text-xs text-slate-lt uppercase tracking-widest w-28">Quality</th>
                <th className="text-center px-3 py-3 font-body text-xs text-slate-lt uppercase tracking-widest w-28">Buy Again</th>
                <th className="text-center px-3 py-3 font-body text-xs text-slate-lt uppercase tracking-widest w-28">Date</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(note => {
                const dbWine = wineDB.find(w => w.id === note.wineId)
                const cat = note.category || dbWine?.category || 'red'
                const isExpanded = expandedId === note.id
                return (
                  <TableRow
                    key={note.id}
                    note={note}
                    cat={cat}
                    dbWine={dbWine}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedId(isExpanded ? null : note.id)}
                    onEdit={onEdit}
                  />
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 font-body text-sm text-slate-lt">No tasting notes match this filter.</p>
          )}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(note => {
          const dbWine = wineDB.find(w => w.id === note.wineId)
          const cat = note.category || dbWine?.category || 'red'
          const isExpanded = expandedId === note.id
          return (
            <MobileReviewCard
              key={note.id}
              note={note}
              cat={cat}
              dbWine={dbWine}
              isExpanded={isExpanded}
              onToggle={() => setExpandedId(isExpanded ? null : note.id)}
              onEdit={onEdit}
            />
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center py-8 font-body text-sm text-slate-lt">No tasting notes match this filter.</p>
        )}
      </div>
    </div>
  )
}

function StructuredTags({ note }) {
  const tags = [
    note.colour && { label: 'Colour', value: note.colour },
    note.body && { label: 'Body', value: note.body },
    note.acidity && { label: 'Acidity', value: note.acidity },
    note.tannins && { label: 'Tannins', value: note.tannins },
    note.finish && { label: 'Finish', value: note.finish },
  ].filter(Boolean)

  const hasStructured = tags.length > 0 || (note.nose && note.nose.length > 0)
  if (!hasStructured) return null

  return (
    <div className="space-y-2">
      {tags.map(t => (
        <span key={t.label} className="inline-flex items-center gap-1 mr-2">
          <span className="font-body text-xs text-slate-lt">{t.label}:</span>
          <span className="font-body text-xs font-medium text-slate bg-cream px-2 py-0.5 rounded-full">{t.value}</span>
        </span>
      ))}
      {note.nose && note.nose.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="font-body text-xs text-slate-lt self-center mr-1">Nose:</span>
          {note.nose.map(n => (
            <span key={n} className="font-body text-xs bg-cream text-slate px-2 py-0.5 rounded-full">{n}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function TableRow({ note, cat, dbWine, isExpanded, onToggle, onEdit }) {
  const noteText = note.tastingNote || note.notes || ''
  return (
    <>
      <tr
        className={`border-b border-cream/60 hover:bg-ivory/50 transition-colors cursor-pointer ${isExpanded ? 'bg-ivory/50' : ''}`}
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <p className="font-display font-semibold text-sm text-slate leading-tight">{note.name}</p>
          {note.producer && <p className="font-body text-xs text-slate-lt mt-0.5">{note.producer}</p>}
        </td>
        <td className="text-center px-3 py-3 font-body text-sm text-slate">{note.vintage || '—'}</td>
        <td className="text-center px-3 py-3">
          <span className={`tag text-xs border capitalize ${CATEGORY_COLORS[cat] || 'bg-cream border-cream text-slate-lt'}`}>
            {cat}
          </span>
        </td>
        <td className="px-3 py-3">
          <div className="flex justify-center">
            {note.rating > 0 ? <StarDisplay rating={note.rating} /> : <span className="text-xs text-slate-lt/40">—</span>}
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="flex justify-center">
            {note.wouldBuyAgain > 0 ? <StarDisplay rating={note.wouldBuyAgain} /> : <span className="text-xs text-slate-lt/40">—</span>}
          </div>
        </td>
        <td className="text-center px-3 py-3 font-body text-xs text-slate-lt whitespace-nowrap">{formatDate(note.tastedAt)}</td>
        <td className="px-2 py-3 text-center">
          <span className={`inline-block transition-transform text-slate-lt text-xs ${isExpanded ? 'rotate-90' : ''}`}>&#9654;</span>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-ivory/30">
          <td colSpan={7} className="px-4 py-4">
            <div className="space-y-3">
              <StructuredTags note={note} />
              {noteText && (
                <p className="font-body text-sm text-slate-lt leading-relaxed italic">"{noteText}"</p>
              )}
              {note.score && (
                <p className="font-body text-xs text-slate-lt">Vivino score: {note.score}/5</p>
              )}
              {!noteText && !note.score && !dbWine && !(note.colour || note.nose?.length || note.body) && (
                <p className="font-body text-xs text-slate-lt/50">No tasting note recorded.</p>
              )}
              <div className="flex items-center gap-3 pt-1">
                {onEdit && (
                  <button
                    onClick={e => { e.stopPropagation(); onEdit(note) }}
                    className="font-body text-xs text-slate-lt hover:text-slate border border-cream rounded-lg px-3 py-1.5 hover:bg-cream transition-colors"
                  >
                    Edit note
                  </button>
                )}
                {dbWine && (
                  <Link to={`/explore/${dbWine.id}`} className="font-body text-xs text-gold hover:text-gold/80 font-medium">
                    View wine details →
                  </Link>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function MobileReviewCard({ note, cat, dbWine, isExpanded, onToggle, onEdit }) {
  const noteText = note.tastingNote || note.notes || ''
  return (
    <div className="card overflow-hidden">
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-slate leading-tight">{note.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {note.producer && <span className="font-body text-xs text-slate-lt">{note.producer}</span>}
              {note.vintage && <span className="font-body text-xs text-slate-lt">{note.vintage}</span>}
            </div>
          </div>
          <span className={`tag flex-shrink-0 text-xs border capitalize ${CATEGORY_COLORS[cat] || 'bg-cream border-cream text-slate-lt'}`}>
            {cat}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          {note.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <StarDisplay rating={note.rating} size="w-3.5 h-3.5" />
              <span className="font-body text-xs text-slate-lt">Quality</span>
            </div>
          )}
          {note.wouldBuyAgain > 0 && (
            <div className="flex items-center gap-1.5">
              <StarDisplay rating={note.wouldBuyAgain} size="w-3.5 h-3.5" />
              <span className="font-body text-xs text-slate-lt">Buy again</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-body text-xs text-slate-lt/50">{formatDate(note.tastedAt)}</span>
          <span className={`inline-block transition-transform text-slate-lt text-xs ${isExpanded ? 'rotate-90' : ''}`}>&#9654;</span>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-cream space-y-3">
          <StructuredTags note={note} />
          {noteText && (
            <p className="font-body text-sm text-slate-lt leading-relaxed italic">"{noteText}"</p>
          )}
          {note.score && (
            <p className="font-body text-xs text-slate-lt">Vivino score: {note.score}/5</p>
          )}
          <div className="flex items-center gap-3 pt-0.5">
            {onEdit && (
              <button
                onClick={e => { e.stopPropagation(); onEdit(note) }}
                className="font-body text-xs text-slate-lt hover:text-slate border border-cream rounded-lg px-3 py-1.5 hover:bg-cream transition-colors"
              >
                Edit note
              </button>
            )}
            {dbWine && (
              <Link to={`/explore/${dbWine.id}`} className="font-body text-xs text-gold hover:text-gold/80 font-medium">
                View wine details →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
