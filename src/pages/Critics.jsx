import { useState } from 'react'
import { Link } from 'react-router-dom'
import { wines } from '../data/wines'

// ── Tom Gilby's Pass / Class / Arse system ─────────────────────────────────────
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
    id:       'tom-gilby',
    name:     'Tom Gilby',
    title:    'The People\'s Wine Guy',
    emoji:    '🎬',
    bio:      `Tom Gilby is a Master of Wine and wine educator who became a genuine phenomenon on YouTube — reviewing supermarket wines with honesty, humour and zero pretension. His three-tier rating system (Pass / Class / Arse) has done more to demystify wine than most textbooks. Accessible, occasionally sweary, and always entertaining.`,
    specialty: `Supermarket wines · Value hunting · UK retail`,
    scoring:  `Pass / Class / Arse — his three-tier system cuts through the noise. No points, no percentages, just an honest verdict.`,
    links: [
      { label: 'YouTube', url: 'https://www.youtube.com/@TomGilby', icon: '▶' },
      { label: 'Instagram', url: 'https://www.instagram.com/tomgilbymw', icon: '📷' },
    ],
    gilby: true,
    colour: '#C9973A',
    topPickIds: ['aldi-cremant-du-jura', 'tesco-finest-english-sparkling', 'waitrose-cune-rioja'],
    quote: `"A wine doesn't have to be expensive to be Class. And an expensive wine can absolutely be Arse."`,
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
    topPickIds: ['dom-perignon-2013', 'chateau-margaux-2015', 'chateau-yquem-2015'],
    quote: `"I see my main job as trying to find wines that give genuine pleasure, at whatever price."`,
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
    topPickIds: ['waitrose-muga-rioja-reserva', 'trivento-reserve-malbec', 'barolo-conterno'],
    quote: `"Great wine should make you feel something. It's not just a beverage — it's a moment."`,
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
      { label: 'DWWA', url: 'https://www.decanter.com/wine-news/dwwa/', icon: '🏆' },
    ],
    colour: '#C4622D',
    topPickIds: ['bollinger-special-cuvee', 'chateau-margaux-2015', 'waitrose-prunotto-barolo'],
    quote: `"Wine is endlessly fascinating precisely because the same grape, in the same region, in different hands, can produce something entirely different."`,
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
    topPickIds: ['cloudy-bay-sauvignon', 'tesco-finest-barossa-shiraz', 'sainsbur-zuccardi-poligonos-altamira-malbec'],
    quote: `"The best wine isn't the most expensive. It's the one that makes you smile."`,
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
    topPickIds: ['puligny-montrachet-leflaive', 'sainsburys-ttd-cotes-du-rhone', 'baron-de-ley-rioja-reserva'],
    quote: `"Wine is about pleasure — understand what you like, and pursue it unapologetically."`,
  },
]

// ── Component helpers ──────────────────────────────────────────────────────────
function CriticCard({ critic, onSelect, isSelected }) {
  return (
    <button
      onClick={() => onSelect(critic.id)}
      className={`card p-5 text-left w-full transition-all duration-200 hover:-translate-y-0.5 ${
        isSelected ? 'ring-2 ring-gold shadow-gold' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${critic.colour}20`, border: `1px solid ${critic.colour}30` }}
        >
          {critic.emoji}
        </div>
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

function CriticDetail({ critic }) {
  const topPicks = critic.topPickIds
    ?.map(id => wines.find(w => w.id === id))
    .filter(Boolean) ?? []

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${critic.colour} 0%, ${critic.colour}99 100%)` }}
      >
        <div className="absolute right-6 top-6 text-6xl opacity-20">{critic.emoji}</div>
        <p className="font-body text-xs tracking-[0.15em] uppercase text-white/60 mb-2">{critic.title}</p>
        <h2 className="font-display text-4xl font-semibold text-white mb-4">{critic.name}</h2>
        <p className="font-body text-sm text-white/80 leading-relaxed max-w-2xl mb-5">{critic.bio}</p>
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

          {/* Gilby tiers — only for Tom Gilby */}
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
        </div>

        {/* Top picks */}
        <div>
          <h3 className="font-display text-2xl text-slate mb-4">Wines They Champion</h3>
          {topPicks.length > 0 ? (
            <div className="space-y-3">
              {topPicks.map(wine => (
                <Link
                  key={wine.id}
                  to={`/explore/${wine.id}`}
                  className="card p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0"
                    style={{ background: wine.cardGradient || '#2C2C3E' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-slate leading-tight truncate">{wine.name}</p>
                    <p className="font-body text-xs text-slate-lt mt-0.5">{wine.producer} · {wine.region}</p>
                  </div>
                  <span className="font-body text-xs font-semibold text-gold flex-shrink-0">{wine.rating}</span>
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
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function Critics() {
  const [selectedId, setSelectedId] = useState('tom-gilby')
  const selected = CRITICS.find(c => c.id === selectedId) || CRITICS[0]

  return (
    <main className="pt-16 min-h-screen bg-ivory">
      {/* Hero */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold mb-3">Critics & Commentators</p>
          <h1 className="font-display text-5xl lg:text-6xl font-light leading-tight mb-4">
            Whose opinion <br />
            <em className="text-gold not-italic">actually matters?</em>
          </h1>
          <p className="font-body text-white/60 max-w-2xl leading-relaxed">
            From Tom Gilby's supermarket shelf verdicts (Pass, Class, or Arse) to Jancis Robinson's authoritative 20-point scale — meet the people who shape what the UK drinks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* Tom Gilby feature strip */}
        <div
          className="rounded-2xl p-6 mb-10 flex items-center gap-6 cursor-pointer hover:scale-[1.005] transition-transform"
          style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2C1810 100%)' }}
          onClick={() => setSelectedId('tom-gilby')}
        >
          <div className="text-4xl flex-shrink-0">🎬</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <p className="font-display text-xl font-semibold text-white">Tom Gilby MW</p>
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
          <div className="space-y-3">
            <p className="section-label mb-4">The Critics</p>
            {CRITICS.map(critic => (
              <CriticCard
                key={critic.id}
                critic={critic}
                onSelect={setSelectedId}
                isSelected={selectedId === critic.id}
              />
            ))}
          </div>

          {/* Detail panel */}
          <div>
            <CriticDetail critic={selected} />
          </div>
        </div>
      </div>
    </main>
  )
}
