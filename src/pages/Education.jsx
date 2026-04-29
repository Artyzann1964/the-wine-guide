import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PRODUCTION_STEPS,
  RED_DIFFERENCES,
  WHITE_DIFFERENCES,
  OLD_WORLD_TERMS,
  NEW_WORLD_TERMS,
  LABEL_TERMS,
  CLASSIFICATIONS,
  VINTAGE_FACTORS,
  NOTABLE_VINTAGES,
  FIVE_S,
  TASTING_VOCAB,
  SERVING_TEMPS,
  WINE_DOS,
  WINE_DONTS,
  STOPPER_GUIDE,
  GLASSES,
  PRESERVATION_TECH,
  AERATOR_TECH,
  TOP_CORKSCREWS,
  SPARKLING_TYPES,
  SPARKLING_SWEETNESS,
  WHITE_GRAPES,
  RED_GRAPES,
  CLASSIC_BLENDS,
} from '../data/educationContent'

const SECTIONS = [
  { id: 'production', label: 'How Wine Is Made' },
  { id: 'labels', label: 'Reading a Label' },
  { id: 'vintages', label: 'Understanding Vintages' },
  { id: 'tasting', label: 'How to Taste' },
  { id: 'dos-donts', label: "Do's & Don'ts" },
  { id: 'glassware', label: 'Glassware Guide' },
  { id: 'sparkling', label: 'Sparkling Wines' },
  { id: 'grapes', label: 'Grape Varieties' },
  { id: 'tech', label: 'Wine Tech' },
  { id: 'corkscrews', label: 'Top 10 Corkscrews' },
]

const SECTION_META = {
  production: { icon: '🍇', minutes: 6 },
  labels: { icon: '🏷️', minutes: 5 },
  vintages: { icon: '📅', minutes: 6 },
  tasting: { icon: '👃', minutes: 7 },
  'dos-donts': { icon: '✅', minutes: 4 },
  glassware: { icon: '🥂', minutes: 4 },
  sparkling: { icon: '✨', minutes: 6 },
  grapes: { icon: '🍷', minutes: 8 },
  tech: { icon: '🧪', minutes: 4 },
  corkscrews: { icon: '🪛', minutes: 3 },
}

const LEARN_COMPLETION_KEY = 'wine-guide-learn-completed'

