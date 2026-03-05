import { useState } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'production', label: 'How Wine Is Made' },
  { id: 'labels', label: 'Reading a Label' },
  { id: 'vintages', label: 'Understanding Vintages' },
  { id: 'tasting', label: 'How to Taste' },
  { id: 'dos-donts', label: "Do's & Don'ts" },
  { id: 'glassware', label: 'Glassware Guide' },
  { id: 'tech', label: 'Wine Tech' },
  { id: 'corkscrews', label: 'Top 10 Corkscrews' },
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
            {activeSection === 'dos-donts' && <DosDontsSection />}
            {activeSection === 'glassware' && <GlasswareSection />}
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

// ── Do's & Don'ts Section ────────────────────────────────────────

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
      <div className="rounded-2xl bg-[#1A1A2E] p-6">
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

      <div className="rounded-2xl bg-[#1A1A2E] p-6">
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

const WINE_DOS = [
  { icon: '↔️', title: 'Store bottles horizontally', body: 'Keeps the cork moist and expanded — preventing air ingress that would oxidise and ruin the wine. The only exception is screwcap wines, which can stand upright.' },
  { icon: '🌡️', title: 'Keep a consistent temperature', body: 'Aim for 10–14°C for long-term storage. Temperature fluctuations (not just high temperatures) are the enemy — they expand and contract the cork, pushing air in.' },
  { icon: '🌑', title: 'Store in darkness', body: 'UV light degrades wine, causing premature ageing and "light strike" — a musty, cabbage-like off-flavour. Wine stored in clear bottles is most vulnerable.' },
  { icon: '🍷', title: 'Decant young reds', body: 'Pour into a wide-bottomed decanter an hour or two before serving. This softens tannins, opens aromatics, and transforms a brooding young red into something far more approachable.' },
  { icon: '🌡️', title: 'Serve at the right temperature', body: 'Too warm and reds taste jammy and alcoholic. Too cold and whites lose all their aromatics. A quick 20-minute fridge chill for reds is often all they need in a warm room.' },
  { icon: '🫙', title: 'Use a proper wine stopper for leftovers', body: 'Recork with the original cork or use a rubber wine stopper — then refrigerate, even reds. Cold slows oxidation. Drink within 2–3 days for reds, 1–2 days for whites.' },
  { icon: '👃', title: 'Sniff for corked wine', body: 'A corked wine smells damp, musty — like wet cardboard or a mouldy basement. If you detect this, send it back in a restaurant or replace it at a shop without hesitation.' },
]

const WINE_DONTS = [
  { icon: '🍳', title: "Don't store wine in the kitchen", body: 'Kitchens fluctuate wildly in temperature and are often warmer than ideal. The top of a fridge is especially bad — it vibrates and runs warm. Under the stairs is far better.' },
  { icon: '💡', title: "Don't store under bright lights", body: 'A wine rack under spotlights looks great but destroys bottles over time. Halogen and fluorescent lighting emit UV. LED lighting is safer but still best avoided for long-term storage.' },
  { icon: '🧊', title: "Don't leave white wine in the fridge for weeks", body: "A standard fridge is too cold (4°C) and too dry for anything longer than a few weeks. Long exposure dries the cork and strips freshness from the wine." },
  { icon: '🫧', title: "Don't use plastic wrap as a stopper", body: 'It lets air in, imparts off-flavours, and is entirely ineffective. Spend £3 on a rubber wine stopper — it actually works.' },
  { icon: '🍾', title: "Don't shake wine before serving", body: 'Especially important with older reds that have thrown a sediment. Standing the bottle upright for 24 hours before opening lets sediment settle. Decant carefully.' },
  { icon: '🥵', title: "Don't serve red wine at room temperature", body: "'Room temperature' comes from the days of unheated European stone cellars — around 15–18°C. A modern UK living room in winter is already too warm; in summer it can hit 24°C+." },
  { icon: '🥂', title: "Don't serve fine wine in tiny glasses", body: 'Small glasses trap aromas rather than releasing them, and force you to overfill — which prevents proper swirling. A large-bowled, thin-rimmed glass makes the same wine taste noticeably better.' },
]

