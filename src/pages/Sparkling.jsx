import { useState } from 'react'
import { Link } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'

// ─── Amanda's Picks ───────────────────────────────────────────────────────────
// Mix of wines in our database (linked) and curated recommendations (not yet added)

const AMANDA_PICKS = [
  {
    id: 'lidl-cremant',            // matches wines.js id
    inDatabase: true,
    tier: 'Tuesday Night',
    tierColor: 'bg-sage/10 text-sage border-sage/20',
    label: 'Crémant de Bourgogne',
    note: `Lidl's Caves de Lugny Crémant is the smartest £8 you'll spend in a supermarket. Traditional method, proper bubbles, none of the guilt. This is the gateway drug from Prosecco to Champagne and it works every single time.`,
    where: 'Lidl · ~£8–9',
  },
  {
    id: null,
    inDatabase: false,
    tier: 'Aperitivo Hour',
    tierColor: 'bg-gold/10 text-gold border-gold/20',
    label: 'Prosecco DOC Brut',
    producer: 'Waitrose own-label',
    note: `The non-negotiable Spritz Prosecco. Dry enough to keep the Aperol honest, fresh enough to drink on its own. Buy two. One for the Spritz, one for you before the guests arrive.`,
    where: 'Waitrose · ~£10–12',
  },
  {
    id: 'aldi-champagne',           // matches wines.js id
    inDatabase: true,
    tier: 'Cheeky Treat',
    tierColor: 'bg-terracotta/10 text-terracotta border-terracotta/20',
    label: 'Exquisite Collection Champagne Brut',
    note: `Aldi doing Champagne at £11. Proper Champagne. This should be illegal — and wine snobs wish it were. Keep a bottle in the fridge at all times. Pretend it's for guests.`,
    where: 'Aldi · ~£11–12',
  },
  {
    id: null,
    inDatabase: false,
    tier: 'Dinner Party Star',
    tierColor: 'bg-slate/10 text-slate border-slate/20',
    label: 'Collection Blanc de Blancs NV',
    producer: 'M&S',
    note: `M&S Blanc de Blancs is the dinner party move. All Chardonnay, elegant and precise — this is the bottle you put out and say nothing about, and watch someone ask "is this Champagne?" It is.`,
    where: 'M&S · ~£20–25',
  },
  {
    id: null,
    inDatabase: false,
    tier: 'The Upgrade',
    tierColor: 'bg-[#8B2050]/10 text-[#8B2050] border-[#8B2050]/20',
    label: 'Crémant d\'Alsace Brut',
    producer: 'Wolfberger or Albert Mann',
    note: `If Crémant de Bourgogne is the gateway, Crémant d'Alsace is where you stay. Floral, precise, made from Pinot Blanc and Auxerrois — a completely different character from Champagne but no less serious. Under £15 anywhere good.`,
    where: 'Waitrose / Majestic · ~£13–16',
  },
  {
    id: 'nyetimber-classic-cuvee',  // matches wines.js id
    inDatabase: true,
    tier: 'Proudly British',
    tierColor: 'bg-[#1a3a1a]/10 text-[#2d5a2d] border-[#2d5a2d]/20',
    label: 'Nyetimber Classic Cuvée',
    note: `English sparkling wine keeps winning blind tastings against Champagne, and nobody in France likes talking about it. Nyetimber is the one to try — the same chalk geology, the same grapes, a completely different expression. Brilliant with anything from the sea.`,
    where: 'Waitrose / Nyetimber.com · ~£40–50',
  },
  {
    id: 'bollinger-special-cuvee',  // matches wines.js id
    inDatabase: true,
    tier: 'Special Occasion',
    tierColor: 'bg-gold/15 text-gold border-gold/30',
    label: 'Bollinger Special Cuvée Brut NV',
    note: `Bollinger is the serious Champagne that doesn't take itself too seriously. The house James Bond drinks. Rich, biscuity, generous — the kind of Champagne that makes an ordinary Friday feel like an event. Worth every penny.`,
    where: 'Waitrose Cellar / Majestic · ~£45–55',
  },
  {
    id: 'dom-perignon-vintage',     // matches wines.js id
    inDatabase: true,
    tier: 'The Dream',
    tierColor: 'bg-[#c8a000]/10 text-[#a07800] border-[#c8a000]/20',
    label: 'Dom Pérignon Vintage',
    note: `The one you open when something truly exceptional happens. Or when you decide that Tuesday is exceptional enough. Dom Pérignon is never wrong, never disappointing, and absolutely worth saving up for. Once a year, at least.`,
    where: 'Berry Bros. & Rudd / fine wine merchants · ~£150–200',
  },
]

