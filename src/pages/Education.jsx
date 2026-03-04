import { useState } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'production', label: 'How Wine Is Made' },
  { id: 'labels', label: 'Reading a Label' },
  { id: 'vintages', label: 'Understanding Vintages' },
  { id: 'tasting', label: 'How to Taste' },
]

export default function Education() {
  const [activeSection, setActiveSection] = useState('production')

  return (
    <div className="min-h-screen bg-ivory pt-20">

      {/* Hero */}
      <section className="bg-slate text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/10 translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-sage/10 -translate-x-16 translate-y-16" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative">
          <p className="section-label text-gold/70 mb-3">Education</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Wine School</h1>
          <p className="font-body text-lg text-white/60 max-w-2xl">
            From grape to glass — everything you need to develop your wine knowledge, confidently choose bottles, and taste like a professional.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar nav */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200
                    ${activeSection === s.id
                      ? 'bg-gold text-white shadow-gold'
                      : 'text-slate-lt hover:text-slate hover:bg-cream'
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeSection === 'production' && <ProductionSection />}
            {activeSection === 'labels' && <LabelsSection />}
            {activeSection === 'vintages' && <VintagesSection />}
            {activeSection === 'tasting' && <TastingSection />}
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

const PRODUCTION_STEPS = [
  {
    title: 'Harvest', icon: '🍇',
    body: `Grapes are picked when the winemaker judges the balance of sugar, acid, and phenolic ripeness is ideal. Harvesting too early means thin, tart wine; too late means jammy, alcoholic wine. Most fine wine is hand-harvested to select only perfect bunches.`,
    detail: `Harvest timing is the most critical decision a winemaker makes — a single week can be the difference between a great vintage and a mediocre one.`,
  },
  {
    title: 'Sorting & Crushing', icon: '⚙️',
    body: `Grapes are sorted on a table (triage), removing damaged berries and leaves. Then crushed — gently, to extract juice without releasing bitter compounds from seeds. Whole-cluster fermentation (uncrushed) is a stylistic choice for greater complexity.`,
  },
  {
    title: 'Pressing', icon: '🔧',
    body: `For white wines, the crushed grapes (must) are pressed immediately to separate juice from skins. For red wines, pressing happens after fermentation, once the wine has extracted colour, tannin, and flavour from the skins.`,
    detail: `Free-run juice (first to flow out) is the finest quality. Press fractions that follow are coarser and sometimes bottled separately or used for other purposes.`,
  },
  {
    title: 'Fermentation', icon: '🧪',
    body: `Yeast (wild or cultured) converts grape sugars into alcohol and CO₂. A typical fermentation lasts 1–3 weeks, reaching 12–15% alcohol. Temperature control is crucial: cool fermentation preserves fruit aromas; warmer fermentation builds structure.`,
    detail: `Malolactic fermentation (MLF) — a secondary bacterial process — converts sharp malic acid to softer lactic acid. This is why Chardonnay can taste buttery rather than sharp.`,
  },
  {
    title: 'Maceration (Red Wine)', icon: '🔴',
    body: `Red wines ferment with their skins to extract colour (anthocyanins), tannin, and flavour compounds. Cap management — punching down or pumping over the floating skin cap — ensures even extraction. Maceration can last 1–4 weeks.`,
  },
  {
    title: 'Ageing', icon: '🛢️',
    body: `After fermentation, wine rests — in oak barrels, stainless steel, or concrete. Oak adds vanilla, spice, and tannin structure; it also allows micro-oxygenation, which stabilises colour and softens tannins. Inert vessels preserve pure fruit character.`,
    detail: `New French oak is the benchmark for fine wine. As barrels age, they impart less flavour — a five-year-old barrel adds structure without overwhelming oak character.`,
  },
  {
    title: 'Blending', icon: '🔀',
    body: `Many of the world's greatest wines are blends — different grape varieties, vineyard plots, or barrels combined to achieve balance and complexity that no single component could alone. Bordeaux blends Cabernet Sauvignon with Merlot, Cabernet Franc, and others.`,
  },
  {
    title: 'Fining & Filtering', icon: '🔍',
    body: `Wine is clarified before bottling. Fining uses agents (bentonite, egg white) to bind and precipitate particles. Filtering removes the remainder. Minimal-intervention winemakers avoid both, bottling unfiltered for greater texture and longevity.`,
  },
  {
    title: 'Bottling', icon: '🍾',
    body: `The final step — wine is bottled under inert gas (nitrogen or argon) to prevent oxidation. Cork, screwcap, or Diam closures each have their advocates. Cork allows micro-ageing; screwcaps offer perfect consistency. Both are equally valid.`,
  },
]

const RED_DIFFERENCES = [
  'Fermented with grape skins — extracts colour, tannin, and flavour',
  'Requires maceration (skin contact) — duration shapes the tannin profile',
  'Tannins bind with proteins in food — hence red wine with red meat',
  'Almost always benefits from some ageing in barrel and bottle',
  'Served at 15–18°C (light reds cooler: 12–14°C)',
]
const WHITE_DIFFERENCES = [
  'Fermented without skins (usually) — no tannin extraction',
  'Relies on acidity for structure rather than tannin',
  'Fruit aromas preserved by cool fermentation',
  'May undergo malolactic fermentation for a richer, creamier texture',
  'Served cool: 8–12°C (fuller whites slightly warmer)',
]

const OLD_WORLD_TERMS = [
  { term: 'Appellation', meaning: `Legally defined geographic area (Bordeaux, Burgundy, Rioja)` },
  { term: 'Premier Cru', meaning: `First Growth — a top-tier vineyard classification (varies by region)` },
  { term: 'Grand Cru', meaning: `Greatest Growth — the highest classification in Burgundy and Alsace` },
  { term: 'Château', meaning: `Estate (Bordeaux); not necessarily a literal castle` },
  { term: 'Domaine', meaning: `Estate (Burgundy); wine made from the grower's own vineyards` },
  { term: 'Riserva / Réserve', meaning: `Extended ageing before release — implies higher quality, stricter rules` },
]

const NEW_WORLD_TERMS = [
  { term: 'Varietal', meaning: `Named by grape variety (Cabernet Sauvignon, Chardonnay)` },
  { term: 'AVA / GI', meaning: `American Viticultural Area / Geographical Indication — less strict than EU appellations` },
  { term: 'Reserve', meaning: `No legal definition in New World — usually implies premium selection` },
  { term: 'Single Vineyard', meaning: `All grapes from one named vineyard — implies terroir-focused production` },
  { term: 'Old Vines', meaning: `No legal age — typically 25–50+ year old vines that yield more concentrated fruit` },
  { term: 'Alcohol %', meaning: `More prominently displayed; high alcohol (>14.5%) often indicates warm-climate fruit` },
]

const LABEL_TERMS = [
  { term: 'Mis en Bouteille au Château / Domaine', meaning: `Estate-bottled — grapes grown and wine made and bottled by the same producer. A guarantee of authenticity and often indicates higher quality.` },
  { term: 'Vieilles Vignes', meaning: `French for "old vines." Older vines produce smaller yields of more concentrated fruit. No legal minimum age, but typically 30–80+ years.` },
  { term: 'Sur Lies', meaning: `"On the lees" — wine aged on its spent yeast cells after fermentation. Adds richness, creaminess, and sometimes a bread-dough character. Common in Muscadet and Champagne.` },
  { term: 'Unfiltered', meaning: `Wine bottled without filtration — may show sediment over time, but can offer greater texture and complexity. Common in natural wine and fine Burgundy.` },
  { term: 'Contains Sulphites', meaning: `All wine contains naturally occurring sulphites. Added sulphites (SO₂) act as a preservative and antioxidant. "Contains Sulphites" is legally required on EU and UK labels.` },
  { term: 'Alcohol by Volume (ABV)', meaning: `The percentage of pure alcohol. Typically 11–15% for table wine. Low ABV (9–11%) suggests off-dry style or cool climate. High ABV (14.5%+) suggests warm climate or fortification.` },
]

const CLASSIFICATIONS = [
  { country: 'France (Bordeaux)', top: 'Premier Grand Cru Classé', mid: 'Grand Cru Classé', entry: 'Cru Bourgeois' },
  { country: 'France (Burgundy)', top: 'Grand Cru', mid: 'Premier Cru', entry: 'Village / Régionale' },
  { country: 'Italy', top: 'DOCG', mid: 'DOC', entry: 'IGT / Vino da Tavola' },
  { country: 'Spain', top: 'DOCa / DO (Pago)', mid: 'DO', entry: 'Vino de la Tierra' },
  { country: 'Germany', top: 'Grosses Gewächs / Erstes', mid: 'Ortswein', entry: 'Gutswein' },
  { country: 'Champagne', top: 'Grand Cru (100%)', mid: 'Premier Cru (90–99%)', entry: 'Village (≤89%)' },
]

const VINTAGE_FACTORS = [
  { icon: '🌡️', factor: 'Heat & Sunshine', body: `Warm summers ripen fruit fully, building sugar and flavour. But excessive heat can burn out acidity, leading to flat, alcoholic wine.` },
  { icon: '🌧️', factor: 'Rainfall & Timing', body: `Rain at harvest is devastating — it dilutes juice and promotes rot. Spring frost can destroy an entire crop. Summer rains, if drained by well-sited soils, can be beneficial.` },
  { icon: '🌊', factor: 'Diurnal Range', body: `The difference between day and night temperatures. Large ranges preserve acidity and aromatic freshness — essential for elegant, age-worthy wine.` },
]

const NOTABLE_VINTAGES = [
  {
    region: 'Bordeaux',
    vintages: [
      { year: 2000, rating: 'exceptional' }, { year: 2005, rating: 'exceptional' },
      { year: 2009, rating: 'exceptional' }, { year: 2010, rating: 'exceptional' },
      { year: 2015, rating: 'exceptional' }, { year: 2016, rating: 'exceptional' },
      { year: 2018, rating: 'great' }, { year: 2019, rating: 'great' },
      { year: 2022, rating: 'great' }, { year: 2017, rating: 'good' },
    ],
  },
  {
    region: 'Burgundy',
    vintages: [
      { year: 2005, rating: 'exceptional' }, { year: 2010, rating: 'exceptional' },
      { year: 2012, rating: 'exceptional' }, { year: 2015, rating: 'great' },
      { year: 2018, rating: 'exceptional' }, { year: 2019, rating: 'exceptional' },
      { year: 2020, rating: 'great' }, { year: 2021, rating: 'great' },
      { year: 2022, rating: 'great' }, { year: 2023, rating: 'good' },
    ],
  },
  {
    region: 'Champagne',
    vintages: [
      { year: 2002, rating: 'exceptional' }, { year: 2008, rating: 'exceptional' },
      { year: 2012, rating: 'exceptional' }, { year: 2013, rating: 'great' },
      { year: 2015, rating: 'great' }, { year: 2018, rating: 'exceptional' },
      { year: 2019, rating: 'great' },
    ],
  },
  {
    region: 'Barolo / Piedmont',
    vintages: [
      { year: 2001, rating: 'exceptional' }, { year: 2004, rating: 'exceptional' },
      { year: 2010, rating: 'exceptional' }, { year: 2013, rating: 'exceptional' },
      { year: 2015, rating: 'great' }, { year: 2016, rating: 'exceptional' },
      { year: 2019, rating: 'great' }, { year: 2020, rating: 'good' },
    ],
  },
]

const FIVE_S = [
  {
    name: 'See', icon: '👁️', subtitle: 'Appearance',
    body: `Hold the glass against a white background. Examine clarity (clear vs hazy), intensity (pale vs deep), and colour. Colour reveals age — reds become brick-orange at the rim with age; whites deepen to gold.`,
    lookFor: ['Pale lemon', 'Golden', 'Amber', 'Ruby', 'Garnet', 'Brick', 'Tawny', 'Clarity', 'Legs'],
  },
  {
    name: 'Swirl', icon: '🌀', subtitle: 'Aerate',
    body: `Swirling releases volatile aromatic compounds. Gently rotate the glass — one confident swirl is enough. Notice how the wine coats the glass; "legs" (rivulets) indicate alcohol content, though not quality.`,
    lookFor: ['Release esters', 'Open up', 'Aerate tannins'],
  },
  {
    name: 'Sniff', icon: '👃', subtitle: 'Nose / Aroma',
    body: `Take a short, sharp sniff with your nose inside the glass. Identify primary aromas (fruit, floral, herbal from the grape), secondary aromas (from fermentation — yeast, butter), and tertiary aromas (from ageing — vanilla, toast, leather, earth).`,
    lookFor: ['Citrus', 'Stone fruit', 'Red fruit', 'Dark fruit', 'Floral', 'Spice', 'Mineral', 'Oak', 'Leather', 'Earth', 'Mushroom'],
  },
  {
    name: 'Sip', icon: '👄', subtitle: 'Palate',
    body: `Take a small sip and let it coat your whole mouth. Assess sweetness (front of tongue), acidity (sides — does it make you salivate?), tannin (grip and dryness on gums — red wines), body (weight and texture), and flavour intensity.`,
    lookFor: ['Dry / Off-dry', 'Crisp / Soft', 'High / Low tannin', 'Light / Full body', 'Short / Long finish'],
  },
  {
    name: 'Savour', icon: '✨', subtitle: 'Finish',
    body: `How long does the flavour persist after swallowing? A great wine has a "long finish" — complex flavours that linger for 20–40 seconds or more. A short, sharp finish suggests simpler wine.`,
    lookFor: ['Short (<5 sec)', 'Medium (5–15 sec)', 'Long (15–30 sec)', 'Very long (>30 sec)'],
  },
]

const TASTING_VOCAB = [
  { term: 'Terroir', definition: 'The complete natural environment of a vineyard — soil, climate, aspect, elevation — and its expression in the wine.' },
  { term: 'Minerality', definition: 'A wet stone, flint, or chalky quality. Debated scientifically, but wines from limestone soils (Chablis, Champagne) frequently display it.' },
  { term: 'Tannic', definition: 'The drying, grippy sensation from grape skins, seeds, and oak. Tannins bind with proteins — why red wine pairs with red meat.' },
  { term: 'Acidity', definition: 'The backbone of white wine and essential in all wine. High acidity makes wine feel fresh, crisp, and age-worthy. Think Riesling or Champagne.' },
  { term: 'Structure', definition: 'The framework of a wine — its acidity, tannin, and alcohol working in balance to support the fruit character.' },
  { term: 'Complexity', definition: 'Multiple layers of flavour and aroma — a wine that reveals something different with each sniff or sip is complex.' },
  { term: 'Balance', definition: 'When no single element dominates — fruit, acid, tannin, oak, and alcohol are in harmony. The hallmark of fine wine.' },
  { term: 'Finish', definition: 'How long the flavour persists after swallowing. A long, complex finish is the mark of great wine.' },
  { term: 'Bretanomyces', definition: 'A yeast (Brett) that imparts barnyard, leather, or medicinal notes. Controversial — sometimes considered a fault, sometimes a hallmark of character.' },
  { term: 'Reduction', definition: 'A sulphurous, struck-match or rubber character from absence of oxygen. Often blows off with airing; can be intentional in certain styles.' },
]

const SERVING_TEMPS = [
  { type: 'Champagne / Sparkling', temp: '6–8°C', why: 'Cold preserves bubbles and freshness; too warm makes sparkling wine flat and flabby.' },
  { type: 'Crisp White / Rosé', temp: '8–10°C', why: 'Preserves delicate aromatics and refreshing acidity. Albariño, Muscadet, Sancerre, light rosé.' },
  { type: 'Full White / Rich Rosé', temp: '10–13°C', why: 'Slightly warmer allows complex aromas to open. White Burgundy, aged Riesling, oaked Chardonnay.' },
  { type: 'Light Red', temp: '13–15°C', why: 'Beaujolais and young Pinot Noir benefit from slight chilling — brings out freshness and fruit.' },
  { type: 'Medium Red', temp: '15–17°C', why: 'Chianti, Rioja, Côtes du Rhône — cool enough to stay fresh, warm enough to show complexity.' },
  { type: 'Full Red', temp: '17–19°C', why: 'Barolo, Burgundy, Bordeaux, Syrah — "room temperature" in a cool European cellar, not a modern heated room.' },
  { type: 'Dessert / Fortified', temp: '8–12°C', why: 'Sauternes and Tokaji: serve cold. Tawny Port: cool. Vintage Port: cellar temperature. Madeira: room temperature.' },
]
