import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'
import { venueWineLists } from '../data/venueWineLists'
import { getWineVintageLabel } from '../utils/wineDisplay'
import { formatPrice } from '../utils/formatPrice'
import { useVenueSourceInbox } from '../hooks/useVenueSourceInbox'
import {
  VENUES,
  MOMENTS,
  BUDGET_BANDS,
  ORDER_PACES,
  STYLE_MODES,
  TOWNS,
  TOWN_GROUPS,
} from '../data/places'

function mapUrl(name, town) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${town}`)}`
}

function bookingUrl(name, town) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${name} ${town} booking`)}`
}

const VALENCIA_TRIP_WINDOW = 'Sunday 21 to Sunday 28 June 2026'
const VALENCIA_TRIP_SUMMARY = [
  'Book Casa Montaña, Casa Carmela, Rausell and the Michelin rooms first; the strongest lunch and dinner slots will go quickly.',
  'Use Nuvó, Café Madrid, Café de las Horas, Anyora, ViveVino and Tinto Fino as flexible stops when formal restaurants are full or closed.',
  'Sunday and Monday need extra care: several serious kitchens close one or both days, so check the official site before travelling across town.',
]

const BUDAPEST_TRIP_WINDOW = 'Corinthia Budapest base · September 2026'
const BUDAPEST_TRIP_SUMMARY = [
  'The Corinthia at Erzsébet körút 43–49 is the fixed travel base. Jewish Quarter, Oktogon and Liszt Ferenc Square choices are mostly walkable.',
  'FELIX is booked for Thursday 3 September at 19:30. Order a taxi from the Corinthia for about 18:55–19:00 to leave a comfortable traffic margin.',
  'For other timed Buda reservations such as Déryné or Stand25, a taxi is usually the cleanest choice. Tram 4/6 is the useful public-transport spine from the hotel.',
  'Price conversions use the 28 August 2026 MNB rate of 425.37 Ft to £1. Allow for card conversion spread and check whether a 12–15% service charge is already included.',
]

const HUF_PER_GBP = 425.37

const SHEFFIELD_NEW_IDS = [
  'gillsons-brasserie-sheffield',
  'restaurant-elm-sheffield',
  'bench-la-cave-sheffield',
  'barks-wine-sheffield',
  'grub-records-sheffield',
]

const BUDAPEST_HERO_IDS = [
  'felix-budapest',
  'tati-budapest',
  'stand-restaurant-budapest',
  'n28-budapest',
  'a38-ship-budapest',
]

function formatVenueWinePrice(price, venueWineInfo) {
  if (typeof price !== 'number') return 'Price on menu'
  if (venueWineInfo?.currency === 'HUF') {
    const rate = venueWineInfo.gbpRate || HUF_PER_GBP
    return `${price.toLocaleString('en-GB')} Ft · approx ${formatPrice(price / rate, { decimals: 0 })}`
  }
  return formatPrice(price, { decimals: Number.isInteger(price) ? 0 : 2 })
}

function formatBudapestMenuPrice(priceHuf) {
  if (typeof priceHuf !== 'number') return null
  const huf = `${priceHuf.toLocaleString('en-GB')} Ft`
  const gbp = formatPrice(priceHuf / HUF_PER_GBP, { decimals: 2 })
  return `${huf} · approx ${gbp}`
}

function normalizeVenueWineCategory(category) {
  const value = (category || '').toLowerCase()
  if (value === 'sparkling-rosé' || value === 'sparkling-rose') return 'sparkling-rosé'
  if (value.startsWith('sparkling')) return 'sparkling'
  if (value === 'rose') return 'rosé'
  return value || 'wine'
}

function venueWineCategoryLabel(category) {
  const key = normalizeVenueWineCategory(category)
  if (key === 'rosé') return 'Rosé'
  if (key === 'sparkling-rosé') return 'Sparkling Rosé'
  if (key === 'sparkling') return 'Sparkling'
  if (key === 'fortified') return 'Fortified'
  if (key === 'dessert') return 'Dessert'
  if (key === 'orange') return 'Orange'
  if (key === 'white') return 'White'
  if (key === 'red') return 'Red'
  return 'Wine'
}