// ─── Spritz Recipes ───────────────────────────────────────────────────────────

const SPRITZ_RECIPES = [
  {
    name: 'The Classic Aperol Spritz',
    emoji: '🍊',
    color: 'bg-orange-50 border-orange-200',
    labelColor: 'text-orange-600',
    ratio: '3 : 2 : 1',
    ratioLabel: 'Prosecco : Aperol : Soda',
    steps: [
      'Fill a large wine glass with ice to the brim',
      '3 parts Prosecco (use a dry DOC Brut — not sweet)',
      '2 parts Aperol',
      '1 splash of soda water',
      'Orange slice, not a wedge — presentation matters',
    ],
    gilbyTake: `The ratio is everything. Most Aperol Spritzes fail because they skimp on the Prosecco. More Aperol is not more better. Trust the 3-2-1.`,
  },
  {
    name: 'The Hugo',
    emoji: '🌿',
    color: 'bg-green-50 border-green-200',
    labelColor: 'text-green-700',
    ratio: '3 : 1 : 1',
    ratioLabel: 'Prosecco : Elderflower : Soda',
    steps: [
      'Handful of fresh mint in the glass first — lightly bruised',
      '3 parts Prosecco',
      '1 part elderflower liqueur (St-Germain is the benchmark)',
      '1 part soda water',
      'Ice, lime slice, mint sprig to finish',
    ],
    gilbyTake: `The Alpine answer to Aperol. Lighter, more fragrant, genuinely refreshing. Try it once and you'll be ordering it everywhere in Italy.`,
  },
  {
    name: 'The Limoncello Spritz',
    emoji: '🍋',
    color: 'bg-yellow-50 border-yellow-200',
    labelColor: 'text-yellow-700',
    ratio: '3 : 1 : 1',
    ratioLabel: 'Prosecco : Limoncello : Soda',
    steps: [
      'Chill everything — limoncello in the freezer, glass in the fridge',
      '3 parts Prosecco',
      '1 part limoncello (Pallini or similar)',
      'Splash of soda',
      'Lemon twist, not a slice — twist it over the glass first',
    ],
    gilbyTake: `When you've had enough orange and want Italian sunshine. The lemon and Prosecco acidity sing together. Brilliant with anything fried.`,
  },
  {
    name: 'The Crémant Upgrade',
    emoji: '🫧',
    color: 'bg-purple-50 border-purple-200',
    labelColor: 'text-purple-700',
    ratio: '3 : 2 : 1',
    ratioLabel: 'Crémant : Elderflower : Tonic',
    steps: [
      'Swap Prosecco for Crémant d\'Alsace for a drier, more complex base',
      '3 parts Crémant d\'Alsace',
      '2 parts elderflower tonic (Fever-Tree)',
      'Squeeze of lemon',
      'Cucumber ribbon and fresh thyme — make it look the part',
    ],
    gilbyTake: `The grown-up Spritz. Once you've tried this, Prosecco in a Spritz feels a bit one-dimensional. The Crémant brings something extra.`,
  },
]