const STOPPER_GUIDE = [
  {
    icon: '🍾',
    name: 'Natural Cork',
    verdict: 'Best for ageing',
    verdictCls: 'bg-sage/15 border border-sage/30 text-sage',
    body: 'The traditional choice — natural cork allows micro-oxygenation that develops wine over time. Essential for fine wine intended to age. The downside: TCA contamination causes cork taint (that musty smell) in around 1–3% of corks. Quality has improved significantly with modern cork technology.',
  },
  {
    icon: '🔩',
    name: 'Screwcap (ROPP)',
    verdict: 'Best for freshness',
    verdictCls: 'bg-gold/15 border border-gold/30 text-gold',
    body: 'Now used by the majority of New World producers and increasingly by European ones. Prevents TCA cork taint entirely, and preserves fresh, primary fruit flavours better than cork. Some reduction can occur (struck-match character) but usually blows off on pouring. Perfectly valid for any wine meant to drink young.',
  },
  {
    icon: '🧪',
    name: 'Diam (Technical Cork)',
    verdict: 'Best all-round',
    verdictCls: 'bg-gold/15 border border-gold/30 text-gold',
    body: 'A cork made from granulated natural cork, steam-cleaned to remove TCA, then bound with microspheres. Zero cork taint risk, controlled oxygen transfer (you choose the permeability), and looks like a traditional cork. Now used by many premium producers including some top Burgundy estates.',
  },
  {
    icon: '💎',
    name: 'Glass Stopper (Vino-Lok)',
    verdict: 'Premium choice',
    verdictCls: 'bg-slate-lt/15 border border-slate-lt/30 text-slate-lt',
    body: 'Elegant glass and silicone closure used by some German and Austrian premium producers. Zero contamination risk, completely airtight, and highly reusable. The obvious downside: it cannot reseal after opening. Requires a separate wine stopper for leftover wine.',
  },
  {
    icon: '🔌',
    name: 'Rubber Wine Stopper',
    verdict: 'For leftovers',
    verdictCls: 'bg-cream border border-cream/80 text-slate-lt',
    body: 'Once a bottle is open, a tight rubber stopper (£3–8 from any kitchen shop) is your best friend. Refrigerate immediately — even reds. This slows oxidation dramatically. Drink within 2–3 days. Vacu-Vin vacuum stoppers remove more air but may strip some aromatics from delicate wines.',
  },
]

