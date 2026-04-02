import { useParams, Link } from 'react-router-dom'
import { wines } from '../data/wines'
import WineCard from '../components/WineCard'
import TasteProfile from '../components/TasteProfile'

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProducerDetail() {
  const { slug } = useParams()

  const producerWines = wines.filter(w => w.producer && slugify(w.producer) === slug)
  if (producerWines.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl text-slate mb-4">Producer not found</p>
        <Link to="/producers" className="btn-ghost">Back to Producers</Link>
      </div>
    )
  }

  const producer = producerWines[0].producer
  const regions = [...new Set(producerWines.map(w => w.region).filter(Boolean))]
  const countries = [...new Set(producerWines.map(w => w.country).filter(Boolean))]
  const categories = [...new Set(producerWines.map(w => w.category).filter(Boolean))]
  const topRated = [...producerWines].sort((a, b) => b.rating - a.rating)[0]
  const latestVintage = [...producerWines]
    .map(w => Number(w.vintage))
    .filter(v => Number.isFinite(v))
    .sort((a, b) => b - a)[0]

  // Aggregate taste profile
  const keys = ['sweetness', 'acidity', 'tannin', 'body', 'fruitiness']
  const avgProfile = {}
  for (const k of keys) {
    const vals = producerWines.map(w => w.tasteProfile?.[k]).filter(v => v != null)
    avgProfile[k] = vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length * 10) / 10 : 3
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <Link to="/producers" className="font-body text-sm text-gold hover:underline mb-4 inline-block">&larr; All Producers</Link>

        <section className="rounded-[2.2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f2eadb] px-6 py-8 lg:px-8 lg:py-10 mb-8">
          <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
            <div>
              <p className="section-label mb-2">Producer Profile</p>
              <h1 className="font-display text-4xl lg:text-5xl text-slate leading-[1.04]">{producer}</h1>
              <p className="font-body text-slate-lt mt-3 leading-relaxed">
                {regions.join(', ')} · {countries.join(', ')}
              </p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {categories.map(cat => (
                  <span key={cat} className="tag border capitalize bg-white border-cream text-slate-lt">{cat}</span>
                ))}
                <span className="tag border bg-white border-cream text-slate-lt">{producerWines.length} wine{producerWines.length !== 1 ? 's' : ''}</span>
              </div>
              {topRated && (
                <div className="mt-5 rounded-[1.7rem] border border-cream bg-white px-5 py-4">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Start here</p>
                  <p className="font-body text-sm text-slate leading-relaxed">
                    Begin with <Link to={`/explore/${topRated.id}`} className="text-gold hover:underline">{topRated.name}</Link>, currently the highest-rated bottle for this producer in the guide.
                  </p>
                </div>
              )}
            </div>

            <div className="surface-panel p-5">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-slate-lt mb-3">House Snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Bottles', value: producerWines.length },
                  { label: 'Regions', value: regions.length },
                  { label: 'Countries', value: countries.length },
                  { label: 'Latest vintage', value: latestVintage || 'Mixed' },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-slate-lt mt-3">
                Use the house style wheel below as a quick average across this producer’s current bottles in the guide.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-6 items-start mb-8">
          <div className="card p-6">
            <h3 className="font-display font-semibold text-2xl text-slate mb-2">House Style</h3>
            <p className="font-body text-sm text-slate-lt mb-5">
              An average taste-profile read across the producer’s current wines.
            </p>
            <div className="max-w-xs mx-auto">
              <TasteProfile profile={avgProfile} />
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
              <div>
                <p className="section-label mb-1">Bottle Range</p>
                <h2 className="font-display text-3xl text-slate">Wines in the guide</h2>
              </div>
              <p className="font-body text-sm text-slate-lt max-w-2xl">
                Browse the current selection for this producer, from benchmark bottles to more approachable entry points.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-[1.4rem] border border-cream bg-[#fbf7ee] px-4 py-4">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/70">Lead region</p>
                <p className="font-body text-sm text-slate mt-2">{regions[0] || 'Mixed'}</p>
              </div>
              <div className="rounded-[1.4rem] border border-cream bg-[#fbf7ee] px-4 py-4">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/70">Top-rated bottle</p>
                <p className="font-body text-sm text-slate mt-2">{topRated ? `${topRated.rating}/100` : 'Guide pick'}</p>
              </div>
              <div className="rounded-[1.4rem] border border-cream bg-[#fbf7ee] px-4 py-4">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/70">Categories</p>
                <p className="font-body text-sm text-slate mt-2 capitalize">{categories.join(' · ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {producerWines.map(w => (
            <WineCard key={w.id} wine={w} />
          ))}
        </div>
      </div>
    </main>
  )
}
