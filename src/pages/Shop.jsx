import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { wines } from '../data/wines'
import WineCard from '../components/WineCard'

// ─── Retailer Data ────────────────────────────────────────────────────────────

const RETAILERS = [
  {
    id: 'waitrose',
    name: 'Waitrose',
    type: 'supermarket',
    emoji: '🌿',
    color: '#00533C',
    bg: 'from-[#003d2c] to-[#005a40]',
    tagline: 'The Considered Choice',
    vibe: `If supermarket wine buying were an Olympic sport, Waitrose's buyers would be on the podium. Quietly excellent range, genuine commitment to quality, and the kind of shelf where £9 and £90 are both legitimate choices.`,
    brilliantAt: [
      'Burgundy and the Rhône Valley — seriously strong here',
      'Own-label range, especially Waitrose Loved & Found',
      'Champagne and premium sparkling — M&S levels of care',
      'Smaller grower producers you won\'t find elsewhere',
      'Consistency — a bad Waitrose wine is a rare thing',
    ],
    worthKnowing: [
      'You pay a slight premium — but you\'re buying better wine',
      'The bottom shelf is fine. Go up one level and it gets interesting fast',
      'Cellar Direct online has a deeper selection than the shelves',
    ],
    ourTake: `The grown-up choice. Not the cheapest, rarely disappointing. Their buyer team actually knows what they're doing — which sounds like a low bar until you've been burned by a £10 bottle from someone else.`,
    tip: 'The Loved & Found range is the sweet spot — unusual bottles at honest prices.',
  },
  {
    id: 'marks-spencer',
    name: 'M&S',
    type: 'supermarket',
    emoji: '👑',
    color: '#1a1a2e',
    bg: 'from-[#111122] to-[#1e1e3a]',
    tagline: 'No Compromises',
    vibe: `M&S doesn't do cheap wine. They do proper wine at fair prices. No own-brand filler — everything earns its place. Their Champagne buying is, frankly, one of the best on any high street.`,
    brilliantAt: [
      'Champagne — the Blanc de Blancs is a genuine steal',
      'Curated range: every bottle is a deliberate, considered choice',
      'Italian wines — solid coverage across multiple regions',
      'Food pairings — genuinely considered and consistently trustworthy',
      'Seasonal specials that actually merit the hype',
    ],
    worthKnowing: [
      'Smaller range than Tesco — but quality over quantity is the whole point',
      'The Dine In meal deal wines are always worth sampling',
      'For sparkling and Champagne, this is the high street\'s finest',
    ],
    ourTake: `The boutique of supermarket wine. Every bottle feels considered. For Champagne and sparkling in particular — this is the aisle to trust above all others.`,
    tip: 'The M&S Champagne range is quietly exceptional. Worth every penny.',
  },
  {
    id: 'tesco',
    name: 'Tesco',
    type: 'supermarket',
    emoji: '🛒',
    color: '#003087',
    bg: 'from-[#002060] to-[#003ba0]',
    tagline: 'The Reliable Giant',
    vibe: `Tesco's size is its superpower. The biggest wine range of any UK supermarket means they stock bottles smaller retailers can't justify. Know where to look and you'll find genuine gems alongside the perfectly decent everyday bottles.`,
    brilliantAt: [
      'Finest range — this is where Tesco actually flexes',
      'New World reds — Australia, Chile, Argentina are all strong',
      'Breadth: they stock styles others won\'t touch',
      'Everyday value under £10 that genuinely delivers',
      'Bordeaux — reliable access to decent clarets at all price points',
    ],
    worthKnowing: [
      'Core range plays it safe — go Finest whenever the budget allows',
      'The sheer range can overwhelm — have a style in mind before you go',
      'Clubcard prices make already-good value exceptional. Always use it.',
    ],
    ourTake: `Britain's biggest wine aisle, with all the advantages that brings. Finest is the sweet spot. The everyday range won't set the world on fire, but it won't ruin your Tuesday either.`,
    tip: 'Clubcard pricing is effectively a 20–30% discount. Non-negotiable.',
  },
  {
    id: 'sainsburys',
    name: `Sainsbury's`,
    type: 'supermarket',
    emoji: '🟠',
    color: '#C24D00',
    bg: 'from-[#a03d00] to-[#c85200]',
    tagline: 'Taste the Difference',
    vibe: `Sainsbury's punches above its weight in the mid-range. Taste the Difference is the calling card — and it lives up to the name more often than not. The South African range is underrated, the Italian selection quietly earns respect, and the Champagne is solid.`,
    brilliantAt: [
      'Taste the Difference — the quality jump is real and worth paying for',
      'South Africa — consistently one of the better supermarket selections',
      'Champagne, Blanc de Blancs in particular',
      'Italy — broader and better than people give them credit for',
      'Organic and sustainable range, expanding meaningfully',
    ],
    worthKnowing: [
      'Core own-label is unremarkable — always jump to Taste the Difference',
      'Nectar card pricing mirrors Clubcard — activate it',
      'Spanish range is decent but not the strongest suit here',
    ],
    ourTake: `The nearly-man of supermarket wine that quietly overdelivers. Taste the Difference is genuinely worth the slight premium. South African wine fans should make Sainsbury's their first port of call.`,
    tip: 'The Taste the Difference Shiraz is almost always worth its shelf price.',
  },
  {
    id: 'asda',
    name: 'Asda',
    type: 'supermarket',
    emoji: '💚',
    color: '#3d7a00',
    bg: 'from-[#2d5c00] to-[#3f7a00]',
    tagline: 'Honest Value',
    vibe: `Asda doesn't pretend to be something it's not. It's here for the honest, everyday bottle — and at that job, it's rather good. Extra Special is the range to seek out. Don't go expecting grower Burgundies, but for reliable, unpretentious drinking, Asda quietly delivers.`,
    brilliantAt: [
      'Extra Special range — a genuine step up, properly curated',
      'South American wines — Argentine Malbec and Chilean reds punch hard',
      'Budget sparkling — the Prosecco range is reliable at the price point',
      'Provence-style rosé — overperforms considerably for the money',
      'Everyday value that genuinely doesn\'t feel like a compromise',
    ],
    worthKnowing: [
      'Range is narrower than Tesco or Sainsbury\'s — what\'s there is well-chosen',
      'Not the place for wine exploration — better for confident, known choices',
      'George! deal pricing is worth activating for regular buyers',
    ],
    ourTake: `No fuss, no pretension, decent wine at honest prices. The Extra Special range does exactly what it promises. For everyday drinking without overthinking it, Asda earns its place.`,
    tip: 'The Extra Special Argentine Malbec is consistently excellent value.',
  },
  {
    id: 'aldi',
    name: 'Aldi',
    type: 'supermarket',
    emoji: '🏆',
    color: '#001a6e',
    bg: 'from-[#001055] to-[#001f88]',
    tagline: 'The Cheeky Overachiever',
    vibe: `Aldi is wine's great leveller. The Exquisite Collection wins awards that embarrass bottles costing three times the price. Wine snobs find this uncomfortable. Everyone else finds it magnificent. The Chablis. The Champagne. The seasonal specials. All of it: unreasonably good.`,
    brilliantAt: [
      'Exquisite Collection — award-winning at prices that shouldn\'t exist',
      'Champagne — Veuve Monsigny is genuinely, irritatingly good',
      'Chablis — a perennial blind-tasting over-performer',
      'Specialbuys seasonal drops — some of the best value in the UK',
      'Organic range, much improved in recent years',
    ],
    worthKnowing: [
      'Range changes frequently — what\'s there today may not be next week',
      'Specialbuys are one-shot: when it\'s gone, it\'s gone. Move fast.',
      'The deliberately limited core range is a feature, not a bug',
    ],
    ourTake: `The wine world's best-kept non-secret. If you haven't tried the Exquisite Collection, that's an error requiring urgent correction. The Champagne alone justifies the trip.`,
    tip: 'Watch for the Specialbuy seasonal wine events. They are genuinely exciting.',
  },
  {
    id: 'lidl',
    name: 'Lidl',
    type: 'supermarket',
    emoji: '💛',
    color: '#0044AA',
    bg: 'from-[#003388] to-[#0044aa]',
    tagline: 'Trust the Chablis',
    vibe: `Lidl and Aldi are cut from the same discount cloth, but Lidl has its own character. The French range is arguably stronger. The Malbec is a staple. And the Chablis — trust us on the Chablis — is a genuine bargain that keeps embarrassing pricier competitors in blind tastings.`,
    brilliantAt: [
      'Chablis — yes, really. It\'s that good for the money',
      'French wines generally — solid Bordeaux, good whites across the board',
      'Argentine Malbec — the reliable everyday-driver pick',
      'Champagne Barons de Rothschild — inexplicably available here at this price',
      'Organic range, expanding and thoughtfully chosen',
    ],
    worthKnowing: [
      'Like Aldi, range rotates — the Lidl Cellar events change seasonally',
      'The in-store Lidl Cellar events are worth watching for',
      'Core range is consistent; the rotating specials are the exciting part',
    ],
    ourTake: `Lidl's wine aisle gets less credit than Aldi's but deserves it equally. The French range in particular is strong. And we will keep saying it: trust the Chablis.`,
    tip: 'The Lidl Cellar seasonal events are some of the best wine value in Britain.',
  },
  {
    id: 'morrisons',
    name: 'Morrisons',
    type: 'supermarket',
    emoji: '🌻',
    color: '#004d1a',
    bg: 'from-[#003a12] to-[#005020]',
    tagline: 'The Underrated One',
    vibe: `Morrisons is the wine aisle that gets overlooked in most supermarket conversations, which is a shame — because it quietly punches above its weight in South America and Spain. The Best range deserves more attention than it gets.`,
    brilliantAt: [
      'The Best range — Morrisons\' premium tier is genuinely underrated',
      'South American wines — Argentine and Chilean ranges punch well above weight',
      'Spanish reds — Rioja in particular, solid across all price points',
      'The £8–12 sweet spot — this is where Morrisons really shines',
      'Own-label improving year on year',
    ],
    worthKnowing: [
      'Overall range is narrower than Tesco or Sainsbury\'s',
      'Sparkling range is reliable but unremarkable — stick to still wine here',
      'More card pricing is worth activating for regular visits',
    ],
    ourTake: `The forgotten contender. Morrisons does South American and Spanish wines better than its reputation suggests. The Best range is worth seeking out. Don't overlook it.`,
    tip: 'The Best Rioja Reserva is one of the best-value Spanish reds in any supermarket.',
  },
  {
    id: 'le-bon-vin',
    name: 'Le Bon Vin Sheffield',
    type: 'specialist',
    emoji: '🍾',
    color: '#6B1F3A',
    bg: 'from-[#4a1428] to-[#6B1F3A]',
    tagline: `Sheffield's Finest`,
    vibe: `This is where the supermarket conversation ends and the real one begins. Le Bon Vin is a proper wine merchant — the kind of place where the person behind the counter actually knows what they're talking about and will tell you to put back what you're holding if something better just came in.`,
    brilliantAt: [
      'Everything — with proper depth and genuine expertise behind every choice',
      'Burgundy: access that supermarkets simply cannot match',
      'Italian greats — Barolo, Brunello, Super Tuscans with real provenance',
      'Natural and biodynamic wines, thoughtfully and carefully curated',
      'Staff recommendations you can actually trust',
      'Finding bottles that will genuinely improve in your cellar',
    ],
    worthKnowing: [
      'You pay fairly for quality — not the place for bargain hunting',
      'The conversation is part of the service — use it fully',
      'En primeur and mixed cases available — worth asking about',
    ],
    ourTake: `The antidote to the supermarket aisle. Come here when you want something with a story, a provenance, and a recommendation you can genuinely trust. Sheffield is lucky to have it.`,
    tip: 'Tell them what you\'re eating and your budget. Then let them do the rest.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  )
}

function RetailerCard({ retailer, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(retailer.id)}
      className={`group relative w-full text-left rounded-2xl border-2 transition-all duration-200 p-5 ${
        selected
          ? 'border-gold bg-gold/5 shadow-lg scale-[1.02]'
          : 'border-cream bg-white hover:border-gold/40 hover:shadow-md hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{retailer.emoji}</span>
        <div className="min-w-0">
          <p className={`font-display font-semibold text-sm leading-tight ${selected ? 'text-gold' : 'text-slate'}`}>
            {retailer.name}
          </p>
          <p className="font-body text-xs text-slate-lt mt-0.5 leading-tight">{retailer.tagline}</p>
        </div>
      </div>
      {retailer.type === 'specialist' && (
        <span className="absolute top-3 right-3 text-[10px] font-body font-medium bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">
          Specialist
        </span>
      )}
    </button>
  )
}

function RetailerProfile({ retailer, wineCount }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
      {/* Coloured header */}
      <div className={`bg-gradient-to-r ${retailer.bg} rounded-3xl overflow-hidden`}>
        <div className="px-8 py-10 md:px-12 md:py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{retailer.emoji}</span>
                {retailer.type === 'specialist' && (
                  <span className="font-body text-xs font-medium bg-white/20 text-white/90 px-3 py-1 rounded-full">
                    Independent Specialist
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                {retailer.name}
              </h2>
              <p className="font-body text-white/70 text-lg">{retailer.tagline}</p>
            </div>
            {wineCount > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shrink-0">
                <p className="font-display font-bold text-3xl text-white">{wineCount}</p>
                <p className="font-body text-white/70 text-sm mt-0.5">wines in our guide</p>
              </div>
            )}
          </div>

          {/* Vibe quote */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="font-body text-white/90 text-base md:text-lg leading-relaxed italic">
              "{retailer.vibe}"
            </p>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Brilliant at */}
        <div className="bg-white rounded-2xl border border-cream p-6">
          <h3 className="font-display font-semibold text-base text-slate mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/15 flex items-center justify-center">
              <CheckIcon />
            </span>
            <span className="text-sage">Brilliant at</span>
          </h3>
          <ul className="space-y-2.5">
            {retailer.brilliantAt.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 font-body text-sm text-slate">
                <CheckIcon className="text-sage w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-slate-lt leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Worth knowing */}
        <div className="bg-white rounded-2xl border border-cream p-6">
          <h3 className="font-display font-semibold text-base text-slate mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center">
              <InfoIcon />
            </span>
            <span className="text-gold">Worth knowing</span>
          </h3>
          <ul className="space-y-2.5">
            {retailer.worthKnowing.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 font-body text-sm text-slate">
                <InfoIcon className="text-gold w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-slate-lt leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          {/* Our Take */}
          <div className="mt-5 pt-5 border-t border-cream">
            <p className="font-body text-xs font-medium text-slate-lt uppercase tracking-wider mb-2">Our Take</p>
            <p className="font-body text-sm text-slate leading-relaxed">{retailer.ourTake}</p>
          </div>
        </div>
      </div>

      {/* Pro tip */}
      <div className="mt-4 bg-gold/8 border border-gold/20 rounded-2xl px-6 py-4 flex items-start gap-3">
        <span className="text-xl shrink-0">💡</span>
        <div>
          <span className="font-body text-xs font-semibold text-gold uppercase tracking-wider">Pro tip · </span>
          <span className="font-body text-sm text-slate">{retailer.tip}</span>
        </div>
      </div>
    </div>
  )
}

function WineSection({ wines: wineList, retailer }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12 pb-20">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-display font-semibold text-xl text-slate">
          {retailer.name} wines in our guide
        </h3>
        <Link
          to={`/explore?retailer=${encodeURIComponent(retailer.name)}`}
          className="font-body text-sm text-gold hover:text-gold/70 transition-colors"
        >
          View all in Explorer →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wineList.map(wine => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </div>
      {wineList.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-slate-lt text-sm">No wines from this retailer in the current guide.</p>
          <p className="font-body text-slate-lt text-xs mt-1">We're expanding the database — check back soon.</p>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Shop() {
  const [selectedId, setSelectedId] = useState('waitrose')

  const selected = RETAILERS.find(r => r.id === selectedId)

  const retailerWines = useMemo(() => {
    if (!selected) return []
    return wines.filter(w =>
      w.whereToBuy?.some(b => b.name === selected.name)
    )
  }, [selected])

  return (
    <div className="min-h-screen bg-ivory pt-16">

      {/* Hero */}
      <div className="bg-slate">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
          <p className="section-label text-gold/70 mb-3">The Honest Guide</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Know Your Shop
          </h1>
          <p className="font-body text-white/60 text-lg max-w-2xl leading-relaxed">
            Not all supermarket wine aisles were created equal. Here's the unvarnished truth about
            where to spend your money — and what to reach for when you get there.
          </p>
        </div>
      </div>

      {/* Retailer selector grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <p className="font-body text-sm text-slate-lt mb-4">Select a retailer</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {RETAILERS.map(r => (
            <RetailerCard
              key={r.id}
              retailer={r}
              selected={selectedId === r.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      {/* Retailer profile */}
      {selected && (
        <RetailerProfile retailer={selected} wineCount={retailerWines.length} />
      )}

      {/* Their wines */}
      <WineSection wines={retailerWines} retailer={selected} />
    </div>
  )
}