function renderStars(value) {
  if (typeof value !== 'number' || value <= 0) return null
  const full = Math.max(0, Math.min(5, Math.round(value)))
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

const RETAILER_IMAGE_HINTS = [
  '/Tesco-Logo',
  '/Sainsburys-Logo',
  '/Waitrose-Logo',
  '/aldi-logo',
  '/logo-lidl',
  '/asda-logo',
  '/coop-logo',
  '/morrisons-logo',
  '/marks-spencer',
  '/Majestic',
  '/dom-perignon-logo',
]

function getVenueVisual(venue) {
  if (venue.image) {
    return {
      src: venue.image,
      alt: venue.imageAlt || `${venue.name} venue image`,
      eyebrow: venue.imageEyebrow || 'Venue image',
      accent: venue.imageAccent || venue.town,
      note: venue.imageNote || `${venue.name} at a glance.`,
    }
  }

  return null
}

function isVenueSafeBottleImage(src) {
  if (!src) return false
  return !RETAILER_IMAGE_HINTS.some(hint => src.includes(hint))
}

function VenueFallback({ venue, compact = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border border-slate/12 shadow-card ${
        compact ? 'h-[15rem]' : 'h-[22rem] lg:h-[24rem]'
      } bg-[radial-gradient(circle_at_top_left,_rgba(214,164,86,0.22),_transparent_36%),linear-gradient(155deg,rgba(255,251,244,0.98),rgba(245,237,223,0.95))]`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent_34%,rgba(94,78,56,0.06))]" />
      <div className="relative z-10 flex h-full flex-col justify-between p-5 lg:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag border border-gold/20 bg-white/82 text-slate text-[10px] shadow-sm">
            {venue.imageFallbackLabel || 'Text-led for now'}
          </span>
          <span className="tag border border-white/70 bg-white/72 text-slate-lt text-[10px] shadow-sm">{venue.town}</span>
          <span className="tag border border-white/70 bg-white/72 text-slate-lt text-[10px] shadow-sm">{venue.type}</span>
        </div>
        <div className="max-w-md">
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-gold-lt/80 mb-2">
            {venue.area}
          </p>
          <h3 className={`font-display text-slate leading-tight ${compact ? 'text-[1.9rem]' : 'text-[2.5rem]'}`}>
            {venue.name}
          </h3>
          <p className="font-body text-sm text-slate-lt leading-relaxed mt-3">
            {venue.imageFallbackNote || venue.note || venue.vibe}
          </p>
          {venue.bestFor?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {venue.bestFor.slice(0, compact ? 2 : 3).map(item => (
                <span key={item} className="chip bg-white/72 text-slate-lt border border-white/80">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function VenueVisualPanel({ venue, visual, compact = false, onImageError }) {
  if (!visual) return <VenueFallback venue={venue} compact={compact} />

  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border border-slate/12 bg-[#efe7da] shadow-card ${
        compact ? 'h-[15rem]' : 'h-[22rem] lg:h-[24rem]'
      }`}
    >
      <img
        src={visual.src}
        alt={visual.alt}
        className="block h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={onImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/22 via-transparent to-[#111827]/10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-[1.15rem] border border-white/14 bg-[#182236]/72 px-3 py-2 shadow-[0_12px_28px_rgba(17,24,39,0.22)] backdrop-blur-md">
          <span className="tag border border-white/12 bg-white/88 text-slate text-[10px] shadow-sm">
            {visual.eyebrow}
          </span>
          <span className="tag border border-white/12 bg-white/16 text-white text-[10px] shadow-sm">
            {visual.accent || venue.town}
          </span>
          <span className="tag border border-white/12 bg-white/16 text-white text-[10px] shadow-sm">
            {venue.type}
          </span>
        </div>
      </div>
    </div>
  )
}