// ─── Sparkling Types Reference Data ──────────────────────────────────────────

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
    description: `The world's most celebrated sparkling wine, produced exclusively in the Champagne region of northeast France. Champagne's unique terroir — chalk subsoil, cool climate, centuries of expertise — creates bubbles of incomparable finesse and complexity. Nothing else is Champagne.`,
    keyProducers: ['Krug', 'Dom Pérignon', 'Bollinger', 'Louis Roederer', 'Taittinger', 'Moët & Chandon', 'Salon', 'Jacques Selosse'],
    ageing: 'Minimum 15 months for NV; 36 months for vintage. Prestige cuvées often 6–10+ years.',
    dosage: 'Brut Nature (0 g/L) through Doux (50 g/L); most Champagne is Brut (under 12 g/L).',
    bestFor: 'Celebrations, oysters, seared scallops, aged Comté, smoked salmon, any occasion you decide is worth it',
    priceRange: '£30–£500+',
  },
  {
    id: 'cremant',
    label: 'Crémant',
    emoji: '🫧',
    country: 'France',
    region: 'Alsace · Burgundy · Loire · Jura · Bordeaux · Die',
    method: 'Traditional Method',
    colour: '#E8D8A0',
    grapes: ['Variable by region — Chardonnay, Pinot Blanc, Chenin Blanc, Auxerrois'],
    description: `The smartest move in sparkling wine. Crémant uses the same traditional method as Champagne but draws on different French regions and grape varieties. Crémant d'Alsace (floral, precise), Crémant de Bourgogne (Burgundy depth at half the price), Crémant de Loire (elegant Chenin acidity). The wine world's best-kept affordable secret.`,
    keyProducers: {
      Alsace: ['Wolfberger', 'Albert Mann', 'Dopff au Moulin'],
      Burgundy: ['Caves de Lugny', 'Louis Bouillot'],
      Loire: ['Langlois-Château', 'Gratien & Meyer'],
    },
    ageing: 'Minimum 9 months; better producers age 18–24 months.',
    dosage: 'Typically Brut.',
    bestFor: 'All the occasions you\'d open Champagne, at half the price. Which is all of them.',
    priceRange: '£10–£28',
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
    description: `Italy's beloved sparkling wine and the home of the Spritz. Made using the tank method which preserves fresh, fruity, floral aromatics of the Glera grape. The finest Prosecco comes from Valdobbiadene and Asolo DOCG; the prestige single-vineyard Cartizze is Prosecco's Grand Cru. For Spritzes: always Brut DOC. For drinking straight: go DOCG.`,
    keyProducers: ['Bisol 1542', 'Nino Franco', 'Ruggeri', 'Col Fondo', 'Mionetto', 'La Marca'],
    ageing: 'Minimal — designed for freshness. Drink within 1–2 years of harvest.',
    dosage: 'Brut (drier — better for Spritzes) or Extra Dry (slightly richer). Avoid Dry or Demi-Sec.',
    bestFor: 'Aperitivo hour, Spritzes, prosciutto e melone, light seafood, starting a party',
    priceRange: '£9–£50',
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
    description: `Spain's traditional-method sparkling wine. The honest truth: most Cava at the budget end is fine but uninspiring — that slightly earthy, almond character can feel hollow. However, the top end (Gran Reserva, Corpinnat) is genuinely exceptional. Gramona and Raventós i Blanc rival good Champagne. The gap between the £8 Cava and the £50 Cava is enormous.`,
    keyProducers: ['Gramona', 'Raventós i Blanc', 'Recaredo', 'Agustí Torelló', 'Juvé & Camps'],
    ageing: '9 months (Cava); 18 months (Reserva); 30 months (Gran Reserva).',
    dosage: 'Mostly Brut; Brut Nature increasingly common at quality level.',
    bestFor: 'Ibérico ham, gambas al ajillo, tapas, paella — and honestly the Gramona is for any serious occasion',
    priceRange: '£10–£80',
  },
  {
    id: 'english',
    label: 'English Sparkling',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'England',
    region: 'South East England (Sussex, Hampshire, Kent)',
    method: 'Traditional Method',
    colour: '#EEF5D8',
    grapes: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'],
    description: `England's remarkable arrival on the world sparkling wine stage. The same chalk geology that defines Champagne runs under the South Downs, producing cool-climate precision and mineral elegance that has repeatedly beaten Champagne in blind tastings. Nyetimber, Chapel Down, Ridgeview, Gusbourne — all serious. All British. All worth the price.`,
    keyProducers: ['Nyetimber', 'Chapel Down', 'Ridgeview', 'Gusbourne', 'Rathfinny', 'Bride Valley'],
    ageing: '18–36 months typically; longer for reserve wines.',
    dosage: 'Mostly Brut.',
    bestFor: 'Smoked salmon, crab, scallops, anything from the English coast',
    priceRange: '£25–£70',
  },
  {
    id: 'petnat',
    label: 'Pétillant Naturel',
    emoji: '🌿',
    country: 'Various',
    region: 'Loire, Savoie, Slovenia, anywhere with adventurous producers',
    method: 'Ancestral Method (Méthode Ancestrale)',
    colour: '#E0F0D0',
    grapes: ['Any variety'],
    description: `The original sparkling wine — before riddling, before disgorgement. Pét-Nat is bottled before the first fermentation is complete, trapping natural CO₂. The result is gently sparkling, often hazy, sometimes slightly funky — a wilder, more natural expression than Champagne. Currently the darling of natural wine bars everywhere, for good reason.`,
    keyProducers: ['Movia (Slovenia)', 'Domaine de la Pépière (Loire)', 'La Grapperie', 'Brendan Tracey'],
    ageing: 'Minimal — drink fresh.',
    dosage: 'None — naturally dry.',
    bestFor: 'Natural wine bars, charcuterie, light cheese, summer picnics',
    priceRange: '£15–£40',
  },
]

