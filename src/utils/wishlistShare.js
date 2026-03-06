const PRICE_TIER_META = {
  everyday: {
    label: 'Everyday Gifts',
    hint: 'Easy wins for weeknight dinners and casual presents.',
    order: 1,
  },
  mid: {
    label: 'Mid-Range Gifts',
    hint: 'Special bottles that still stay comfortably priced.',
    order: 2,
  },
  premium: {
    label: 'Premium Gifts',
    hint: 'Statement bottles for birthdays and celebrations.',
    order: 3,
  },
  luxury: {
    label: 'Luxury Bottles',
    hint: 'Icon wines for milestone moments.',
    order: 4,
  },
  flexible: {
    label: 'Flexible Budget',
    hint: 'No clear price data yet, but still on the wishlist.',
    order: 5,
  },
}

function toBinaryString(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
  return binary
}

function normalizePriceTier(value) {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return 'flexible'
  if (raw === 'budget' || raw === 'everyday' || raw === '£') return 'everyday'
  if (raw === 'mid' || raw === '££') return 'mid'
  if (raw === 'premium' || raw === '£££') return 'premium'
  if (raw === 'luxury' || raw === '££££') return 'luxury'
  return 'flexible'
}

export function getPriceTierMeta(value) {
  return PRICE_TIER_META[normalizePriceTier(value)] || PRICE_TIER_META.flexible
}

export function groupWishlistByPrice(items = []) {
  const grouped = items.reduce((acc, item) => {
    const tier = normalizePriceTier(item.priceRange)
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(item)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([tier, wines]) => ({
      tier,
      ...getPriceTierMeta(tier),
      wines: wines.sort((a, b) => {
        const ratingA = Number(a.rating) || 0
        const ratingB = Number(b.rating) || 0
        return ratingB - ratingA
      }),
    }))
    .sort((a, b) => a.order - b.order)
}

export function buildWishlistSharePayload({ ownerName, wishlist, wineLookup }) {
  return {
    version: 1,
    ownerName: String(ownerName || '').trim(),
    createdAt: new Date().toISOString(),
    items: (wishlist || []).map(item => {
      const dbWine = typeof wineLookup === 'function' ? wineLookup(item.wineId) : null
      return {
        wineId: item.wineId || null,
        name: item.name || dbWine?.name || 'Unknown wine',
        producer: item.producer || dbWine?.producer || '',
        vintage: item.vintage || dbWine?.vintage || '',
        category: item.category || dbWine?.category || '',
        region: item.region || dbWine?.region || '',
        country: item.country || dbWine?.country || '',
        rating: dbWine?.rating || null,
        price: dbWine?.price || '',
        priceRange: dbWine?.priceRange || '',
      }
    }),
  }
}

export function encodeWishlistPayload(payload) {
  const json = JSON.stringify(payload || {})
  const bytes = new TextEncoder().encode(json)
  const base64 = btoa(toBinaryString(bytes))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function decodeWishlistPayload(encoded) {
  if (!encoded) return null
  try {
    const base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(encoded.length / 4) * 4, '=')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json)
    if (!parsed || !Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

export function buildWishlistShareUrl(encodedPayload) {
  const safe = encodeURIComponent(String(encodedPayload || '').trim())
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#/wishlist-share?wl=${safe}`
}