function readCompleted() {
  try {
    const raw = localStorage.getItem(LEARN_COMPLETION_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function Education() {
  const [activeSection, setActiveSection] = useState('production')
  const [completedSections, setCompletedSections] = useState(readCompleted)

  useEffect(() => {
    try {
      localStorage.setItem(LEARN_COMPLETION_KEY, JSON.stringify(completedSections))
    } catch {
      // ignore storage issues
    }
  }, [completedSections])

  const completedCount = completedSections.length
  const totalSections = SECTIONS.length
  const progress = Math.round((completedCount / totalSections) * 100)
  const activeMeta = SECTION_META[activeSection] || { icon: '📘', minutes: 5 }
  const totalMinutes = useMemo(
    () => SECTIONS.reduce((sum, section) => sum + (SECTION_META[section.id]?.minutes || 0), 0),
    [],
  )
  const nextSection = SECTIONS.find(section => !completedSections.includes(section.id)) || SECTIONS[0]

  function toggleComplete(sectionId) {
    setCompletedSections(prev => (
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    ))
  }

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="hero-mesh text-white relative overflow-hidden pt-24 lg:pt-28 pb-16 border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-sage/10 -translate-x-16 translate-y-16" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <div className="grid xl:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
            <div>
              <p className="section-label text-gold/70 mb-3">Education</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Wine School</h1>
              <p className="font-body text-lg text-white/60 max-w-2xl">
                From grape to glass, everything you need to develop your wine knowledge, choose bottles with more confidence, and taste with more structure.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="tag bg-white/10 border border-white/15 text-white/75 text-[10px]">
                  {totalSections} core lessons
                </span>
                <span className="tag bg-white/10 border border-white/15 text-white/75 text-[10px]">
                  {totalMinutes} minutes total
                </span>
                <span className="tag bg-gold/20 border border-gold/30 text-gold-lt text-[10px]">
                  {progress}% complete
                </span>
              </div>
            </div>

            <div className="surface-panel p-4 lg:p-5">
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-slate-lt mb-3">Learning Snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Completed', value: completedCount },
                  { label: 'Remaining', value: totalSections - completedCount },
                  { label: 'Current', value: activeMeta.icon },
                  { label: 'Next up', value: SECTION_META[nextSection.id]?.icon || '📘' },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-slate-lt mt-3">
                Work section by section, mark lessons complete, and use the menu as a lightweight course outline rather than a linear textbook.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="surface-panel p-5 lg:p-6 mb-6">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5">
            <div>
              <p className="section-label mb-2">Learning Progress</p>
              <h2 className="font-display text-4xl text-slate mb-3">Build Amanda's wine knowledge track</h2>
              <p className="font-body text-sm text-slate-lt leading-relaxed mb-4">
                Progress is saved on this device. Work section-by-section, mark complete, and keep the visual flow fast on iPhone and desktop.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SECTIONS.slice(0, 4).map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`tag transition-colors ${
                      activeSection === section.id
                        ? 'bg-gold text-white border border-gold'
                        : 'bg-white border border-cream text-slate hover:border-gold/40'
                    }`}
                  >
                    {SECTION_META[section.id]?.icon || '📘'} {section.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Completed', value: completedCount },
                  { label: 'Remaining', value: totalSections - completedCount },
                  { label: 'Progress', value: `${progress}%` },
                  { label: 'Read time', value: `${totalMinutes}m` },
                ].map(stat => (
                  <div key={stat.label} className="card p-3 text-center">
                    <p className="font-display text-3xl text-gold leading-none">{stat.value}</p>
                    <p className="font-body text-xs text-slate-lt mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Current section</p>
              <p className="font-display text-2xl text-slate">{activeMeta.icon} {SECTIONS.find(s => s.id === activeSection)?.label}</p>
              <p className="font-body text-sm text-slate-lt mt-1">Est. {activeMeta.minutes} minutes</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleComplete(activeSection)}
                  className={`chip ${completedSections.includes(activeSection) ? 'bg-slate text-white' : 'bg-gold/10 border border-gold/30 text-gold'}`}
                >
                  {completedSections.includes(activeSection) ? 'Marked complete' : 'Mark this section complete'}
                </button>
              </div>
              <div className="mt-4 h-2 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold to-terracotta transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar nav */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="lg:sticky lg:top-24">
              <div className="lg:hidden flex gap-2 overflow-x-auto thin-scroll pb-1 mb-2">
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`chip whitespace-nowrap ${
                      activeSection === s.id
                        ? 'bg-slate text-white'
                        : 'bg-white border border-cream text-slate-lt'
                    }`}
                  >
                    <span>{SECTION_META[s.id]?.icon || '📘'}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
              <div className="hidden lg:block menu-rail">
                <p className="font-body text-[10px] tracking-[0.18em] uppercase text-slate-lt/70 mb-2 px-1">Section Menu</p>
                <div className="space-y-1.5">
                  {SECTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      className={`menu-item ${activeSection === s.id ? 'menu-item-active' : 'menu-item-idle'}`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <span>{SECTION_META[s.id]?.icon || '📘'}</span>
                          <span className="truncate">{s.label}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className={`text-[10px] uppercase tracking-wider ${activeSection === s.id ? 'text-white/70' : 'text-slate-lt/70'}`}>
                            {SECTION_META[s.id]?.minutes || 5}m
                          </span>
                          {completedSections.includes(s.id) && (
                            <span className={`text-xs ${activeSection === s.id ? 'text-gold-lt' : 'text-gold'}`}>✓</span>
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeSection === 'production' && <ProductionSection />}
            {activeSection === 'labels' && <LabelsSection />}
            {activeSection === 'vintages' && <VintagesSection />}
            {activeSection === 'tasting' && <TastingSection />}
            {activeSection === 'dos-donts' && <DosDontsSection />}
            {activeSection === 'glassware' && <GlasswareSection />}
            {activeSection === 'sparkling' && <SparklingSection />}
            {activeSection === 'grapes' && <GrapeVarietiesSection />}
            {activeSection === 'tech' && <WineTechSection />}
            {activeSection === 'corkscrews' && <CorkscrewSection />}
          </main>
        </div>
      </div>
    </div>
  )
}

// ── Production Section ──────────────────────────────────────────

function ProductionSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">How Wine Is Made</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          Wine is, at its most elemental, fermented grape juice. But between harvest and bottle lies an extraordinary sequence of decisions — each one shaping the wine's character, complexity, and longevity.
        </p>
      </div>

      <div className="space-y-4">
        {PRODUCTION_STEPS.map((step, i) => (
          <div key={step.title} className="card p-6 flex gap-5">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="font-display font-bold text-gold text-lg">{i + 1}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display font-semibold text-lg text-slate">{step.title}</h3>
                <span className="text-xl">{step.icon}</span>
              </div>
              <p className="font-body text-sm text-slate-lt leading-relaxed">{step.body}</p>
              {step.detail && (
                <div className="mt-3 rounded-xl bg-cream/60 px-4 py-3">
                  <p className="font-body text-xs text-slate-lt italic">{step.detail}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Red vs White differences */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Red vs White: The Key Difference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-6 border-t-4 border-rose-400">
            <h4 className="font-display font-semibold text-lg text-slate mb-3">Red Wine</h4>
            <ul className="space-y-2">
              {RED_DIFFERENCES.map(d => (
                <li key={d} className="flex items-start gap-2 font-body text-sm text-slate-lt">
                  <span className="text-rose-500 mt-0.5">●</span> {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border-t-4 border-yellow-300">
            <h4 className="font-display font-semibold text-lg text-slate mb-3">White Wine</h4>
            <ul className="space-y-2">
              {WHITE_DIFFERENCES.map(d => (
                <li key={d} className="flex items-start gap-2 font-body text-sm text-slate-lt">
                  <span className="text-yellow-500 mt-0.5">●</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gold/10 border border-gold/20 p-6">
        <h3 className="font-display font-semibold text-lg text-slate mb-3">Want to go deeper on sparkling wine?</h3>
        <p className="font-body text-sm text-slate-lt mb-4">
          Our Sparkling Wine guide covers the Traditional Method, Tank Method, and Ancestral Method in depth — with step-by-step process explainers.
        </p>
        <Link to="/sparkling" className="btn-primary">Explore Sparkling Wines →</Link>
      </div>
    </div>
  )
}

// ── Labels Section ──────────────────────────────────────────────

function LabelsSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Reading a Wine Label</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          A wine label is a legal document, marketing tool, and quality indicator — all on a single piece of paper. Once you know what to look for, labels tell you almost everything about what's inside.
        </p>
      </div>

      {/* Old World vs New World */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Old World vs New World Labels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏰</span>
              <h4 className="font-display font-semibold text-lg text-slate">Old World (Europe)</h4>
            </div>
            <p className="font-body text-sm text-slate-lt mb-4">
              European labels typically <strong>lead with place</strong> — the appellation or region tells you what grape and style to expect.
            </p>
            <div className="space-y-3">
              {OLD_WORLD_TERMS.map(t => (
                <div key={t.term} className="flex gap-3">
                  <span className="font-body text-xs font-semibold text-gold w-28 flex-shrink-0 pt-0.5">{t.term}</span>
                  <span className="font-body text-xs text-slate-lt">{t.meaning}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌎</span>
              <h4 className="font-display font-semibold text-lg text-slate">New World (Americas, Aus, NZ)</h4>
            </div>
            <p className="font-body text-sm text-slate-lt mb-4">
              New World labels lead with <strong>the grape variety</strong> — what you'll taste is stated front and centre.
            </p>
            <div className="space-y-3">
              {NEW_WORLD_TERMS.map(t => (
                <div key={t.term} className="flex gap-3">
                  <span className="font-body text-xs font-semibold text-gold w-28 flex-shrink-0 pt-0.5">{t.term}</span>
                  <span className="font-body text-xs text-slate-lt">{t.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key terms */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Essential Label Terms</h3>
        <div className="space-y-3">
          {LABEL_TERMS.map(t => (
            <div key={t.term} className="card p-5 flex flex-col sm:flex-row sm:items-start gap-3">
              <span className="font-display font-semibold text-gold text-base w-48 flex-shrink-0">{t.term}</span>
              <p className="font-body text-sm text-slate-lt leading-relaxed">{t.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Classifications */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Quality Classifications</h3>
        <div className="overflow-x-auto rounded-2xl border border-cream">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/60">
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Country</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Top Level</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Mid Level</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4 hidden sm:table-cell">Entry Level</th>
              </tr>
            </thead>
            <tbody>
              {CLASSIFICATIONS.map((r, i) => (
                <tr key={r.country} className={`border-t border-cream ${i % 2 === 0 ? 'bg-white' : 'bg-ivory/30'}`}>
                  <td className="px-5 py-4 font-body font-semibold text-sm text-slate">{r.country}</td>
                  <td className="px-5 py-4 font-body text-sm text-slate-lt">{r.top}</td>
                  <td className="px-5 py-4 font-body text-sm text-slate-lt">{r.mid}</td>
                  <td className="px-5 py-4 font-body text-sm text-slate-lt hidden sm:table-cell">{r.entry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Vintages Section ────────────────────────────────────────────

function VintagesSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Understanding Vintages</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          The vintage year on a label isn't just a date — it's a weather report. Every growing season is different, and great winemakers work with, not against, what the year gives them.
        </p>
      </div>

      {/* Why vintage matters */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-xl text-slate mb-4">Why Does Vintage Matter?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VINTAGE_FACTORS.map(f => (
            <div key={f.factor} className="flex gap-3">
              <span className="text-xl mt-0.5">{f.icon}</span>
              <div>
                <p className="font-body font-semibold text-sm text-slate mb-1">{f.factor}</p>
                <p className="font-body text-xs text-slate-lt leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notable vintages by region */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Legendary Vintages by Region</h3>
        <div className="space-y-4">
          {NOTABLE_VINTAGES.map(r => (
            <div key={r.region} className="card p-6">
              <h4 className="font-display font-semibold text-lg text-slate mb-4">{r.region}</h4>
              <div className="flex flex-wrap gap-2">
                {r.vintages.map(v => (
                  <div
                    key={v.year}
                    className={`rounded-xl px-3 py-2 text-center border
                      ${v.rating === 'exceptional' ? 'bg-gold/15 border-gold/40 text-gold' :
                        v.rating === 'great' ? 'bg-sage/15 border-sage/40 text-sage' :
                        'bg-cream border-cream/80 text-slate-lt'
                      }`}
                  >
                    <p className="font-body font-bold text-sm">{v.year}</p>
                    <p className="font-body text-[10px] mt-0.5 capitalize">{v.rating}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          {[['exceptional', 'bg-gold/15 border-gold/40 text-gold'], ['great', 'bg-sage/15 border-sage/40 text-sage'], ['good', 'bg-cream border-cream/80 text-slate-lt']].map(([label, cls]) => (
            <div key={label} className={`tag border text-xs capitalize ${cls}`}>{label}</div>
          ))}
        </div>
      </div>

      {/* Non-vintage wines */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <span className="text-2xl mt-1">🍾</span>
          <div>
            <h3 className="font-display font-semibold text-xl text-slate mb-2">Non-Vintage (NV) Wines</h3>
            <p className="font-body text-sm text-slate-lt leading-relaxed mb-3">
              Non-vintage wines blend multiple years to achieve a consistent house style. This isn"t a compromise — it's a skill. Champagne NV, for instance, is the winemaker"s signature expression, often blending 30–40% reserve wines from previous years.
            </p>
            <p className="font-body text-sm text-slate-lt leading-relaxed">
              Don't dismiss NV wines — they offer consistency and value. NV Champagnes from Bollinger, Krug, or Roederer represent some of the world's great wine experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tasting Section ─────────────────────────────────────────────

function TastingSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">How to Taste Wine</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          Professional tasting is a systematic approach to wine evaluation — but it"s not snobbishness. It's a way of paying attention, building memory, and communicating about one of the world"s most complex beverages.
        </p>
      </div>

      {/* The 5 Ss */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-6">The WSET Approach</h3>
        <div className="space-y-4">
          {FIVE_S.map((step, i) => (
            <div key={step.name} className="card p-6 flex gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xl">{step.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h4 className="font-display font-semibold text-xl text-slate">{step.name}</h4>
                  <span className="font-body text-xs text-slate-lt/60 uppercase tracking-wider">{step.subtitle}</span>
                </div>
                <p className="font-body text-sm text-slate-lt leading-relaxed mb-3">{step.body}</p>
                {step.lookFor && (
                  <div className="flex flex-wrap gap-1.5">
                    {step.lookFor.map(lf => (
                      <span key={lf} className="tag bg-cream text-slate-lt text-xs">{lf}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasting vocabulary */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Wine Vocabulary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TASTING_VOCAB.map(v => (
            <div key={v.term} className="card p-4 flex gap-4">
              <span className="font-display font-semibold text-gold text-base w-28 flex-shrink-0 leading-snug">{v.term}</span>
              <p className="font-body text-xs text-slate-lt leading-relaxed">{v.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Serving */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Serving Temperature Guide</h3>
        <div className="overflow-x-auto rounded-2xl border border-cream">
          <table className="w-full">
            <thead>
              <tr className="bg-cream/60">
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Wine Type</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Temperature</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4 hidden sm:table-cell">Why</th>
              </tr>
            </thead>
            <tbody>
              {SERVING_TEMPS.map((r, i) => (
                <tr key={r.type} className={`border-t border-cream ${i % 2 === 0 ? 'bg-white' : 'bg-ivory/30'}`}>
                  <td className="px-5 py-4 font-body font-semibold text-sm text-slate">{r.type}</td>
                  <td className="px-5 py-4">
                    <span className="tag bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">{r.temp}</span>
                  </td>
                  <td className="px-5 py-4 font-body text-xs text-slate-lt hidden sm:table-cell max-w-xs">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Static Data ─────────────────────────────────────────────────

function DosDontsSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Do's & Don'ts of Wine</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          A few simple habits separate people who enjoy wine from people who get the most out of every bottle. Here's the unvarnished truth about what to do — and what definitely not to do.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do's */}
        <div className="card p-6 border-t-4 border-sage">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">✅</span>
            <h3 className="font-display font-semibold text-xl text-slate">Do</h3>
          </div>
          <ul className="space-y-4">
            {WINE_DOS.map(item => (
              <li key={item.title} className="flex gap-3">
                <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-body font-semibold text-sm text-slate mb-0.5">{item.title}</p>
                  <p className="font-body text-xs text-slate-lt leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts */}
        <div className="card p-6 border-t-4 border-terracotta">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">❌</span>
            <h3 className="font-display font-semibold text-xl text-slate">Don't</h3>
          </div>
          <ul className="space-y-4">
            {WINE_DONTS.map(item => (
              <li key={item.title} className="flex gap-3">
                <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-body font-semibold text-sm text-slate mb-0.5">{item.title}</p>
                  <p className="font-body text-xs text-slate-lt leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stoppers deep dive */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Wine Stoppers: Which to Use</h3>
        <div className="space-y-3">
          {STOPPER_GUIDE.map(s => (
            <div key={s.name} className="card p-5 flex gap-4 items-start">
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h4 className="font-display font-semibold text-base text-slate">{s.name}</h4>
                  <span className={`tag text-[10px] ${s.verdictCls}`}>{s.verdict}</span>
                </div>
                <p className="font-body text-xs text-slate-lt leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature quick ref */}
      <div className="rounded-2xl bg-navy p-6">
        <h3 className="font-display font-semibold text-xl text-white mb-4">Storage Temperature at a Glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Long-term cellar', temp: '10–12°C', icon: '🏚️' },
            { label: 'Short-term storage', temp: '12–15°C', icon: '🗄️' },
            { label: 'White service', temp: '8–12°C', icon: '🥂' },
            { label: 'Red service', temp: '14–18°C', icon: '🍷' },
          ].map(t => (
            <div key={t.label} className="rounded-xl bg-white/8 p-4 text-center">
              <p className="text-2xl mb-2">{t.icon}</p>
              <p className="font-body font-bold text-gold text-sm">{t.temp}</p>
              <p className="font-body text-white/50 text-[10px] mt-1">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Glassware Section ────────────────────────────────────────────

function GlasswareSection() {
  const [selected, setSelected] = useState('bordeaux')
  const glass = GLASSES.find(g => g.id === selected)

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Glassware Guide</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          The right glass genuinely changes the experience of a wine. Shape directs wine to different parts of the palate, concentrates aromatics, and affects temperature. Here's what to use and why.
        </p>
      </div>

      {/* Glass guide infographic */}
      <div className="rounded-2xl overflow-hidden border border-cream shadow-sm">
        <div className="bg-cream/40 px-5 py-3 border-b border-cream flex items-center gap-2">
          <span className="text-lg">🖼️</span>
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-slate-lt">Visual Reference — Glass Shapes by Wine Type</p>
        </div>
        <img
          src="/eWine_Glass_Guide.webp"
          alt="Wine Glass Guide — shapes and their ideal wines"
          className="w-full h-auto block"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Selector */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="space-y-1">
            {GLASSES.map(g => (
              <button
                key={g.id}
                onClick={() => setSelected(g.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-all duration-200 flex items-center gap-3
                  ${selected === g.id
                    ? 'bg-gold text-white font-medium shadow-gold'
                    : 'text-slate-lt hover:text-slate hover:bg-cream'
                  }`}
              >
                <span className="text-xl">{g.icon}</span>
                <span className="leading-tight">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {glass && (
          <div className="flex-1 card p-6 space-y-5">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{glass.icon}</span>
              <div>
                <h3 className="font-display font-semibold text-2xl text-slate">{glass.name}</h3>
                <p className="font-body text-sm text-gold font-medium mt-0.5">{glass.subtitle}</p>
              </div>
            </div>

            <p className="font-body text-sm text-slate-lt leading-relaxed">{glass.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-cream/60 p-4">
                <p className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-3">Best for</p>
                <ul className="space-y-1.5">
                  {glass.bestFor.map(w => (
                    <li key={w} className="flex items-center gap-2 font-body text-xs text-slate">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-cream/60 p-4">
                <p className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-3">Why it works</p>
                <p className="font-body text-xs text-slate-lt leading-relaxed">{glass.why}</p>
              </div>
            </div>

            {glass.tip && (
              <div className="rounded-xl bg-gold/8 border border-gold/20 px-4 py-3">
                <p className="font-body text-xs text-slate italic">💡 {glass.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Universal glass note */}
      <div className="card p-6 flex gap-4 items-start">
        <span className="text-2xl flex-shrink-0">🔍</span>
        <div>
          <h3 className="font-display font-semibold text-lg text-slate mb-2">The Universal Compromise</h3>
          <p className="font-body text-sm text-slate-lt leading-relaxed">
            If you only want one type of glass, choose a medium-large tulip-shaped glass (around 400–500ml capacity). 
            It works well for reds, whites, and even sparkling wine — far better than undersized, overfilled pub glasses. 
            Riedel's Veritas range or Zalto Universal are the benchmark for quality that won't break the bank.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Sparkling Section ────────────────────────────────────────────

function SparklingSection() {
  const [active, setActive] = useState('champagne')
  const wine = SPARKLING_TYPES.find(s => s.id === active)

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Sparkling Wines</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          Not all bubbles are equal. Champagne, Prosecco, Cava, and Crémant each have distinct origins, production methods, and flavour profiles. Here's how to tell them apart — and when to reach for each.
        </p>
      </div>

      {/* Selector tabs */}
      <div className="flex flex-wrap gap-2">
        {SPARKLING_TYPES.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 border ${
              active === s.id
                ? 'text-white border-transparent shadow-sm'
                : 'text-slate-lt border-cream hover:border-gold/30 hover:text-slate bg-white'
            }`}
            style={active === s.id ? { backgroundColor: s.colour, borderColor: s.colour } : {}}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Detail card */}
      {wine && (
        <div className="card overflow-hidden animate-fade-in">
          {/* Header band */}
          <div className="px-6 py-5 text-white" style={{ background: `linear-gradient(135deg, ${wine.colour}, ${wine.colourDark})` }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-white/60 mb-1">{wine.country}</p>
                <h3 className="font-display font-bold text-2xl">{wine.name}</h3>
                <p className="font-body text-sm text-white/75 mt-1">{wine.region}</p>
              </div>
              <span className="text-4xl">{wine.icon}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <p className="font-body text-sm text-slate-lt leading-relaxed">{wine.description}</p>

            {/* Key facts grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Method', value: wine.method },
                { label: 'Key Grapes', value: wine.grapes },
                { label: 'Style', value: wine.style },
                { label: 'Price Range', value: wine.price },
              ].map(f => (
                <div key={f.label} className="rounded-xl bg-cream/60 p-3">
                  <p className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-1">{f.label}</p>
                  <p className="font-body text-sm text-slate font-medium leading-snug">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Grapes detail */}
            <div>
              <h4 className="font-display font-semibold text-base text-slate mb-3">The Grapes</h4>
              <div className="space-y-2">
                {wine.grapeDetail.map(g => (
                  <div key={g.name} className="flex gap-3 items-start">
                    <span className="font-body text-xs font-semibold text-gold w-36 flex-shrink-0 pt-0.5">{g.name}</span>
                    <p className="font-body text-xs text-slate-lt leading-relaxed">{g.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What to look for / serving */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-cream/50 p-4">
                <h4 className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-2">What to Look For</h4>
                <ul className="space-y-1.5">
                  {wine.lookFor.map(lf => (
                    <li key={lf} className="flex items-start gap-2 font-body text-xs text-slate-lt">
                      <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: wine.colour }} />
                      {lf}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-cream/50 p-4">
                <h4 className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-2">Serving & Occasions</h4>
                <ul className="space-y-1.5">
                  {wine.serving.map(s => (
                    <li key={s} className="flex items-start gap-2 font-body text-xs text-slate-lt">
                      <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: wine.colour }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {wine.tip && (
              <div className="rounded-xl border px-4 py-3" style={{ borderColor: wine.colour + '40', backgroundColor: wine.colour + '10' }}>
                <p className="font-body text-xs text-slate italic">💡 {wine.tip}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side-by-side quick comparison */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Quick Comparison</h3>
        <div className="overflow-x-auto rounded-2xl border border-cream">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="bg-cream/60">
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Type</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Country</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Method</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4">Price</th>
                <th className="text-left font-body text-xs uppercase tracking-widest text-slate-lt px-5 py-4 hidden sm:table-cell">Character</th>
              </tr>
            </thead>
            <tbody>
              {SPARKLING_TYPES.map((s, i) => (
                <tr key={s.id} className={`border-t border-cream cursor-pointer hover:bg-cream/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-ivory/30'}`} onClick={() => setActive(s.id)}>
                  <td className="px-5 py-4">
                    <span className="font-body font-semibold text-sm text-slate flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.colour }} />
                      {s.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-slate-lt">{s.country}</td>
                  <td className="px-5 py-4 font-body text-sm text-slate-lt">{s.method}</td>
                  <td className="px-5 py-4 font-body text-sm text-slate-lt">{s.price}</td>
                  <td className="px-5 py-4 font-body text-xs text-slate-lt hidden sm:table-cell">{s.character}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sweetness guide */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-xl text-slate mb-4">Decoding Sweetness Labels</h3>
        <p className="font-body text-xs text-slate-lt mb-4">Sparkling wine sweetness is measured by residual sugar (g/L) and labelled in French — even on Cava and Prosecco.</p>
        <div className="space-y-2">
          {SPARKLING_SWEETNESS.map(s => (
            <div key={s.term} className="flex items-center gap-4 flex-wrap">
              <span className="font-body font-semibold text-gold text-sm w-28 flex-shrink-0">{s.term}</span>
              <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden min-w-[80px]">
                <div className="h-full rounded-full bg-gradient-to-r from-gold/30 to-gold" style={{ width: `${s.pct}%` }} />
              </div>
              <span className="font-body text-xs text-slate-lt w-20 flex-shrink-0">{s.sugar}</span>
              <span className="font-body text-xs text-slate-lt hidden sm:block">{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Grape Varieties Section ───────────────────────────────────────

function GrapeVarietiesSection() {
  const [tab, setTab] = useState('white')

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Grape Varieties</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          Every wine starts with a grape — and the variety is the single biggest influence on flavour. Here are the key grapes to know, where they come from, and how they taste.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'white', label: '🍋 White Grapes' },
          { id: 'red', label: '🍇 Red Grapes' },
          { id: 'blends', label: '🔀 Classic Blends' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 border ${
              tab === t.id
                ? 'bg-gold text-white border-gold shadow-gold'
                : 'text-slate-lt border-cream hover:text-slate hover:border-gold/30 bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'white' && (
        <div className="space-y-4 animate-fade-in">
          {WHITE_GRAPES.map(g => (
            <div key={g.name} className="card p-5 flex gap-5">
              <div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-xl">
                🍋
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <h4 className="font-display font-semibold text-lg text-slate">{g.name}</h4>
                    <p className="font-body text-xs text-slate-lt">{g.origin}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map(tag => <span key={tag} className="tag bg-cream text-slate-lt text-[10px]">{tag}</span>)}
                  </div>
                </div>
                <p className="font-body text-xs text-slate-lt leading-relaxed mb-3">{g.description}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  <span className="font-body text-[10px] text-slate-lt"><span className="font-semibold text-gold">Key regions: </span>{g.regions}</span>
                  <span className="font-body text-[10px] text-slate-lt"><span className="font-semibold text-gold">Food: </span>{g.food}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'red' && (
        <div className="space-y-4 animate-fade-in">
          {RED_GRAPES.map(g => (
            <div key={g.name} className="card p-5 flex gap-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-xl">
                🍇
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <h4 className="font-display font-semibold text-lg text-slate">{g.name}</h4>
                    <p className="font-body text-xs text-slate-lt">{g.origin}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map(tag => <span key={tag} className="tag bg-cream text-slate-lt text-[10px]">{tag}</span>)}
                  </div>
                </div>
                <p className="font-body text-xs text-slate-lt leading-relaxed mb-3">{g.description}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  <span className="font-body text-[10px] text-slate-lt"><span className="font-semibold text-gold">Key regions: </span>{g.regions}</span>
                  <span className="font-body text-[10px] text-slate-lt"><span className="font-semibold text-gold">Food: </span>{g.food}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'blends' && (
        <div className="space-y-6 animate-fade-in">
          <p className="font-body text-sm text-slate-lt leading-relaxed">
            Some of the world's greatest wines are blends — each variety contributing something the others lack. Here are the classic combinations every wine lover should know.
          </p>
          {CLASSIC_BLENDS.map(b => (
            <div key={b.name} className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-cream" style={{ background: b.bg }}>
                <h4 className="font-display font-semibold text-lg text-slate">{b.name}</h4>
                <p className="font-body text-xs text-slate-lt mt-0.5">{b.region}</p>
              </div>
              <div className="p-5 space-y-4">
                <p className="font-body text-sm text-slate-lt leading-relaxed">{b.description}</p>
                <div className="space-y-2">
                  {b.grapes.map(g => (
                    <div key={g.name} className="flex gap-3 items-start">
                      <div className="flex items-center gap-2 w-44 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.colour }} />
                        <span className="font-body text-xs font-semibold text-slate">{g.name}</span>
                        <span className="font-body text-[10px] text-slate-lt ml-auto">{g.pct}</span>
                      </div>
                      <p className="font-body text-xs text-slate-lt leading-relaxed">{g.role}</p>
                    </div>
                  ))}
                </div>
                {b.examples && (
                  <div className="rounded-xl bg-cream/60 px-4 py-3">
                    <p className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-1">Famous examples</p>
                    <p className="font-body text-xs text-slate-lt">{b.examples}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Wine Tech Section ────────────────────────────────────────────

function WineTechSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Wine Tech & Gadgets</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          The right tools can transform how you store, open, and enjoy wine. From game-changing preservation systems to the perfect decanter, here's the tech worth investing in.
        </p>
      </div>

      {/* Preservation */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Preservation Systems</h3>
        <div className="space-y-4">
          {PRESERVATION_TECH.map(t => (
            <div key={t.name} className="card p-6 flex gap-5">
              <span className="text-3xl flex-shrink-0">{t.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <h4 className="font-display font-semibold text-lg text-slate">{t.name}</h4>
                    <p className="font-body text-xs text-slate-lt">{t.brand}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="tag bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">{t.price}</span>
                    <p className={`font-body text-[10px] mt-1 font-medium ${t.ratingCls}`}>{t.rating}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-slate-lt leading-relaxed">{t.body}</p>
                {t.verdict && (
                  <p className="font-body text-xs text-gold italic mt-2">"{t.verdict}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aerators & Decanters */}
      <div>
        <h3 className="font-display font-semibold text-2xl text-slate mb-5">Aerators & Decanters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AERATOR_TECH.map(t => (
            <div key={t.name} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <h4 className="font-display font-semibold text-base text-slate">{t.name}</h4>
                  <span className="font-body text-xs text-gold">{t.price}</span>
                </div>
              </div>
              <p className="font-body text-xs text-slate-lt leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wine Fridges */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🌡️</span>
          <div>
            <h3 className="font-display font-semibold text-xl text-slate mb-3">Wine Fridges & Temperature Control</h3>
            <p className="font-body text-sm text-slate-lt leading-relaxed mb-4">
              Standard kitchen fridges run at 4°C — far too cold for wine storage (it dries out corks and mutes flavours). 
              A dedicated wine fridge keeps bottles at the correct 10–14°C, often with separate zones for reds and whites.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Entry level', name: 'Husky HU228', price: '£80–120', body: '12-bottle countertop, single zone. Good starter fridge.' },
                { label: 'Mid range', name: 'Liebherr WTb 4212', price: '£400–500', body: 'Dual zone, 40 bottles. German precision engineering.' },
                { label: 'Serious cellar', name: 'EuroCave Compact', price: '£900+', body: 'The wine-world benchmark. Natural cork-friendly humidity control.' },
              ].map(f => (
                <div key={f.label} className="rounded-xl bg-cream/60 p-4">
                  <p className="font-body text-[10px] uppercase tracking-widest text-slate-lt font-semibold mb-1">{f.label}</p>
                  <p className="font-body font-semibold text-sm text-slate mb-1">{f.name}</p>
                  <p className="font-body text-xs text-gold font-medium mb-2">{f.price}</p>
                  <p className="font-body text-xs text-slate-lt">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Corkscrew Section ────────────────────────────────────────────

function CorkscrewSection() {
  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate mb-3">Top 10 Corkscrews</h2>
        <p className="font-body text-slate-lt leading-relaxed">
          The humble corkscrew spans everything from a £5 pocket tool to a £300 piece of engineering art. Here are the ten worth knowing — from everyday essentials to the ones collectors reach for.
        </p>
      </div>

      <div className="space-y-4">
        {TOP_CORKSCREWS.map((c, i) => (
          <div key={c.name} className="card p-5 flex gap-5">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="font-display font-bold text-gold">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                <div>
                  <h4 className="font-display font-semibold text-lg text-slate leading-tight">{c.name}</h4>
                  <p className="font-body text-xs text-slate-lt">{c.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="tag bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">{c.price}</span>
                  {c.badge && (
                    <p className="font-body text-[10px] text-terracotta font-medium mt-1">{c.badge}</p>
                  )}
                </div>
              </div>
              <p className="font-body text-xs text-slate-lt leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-navy p-6">
        <h3 className="font-display font-semibold text-xl text-white mb-3">Which Should You Buy?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: '💰', label: 'Best Value', rec: 'Pulltaps Double-Hinged', note: 'Under £20. Used by every professional sommelier worldwide. Nothing else comes close for the money.' },
            { emoji: '🏆', label: 'Best Overall', rec: 'Le Creuset Lever', note: 'Around £65. Effortless two-lever action, built to last a lifetime. A pleasure every time.' },
            { emoji: '🎁', label: 'Best Gift', rec: 'Laguiole en Aubrac', note: '£150–300. Hand-crafted in France. The kind of thing that gets passed down. Exceptional.' },
          ].map(r => (
            <div key={r.label} className="rounded-xl bg-white/8 p-4">
              <p className="text-2xl mb-2">{r.emoji}</p>
              <p className="font-body text-[10px] uppercase tracking-widest text-white/40 mb-1">{r.label}</p>
              <p className="font-body font-semibold text-white text-sm mb-2">{r.rec}</p>
              <p className="font-body text-white/50 text-xs leading-relaxed">{r.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── New Static Data ─────────────────────────────────────────────