const GLASSES = [
  {
    id: 'bordeaux',
    icon: '🍷',
    name: 'Bordeaux Glass',
    subtitle: 'Full-bodied reds',
    description: 'Tall glass with a large bowl that narrows slightly at the rim. The generous bowl gives tannins room to breathe and soften, while the tapered top concentrates the complex aromas of Cabernet Sauvignon, Merlot, Shiraz, and other full-bodied reds.',
    bestFor: ['Cabernet Sauvignon', 'Bordeaux blends', 'Shiraz / Syrah', 'Malbec', 'Merlot'],
    why: 'The tall bowl allows young, tannic wines to open up and aerate. The wide base maximises surface area for oxygen contact. The tapered rim directs wine to the back of the palate, where tannins are perceived as smooth rather than harsh.',
    tip: 'Pour no more than a third full. This leaves room to swirl without spilling, and concentrates the aromatics above the wine surface.',
  },
  {
    id: 'burgundy',
    icon: '🫧',
    name: 'Burgundy Glass',
    subtitle: 'Pinot Noir & delicate reds',
    description: 'Wider and more balloon-shaped than the Bordeaux glass, with a wider mouth. The extra width exposes more wine to air and sends aromas directly to the tip of the nose. Perfect for the delicate, complex aromatics of Pinot Noir and aged Burgundy.',
    bestFor: ['Pinot Noir', 'Red Burgundy', 'Nebbiolo (Barolo)', 'Aged reds with sediment', 'Delicate Grenache'],
    why: 'The wide bowl encourages aeration of delicate wines that might otherwise seem thin. The wider rim allows the complex, layered aromas of aged Pinot to reach the nose in full, rather than being concentrated to a point.',
    tip: 'Burgundy glasses are more fragile than Bordeaux due to the thin, wide bowl. Machine dishwashing is particularly hard on them — hand-washing and proper storage extends their life considerably.',
  },
  {
    id: 'white',
    icon: '🥂',
    name: 'White Wine Glass',
    subtitle: 'Aromatic whites',
    description: 'Smaller than a red wine glass, with a tulip-shaped bowl that preserves cooler serving temperatures. The narrower opening concentrates the crisp, fruit-forward aromas of white wine and prevents it from warming too quickly in the hand.',
    bestFor: ['Sauvignon Blanc', 'Pinot Grigio', 'Riesling', 'Muscadet', 'Albariño'],
    why: 'Smaller bowl means less surface area — the wine stays cooler longer. The narrow opening concentrates delicate aromatics rather than letting them dissipate. For very aromatic whites like Gewürztraminer, a larger bowl can actually work better.',
  },
  {
    id: 'chardonnay',
    icon: '🥃',
    name: 'Chardonnay / Rich White Glass',
    subtitle: 'Full-bodied whites',
    description: 'A hybrid shape — wider than a standard white wine glass but smaller than a red. Used for full-bodied, oak-aged whites that benefit from aeration: White Burgundy, oaked Chardonnay, aged Viognier, or a rich white Rioja.',
    bestFor: ['Oaked Chardonnay', 'White Burgundy', 'Viognier', 'White Rioja', 'Aged Sémillon'],
    why: "Fuller whites have more complexity and benefit from more air contact — closer to a red wine glass in function. The wider bowl allows the wine's creamy texture and vanilla-oak character to unfurl.",
    tip: "If you're buying one set of white wine glasses, get Chardonnay glasses — they handle both styles better than a narrow-rimmed standard white glass.",
  },
  {
    id: 'champagne-flute',
    icon: '🍾',
    name: 'Champagne Flute',
    subtitle: 'The classic sparkling choice',
    description: 'The tall, narrow flute is iconic for Champagne and sparkling wine. The narrow shape preserves bubbles (less surface area for CO₂ to escape) and keeps the wine cooler. The elongated shape creates a dramatic visual stream of bubbles.',
    bestFor: ['Prosecco', 'Cava', 'Non-vintage Champagne', 'Crémant'],
    why: 'The primary function is bubble preservation. The tall shape creates a long bubble stream (called a "mousse" column) that keeps the wine lively. The narrow opening also retains the cold temperature.',
    tip: "Fine Champagne — especially vintage and prestige cuvée — is often better served in a white wine glass or tulip. The extra room allows complex aromas (brioche, hazelnut, minerality) to emerge that are lost in a flute.",
  },
  {
    id: 'champagne-tulip',
    icon: '🌷',
    name: 'Champagne Tulip',
    subtitle: 'Best for fine sparkling wine',
    description: 'A tulip-shaped glass that flares slightly at the rim, wider in the middle than at the top. The wider bowl allows more complex aromatics to develop — critical for aged Champagne, blanc de blancs, and single-vineyard cuvées. Increasingly preferred by sommeliers over the traditional flute.',
    bestFor: ['Vintage Champagne', 'Blanc de Blancs', 'Grower Champagnes', 'English Sparkling Wine'],
    why: 'The wider bowl gives complex aromas room to develop and reveal layers that a flute would compress and mute. The inward taper at the rim still preserves bubbles effectively. Many Champagne houses now officially recommend tulip glasses.',
    tip: "Pol Roger (Churchill's favourite house) serves in a tulip. If you're spending £40+ on a bottle of Champagne, drink it from the right glass.",
  },
  {
    id: 'port',
    icon: '🔮',
    name: 'Port / Dessert Glass',
    subtitle: 'Fortified & sweet wines',
    description: 'A smaller glass — typically 150–200ml — designed for the rich, concentrated flavours and higher alcohol of fortified and dessert wines. Serving portions are smaller (75–100ml versus 125–175ml for table wine), so a smaller glass provides the right proportions.',
    bestFor: ['Vintage Port', 'Tawny Port', 'Sauternes', 'Tokaji', 'Sherry', 'Madeira'],
    why: "Fortified wines have more alcohol (17–22%) and concentrated sweetness — a large glass would make the alcohol overwhelming. The smaller vessel focuses the complex, nutty, or honeyed aromas that define great Port and Sauternes.",
    tip: 'Tawny Port is superb lightly chilled (12–14°C) in a small glass — a revelation if you only drink it at room temperature.',
  },
]

