// src/utils/retailerBrands.js
// Brand colour definitions and badge component for UK retailers

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

// React component — import this where you need a styled retailer pill
export function RetailerBadge({ name, className = '' }) {
  const brand = RETAILER_BRANDS[name]
  if (!brand) {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-medium bg-cream text-slate-lt ${className}`}>
        {name}
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold tracking-wide ${className}`}
      style={{ backgroundColor: brand.bg, color: brand.text, border: `1px solid ${brand.border}` }}
    >
      {name}
    </span>
  )
}
