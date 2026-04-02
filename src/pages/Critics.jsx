import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { wines } from '../data/wines'
import { getWineVintageLabel } from '../utils/wineDisplay'

// ── Tom Gilbey's Pass / Class / Arse system ────────────────────────────────────
const GILBY_TIERS = [
  {
    rating: 'class',
    label:  'CLASS ✨',
    bg:     '#C9973A',
    text:   '#1A1A2E',
    desc:   `This is the good stuff. Tom's highest honour — a wine worth seeking out, recommending to friends, and buying by the case if the price is right.`,
  },
  {
    rating: 'pass',
    label:  'PASS 👍',
    bg:     '#4A6741',
    text:   '#FFFFFF',
    desc:   `Decent and drinkable. Not exciting, but it won't offend anyone either. Buy it when nothing better is available on the shelf.`,
  },
  {
    rating: 'arse',
    label:  'ARSE 💀',
    bg:     '#8B2040',
    text:   '#FFFFFF',
    desc:   `Avoid. Life is genuinely too short for this bottle. Put it back, walk to the next aisle, and buy literally anything else.`,
  },
]

// ── Critic profiles ────────────────────────────────────────────────────────────
const CRITICS = [
  {
    id:       'tom-gilbey',
    name:     'Tom Gilbey',
    title:    'The People\'s Wine Guy',
    emoji:    '🎬',
    bio:      `Tom Gilbey is a Master of Wine and wine educator who became a genuine phenomenon on YouTube — reviewing supermarket wines with honesty, humour and zero pretension. His three-tier rating system (Pass / Class / Arse) has done more to demystify wine than most textbooks. Accessible, occasionally sweary, and always entertaining.`,
    specialty: `Supermarket wines · Value hunting · UK retail`,
    scoring:  `Pass / Class / Arse — his three-tier system cuts through the noise. No points, no percentages, just an honest verdict.`,
    links: [
      { label: 'YouTube', url: 'https://www.youtube.com/@TomGilby', icon: '▶' },
      { label: 'Instagram', url: 'https://www.instagram.com/tomgilbymw', icon: '📷' },
    ],
    gilby: true,
    youtubeHandle: 'TomGilby',
    colour: '#C9973A',
    photo: '/critic-tom-gilbey.jpg',
    topPickIds: ['aldi-cremant-du-jura', 'tesco-finest-english-sparkling', 'waitrose-cune-rioja'],
    quote: `"There are more genuinely good bottles on supermarket shelves right now than at any point in my career. The problem isn't the wine — it's knowing which one to pick up."`,
  },
  {
    id:       'jancis-robinson',
    name:     'Jancis Robinson MW',
    title:    'The Queen of Wine',
    emoji:    '📚',
    bio:      `Jancis Robinson is arguably the most respected wine critic in the world. A Master of Wine since 1984, she writes for the Financial Times, runs JancisRobinson.com, and co-authored The Oxford Companion to Wine. Her palate is legendary, her prose beautiful, and her scoring system — based around 17 as a "perfectly fine wine" — is deliberately understated.`,
    specialty: `Fine wine · Bordeaux · White Burgundy · Germany`,
    scoring:  `Scored out of 20. A score of 17 means "perfectly pleasant" — she reserves 19–20 for genuinely extraordinary bottles. Context and nuance over raw numbers.`,
    links: [
      { label: 'JancisRobinson.com', url: 'https://www.jancisrobinson.com', icon: '🌐' },
      { label: 'Financial Times', url: 'https://www.ft.com/topics/people/Jancis_Robinson', icon: '📰' },
    ],
    colour: '#2C2C3E',
    photo: '/critic-jancis-robinson.jpg',
    topPickIds: ['dom-perignon-2013', 'chateau-margaux-2015', 'chateau-yquem-2015'],
    quote: `"The most exciting discovery you can make is a bottle that punches well above its price. That's still happening — you just have to be curious enough to look beyond the familiar labels."`,
  },
  {
    id:       'tim-atkin',
    name:     'Tim Atkin MW',
    title:    'The Specialist',
    emoji:    '🏅',
    bio:      `Tim Atkin MW is a wine journalist and broadcaster who has been writing about wine since 1987. He holds a Master of Wine qualification and is known for his rigorous annual reports on Spain, South Africa, Argentina and Chile. His scores carry significant weight in the trade and with serious collectors.`,
    specialty: `Spain · South Africa · Argentina · Chile`,
    scoring:  `Scored out of 100 using the Parker scale. 90+ is the benchmark for recommendation; 95+ is exceptional. He provides clear tasting notes alongside each score.`,
    links: [
      { label: 'timatkin.com', url: 'https://timatkin.com', icon: '🌐' },
    ],
    colour: '#4A6741',
    photo: '/critic-tim-atkin.png',
    topPickIds: ['waitrose-muga-rioja-reserva', 'trivento-reserve-malbec', 'barolo-conterno'],
    quote: `"South Africa is producing some of the most exciting wines on the planet right now. If you're not paying attention, you're missing the story of the decade."`,
  },
  {
    id:       'decanter',
    name:     'Decanter Magazine',
    title:    'The Bible',
    emoji:    '📖',
    bio:      `Founded in 1975, Decanter is the UK's definitive fine wine magazine and home of the Decanter World Wine Awards — the world's largest wine competition. Its expert panel includes Masters of Wine and Masters of Sommeliers. A Decanter recommendation carries enormous weight on the retail shelf.`,
    specialty: `All regions · Annual DWWA competition · Fine wine focus`,
    scoring:  `Medals: Bronze (87–89), Silver (90–94), Gold (95–97), Platinum (98–100). The coveted Best in Show is awarded to the very finest bottles from all categories.`,
    links: [
      { label: 'decanter.com', url: 'https://www.decanter.com', icon: '🌐' },
      { label: 'YouTube', url: 'https://www.youtube.com/@DecanterTV', icon: '▶' },
      { label: 'DWWA', url: 'https://www.decanter.com/wine-news/dwwa/', icon: '🏆' },
    ],
    youtubeHandle: 'DecanterTV',
    colour: '#C4622D',
    photo: '/critic-decanter.webp',
    topPickIds: ['bollinger-special-cuvee', 'chateau-margaux-2015', 'waitrose-prunotto-barolo'],
    quote: `"The best wine isn't just about the score. It's about the conversation it starts, the memory it creates, and the value it represents in the glass."`,
  },
  {
    id:       'oz-clarke',
    name:     'Oz Clarke',
    title:    'The Enthusiast',
    emoji:    '😄',
    bio:      `Oz Clarke is the wine world's great communicator — exuberant, knowledgeable, and utterly infectious in his enthusiasm. A former classical actor, he brings drama and warmth to wine that few critics can match. Best known for the TV series Oz and James's Big Wine Adventure with James May, and his accessible annual Pocket Wine Book.`,
    specialty: `Accessible wine · New World · Enthusiast-friendly writing`,
    scoring:  `No formal numerical system — Oz prefers words to numbers. His writing describes flavours vividly and accessibly, often with cultural and emotional context.`,
    links: [
      { label: 'ozclarke.com', url: 'https://www.ozclarke.com', icon: '🌐' },
    ],
    colour: '#7B2D3E',
    photo: '/critic-oz-clarke.jpg',
    topPickIds: ['cloudy-bay-sauvignon', 'tesco-finest-barossa-shiraz', 'sainsbur-zuccardi-poligonos-altamira-malbec'],
    quote: `"I've tasted wines this year that have genuinely stopped me in my tracks — not because they were expensive, but because they were completely unexpected. That surprise is what keeps wine endlessly worth drinking."`,
  },
  {
    id:       'matthew-jukes',
    name:     'Matthew Jukes',
    title:    'The Crowd-Pleaser',
    emoji:    '🍽️',
    bio:      `Matthew Jukes writes for The Daily Mail and has been one of the UK's most widely-read wine columnists for over two decades. Known for his food-friendly recommendations and mainstream accessibility, he is particularly strong on value wines and practical pairing advice.`,
    specialty: `Food pairings · Value wine · Mainstream UK retail`,
    scoring:  `Descriptive prose with clear recommendations. Focuses on drinkability and food compatibility rather than technical critique.`,
    links: [
      { label: 'matthewjukes.com', url: 'https://www.matthewjukes.com', icon: '🌐' },
    ],
    colour: '#3D5A80',
    photo: '/critic-matthew-jukes.jpg',
    topPickIds: ['puligny-montrachet-leflaive', 'sainsburys-ttd-cotes-du-rhone', 'baron-de-ley-rioja-reserva'],
    quote: `"My job isn't to tell you what the greatest wine in the world is. It's to help you find the one that tastes best with tonight's dinner."`,
  },
]

