import { CATEGORY_COLORS } from './constants'

const CAT_FILL = {
  sparkling: '#d97706',
  white:     '#ca8a04',
  red:       '#be123c',
  rosé:      '#db2777',
  dessert:   '#ea580c',
}

function DonutChart({ bottles }) {
  const counts = {}
  bottles.forEach(b => {
    const cat = b.category || 'red'
    counts[cat] = (counts[cat] || 0) + 1
  })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const total = bottles.length

  const radius = 60
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-32 h-32 flex-shrink-0">
        {entries.map(([cat, count]) => {
          const pct = count / total
          const dash = pct * circumference
          const gap = circumference - dash
          const currentOffset = offset
          offset += dash
          return (
            <circle
              key={cat}
              cx="80" cy="80" r={radius}
              fill="none"
              stroke={CAT_FILL[cat] || '#94a3b8'}
              strokeWidth="24"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-currentOffset}
              className="transition-all duration-500"
            />
          )
        })}
        <text x="80" y="76" textAnchor="middle" className="font-display font-bold text-2xl" fill="#1e293b">{total}</text>
        <text x="80" y="94" textAnchor="middle" className="font-body text-xs" fill="#64748b">bottles</text>
      </svg>
      <div className="space-y-1.5">
        {entries.map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CAT_FILL[cat] || '#94a3b8' }} />
            <span className="font-body text-sm text-slate capitalize">{cat}</span>
            <span className="font-body text-xs text-slate-lt ml-auto">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCards({ bottles }) {
  const rated = bottles.filter(b => b.rating > 0)
  const avgRating = rated.length > 0
    ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1)
    : null

  const priced = bottles.filter(b => parseFloat(b.purchasePrice) > 0)
  const totalValue = priced.reduce((s, b) => s + (parseFloat(b.purchasePrice) || 0) * (Number(b.quantity) || 1), 0)

  const vintages = bottles.map(b => parseInt(b.vintage)).filter(v => !isNaN(v) && v > 1900)
  const oldestVintage = vintages.length > 0 ? Math.min(...vintages) : null

  const cards = [
    avgRating && { label: 'Avg Rating', value: `${avgRating} ★`, icon: '⭐' },
    totalValue > 0 && { label: 'Total Value', value: `£${totalValue.toFixed(0)}`, icon: '💰' },
    oldestVintage && { label: 'Oldest Vintage', value: oldestVintage, icon: '🍷' },
    { label: 'Rated', value: `${rated.length}/${bottles.length}`, icon: '📝' },
  ].filter(Boolean)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl bg-cream/60 p-3 text-center">
          <span className="text-xl block mb-1">{c.icon}</span>
          <p className="font-display font-semibold text-lg text-slate">{c.value}</p>
          <p className="font-body text-xs text-slate-lt">{c.label}</p>
        </div>
      ))}
    </div>
  )
}

function AdditionsTimeline({ bottles }) {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-GB', { month: 'short' }),
    })
  }

  const countByMonth = {}
  bottles.forEach(b => {
    if (!b.addedAt) return
    const m = b.addedAt.slice(0, 7) // YYYY-MM
    countByMonth[m] = (countByMonth[m] || 0) + 1
  })

  const values = months.map(m => countByMonth[m.key] || 0)
  const maxVal = Math.max(...values, 1)

  return (
    <div>
      <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-3">Last 6 months</p>
      <div className="flex items-end gap-2 h-24">
        {months.map((m, i) => {
          const pct = (values[i] / maxVal) * 100
          return (
            <div key={m.key} className="flex-1 flex flex-col items-center gap-1">
              {values[i] > 0 && (
                <span className="font-body text-xs text-slate font-semibold">{values[i]}</span>
              )}
              <div
                className="w-full rounded-t-lg bg-gold/70 transition-all duration-500"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
              <span className="font-body text-[10px] text-slate-lt">{m.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CellarStatsDashboard({ bottles }) {
  if (!bottles || bottles.length === 0) return null

  return (
    <div className="card p-5 space-y-6 mb-6">
      <h3 className="font-display font-semibold text-lg text-slate">Cellar Overview</h3>
      <SummaryCards bottles={bottles} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DonutChart bottles={bottles} />
        <AdditionsTimeline bottles={bottles} />
      </div>
    </div>
  )
}
