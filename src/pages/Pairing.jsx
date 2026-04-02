import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cuisines } from '../data/pairings'
import { wines } from '../data/wines'
import WineCard from '../components/WineCard'

const CUISINE_ICONS = {
  french: '🇫🇷', italian: '🇮🇹', spanish: '🇪🇸', british: '🇬🇧',
  seafood: '🦞', asian: '🥢', vegetarian: '🥦', cheese: '🧀',
  indian: '🇮🇳', 'middle-eastern': '🥙', bbq: '🔥', mexican: '🌮',
}

export default function Pairing() {
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [selectedDish, setSelectedDish] = useState(null)

  const cuisine = useMemo(
    () => cuisines.find(c => c.id === selectedCuisine),
    [selectedCuisine]
  )

  const dish = useMemo(
    () => cuisine?.dishes.find(d => d.id === selectedDish),
    [cuisine, selectedDish]
  )

  const matchedWines = useMemo(() => {
    if (!dish?.wineIds?.length) return []
    return dish.wineIds.map(id => wines.find(w => w.id === id)).filter(Boolean)
  }, [dish])

  const totalDishCount = useMemo(
    () => cuisines.reduce((count, cuisine) => count + cuisine.dishes.length, 0),
    []
  )
  const nextStepLabel = selectedCuisine ? (selectedDish ? 'See the bottle shortlist' : 'Pick a dish') : 'Choose a cuisine'

  function handleCuisineSelect(id) {
    setSelectedCuisine(id)
    setSelectedDish(null)
  }

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="hero-mesh text-white overflow-hidden relative pt-24 lg:pt-28 pb-16 border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-terracotta/10 -translate-x-16 translate-y-16" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <div className="grid xl:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
            <div>
              <p className="section-label text-gold/70 mb-3">Food &amp; Wine</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
                The Pairing Wizard
              </h1>
              <p className="font-body text-lg text-white/60 max-w-2xl">
                Tell us what you're cooking and we’ll find the bottle styles that make the dish sing. Good pairings are not magic, they are chemistry, texture, and balance.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="tag bg-white/10 border border-white/15 text-white/75 text-[10px]">
                  {cuisines.length} cuisines
                </span>
                <span className="tag bg-white/10 border border-white/15 text-white/75 text-[10px]">
                  {totalDishCount} dishes
                </span>
                <span className="tag bg-gold/20 border border-gold/30 text-gold-lt text-[10px]">
                  Next: {nextStepLabel}
                </span>
              </div>
            </div>

            <div className="surface-panel p-4 lg:p-5">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-slate-lt mb-3">Pairing Snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Cuisine', value: cuisine?.label || 'Choose' },
                  { label: 'Dish', value: dish?.label || 'Pick' },
                  { label: 'Matches', value: matchedWines.length || 0 },
                  { label: 'Mode', value: dish ? 'Ready' : 'Browsing' },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-2xl lg:text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-slate-lt mt-3">
                Start broad with cuisine, narrow to a dish, then use the bottle grid as your shortlist rather than a rigid rulebook.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

        {/* Step 1 — Cuisine */}
        <div className="surface-panel p-5 lg:p-6 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-7 h-7 rounded-full bg-gold text-white font-body text-sm font-semibold flex items-center justify-center flex-shrink-0">1</span>
            <div>
              <h2 className="font-display font-semibold text-2xl text-slate">What are you cooking?</h2>
              <p className="font-body text-sm text-slate-lt mt-1">Choose the broad cuisine family first, then we’ll narrow to the dish itself.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {cuisines.map(c => (
              <button
                key={c.id}
                onClick={() => handleCuisineSelect(c.id)}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all duration-200
                  ${selectedCuisine === c.id
                    ? 'border-gold bg-gold/10 shadow-gold'
                    : 'border-cream bg-white hover:border-gold/40 hover:shadow-card'
                  }`}
              >
                <span className="text-2xl">{CUISINE_ICONS[c.id] || '🍽'}</span>
                <span className="font-body text-xs font-medium text-slate text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Dish */}
        {cuisine && (
          <div className="surface-panel p-5 lg:p-6 mb-10 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-gold text-white font-body text-sm font-semibold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <h2 className="font-display font-semibold text-2xl text-slate">Pick a dish</h2>
                <p className="font-body text-sm text-slate-lt mt-1">
                  We’re now inside <span className="text-slate font-medium">{cuisine.label}</span>. Choose the dish that best matches what’s on the table.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cuisine.dishes.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDish(d.id)}
                  className={`rounded-2xl p-5 text-left border-2 transition-all duration-200
                    ${selectedDish === d.id
                      ? 'border-gold bg-gold/10 shadow-gold'
                      : 'border-cream bg-white hover:border-gold/40 hover:shadow-card'
                    }`}
                >
                  <p className="font-display font-semibold text-lg text-slate mb-1">{d.label}</p>
                  <p className="font-body text-xs text-slate-lt leading-relaxed">{d.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Results */}
        {dish && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-gold text-white font-body text-sm font-semibold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <h2 className="font-display font-semibold text-2xl text-slate">Your perfect match</h2>
                <p className="font-body text-sm text-slate-lt mt-1">
                  Here’s the logic, the style cue, and the bottle shortlist for <span className="text-slate font-medium">{dish.label}</span>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Pairing Logic */}
              <div className="lg:col-span-1 space-y-5">
                <div className="surface-panel p-5">
                  <p className="section-label mb-2">Pairing Read</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-3">
                      <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Cuisine</p>
                      <p className="font-body text-sm text-slate mt-1 leading-snug">{cuisine?.label}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-3">
                      <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Matches found</p>
                      <p className="font-body text-sm text-slate mt-1 leading-snug">{matchedWines.length || 'Style-led'}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-display font-semibold text-lg text-slate mb-3">Why it works</h3>
                  <p className="font-body text-sm text-slate-lt leading-relaxed">{dish.pairingReason}</p>
                </div>

                {dish.pairingTips && (
                  <div className="rounded-2xl bg-sage/10 border border-sage/30 p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">💡</span>
                      <div>
                        <p className="font-body text-xs font-semibold text-sage uppercase tracking-wide mb-1">Sommelier's Tip</p>
                        <p className="font-body text-sm text-slate-lt leading-relaxed">{dish.pairingTips}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card p-6">
                  <h3 className="font-body text-xs font-semibold text-slate-lt uppercase tracking-widest mb-3">Wine Styles to Look For</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.wineStyles.map(style => (
                      <span key={style} className="tag bg-gold/10 border border-gold/30 text-gold text-xs font-medium">{style}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matched Wines */}
              <div className="lg:col-span-2">
                {matchedWines.length > 0 ? (
                  <>
                    <div className="surface-panel p-5 mb-4">
                      <p className="section-label mb-2">Bottle Shortlist</p>
                      <p className="font-body text-sm text-slate-lt">
                        From our collection, these bottles pair beautifully with {dish.label}. Treat them as strong starting points rather than the only possible answers.
                      </p>
                    </div>
                    <p className="font-body text-sm text-slate-lt mb-4">
                      From our collection — wines that pair beautifully with {dish.label}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {matchedWines.map(wine => (
                        <WineCard key={wine.id} wine={wine} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="card p-8 text-center">
                    <p className="font-body text-sm text-slate-lt mb-4">
                      No specific bottle matched — but any of these styles would work brilliantly:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {dish.wineStyles.map(style => (
                        <span key={style} className="tag bg-gold/10 border border-gold/30 text-gold">{style}</span>
                      ))}
                    </div>
                    <Link to="/explore" className="btn-primary mt-6 inline-block">
                      Browse the Explorer →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pairing Principles */}
        {!dish && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <p className="section-label mb-2">The Science</p>
              <h2 className="font-display font-bold text-3xl text-slate">Pairing Principles</h2>
              <p className="font-body text-sm text-slate-lt max-w-2xl mx-auto mt-3">
                If you’re not ready to choose a dish yet, use these core rules to understand why certain matches keep working.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRINCIPLES.map(p => (
                <div key={p.title} className="card p-6">
                  <span className="text-2xl mb-3 block">{p.icon}</span>
                  <h3 className="font-display font-semibold text-lg text-slate mb-2">{p.title}</h3>
                  <p className="font-body text-xs text-slate-lt leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Pairings Table */}
        {!selectedCuisine && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <p className="section-label mb-2">Quick Reference</p>
              <h2 className="font-display font-bold text-3xl text-slate">Classic Combinations</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-cream">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/60">
                    <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-6 py-4">Food</th>
                    <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-6 py-4">Wine Style</th>
                    <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-6 py-4 hidden md:table-cell">The Logic</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASSICS.map((row, i) => (
                    <tr key={row.food} className={`border-t border-cream ${i % 2 === 0 ? 'bg-white' : 'bg-ivory/40'}`}>
                      <td className="px-6 py-4 font-body font-semibold text-sm text-slate">{row.food}</td>
                      <td className="px-6 py-4">
                        <span className="tag bg-gold/10 border border-gold/30 text-gold text-xs">{row.wine}</span>
                      </td>
                      <td className="px-6 py-4 font-body text-xs text-slate-lt hidden md:table-cell max-w-xs">{row.logic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const PRINCIPLES = [
  {
    icon: '⚖️',
    title: 'Match the Weight',
    body: `Light dishes need light wines; rich dishes need structured, full-bodied wines. A delicate sole fillet disappears next to a tannic Barolo.`,
  },
  {
    icon: '🔗',
    title: 'Bridge Flavours',
    body: `Find a shared flavour thread — earthy mushroom risotto and earthy Burgundy Pinot Noir; herb-crusted lamb and herbal Cabernet Sauvignon.`,
  },
  {
    icon: '✂️',
    title: 'Acid Cuts Fat',
    body: `Acidity acts as a palate cleanser. Crisp Chablis cuts through butter sauces; Champagne's acidity refreshes between bites of fried food.`,
  },
  {
    icon: '🍬',
    title: 'Sweet vs Spicy',
    body: `Off-dry wines tame spice heat — a touch of sweetness in Riesling or Gewürztraminer soothes chilli heat while matching aromatic flavours.`,
  },
]

const CLASSICS = [
  { food: 'Oysters', wine: 'Muscadet or Chablis', logic: `Bone-dry, briny minerality echoes the sea; high acidity lifts the creaminess.` },
  { food: 'Roast Chicken', wine: 'White Burgundy', logic: `Savoury richness, buttery texture and oak complement the roasted, herb-seasoned bird.` },
  { food: 'Lamb Chops', wine: 'Cabernet Sauvignon', logic: `Tannins bind with proteins in the meat; the dark fruit mirrors the lamb's savoury depth.` },
  { food: 'Salmon', wine: 'Pinot Noir or Viognier', logic: `Oily, rich fish handles light reds and aromatic whites; avoid heavy tannin.` },
  { food: 'Mushroom Risotto', wine: 'Red Burgundy (Pinot Noir)', logic: `Both share earthy, umami qualities; Pinot's acidity keeps the creamy dish fresh.` },
  { food: 'Sushi & Sashimi', wine: 'Grüner Veltliner or Champagne', logic: `Clean acidity and minerality complement raw fish; avoid oaky or tannic wines.` },
  { food: 'Aged Cheddar', wine: 'Vintage Port', logic: `Classic contrast — the sweetness and richness of Port plays off the sharp, crystalline cheese.` },
  { food: 'Dark Chocolate', wine: 'Banyuls or Tawny Port', logic: `Sweet fortified wines match chocolate's intensity; dry wines taste sour alongside.` },
  { food: 'Grilled Sea Bass', wine: 'Vermentino or Albariño', logic: `Coastal white grapes carry natural salinity that echoes grilled, briny seafood perfectly.` },
  { food: 'Truffle Pasta', wine: 'Barolo or Red Burgundy', logic: `Truffle's earthiness pairs with the tar-and-roses complexity of aged Nebbiolo or mature Pinot.` },
]