// ── Component helpers ──────────────────────────────────────────────────────────

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function CriticAvatar({ critic, size = 'md', frosted = false }) {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-2xl',
  }
  if (critic.photo) {
    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0 ring-2 ${frosted ? 'ring-white/40' : 'ring-white/20'}`}>
        <img
          src={critic.photo}
          alt={critic.name}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }
  const style = frosted
    ? { background: 'rgba(255,255,255,0.18)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', letterSpacing: '0.06em' }
    : { background: critic.colour, color: '#fff', letterSpacing: '0.06em' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0 select-none`}
      style={style}
    >
      {getInitials(critic.name)}
    </div>
  )
}

function CriticCard({ critic, onSelect, isSelected }) {
  return (
    <button
      onClick={() => onSelect(critic.id)}
      className={`card p-5 text-left w-full transition-all duration-200 hover:-translate-y-0.5 ${
        isSelected ? 'ring-2 ring-gold shadow-gold' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <CriticAvatar critic={critic} size="md" />
        <div>
          <h3 className="font-display text-lg font-semibold text-slate leading-tight">{critic.name}</h3>
          <p className="font-body text-xs text-slate-lt">{critic.title}</p>
        </div>
      </div>
      <p className="font-body text-xs text-slate-lt leading-relaxed line-clamp-2">{critic.bio.split('. ')[0]}.</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {critic.specialty.split(' · ').slice(0, 2).map(s => (
          <span key={s} className="tag bg-cream text-slate-lt text-[10px]">{s}</span>
        ))}
      </div>
    </button>
  )
}

function RecentVideos({ handle }) {
  const [state, setState] = useState({ status: 'idle', videos: [] })

  useEffect(() => {
    if (!handle) return
    setState({ status: 'loading', videos: [] })
    fetch(`/api/youtube-recent?handle=${encodeURIComponent(handle)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setState({ status: 'ok', videos: data.videos || [] }))
      .catch(() => setState({ status: 'error', videos: [] }))
  }, [handle])

  if (state.status === 'loading') {
    return (
      <div className="card p-5">
        <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-3">Recent Videos</h3>
        <div className="flex items-center gap-2 text-slate-lt">
          <div className="w-4 h-4 rounded-full border-2 border-slate-lt/30 border-t-slate animate-spin flex-shrink-0" />
          <span className="font-body text-xs">Loading latest videos…</span>
        </div>
      </div>
    )
  }

  if (state.status !== 'ok' || state.videos.length === 0) return null

  return (
    <div className="card p-5">
      <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-3">Recent Videos</h3>
      <div className="space-y-2">
        {state.videos.map(v => (
          <a
            key={v.videoId}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group hover:bg-cream/70 rounded-lg p-2 -mx-2 transition-colors"
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-20 h-12 object-cover rounded-md flex-shrink-0 bg-slate/10"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-medium text-slate leading-snug line-clamp-2 group-hover:text-gold transition-colors">{v.title}</p>
              <p className="font-body text-[10px] text-slate-lt mt-1">
                {new Date(v.published).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <span className="text-slate-lt/40 group-hover:text-gold transition-colors flex-shrink-0 text-xs">↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function CriticDetail({ critic }) {
  const topPicks = critic.topPickIds
    ?.map(id => wines.find(w => w.id === id))
    .filter(Boolean) ?? []
  const specialtyAreas = critic.specialty.split(' · ')

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${critic.colour} 0%, ${critic.colour}99 100%)` }}
      >
        <div className="absolute right-6 top-6 text-6xl opacity-10">{critic.emoji}</div>
        <div className="flex items-center gap-5 mb-5">
          <CriticAvatar critic={critic} size="lg" frosted />
          <div>
            <p className="font-body text-xs tracking-[0.15em] uppercase text-white/60 mb-1">{critic.title}</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-white leading-tight">{critic.name}</h2>
          </div>
        </div>
        <p className="font-body text-sm text-white/80 leading-relaxed max-w-2xl mb-5">{critic.bio}</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-5 max-w-3xl">
          <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
            <p className="font-body text-[9px] uppercase tracking-[0.16em] text-white/50">Best known for</p>
            <p className="font-body text-sm text-white mt-1 leading-snug">{specialtyAreas[0]}</p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
            <p className="font-body text-[9px] uppercase tracking-[0.16em] text-white/50">Style</p>
            <p className="font-body text-sm text-white mt-1 leading-snug">{critic.gilby ? 'Straight verdicts' : 'Context and guidance'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
            <p className="font-body text-[9px] uppercase tracking-[0.16em] text-white/50">Top picks in guide</p>
            <p className="font-body text-sm text-white mt-1 leading-snug">{topPicks.length}</p>
          </div>
        </div>
        <p className="font-display text-lg italic text-white/90">{critic.quote}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          {/* Specialty */}
          <div className="card p-5">
            <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-3">Speciality</h3>
            <div className="flex flex-wrap gap-2">
              {critic.specialty.split(' · ').map(s => (
                <span key={s} className="tag bg-cream text-slate text-xs">{s}</span>
              ))}
            </div>
          </div>

          {/* Scoring system */}
          <div className="card p-5">
            <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-3">Scoring System</h3>
            <p className="font-body text-sm text-slate-lt leading-relaxed">{critic.scoring}</p>
          </div>

          {/* Gilbey tiers — only for Tom Gilbey */}
          {critic.gilby && (
            <div className="card p-5">
              <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-4">The Three Tiers</h3>
              <div className="space-y-3">
                {GILBY_TIERS.map(tier => (
                  <div key={tier.rating} className="flex items-start gap-3">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-bold tracking-widest flex-shrink-0"
                      style={{ backgroundColor: tier.bg, color: tier.text }}
                    >
                      {tier.label}
                    </span>
                    <p className="font-body text-xs text-slate-lt leading-relaxed pt-0.5">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="card p-5">
            <h3 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-3">Find Their Reviews</h3>
            <div className="flex flex-wrap gap-2">
              {critic.links.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors text-xs"
                >
                  {link.icon} {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Recent YouTube videos — only for critics with a channel */}
          {critic.youtubeHandle && <RecentVideos handle={critic.youtubeHandle} />}
        </div>

        {/* Top picks */}
        <div>
          <div className="surface-panel p-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
              <div>
                <p className="section-label mb-1">Champion Bottles</p>
                <h3 className="font-display text-2xl text-slate">Wines They Champion</h3>
              </div>
              <p className="font-body text-sm text-slate-lt max-w-xl">
                A small shortlist from the guide that fits this critic’s known palate, regions, or retail strengths.
              </p>
            </div>
            {topPicks.length > 0 ? (
              <div className="space-y-3">
                {topPicks.map(wine => (
                  <Link
                    key={wine.id}
                    to={`/explore/${wine.id}`}
                    className="rounded-[1.5rem] border border-cream bg-gradient-to-br from-white to-[#f5efe4] p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex-shrink-0"
                      style={{ background: wine.cardGradient || '#2C2C3E' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-slate leading-tight truncate">{wine.name}</p>
                      <p className="font-body text-xs text-slate-lt mt-0.5">{wine.producer} · {wine.region}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="tag bg-white border border-cream text-slate text-[10px]">{getWineVintageLabel(wine)}</span>
                        <span className="tag bg-cream text-slate text-[10px]">{wine.category}</span>
                      </div>
                    </div>
                    <span className="font-body text-xs font-semibold text-gold flex-shrink-0">{wine.rating}/100</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center">
                <p className="font-body text-sm text-slate-lt">
                  Explore the{' '}
                  <Link to="/explore" className="text-gold hover:underline">full wine guide</Link>
                  {' '}to find wines matching this critic's style.
                </p>
              </div>
            )}
            <div className="mt-4 p-4 rounded-xl bg-cream/60 border border-cream">
              <p className="font-body text-xs text-slate-lt leading-relaxed">
                <strong className="text-slate">Note:</strong> Wine picks shown are from our database and reflect this critic's known style preferences. For their full, current reviews visit the links above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function Critics() {
  const [selectedId, setSelectedId] = useState('tom-gilbey')
  const selected = CRITICS.find(c => c.id === selectedId) || CRITICS[0]
  const detailRef = useRef(null)
  const criticCoverage = CRITICS.reduce((count, critic) => count + (critic.topPickIds?.length || 0), 0)

  function selectCritic(nextId, shouldScroll = false) {
    setSelectedId(nextId)
    if (!shouldScroll || !detailRef.current) return
    window.requestAnimationFrame(() => {
      const top = detailRef.current.getBoundingClientRect().top + window.scrollY - 84
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  }

  return (
    <main className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="hero-mesh text-white pt-24 lg:pt-28 pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid xl:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-gold mb-3">Critics & Commentators</p>
              <h1 className="font-display text-5xl lg:text-6xl font-light leading-tight mb-4">
                Whose opinion <br />
                <em className="text-gold not-italic">actually matters?</em>
              </h1>
              <p className="font-body text-white/60 max-w-2xl leading-relaxed">
                From Tom Gilbey's supermarket shelf verdicts to Jancis Robinson's authoritative 20-point scale, meet the people who shape what the UK drinks and how we talk about wine.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="tag bg-white/10 border border-white/15 text-white/75 text-[10px]">
                  {CRITICS.length} critics in guide
                </span>
                <span className="tag bg-white/10 border border-white/15 text-white/75 text-[10px]">
                  {criticCoverage} curated top picks
                </span>
                <span className="tag bg-gold/20 border border-gold/30 text-gold-lt text-[10px]">
                  Now viewing {selected.name}
                </span>
              </div>
            </div>

            <div className="surface-panel p-4 lg:p-5">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-slate-lt mb-3">Critic Snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Featured', value: selected.name.split(' ')[0] },
                  { label: 'Focus', value: selected.specialty.split(' · ')[0] },
                  { label: 'Scoring', value: selected.gilby ? 'Pass/Class/Arse' : 'Guide-led' },
                  { label: 'Top picks', value: selected.topPickIds?.length || 0 },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-2xl lg:text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-slate-lt mt-3">
                Use the critic rail to switch voice quickly, then treat the bottle shortlist as an entry point rather than a ranking table.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* Tom Gilbey feature strip */}
        <div
          className="rounded-2xl p-6 mb-10 flex items-center gap-6 cursor-pointer hover:scale-[1.005] transition-transform"
          style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2C1810 100%)' }}
          onClick={() => selectCritic('tom-gilbey', true)}
        >
          <CriticAvatar critic={CRITICS[0]} size="md" frosted />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <p className="font-display text-xl font-semibold text-white">Tom Gilbey MW</p>
              <span className="font-body text-[10px] tracking-widest uppercase text-gold/70">Featured</span>
            </div>
            <p className="font-body text-sm text-white/60">
              The man who gave us Pass, Class & Arse — making wine accessible one supermarket shelf at a time.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            {GILBY_TIERS.map(t => (
              <span
                key={t.rating}
                className="font-body text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: t.bg, color: t.text }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Critic selector */}
          <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <p className="section-label mb-4">The Critics</p>
            {CRITICS.map(critic => (
              <CriticCard
                key={critic.id}
                critic={critic}
                onSelect={(id) => selectCritic(id, true)}
                isSelected={selectedId === critic.id}
              />
            ))}
          </div>

          {/* Detail panel */}
          <div ref={detailRef}>
            <div className="mb-3 px-4 py-2 rounded-xl bg-gold/10 border border-gold/30">
              <p className="font-body text-xs text-slate-lt">
                Now viewing: <strong className="text-slate">{selected.name}</strong>
              </p>
            </div>
            <CriticDetail critic={selected} />
          </div>
        </div>
      </div>
    </main>
  )
}