const TRADITIONAL_STEPS = [
  { step: 1, label: 'Harvest',        icon: '🍇', desc: 'Grapes are picked by hand (always in Champagne) and pressed gently to extract pale juice without the skins.' },
  { step: 2, label: 'First Fermentation', icon: '🍶', desc: 'Grape juice ferments to create a still base wine. Champagne blenders may work with 50–100 individual wines for the assemblage.' },
  { step: 3, label: 'Assemblage',     icon: '🔀', desc: 'The chef de cave blends different wines, crus and vintages (for NV) to create the house style. Reserve wines add complexity and consistency.' },
  { step: 4, label: 'Tirage',         icon: '🍾', desc: 'A mixture of sugar and yeast (liqueur de tirage) is added; the wine is bottled and sealed with a crown cap.' },
  { step: 5, label: 'Second Fermentation', icon: '🫧', desc: 'In the sealed bottle, yeast converts the added sugar to CO₂ — creating the bubbles. Dead yeast cells (lees) remain in the bottle.' },
  { step: 6, label: 'Lees Ageing',    icon: '⏳', desc: 'The wine rests on its lees for months or years. Yeast autolysis creates the brioche, biscuit, and toasty notes of quality Champagne.' },
  { step: 7, label: 'Riddling',       icon: '🔄', desc: 'Bottles are gradually tilted and twisted to move the lees into the neck. Traditionally by hand in pupitres; today often by gyropalette.' },
  { step: 8, label: 'Disgorgement',   icon: '❄️', desc: 'The neck is frozen, trapping the lees as a plug of ice. The crown cap is removed; pressure expels the plug. A clear wine remains.' },
  { step: 9, label: 'Dosage',         icon: '💧', desc: 'A small amount of wine and sugar (liqueur d\'expédition) adjusts sweetness. This defines the style: Brut Nature through Doux.' },
  { step: 10, label: 'Corking',       icon: '🔒', desc: 'The bottle is corked, wired, and labelled. Many quality producers age further before release for integration.' },
]

