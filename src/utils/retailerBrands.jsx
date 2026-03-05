// src/utils/retailerBrands.jsx
// Brand definitions and badge component for UK retailers
// Logo images live in /public — served at root by Vite

export const RETAILER_BRANDS = {
  'Tesco':        { bg: '#00539F', text: '#FFFFFF', border: '#003d75' },
  "Sainsbury's":  { bg: '#F06C00', text: '#FFFFFF', border: '#c45500' },
  'Waitrose':     { bg: '#1D1D1B', text: '#FFFFFF', border: '#3d3d3b' },
  'Asda':         { bg: '#78BE21', text: '#1D1D1B', border: '#5c9518' },
  'M&S':          { bg: '#141414', text: '#E8C97A', border: '#3a3a3a' },
  'Aldi':         { bg: '#00509E', text: '#FFFFFF', border: '#003a75' },
  'Lidl':         { bg: '#003DA5', text: '#FFC832', border: '#002d80' },
  'Morrisons':    { bg: '#004F2D', text: '#FFCD00', border: '#003a20' },
  'Le Bon Vin':   { bg: '#2C2C3E', text: '#C9973A', border: '#1a1a2e' },
  'Majestic':     { bg: '#5C1A3A', text: '#F0CB71', border: '#3d1028' },
  'Co-op':        { bg: '#003E71', text: '#FFFFFF', border: '#002850' },
}

// Logo image paths (in /public, served at /)
const RETAILER_LOGOS = {
  'Tesco':        '/Tesco-Logo.wine.svg',
  "Sainsbury's":  '/Sainsburys-Logo-600x600-1.webp',
  'Waitrose':     '/Waitrose-Logo.wine.png',
  'Asda':         '/asda-logo.png',
  'M&S':          '/marks-spencer-ms-logo-png_seeklogo-312435.png',
  'Aldi':         '/aldi-logo.webp',
  'Lidl':         '/logo-lidl.png',
  'Morrisons':    '/morrisons-logo.png',
  'Le Bon Vin':   '/le-bon-vin-wine-merchants-sheffield-uk-S13PHFITKR.jpg',
  'Majestic':     '/Majestic.jpg',
  'Co-op':        '/coop-logo.avif',
}

// Fallback lettermarks (used if logo fails to load)
const RETAILER_MARKS = {
  'Tesco':        'T',
  "Sainsbury's":  'S',
  'Waitrose':     'W',
  'Asda':         'A',
  'M&S':          'M',
  'Aldi':         'Al',
  'Lidl':         'L',
  'Morrisons':    'Mo',
  'Le Bon Vin':   'LB',
  'Majestic':     'Mj',
  'Co-op':        'Co',
}

// ─────────────────────────────────────────────────────────────
// RetailerBadge — logo image pill
// Shows actual retailer logo on a white/cream background
// Falls back to coloured lettermark if logo is unavailable
// ─────────────────────────────────────────────────────────────
export function RetailerBadge({ name, className = '' }) {
  const logo = RETAILER_LOGOS[name]
  const brand = RETAILER_BRANDS[name]
  const mark = RETAILER_MARKS[name] || name.slice(0, 1).toUpperCase()

  if (logo) {
    return (
      <span
        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white border border-cream shadow-sm ${className}`}
      >
        <img
          src={logo}
          alt={name}
          className="h-4 w-auto object-contain"
          style={{ maxWidth: 36 }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <span className="font-body text-xs font-semibold text-slate leading-none">
          {name}
        </span>
      </span>
    )
  }

  // Fallback — coloured lettermark pill (original style)
  if (brand) {
    return (
      <span
        className={`inline-flex items-stretch rounded-full overflow-hidden font-body font-semibold tracking-wide text-xs ${className}`}
        style={{ border: `1px solid ${brand.border}` }}
      >
        <span
          className="flex items-center justify-center px-2 font-black text-[10px] tracking-tighter leading-none"
          style={{ backgroundColor: brand.border, color: brand.text }}
        >
          {mark}
        </span>
        <span
          className="flex items-center px-2.5 py-1"
          style={{ backgroundColor: brand.bg, color: brand.text }}
        >
          {name}
        </span>
      </span>
    )
  }

  // Unknown retailer
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-medium bg-cream text-slate-lt ${className}`}>
      {name}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// RetailerLogo — just the logo image, no pill/text
// Use in Explorer filter chips, Shop page cards, etc.
// ─────────────────────────────────────────────────────────────
export function RetailerLogo({ name, size = 24, className = '' }) {
  const logo = RETAILER_LOGOS[name]
  const brand = RETAILER_BRANDS[name]
  const mark = RETAILER_MARKS[name] || name.slice(0, 1).toUpperCase()

  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        title={name}
        className={`object-contain ${className}`}
        style={{ height: size, width: 'auto', maxWidth: size * 2 }}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )
  }

  // Fallback circle with lettermark
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-body font-black text-[10px] ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: brand?.bg ?? '#6B7C8D',
        color: brand?.text ?? '#FFF',
        fontSize: size * 0.38,
      }}
      title={name}
    >
      {mark}
    </span>
  )
}
