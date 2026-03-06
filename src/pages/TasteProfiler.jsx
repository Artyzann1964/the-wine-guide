import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { wines } from '../data/wines'
import WineCard from '../components/WineCard'

// ─── Quiz question bank ───────────────────────────────────────────────────────
// On each quiz start, 5 are picked at random from this bank and shuffled.

const QUESTION_BANK = [
  {
    id: 'style',
    question: 'What kind of flavours call to you?',
    subtitle: "Be honest — there's no wrong answer.",
    cols: 2,
    options: [
      {
        emoji: '🍓',
        label: 'Fruit-forward',
        desc: 'Ripe berries, tropical fruit, easy-drinking',
        profile: { fruitiness: 2, sweetness: 1, tannin: -1, acidity: -1 },
      },
      {
        emoji: '🌿',
        label: 'Earthy & savoury',
        desc: 'Forest floor, herbs, complexity over fruit',
        profile: { fruitiness: -2, tannin: 1, body: 1, sweetness: -1 },
      },
      {
        emoji: '🍋',
        label: 'Fresh & zesty',
        desc: 'Citrus, green apple, high acidity, mineral',
        profile: { acidity: 2, fruitiness: 1, tannin: -2, body: -1, sweetness: -1 },
      },
      {
        emoji: '🍯',
        label: 'Rich & full',
        desc: 'Butter, oak, concentration, weight on the palate',
        profile: { body: 2, sweetness: 1, acidity: -1, tannin: -1 },
      },
    ],
  },
  {
    id: 'sweetness',
    question: 'How do you feel about sweetness?',
    subtitle: 'From bone-dry to luscious — where do you sit?',
    cols: 2,
    options: [
      {
        emoji: '🧱',
        label: 'Bone dry',
        desc: 'Zero sweetness — crisp, austere, mineral',
        profile: { sweetness: -2 },
      },
      {
        emoji: '🌸',
        label: 'Off-dry',
        desc: 'A whisper of sweetness to balance acidity',
        profile: {},
      },
      {
        emoji: '🍑',
        label: 'Fruit-sweet',
        desc: 'Noticeably sweet, fruit-driven, approachable',
        profile: { sweetness: 2, fruitiness: 1 },
      },
      {
        emoji: '🍮',
        label: 'Luscious',
        desc: 'Rich dessert-wine sweetness — the real thing',
        profile: { sweetness: 3, body: 1 },
      },
    ],
  },
  {
    id: 'body',
    question: 'What weight do you prefer?',
    subtitle: 'Think of it like coffee — espresso vs flat white.',
    cols: 3,
    options: [
      {
        emoji: '☁️',
        label: 'Light & elegant',
        desc: 'Delicate, refined, low alcohol',
        profile: { body: -2, tannin: -1, acidity: 1 },
      },
      {
        emoji: '⚖️',
        label: 'Medium & balanced',
        desc: 'Versatile, food-friendly, pleasing everyone',
        profile: {},
      },
      {
        emoji: '💪',
        label: 'Full & powerful',
        desc: 'Concentrated, deep, wines with real presence',
        profile: { body: 2, tannin: 1, acidity: -1 },
      },
    ],
  },
  {
    id: 'occasion',
    question: "What's the occasion?",
    subtitle: 'The right wine for the right moment.',
    cols: 2,
    options: [
      {
        emoji: '🛋️',
        label: 'Casual weeknight',
        desc: 'Something easy and unpretentious',
        priceFilter: ['budget', 'mid'],
        profile: { tannin: -1, body: -1 },
      },
      {
        emoji: '🍽️',
        label: 'Dinner party',
        desc: 'Impressive but food-friendly',
        priceFilter: ['mid', 'premium'],
        profile: { body: 1, acidity: 1 },
      },
      {
        emoji: '🥂',
        label: 'Celebration',
        desc: 'Something special and memorable',
        categoryBoost: 'sparkling',
        priceFilter: ['premium', 'luxury'],
        profile: { acidity: 1 },
      },
      {
        emoji: '🔭',
        label: 'Pure discovery',
        desc: "Show me something I haven't tried before",
        profile: {},
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your rough budget per bottle?",
    subtitle: 'Great wine exists at every price point.',
    cols: 2,
    options: [
      {
        emoji: '£',
        label: 'Under £15',
        desc: 'Everyday value — great is possible',
        priceFilter: ['budget'],
        profile: {},
      },
      {
        emoji: '££',
        label: '£15–30',
        desc: 'The sweet spot for quality',
        priceFilter: ['mid'],
        profile: {},
      },
      {
        emoji: '£££',
        label: '£30–60',
        desc: 'Serious wine for special occasions',
        priceFilter: ['premium'],
        profile: {},
      },
      {
        emoji: '££££',
        label: 'No limit',
        desc: 'The very best, regardless of price',
        priceFilter: ['premium', 'luxury'],
        profile: {},
      },
    ],
  },
  {
    id: 'reds_vs_whites',
    question: 'Red or white — what pulls you in?',
    subtitle: "Or perhaps neither?",
    cols: 2,
    options: [
      {
        emoji: '🍷',
        label: 'Red all the way',
        desc: 'Depth, tannin, and warmth — nothing beats a great red',
        profile: { tannin: 1, body: 1, fruitiness: 1 },
        categoryBias: 'red',
      },
      {
        emoji: '🥂',
        label: 'White is my thing',
        desc: 'Fresh, crisp and versatile — white wine never lets me down',
        profile: { acidity: 1, tannin: -2, body: -1 },
        categoryBias: 'white',
      },
      {
        emoji: '🌹',
        label: 'Rosé, obviously',
        desc: 'The best of both worlds, especially in summer',
        profile: { fruitiness: 1, tannin: -1, sweetness: 1 },
        categoryBias: 'rosé',
      },
      {
        emoji: '🤷',
        label: "It depends on the mood",
        desc: "I'm a wine omnivore — category is the last thing I think about",
        profile: {},
      },
    ],
  },
  {
    id: 'food',
    question: 'What are you most likely eating with it?',
    subtitle: 'Wine and food are partners in crime.',
    cols: 2,
    options: [
      {
        emoji: '🥩',
        label: 'Red meat or game',
        desc: 'Steak, lamb, venison — the classics',
        profile: { tannin: 2, body: 2, acidity: 1 },
      },
      {
        emoji: '🐟',
        label: 'Fish or seafood',
        desc: 'Oysters, sea bass, grilled salmon',
        profile: { acidity: 2, body: -1, tannin: -2, sweetness: -1 },
      },
      {
        emoji: '🧀',
        label: 'Cheese or charcuterie',
        desc: 'A proper board, no occasion needed',
        profile: { acidity: 1, body: 1 },
      },
      {
        emoji: '🛋️',
        label: 'Just sipping on its own',
        desc: "No food — I just want a great glass",
        profile: { fruitiness: 1, sweetness: 1 },
      },
    ],
  },
  {
    id: 'climate',
    question: 'Old World or New World?',
    subtitle: 'Where a wine comes from shapes everything about it.',
    cols: 2,
    options: [
      {
        emoji: '🏰',
        label: 'Old World',
        desc: 'France, Italy, Spain — tradition, terroir and restraint',
        profile: { tannin: 1, acidity: 1, fruitiness: -1, body: -1 },
      },
      {
        emoji: '🌏',
        label: 'New World',
        desc: 'Australia, Chile, Argentina — bold fruit and sunshine',
        profile: { fruitiness: 2, body: 1, tannin: -1, acidity: -1 },
      },
      {
        emoji: '🔄',
        label: 'Best of both',
        desc: "I follow quality wherever it leads",
        profile: {},
      },
      {
        emoji: '📍',
        label: "I don't really think about it",
        desc: "What's in the glass matters more than the map",
        profile: {},
      },
    ],
  },
  {
    id: 'complexity',
    question: 'How important is complexity?',
    subtitle: 'Do you want to think, or just enjoy?',
    cols: 2,
    options: [
      {
        emoji: '🎓',
        label: 'I love a wine to ponder',
        desc: 'Layers, evolution in the glass, long finish',
        profile: { tannin: 1, acidity: 1, body: 1, fruitiness: -1 },
      },
      {
        emoji: '😊',
        label: 'Delicious is enough for me',
        desc: 'I want to enjoy it, not analyse it',
        profile: { fruitiness: 1, sweetness: 1, tannin: -1 },
      },
      {
        emoji: '⚖️',
        label: 'Somewhere in between',
        desc: 'Good on day one, better if you think about it',
        profile: {},
      },
      {
        emoji: '🍾',
        label: 'It depends on the occasion',
        desc: "Weeknight simple, weekend serious",
        profile: {},
      },
    ],
  },
  {
    id: 'tannin',
    question: 'How do you feel about tannins?',
    subtitle: "That drying, grippy sensation — do you love it or avoid it?",
    cols: 3,
    options: [
      {
        emoji: '😬',
        label: 'Not for me',
        desc: 'I prefer smooth, silky, easy-drinking wines',
        profile: { tannin: -2, body: -1, fruitiness: 1 },
      },
      {
        emoji: '✅',
        label: 'Some grip is fine',
        desc: 'Soft tannins add structure without being harsh',
        profile: { tannin: 1 },
      },
      {
        emoji: '🦁',
        label: 'Bring it on',
        desc: 'I want power, structure and age-worthiness',
        profile: { tannin: 2, body: 2, acidity: 1 },
      },
    ],
  },
]

// ─── Scoring logic ────────────────────────────────────────────────────────────

const PROFILE_KEYS = ['sweetness', 'acidity', 'tannin', 'body', 'fruitiness']
const NEUTRAL = { sweetness: 3, acidity: 3, tannin: 3, body: 3, fruitiness: 3 }

function clamp(v) { return Math.max(1, Math.min(5, v)) }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Pick 5 questions at random (always include 'budget' as the last one)
function pickQuestions() {
  const budgetQ = QUESTION_BANK.find(q => q.id === 'budget')
  const rest = shuffle(QUESTION_BANK.filter(q => q.id !== 'budget'))
  return [...rest.slice(0, 4), budgetQ]
}

function computeTarget(answers) {
  const t = { ...NEUTRAL }
  for (const ans of answers) {
    for (const [k, delta] of Object.entries(ans.profile || {})) {
      if (PROFILE_KEYS.includes(k)) t[k] = clamp(t[k] + delta)
    }
  }
  return t
}

function scoreWines(answers, questions) {
  const target = computeTarget(answers)
  const priceFilters = new Set()
  let categoryBoost = null
  const categoryBiases = []

  for (const ans of answers) {
    if (ans.priceFilter) ans.priceFilter.forEach(p => priceFilters.add(p))
    if (ans.categoryBoost) categoryBoost = ans.categoryBoost
    if (ans.categoryBias) categoryBiases.push(ans.categoryBias)
  }

  const pool = priceFilters.size > 0
    ? wines.filter(w => priceFilters.has(w.priceRange))
    : wines
  const candidates = pool.length >= 6 ? pool : wines

  return candidates
    .map(w => {
      const p = w.tasteProfile || {}
      const dist = Math.sqrt(
        PROFILE_KEYS.reduce((sum, k) => sum + (((p[k] ?? 3) - target[k]) ** 2), 0)
      )
      let score = 1 / (1 + dist)
      if (categoryBoost && w.category === categoryBoost) score *= 1.4
      if (categoryBiases.length > 0 && categoryBiases.includes(w.category)) score *= 1.2
      score += (w.rating - 85) * 0.003
      return { wine: w, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(r => r.wine)
}

// ─── Personality types ────────────────────────────────────────────────────────

const PERSONALITIES = [
  {
    test: (t, a) => a.some(x => x.categoryBoost === 'sparkling'),
    title: 'The Celebration Seeker',
    emoji: '🥂',
    desc: "Life is too short for ordinary wine. You gravitate towards bubbles and the finer things — Champagne is your love language and every occasion deserves something special.",
    accentColor: '#D4AF37',
  },
  {
    test: (t) => t.sweetness >= 4.2,
    title: 'The Dessert Devotee',
    emoji: '🍮',
    desc: "You embrace sweetness without apology. From Sauternes to late-harvest Riesling, you understand that great dessert wine is one of the world's most underrated pleasures.",
    accentColor: '#C9973A',
  },
  {
    test: (t) => t.tannin >= 4 && t.body >= 4,
    title: 'The Bold Connoisseur',
    emoji: '💪',
    desc: "You like your wine to make a statement. Barolo, Bordeaux, Amarone — big, structured wines with years of potential ahead of them are your natural territory.",
    accentColor: '#8B1A2F',
  },
  {
    test: (t) => t.acidity >= 4 && t.body <= 2.5,
    title: 'The Crisp Minimalist',
    emoji: '🍋',
    desc: "Less is more for you. Precision, tension, minerality — you seek wines that feel alive in the glass. Chablis, Muscadet and cool-climate Rieslings speak your language.",
    accentColor: '#3A7A5C',
  },
  {
    test: (t) => t.fruitiness >= 4 && t.tannin <= 2,
    title: 'The Fruit Enthusiast',
    emoji: '🍓',
    desc: "You love wine that's generous and approachable. Ripe fruit, soft tannins and easy drinking — you're the person everyone thanks for bringing the bottle.",
    accentColor: '#C94070',
  },
  {
    test: (t) => t.body >= 3.8 && t.acidity <= 2.8,
    title: 'The Rich Indulger',
    emoji: '🍯',
    desc: "Oak, concentration and a long finish are your benchmarks. Oaked Chardonnay, aged Rioja Reserva and full-bodied wines with real texture — you want wine that fills the glass.",
    accentColor: '#C9B840',
  },
  {
    test: (t) => t.acidity >= 3.5 && t.body >= 3 && t.tannin >= 2.5,
    title: 'The Food Pairer',
    emoji: '🍽️',
    desc: "For you, wine is incomplete without food alongside it. You instinctively reach for wines with freshness and structure — Burgundy, Italian whites and aged Rioja are your comfort zone.",
    accentColor: '#5C7A5C',
  },
  {
    test: () => true,
    title: 'The Balanced Explorer',
    emoji: '⚖️',
    desc: "You have catholic tastes and an open mind. Variety is the spice of life, and your cellar is a broad church — you're as happy with a Burgundy as a Marlborough Sauvignon.",
    accentColor: '#6B7C8D',
  },
]

function derivePersonality(target, answers) {
  return PERSONALITIES.find(p => p.test(target, answers))
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col hero-mesh">
      <div className="flex-1 flex items-center justify-center px-6 py-20 pt-28">
        <div className="max-w-xl text-center animate-fade-in">
          <div className="text-6xl mb-6 select-none">🍷</div>
          <p className="font-body text-gold/70 text-xs tracking-[0.25em] uppercase mb-4">
            Wine Personality Quiz
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
            What's your<br />wine personality?
          </h1>
          <p className="font-body text-white/60 text-base leading-relaxed mb-10 max-w-md mx-auto">
            Answer 5 quick questions and we'll pinpoint exactly which wines
            from our collection you'll love — every quiz is different.
          </p>
          <button
            onClick={onStart}
            className="btn-primary text-base px-10 py-4 rounded-2xl animate-scale-in"
          >
            Find my wines →
          </button>
          <p className="font-body text-white/30 text-xs mt-5">
            Takes about 60 seconds · 232 wines analysed
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Quiz screen ──────────────────────────────────────────────────────────────

function QuizScreen({ question, questionNumber, totalQuestions, selected, onSelect, onNext, onBack }) {
  const progress = (questionNumber / totalQuestions) * 100
  const isLast = questionNumber === totalQuestions
  const gridClass = question.cols === 3
    ? 'grid-cols-1 sm:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className="min-h-screen bg-ivory pt-16">
      {/* Gold progress bar below nav */}
      <div className="fixed top-16 inset-x-0 z-40 h-0.5 bg-cream">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-14">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < questionNumber ? 'bg-gold' : 'bg-cream'
              }`}
            />
          ))}
        </div>

        <p className="font-body text-xs text-slate-lt/50 tracking-widest uppercase mb-3">
          Question {questionNumber} of {totalQuestions}
        </p>

        <h2 className="font-display font-bold text-2xl md:text-3xl text-slate mb-2 leading-snug">
          {question.question}
        </h2>
        <p className="font-body text-slate-lt text-sm mb-8">{question.subtitle}</p>

        {/* Option cards */}
        <div className={`grid ${gridClass} gap-3 mb-10`}>
          {question.options.map((opt, i) => {
            const isSelected = selected === opt
            return (
              <button
                key={i}
                onClick={() => onSelect(opt)}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 group ${
                  isSelected
                    ? 'border-gold bg-gold/8 shadow-md -translate-y-0.5'
                    : 'border-cream bg-white hover:border-gold/40 hover:bg-gold/4 hover:-translate-y-0.5'
                }`}
              >
                <span className="text-2xl block mb-2 select-none">{opt.emoji}</span>
                <p className="font-display font-semibold text-sm text-slate mb-1">
                  {opt.label}
                </p>
                <p className="font-body text-xs text-slate-lt leading-snug">{opt.desc}</p>
                {isSelected && (
                  <span className="inline-block mt-2 text-gold text-xs font-body">✓ Selected</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="font-body text-sm text-slate-lt hover:text-slate transition-colors px-4 py-2 rounded-xl hover:bg-cream"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className={`btn-primary px-8 py-3 rounded-xl transition-all duration-200 ${
              !selected ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {isLast ? 'See my wines →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Results screen ───────────────────────────────────────────────────────────

function ResultsScreen({ results, personality, onReset }) {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Personality hero */}
      <section className="hero-mesh pt-24 lg:pt-28 pb-16 px-5 border-b border-white/10">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <p className="font-body text-xs tracking-[0.25em] uppercase mb-4"
             style={{ color: `${personality.accentColor}99` }}>
            Your wine personality
          </p>
          <div className="text-5xl mb-4 select-none">{personality.emoji}</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-5 leading-tight">
            {personality.title}
          </h1>
          <p className="font-body text-white/65 text-sm leading-relaxed max-w-lg mx-auto">
            {personality.desc}
          </p>
          <div
            className="w-16 h-0.5 mx-auto mt-8 rounded-full"
            style={{ background: personality.accentColor }}
          />
        </div>
      </section>

      {/* Recommended wines */}
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <p className="section-label mb-2">Matched for you</p>
          <h2 className="font-display font-bold text-2xl text-slate">Your perfect bottles</h2>
          <p className="font-body text-sm text-slate-lt mt-2">
            Scored from all 232 wines based on your taste profile
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {results.map(wine => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-lt font-body py-12">
            No matches found — try widening your budget filter.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onReset} className="btn-secondary px-8 py-3 rounded-xl">
            Retake the quiz
          </button>
          <Link to="/explore" className="btn-primary px-8 py-3 rounded-xl">
            Explore all 232 wines →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TasteProfiler() {
  const [step, setStep] = useState(-1)           // -1 = intro
  const [questions, setQuestions] = useState([]) // shuffled set for this run
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const isIntro = step === -1
  const isDone = questions.length > 0 && step === questions.length
  const question = !isIntro && !isDone ? questions[step] : null

  const target = useMemo(
    () => (isDone ? computeTarget(answers) : null),
    [isDone, answers]
  )
  const results = useMemo(
    () => (isDone ? scoreWines(answers, questions) : []),
    [isDone, answers, questions]
  )
  const personality = useMemo(
    () => (isDone && target ? derivePersonality(target, answers) : null),
    [isDone, target, answers]
  )

  function handleStart() {
    setQuestions(pickQuestions())
    setStep(0)
    setAnswers([])
    setSelected(null)
  }

  function handleSelect(opt) {
    setSelected(opt)
  }

  function handleNext() {
    if (!selected) return
    setAnswers(prev => [...prev, selected])
    setSelected(null)
    setStep(s => s + 1)
  }

  function handleBack() {
    if (step === 0) {
      setStep(-1)
      setAnswers([])
      setSelected(null)
      return
    }
    setStep(s => s - 1)
    setAnswers(a => a.slice(0, -1))
    setSelected(null)
  }

  function handleReset() {
    setStep(-1)
    setAnswers([])
    setSelected(null)
    setQuestions([])
  }

  if (isIntro) return <IntroScreen onStart={handleStart} />

  if (isDone && personality) {
    return (
      <ResultsScreen
        results={results}
        personality={personality}
        onReset={handleReset}
      />
    )
  }

  if (!question) return null

  return (
    <QuizScreen
      question={question}
      questionNumber={step + 1}
      totalQuestions={questions.length}
      selected={selected}
      onSelect={handleSelect}
      onNext={handleNext}
      onBack={handleBack}
    />
  )
}