const PRESERVATION_TECH = [
  {
    icon: '🔬',
    name: 'Coravin Model Eleven',
    brand: 'Coravin (USA)',
    price: '£280–350',
    rating: '⭐ Essential for collectors',
    ratingCls: 'text-gold',
    body: 'The gold standard of wine preservation. A thin hollow needle penetrates the cork without removing it. Argon gas (inert, flavour-neutral) replaces the wine as it flows out, leaving the remaining wine in a completely oxygen-free environment. The cork reseals itself when the needle is removed. Bottles preserved this way can continue ageing for years.',
    verdict: 'If you have bottles worth over £30 that you want to enjoy glass-by-glass over months, the Coravin pays for itself quickly.',
  },
  {
    icon: '💨',
    name: 'Private Preserve Wine Saver',
    brand: 'Wine Enthusiast (USA)',
    price: '£10–15',
    rating: '✅ Best budget preservation',
    ratingCls: 'text-sage',
    body: 'A small can of blended inert gas (nitrogen, argon, CO₂). A few squirts into an open bottle displaces oxygen before resealing. Dramatically slows oxidation — extends wine life from 1–2 days to 4–7 days. Simple, cheap, and genuinely effective. Keep one in every kitchen.',
    verdict: 'The single best £12 you can spend on wine accessories. No excuses for pouring leftover wine down the sink.',
  },
  {
    icon: '🫧',
    name: 'Vacu-Vin Vacuum Stopper Set',
    brand: 'Vacu-Vin (Netherlands)',
    price: '£8–15',
    rating: '✅ Good everyday option',
    ratingCls: 'text-sage',
    body: 'A rubber stopper and hand pump that creates a partial vacuum in the bottle, removing some oxygen. Very effective for 1–3 days. Some argue that vacuum removal of CO₂ can strip aromatics from delicate wines — if that concerns you, use inert gas instead. For everyday drinking, this is excellent value.',
  },
  {
    icon: '🍷',
    name: 'Enomatic / Winekeeper Systems',
    brand: 'Enomatic & others (Italy)',
    price: '£400–2000+',
    rating: '🏆 Professional grade',
    ratingCls: 'text-gold',
    body: 'Multi-bottle wine preservation and dispensing systems used in restaurants, bars, and wine shops. Each bottle is sealed and preserved with argon or nitrogen after each pour. Maintains wine at correct serving temperature. Bottles remain fresh for 2–3 weeks. Primarily a trade tool, but premium home models exist for serious collectors.',
  },
]

const AERATOR_TECH = [
  {
    icon: '🌊',
    name: 'Vinturi Wine Aerator',
    price: '£20–30',
    body: 'The most popular instant aerator. Hold over a glass and pour through — it draws in air via a venturi effect, aerating wine in seconds. Does what 30 minutes of decanting achieves. Works best for young, tannic reds. Not all wine nerds approve, but the results are genuine.',
  },
  {
    icon: '🫙',
    name: 'LSA International Decanter',
    price: '£25–80',
    body: 'A wide-bottomed decanter exposes maximum wine surface area to oxygen. For young reds, pour in and wait 30–60 minutes. For vintage reds with sediment, pour slowly and stop when sediment reaches the neck. Also excellent for serving white Burgundy.',
  },
  {
    icon: '🌀',
    name: 'Riedel Swirl Decanter',
    price: '£60–120',
    body: "Riedel's distinctive swirl-shaped decanter is designed to be gently rotated, maximising aeration. Doubles as a stunning table piece. The shape makes sediment visible, making it easier to stop pouring at the right moment. A genuinely beautiful object.",
  },
  {
    icon: '⚗️',
    name: 'Zalto Denk\'Art Decanter',
    price: '£80–150',
    body: "Zalto's hand-blown lead-free crystal decanter. Considered by many sommeliers to be the finest decanter available. Exceptionally thin walls, organic shape, feather-light. The wine genuinely tastes different — whether from the glass or the ritual. A serious collector's piece.",
  },
]

