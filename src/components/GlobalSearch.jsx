import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { wines } from '../data/wines'

// Pre-process wines for fast search
const SEARCH_INDEX = wines.map(w => ({
  id: w.id,
  name: w.name,
  producer: w.producer || '',
  region: w.region || '',
  country: w.country || '',
  category: w.category || '',
  grapes: Array.isArray(w.grapes) ? w.grapes.join(' ') : '',
  searchText: [w.name, w.producer, w.region, w.country, w.category, ...(Array.isArray(w.grapes) ? w.grapes : [])]
    .filter(Boolean).join(' ').toLowerCase(),
}))

function scoreMatch(item, query) {
  const q = query.toLowerCase().trim()
  if (!q) return 0
  const name = item.name.toLowerCase()
  const producer = item.producer.toLowerCase()
  // Exact name start gets highest priority
  if (name.startsWith(q)) return 100
  if (producer.startsWith(q)) return 80
  if (name.includes(q)) return 60
  if (producer.includes(q)) return 50
  if (item.searchText.includes(q)) return 30
  // Multi-word: all tokens present
  const tokens = q.split(/\s+/).filter(Boolean)
  if (tokens.length > 1 && tokens.every(t => item.searchText.includes(t))) return 20
  return 0
}

function search(query, limit = 8) {
  if (!query.trim()) return []
  return SEARCH_INDEX
    .map(item => ({ item, score: scoreMatch(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item)
}

const CATEGORY_COLORS = {
  red:      'bg-rose-50 text-rose-700',
  white:    'bg-yellow-50 text-yellow-700',
  sparkling:'bg-amber-50 text-amber-700',
  rosé:     'bg-pink-50 text-pink-700',
  dessert:  'bg-orange-50 text-orange-700',
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Update results as query changes
  useEffect(() => {
    const r = search(query)
    setResults(r)
    setSelectedIdx(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const goToWine = useCallback((wineId) => {
    navigate(`/explore/${wineId}`)
    onClose()
  }, [navigate, onClose])

  const handleKeyDown = useCallback((e) => {
    if (!open) return
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[selectedIdx]) goToWine(results[selectedIdx].id)
    }
  }, [open, results, selectedIdx, goToWine, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cream">
          <svg className="w-5 h-5 text-slate-lt flex-shrink-0" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search wines, producers, regions…"
            className="flex-1 font-body text-base text-slate placeholder-slate-lt/60 outline-none bg-transparent"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-lt hover:text-slate transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:flex font-body text-xs text-slate-lt border border-cream rounded px-1.5 py-0.5 ml-1">
            Esc
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-96 overflow-y-auto">
            {results.map((wine, idx) => (
              <li key={wine.id}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    idx === selectedIdx ? 'bg-cream' : 'hover:bg-cream/60'
                  }`}
                  onClick={() => goToWine(wine.id)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-slate truncate">{wine.name}</p>
                    <p className="font-body text-xs text-slate-lt truncate mt-0.5">
                      {[wine.producer, wine.region, wine.country].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <span className={`tag text-xs flex-shrink-0 capitalize ${CATEGORY_COLORS[wine.category] || 'bg-cream text-slate-lt'}`}>
                    {wine.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="font-body text-sm text-slate-lt">No wines found for "{query}"</p>
            <p className="font-body text-xs text-slate-lt/60 mt-1">Try a producer name, grape variety, or region</p>
          </div>
        )}

        {/* No query hint */}
        {!query && (
          <div className="px-4 py-4 border-t border-cream/50">
            <p className="font-body text-xs text-slate-lt/70 text-center">
              Search across {wines.length} wines · navigate with ↑↓ · open with ↵
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
