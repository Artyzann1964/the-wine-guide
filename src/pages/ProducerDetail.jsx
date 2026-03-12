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

  // Aggregate taste profile
  const keys = ['sweetness', 'acidity', 'tannin', 'body', 'fruitiness']
  const avgProfile = {}
  for (const k of keys) {
    const vals = producerWines.map(w => w.tasteProfile?.[k]).filter(v => v != null)
    avgProfile[k] = vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length * 10) / 10 : 3
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/producers" className="font-body text-sm text-gold hover:underline mb-4 inline-block">&larr; All Producers</Link>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-slate">{producer}</h1>
          <p className="font-body text-slate-lt mt-1">
            {regions.join(', ')} &middot; {countries.join(', ')}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {categories.map(cat => (
              <span key={cat} className="tag border capitalize bg-cream border-cream text-slate-lt">{cat}</span>
            ))}
            <span className="tag border bg-cream border-cream text-slate-lt">{producerWines.length} wine{producerWines.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Aggregate taste profile */}
      <div className="card p-5 mb-8">
        <h3 className="font-display font-semibold text-lg text-slate mb-4">House Style</h3>
        <div className="max-w-xs mx-auto">
          <TasteProfile profile={avgProfile} />
        </div>
      </div>

      {/* Wines grid */}
      <h3 className="font-display font-semibold text-lg text-slate mb-4">Wines</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {producerWines.map(w => (
          <WineCard key={w.id} wine={w} />
        ))}
      </div>
    </div>
  )
}
