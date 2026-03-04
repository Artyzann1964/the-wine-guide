import { useState } from 'react'
import { Link } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'

const TYPES = [
  {
    id: 'champagne',
    label: 'Champagne',
    emoji: '🥂',
    country: 'France',
    region: 'Champagne, France',
    method: 'Traditional Method',
    colour: '#F5D680',
    grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'],
    description: `The world's most celebrated sparkling wine, produced exclusively in the Champagne region of northeast France under the most stringent regulations in the wine world. Champagne's unique terroir — chalk subsoil, cool climate, and centuries of expertise — creates bubbles of incomparable finesse and complexity.`,
    keyProducers: ['Krug', 'Dom Pérignon', 'Bollinger', 'Louis Roederer', 'Taittinger', 'Moët & Chandon', 'Salon', 'Jacques Selosse'],
    ageing: 'Minimum 15 months for NV; 36 months for vintage. Prestige cuvées often 6–10+ years.',
    dosage: 'Brut Nature (0g/L) through Doux (50g/L); most Champagne is Brut (under 12g/L).',
    bestFor: 'Celebrations, oysters, seared scallops, aged Comté, smoked salmon',
    priceRange: '£30–£500+',
  },
  {
    id: 'cava',
    label: 'Cava',
    emoji: '🍾',
    country: 'Spain',
    region: 'Penedès, Catalonia',
    method: 'Traditional Method',
    colour: '#E8C060',
    grapes: ['Xarel-lo', 'Macabeo', 'Parellada', 'Chardonnay', 'Pinot Noir'],
    description: `Spain's great sparkling wine, made using the same traditional method as Champagne but with indigenous Catalan grape varieties that give it a distinctly earthy, almond-inflected character. The best Cavas — Gran Reserva and Corpinnat — rival Champagne in complexity at a fraction of the price.`,
    keyProducers: ['Gramona', 'Raventós i Blanc', 'Recaredo', 'Agustí Torelló', 'Juvé & Camps', 'Codorníu'],
    ageing: 'Minimum 9 months (Cava); 18 months (Reserva); 30 months (Gran Reserva); 18 months (Corpinnat).',
    dosage: 'Mostly Brut; Brut Nature increasingly common among quality producers.',
    bestFor: 'Ibérico ham, gambas al ajillo, tortilla, tapas',
    priceRange: '£10–£80',
  },
  {
    id: 'prosecco',
    label: 'Prosecco',
    emoji: '✨',
    country: 'Italy',
    region: 'Veneto & Friuli-Venezia Giulia',
    method: 'Charmat / Tank Method (Martinotti)',
    colour: '#F9F0C8',
    grapes: ['Glera'],
    description: `Italy's beloved sparkling wine, produced using the tank method (Charmat or Martinotti), which preserves the fresh, fruity, floral aromatics of the Glera grape. The finest Prosecco comes from the DOCG zones of Valdobbiadene and Asolo; the prestige single-vineyard Cartizze is Prosecco's Grand Cru.`,
    keyProducers: ['Bisol 1542', 'Nino Franco', 'Ruggeri', 'Col Fondo', 'Mionetto', 'La Marca'],
    ageing: 'Minimal; designed for freshness. Drink within 1–2 years.',
    dosage: 'Typically Extra Dry (12–17g/L) or Brut; some off-dry Dry style (17–32g/L).',
    bestFor: 'Aperitivo, prosciutto e melone, light antipasti, light seafood',
    priceRange: '£10–£50',
  },
  {
    id: 'cremant',
    label: 'Crémant',
    emoji: '🫧',
    country: 'France',
    region: 'Multiple French Regions',
    method: 'Traditional Method',
    colour: '#E8D8A0',
    grapes: ['Variable by region'],
    description: `The umbrella term for quality traditional-method sparkling wines made outside Champagne. Each Crémant has its own distinct character determined by local grape varieties: Crémant d'Alsace (Pinot Blanc, Auxerrois) is floral and fresh; Crémant de Bourgogne (Chardonnay, Pinot Noir) offers Champagne-like depth at a fraction of the price; Crémant de Loire (Chenin Blanc) brings elegant acidity.`,
    keyProducers: {
      Alsace: ['Wolfberger', 'Albert Mann', 'Dopff au Moulin'],
      Burgundy: ['Caves de Lugny', 'Louis Bouillot'],
      Loire: ['Langlois-Château', 'Gratien & Meyer'],
    },
    ageing: 'Minimum 9 months; better producers age 18–24 months.',
    dosage: 'Typically Brut.',
    bestFor: 'Excellent everyday sparkling — all the occasion of Champagne at half the price',
    priceRange: '£12–£30',
  },
  {
    id: 'english',
    label: 'English Sparkling',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'England',
    region: 'South East England',
    method: 'Traditional Method',
    colour: '#EEF5D8',
    grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'],
    description: `England's remarkable contribution to the world of sparkling wine. The same chalk geology that defines Champagne runs under the South Downs of Sussex and Hampshire, producing Chardonnay and Pinot Noir of striking mineral precision and cool-climate delicacy. English sparkling wines have repeatedly beaten Champagne in blind tastings since the 1990s.`,
    keyProducers: ['Nyetimber', 'Chapel Down', 'Ridgeview', 'Gusbourne', 'Rathfinny', 'Bride Valley'],
    ageing: 'Typically 18–36 months on lees; single vineyard and reserve wines often longer.',
    dosage: 'Mostly Brut.',
    bestFor: 'Smoked salmon blinis, crab, English cucumber sandwiches, afternoon tea',
    priceRange: '£25–£70',
  },
  {
    id: 'petnat',
    label: 'Pétillant Naturel',
    emoji: '🌿',
    country: 'Various',
    region: 'Loire, Savoie, Slovenia, anywhere with adventurous winemakers',
    method: 'Ancestral Method (Méthode Ancestrale)',
    colour: '#E0F0D0',
    grapes: ['Any variety'],
    description: `The original sparkling wine — before Champagne, before riddling, before disgorging. Pét-Nat is bottled before the first fermentation is complete, trapping the natural CO₂ in the bottle. The result is a gentle, hazy, often slightly funky sparkling wine with fewer bubbles and a wilder, more natural character. Currently fashionable among natural wine enthusiasts worldwide.`,
    keyProducers: ['Movia (Slovenia)', 'Domaine de la Pépière (Loire)', 'La Grapperie', 'Brendan Tracey', 'Clot de l\'Origine'],
    ageing: 'Minimal — designed for fresh, early drinking.',
    dosage: 'None — naturally dry.',
    bestFor: 'Natural wine bars, charcuterie, light cheese, summer picnics',
    priceRange: '£15–£40',
  },
]

