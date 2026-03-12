// Vintage Quality Guide — region × year quality grid
// Quality scores: 5 = exceptional, 4 = excellent, 3 = good, 2 = average, 1 = poor, 0 = not assessed
// Sources: Robert Parker Wine Advocate, Jancis Robinson, Wine Spectator, Decanter

const REGIONS = [
  {
    name: 'Bordeaux',
    country: 'France',
    category: 'red',
    note: 'Left Bank (Cabernet Sauvignon dominant)',
  },
  {
    name: 'Burgundy Red',
    country: 'France',
    category: 'red',
    note: 'Côte de Nuits & Côte de Beaune (Pinot Noir)',
  },
  {
    name: 'Burgundy White',
    country: 'France',
    category: 'white',
    note: 'Côte de Beaune & Chablis (Chardonnay)',
  },
  {
    name: 'Champagne',
    country: 'France',
    category: 'sparkling',
    note: 'Vintage declarations by major houses',
  },
  {
    name: 'Northern Rhône',
    country: 'France',
    category: 'red',
    note: 'Hermitage & Côte-Rôtie (Syrah)',
  },
  {
    name: 'Southern Rhône',
    country: 'France',
    category: 'red',
    note: 'Châteauneuf-du-Pape & Gigondas',
  },
  {
    name: 'Alsace',
    country: 'France',
    category: 'white',
    note: 'Riesling, Gewurztraminer, Pinot Gris',
  },
  {
    name: 'Loire Valley',
    country: 'France',
    category: 'white',
    note: 'Chenin Blanc & Sauvignon Blanc',
  },
  {
    name: 'Tuscany',
    country: 'Italy',
    category: 'red',
    note: 'Brunello & Chianti Classico (Sangiovese)',
  },
  {
    name: 'Barolo & Barbaresco',
    country: 'Italy',
    category: 'red',
    note: 'Piedmont (Nebbiolo)',
  },
  {
    name: 'Rioja',
    country: 'Spain',
    category: 'red',
    note: 'Tempranillo, primarily Rioja Alta',
  },
  {
    name: 'Ribera del Duero',
    country: 'Spain',
    category: 'red',
    note: 'Tinto Fino (Tempranillo)',
  },
  {
    name: 'Mosel',
    country: 'Germany',
    category: 'white',
    note: 'Riesling from steep slate vineyards',
  },
  {
    name: 'Rheingau & Rheinhessen',
    country: 'Germany',
    category: 'white',
    note: 'Riesling & Spätburgunder',
  },
  {
    name: 'Napa Valley',
    country: 'USA',
    category: 'red',
    note: 'Cabernet Sauvignon',
  },
  {
    name: 'Willamette Valley',
    country: 'USA',
    category: 'red',
    note: 'Pinot Noir (Oregon)',
  },
  {
    name: 'Barossa & Clare Valley',
    country: 'Australia',
    category: 'red',
    note: 'Shiraz & Riesling (South Australia)',
  },
  {
    name: 'Marlborough',
    country: 'New Zealand',
    category: 'white',
    note: 'Sauvignon Blanc & Pinot Noir',
  },
  {
    name: 'Douro Valley',
    country: 'Portugal',
    category: 'red',
    note: 'Port & unfortified reds',
  },
]

