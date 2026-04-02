import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { wines } from '../data/wines'
import { useCellar } from '../hooks/useCellar'
import TasteProfile from '../components/TasteProfile'
import { generateOurTake } from '../utils/ourTake'
import { RetailerBadge } from '../utils/retailerBrands'
import { getRecommendations } from '../utils/wineRecommendations'
import { getWineVisual, getWineVisualTreatment } from '../utils/wineVisuals'
import { getWineVintageLabel } from '../utils/wineDisplay'

const RATING_LABEL = { exceptional: '★★★ Exceptional', great: '★★ Great', good: '★ Good', average: '— Average' }
const RATING_COLOR = { exceptional: 'text-gold', great: 'text-sage', good: 'text-slate-lt', average: 'text-slate-lt/50' }
const CAT_DOT = { sparkling:'#D4AF37', white:'#C9B840', red:'#8B1A2F', rosé:'#E07090', dessert:'#C9973A' }
const CATEGORY_PANEL = {
  sparkling: 'from-[#3b3113] via-[#5b4818] to-[#7a6323]',
  white: 'from-[#1f3b31] via-[#2e5144] to-[#47695b]',
  red: 'from-[#4a1020] via-[#6b1f2e] to-[#7a2238]',
  rosé: 'from-[#5d2133] via-[#8b3d53] to-[#a25667]',
  dessert: 'from-[#4c2808] via-[#714015] to-[#8a5522]',
}

function getPairingSpotlight(wine) {
  const firstPairing = wine.pairings?.[0]
  if (!firstPairing) return null
  return typeof firstPairing === 'string' ? firstPairing : firstPairing.dish
}

function getOriginLine(wine) {
  return [wine.subregion, wine.region, wine.country].filter(Boolean).join(' · ')
}

function getPracticalSnapshot(wine, pairingSpotlight, vintageContext) {
  return [
    { label: 'Drink for', value: pairingSpotlight || 'Food-first bottle' },
    { label: 'Open now?', value: wine.style?.includes('age-worthy') || wine.style?.includes('aged') ? 'Can cellar or decant' : 'Drink for freshness' },
    { label: 'Buy route', value: wine.whereToBuy?.[0]?.name || wine.price },
    { label: 'Serving', value: wine.servingTemp || 'Serve cool' },
    { label: 'Glass', value: wine.glassware || 'Standard wine glass' },
    { label: 'Vintage note', value: vintageContext },
  ]
}

function getPairingCards(wine) {
  return (wine.pairings || []).map((pair, index) => ({
    ...pair,
    index: index + 1,
  }))
}

function getStyleReadout(wine) {
  return wine.style?.slice(0, 3).join(' · ') || 'Classic guide pick'
}

function getLeadSentence(text) {
  if (!text) return ''
  const match = text.trim().match(/(.+?[.!?])(\s|$)/)
  return match?.[1] || text.trim()
}

function getSupportingSentence(text) {
  if (!text) return ''
  const sentences = text.trim().match(/[^.!?]+[.!?]+/g) || [text.trim()]
  return sentences[1]?.trim() || ''
}

function splitSentences(text) {
  if (!text) return []
  return (text.trim().match(/[^.!?]+[.!?]+/g) || [text.trim()]).map(sentence => sentence.trim())
}

function getProducerContext(wine) {
  return getLeadSentence(wine.background) || `${wine.producer} is one of the guide's reference names for ${wine.region || wine.country}.`
}

function getSiteContext(wine) {
  return getLeadSentence(wine.terroir) || `${getOriginLine(wine)} gives this wine its place-defining shape and character.`
}

function getVintageContext(wine) {
  const currentVintage = wine.vintageGuide?.find(entry => String(entry.year) === String(wine.vintage))
  const bestVintage = wine.vintageGuide?.find(entry => entry.rating === 'exceptional') || wine.vintageGuide?.[0]

  if (currentVintage) {
    return `${currentVintage.year}: ${currentVintage.notes}`
  }

  if (bestVintage) {
    return `${bestVintage.year} is a strong benchmark in the guide: ${bestVintage.notes}`
  }

  if (wine.style?.includes('age-worthy') || wine.style?.includes('aged')) {
    return 'This is the kind of bottle worth opening with time and attention rather than rushing through.'
  }

  return 'Best approached as a style-first bottle: serve it well, pair it properly, and let the glass do the rest.'
}

function getOccasionContext(wine, pairingSpotlight) {
  if (pairingSpotlight) {
    return `Start with ${pairingSpotlight.toLowerCase()} if you want the wine to show its shape early.`
  }

  if (wine.category === 'sparkling') return 'Best when you want lift, texture, and a more celebratory first impression.'
  if (wine.category === 'white') return 'Best when freshness, texture, and detail matter more than sheer weight.'
  if (wine.category === 'red') return 'Best with a little space, a proper glass, and something savoury on the table.'
  if (wine.category === 'dessert') return 'Best as a finishing bottle, or when the cheese and pudding need equal attention.'
  return 'Best treated as a table wine with enough personality to carry the evening.'
}

function getGrapeContext(wine) {
  return getLeadSentence(wine.grapeNotes) || wine.grapes.join(', ')
}

