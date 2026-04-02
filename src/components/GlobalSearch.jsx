import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

const SEARCH_SHORTCUTS = [
  'Champagne',
  'Barolo',
  'Chablis',
  'Rioja',
  'Marlborough',
  'Riesling',
]

const SEARCH_EXPLORE_LINKS = [
  { label: 'Sparkling', to: '/sparkling' },
  { label: 'Critics', to: '/critics' },
  { label: 'Pairings', to: '/pairing' },
]

const SEARCH_LANES = [
  {
    label: 'Explore bottles',
    to: '/explore',
    description: 'Scan the full guide by country, style, or retailer.',
  },
  {
    label: 'Start with dinner',
    to: '/pairing',
    description: 'Jump straight into food-led bottle matching.',
  },
  {
    label: 'Browse places',
    to: '/places',
    description: 'Move from venue ideas into better glasses and lists.',
  },
  {
    label: 'Learn sparkling',
    to: '/sparkling',
    description: 'Open the bubbles guide when you want something celebratory.',
  },
]

const SEARCH_STATS = {
  wines: wines.length,
  countries: new Set(wines.map(w => w.country).filter(Boolean)).size,
  producers: new Set(wines.map(w => w.producer).filter(Boolean)).size,
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef(null)
  const routeRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const topResult = results[0] || null

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
      routeRef.current = `${location.pathname}${location.search}`
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, location.pathname, location.search])

  useEffect(() => {
    if (!open) return
    const nextRoute = `${location.pathname}${location.search}`
    if (routeRef.current && routeRef.current !== nextRoute) {
      onClose()
    }
    routeRef.current = nextRoute
  }, [open, location.pathname, location.search, onClose])

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
        <div className="px-4 pt-4 pb-2 border-b border-cream/70 bg-gradient-to-b from-ivory to-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label mb-1">Search The Guide</p>
              <p className="font-body text-sm text-slate-lt">
                Find bottles by producer, region, grape, or style.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-cream bg-white text-slate-lt hover:text-slate hover:border-gold/35 transition-colors flex items-center justify-center"
              aria-label="Close search"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

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
          <>
            <div className="px-4 py-3 border-b border-cream/60 bg-ivory/60">
              <p className="font-body text-xs text-slate-lt mb-2">
                {results.length} match{results.length !== 1 ? 'es' : ''} {topResult ? `· best match: ${topResult.name}` : ''}
              </p>
              {topResult && (
                <button
                  onClick={() => goToWine(topResult.id)}
                  className="w-full rounded-2xl border border-cream bg-white px-4 py-3 text-left hover:border-gold/35 transition-colors"
                >
                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate-lt/60 mb-1">Top result</p>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl text-slate leading-tight truncate">{topResult.name}</p>
                      <p className="font-body text-sm text-slate-lt mt-1 truncate">
                        {[topResult.producer, topResult.region, topResult.country].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span className={`tag text-xs flex-shrink-0 capitalize ${CATEGORY_COLORS[topResult.category] || 'bg-cream text-slate-lt'}`}>
                      {topResult.category || 'wine'}
                    </span>
                  </div>
                </button>
              )}
            </div>
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
            <div className="px-4 py-3 border-t border-cream/60 bg-white">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/explore')
                    onClose()
                  }}
                  className="chip bg-white text-slate border border-cream hover:border-gold/45"
                >
                  Open Explorer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/pairing')
                    onClose()
                  }}
                  className="chip bg-cream text-slate-lt hover:bg-gold/15 hover:text-slate"
                >
                  Start with pairings
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center space-y-4">
            <div>
              <p className="font-body text-sm text-slate-lt">No wines found for "{query}"</p>
              <p className="font-body text-xs text-slate-lt/60 mt-1">Try a producer name, grape variety, or region</p>
            </div>
            <div className="rounded-2xl border border-cream bg-ivory/70 px-4 py-4 text-left">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate-lt/60 mb-2">Try instead</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {SEARCH_SHORTCUTS.slice(0, 4).map(shortcut => (
                  <button
                    key={shortcut}
                    type="button"
                    onClick={() => setQuery(shortcut)}
                    className="chip bg-white text-slate border border-cream hover:border-gold/45"
                  >
                    {shortcut}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {SEARCH_EXPLORE_LINKS.map(link => (
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => {
                      navigate(link.to)
                      onClose()
                    }}
                    className="chip bg-cream text-slate-lt hover:bg-gold/15 hover:text-slate"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    navigate('/explore')
                    onClose()
                  }}
                  className="chip bg-white text-slate border border-cream hover:border-gold/45"
                >
                  Explorer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No query hint */}
        {!query && (
          <div className="px-4 py-4 border-t border-cream/50 space-y-4">
            <div className="rounded-2xl border border-cream bg-ivory/70 px-4 py-4">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate-lt/60 mb-2">Search snapshot</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Wines', SEARCH_STATS.wines],
                  ['Countries', SEARCH_STATS.countries],
                  ['Producers', SEARCH_STATS.producers],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white px-3 py-3 text-center border border-cream/70">
                    <p className="font-display text-2xl text-slate leading-none">{value}</p>
                    <p className="font-body text-[11px] uppercase tracking-[0.14em] text-slate-lt/60 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.16em] uppercase text-slate-lt/60 mb-2">Quick starts</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SHORTCUTS.map(shortcut => (
                  <button
                    key={shortcut}
                    type="button"
                    onClick={() => setQuery(shortcut)}
                    className="chip bg-cream text-slate-lt hover:bg-gold/15 hover:text-slate"
                  >
                    {shortcut}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.16em] uppercase text-slate-lt/60 mb-2">Guide lanes</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SEARCH_LANES.map(lane => (
                  <button
                    key={lane.to}
                    type="button"
                    onClick={() => {
                      navigate(lane.to)
                      onClose()
                    }}
                    className="rounded-2xl border border-cream bg-white px-4 py-3 text-left hover:border-gold/35 hover:bg-ivory/80 transition-colors"
                  >
                    <p className="font-display text-xl text-slate">{lane.label}</p>
                    <p className="font-body text-sm text-slate-lt mt-1">{lane.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.16em] uppercase text-slate-lt/60 mb-2">Jump to</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_EXPLORE_LINKS.map(link => (
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => {
                      navigate(link.to)
                      onClose()
                    }}
                    className="chip bg-white text-slate border border-cream hover:border-gold/45"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="font-body text-xs text-slate-lt/70 text-center">
              Search across {SEARCH_STATS.wines} wines · navigate with ↑↓ · open with ↵
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
