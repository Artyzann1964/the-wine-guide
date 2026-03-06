function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    const next = line[i + 1]

    if (ch === '"' && inQuotes && next === '"') {
      current += '"'
      i += 1
      continue
    }
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }
    current += ch
  }
  cells.push(current)
  return cells
}

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

function normalizeVintage(vintage) {
  const raw = String(vintage || '').trim()
  if (!raw) return 'NV'
  if (/^(n\.?v\.?)$/i.test(raw)) return 'NV'
  return raw
}

function inferCategory({ wine, region }) {
  const combined = `${wine || ''} ${region || ''}`.toLowerCase()
  if (/(champagne|prosecco|cremant|crémant|cava|sparkling|spumante|brut|blanc de blancs)/.test(combined)) return 'sparkling'
  if (/(ros[eé]|rose)/.test(combined)) return 'rosé'
  if (/(sauternes|tokaji|tokay|ice wine|vin santo|port|sherry|madeira|moscatel)/.test(combined)) return 'dessert'
  if (/(cabernet|merlot|pinot noir|syrah|shiraz|malbec|rioja|barolo|chianti|rosso|red)/.test(combined)) return 'red'
  return 'white'
}

export function parseVivinoCsv(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0]).map(h => h.trim())
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    const row = {}
    headers.forEach((header, idx) => {
      row[header] = (values[idx] ?? '').trim()
    })
    return row
  })
}

export function vivinoRowsToTastedEntries(rows) {
  const today = new Date().toISOString()
  const todayDate = today.slice(0, 10)

  return (rows || []).map((row) => {
    const winery = row.winery || ''
    const wine = row.wine || 'Unknown wine'
    const vintage = normalizeVintage(row.vintage)
    const region = row.region || ''
    const country = row.country || ''
    const ratingValue = Number.parseFloat(row.avg_rating || '')
    const ratingsCount = Number.parseInt(row.ratings_count || '', 10)
    const avgPrice = Number.parseFloat(row.avg_price || '')
    const price = Number.isFinite(avgPrice) ? avgPrice.toFixed(2) : null
    const rating = Number.isFinite(ratingValue) && ratingValue > 0
      ? Math.max(1, Math.min(5, Math.round(ratingValue)))
      : null

    const ratingText = Number.isFinite(ratingValue) && ratingValue > 0
      ? `${ratingValue.toFixed(1)}/5`
      : 'unrated'
    const countText = Number.isFinite(ratingsCount) && ratingsCount > 0
      ? `${ratingsCount.toLocaleString('en-GB')} ratings`
      : 'no rating count'
    const priceText = price ? ` avg £${price}` : ''
    const linkText = row.wine_link ? ` · ${row.wine_link}` : ''

    const signature = `${winery}|${wine}|${vintage}|${country}`.toLowerCase()

    return {
      id: `vivino-${hashString(signature)}`,
      signature,
      source: 'vivino',
      wineId: null,
      name: wine,
      producer: winery,
      vintage,
      region,
      country,
      category: inferCategory({ wine, region }),
      quantity: 1,
      purchasePrice: price,
      purchaseDate: todayDate,
      drinkFrom: null,
      drinkBy: null,
      notes: `Imported from Vivino (${ratingText}, ${countText}${priceText})${linkText}`,
      location: '',
      addedAt: today,
      tastedAt: today,
      rating,
      tastingNote: row.wine_link || '',
      score: Number.isFinite(ratingValue) && ratingValue > 0 ? Math.round(ratingValue * 20) : null,
    }
  })
}
