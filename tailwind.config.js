/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory:      '#FAF8F4',
        gold:       '#C9973A',
        'gold-lt':  '#E8C97A',
        terracotta: '#C4622D',
        'terra-lt': '#E8A07A',
        slate:      '#2C2C3E',
        'slate-lt': '#4A4A60',
        sage:       '#8FAF8A',
        cream:      '#F5EFE6',
        champagne:  '#F7E7CE',
        'wine-red': '#7B1D2E',
        blush:      '#F2C4CE',
      },
      fontFamily: {
        display: ['"Cormorant"', 'Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(26,26,46,0.10)',
        hover: '0 4px 12px rgba(0,0,0,0.06), 0 12px 48px rgba(26,26,46,0.18)',
        gold:  '0 4px 24px rgba(201,151,58,0.30)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