function getStoryDetail(wine) {
  return getSupportingSentence(wine.background) || getSupportingSentence(wine.terroir) || ''
}

function getStoryFactLabel(sentence) {
  if (/(churchill|tsar|widow|napoleonic|war|post-war|monk|abbey|russia|royal)/i.test(sentence)) return 'History'
  if (/(founded|created|invented|since|first released|first commercial|first)/i.test(sentence)) return 'Legacy'
  if (/(biodynamic|ungrafted|grand cru|single-vineyard|reserve wine|cellars|cray[eè]res|chalk|lees|disgorged|estate fruit|old vines)/i.test(sentence)) return 'House detail'
  if (/\d{4}|hectares|metres|years on lees|decades/i.test(sentence)) return 'Numbers'
  return 'Why it matters'
}

function getStoryFacts(wine) {
  const lead = getLeadSentence(wine.background)
  const candidates = [...splitSentences(wine.background), ...splitSentences(wine.terroir)]
    .map(sentence => sentence.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter(sentence => sentence !== lead)
    .filter(sentence => sentence.length >= 45 && sentence.length <= 240)

  const unique = [...new Map(candidates.map(sentence => [sentence, sentence])).values()]

  const scored = unique.map(sentence => {
    let score = 0
    if (/(churchill|tsar|widow|napoleonic|war|post-war|royal|monk|abbey|russia)/i.test(sentence)) score += 4
    if (/(founded|created|invented|first|since|release|released)/i.test(sentence)) score += 3
    if (/(biodynamic|ungrafted|grand cru|single-vineyard|reserve wine|cellars|cray[eè]res|chalk|lees|estate fruit|old vines)/i.test(sentence)) score += 3
    if (/\d{4}|hectares|metres|years/i.test(sentence)) score += 2
    return { sentence, score, label: getStoryFactLabel(sentence) }
  })

  return scored
    .sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length)
    .slice(0, 3)
}

function getGuideAngle(wine, pairingSpotlight) {
  if (wine.category === 'sparkling') {
    return `A bottle for drinkers who like tension, texture, and the kind of fizz that can carry proper food${pairingSpotlight ? `, especially ${pairingSpotlight.toLowerCase()}` : ''}.`
  }
  if (wine.category === 'white') {
    return `A bottle for drinkers who care about freshness, shape, and detail more than sheer richness${pairingSpotlight ? `, with ${pairingSpotlight.toLowerCase()} as a smart first pairing` : ''}.`
  }
  if (wine.category === 'red') {
    return `A bottle for drinkers who want structure, savour, and enough personality to stand up to the table${pairingSpotlight ? `, particularly ${pairingSpotlight.toLowerCase()}` : ''}.`
  }
  if (wine.category === 'dessert') {
    return 'A bottle for drinkers who want sweetness with definition, not just richness, and enough character to handle pudding or cheese.'
  }
  return 'A bottle that earns its place through identity, not just score.'
}

function getStoryMarkers(wine, pairingSpotlight) {
  return [
    wine.subregion || wine.region,
    wine.grapes?.[0],
    wine.style?.[0],
    pairingSpotlight,
  ].filter(Boolean).slice(0, 4)
}

function getTabSummary(tab, wine, pairingSpotlight, pairingCards, pairingCuisines, vintageContext) {
  if (tab === 'overview') {
    return {
      title: 'Overview',
      description: 'Start with the bottle story, the site, and the grape profile before dropping into the more practical tabs.',
      chips: [wine.producer, wine.subregion || wine.region, getStyleReadout(wine)].filter(Boolean),
    }
  }

  if (tab === 'tasting') {
    return {
      title: 'Tasting guide',
      description: 'This is the sensory read: colour, nose, palate, finish, and the quick visual profile of the wine.',
      chips: ['Colour to finish', getStyleReadout(wine), wine.glassware].filter(Boolean),
    }
  }

  if (tab === 'pairings') {
    return {
      title: 'Pairings',
      description: 'Use the pairing cards when you want the bottle to make immediate sense at the table.',
      chips: [
        pairingSpotlight || 'Food-first bottle',
        `${pairingCards.length} pairings`,
        pairingCuisines[0] || 'Classic European',
      ].filter(Boolean),
    }
  }

  if (tab === 'vintages') {
    return {
      title: 'Vintage guide',
      description: 'The year-by-year read helps you judge whether to buy now, drink now, or hunt down a stronger vintage.',
      chips: [getWineVintageLabel(wine), vintageContext, wine.region].filter(Boolean).slice(0, 3),
    }
  }

  return {
    title: 'Where to buy',
    description: 'Use this tab for trusted routes, market equivalents, and quick buying context.',
    chips: [wine.price, wine.whereToBuy?.[0]?.name, wine.country].filter(Boolean),
  }
}