const TANK_STEPS = [
  { step: 1, label: 'Harvest & Base Wine', icon: '🍇', desc: 'Grapes are harvested and fermented to create a still base wine — exactly as in the traditional method.' },
  { step: 2, label: 'Second Fermentation in Tank', icon: '🏭', desc: 'Sugar and yeast are added to a large pressurised stainless steel tank (autoclave). CO₂ is trapped inside. No individual bottle work needed.' },
  { step: 3, label: 'Temperature Filtration', icon: '🌡', desc: 'The wine is chilled to stop fermentation at the desired sugar level, then filtered to remove yeast completely.' },
  { step: 4, label: 'Bottling under pressure', icon: '🍾', desc: 'Sparkling wine is bottled under pressure directly from the tank — preserving the fresh, fruity, floral character of the grape.' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function AmandaPickCard({ pick, wineData }) {
  const content = (
    <div className={`rounded-2xl border-2 p-5 h-full flex flex-col ${
      pick.inDatabase
        ? 'border-gold/30 bg-white hover:border-gold hover:shadow-lg transition-all duration-200 cursor-pointer'
        : 'border-cream bg-white/60'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full border ${pick.tierColor}`}>
          {pick.tier}
        </span>
        {pick.inDatabase && (
          <span className="font-body text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
            In our guide →
          </span>
        )}
      </div>
      <h4 className="font-display font-semibold text-slate text-base mb-0.5">{pick.label}</h4>
      {(pick.producer || wineData?.producer) && (
        <p className="font-body text-xs text-slate-lt mb-3">{pick.producer || wineData?.producer}</p>
      )}
      <p className="font-body text-sm text-slate-lt leading-relaxed flex-1 italic">"{pick.note}"</p>
      <p className="font-body text-xs text-slate-lt mt-3 pt-3 border-t border-cream font-medium">
        📍 {pick.where}
      </p>
    </div>
  )

  if (pick.inDatabase && wineData) {
    return <Link to={`/explore/${wineData.id}`}>{content}</Link>
  }
  return content
}

function SpritZCard({ recipe }) {
  return (
    <div className={`rounded-2xl border p-6 ${recipe.color}`}>
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{recipe.emoji}</span>
        <div>
          <h4 className="font-display font-semibold text-slate text-lg leading-tight">{recipe.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`font-mono text-sm font-bold ${recipe.labelColor}`}>{recipe.ratio}</span>
            <span className="font-body text-xs text-slate-lt">{recipe.ratioLabel}</span>
          </div>
        </div>
      </div>
      <ol className="space-y-1.5 mb-4">
        {recipe.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-sm text-slate-lt">
            <span className={`font-bold text-xs mt-0.5 shrink-0 ${recipe.labelColor}`}>{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-xl bg-white/60 p-3">
        <p className="font-body text-xs text-slate italic">💬 "{recipe.gilbyTake}"</p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Sparkling() {
  const [activeType, setActiveType] = useState('champagne')
  const [processView, setProcessView] = useState('traditional')
  const sparklingWines = wines.filter(w => w.category === 'sparkling')
  const currentType = TYPES.find(t => t.id === activeType)

  // Map Amanda's picks to wine database entries
  const picksWithData = AMANDA_PICKS.map(pick => ({
    pick,
    wineData: pick.inDatabase && pick.id
      ? wines.find(w => w.id === pick.id)
      : null,
  }))

  // Match sparkling wines to current type (handle both accent variants)
  const winesOfType = sparklingWines.filter(w => {
    const sub = (w.subcategory || '').toLowerCase().replace('é', 'e')
    const typeId = activeType.toLowerCase().replace('é', 'e')
    return sub === typeId || sub === typeId + '-sparkling' || sub === typeId.replace('english', 'english-sparkling')
  })

  return (
    <main className="pt-16 min-h-screen bg-ivory">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)' }}>
        {/* Bubble animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${20 + (i * 13) % 80}px`,
                height: `${20 + (i * 13) % 80}px`,
                left: `${(i * 19) % 100}%`,
                top: `${(i * 23) % 100}%`,
                opacity: 0.1 + (i % 4) * 0.05,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-gold/70 mb-4">
              🥂 Amanda's Fizz Edit
            </p>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Life is too short<br />
              <em className="text-gold not-italic">for bad bubbles.</em>
            </h1>
            <p className="font-body text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl">
              From the Tuesday-night Prosecco to the once-a-year Dom Pérignon — a guide to the whole
              beautiful spectrum of sparkling wine. With particular attention paid to the Spritz.
            </p>
          </div>

          {/* Journey cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {[
              { emoji: '✨', label: 'Prosecco', sub: 'The Daily Driver', color: 'border-yellow-400/40' },
              { emoji: '🫧', label: 'Crémant', sub: 'The Smart Move', color: 'border-purple-400/40' },
              { emoji: '🥂', label: 'Champagne', sub: 'The Dream', color: 'border-gold/60' },
              { emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', label: 'English', sub: 'The Revelation', color: 'border-green-400/40' },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl border ${c.color} bg-white/8 backdrop-blur-sm p-4 text-center`}>
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="font-display font-semibold text-white text-sm">{c.label}</p>
                <p className="font-body text-white/50 text-xs mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMANDA'S PICKS ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="section-label mb-2">Curated by preference</p>
              <h2 className="font-display font-bold text-4xl text-slate">Amanda's Eight</h2>
              <p className="font-body text-slate-lt mt-2 max-w-xl">
                From the fridge-staple Tuesday Prosecco to the annual Dom Pérignon. Eight bottles
                that cover every occasion, every mood, every excuse.
              </p>
            </div>
            <div className="bg-gold/8 border border-gold/20 rounded-2xl px-5 py-3 shrink-0">
              <p className="font-body text-xs text-slate-lt">Wines in bold are</p>
              <p className="font-body text-sm text-gold font-medium">linked in our guide ↗</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {picksWithData.map(({ pick, wineData }) => (
              <AmandaPickCard key={pick.label} pick={pick} wineData={wineData} />
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PERFECT SPRITZ ───────────────────────────────────────────────── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="section-label mb-2">The art of aperitivo</p>
            <h2 className="font-display font-bold text-4xl text-slate mb-4">The Perfect Spritz</h2>
            <p className="font-body text-slate-lt max-w-2xl mx-auto">
              Four versions. One rule: the ratio matters more than the brand. And always, always
              use a proper glass with proper ice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SPRITZ_RECIPES.map(recipe => (
              <SpritZCard key={recipe.name} recipe={recipe} />
            ))}
          </div>
          <div className="mt-6 bg-slate rounded-2xl p-6 md:p-8 text-center">
            <p className="font-display font-semibold text-xl text-white mb-2">The golden rule</p>
            <p className="font-body text-white/70 max-w-2xl mx-auto">
              A Spritz is only as good as its Prosecco. Use a DOC Brut — dry, fresh, clean.
              The sweet Extra Dry style fights with the mixer. Never use Cava. Never use cheap supermarket
              own-label unless it says Brut. This is not negotiable.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE CAVA VERDICT ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-5">
              <div className="text-4xl shrink-0 mt-1">🍾</div>
              <div>
                <p className="section-label mb-2">The honest verdict</p>
                <h2 className="font-display font-bold text-3xl text-slate mb-4">About Cava…</h2>
                <p className="font-body text-slate-lt leading-relaxed mb-4">
                  Most Cava is fine. That's the problem. It tastes of nothing much — a faint earthiness,
                  a mechanical fizz, a slightly flat finish. The budget end of the Cava market exists to
                  fill a price point, not to delight you.
                </p>
                <p className="font-body text-slate-lt leading-relaxed mb-4">
                  However — and this is important — the <strong className="text-slate">top Cava is genuinely exceptional</strong>.
                  Gramona Celler Batlle Gran Reserva (in our guide, 95 points) will make you question
                  everything you thought about Cava. Raventós i Blanc and Recaredo are in the same league.
                  These are complex, serious wines that happen to be Spanish.
                </p>
                <div className="bg-terracotta/8 border border-terracotta/20 rounded-2xl p-5">
                  <p className="font-body text-sm text-slate font-medium mb-1">💬 The rule</p>
                  <p className="font-body text-sm text-slate-lt italic">
                    "Under £20? Skip the Cava, buy a Crémant. Over £40? The Gran Reserva Cavas are
                    worth your full attention. There is almost nothing interesting in between."
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/explore/gramona-celler-batlle-gran-reserva"
                    className="font-body text-sm text-gold hover:underline"
                  >
                    See Gramona Celler Batlle Gran Reserva in our guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPE REFERENCE ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="section-label text-gold/70 mb-2">The full picture</p>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Know Your Bubbles</h2>
            <p className="font-body text-white/60 max-w-xl mx-auto">
              Every style explained — production method, key producers, what to pair it with.
            </p>
          </div>

          {/* Type pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
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

          {/* Type detail */}
          {currentType && (
            <div className="grid lg:grid-cols-2 gap-8 animate-fade-in" key={currentType.id}>
              <div className="bg-white/8 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{currentType.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white">{currentType.label}</h3>
                    <p className="font-body text-white/50 text-sm">{currentType.region}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="font-body text-xs px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                    {currentType.method}
                  </span>
                  <span className="font-body text-xs px-3 py-1 rounded-full bg-white/10 text-white/70">
                    {currentType.priceRange}
                  </span>
                </div>
                <p className="font-body text-white/70 leading-relaxed text-sm mb-6">{currentType.description}</p>
                <div className="space-y-3 text-sm">
                  {[
                    ['Grapes', Array.isArray(currentType.grapes) ? currentType.grapes.join(', ') : currentType.grapes],
                    ['Ageing', currentType.ageing],
                    ['Sweetness', currentType.dosage],
                    ['Best with', currentType.bestFor],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3">
                      <p className="font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">{label}</p>
                      <p className="font-body text-white/80">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Key producers */}
                <div className="bg-white/8 rounded-3xl p-8">
                  <h4 className="font-body text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Key Producers</h4>
                  {Array.isArray(currentType.keyProducers) ? (
                    <div className="flex flex-wrap gap-2">
                      {currentType.keyProducers.map(p => (
                        <span key={p} className="font-body text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/10">{p}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(currentType.keyProducers).map(([region, producers]) => (
                        <div key={region}>
                          <p className="font-body text-xs font-semibold text-white/50 mb-2">{region}</p>
                          <div className="flex flex-wrap gap-2">
                            {producers.map(p => (
                              <span key={p} className="font-body text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/10">{p}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Wines in guide */}
                <div className="bg-white/8 rounded-3xl p-8">
                  <h4 className="font-body text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">In Our Guide</h4>
                  {winesOfType.length > 0 ? (
                    <div className="space-y-3">
                      {winesOfType.map(wine => (
                        <Link
                          key={wine.id}
                          to={`/explore/${wine.id}`}
                          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                               style={{ background: currentType.colour + '30' }}>
                            {currentType.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-medium text-white truncate">{wine.name}</p>
                            <p className="font-body text-xs text-white/50">{wine.producer} · {wine.vintage}</p>
                          </div>
                          <span className="font-body text-sm font-bold text-gold shrink-0">{wine.rating}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-sm text-white/40 italic">More wines being added soon.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SWEETNESS GUIDE ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Reading the label</p>
            <h2 className="font-display font-bold text-3xl text-slate">What does Brut actually mean?</h2>
            <p className="font-body text-slate-lt mt-2">Residual sugar levels, decoded.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-cream">
                  <th className="text-left pb-3 pr-6 text-slate-lt font-medium uppercase text-xs tracking-wider">Term</th>
                  <th className="text-left pb-3 pr-6 text-slate-lt font-medium uppercase text-xs tracking-wider">Sugar</th>
                  <th className="text-left pb-3 text-slate-lt font-medium uppercase text-xs tracking-wider">What it tastes like</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Brut Nature / Zero Dosage', '0–3 g/L',  'Bone dry — austere and uncompromising. For purists.'],
                  ['Extra Brut',                '0–6 g/L',  'Very dry — increasingly fashionable. Clean and precise.'],
                  ['Brut',                      '<12 g/L',  'Dry — the most common style. Refreshing, food-friendly, the default choice.'],
                  ['Extra Dry / Extra Sec',     '12–17 g/L', 'Off-dry — slightly richer. Most Prosecco sits here. Good for Spritzes if it says Brut; not ideal if it\'s this.'],
                  ['Dry / Sec',                 '17–32 g/L', 'Slightly sweet — pair with lighter desserts.'],
                  ['Demi-Sec',                  '32–50 g/L', 'Medium sweet — fruit desserts and soft cakes.'],
                  ['Doux',                      '>50 g/L',  'Sweet — rare today. A 19th century style, historically popular in Russia.'],
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

      {/* ── PRODUCTION PROCESS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="section-label mb-2">How it's made</p>
            <h2 className="font-display font-bold text-4xl text-slate">The Production Process</h2>
            <p className="font-body text-slate-lt max-w-xl mx-auto mt-2">
              The method used to make a sparkling wine defines its character. Two approaches — one meticulous, one efficient.
            </p>
          </div>
          <div className="flex justify-center gap-2 mb-12">
            {[
              { id: 'traditional', label: '🥂 Traditional Method' },
              { id: 'tank', label: '🏭 Tank Method' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setProcessView(id)}
                className={`font-body text-sm px-6 py-3 rounded-full transition-all ${
                  processView === id ? 'bg-gold text-white' : 'bg-cream text-slate-lt hover:bg-cream'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {(processView === 'traditional' ? TRADITIONAL_STEPS : TANK_STEPS).map(s => (
              <div key={s.step} className="flex gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 items-center justify-center hidden lg:flex flex-col">
                  <span className="font-display text-base font-semibold text-gold">{s.step}</span>
                </div>
                <div className="card p-5 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="font-display text-lg font-semibold text-slate">{s.label}</h3>
                  </div>
                  <p className="font-body text-sm text-slate-lt leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL SPARKLING WINES ───────────────────────────────────────────────── */}
      <section className="py-16 pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">Every bottle</p>
            <h2 className="font-display font-bold text-4xl text-slate">Sparkling Wines in the Guide</h2>
          </div>
          <Link to="/explore?category=sparkling" className="font-body text-sm text-gold hover:underline">
            Filter in Explorer →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sparklingWines.map(wine => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </section>
    </main>
  )
}
