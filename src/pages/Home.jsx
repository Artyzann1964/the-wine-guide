import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { AmandaAvatar, AmandaBrandGlyph } from '../components/Logo'
import { wines } from '../data/wines'

const DISCOVERY_MODES = [
  {
    id: 'dinner',
    label: 'Dinner Ready',
    description: 'Find a bottle for what is cooking tonight.',
    ctaLabel: 'Open Pairing Wizard',
    ctaTo: '/pairing',
    chips: ['Roast chicken', 'Sea bass', 'Mushroom risotto', 'Steak night'],
  },
  {
    id: 'discover',
    label: 'Discover Regions',
    description: 'Jump into classic countries and benchmark grapes.',
    ctaLabel: 'Explore By Country',
    ctaTo: '/explore',
    chips: ['France', 'Italy', 'Spain', 'Argentina'],
  },
  {
    id: 'cellar',
    label: 'Build My Cellar',
    description: 'Start a personal shortlist for future drinking windows.',
    ctaLabel: 'Start My Cellar',
    ctaTo: '/cellar',
    chips: ['First Growth', 'Riesling', 'Vintage Port', 'Barolo'],
  },
]

const DISCOVERY_FLIGHTS = [
  {
    id: 'icons',
    label: 'Icon Bottles',
    description: 'Big names when only the best will do.',
    wineIds: ['chateau-margaux-2015', 'dom-perignon-2013', 'trimbach-clos-ste-hune', 'chateau-yquem-2015'],
    link: '/explore?price=luxury',
  },
  {
    id: 'smart-buys',
    label: 'Smart Buys',
    description: 'High score for the money from supermarket shelves.',
    wineIds: ['tesco-finest-chablis', 'aldi-exquisite-rioja-reserva', 'asda-extra-special-barossa-shiraz', 'waitrose-muga-rioja-reserva'],
    link: '/explore?sort=value',
  },
  {
    id: 'weekend',
    label: 'Weekend Pairings',
    description: 'Crowd-pleasers for Friday to Sunday cooking.',
    wineIds: ['penfolds-grange', 'vega-sicilia-unico', 'barolo-conterno', 'bollinger-special-cuvee'],
    link: '/pairing',
  },
]

const QUICK_ROUTES = [
  { label: 'Places', sub: "Amanda's favourite venues", to: '/places', icon: 'places' },
  { label: 'Sparkling', sub: 'Bubbles, methods, styles', to: '/sparkling', icon: 'sparkling' },
  { label: 'Red', sub: 'Power to perfume spectrum', to: '/explore?category=red', icon: 'red' },
  { label: 'White', sub: 'Mineral, textured, aromatic', to: '/explore?category=white', icon: 'white' },
  { label: 'Rosé', sub: 'Dry Provence to gastronomic', to: '/explore?category=rosé', icon: 'rose' },
  { label: 'Critics', sub: 'Who to trust and why', to: '/critics', icon: 'critics' },
  { label: 'Learn', sub: 'Wine school and glass guide', to: '/learn', icon: 'learn' },
]

const AMANDA_TOP_THREE = [
  {
    name: 'Gill & Co.',
    to: '/places?venue=gill-and-co',
    note: 'Discovery nights and by-the-glass exploration.',
  },
  {
    name: 'The Harritt Wine Bar',
    to: '/places?venue=harritt-wine-bar',
    note: 'Food-led evenings with serious bottle choices.',
  },
  {
    name: 'Rafters Restaurant',
    to: '/places?venue=rafters-restaurant',
    note: 'Special-occasion dining with premium glasses.',
  },
]

const RETAILERS = [
  { name: 'Tesco', to: '/explore?retailer=Tesco' },
  { name: "Sainsbury's", to: "/explore?retailer=Sainsbury's" },
  { name: 'Waitrose', to: '/explore?retailer=Waitrose' },
  { name: 'Asda', to: '/explore?retailer=Asda' },
  { name: 'M&S', to: '/explore?retailer=M%26S' },
  { name: 'Aldi', to: '/explore?retailer=Aldi' },
  { name: 'Lidl', to: '/explore?retailer=Lidl' },
  { name: 'Morrisons', to: '/explore?retailer=Morrisons' },
  { name: 'Majestic', to: '/explore?retailer=Majestic' },
  { name: 'Le Bon Vin', to: '/explore?retailer=Le+Bon+Vin' },
]

