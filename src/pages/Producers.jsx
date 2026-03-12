import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { wines } from '../data/wines'

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Producers() {
  const [search, setSearch] = useState('')

  const producers = useMemo(() => {
    const map = {}
    wines.forEach(w => {
      if (!w.producer) return
      if (!map[w.producer]) {
        map[w.producer] = { name: w.producer, slug: slugify(w.producer), wines: [], categories: new Set(), regions: new Set() }
      }
      map[w.producer].wines.push(w)
      if (w.category) map[w.producer].categories.add(w.category)
      if (w.region) map[w.producer].regions.add(w.region)
    })
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const filtered = producers.filter(p => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) ||
      [...p.regions].some(r => r.toLowerCase().includes(q)) ||
      [...p.categories].some(c => c.toLowerCase().includes(q))
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-slate mb-2">Producers</h1>
      <p className="font-body text-slate-lt mb-6">{producers.length} producers in our collection</p>

      <div className="relative mb-8 max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search producers, regions, categories..."
          className="w-full rounded-xl border border-cream bg-ivory pl-10 pr-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Link
            key={p.slug}
            to={`/producers/${p.slug}`}
            className="card p-5 hover:shadow-lg transition-shadow group"
          >
            <h3 className="font-display font-semibold text-lg text-slate group-hover:text-gold transition-colors">{p.name}</h3>
            <p className="font-body text-xs text-slate-lt mt-1">
              {p.wines.length} wine{p.wines.length !== 1 ? 's' : ''} &middot; {[...p.regions].join(', ')}
            </p>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {[...p.categories].map(cat => (
                <span key={cat} className="font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream text-slate-lt capitalize">{cat}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-slate-lt">No producers match "{search}"</p>
          <button onClick={() => setSearch('')} className="btn-ghost text-sm mt-3">Clear search</button>
        </div>
      )}
    </div>
  )
}