function getComparisonLanes(wine, allWines, related) {
  const sameProducer = allWines.find(other => other.id !== wine.id && other.producer === wine.producer)

  const sameRegion = allWines.find(other =>
    other.id !== wine.id &&
    !sameProducer?.id?.includes(other.id) &&
    (
      (wine.subregion && other.subregion === wine.subregion) ||
      other.region === wine.region
    )
  )

  const sameMood = related.find(other =>
    other.id !== wine.id &&
    other.id !== sameProducer?.id &&
    other.id !== sameRegion?.id
  )

  return [
    sameProducer && {
      key: 'house',
      title: 'Stay with the house',
      description: `Compare this bottle with another ${wine.producer} wine to see what stays constant across the range.`,
      wine: sameProducer,
    },
    sameRegion && {
      key: 'region',
      title: 'Stay with the place',
      description: `Compare it with another bottle from ${sameRegion.subregion || sameRegion.region} to read the region more clearly.`,
      wine: sameRegion,
    },
    sameMood && {
      key: 'mood',
      title: 'Stay with the mood',
      description: 'Branch into a nearby bottle with a similar feel, but a slightly different story or shape.',
      wine: sameMood,
    },
  ].filter(Boolean)
}

export default function WineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const wine = wines.find(w => w.id === id)
  const [activeTab, setActiveTab] = useState('overview')
  const [cellarModal, setCellarModal] = useState(false)
  const [wishlistDone, setWishlistDone] = useState(false)

  const { isInCellar, isInWishlist, addBottle, addToWishlist } = useCellar()

  if (!wine) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-slate mb-4">Wine not found</p>
          <Link to="/explore" className="btn-primary">Back to Explorer</Link>
        </div>
      </main>
    )
  }

  const related = getRecommendations(wine, wines, 3)
  const panelGradient = CATEGORY_PANEL[wine.category] || CATEGORY_PANEL.red
  const wineVisual = getWineVisual(wine)
  const imageTreatment = getWineVisualTreatment(wine)
  const pairingSpotlight = getPairingSpotlight(wine)
  const pairingCards = getPairingCards(wine)
  const pairingCuisines = [...new Set(pairingCards.map(pair => pair.cuisine).filter(Boolean))]
  const producerContext = getProducerContext(wine)
  const siteContext = getSiteContext(wine)
  const vintageContext = getVintageContext(wine)
  const occasionContext = getOccasionContext(wine, pairingSpotlight)
  const grapeContext = getGrapeContext(wine)
  const storyDetail = getStoryDetail(wine)
  const activeTabSummary = getTabSummary(activeTab, wine, pairingSpotlight, pairingCards, pairingCuisines, vintageContext)
  const guideAngle = getGuideAngle(wine, pairingSpotlight)
  const storyMarkers = getStoryMarkers(wine, pairingSpotlight)
  const storyFacts = getStoryFacts(wine)
  const practicalSnapshot = getPracticalSnapshot(wine, pairingSpotlight, vintageContext)
  const comparisonLanes = getComparisonLanes(wine, wines, related)
  const vintageLabel = getWineVintageLabel(wine)

  const handleWishlist = () => {
    addToWishlist({ wineId: wine.id, name: wine.name, producer: wine.producer, vintage: wine.vintage, region: wine.region, category: wine.category })
    setWishlistDone(true)
    setTimeout(() => setWishlistDone(false), 2500)
  }

  const TABS = ['overview', 'tasting', 'pairings', 'vintages', 'buy']

  return (
    <main className="pt-16 min-h-screen">
      {/* ── HERO ─────────────────────────────── */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-body text-xs text-slate-lt mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-gold transition-colors">Explore</Link>
            <span>/</span>
            <Link to={`/explore?category=${wine.category}`} className="hover:text-gold transition-colors capitalize">{wine.category}</Link>
            <span>/</span>
            <span className="text-slate">{wine.name}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Main info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="wine-dot" style={{ background: CAT_DOT[wine.category] || '#888' }} />
                <span className="font-body text-sm text-slate-lt capitalize">{wine.category}</span>
                {wine.subcategory && (
                  <>
                    <span className="text-slate-lt/40">·</span>
                    <span className="font-body text-sm text-slate-lt capitalize">{wine.subcategory}</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-semibold text-slate leading-tight mb-2">
                {wine.name}
              </h1>
              <Link to={`/producers/${wine.producer?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="font-display text-xl text-slate-lt italic mb-4 hover:text-gold transition-colors inline-block">{wine.producer}</Link>

              <div className="rounded-[1.95rem] border border-cream bg-gradient-to-br from-white via-[#f9f4e9] to-[#f3ebdc] p-5 mb-5">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Estate story</p>
                    <h2 className="font-display text-[2rem] leading-tight text-slate">Why this bottle is interesting</h2>
                  </div>
                  <p className="font-body text-sm text-slate-lt max-w-lg">
                    The narrative comes first here: house history, grapes in play, vineyard setting, and the vintage mood.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag bg-slate text-white text-[10px]">
                    {RATING_LABEL[wine.ratingBand] || `${wine.rating}/100`}
                  </span>
                  {storyMarkers.map(marker => (
                    <span key={marker} className="tag bg-white border border-cream text-slate text-[10px] capitalize">
                      {marker}
                    </span>
                  ))}
                </div>
                <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4">
                  <div className="rounded-[1.5rem] bg-white border border-cream/80 px-5 py-5">
                    <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/75">House story</p>
                    <p className="font-body text-base text-slate mt-3 leading-relaxed">{producerContext}</p>
                    {storyDetail && (
                      <p className="font-body text-sm text-slate-lt mt-3 leading-relaxed">{storyDetail}</p>
                    )}
                    {storyFacts.length > 0 && (
                      <div className="mt-4 rounded-[1.6rem] bg-[#fbf7ee] border border-cream/80 px-4 py-4">
                        <p className="font-body text-[10px] uppercase tracking-[0.16em] text-gold">Estate notebook</p>
                        <div className="mt-3 space-y-3">
                          {storyFacts.map(fact => (
                            <div key={fact.sentence} className="rounded-2xl bg-white/80 border border-cream/70 px-3 py-3">
                              <span className="inline-flex items-center rounded-full bg-gold/10 border border-gold/20 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.14em] text-gold">
                                {fact.label}
                              </span>
                              <p className="font-body text-sm text-slate mt-2 leading-relaxed">{fact.sentence}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-gold/6 border border-gold/20 px-4 py-4">
                        <p className="font-body text-[10px] uppercase tracking-[0.16em] text-gold">Our take</p>
                        <p className="font-body text-sm text-slate italic leading-relaxed mt-2">
                          "{wine.ourTake || generateOurTake(wine)}"
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate/3 border border-cream/80 px-4 py-4">
                        <p className="font-body text-[10px] uppercase tracking-[0.16em] text-gold">Guide angle</p>
                        <p className="font-body text-sm text-slate-lt leading-relaxed mt-2">
                          {guideAngle}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {[
                      { label: 'Grapes in play', value: grapeContext },
                      { label: 'Vineyard setting', value: siteContext },
                      { label: 'Vintage tension', value: vintageContext },
                      { label: 'Best occasion', value: occasionContext },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl bg-white border border-cream/80 px-4 py-4">
                        <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/75">{item.label}</p>
                        <p className="font-body text-sm text-slate mt-2 leading-relaxed">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Guide score', value: `${wine.rating}/100` },
                  { label: 'Region', value: `${wine.region}, ${wine.country}` },
                  { label: 'Vintage', value: vintageLabel },
                  { label: 'Price read', value: wine.price },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl border border-cream bg-white px-4 py-3">
                    <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/75">{item.label}</p>
                    <p className="font-body text-sm text-slate mt-1.5 leading-snug">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.9rem] border border-cream bg-gradient-to-br from-white to-[#f7f0e3] p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Quick decode</p>
                    <h2 className="font-display text-2xl text-slate">The short version</h2>
                  </div>
                  <p className="font-body text-sm text-slate-lt max-w-md">
                    The fast read before you settle into the longer story and the detailed tabs below.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Origin', value: getOriginLine(wine) },
                    { label: 'Visual cue', value: imageTreatment.badge },
                    { label: 'Start with', value: pairingSpotlight || 'Food-first bottle' },
                    { label: 'Style read', value: getStyleReadout(wine) },
                  ].map(item => (
                    <div key={item.label} className="rounded-2xl bg-white border border-cream/80 px-4 py-4">
                      <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/75">{item.label}</p>
                      <p className="font-body text-sm text-slate mt-2 leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4 mb-6">
                <div className="card p-5">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">In the glass</p>
                  <h3 className="font-display text-2xl text-slate">Style snapshot</h3>
                  <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">
                    {getStyleReadout(wine)}. A quick visual read of structure, lift, and weight before you get into the tasting tab.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {wine.style.slice(0, 4).map(s => (
                      <span key={s} className="tag bg-gold/10 border border-gold/25 text-gold capitalize">{s}</span>
                    ))}
                  </div>
                  <div className="flex justify-center mt-5">
                    <TasteProfile profile={wine.tasteProfile} color={CAT_DOT[wine.category]} size={138} />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-cream bg-white p-5">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Serve it like this</p>
                      <h3 className="font-display text-2xl text-slate">Service cue</h3>
                    </div>
                    <p className="font-body text-sm text-slate-lt max-w-sm">
                      The practical read, so the wine lands properly once it is on the table.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Serve at', value: wine.servingTemp },
                      { label: 'Decant', value: wine.decant || 'Not needed' },
                      { label: 'Glassware', value: wine.glassware },
                      { label: 'Best first dish', value: pairingSpotlight || 'Food-first bottle' },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-4">
                        <p className="font-body text-[10px] uppercase tracking-[0.16em] text-slate-lt/75">{item.label}</p>
                        <p className="font-body text-sm text-slate mt-2 leading-relaxed">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grapes */}
              <div className="flex flex-wrap gap-2 mb-6">
                {wine.grapes.map(g => (
                  <span key={g} className="tag bg-cream text-slate border border-cream/80">{g}</span>
                ))}
              </div>

              <p className="font-body text-slate-lt leading-relaxed">{wine.background}</p>

              {/* Tom Gilby rating — only shown when wine has gilbyRating data */}
              {wine.gilbyRating && (
                <div className="mt-4 p-5 rounded-2xl bg-navy border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <a
                      href={wine.gilbyVideoUrl || 'https://www.youtube.com/@TomGilby'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-gold transition-colors"
                    >
                      Tom Gilby says ↗
                    </a>
                    <GilbyBadge rating={wine.gilbyRating} />
                  </div>
                  {wine.gilbyNote && (
                    <p className="font-body text-sm text-white/70 italic leading-relaxed">"{wine.gilbyNote}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              {/* Label image */}
              {wineVisual && (
                <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${panelGradient} p-5 text-white shadow-card`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_36%)]" aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-gold-lt/85">{imageTreatment.kicker}</p>
                      <h2 className="font-display text-2xl text-white mt-2">{imageTreatment.title}</h2>
                    </div>
                    <span className="tag bg-white/10 border border-white/20 text-white/80 text-[10px]">
                      {wine.rating}/100
                    </span>
                  </div>
                  <div className="relative rounded-[1.5rem] bg-white/96 border border-white/60 p-4 flex justify-center min-h-[14rem] overflow-hidden">
                    <img
                      src={wineVisual.src}
                      alt={wineVisual.alt}
                      className="max-h-56 object-contain rounded-lg relative z-10"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/70 to-transparent" aria-hidden="true" />
                  </div>
                  <p className="relative mt-4 font-body text-sm text-white/72 leading-relaxed">
                    {imageTreatment.note}
                  </p>
                  <div className="relative mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Region', value: wine.region },
                      { label: 'Vintage', value: vintageLabel },
                      { label: 'Price', value: wine.price },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2">
                        <p className="font-body text-[9px] uppercase tracking-[0.16em] text-white/55">{item.label}</p>
                        <p className="font-body text-xs text-white mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-3 flex flex-wrap gap-2">
                    {pairingSpotlight && (
                      <span className="tag bg-white/10 border border-white/15 text-white/80 text-[10px]">
                        Best with {pairingSpotlight}
                      </span>
                    )}
                    <span className="tag bg-white/10 border border-white/15 text-white/80 text-[10px]">
                      {wine.country}
                    </span>
                    {wine.subregion && (
                      <span className="tag bg-white/10 border border-white/15 text-white/80 text-[10px]">
                        {wine.subregion}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="card p-5 bg-[#fbf7ee] border border-cream/90">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display text-2xl text-slate">Collector Cues</h3>
                    <p className="font-body text-sm text-slate-lt mt-1">
                      The practical read: how to serve it, when to open it, and what kind of buying route makes most sense.
                    </p>
                  </div>
                  <span className="tag bg-white border border-cream text-slate text-[10px]">
                    {RATING_LABEL[wine.ratingBand] || `${wine.rating}/100`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {practicalSnapshot.map(item => (
                    <div key={item.label} className="rounded-2xl bg-white border border-cream/80 px-3 py-3">
                      <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">{item.label}</p>
                      <p className="font-body text-sm text-slate mt-1 leading-snug">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-slate/3 border border-cream/80 px-4 py-3">
                  <p className="font-body text-[10px] uppercase tracking-[0.16em] text-gold">What kind of bottle this is</p>
                  <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">
                    {guideAngle}
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCellarModal(true)}
                  disabled={isInCellar(wine.id)}
                  className={isInCellar(wine.id) ? 'btn-secondary opacity-60 cursor-default' : 'btn-primary'}
                >
                  {isInCellar(wine.id) ? '✓ In My Cellar' : '+ Add to My Cellar'}
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={isInWishlist(wine.id) || wishlistDone}
                  className="btn-secondary"
                >
                  {wishlistDone || isInWishlist(wine.id) ? '✓ On Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-8 border-b border-cream overflow-x-auto scrollbar-none">
            {TABS.map(tab => {
              const label = tab === 'buy' ? 'Buy'
                : tab === 'vintages' ? 'Vintages'
                : tab.charAt(0).toUpperCase() + tab.slice(1)
              const labelLg = tab === 'buy' ? 'Where to Buy'
                : tab === 'vintages' ? 'Vintage Guide'
                : label
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-[13px] px-3 sm:px-5 py-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? 'border-gold text-gold font-medium'
                      : 'border-transparent text-slate-lt hover:text-slate'
                  }`}
                >
                  <span className="sm:hidden">{label}</span>
                  <span className="hidden sm:inline">{labelLg}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-5 rounded-[1.75rem] border border-cream bg-[#fbf7ee] px-5 py-4">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-1">{activeTabSummary.title}</p>
                <p className="font-body text-sm text-slate-lt max-w-3xl leading-relaxed">
                  {activeTabSummary.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTabSummary.chips.map(chip => (
                  <span key={chip} className="tag bg-white border border-cream text-slate text-[10px]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
            <div>
              <div className="rounded-[1.9rem] border border-cream bg-gradient-to-br from-white to-[#f7f0e3] p-6">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Long read</p>
                <h2 className="font-display text-3xl text-slate mb-4">The fuller bottle story</h2>
                <p className="font-body text-slate-lt leading-relaxed">{wine.background}</p>
              </div>
              {wine.terroir && (
                <div className="mt-5 rounded-[1.75rem] border border-cream bg-white p-6">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-slate-lt/70 mb-2">Place & site</p>
                  <p className="font-body text-slate-lt leading-relaxed">{wine.terroir}</p>
                </div>
              )}
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-[1.75rem] border border-cream bg-[#fbf7ee] p-5">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Why it stands out</p>
                  <p className="font-body text-sm text-slate-lt leading-relaxed">
                    {imageTreatment.summary}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-cream bg-white p-5">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Cellar read</p>
                  <p className="font-body text-sm text-slate-lt leading-relaxed">
                    {vintageContext}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-[1.9rem] border border-cream bg-white p-6">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Variety profile</p>
                <h3 className="font-display text-2xl text-slate mb-4">The Grape</h3>
                <p className="font-body text-slate-lt leading-relaxed">{wine.grapeNotes}</p>
              </div>
              <div className="mt-5 rounded-[1.75rem] border border-cream bg-white p-6">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Guide hallmarks</p>
                <div className="grid gap-4">
                  <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-4">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Grapes in play</p>
                    <p className="font-body text-sm text-slate mt-2 leading-relaxed">{grapeContext}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-4">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">In the glass</p>
                    <p className="font-body text-sm text-slate mt-2 leading-relaxed">
                      {getStyleReadout(wine)}. {imageTreatment.summary}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-4">
                      <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Site read</p>
                      <p className="font-body text-sm text-slate mt-2 leading-relaxed">{siteContext}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-4">
                      <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Table mood</p>
                      <p className="font-body text-sm text-slate mt-2 leading-relaxed">{occasionContext}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-5 bg-cream/50 mt-5">
                <h4 className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt mb-4">At a Glance</h4>
                <dl className="space-y-2 font-body text-sm">
                  {[
                    ['Region', wine.subregion || wine.region],
                    ['Country', wine.country],
                    ['Vintage', vintageLabel],
                    ['Grapes', wine.grapes.join(', ')],
                    ['Style', wine.style.join(', ')],
                    ['Price', wine.price],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-slate-lt">{label}</dt>
                      <dd className="text-slate font-medium text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* TASTING */}
        {activeTab === 'tasting' && (
          <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
            <div>
              <div className="rounded-[2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f2eadb] p-6 mb-6">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Tasting guide</p>
                <h2 className="font-display text-3xl text-slate mb-2">How it unfolds in the glass</h2>
                <p className="font-body text-slate-lt">
                  Read the wine in sequence, from first impression through to the finish, then use the profile wheel for a quicker summary.
                </p>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Colour', icon: '👁', key: 'colour' },
                  { label: 'Nose',   icon: '👃', key: 'nose' },
                  { label: 'Palate', icon: '👅', key: 'palate' },
                  { label: 'Finish', icon: '✨', key: 'finish' },
                ].map(({ label, icon, key }) => (
                  <div key={key} className="rounded-[1.75rem] border border-cream bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/8 text-xl">{icon}</span>
                      <div>
                        <p className="font-body text-xs tracking-[0.15em] uppercase text-slate-lt">{label}</p>
                        <p className="font-body text-[11px] text-slate-lt/70 mt-1">Part of the guide tasting sequence</p>
                      </div>
                    </div>
                    <p className="font-body text-slate leading-relaxed">{wine.tastingNotes?.[key]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="rounded-[1.9rem] border border-cream bg-white p-6 mb-5">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Style snapshot</p>
                <h3 className="font-display text-2xl text-slate mb-4">What to expect</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-3">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Style</p>
                    <p className="font-body text-sm text-slate mt-1 leading-snug">{getStyleReadout(wine)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fbf7ee] border border-cream px-4 py-3">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Food mood</p>
                    <p className="font-body text-sm text-slate mt-1 leading-snug">{pairingSpotlight || 'Food-first bottle'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wine.style.map(s => (
                    <span key={s} className="tag bg-gold/10 border border-gold/30 text-gold capitalize">{s}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.9rem] border border-cream bg-white p-6">
                <h3 className="font-display text-xl text-slate mb-4">Tasting Profile</h3>
                <p className="font-body text-sm text-slate-lt mb-5">
                  A quick visual read of structure, weight, freshness, and aromatic lift.
                </p>
                <TasteProfile profile={wine.tasteProfile} color={CAT_DOT[wine.category]} size={200} />
              </div>
            </div>
          </div>
        )}

        {/* PAIRINGS */}
        {activeTab === 'pairings' && (
          <div className="animate-fade-in">
            <div className="rounded-[2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f2eadb] p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Food pairing guide</p>
                  <h2 className="font-display text-3xl text-slate mb-2">What to cook with it</h2>
                  <p className="font-body text-slate-lt max-w-2xl">
                    Start with the dishes below, then use the pairing wizard if you want to branch out into similar styles.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-0 lg:min-w-[22rem]">
                  <div className="rounded-2xl bg-white border border-cream px-3 py-3">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Best first dish</p>
                    <p className="font-body text-sm text-slate mt-1 leading-snug">{pairingSpotlight || 'Food-first bottle'}</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-cream px-3 py-3">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Pairings</p>
                    <p className="font-body text-sm text-slate mt-1 leading-snug">{pairingCards.length}</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-cream px-3 py-3 sm:col-span-1 col-span-2">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/75">Cuisines in play</p>
                    <p className="font-body text-sm text-slate mt-1 leading-snug">
                      {pairingCuisines.length > 0 ? pairingCuisines.join(' · ') : 'Classic European'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pairingCards.map((pair) => (
                <div key={`${pair.dish}-${pair.index}`} className="rounded-[1.75rem] border border-cream bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">
                        Pairing {pair.index}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-slate">{pair.dish}</h3>
                    </div>
                    {pair.cuisine && (
                      <span className="tag bg-terracotta/10 text-terracotta border border-terracotta/20 text-[10px] capitalize">
                        {pair.cuisine}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-slate-lt leading-relaxed">{pair.reason}</p>
                  <div className="mt-4 pt-4 border-t border-cream/80">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-slate-lt/70">Why it works</p>
                    <p className="font-body text-xs text-slate mt-2 leading-relaxed">
                      {wine.name} brings {wine.style?.slice(0, 2).join(' and ') || 'enough shape and freshness'} to the table, so this match stays balanced rather than heavy.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-cream/50 rounded-2xl">
              <p className="font-body text-sm text-slate-lt">
                <strong className="text-slate">Looking for more pairings?</strong>{' '}
                <Link to="/pairing" className="text-gold hover:underline">Open the full pairing wizard</Link> to explore what wines match the dishes you love to cook.
              </p>
            </div>
          </div>
        )}

        {/* VINTAGES */}
        {activeTab === 'vintages' && (
          <div className="animate-fade-in">
            <div className="rounded-[2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f2eadb] p-6 mb-8 max-w-4xl">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Vintage guide</p>
              <h2 className="font-display text-3xl text-slate mb-2">How the years compare</h2>
              <p className="font-body text-slate-lt">
                Use this to decide whether to buy now, cellar longer, or hunt out a stronger vintage if you have the choice.
              </p>
            </div>
            <div className="space-y-3 max-w-2xl">
              {wine.vintageGuide?.map(v => (
                <div key={v.year} className="rounded-[1.75rem] border border-cream bg-white p-5 flex items-start gap-4 shadow-sm">
                  <div className="text-center w-20 flex-shrink-0 rounded-2xl bg-[#fbf7ee] border border-cream px-3 py-3">
                    <p className="font-display text-2xl font-semibold text-slate">{v.year}</p>
                  </div>
                  <div className="flex-1">
                    <span className={`font-body text-sm font-medium ${RATING_COLOR[v.rating]}`}>
                      {RATING_LABEL[v.rating]}
                    </span>
                    <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">{v.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUY */}
        {activeTab === 'buy' && (
          <div className="animate-fade-in">
            <div className="rounded-[2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f2eadb] p-6 mb-8 max-w-4xl">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Buying guide</p>
              <h2 className="font-display text-3xl text-slate mb-2">Where to Buy</h2>
              <p className="font-body text-slate-lt">
                Trusted routes for finding this bottle or a close market equivalent, with notes on how each source fits the wine.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
              {wine.whereToBuy?.map((source, i) => (
                <div key={i} className="rounded-[1.75rem] border border-cream bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <RetailerBadge name={source.name} />
                    <span className="tag bg-cream text-slate-lt text-[10px] capitalize whitespace-nowrap">{source.type}</span>
                  </div>
                  <p className="font-body text-sm text-slate-lt leading-relaxed">{source.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-5 bg-gold/5 rounded-2xl max-w-3xl border border-gold/15">
              <p className="font-body text-sm text-slate-lt">
                <strong className="text-slate">Tip:</strong> Use{' '}
                <span className="text-gold font-medium">Wine Searcher</span> to compare current prices across retailers worldwide, or check{' '}
                <span className="text-gold font-medium">Wine-Searcher Pro</span> for auction and fine wine specialist pricing.
              </p>
            </div>
          </div>
        )}
      </div>

      {comparisonLanes.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-2 pb-10">
          <div className="rounded-[2rem] border border-cream bg-gradient-to-br from-[#fcfaf4] via-white to-[#f3ebdc] p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="section-label mb-1">Compare Next</p>
                <h2 className="font-display text-3xl text-slate">Three smart ways to branch out</h2>
              </div>
              <p className="font-body text-sm text-slate-lt max-w-2xl">
                Once you understand this bottle, compare by house, place, or mood to make the guide feel more connected.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              {comparisonLanes.map(lane => {
                const laneVisual = getWineVisual(lane.wine)
                const laneTreatment = getWineVisualTreatment(lane.wine)
                const lanePairing = getPairingSpotlight(lane.wine)
                return (
                  <Link
                    key={lane.key}
                    to={`/explore/${lane.wine.id}`}
                    className="rounded-[1.75rem] border border-cream bg-white p-5 hover:-translate-y-1 transition-all duration-300"
                  >
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">{lane.title}</p>
                    <h3 className="font-display text-2xl text-slate leading-tight">{lane.wine.name}</h3>
                    <p className="font-body text-sm text-slate-lt mt-1">{lane.wine.producer}</p>
                    <p className="font-body text-sm text-slate-lt mt-3 leading-relaxed">{lane.description}</p>
                    {laneVisual && (
                      <div className="mt-4 rounded-[1.35rem] bg-[radial-gradient(circle_at_top,#ffffff,rgba(248,240,227,0.88))] border border-cream/70 h-44 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 z-10">
                          <span className="tag bg-slate text-white text-[10px]">{laneTreatment.shortBadge}</span>
                          <span className="tag bg-white/90 border border-cream text-slate text-[10px]">{lane.wine.rating}/100</span>
                        </div>
                        <img
                          src={laneVisual.src}
                          alt={laneVisual.alt}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="tag bg-cream text-slate text-[10px]">{getWineVintageLabel(lane.wine)}</span>
                      <span className="tag bg-white border border-cream text-slate text-[10px]">{getOriginLine(lane.wine)}</span>
                      {lanePairing && (
                        <span className="tag bg-gold/10 border border-gold/20 text-gold text-[10px]">{lanePairing}</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── RELATED WINES ────────────────────── */}
      {related.length > 0 && (
        <div className="bg-cream/30 border-t border-cream py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="section-label mb-1">Continue Exploring</p>
                <h2 className="font-display text-3xl text-slate">You Might Also Like</h2>
              </div>
              <p className="font-body text-sm text-slate-lt max-w-xl">
                Nearby bottles in style, mood, or category, with the same visual-first treatment where possible.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map(w => {
                const relatedVisual = getWineVisual(w)
                const relatedTreatment = getWineVisualTreatment(w)
                const relatedPairingSpotlight = getPairingSpotlight(w)
                return (
                  <Link
                    key={w.id}
                    to={`/explore/${w.id}`}
                    className="rounded-[1.5rem] border border-cream bg-gradient-to-br from-white to-[#f5efe4] p-4 group hover:-translate-y-1 transition-all duration-300"
                  >
                    {relatedVisual && (
                      <div className="rounded-[1.2rem] bg-[radial-gradient(circle_at_top,#ffffff,rgba(248,240,227,0.88))] border border-cream/70 h-40 flex items-center justify-center overflow-hidden mb-4 relative">
                        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 z-10">
                          <span className="tag bg-slate text-white text-[10px]">{relatedTreatment.shortBadge}</span>
                          <span className="tag bg-white/90 border border-cream text-slate text-[10px]">{w.rating}/100</span>
                        </div>
                        <img
                          src={relatedVisual.src}
                          alt={relatedVisual.alt}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className="section-label mb-2">{getOriginLine(w)}</p>
                    <h3 className="font-display text-xl font-semibold text-slate mb-1 leading-tight">{w.name}</h3>
                    <p className="font-body text-sm text-slate-lt">{w.producer}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="tag bg-cream text-slate text-[10px]">{w.vintage}</span>
                      <span className="tag bg-gold/10 border border-gold/25 text-gold text-[10px]">{w.price}</span>
                      {relatedPairingSpotlight && (
                        <span className="tag bg-white border border-cream text-slate-lt text-[10px]">
                          {relatedPairingSpotlight}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-slate-lt leading-relaxed mt-3 line-clamp-2">
                      {relatedTreatment.summary}
                    </p>
                  </Link>
                )})}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD TO CELLAR MODAL ──────────────── */}
      {cellarModal && (
        <AddToCellarModal wine={wine} onClose={() => setCellarModal(false)} />
      )}
    </main>
  )
}

function AddToCellarModal({ wine, onClose }) {
  const { addBottle } = useCellar()
  const [form, setForm] = useState({
    name: wine.name,
    producer: wine.producer,
    vintage: getWineVintageLabel(wine),
    region: wine.region,
    country: wine.country,
    category: wine.category,
    quantity: 1,
    purchasePrice: '',
    notes: ``,
    location: '',
  })

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    addBottle({ ...form, wineId: wine.id, quantity: Number(form.quantity) || 1 })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-hover max-w-md w-full p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl text-slate">Add to Cellar</h2>
            <p className="font-body text-sm text-slate-lt mt-1">{wine.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream transition-colors text-slate-lt">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vintage" value={form.vintage} onChange={v => handle('vintage', v)} />
            <Field label="Quantity" type="number" value={form.quantity} onChange={v => handle('quantity', v)} min="1" />
          </div>
          <Field label="Purchase Price (optional)" value={form.purchasePrice} onChange={v => handle('purchasePrice', v)} placeholder="e.g. £45" />
          <Field label="Cellar Location (optional)" value={form.location} onChange={v => handle('location', v)} placeholder="e.g. Rack 2, Row 3" />
          <div>
            <label className="block font-body text-xs text-slate-lt mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => handle('notes', e.target.value)}
              rows={2}
              className="w-full font-body text-sm px-3 py-2 rounded-xl border border-cream focus:outline-none focus:border-gold resize-none"
              placeholder="Where you bought it, occasion..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add to Cellar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Tom Gilby badge ────────────────────────────────────────────────────────────
const GILBY_CONFIG = {
  class: { label: 'CLASS ✨',  bg: '#C9973A', text: '#1A1A2E', title: 'Tom\'s top pick'      },
  pass:  { label: 'PASS 👍',  bg: '#4A6741', text: '#FFFFFF', title: 'Decent, drinks well'  },
  arse:  { label: 'ARSE 💀',  bg: '#8B2040', text: '#FFFFFF', title: 'Tom says avoid it'    },
}

function GilbyBadge({ rating }) {
  const cfg = GILBY_CONFIG[rating]
  if (!cfg) return null
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-bold tracking-widest"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
      title={cfg.title}
    >
      {cfg.label}
    </span>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder = '', min }) {
  return (
    <div>
      <label className="block font-body text-xs text-slate-lt mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className="w-full font-body text-sm px-3 py-2 rounded-xl border border-cream focus:outline-none focus:border-gold"
      />
    </div>
  )
}