const REGIONS = [
  { label: 'France', to: '/explore?country=France' },
  { label: 'Italy', to: '/explore?country=Italy' },
  { label: 'Spain', to: '/explore?country=Spain' },
  { label: 'Germany', to: '/explore?country=Germany' },
  { label: 'Argentina', to: '/explore?country=Argentina' },
  { label: 'England', to: '/explore?country=England' },
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState(DISCOVERY_MODES[0].id)
  const [flight, setFlight] = useState(DISCOVERY_FLIGHTS[0].id)
  const navigate = useNavigate()
  const countries = useMemo(() => new Set(wines.map(w => w.country)).size, [])
  const regions = useMemo(() => new Set(wines.map(w => w.region)).size, [])
  const sparklingCount = useMemo(() => wines.filter(w => w.category === 'sparkling').length, [])

  const activeMode = DISCOVERY_MODES.find(item => item.id === mode) || DISCOVERY_MODES[0]
  const activeFlight = DISCOVERY_FLIGHTS.find(item => item.id === flight) || DISCOVERY_FLIGHTS[0]
  const featured = activeFlight.wineIds.map(id => wines.find(w => w.id === id)).filter(Boolean)
  const leadFeatured = featured[0] || null

  const handlePromptSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    navigate(`/pairing?q=${encodeURIComponent(prompt.trim())}`)
  }

  return (
    <main>
      <section className="hero-mesh relative overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/72 via-[#232743]/40 to-transparent" />
          {/* Amanda ghost — left side, fades toward the centre and bottom */}
          <div className="absolute left-0 top-0 bottom-0 w-[50vw] max-w-[620px] overflow-hidden">
            <img
              src="/amanda-eindhoven.jpg"
              alt=""
              className="absolute left-0 top-0 h-full w-full object-cover opacity-[0.24] grayscale brightness-95"
              style={{
                objectPosition: '12% 10%',
                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.86) 34%, rgba(0,0,0,0.42) 64%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%)',
                WebkitMaskComposite: 'destination-in',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.86) 34%, rgba(0,0,0,0.42) 64%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%)',
                maskComposite: 'intersect',
              }}
            />
          </div>
          <div className="hero-orb w-60 h-60 bg-gold/30 right-[14%] top-[8%] animate-drift" />
          <div className="hero-orb w-44 h-44 bg-terracotta/20 left-[30%] bottom-[12%] animate-drift" style={{ animationDelay: '1.3s' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid xl:grid-cols-[1.25fr_0.95fr] gap-8 lg:gap-10 items-stretch">
            <div className="text-white animate-fade-up">
              <p className="section-label text-gold-lt/90 mb-4">Amanda's faster, sharper wine companion</p>
              <h1 className="font-display text-[3.1rem] leading-[0.95] sm:text-6xl lg:text-7xl max-w-2xl mb-5">
                Your best bottle,
                <span className="block text-gradient-gold">for every moment.</span>
              </h1>
              <p className="font-body text-base sm:text-lg text-white/76 max-w-xl leading-relaxed">
                Filter fast, compare styles, trust the right critics, and go from craving to confident choice in seconds.
              </p>
              <p className="font-body text-xs uppercase tracking-[0.18em] text-white/45 mt-3">
                Amanda's Wine Guide · by Richard
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link to="/explore" className="btn-primary">Explore All Wines</Link>
                <Link to={activeMode.ctaTo} className="btn-secondary">{activeMode.ctaLabel}</Link>
              </div>

              <form onSubmit={handlePromptSubmit} className="surface-panel mt-7 p-4 sm:p-5 max-w-xl">
                <p className="font-body text-xs tracking-[0.18em] uppercase text-slate-lt/80 mb-2">What are you cooking?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g. lobster pasta, lamb shoulder..."
                    className="flex-1 min-w-0 font-body text-sm px-4 py-2.5 rounded-full bg-white border border-cream focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <button type="submit" className="btn-primary px-5 py-2.5">Match</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeMode.chips.map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => navigate(`/pairing?q=${encodeURIComponent(chip)}`)}
                      className="chip bg-cream text-slate-lt hover:bg-gold/15 hover:text-slate"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="surface-panel interactive-lift p-4 sm:p-6 flex flex-col justify-between animate-fade-up" style={{ animationDelay: '0.08s' }}>
              <div className="rounded-2xl p-4 sm:p-5 bg-slate text-white relative overflow-hidden">
                <div className="absolute w-52 h-52 rounded-full bg-gold/10 -top-16 -right-14" />
                <p className="font-body text-[11px] tracking-[0.2em] uppercase text-gold-lt/80 mb-4">Amanda's Sommelier Mode</p>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-4">
                    <AmandaAvatar size={46} />
                    <AmandaBrandGlyph size={40} />
                    <div>
                      <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold-lt/70">The</p>
                      <p className="font-display text-5xl leading-none">Wine Guide</p>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-display text-2xl leading-tight">Life is too short for guesswork.</p>
                    <p className="font-body text-sm text-white/70 mt-2">Curated picks, clear reasons, better evenings.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Wines', value: wines.length },
                  { label: 'Countries', value: countries },
                  { label: 'Regions', value: regions },
                  { label: 'Sparkling', value: sparklingCount },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="font-body text-xs uppercase tracking-[0.16em] text-slate-lt mb-2">Start From Intent</p>
                <div className="flex flex-wrap gap-2">
                  {DISCOVERY_MODES.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setMode(item.id)}
                      className={`chip ${
                        item.id === mode
                          ? 'bg-slate text-white shadow-card'
                          : 'bg-white text-slate-lt border border-cream hover:border-gold/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="font-body text-sm text-slate-lt mt-2">{activeMode.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] mb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-label mb-1">Quick Launch</p>
                <h2 className="font-display text-4xl text-slate">Tap and go</h2>
              </div>
              <Link to={activeMode.ctaTo} className="hidden md:inline btn-ghost">Open active mode →</Link>
            </div>
            <div className="surface-panel p-4 sm:p-5">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Current mode</p>
              <p className="font-display text-2xl text-slate">{activeMode.label}</p>
              <p className="font-body text-sm text-slate-lt mt-2">{activeMode.description}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 stagger">
            {QUICK_ROUTES.map(item => (
              <Link key={item.label} to={item.to} className="card interactive-lift p-4 flex items-start gap-3 hover:-translate-y-0.5">
                <RouteIcon type={item.icon} />
                <div>
                  <p className="font-display text-xl text-slate leading-tight">{item.label}</p>
                  <p className="font-body text-sm text-slate-lt mt-1">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="surface-panel p-5 lg:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] mb-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="section-label mb-1">Amanda's Top 3</p>
                  <h2 className="font-display text-4xl text-slate">Her favourite Sheffield picks</h2>
                </div>
                <Link to="/places" className="btn-ghost">Open full Places guide →</Link>
              </div>
              <div className="rounded-2xl border border-cream bg-white/70 p-4">
                <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Places cue</p>
                <p className="font-display text-2xl text-slate">Food-first evenings</p>
                <p className="font-body text-sm text-slate-lt mt-2">
                  Amanda&apos;s shortlist leans toward venues where the bottle list and the kitchen are equally worth the trip.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3 stagger">
              {AMANDA_TOP_THREE.map((place, index) => (
                <Link key={place.name} to={place.to} className="card interactive-lift p-4 hover:-translate-y-0.5">
                  <p className="section-label mb-1">Favourite {index + 1}</p>
                  <p className="font-display text-2xl text-slate leading-tight">{place.name}</p>
                  <p className="font-body text-sm text-slate-lt mt-2">{place.note}</p>
                  <p className="font-body text-xs text-gold mt-3">Jump to venue →</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-y border-cream/80 bg-white/55">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
            <div>
              <p className="font-body text-[11px] tracking-[0.22em] uppercase text-slate-lt/70 text-center lg:text-left mb-3 lg:mb-1">Shop From</p>
              <p className="font-body text-sm text-slate-lt text-center lg:text-left">
                Jump straight into the retailer shelves you actually browse, without rebuilding filters each time.
              </p>
            </div>
            <div className="rounded-2xl border border-cream bg-white/80 px-4 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-1">Retail snapshot</p>
              <p className="font-display text-2xl text-slate">{RETAILERS.length} entry points</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto thin-scroll pb-1">
            {RETAILERS.map(r => (
              <Link
                key={r.name}
                to={r.to}
                className="chip whitespace-nowrap bg-slate text-white hover:bg-slate-lt hover:-translate-y-0.5"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] mb-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-label mb-1">Curated Flights</p>
              <h2 className="font-display text-4xl text-slate">Start with the right shortlist</h2>
            </div>
            <Link to={activeFlight.link} className="btn-ghost">View this flight →</Link>
          </div>
          <div className="surface-panel p-4 sm:p-5">
            <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Flight read</p>
            <p className="font-display text-2xl text-slate">{activeFlight.label}</p>
            <p className="font-body text-sm text-slate-lt mt-2">{activeFlight.description}</p>
            {leadFeatured && (
              <p className="font-body text-sm text-gold mt-3">
                Start with {leadFeatured.name} →
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {DISCOVERY_FLIGHTS.map(item => (
            <button
              key={item.id}
              onClick={() => setFlight(item.id)}
              className={`chip ${
                item.id === flight
                  ? 'bg-gold text-white shadow-gold'
                  : 'bg-white text-slate-lt border border-cream hover:border-gold/45'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="font-body text-slate-lt mb-5">{activeFlight.description}</p>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {featured.map(wine => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </section>

      <section className="py-14 bg-white/52 border-y border-cream/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] mb-8">
            <div className="text-center lg:text-left">
              <p className="section-label mb-1">Flow</p>
              <h2 className="font-display text-4xl text-slate">Tonight in three steps</h2>
            </div>
            <div className="surface-panel p-4 sm:p-5">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Guide rhythm</p>
              <p className="font-display text-2xl text-slate">Dish → bottle → memory</p>
              <p className="font-body text-sm text-slate-lt mt-2">
                The quickest route through the guide is to start with what you are eating, compare a few credible options, then save the winner.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/pairing" className="card interactive-lift p-5 hover:-translate-y-0.5">
              <p className="font-body text-xs tracking-[0.16em] uppercase text-gold mb-2">Step 1</p>
              <p className="font-display text-2xl text-slate">Tell us the dish</p>
              <p className="font-body text-sm text-slate-lt mt-2">Cuisine, protein, heat, richness.</p>
            </Link>
            <Link to="/explore?sort=value" className="card interactive-lift p-5 hover:-translate-y-0.5">
              <p className="font-body text-xs tracking-[0.16em] uppercase text-gold mb-2">Step 2</p>
              <p className="font-display text-2xl text-slate">Compare options</p>
              <p className="font-body text-sm text-slate-lt mt-2">Score, style profile, price confidence.</p>
            </Link>
            <Link to="/cellar" className="card interactive-lift p-5 hover:-translate-y-0.5">
              <p className="font-body text-xs tracking-[0.16em] uppercase text-gold mb-2">Step 3</p>
              <p className="font-display text-2xl text-slate">Save your pick</p>
              <p className="font-body text-sm text-slate-lt mt-2">Build your cellar memory over time.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] mb-8">
          <div className="text-center lg:text-left">
            <p className="section-label mb-1">By Provenance</p>
            <h2 className="font-display text-4xl text-slate">Explore by country</h2>
          </div>
          <div className="surface-panel p-4 sm:p-5">
            <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Atlas snapshot</p>
            <p className="font-display text-2xl text-slate">{REGIONS.length} quick entries</p>
            <p className="font-body text-sm text-slate-lt mt-2">
              Jump straight into benchmark countries when you want a faster route than filtering from scratch.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REGIONS.map(region => (
            <Link
              key={region.label}
              to={region.to}
              className="card interactive-lift p-4 hover:-translate-y-0.5"
            >
              <p className="section-label mb-1">Country</p>
              <p className="font-display text-2xl text-slate leading-tight">{region.label}</p>
              <p className="font-body text-sm text-slate-lt mt-2">Open regional classics, key grapes, and standout bottles.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-14 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="surface-panel p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
            <div>
              <p className="section-label mb-2">Nights Out</p>
              <h3 className="font-display text-3xl text-slate">Amanda's favourite food and wine venues</h3>
              <p className="font-body text-slate-lt mt-2 max-w-2xl">
                Use Amanda's Places section for venue picks from Sheffield, Stroud, Morpeth and beyond, plus bottle style cues for the night.
              </p>
            </div>
            <Link to="/places" className="btn-primary whitespace-nowrap">Open Places Guide</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function RouteIcon({ type }) {
  return (
    <span className="w-11 h-11 rounded-xl bg-slate text-white flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
        {type === 'sparkling' && (
          <>
            <path d="M9.9 3v10m0 0l-2.2 4m2.2-4l2.2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13.7" cy="5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
          </>
        )}
        {type === 'red' && <path d="M10 3c2.3 0 4 2 4 4.3 0 3.2-2.2 5.7-4 5.7s-4-2.5-4-5.7C6 5 7.7 3 10 3zM8 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
        {type === 'white' && <path d="M7 3h6v3c0 2.2-1.8 4-4 4S7 8.2 7 6V3zm2 7v5m-2 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
        {type === 'rose' && <path d="M10 3c2 0 3.5 1.8 3.5 3.9S11.7 12 10 12s-3.5-3-3.5-5.1S8 3 10 3zm0 9v4m-2.5 0h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
        {type === 'critics' && (
          <>
            <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 16c1.1-1.8 2.8-2.8 5-2.8 2.2 0 3.9 1 5 2.8M15 6l1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {type === 'learn' && <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H16v13H6.5A2.5 2.5 0 0 0 4 18V5.5zm3.5 1h5m-5 3h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
        {type === 'places' && (
          <>
            <path d="M10 3l5 2v4.8c0 3.2-2.1 6.1-5 7.2-2.9-1.1-5-4-5-7.2V5l5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 9.5h4M10 7.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  )
}
