export const TABS = [
  { id: 'bottles', label: 'My Bottles' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'tasted', label: 'Tasting Notes' },
]

export const CATEGORY_COLORS = {
  sparkling: 'bg-amber-50 text-amber-700 border-amber-200',
  white:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  red:       'bg-rose-50 text-rose-700 border-rose-200',
  rosé:      'bg-pink-50 text-pink-700 border-pink-200',
  dessert:   'bg-orange-50 text-orange-700 border-orange-200',
}

export const PURCHASE_CHANNELS = [
  { id: 'supermarket', label: 'Supermarket' },
  { id: 'merchant', label: 'Wine merchant' },
  { id: 'wine-bar', label: 'Wine bar' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'online', label: 'Online' },
  { id: 'gift', label: 'Gift' },
  { id: 'other', label: 'Other' },
]

export const RETAILER_OPTIONS = [
  'Waitrose',
  "Sainsbury's",
  'Tesco',
  'M&S',
  'Asda',
  'Aldi',
  'Lidl',
  'Morrisons',
  'Co-op',
  'Majestic',
  'Le Bon Vin',
  'Gill & Co.',
  'The Harritt Wine Bar',
  'Rafters Restaurant',
  'Other',
]

export const WISHLIST_OWNER_KEY = 'wine-guide-wishlist-owner'

// Returns drinking window status for a cellar bottle
export function drinkWindowStatus(bottle) {
  const parseYear = (val) => {
    if (!val) return null
    const n = parseInt(String(val))
    return isNaN(n) ? null : n
  }
  const from = parseYear(bottle.drinkFrom)
  const to   = parseYear(bottle.drinkBy)
  if (!from && !to) return null
  const year = new Date().getFullYear()
  if (from && year < from)
    return { status: 'wait',  icon: '🔵', label: `Not ready — opens ${from}`,    cls: 'text-blue-700 bg-blue-50 border-blue-200' }
  if (to && year > to)
    return { status: 'over',  icon: '🔴', label: `Past peak — drink now`,         cls: 'text-rose-700 bg-rose-50 border-rose-200' }
  return       { status: 'ready', icon: '🟢', label: to ? `In window — enjoy by ${to}` : 'Ready to drink', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
}