export default function Places() {
  const [searchParams] = useSearchParams()
  const selectedVenueParam = searchParams.get('venue')
  const [region, setRegion] = useState('UK')
  const [town, setTown] = useState('Sheffield')
  const [venueId, setVenueId] = useState('gillsons-brasserie-sheffield')
  const [momentId, setMomentId] = useState(MOMENTS[0].id)
  const [budgetId, setBudgetId] = useState(BUDGET_BANDS[1].id)
  const [paceId, setPaceId] = useState(ORDER_PACES[0].id)
  const [styleId, setStyleId] = useState(STYLE_MODES[1].id)
  const [venueWineSearch, setVenueWineSearch] = useState('')
  const [venueWineCategory, setVenueWineCategory] = useState('all')
  const [venueWineLimit, setVenueWineLimit] = useState(24)
  const [scrollToDetail, setScrollToDetail] = useState(false)
  const [showSourceModal, setShowSourceModal] = useState(false)
  const [sourceForm, setSourceForm] = useState({ venueName: '', town: '', sourceUrl: '', notes: '' })
  const [failedVenueImages, setFailedVenueImages] = useState({})
  const detailRef = useRef(null)
  const { sources, addSource, removeSource, markProcessed } = useVenueSourceInbox()

  const visibleVenues = useMemo(() => {
    let filtered = VENUES
    if (region !== 'all') {
      const regionTowns = TOWN_GROUPS.find(g => g.region === region)?.towns || []
      filtered = filtered.filter(v => regionTowns.includes(v.town))
    }
    if (town !== 'all') {
      filtered = filtered.filter(v => v.town === town)
    }
    if (town === 'Sheffield') {
      return [...filtered].sort((a, b) => Number(b.guideStatus === 'new') - Number(a.guideStatus === 'new'))
    }
    return filtered
  }, [region, town])

  const currentRegionTowns = useMemo(() => {
    if (region === 'all') return TOWNS.filter(t => t !== 'all')
    return TOWN_GROUPS.find(g => g.region === region)?.towns.filter(t => TOWNS.includes(t)) || []
  }, [region])

  const venue = useMemo(
    () => visibleVenues.find(v => v.id === venueId) || visibleVenues[0] || VENUES[0],
    [visibleVenues, venueId],
  )
  const venueWineInfo = venueWineLists[venue.id]
  const venueWineItems = venueWineInfo?.items || []

  const moment = MOMENTS.find(m => m.id === momentId) || MOMENTS[0]
  const budget = BUDGET_BANDS.find(b => b.id === budgetId) || BUDGET_BANDS[1]
  const pace = ORDER_PACES.find(p => p.id === paceId) || ORDER_PACES[0]
  const styleMode = STYLE_MODES.find(s => s.id === styleId) || STYLE_MODES[1]

  useEffect(() => {
    if (!visibleVenues.some(v => v.id === venueId) && visibleVenues[0]) {
      setVenueId(visibleVenues[0].id)
    }
  }, [visibleVenues, venueId])

  useEffect(() => {
    if (!selectedVenueParam) return
    const normalizedVenueParam = selectedVenueParam === 'harriet' ? 'harritt-wine-bar' : selectedVenueParam
    const matched = VENUES.find(v => v.id === normalizedVenueParam)
    if (!matched) return
    const matchedRegion = TOWN_GROUPS.find(g => g.towns.includes(matched.town))?.region || 'all'
    setRegion(matchedRegion)
    setTown(matched.town)
    setVenueId(matched.id)
  }, [selectedVenueParam])

  useEffect(() => {
    setVenueWineSearch('')
    setVenueWineCategory('all')
    setVenueWineLimit(24)
  }, [venue.id])

  useEffect(() => {
    setVenueWineLimit(24)
  }, [venueWineCategory, venueWineSearch])

  useEffect(() => {
    if (!scrollToDetail || !detailRef.current) return
    const top = detailRef.current.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    setScrollToDetail(false)
  }, [scrollToDetail, venue.id])

  const suggestedWines = useMemo(
    () => venue.wineIds.map(id => wines.find(w => w.id === id)).filter(Boolean),
    [venue],
  )
  const venueCards = useMemo(
    () =>
          visibleVenues.map((item) => {
            const itemSuggestedWines = item.wineIds.map(id => wines.find(w => w.id === id)).filter(Boolean)
            return {
              venue: item,
              suggestedWines: itemSuggestedWines,
              visual: failedVenueImages[item.id] ? null : getVenueVisual(item),
              sourcedCount: venueWineLists[item.id]?.items?.length || 0,
            }
          }),
    [failedVenueImages, visibleVenues],
  )
  const venueVisual = useMemo(
    () => (failedVenueImages[venue.id] ? null : getVenueVisual(venue)),
    [failedVenueImages, venue],
  )
  const venueMenuHighlights = useMemo(
    () =>
      (venue.menuHighlights || []).map((item) => ({
        ...item,
        featuredWine: item.wineId ? wines.find(w => w.id === item.wineId) || null : null,
      })),
    [venue],
  )
  const sourcedCategoryCount = useMemo(
    () => new Set(venueWineItems.map(item => normalizeVenueWineCategory(item.category))).size,
    [venueWineItems],
  )

  const helperWines = useMemo(() => {
    const shortlisted = suggestedWines.filter(w =>
      budget.priceRanges.includes(w.priceRange) &&
      styleMode.categories.includes(w.category) &&
      moment.categories.includes(w.category),
    )

    if (shortlisted.length > 0) return shortlisted.slice(0, 2)

    return wines
      .filter(w =>
        budget.priceRanges.includes(w.priceRange) &&
        styleMode.categories.includes(w.category) &&
        moment.categories.includes(w.category),
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2)
  }, [budget.priceRanges, moment.categories, styleMode.categories, suggestedWines])

  const servicePlan = useMemo(() => {
    if (pace.id === 'glass-first') return 'Start with one exploratory glass, then commit to a bottle only if the food and table mood align.'
    if (pace.id === 'share-bottle') return 'Choose one versatile bottle with acidity and enough structure to cover multiple dishes.'
    return 'Open with freshness, then move to a deeper second bottle with the main course.'
  }, [pace.id])

  const orderLine = useMemo(() => {
    const starter = styleMode.id === 'fresh'
      ? 'something bright and mineral'
      : styleMode.id === 'bold'
        ? 'something structured with real depth'
        : 'a classic old-world style'
    return `We're after ${starter}, around ${budget.label.toLowerCase()}, suited to ${moment.label.toLowerCase()}.`
  }, [budget.label, moment.label, styleMode.id])

  const venueWineCategories = useMemo(
    () => ['all', ...new Set(venueWineItems.map(item => normalizeVenueWineCategory(item.category)))],
    [venueWineItems],
  )

  const filteredVenueWineItems = useMemo(() => {
    const query = venueWineSearch.trim().toLowerCase()
    return venueWineItems
      .filter(item => {
        if (venueWineCategory !== 'all' && normalizeVenueWineCategory(item.category) !== venueWineCategory) return false
        if (!query) return true
        return (
          item.name.toLowerCase().includes(query) ||
          (item.country && item.country.toLowerCase().includes(query))
        )
      })
      .sort((a, b) => {
        const ap = typeof a.price === 'number' ? a.price : 9999
        const bp = typeof b.price === 'number' ? b.price : 9999
        if (ap !== bp) return ap - bp
        return a.name.localeCompare(b.name)
      })
  }, [venueWineCategory, venueWineItems, venueWineSearch])

  const visibleVenueWineItems = filteredVenueWineItems.slice(0, venueWineLimit)
  const hasMoreVenueWineItems = filteredVenueWineItems.length > visibleVenueWineItems.length
  const sheffieldVenueCount = VENUES.filter(v => v.town === 'Sheffield').length
  const budapestVenueCount = VENUES.filter(v => v.town === 'Budapest').length
  const isBudapestView = town === 'Budapest'
  const heroVenueIds = isBudapestView ? BUDAPEST_HERO_IDS : SHEFFIELD_NEW_IDS
  function handleVenueSelect(nextVenueId) {
    setVenueId(nextVenueId)
    setScrollToDetail(true)
  }

  function showValenciaTripList() {
    setRegion('Europe')
    setTown('Valencia')
    setVenueId('casa-montana-valencia')
    setScrollToDetail(true)
  }

  function showSheffieldEdit() {
    setRegion('UK')
    setTown('Sheffield')
    setVenueId('gillsons-brasserie-sheffield')
  }

  function showBudapestEdit() {
    setRegion('Europe')
    setTown('Budapest')
    setVenueId('felix-budapest')
  }

  function markVenueImageFailed(nextVenueId) {
    setFailedVenueImages(prev => (prev[nextVenueId] ? prev : { ...prev, [nextVenueId]: true }))
  }

  function updateSourceForm(key, value) {
    setSourceForm(prev => ({ ...prev, [key]: value }))
  }

  function submitSourceForm(e) {
    e.preventDefault()
    const result = addSource(sourceForm)
    if (!result.ok) return
    setSourceForm({ venueName: '', town: '', sourceUrl: '', notes: '' })
    setShowSourceModal(false)
  }

  return (
    <main className="min-h-screen places-page">
      <section className="places-hero pt-24 lg:pt-28" aria-labelledby="places-title">
        <div className="places-hero-grid" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-[1.16fr_0.84fr] gap-10 lg:gap-16 items-end pb-10 lg:pb-14">
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="places-live-dot" />
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d7b968]">
                  {isBudapestView ? 'The Budapest edit · September 2026' : 'The Sheffield edit · August 2026'}
                </p>
              </div>
              <h1 id="places-title" className="font-display text-[3.8rem] sm:text-7xl lg:text-[6.7rem] text-white leading-[0.82] tracking-[-0.055em] text-balance">
                {isBudapestView ? 'Taste Budapest' : 'Drink the city'}
                <span className="block pl-[0.12em] italic font-light text-[#d8e3df]">
                  {isBudapestView ? 'from morning to midnight.' : 'after dark.'}
                </span>
              </h1>
              <p className="font-body text-[#c7d3d1] max-w-2xl text-base sm:text-lg leading-relaxed mt-7">
                {isBudapestView
                  ? 'Thirty-five considered places for breakfast, lunch, dinner, Hungarian wine, craft beer, cocktails, live music and a proper night out — planned from the Corinthia Budapest without a car.'
                  : 'A personal field guide to rooms worth crossing Sheffield for — from candlelit natural wine and vinyl to the city’s newest serious brasserie.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={isBudapestView ? showBudapestEdit : showSheffieldEdit} className="places-cta-primary">
                  Explore {isBudapestView ? budapestVenueCount : sheffieldVenueCount} {isBudapestView ? 'Budapest' : 'Sheffield'} places <span aria-hidden="true">↘</span>
                </button>
                <button onClick={isBudapestView ? showSheffieldEdit : showValenciaTripList} className="places-cta-ghost">
                  {isBudapestView ? 'Back to Sheffield edit' : 'Open Valencia edit'}
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="places-cover-card">
                <img
                  src={isBudapestView
                    ? 'https://welovebudapest.com/i/62/fe-lix-20190423-hirling-ba-lint-008.inbox1560x1170.jpg'
                    : 'https://www.exposedmagazine.co.uk/wp-content/uploads/2026/08/Gillsons-brasserie-1000-feature.jpg'}
                  alt={isBudapestView ? 'FELIX Kitchen and Bar historic gilded interior' : "Gillson's Brasserie on Ecclesall Road"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,28,0.02)_15%,rgba(7,18,28,0.9)_100%)]" />
                <div className="absolute left-5 top-5 flex gap-2">
                  <span className="places-cover-label">{isBudapestView ? 'Thursday booked' : 'Just opened'}</span>
                  <span className="places-cover-label places-cover-label-muted">{isBudapestView ? '19:30 · 3 September' : 'Ecclesall Road'}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="font-body text-[10px] uppercase tracking-[0.24em] text-[#e9cd7a] mb-2">{isBudapestView ? 'The confirmed evening' : 'The new arrival'}</p>
                  <p className="font-display text-4xl text-white leading-none">{isBudapestView ? 'FELIX Kitchen & Bar' : 'Gillson’s Brasserie'}</p>
                  <p className="font-body text-sm text-white/70 mt-3">
                    {isBudapestView ? 'Historic Buda setting. Josper cooking. One of the city’s deepest cellars.' : 'Classic cooking. Warm service. A cellar curated by Gills & Co.'}
                  </p>
                </div>
              </div>
              <div className="places-issue-stamp" aria-label={isBudapestView ? `${budapestVenueCount} Budapest places considered` : 'Five new Sheffield discoveries'}>
                <strong>{isBudapestView ? budapestVenueCount : '05'}</strong>
                <span>{isBudapestView ? 'trip picks' : 'new finds'}</span>
              </div>
            </div>
          </div>

          <div className="places-new-rail" aria-label={isBudapestView ? 'Budapest trip shortlist' : 'New Sheffield additions'}>
            <p className="places-rail-intro"><span>{isBudapestView ? 'Trip' : 'New'}</span> {isBudapestView ? 'shortlist' : 'to the guide'}</p>
            {heroVenueIds.map((id, index) => {
              const newVenue = VENUES.find(item => item.id === id)
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (isBudapestView) showBudapestEdit()
                    else showSheffieldEdit()
                    setVenueId(id)
                    setScrollToDetail(true)
                  }}
                  className="places-rail-item"
                >
                  <span>0{index + 1}</span>
                  <strong>{newVenue.name}</strong>
                  <small>{newVenue.type}</small>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="places-filter-panel p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Region</p>
              <div className="places-chip-row flex gap-1.5 mb-3">
                <button
                  onClick={() => { setRegion('all'); setTown('all') }}
                  className={`chip ${region === 'all' ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                >
                  All
                </button>
                {TOWN_GROUPS.map(group => {
                  const count = group.towns.filter(t => TOWNS.includes(t)).length
                  if (!count) return null
                  return (
                    <button
                      key={group.region}
                      onClick={() => { setRegion(group.region); setTown('all') }}
                      className={`chip gap-1.5 ${region === group.region ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                    >
                      {group.region}
                      <span className={`text-[10px] ${region === group.region ? 'opacity-60' : 'text-gold opacity-70'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
              {currentRegionTowns.length > 1 && (
                <>
                  <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Town</p>
                  <div className="places-chip-row flex gap-1.5">
                    <button
                      onClick={() => setTown('all')}
                      className={`chip ${town === 'all' ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                    >
                      All
                    </button>
                    {currentRegionTowns.map(t => (
                      <button
                        key={t}
                        onClick={() => setTown(t)}
                        className={`chip ${town === t ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="btn-secondary px-4 py-2 shrink-0" onClick={() => setShowSourceModal(true)}>
              + Add menu source
            </button>
          </div>
          <p className="font-body text-xs text-slate-lt mt-3">
            Live wine lists sourced for {VENUES.filter(v => venueWineLists[v.id]?.items?.length).length} of {VENUES.length} venues.
          </p>
          {town === 'Valencia' && (
            <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4">
              <p className="font-body text-xs uppercase tracking-[0.16em] text-gold mb-2">Valencia trip focus · {VALENCIA_TRIP_WINDOW}</p>
              <div className="grid md:grid-cols-3 gap-2.5">
                {VALENCIA_TRIP_SUMMARY.map(item => (
                  <p key={item} className="font-body text-sm text-slate-lt leading-relaxed">{item}</p>
                ))}
              </div>
            </div>
          )}
          {town === 'Budapest' && (
            <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4">
              <p className="font-body text-xs uppercase tracking-[0.16em] text-gold mb-2">Budapest trip focus · {BUDAPEST_TRIP_WINDOW}</p>
              <div className="grid md:grid-cols-3 gap-2.5">
                {BUDAPEST_TRIP_SUMMARY.map(item => (
                  <p key={item} className="font-body text-sm text-slate-lt leading-relaxed">{item}</p>
                ))}
              </div>
            </div>
          )}
          {sources.length > 0 && (
            <div className="mt-3 border-t border-cream pt-3">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Source inbox</p>
              <div className="space-y-2">
                {sources.slice(0, 4).map(source => (
                  <div key={source.id} className="rounded-xl border border-cream bg-white/70 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-body text-xs text-slate-lt">
                      <strong className="text-slate">{source.venueName}</strong>
                      {source.town ? ` · ${source.town}` : ''} · {source.status}
                    </p>
                    <div className="flex gap-1.5">
                      {source.status !== 'processed' && (
                        <button onClick={() => markProcessed(source.id)} className="chip bg-slate text-white">Done</button>
                      )}
                      <button onClick={() => removeSource(source.id)} className="chip bg-white border border-cream text-slate-lt">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f2d48] mb-2">
              {town === 'Sheffield' ? 'The Sheffield shortlist' : 'Amanda’s places'}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-[#12232c] leading-none">
              {town === 'all' ? `${region === 'all' ? 'Every' : region} place worth knowing` : `Where to go in ${town}`}
            </h2>
          </div>
          <p className="font-body text-sm text-slate-lt">{visibleVenues.length} considered places · select one for the full edit</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {venueCards.map(({ venue: v, visual, suggestedWines: cardSuggestedWines, sourcedCount }, index) => (
            <button
              key={v.id}
              onClick={() => handleVenueSelect(v.id)}
              className={`places-venue-card group text-left flex h-full flex-col p-3.5 sm:p-4 ${venue.id === v.id ? 'is-selected' : ''} ${index === 0 && town === 'Sheffield' ? 'md:col-span-2 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-5' : ''}`}
            >
              <div className="relative mb-4 overflow-hidden rounded-[1.45rem]">
                <VenueVisualPanel
                  venue={v}
                  visual={visual}
                  compact
                  onImageError={() => markVenueImageFailed(v.id)}
                />
                {v.guideStatus === 'new' && (
                  <span className="absolute right-3 top-3 places-new-badge">New to the edit</span>
                )}
              </div>
              <div className="flex flex-col px-1">
              <div className="mb-4">
                <p className="font-body text-sm text-slate-lt leading-relaxed line-clamp-2 min-h-[2.75rem]">
                  {visual?.note || v.imageFallbackNote || 'No honest venue photo yet; keeping this card clean and text-led is better than using the wrong image.'}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="section-label mb-2">{v.town} · {v.area}</p>
                <span className="chip bg-cream text-slate-lt">{v.type}</span>
              </div>
              <h2 className="font-display text-3xl text-slate">{v.name}</h2>
              <p className="font-body text-sm text-slate-lt mt-2 line-clamp-3">{v.vibe}</p>
              {cardSuggestedWines[0] ? (
                <p className="font-body text-sm text-slate mt-3">
                  <strong className="text-slate">Start with:</strong> {cardSuggestedWines[0].name}
                </p>
              ) : null}
              {venue.id === v.id && (
                <p className="font-body text-xs text-gold mt-2 font-semibold">
                  Selected: full venue details opened below ↓
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.bestFor.map(item => <span key={item} className="chip bg-cream text-slate-lt">{item}</span>)}
                {v.mealTimes?.slice(0, 3).map(item => <span key={`meal-${item}`} className="chip bg-white border border-gold/25 text-gold">{item}</span>)}
                {v.budgetLevel && <span className="chip bg-white border border-cream text-slate">{v.budgetLevel}</span>}
                {v.amandaFavourite && (
                  <span className="chip bg-gold text-white">Amanda favourite</span>
                )}
                {v.richardFavourite && (
                  <span className="chip bg-slate text-white">Richard's pick</span>
                )}
                {v.claireFavourite && (
                  <span className="chip bg-slate/70 text-white">Claire's pick</span>
                )}
                <span className={`chip ${sourcedCount ? 'bg-gold/15 text-gold' : 'bg-white border border-cream text-slate-lt'}`}>
                  {sourcedCount
                    ? `${sourcedCount} wines sourced`
                    : 'Wine list needed'}
                </span>
              </div>
              <p className="font-body text-xs text-gold mt-2">{v.note}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div ref={detailRef} className="places-detail-shell p-4 sm:p-5 lg:p-7">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr] overflow-hidden rounded-[1.75rem] bg-[#0a1a23] mb-5">
            <div className="relative min-h-[23rem] lg:min-h-[31rem]">
              {venueVisual ? (
                <img
                  src={venueVisual.src}
                  alt={venueVisual.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => markVenueImageFailed(venue.id)}
                />
              ) : (
                <VenueFallback venue={venue} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07151f]/80 via-transparent to-[#07151f]/10" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                {venue.guideStatus === 'new' && <span className="places-new-badge">New to the edit</span>}
                <span className="places-cover-label places-cover-label-muted">{venue.type}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:hidden">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8c66d]">{venue.town} · {venue.area}</p>
                <h3 className="font-display text-4xl text-white mt-2 leading-none">{venue.name}</h3>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-white">
              <div>
                <div className="hidden lg:block">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8c66d]">Selected room · {venue.town}</p>
                  <h3 className="font-display text-5xl xl:text-6xl mt-3 leading-[0.9]">{venue.name}</h3>
                </div>
                <p className="font-body text-sm sm:text-base text-[#c7d3d1] leading-relaxed mt-5">{venue.vibe}</p>
                <blockquote className="mt-6 border-l border-[#e8c66d]/55 pl-5 font-display text-2xl italic leading-snug text-white/90">
                  {venue.whyAmandaLovesIt}
                </blockquote>
              </div>
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {venue.bestFor.map(item => <span key={item} className="places-detail-chip">{item}</span>)}
                  {venue.mealTimes?.map(item => <span key={`meal-${item}`} className="places-detail-chip">{item}</span>)}
                  {venue.budgetLevel && <span className="places-detail-chip">{venue.budgetLevel}</span>}
                </div>
                <p className="font-body text-xs text-white/55 mt-5">{venue.note} · {venue.typicalSpend}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
            {[
              { label: 'Bottle cues', value: suggestedWines.length, note: 'matched references' },
              { label: 'Menu wines', value: venueWineItems.length || '—', note: venueWineItems.length ? 'captured from source' : 'source still needed' },
              { label: 'List styles', value: sourcedCategoryCount || '—', note: sourcedCategoryCount ? 'wine categories' : 'pending list' },
              { label: 'Go for', value: venue.bestFor[0], note: venue.bestFor.slice(1, 2).join('') || venue.type },
            ].map((item) => (
              <div key={item.label} className="places-detail-stat">
                <p>{item.label}</p>
                <strong>{item.value}</strong>
                <span>{item.note}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[1.65rem] border border-[#18353e]/10 bg-white/70 p-4 sm:p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f2d48]">Bottle compass</p>
                <p className="font-display text-2xl sm:text-3xl text-[#12232c] mt-1">What to scan for first in this room</p>
              </div>
              <span className="font-body text-xs text-slate-lt">Amanda-style benchmarks</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {suggestedWines.slice(0, 3).map(wine => (
                <Link key={wine.id} to={`/explore/${wine.id}`} className="places-bottle-cue">
                  <p>{wine.country} · {getWineVintageLabel(wine)}</p>
                  <h4>{wine.name}</h4>
                  <span>{wine.producer} · {wine.price}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8">
            <div>
              <p className="section-label mb-2">{venue.richardFavourite ? "Richard's pick" : "Amanda's read"}</p>
              <h3 className="font-display text-4xl text-slate mb-4">{venue.name}</h3>
              <p className="font-body text-slate-lt leading-relaxed mb-5">{venue.whyAmandaLovesIt}</p>
              <div className="card p-4 mb-5">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Venue practicals</p>
                <p className="font-body text-sm text-slate-lt mb-1"><strong className="text-slate">Town:</strong> {venue.town}</p>
                <p className="font-body text-sm text-slate-lt mb-1"><strong className="text-slate">Typical spend:</strong> {venue.typicalSpend}</p>
                <p className="font-body text-sm text-slate-lt"><strong className="text-slate">Booking tip:</strong> {venue.reserveTip}</p>
                {venue.bookingNote && (
                  <p className="font-body text-sm text-[#8f2d48] mt-1"><strong>Confirmed:</strong> {venue.bookingNote}</p>
                )}
                {venue.fromHotel && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">From Corinthia Budapest:</strong> {venue.fromHotel}</p>
                )}
                {venue.distanceFromHotel && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Route distance:</strong> {venue.distanceFromHotel}</p>
                )}
                {venue.tripTip && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">For {VALENCIA_TRIP_WINDOW}:</strong> {venue.tripTip}</p>
                )}
                {venue.address && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Address:</strong> {venue.address}</p>
                )}
                {venue.phone && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Phone:</strong> {venue.phone}</p>
                )}
                {venue.email && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Email:</strong> {venue.email}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href={mapUrl(venue.name, venue.town)} target="_blank" rel="noopener noreferrer" className="btn-secondary">Open map ↗</a>
                  <a href={bookingUrl(venue.name, venue.town)} target="_blank" rel="noopener noreferrer" className="btn-primary">Find booking ↗</a>
                  {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">Official site ↗</a>
                  )}
                  {venue.instagram && (
                    <a href={venue.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">Instagram ↗</a>
                  )}
                  {venue.menus?.map(menu => (
                    <a key={menu.url} href={menu.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      {menu.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              {venue.knownFor && (
                <div className="card p-4 sm:p-5 mb-5 bg-[#fffaf1]">
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                    <div>
                      <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-1">The informed order</p>
                      <h4 className="font-display text-2xl sm:text-3xl text-slate">What this place does best</h4>
                    </div>
                    {venue.menuVerifiedOn && (
                      <span className="chip bg-white border border-cream text-slate-lt">Menus checked {venue.menuVerifiedOn}</span>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-cream bg-white/80 p-4">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f2d48] mb-2">Known for</p>
                      <p className="font-body text-sm text-slate-lt leading-relaxed">{venue.knownFor}</p>
                    </div>
                    <div className="rounded-2xl border border-cream bg-white/80 p-4">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f2d48] mb-2">How we would order</p>
                      <p className="font-body text-sm text-slate-lt leading-relaxed">{venue.orderStrategy}</p>
                    </div>
                  </div>
                </div>
              )}
              {venueMenuHighlights.length ? (
                <div className="card p-4 mb-5">
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
                    <div>
                      <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-1">Current Menu Cues</p>
                      <p className="font-display text-2xl text-slate">What to order at {venue.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {venueWineInfo?.sourceUrl && (
                        <a href={venueWineInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                          Open wine source ↗
                        </a>
                      )}
                      {venue.menus?.map(menu => (
                        <a key={menu.url} href={menu.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                          {menu.format === 'PDF' ? 'Download menu PDF' : menu.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                  {venueMenuHighlights.map((item) => {
                    const featuredBottleImage = isVenueSafeBottleImage(item.featuredWine?.labelImage)
                      ? item.featuredWine.labelImage
                      : null
                    return (
                      <article key={item.dish} className="rounded-2xl border border-cream bg-white/75 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {featuredBottleImage ? (
                            <Link
                              to={`/explore/${item.featuredWine.id}`}
                              className="shrink-0 w-20 rounded-[1.2rem] border border-cream bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                            >
                              <div className="h-24 rounded-[0.9rem] bg-gradient-to-br from-white to-[#f5efe4] flex items-center justify-center overflow-hidden">
                                <img
                                  src={featuredBottleImage}
                                  alt={`${item.featuredWine.name} visual`}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                              <p className="font-body text-[9px] uppercase tracking-[0.15em] text-gold mt-2">Featured bottle</p>
                            </Link>
                          ) : null}
                          <div className="min-w-0">
                            <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">{venue.type}</p>
                            <h4 className="font-display text-2xl text-slate leading-tight">{item.dish}</h4>
                            {item.priceHuf && (
                              <p className="font-body text-sm font-semibold text-gold mt-1">{formatBudapestMenuPrice(item.priceHuf)}</p>
                            )}
                            <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">{item.note}</p>
                            <p className="font-body text-sm text-slate mt-3">
                              <strong className="text-slate">Best glass:</strong> {item.pour}
                            </p>
                            {featuredBottleImage ? (
                              <p className="font-body text-xs text-slate-lt mt-2">
                                Visual cue: {item.featuredWine.name}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                  </div>
                </div>
              ) : null}
              <p className="section-label mb-2">How to order there</p>
              <ul className="space-y-2.5">
                {[
                  'Pick the dish direction first, then set style and price.',
                  'Ask for one recommendation and one alternative at the same budget.',
                  'If list quality looks mixed, choose producer reliability over novelty.',
                ].map(item => (
                  <li key={item} className="font-body text-sm text-slate-lt flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="section-label mb-2">Tonight's mood</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {MOMENTS.map(m => (
                  <button key={m.id} onClick={() => setMomentId(m.id)} className={`chip ${momentId === m.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="font-body text-sm text-slate-lt mb-5">{moment.why}</p>

              <div className="card p-4">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Style prompts at {venue.name}</p>
                <div className="flex flex-wrap gap-2">
                  {venue.stylePrompts.map(prompt => <span key={prompt} className="chip bg-cream text-slate">{prompt}</span>)}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link to={`/pairing?q=${encodeURIComponent(moment.pairingPrompt)}`} className="btn-primary">
                    Match this food mood
                  </Link>
                  <Link to={`/explore?country=${encodeURIComponent('France')}`} className="btn-secondary">
                    Browse matching wines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div className="surface-panel p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="section-label mb-1">Live Data</p>
              <h3 className="font-display text-4xl text-slate">Wine List at {venue.name}</h3>
            </div>
            <div className="text-right">
              <p className="font-body text-sm text-slate-lt">
                {venueWineInfo?.items?.length ? `${venueWineInfo.items.length} wines captured` : 'No public list captured yet'}
              </p>
            </div>
          </div>

          {venueWineInfo?.items?.length ? (
            <>
              <div className="card p-4 mb-5">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-1">Source</p>
                <p className="font-body text-sm text-slate-lt">
                  {venueWineInfo.source} · Checked {venueWineInfo.checkedOn}
                </p>
                <p className="font-body text-xs text-slate-lt mt-1">{venueWineInfo.priceNote}</p>
                {venueWineInfo.curatedProfile && (
                  <p className="font-body text-xs text-gold mt-1">
                    Curated profile: this is a representative structure, not a full official bottle list.
                  </p>
                )}
                <a href={venueWineInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-3 inline-flex">
                  Open source list ↗
                </a>
              </div>

              <div className="grid lg:grid-cols-[1fr_auto] gap-3 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={venueWineSearch}
                    onChange={(e) => setVenueWineSearch(e.target.value)}
                    placeholder={`Search ${venue.name} wines...`}
                    className="w-full font-body text-sm px-4 py-2.5 pl-10 rounded-xl border border-cream bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt" fill="none" viewBox="0 0 20 20">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex gap-2 overflow-x-auto thin-scroll pb-1">
                  {venueWineCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setVenueWineCategory(cat)}
                      className={`chip whitespace-nowrap ${venueWineCategory === cat ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                    >
                      {cat === 'all' ? 'All styles' : venueWineCategoryLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredVenueWineItems.length === 0 ? (
                <p className="font-body text-sm text-slate-lt">No wines match this filter yet.</p>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {visibleVenueWineItems.map(item => (
                      <article key={`${item.name}-${item.price || 'na'}`} className="card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-body text-sm text-slate leading-snug">{item.name}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="chip bg-cream text-slate-lt">{venueWineCategoryLabel(item.category)}</span>
                              {item.country && <span className="chip bg-white border border-cream text-slate-lt">{item.country}</span>}
                            </div>
                          </div>
                          <p className="font-body text-sm font-semibold text-gold whitespace-nowrap">{formatVenueWinePrice(item.price, venueWineInfo)}</p>
                        </div>
                        {(item.review || item.stars || item.reviewSource || item.libraryWineId) && (
                          <div className="mt-3 pt-3 border-t border-cream">
                            {item.stars && (
                              <p className="font-body text-xs text-gold font-semibold">
                                {renderStars(item.stars)} {item.stars.toFixed(1)} / 5
                              </p>
                            )}
                            {item.review && (
                              <p className="font-body text-xs text-slate-lt mt-1 leading-relaxed">{item.review}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                              {item.reviewSource && (
                                <span className="chip bg-white border border-cream text-slate-lt">{item.reviewSource}</span>
                              )}
                              {item.libraryWineId && (
                                <Link to={`/explore/${item.libraryWineId}`} className="font-body text-xs text-gold hover:text-gold/80">
                                  Open in Explorer →
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-body text-xs text-slate-lt">
                      Showing {visibleVenueWineItems.length} of {filteredVenueWineItems.length}
                    </p>
                    {hasMoreVenueWineItems && (
                      <button
                        onClick={() => setVenueWineLimit(v => v + 24)}
                        className="btn-secondary px-4 py-2"
                      >
                        Load more wines
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="card p-5">
              <p className="font-body text-sm text-slate-lt mb-3">
                We do not have a public wine list for this venue yet. If you share a menu link or PDF, we can ingest it quickly.
              </p>
              <a href={bookingUrl(venue.name, venue.town)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                Check venue booking & menus ↗
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div className="surface-panel p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="section-label mb-1">Interactive</p>
              <h3 className="font-display text-4xl text-slate">Tonight's Order Helper</h3>
            </div>
            <p className="font-body text-sm text-slate-lt">Tailored for {venue.name}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Budget</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_BANDS.map(item => (
                  <button key={item.id} onClick={() => setBudgetId(item.id)} className={`chip ${budgetId === item.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Drinking pace</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_PACES.map(item => (
                  <button key={item.id} onClick={() => setPaceId(item.id)} className={`chip ${paceId === item.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Wine style</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_MODES.map(item => (
                  <button key={item.id} onClick={() => setStyleId(item.id)} className={`chip ${styleId === item.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 mt-5">
            <div className="card p-5">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Use this line with staff</p>
              <p className="font-body text-slate leading-relaxed">"{orderLine}"</p>
              <p className="font-body text-sm text-slate-lt mt-3"><strong className="text-slate">Service plan:</strong> {servicePlan}</p>
            </div>
            <div className="card p-5">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Suggested picks now</p>
              <ul className="space-y-2">
                {helperWines.map(wine => (
                  <li key={wine.id} className="font-body text-sm text-slate-lt">
                    <Link className="text-slate hover:text-gold transition-colors" to={`/explore/${wine.id}`}>
                      {wine.name}
                    </Link>
                    <span className="ml-2 text-xs text-slate-lt/70">{wine.region} · {wine.priceRange}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="section-label mb-1">Benchmarks</p>
            <h3 className="font-display text-4xl text-slate">Amanda-style bottles to look for</h3>
          </div>
          <Link to="/explore" className="btn-ghost">Full Explorer →</Link>
        </div>
        <p className="font-body text-sm text-slate-lt mb-6">
          These style benchmarks help decision-making even when venue lists rotate frequently.
        </p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {suggestedWines.map(wine => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </section>
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button className="absolute inset-0 bg-slate/45 backdrop-blur-sm" onClick={() => setShowSourceModal(false)} aria-label="Close source modal" />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cream flex items-center justify-between">
              <h4 className="font-display text-2xl text-slate">Add menu source</h4>
              <button onClick={() => setShowSourceModal(false)} className="w-8 h-8 rounded-full bg-cream text-slate-lt">✕</button>
            </div>
            <form onSubmit={submitSourceForm} className="p-6 space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Venue name *</label>
                <input
                  type="text"
                  value={sourceForm.venueName}
                  onChange={(e) => updateSourceForm('venueName', e.target.value)}
                  required
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Town</label>
                <input
                  type="text"
                  value={sourceForm.town}
                  onChange={(e) => updateSourceForm('town', e.target.value)}
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Menu URL / PDF link *</label>
                <input
                  type="url"
                  value={sourceForm.sourceUrl}
                  onChange={(e) => updateSourceForm('sourceUrl', e.target.value)}
                  required
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Notes</label>
                <textarea
                  value={sourceForm.notes}
                  onChange={(e) => updateSourceForm('notes', e.target.value)}
                  rows={3}
                  placeholder="Opening hours, why this venue matters, anything special to capture..."
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm resize-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Save to source inbox</button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