// Vintage quality by region, year 2010–2024
// Format: { score: 1-5, note: 'brief descriptor' }
// 0 = not assessed / insufficient data
const VINTAGE_DATA = {
  'Bordeaux': {
    2010: { score: 5, note: 'Legendary' },
    2011: { score: 3, note: 'Uneven' },
    2012: { score: 3, note: 'Solid' },
    2013: { score: 2, note: 'Challenging' },
    2014: { score: 4, note: 'Excellent' },
    2015: { score: 5, note: 'Outstanding' },
    2016: { score: 5, note: 'Exceptional' },
    2017: { score: 3, note: 'Frost damage' },
    2018: { score: 5, note: 'Superb' },
    2019: { score: 5, note: 'Classic' },
    2020: { score: 4, note: 'Very good' },
    2021: { score: 3, note: 'Good value' },
    2022: { score: 5, note: 'Historic heat' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Burgundy Red': {
    2010: { score: 5, note: 'Legendary' },
    2011: { score: 3, note: 'Underrated' },
    2012: { score: 4, note: 'Very good' },
    2013: { score: 3, note: 'Elegant' },
    2014: { score: 4, note: 'Classic style' },
    2015: { score: 5, note: 'Exceptional' },
    2016: { score: 4, note: 'Excellent' },
    2017: { score: 4, note: 'Early drinking' },
    2018: { score: 4, note: 'Lush' },
    2019: { score: 5, note: 'Outstanding' },
    2020: { score: 5, note: 'Benchmark' },
    2021: { score: 4, note: 'Elegant' },
    2022: { score: 4, note: 'Rich' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Burgundy White': {
    2010: { score: 4, note: 'Rich' },
    2011: { score: 3, note: 'Variable' },
    2012: { score: 4, note: 'Very good' },
    2013: { score: 4, note: 'Mineral' },
    2014: { score: 5, note: 'Classic' },
    2015: { score: 4, note: 'Opulent' },
    2016: { score: 5, note: 'Exceptional' },
    2017: { score: 4, note: 'Rich' },
    2018: { score: 4, note: 'Lush' },
    2019: { score: 4, note: 'Forward' },
    2020: { score: 5, note: 'Superb' },
    2021: { score: 5, note: 'Benchmark' },
    2022: { score: 4, note: 'Rich' },
    2023: { score: 4, note: 'Good' },
    2024: { score: 0, note: 'Too early' },
  },
  'Champagne': {
    2010: { score: 0, note: 'Non-vintage' },
    2011: { score: 0, note: 'Non-vintage' },
    2012: { score: 5, note: 'Declared' },
    2013: { score: 4, note: 'Selective' },
    2014: { score: 4, note: 'Declared' },
    2015: { score: 5, note: 'Exceptional' },
    2016: { score: 4, note: 'Some declare' },
    2017: { score: 3, note: 'Frost year' },
    2018: { score: 5, note: 'Outstanding' },
    2019: { score: 5, note: 'Excellent' },
    2020: { score: 4, note: 'Good' },
    2021: { score: 3, note: 'Challenging' },
    2022: { score: 5, note: 'Historic' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Northern Rhône': {
    2010: { score: 5, note: 'Legendary' },
    2011: { score: 4, note: 'Early ripening' },
    2012: { score: 4, note: 'Solid' },
    2013: { score: 4, note: 'Classic' },
    2014: { score: 4, note: 'Very good' },
    2015: { score: 5, note: 'Exceptional' },
    2016: { score: 5, note: 'Outstanding' },
    2017: { score: 4, note: 'Early' },
    2018: { score: 5, note: 'Superb' },
    2019: { score: 5, note: 'Benchmark' },
    2020: { score: 5, note: 'Excellent' },
    2021: { score: 4, note: 'Classic' },
    2022: { score: 5, note: 'Historic heat' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Southern Rhône': {
    2010: { score: 5, note: 'Legendary' },
    2011: { score: 3, note: 'Mixed' },
    2012: { score: 4, note: 'Very good' },
    2013: { score: 3, note: 'Variable' },
    2014: { score: 4, note: 'Consistent' },
    2015: { score: 5, note: 'Exceptional' },
    2016: { score: 5, note: 'Outstanding' },
    2017: { score: 4, note: 'Rich' },
    2018: { score: 4, note: 'Excellent' },
    2019: { score: 5, note: 'Superb' },
    2020: { score: 4, note: 'Good' },
    2021: { score: 3, note: 'Uneven' },
    2022: { score: 5, note: 'Powerful' },
    2023: { score: 4, note: 'Solid' },
    2024: { score: 0, note: 'Too early' },
  },
  'Alsace': {
    2010: { score: 5, note: 'Classic' },
    2011: { score: 4, note: 'Ripe' },
    2012: { score: 3, note: 'Mixed' },
    2013: { score: 3, note: 'Late harvest' },
    2014: { score: 4, note: 'Elegant' },
    2015: { score: 5, note: 'Superb' },
    2016: { score: 4, note: 'Very good' },
    2017: { score: 5, note: 'Outstanding' },
    2018: { score: 5, note: 'Exceptional' },
    2019: { score: 5, note: 'Benchmark' },
    2020: { score: 4, note: 'Good' },
    2021: { score: 4, note: 'Elegant' },
    2022: { score: 4, note: 'Ripe' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Loire Valley': {
    2010: { score: 5, note: 'Outstanding' },
    2011: { score: 4, note: 'Early' },
    2012: { score: 3, note: 'Tricky' },
    2013: { score: 3, note: 'Late' },
    2014: { score: 5, note: 'Superb' },
    2015: { score: 5, note: 'Exceptional' },
    2016: { score: 4, note: 'Very good' },
    2017: { score: 4, note: 'Ripe' },
    2018: { score: 5, note: 'Benchmark' },
    2019: { score: 5, note: 'Classic' },
    2020: { score: 4, note: 'Good' },
    2021: { score: 4, note: 'Elegant' },
    2022: { score: 4, note: 'Warm' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Tuscany': {
    2010: { score: 5, note: 'Legendary' },
    2011: { score: 4, note: 'Rich' },
    2012: { score: 4, note: 'Solid' },
    2013: { score: 5, note: 'Exceptional' },
    2014: { score: 2, note: 'Difficult' },
    2015: { score: 5, note: 'Outstanding' },
    2016: { score: 5, note: 'Benchmark' },
    2017: { score: 3, note: 'Drought stress' },
    2018: { score: 4, note: 'Very good' },
    2019: { score: 5, note: 'Superb' },
    2020: { score: 4, note: 'Excellent' },
    2021: { score: 5, note: 'Outstanding' },
    2022: { score: 4, note: 'Warm' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Barolo & Barbaresco': {
    2010: { score: 5, note: 'Legendary' },
    2011: { score: 4, note: 'Rich, early' },
    2012: { score: 4, note: 'Classic' },
    2013: { score: 5, note: 'Exceptional' },
    2014: { score: 3, note: 'Rain issues' },
    2015: { score: 4, note: 'Excellent' },
    2016: { score: 5, note: 'Benchmark' },
    2017: { score: 3, note: 'Drought' },
    2018: { score: 4, note: 'Very good' },
    2019: { score: 5, note: 'Superb' },
    2020: { score: 4, note: 'Elegant' },
    2021: { score: 5, note: 'Outstanding' },
    2022: { score: 4, note: 'Powerful' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Rioja': {
    2010: { score: 4, note: 'Very good' },
    2011: { score: 4, note: 'Consistent' },
    2012: { score: 5, note: 'Outstanding' },
    2013: { score: 4, note: 'Good' },
    2014: { score: 4, note: 'Solid' },
    2015: { score: 4, note: 'Excellent' },
    2016: { score: 4, note: 'Very good' },
    2017: { score: 3, note: 'Drought' },
    2018: { score: 5, note: 'Exceptional' },
    2019: { score: 4, note: 'Excellent' },
    2020: { score: 4, note: 'Very good' },
    2021: { score: 4, note: 'Classic' },
    2022: { score: 4, note: 'Rich' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Ribera del Duero': {
    2010: { score: 4, note: 'Good' },
    2011: { score: 4, note: 'Solid' },
    2012: { score: 3, note: 'Hot' },
    2013: { score: 4, note: 'Classic' },
    2014: { score: 4, note: 'Very good' },
    2015: { score: 5, note: 'Exceptional' },
    2016: { score: 4, note: 'Excellent' },
    2017: { score: 3, note: 'Drought' },
    2018: { score: 5, note: 'Outstanding' },
    2019: { score: 4, note: 'Very good' },
    2020: { score: 4, note: 'Consistent' },
    2021: { score: 4, note: 'Good' },
    2022: { score: 4, note: 'Warm' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Mosel': {
    2010: { score: 4, note: 'Classic' },
    2011: { score: 5, note: 'Outstanding' },
    2012: { score: 4, note: 'Very good' },
    2013: { score: 5, note: 'Exceptional' },
    2014: { score: 4, note: 'Elegant' },
    2015: { score: 4, note: 'Ripe' },
    2016: { score: 4, note: 'Classic' },
    2017: { score: 5, note: 'Superb' },
    2018: { score: 4, note: 'Rich' },
    2019: { score: 5, note: 'Benchmark' },
    2020: { score: 5, note: 'Outstanding' },
    2021: { score: 4, note: 'Very good' },
    2022: { score: 4, note: 'Warm' },
    2023: { score: 5, note: 'Exceptional' },
    2024: { score: 0, note: 'Too early' },
  },
  'Rheingau & Rheinhessen': {
    2010: { score: 4, note: 'Good' },
    2011: { score: 5, note: 'Outstanding' },
    2012: { score: 4, note: 'Very good' },
    2013: { score: 4, note: 'Classic' },
    2014: { score: 4, note: 'Elegant' },
    2015: { score: 4, note: 'Ripe' },
    2016: { score: 4, note: 'Good' },
    2017: { score: 5, note: 'Excellent' },
    2018: { score: 4, note: 'Rich' },
    2019: { score: 5, note: 'Exceptional' },
    2020: { score: 5, note: 'Outstanding' },
    2021: { score: 4, note: 'Classic' },
    2022: { score: 4, note: 'Warm' },
    2023: { score: 5, note: 'Superb' },
    2024: { score: 0, note: 'Too early' },
  },
  'Napa Valley': {
    2010: { score: 4, note: 'Elegant' },
    2011: { score: 3, note: 'Cool year' },
    2012: { score: 5, note: 'Outstanding' },
    2013: { score: 5, note: 'Classic' },
    2014: { score: 5, note: 'Excellent' },
    2015: { score: 4, note: 'Rich' },
    2016: { score: 5, note: 'Benchmark' },
    2017: { score: 4, note: 'Fires' },
    2018: { score: 4, note: 'Very good' },
    2019: { score: 5, note: 'Outstanding' },
    2020: { score: 4, note: 'Fires' },
    2021: { score: 5, note: 'Superb' },
    2022: { score: 4, note: 'Excellent' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Willamette Valley': {
    2010: { score: 4, note: 'Classic' },
    2011: { score: 3, note: 'Cool' },
    2012: { score: 5, note: 'Benchmark' },
    2013: { score: 4, note: 'Warm' },
    2014: { score: 5, note: 'Exceptional' },
    2015: { score: 5, note: 'Outstanding' },
    2016: { score: 4, note: 'Excellent' },
    2017: { score: 4, note: 'Good' },
    2018: { score: 5, note: 'Superb' },
    2019: { score: 5, note: 'Classic' },
    2020: { score: 4, note: 'Fires' },
    2021: { score: 4, note: 'Warm' },
    2022: { score: 4, note: 'Very good' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Barossa & Clare Valley': {
    2010: { score: 5, note: 'Exceptional' },
    2011: { score: 4, note: 'Classic' },
    2012: { score: 5, note: 'Outstanding' },
    2013: { score: 4, note: 'Good' },
    2014: { score: 4, note: 'Very good' },
    2015: { score: 4, note: 'Consistent' },
    2016: { score: 5, note: 'Superb' },
    2017: { score: 4, note: 'Good' },
    2018: { score: 4, note: 'Hot' },
    2019: { score: 4, note: 'Very good' },
    2020: { score: 4, note: 'Solid' },
    2021: { score: 4, note: 'Classic' },
    2022: { score: 4, note: 'Good' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Marlborough': {
    2010: { score: 4, note: 'Good' },
    2011: { score: 3, note: 'Wet year' },
    2012: { score: 5, note: 'Outstanding' },
    2013: { score: 4, note: 'Classic' },
    2014: { score: 5, note: 'Exceptional' },
    2015: { score: 4, note: 'Consistent' },
    2016: { score: 4, note: 'Very good' },
    2017: { score: 3, note: 'Cyclone' },
    2018: { score: 5, note: 'Superb' },
    2019: { score: 4, note: 'Very good' },
    2020: { score: 5, note: 'Excellent' },
    2021: { score: 4, note: 'Classic' },
    2022: { score: 4, note: 'Good' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
  'Douro Valley': {
    2010: { score: 5, note: 'Declared' },
    2011: { score: 5, note: 'Declared' },
    2012: { score: 4, note: 'Very good' },
    2013: { score: 4, note: 'Good' },
    2014: { score: 4, note: 'Solid' },
    2015: { score: 4, note: 'Very good' },
    2016: { score: 5, note: 'Outstanding' },
    2017: { score: 5, note: 'Widely declared' },
    2018: { score: 4, note: 'Excellent' },
    2019: { score: 5, note: 'Exceptional' },
    2020: { score: 4, note: 'Very good' },
    2021: { score: 4, note: 'Classic' },
    2022: { score: 5, note: 'Superb' },
    2023: { score: 4, note: 'Promising' },
    2024: { score: 0, note: 'Too early' },
  },
}

const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

const SCORE_CONFIG = {
  5: { label: 'Exceptional', short: 'E', bg: 'bg-emerald-600', text: 'text-white', ring: 'ring-emerald-700' },
  4: { label: 'Excellent',   short: 'X', bg: 'bg-emerald-400', text: 'text-white', ring: 'ring-emerald-500' },
  3: { label: 'Good',        short: 'G', bg: 'bg-amber-400',   text: 'text-white', ring: 'ring-amber-500' },
  2: { label: 'Average',     short: 'A', bg: 'bg-orange-400',  text: 'text-white', ring: 'ring-orange-500' },
  1: { label: 'Poor',        short: 'P', bg: 'bg-rose-400',    text: 'text-white', ring: 'ring-rose-500' },
  0: { label: 'Not assessed', short: '–', bg: 'bg-cream',      text: 'text-slate-lt', ring: '' },
}

const COUNTRY_ORDER = ['France', 'Italy', 'Spain', 'Germany', 'USA', 'Australia', 'New Zealand', 'Portugal']
const CATEGORY_LABELS = { red: 'Red', white: 'White', sparkling: 'Sparkling', dessert: 'Dessert' }

function ScoreCell({ region, year, score, note, isActive, onHover, onLeave }) {
  const cfg = SCORE_CONFIG[score] || SCORE_CONFIG[0]
  return (
    <td className="p-0.5">
      <div
        className={`
          w-10 h-8 rounded flex items-center justify-center cursor-default transition-all
          ${cfg.bg} ${cfg.text}
          ${isActive ? 'scale-110 shadow-md ring-2 ' + cfg.ring + ' z-10 relative' : ''}
        `}
        onMouseEnter={() => onHover({ region, year, score, note, cfg })}
        onMouseLeave={onLeave}
        title={`${region} ${year}: ${note || cfg.label}`}
      >
        <span className="font-body text-xs font-bold leading-none select-none">{score > 0 ? score : '–'}</span>
      </div>
    </td>
  )
}

import { useState, Fragment } from 'react'

export default function VintageGuide() {
  const [activeCell, setActiveCell] = useState(null)
  const [activeCountry, setActiveCountry] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All')

  const countries = ['All', ...COUNTRY_ORDER.filter(c => REGIONS.some(r => r.country === c))]
  const categories = ['All', 'Red', 'White', 'Sparkling']

  const filteredRegions = REGIONS.filter(r => {
    const countryMatch = activeCountry === 'All' || r.country === activeCountry
    const catMatch = activeCategory === 'All' || r.category === activeCategory.toLowerCase()
    return countryMatch && catMatch
  })

  // Group by country for display
  const byCountry = COUNTRY_ORDER.reduce((acc, c) => {
    const regs = filteredRegions.filter(r => r.country === c)
    if (regs.length) acc[c] = regs
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-ivory pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-gold mb-2">Reference</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate mb-3">Vintage Guide</h1>
          <p className="font-body text-sm text-slate-lt max-w-2xl">
            Quality ratings for major wine regions from 2010 to 2024. Scores reflect the overall vintage character
            across top producers — individual wines vary. Always worth reading reviews for specific estates.
          </p>
        </div>

        {/* Legend + tooltip area */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {[5, 4, 3, 2, 1].map(s => {
            const cfg = SCORE_CONFIG[s]
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded ${cfg.bg} flex items-center justify-center`}>
                  <span className={`font-body text-xs font-bold ${cfg.text}`}>{s}</span>
                </div>
                <span className="font-body text-xs text-slate-lt">{cfg.label}</span>
              </div>
            )
          })}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-cream flex items-center justify-center">
              <span className="font-body text-xs text-slate-lt">–</span>
            </div>
            <span className="font-body text-xs text-slate-lt">Not assessed</span>
          </div>
        </div>

        {/* Active cell tooltip */}
        <div className="h-9 mb-4">
          {activeCell && (
            <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border ${SCORE_CONFIG[activeCell.score]?.bg} ${SCORE_CONFIG[activeCell.score]?.text} shadow-sm`}>
              <span className="font-body text-sm font-semibold">{activeCell.region} {activeCell.year}</span>
              <span className="font-body text-sm opacity-90">—</span>
              <span className="font-body text-sm">{activeCell.note || activeCell.cfg?.label}</span>
            </div>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {countries.map(c => (
              <button
                key={c}
                onClick={() => setActiveCountry(c)}
                className={`font-body text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCountry === c
                    ? 'bg-slate text-white border-slate'
                    : 'bg-white text-slate border-cream hover:border-slate/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="w-px bg-cream self-stretch mx-1 hidden sm:block" />
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`font-body text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === c
                    ? 'bg-gold text-white border-gold'
                    : 'bg-white text-slate border-cream hover:border-gold/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Vintage grid — scrollable */}
        <div className="overflow-x-auto rounded-2xl border border-cream bg-white shadow-sm pb-1">
          <table className="w-full border-collapse" style={{ minWidth: '640px' }}>
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 text-left pl-4 pr-3 py-3 border-b border-cream w-44">
                  <span className="font-body text-xs font-semibold text-slate-lt uppercase tracking-wide">Region</span>
                </th>
                {YEARS.map(y => (
                  <th key={y} className="py-3 px-0.5 text-center border-b border-cream">
                    <span className={`font-body text-xs font-semibold ${y === 2024 ? 'text-slate-lt/50' : 'text-slate'}`}>
                      {y}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(byCountry).map(([country, regs], ci) => (
                <Fragment key={country}>
                  <tr>
                    <td
                      colSpan={YEARS.length + 1}
                      className={`pl-4 py-2 ${ci > 0 ? 'border-t border-cream' : ''}`}
                    >
                      <span className="font-body text-xs font-bold uppercase tracking-widest text-gold">{country}</span>
                    </td>
                  </tr>
                  {regs.map(region => {
                    const data = VINTAGE_DATA[region.name] || {}
                    return (
                      <tr key={region.name} className="hover:bg-cream/30 transition-colors">
                        <td className="sticky left-0 bg-white hover:bg-cream/30 z-10 pl-4 pr-3 py-1 border-b border-cream/50">
                          <div>
                            <p className="font-body text-xs font-semibold text-slate leading-tight">{region.name}</p>
                            <p className="font-body text-xs text-slate-lt leading-tight mt-0.5">{region.note}</p>
                          </div>
                        </td>
                        {YEARS.map(y => {
                          const v = data[y] || { score: 0, note: '' }
                          const isActive = activeCell?.region === region.name && activeCell?.year === y
                          return (
                            <ScoreCell
                              key={y}
                              region={region.name}
                              year={y}
                              score={v.score}
                              note={v.note}
                              isActive={isActive}
                              onHover={setActiveCell}
                              onLeave={() => setActiveCell(null)}
                            />
                          )
                        })}
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="font-body text-xs text-slate-lt mt-5 max-w-2xl">
          Ratings are generalisations across entire appellations. Weather, terroir, and winemaking mean
          individual wines can exceed or fall short of regional scores. Use as a guide, not a rule.
          Data drawn from Wine Advocate, Jancis Robinson, Wine Spectator, and Decanter assessments.
        </p>

        {/* Notable vintages callout */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Vintages to cellar',
              items: ['2016 Bordeaux', '2019 Burgundy Red', '2016 Northern Rhône', '2019 Barolo', '2016 Tuscany', '2019 Napa Valley'],
              icon: '🏺',
              cls: 'border-emerald-200 bg-emerald-50',
              titleCls: 'text-emerald-800',
            },
            {
              title: 'Drink now',
              items: ['2015 Bordeaux', '2017 Burgundy Red', '2015 Rhône', '2015 Rioja', '2013 Tuscany', '2018 Champagne'],
              icon: '🍷',
              cls: 'border-amber-200 bg-amber-50',
              titleCls: 'text-amber-800',
            },
            {
              title: 'Watch out for',
              items: ['2013 Bordeaux', '2014 Tuscany', '2011 Willamette', '2017 Mosel (good!)', '2022 Bordeaux (big, warm)', '2024 (too early)'],
              icon: '👁️',
              cls: 'border-blue-200 bg-blue-50',
              titleCls: 'text-blue-800',
            },
          ].map(card => (
            <div key={card.title} className={`rounded-2xl border p-4 ${card.cls}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{card.icon}</span>
                <h3 className={`font-display font-bold text-sm ${card.titleCls}`}>{card.title}</h3>
              </div>
              <ul className="space-y-1">
                {card.items.map(i => (
                  <li key={i} className="font-body text-xs text-slate flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-lt flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