const TOP_CORKSCREWS = [
  {
    name: 'Pulltaps Double-Hinged Waiter\'s Friend',
    type: 'Pocket sommelier / waiter\'s knife',
    price: '£8–25',
    badge: '🏅 Best value — buy two',
    body: "The most-used professional corkscrew in the world. A two-stage lever mechanism means almost zero effort — even on tight corks. The serrated foil cutter and bottle opener are genuinely useful. Used by virtually every sommelier on the planet. Buy the Pulltex or José Pastor branded versions — avoid the cheap imitations.",
  },
  {
    name: 'Le Creuset Lever Corkscrew',
    type: 'Tabletop lever corkscrew',
    price: '£55–75',
    badge: '🏆 Best overall',
    body: 'Effortless two-handle lever action — no twisting required. The teflon-coated worm (helix) goes in smoothly, and the lever mechanism extracts the cork with minimal force. Built like a Le Creuset pan — heavy, solid, and reliable for decades. Available in all Le Creuset colours.',
  },
  {
    name: 'Laguiole en Aubrac Sommelier',
    type: 'Traditional waiter\'s knife — artisan',
    price: '£150–350+',
    badge: '🎁 Best gift',
    body: 'Hand-crafted in the village of Aubrac, France, using traditional knife-making techniques. Each piece is unique — handle materials include olive wood, juniper, horn, and resin. The single-hinge design requires more technique than a double-hinge, but the experience is incomparable. A tool that becomes a heirloom.',
  },
  {
    name: 'The Durand Corkscrew',
    type: 'Two-piece extraction system',
    price: '£80–110',
    badge: '🍾 Best for old bottles',
    body: "Combines an Ah-So (two-pronged) with a traditional worm in a single tool. Designed specifically for extracting old, fragile corks that might crumble under normal corkscrew pressure. Insert both prongs either side of the cork, gently twist and pull. The only corkscrew designed for bottles over 20 years old.",
  },
  {
    name: 'Coravin Pivot',
    type: 'Wine preservation + pouring system',
    price: '£70–90',
    badge: '💡 Rethinks the category',
    body: "Not a traditional corkscrew — works only with screwcap wines. Attach to the bottle, press a button, and argon gas pressurises the bottle so wine pours without opening. Keeps the wine fresh indefinitely. The entry-level Coravin experience, but limited to screwcaps.",
  },
  {
    name: 'Screwpull Lever Model',
    type: 'Tabletop lever corkscrew',
    price: '£80–130',
    badge: null,
    body: 'The original luxury lever corkscrew. Teflon-coated helix that goes in effortlessly; the lever extracts cleanly without tearing the cork. Designed by Herbert Allen in the 1970s and still considered the elegant American alternative to European lever corkscrews. Beloved by wine professionals.',
  },
  {
    name: 'Ah-So (Two-Pronged Butler\'s Thief)',
    type: 'Two-pronged cork extractor',
    price: '£15–35',
    badge: null,
    body: "Two thin metal prongs slide down either side of the cork (no drilling), then the cork is twisted and pulled. Essential for older corks that may crumble if a worm is inserted. Learn the technique — it takes practice — and you'll never panic over a crumbling cork again. The sommelier's secret weapon.",
  },
  {
    name: 'Zwilling J.A. Henckels Twin Sommelier',
    type: 'Premium waiter\'s knife',
    price: '£30–50',
    badge: null,
    body: "German precision engineering in a waiter's knife format. Double hinge, sharp foil cutter, substantial feel without being heavy. More refined than the budget Pulltaps but far less expensive than the Laguiole. The right choice if you want quality without the artisan premium.",
  },
  {
    name: 'OXO Good Grips Vertical Corkscrew',
    type: 'Tabletop wing corkscrew',
    price: '£15–25',
    badge: '♿ Most accessible',
    body: 'The classic butterfly/wing corkscrew design with proper ergonomic handles. Ideal for those with limited hand strength or dexterity. The winged handles provide mechanical advantage that makes extraction easy. Not the most elegant, but genuinely practical and widely available.',
  },
  {
    name: 'Electric Wine Opener (OZERI Prestige)',
    type: 'Electric corkscrew',
    price: '£20–40',
    badge: null,
    body: "Press a button, and the corkscrew removes the cork in about 6 seconds. Rechargeable via USB. Genuinely useful for high-volume service situations or for those who struggle with manual corkscrews. Not the tactile experience of a sommelier's knife, but entirely functional and impressive as a conversation piece.",
  },
]

