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
      const slug = slugify(w.producer)
      if (!map[slug]) {
        map[slug] = { name: w.producer, slug, wines: [], categories: new Set(), regions: new Set() }
      }
      map[slug].wines.push(w)
      if (w.category) map[slug].categories.add(w.category)
      if (w.region) map[slug].regions.add(w.region)
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

  const featuredRegions = useMemo(() => {
    const counts = new Map()
    producers.forEach(producer => {
      producer.regions.forEach(region => {
        counts.set(region, (counts.get(region) || 0) + 1)
      })
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([region]) => region)
  }, [producers])

  const featuredProducers = filtered.slice(0, 3)

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <section className="rounded-[2.2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f2eadb] px-6 py-8 lg:px-8 lg:py-10 mb-8">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
            <div>
              <p className="section-label mb-2">Producer Guide</p>
              <h1 className="font-display text-4xl lg:text-5xl text-slate leading-[1.04] mb-3">
                Browse the names
                <span className="block text-gold">behind the bottles.</span>
              </h1>
              <p className="font-body text-slate-lt max-w-2xl leading-relaxed">
                Explore the producers in the guide by house, region, or style, then jump into their full bottle list.
              </p>
              <div className="relative mt-6 max-w-xl">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search producers, regions, categories..."
                  className="w-full rounded-xl border border-cream bg-white pl-10 pr-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredRegions.map(region => (
                  <span key={region} className="tag bg-white border border-cream text-slate text-[10px]">
                    {region}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-panel p-4 lg:p-5">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-slate-lt mb-3">Collection Snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Producers', value: producers.length },
                  { label: 'Filtered', value: filtered.length },
                  { label: 'Regions', value: featuredRegions.length },
                  { label: 'Search', value: search.trim() ? 'Active' : 'Open' },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-slate-lt mt-3">
                Start with a familiar house or a region you trust, then use the producer page to compare their range.
              </p>
            </div>
          </div>
        </section>

        {featuredProducers.length > 0 && (
          <section className="surface-panel p-5 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
              <div>
                <p className="section-label mb-1">Quick Start</p>
                <h2 className="font-display text-3xl text-slate">Good producer entry points</h2>
              </div>
              <p className="font-body text-sm text-slate-lt max-w-2xl">
                A few houses to open first from the current filtered list, chosen alphabetically so the page feels browseable rather than ranked.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredProducers.map(producer => (
                <Link
                  key={producer.slug}
                  to={`/producers/${producer.slug}`}
                  className="rounded-[1.6rem] border border-cream bg-gradient-to-br from-white to-[#f5efe4] p-5 hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">
                    {[...producer.categories][0] || 'Producer'}
                  </p>
                  <h3 className="font-display text-2xl text-slate leading-tight">{producer.name}</h3>
                  <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">
                    {[...producer.regions].slice(0, 2).join(' · ')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="tag bg-white border border-cream text-slate text-[10px]">
                      {producer.wines.length} wine{producer.wines.length !== 1 ? 's' : ''}
                    </span>
                    <span className="tag bg-[#fbf7ee] border border-cream text-slate text-[10px]">
                      {[...producer.categories].join(' · ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Link
              key={p.slug}
              to={`/producers/${p.slug}`}
              className="card p-5 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-lg text-slate group-hover:text-gold transition-colors">{p.name}</h3>
                  <p className="font-body text-xs text-slate-lt mt-1 leading-relaxed">
                    {p.wines.length} wine{p.wines.length !== 1 ? 's' : ''} · {[...p.regions].slice(0, 2).join(', ')}
                  </p>
                </div>
                <span className="tag bg-gold/10 border border-gold/25 text-gold text-[10px]">
                  {p.wines.length}
                </span>
              </div>
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {[...p.categories].map(cat => (
                  <span key={cat} className="font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream text-slate-lt capitalize">{cat}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[2rem] border border-cream bg-gradient-to-br from-white to-[#f5efe4] px-6 py-14 text-center mt-6">
            <p className="section-label mb-2">No exact matches</p>
            <p className="font-display text-3xl text-slate mb-3">No producers match “{search}”</p>
            <p className="font-body text-sm text-slate-lt max-w-xl mx-auto leading-relaxed">
              Try a broader house name, a region, or a category like sparkling, red, or white.
            </p>
            <button onClick={() => setSearch('')} className="btn-primary text-sm mt-5">Clear search</button>
          </div>
        )}
      </div>
    </main>
  )
}