// The production process steps
const TRADITIONAL_STEPS = [
  { step: 1, label: 'Harvest',        icon: '🍇', desc: 'Grapes are picked by hand (always in Champagne) and pressed gently to extract juice without breaking the skins.' },
  { step: 2, label: 'First Fermentation', icon: '🍶', desc: 'Grape juice ferments to create a still base wine. Champagne blenders may work with 50–100 individual wines for the assemblage.' },
  { step: 3, label: 'Assemblage',     icon: '🔀', desc: 'The chef de cave blends different wines, crus and vintages (for NV) to create the house style. Reserve wines add complexity.' },
  { step: 4, label: 'Tirage',         icon: '🍾', desc: 'A mixture of sugar and yeast (liqueur de tirage) is added; the wine is bottled and sealed with a crown cap.' },
  { step: 5, label: 'Second Fermentation', icon: '🫧', desc: 'In the sealed bottle, the yeast converts the added sugar to CO₂ — creating the bubbles. The dead yeast cells (lees) remain in the bottle.' },
  { step: 6, label: 'Lees Ageing',    icon: '⏳', desc: 'The wine rests on its lees for months or years. The yeast autolysis creates the brioche, biscuit, and toasty notes characteristic of quality Champagne.' },
  { step: 7, label: 'Riddling',       icon: '🔄', desc: 'The bottles are gradually tilted and twisted (riddled) to move the lees into the neck. Traditionally by hand in pupitres; today often by gyropalette.' },
  { step: 8, label: 'Disgorgement',   icon: '❄️', desc: 'The bottle neck is frozen, trapping the lees as a plug of ice. The crown cap is removed; pressure expels the plug. A perfectly clear wine remains.' },
  { step: 9, label: 'Dosage',         icon: '💧', desc: 'A small amount of wine and sugar (liqueur d\'expédition) is added to adjust sweetness. This defines the style: Brut Nature through Doux.' },
  { step: 10, label: 'Corking & Ageing', icon: '🔒', desc: 'The bottle is corked, wired, and labelled. Many quality producers age further before release to allow integration.' },
]

const TANK_STEPS = [
  { step: 1, label: 'Harvest & First Fermentation', icon: '🍇', desc: 'Grapes are harvested and fermented to create a still base wine, exactly as in the traditional method.' },
  { step: 2, label: 'Second Fermentation in Tank', icon: '🏭', desc: 'Sugar and yeast are added to a large pressurised stainless steel tank (autoclave) rather than individual bottles. The CO₂ is trapped inside the tank.' },
  { step: 3, label: 'Temperature Filtration', icon: '🌡', desc: 'The wine is chilled to stop fermentation at the desired sugar level, then filtered to remove yeast.' },
  { step: 4, label: 'Bottling under pressure', icon: '🍾', desc: "The sparkling wine is bottled under pressure from the tank directly — a quick, efficient process that preserves the grape's fresh, fruity character." },
]

