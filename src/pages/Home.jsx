import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'

const FEATURED_IDS = [
  'dom-perignon-2013',       // Sparkling — 97pts, luxury
  'chateau-margaux-2015',    // Red — 100pts, luxury
  'trimbach-clos-ste-hune',  // White — 98pts, luxury
  'chateau-yquem-2015',      // Dessert — 100pts, luxury
]

const QUICK_LINKS = [
  { label: 'Sparkling',  to: '/sparkling',            emoji: '🥂', desc: 'Champagne, Cava, Prosecco & more' },
  { label: 'White',      to: '/explore?category=white', emoji: '🍋', desc: 'Burgundy, Riesling, Sancerre & beyond' },
  { label: 'Red',        to: '/explore?category=red',   emoji: '🍷', desc: 'Bordeaux, Barolo, Shiraz & friends' },
  { label: 'Rosé',       to: '/explore?category=rosé',  emoji: '🌸', desc: 'Provence, Bandol & summer favourites' },
  { label: 'Dessert',    to: '/explore?category=dessert','emoji': '🍯', desc: 'Sauternes, Port, Tawny & more' },
  { label: 'Pairings',   to: '/pairing',               emoji: '🍽️', desc: 'Match wine to what you\'re cooking' },
]

const REGIONS = [
  { label: 'France',      to: '/explore?country=France',      emoji: '🇫🇷' },
  { label: 'Italy',       to: '/explore?country=Italy',       emoji: '🇮🇹' },
  { label: 'Spain',       to: '/explore?country=Spain',       emoji: '🇪🇸' },
  { label: 'Germany',     to: '/explore?country=Germany',     emoji: '🇩🇪' },
  { label: 'Argentina',   to: '/explore?country=Argentina',   emoji: '🇦🇷' },
  { label: 'England',     to: '/explore?country=England',     emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
]

const WINE_QUOTES = [
  { quote: `Life is too short to drink bad wine.`,                                                   author: `Goethe` },
  { quote: `In victory, you deserve Champagne; in defeat, you need it.`,                             author: `Napoleon Bonaparte` },
  { quote: `Wine is sunlight, held together by water.`,                                              author: `Galileo Galilei` },
  { quote: `My only regret in life is that I did not drink more Champagne.`,                         author: `John Maynard Keynes` },
  { quote: `Wine is bottled poetry.`,                                                                author: `Robert Louis Stevenson` },
  { quote: `I cook with wine. Sometimes I even add it to the food.`,                                 author: `W.C. Fields` },
  { quote: `A bottle of wine contains more philosophy than all the books in the world.`,             author: `Louis Pasteur` },
  { quote: `Quickly, bring me a beaker of wine so I may wet my mind and say something clever.`,     author: `Aristophanes` },
  { quote: `Wine is the most civilised thing in the world.`,                                         author: `Ernest Hemingway` },
  { quote: `Wine makes daily living easier, less hurried, with fewer tensions and more tolerance.`,  author: `Benjamin Franklin` },
  { quote: `If food is the body of good living, wine is its soul.`,                                  author: `Clifton Fadiman` },
  { quote: `Either give me more wine or leave me alone.`,                                            author: `Rumi` },
  { quote: `Age is just a number — unless you happen to be a bottle of wine.`,                       author: `Joan Collins` },
  { quote: `Beer is made by men, wine by God.`,                                                      author: `Martin Luther` },
  { quote: `Penicillin cures, but wine makes people happy.`,                                         author: `Alexander Fleming` },
  { quote: `Men are like wine — some turn to vinegar, but the best improve with age.`,               author: `Pope John XXIII` },
  { quote: `One barrel of wine can work more miracles than a church full of saints.`,                author: `Italian Proverb` },
  { quote: `A meal without wine is like a day without sunshine.`,                                    author: `Jean-Anthelme Brillat-Savarin` },
  { quote: `To take wine into our mouths is to savour a droplet of the river of human history.`,    author: `Clifton Fadiman` },
  { quote: `We are all mortal until the first kiss and the second glass of wine.`,                   author: `Eduardo Galeano` },
  { quote: `A glass of wine is a great cure for a bad day.`,                                         author: `Anonymous` },
  { quote: `Wine is proof that God loves us and wants us to be happy.`,                              author: `Benjamin Franklin` },
  { quote: `Compromises are for relationships, not wine.`,                                           author: `Robert Scott Caywood` },
  { quote: `Wine is the answer. What was the question?`,                                             author: `Unknown` },
  { quote: `The best wines are the ones we drink with friends.`,                                     author: `Unknown` },
  { quote: `A good wine is like a good friend. It will be with you for life.`,                       author: `Unknown` },
  { quote: `I only drink Champagne on two occasions: when I am in love and when I am not.`,          author: `Coco Chanel` },
  { quote: `With wine and hope, anything is possible.`,                                              author: `Spanish Proverb` },
]

const PAIRING_PROMPTS = [
  'Coq au vin', 'Sunday roast beef', 'Lobster thermidor',
  'Mushroom risotto', 'Thai green curry', 'Stilton & Port',
]

const RETAILERS = [
  { name: 'Tesco',       bg: '#00539F', color: '#fff',     to: '/explore?retailer=Tesco' },
  { name: "Sainsbury's", bg: '#EB6100', color: '#fff',     to: "/explore?retailer=Sainsbury's" },
  { name: 'Waitrose',    bg: '#3d6b34', color: '#fff',     to: '/explore?retailer=Waitrose' },
  { name: 'Asda',        bg: '#78BE20', color: '#1a3a00',  to: '/explore?retailer=Asda' },
  { name: 'M&S',         bg: '#0A4F2E', color: '#fff',     to: '/explore?retailer=M%26S' },
  { name: 'Aldi',        bg: '#1e3764', color: '#fff',     to: '/explore?retailer=Aldi' },
  { name: 'Lidl',        bg: '#0050aa', color: '#fff',     to: '/explore?retailer=Lidl' },
  { name: 'Morrisons',   bg: '#FFD700', color: '#004225',  to: '/explore?retailer=Morrisons' },
  { name: 'Majestic',    bg: '#2C2C3E', color: '#C9973A',  to: '/explore?retailer=Majestic' },
  { name: 'Le Bon Vin',  bg: '#7B1D2E', color: '#F7E7CE',  to: '/explore?retailer=Le+Bon+Vin' },
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const featured = FEATURED_IDS.map(id => wines.find(w => w.id === id)).filter(Boolean)
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * WINE_QUOTES.length))
  const [quoteFade, setQuoteFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % WINE_QUOTES.length)
        setQuoteFade(true)
      }, 400)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const handlePromptSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      navigate(`/pairing?q=${encodeURIComponent(prompt.trim())}`)
    }
  }

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-ivory">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-gold/4 translate-x-40" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-terracotta/4 translate-y-16 -translate-x-16" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <p className="section-label mb-4">A world-class wine companion</p>
            <h1 className="font-display text-6xl lg:text-7xl font-light text-slate leading-[1.05] mb-6">
              Discover the<br />
              <em className="text-gold not-italic">world of wine</em>
            </h1>
            <p className="font-body text-lg text-slate-lt leading-relaxed mb-10 max-w-lg">
              From Champagne to Barolo, Sancerre to Sauternes — explore curated wines from every corner of the globe, understand what makes them great, and learn exactly what to cook with them.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/explore" className="btn-primary">Explore the Guide</Link>
              <Link to="/pairing" className="btn-secondary">Find a Pairing</Link>
            </div>

            {/* Pairing prompt */}
            <form onSubmit={handlePromptSubmit} className="max-w-md">
              <p className="font-body text-sm text-slate-lt mb-2">What are you cooking tonight?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. duck confit, lobster bisque..."
                  className="flex-1 font-body text-sm px-4 py-2.5 rounded-full border border-cream bg-white/80
                             focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
                  Match →
                </button>
              </div>
              {/* Quick prompts */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PAIRING_PROMPTS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => navigate(`/pairing?q=${encodeURIComponent(p)}`)}
                    className="font-body text-xs px-2.5 py-1 rounded-full bg-cream text-slate-lt hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </form>

            {/* Stats strip — visible at md–lg only (tablet; desktop handled by right column) */}
            <div className="hidden md:flex lg:hidden gap-4 mt-8">
              {[
                { n: '232', label: 'Wines' },
                { n: '20+', label: 'Countries' },
                { n: '90+', label: 'Regions' },
                { n: '∞',   label: 'Pairings' },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col items-center px-4 py-3 rounded-xl border border-cream bg-white/60 flex-1">
                  <p className="font-display text-2xl font-light text-gold">{n}</p>
                  <p className="font-body text-xs text-slate-lt">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — Amanda portrait + stats */}
          <div className="hidden lg:flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>

            {/* Amanda portrait panel */}
            <div className="rounded-2xl overflow-hidden shadow-hover" style={{ background: 'rgba(26,26,46,1)' }}>
              <div className="flex items-stretch">
                {/* Photo */}
                <div className="w-44 flex-shrink-0">
                  <img
                    src="/amanda-holmes.png"
                    alt="Amanda Holmes — Creator of The Wine Guide"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: 'grayscale(100%) contrast(1.05) brightness(0.95)', minHeight: '210px' }}
                  />
                </div>
                {/* Quote */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <p className="font-body text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: 'rgba(201,151,58,0.65)' }}>
                    From the creator
                  </p>
                  <p className="font-display text-lg lg:text-xl font-light italic text-white leading-snug mb-3">
                    "Life is too short for bad Champagne — and too wonderful not to find the good stuff."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px" style={{ background: 'rgba(201,151,58,0.4)' }} />
                    <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Amanda Holmes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { n: '232', label: 'Wines' },
                { n: '20+', label: 'Countries' },
                { n: '90+', label: 'Regions' },
                { n: '∞',   label: 'Pairings' },
              ].map(({ n, label }) => (
                <div key={label} className="card p-4 text-center">
                  <p className="font-display text-3xl font-light text-gold mb-0.5">{n}</p>
                  <p className="font-body text-xs text-slate-lt">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── RETAILER STRIP ───────────────────────────────── */}
      <section className="py-8 bg-white border-y border-cream/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="font-body text-[11px] text-slate-lt/50 text-center mb-5 tracking-[0.22em] uppercase">
            Wines sourced from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {RETAILERS.map(({ name, bg, color, to }) => (
              <Link
                key={name}
                to={to}
                className="font-body text-sm font-semibold px-4 py-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-200"
                style={{ background: bg, color }}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK CATEGORY LINKS ─────────────────────────── */}
      <section className="py-16 bg-white border-y border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label text-center mb-8">Explore by style</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger">
            {QUICK_LINKS.map(({ label, to, emoji, desc }) => (
              <Link
                key={label}
                to={to}
                className="card p-4 text-center hover:-translate-y-1 transition-all duration-300 group animate-fade-up"
              >
                <span className="text-3xl mb-2 block">{emoji}</span>
                <p className="font-display font-semibold text-slate text-base">{label}</p>
                <p className="font-body text-xs text-slate-lt mt-1 leading-tight">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED WINES ───────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Editor's selection</p>
            <h2 className="font-display text-4xl text-slate">Featured Wines</h2>
          </div>
          <Link to="/explore" className="btn-ghost hidden sm:block">View all wines →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {featured.map(wine => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link to="/explore" className="btn-secondary">View all wines</Link>
        </div>
      </section>

      {/* ── SPARKLING CALLOUT ─────────────────────────────── */}
      <section className="bg-slate text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-gold mb-4">Special deep dive</p>
              <h2 className="font-display text-4xl lg:text-5xl font-light leading-tight mb-5">
                The Art of<br />
                <em className="text-gold not-italic">Sparkling Wine</em>
              </h2>
              <p className="font-body text-white/70 leading-relaxed mb-8 max-w-lg">
                From the ancient riddling caves of Champagne to the sun-drenched hillsides of Cartizze — discover how six very different methods create six very different wines, and why the bubbles in your glass tell a story.
              </p>
              <Link to="/sparkling" className="btn-primary">
                Explore Sparkling Wines
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Champagne', method: 'Traditional Method', emoji: '🥂' },
                { label: 'Cava',      method: 'Traditional Method', emoji: '🍾' },
                { label: 'Prosecco', method: 'Charmat / Tank',     emoji: '✨' },
                { label: 'Crémant',  method: 'Traditional Method', emoji: '🫧' },
                { label: 'English',  method: 'Traditional Method', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                { label: 'Pét-Nat',  method: 'Ancestral Method',   emoji: '🌿' },
              ].map(({ label, method, emoji }) => (
                <Link
                  key={label}
                  to={`/sparkling#${label.toLowerCase()}`}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-3 text-center transition-colors"
                >
                  <span className="text-2xl block mb-1">{emoji}</span>
                  <p className="font-display text-sm text-white font-medium">{label}</p>
                  <p className="font-body text-[10px] text-white/40 mt-0.5">{method}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY COUNTRY ───────────────────────────── */}
      <section className="py-20 bg-cream/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="section-label mb-2">By provenance</p>
            <h2 className="font-display text-4xl text-slate">Explore by Country</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {REGIONS.map(({ label, to, emoji }) => (
              <Link
                key={label}
                to={to}
                className="card px-5 py-3 flex items-center gap-2.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-xl">{emoji}</span>
                <span className="font-body text-sm font-medium text-slate">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOD PAIRING CTA ─────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="card p-8 lg:p-12 bg-gradient-to-br from-terracotta/5 to-gold/5">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="section-label mb-3">For the kitchen</p>
              <h2 className="font-display text-4xl text-slate mb-4">
                What Wine with<br /><em className="text-terracotta not-italic">Tonight's Dinner?</em>
              </h2>
              <p className="font-body text-slate-lt leading-relaxed mb-6">
                Our food pairing wizard matches your dish to the perfect wine — and explains exactly <em>why</em> the pairing works, from the science of tannins and fat to the logic of regional affinity.
              </p>
              <Link to="/pairing" className="btn-primary">Open the Pairing Wizard</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['🍗', 'Coq au Vin', 'Burgundy Pinot Noir'],
                ['🦞', 'Lobster Thermidor', 'White Burgundy'],
                ['🥩', 'Steak Frites', 'Bordeaux Rouge'],
                ['🧀', 'Stilton & Walnuts', 'Vintage Port'],
              ].map(([emoji, dish, wine]) => (
                <Link
                  key={dish}
                  to={`/pairing?q=${encodeURIComponent(dish)}`}
                  className="bg-white rounded-xl p-4 hover:shadow-hover transition-all duration-200"
                >
                  <span className="text-2xl block mb-2">{emoji}</span>
                  <p className="font-display text-sm font-medium text-slate leading-tight">{dish}</p>
                  <p className="font-body text-xs text-gold mt-1">{wine}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