export default function Sparkling() {
  const [activeType, setActiveType] = useState('champagne')
  const [processView, setProcessView] = useState('traditional')
  const sparklingWines = wines.filter(w => w.category === 'sparkling')
  const currentType = TYPES.find(t => t.id === activeType)

  return (
    <main className="pt-16 min-h-screen">
      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative bg-slate text-white py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="absolute right-0 top-0 h-full" viewBox="0 0 400 600" preserveAspectRatio="xMaxYMid slice">
            <circle cx="350" cy="100" r="200" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="350" cy="100" r="150" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="350" cy="100" r="100" fill="none" stroke="white" strokeWidth="1" />
            {[...Array(30)].map((_, i) => (
              <circle key={i} cx={200 + Math.random() * 200} cy={Math.random() * 600} r="2" fill="white" opacity="0.5" />
            ))}
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label text-gold mb-4">The art of bubbles</p>
          <h1 className="font-display text-6xl lg:text-7xl font-light leading-tight mb-6">
            A Guide to<br />
            <em className="text-gold not-italic">Sparkling Wine</em>
          </h1>
          <p className="font-body text-white/70 max-w-2xl text-lg leading-relaxed mb-10">
            Six different methods. Six different styles. From the chalky mineral precision of Champagne to the gentle pétillance of a Pét-Nat — discover how the bubbles in your glass tell the story of how your wine was made.
          </p>

          {/* Type selector pills */}
          <div className="flex flex-wrap gap-2">
            {TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`font-body text-sm px-5 py-2.5 rounded-full transition-all duration-200 ${
                  activeType === type.id
                    ? 'bg-gold text-white font-medium'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {type.emoji} {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TYPE DETAIL ───────────────────────────── */}
      {currentType && (
        <section id={currentType.id} className="py-16 bg-white border-b border-cream animate-fade-in" key={currentType.id}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{currentType.emoji}</span>
                  <div>
                    <h2 className="font-display text-4xl text-slate">{currentType.label}</h2>
                    <p className="font-body text-sm text-slate-lt">{currentType.region}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="tag bg-gold/10 border border-gold/30 text-gold">{currentType.method}</span>
                  <span className="tag bg-cream border border-cream text-slate-lt">{currentType.priceRange}</span>
                </div>

                <p className="font-body text-slate-lt leading-relaxed mb-6">{currentType.description}</p>

                <dl className="space-y-3 font-body text-sm">
                  <div className="card p-4">
                    <dt className="section-label mb-1">Grape Varieties</dt>
                    <dd className="text-slate">{Array.isArray(currentType.grapes) ? currentType.grapes.join(', ') : currentType.grapes}</dd>
                  </div>
                  <div className="card p-4">
                    <dt className="section-label mb-1">Ageing Requirements</dt>
                    <dd className="text-slate">{currentType.ageing}</dd>
                  </div>
                  <div className="card p-4">
                    <dt className="section-label mb-1">Dosage / Sweetness</dt>
                    <dd className="text-slate">{currentType.dosage}</dd>
                  </div>
                  <div className="card p-4">
                    <dt className="section-label mb-1">Best Pairings</dt>
                    <dd className="text-slate">{currentType.bestFor}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-4">
                  Key Producers
                </h3>
                {Array.isArray(currentType.keyProducers) ? (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {currentType.keyProducers.map(p => (
                      <span key={p} className="tag bg-cream text-slate border border-cream">{p}</span>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {Object.entries(currentType.keyProducers).map(([region, producers]) => (
                      <div key={region}>
                        <p className="font-body text-xs font-semibold text-slate mb-2">{region}</p>
                        <div className="flex flex-wrap gap-2">
                          {producers.map(p => (
                            <span key={p} className="tag bg-cream text-slate border border-cream">{p}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Wines from this type */}
                <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-4">
                  In Our Guide
                </h3>
                <div className="space-y-3">
                  {sparklingWines
                    .filter(w => w.subcategory === currentType.id)
                    .map(wine => (
                      <Link
                        key={wine.id}
                        to={`/explore/${wine.id}`}
                        className="card p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                             style={{ background: currentType.colour + '40' }}>
                          {currentType.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-slate">{wine.name}</p>
                          <p className="font-body text-xs text-slate-lt">{wine.producer} · {wine.vintage}</p>
                        </div>
                        <div className="flex items-center gap-1 text-gold">
                          <span className="font-body font-semibold text-sm">{wine.rating}</span>
                          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </Link>
                    ))
                  }
                  {sparklingWines.filter(w => w.subcategory === currentType.id).length === 0 && (
                    <p className="font-body text-sm text-slate-lt italic">Coming soon — more wines being added.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCTION PROCESS ────────────────────── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="section-label mb-2">How it's made</p>
            <h2 className="font-display text-4xl text-slate mb-4">The Production Process</h2>
            <p className="font-body text-slate-lt max-w-xl mx-auto">
              The method used to make a sparkling wine defines its character. Here's how the two most important processes work.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center gap-2 mb-12">
            <button
              onClick={() => setProcessView('traditional')}
              className={`font-body text-sm px-6 py-3 rounded-full transition-all ${
                processView === 'traditional' ? 'bg-gold text-white' : 'bg-cream text-slate-lt hover:bg-cream'
              }`}
            >
              🥂 Traditional Method
            </button>
            <button
              onClick={() => setProcessView('tank')}
              className={`font-body text-sm px-6 py-3 rounded-full transition-all ${
                processView === 'tank' ? 'bg-gold text-white' : 'bg-cream text-slate-lt hover:bg-cream'
              }`}
            >
              🏭 Tank Method
            </button>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gold/20 hidden lg:block" />

            <div className="space-y-4 stagger">
              {(processView === 'traditional' ? TRADITIONAL_STEPS : TANK_STEPS).map(s => (
                <div key={s.step} className="flex gap-5 animate-fade-up">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col items-center justify-center hidden lg:flex">
                    <span className="font-display text-lg font-semibold text-gold">{s.step}</span>
                  </div>
                  {/* Content */}
                  <div className="card p-5 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{s.icon}</span>
                      <h3 className="font-display text-xl font-semibold text-slate">{s.label}</h3>
                    </div>
                    <p className="font-body text-sm text-slate-lt leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {processView === 'traditional' && (
              <div className="mt-8 card p-6 bg-gold/5 border border-gold/20">
                <h3 className="font-display text-xl text-slate mb-2">🌿 Ancestral Method (Pét-Nat)</h3>
                <p className="font-body text-sm text-slate-lt leading-relaxed">
                  The simplest and oldest method: the wine is bottled mid-fermentation, before the first fermentation is complete. No added sugar, no disgorgement, no dosage. The result is hazy, gently sparkling, and delightfully natural — sometimes with a slight yeast sediment. Pétillant Naturel is the original sparkling wine.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── DOSAGE GUIDE ──────────────────────────── */}
      <section className="py-16 bg-white border-y border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Reading the label</p>
            <h2 className="font-display text-4xl text-slate">Sweetness Levels Explained</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-cream">
                  <th className="text-left pb-3 pr-6 text-slate-lt font-medium uppercase text-xs tracking-wider">Term</th>
                  <th className="text-left pb-3 pr-6 text-slate-lt font-medium uppercase text-xs tracking-wider">Residual Sugar</th>
                  <th className="text-left pb-3 text-slate-lt font-medium uppercase text-xs tracking-wider">Taste</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Brut Nature / Zero Dosage', '0–3 g/L',  'Bone dry — pure, austere, uncompromising'],
                  ['Extra Brut',                '0–6 g/L',  'Very dry — increasingly popular among connoisseurs'],
                  ['Brut',                      '<12 g/L',  'Dry — the most common style; refreshing and food-friendly'],
                  ['Extra Dry / Extra Sec',      '12–17 g/L', 'Off-dry — slightly softer; popular for aperitivo'],
                  ['Dry / Sec',                 '17–32 g/L', 'Slightly sweet — often drunk with dessert'],
                  ['Demi-Sec',                  '32–50 g/L', 'Medium sweet — pairs with fruit desserts and light cakes'],
                  ['Doux',                      '>50 g/L',  'Sweet — rare today; a style popular in the 19th century'],
                ].map(([term, sugar, taste]) => (
                  <tr key={term} className="border-b border-cream/50 hover:bg-cream/30 transition-colors">
                    <td className="py-3 pr-6 font-medium text-slate">{term}</td>
                    <td className="py-3 pr-6 text-slate-lt font-mono text-xs">{sugar}</td>
                    <td className="py-3 text-slate-lt">{taste}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ALL SPARKLING WINES ───────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">Our selection</p>
            <h2 className="font-display text-4xl text-slate">Sparkling Wines in the Guide</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sparklingWines.map(wine => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </section>
    </main>
  )
}
