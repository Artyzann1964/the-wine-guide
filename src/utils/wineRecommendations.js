/**
 * Wine Recommendation Engine
 *
 * Similarity scoring weights:
 *   tasteProfile euclidean distance  0.35
 *   grape overlap (Jaccard)          0.25
 *   style overlap (Jaccard)          0.20
 *   category match                   0.10
 *   region proximity                 0.10
 */

function jaccard(a, b) {
  if (!a?.length || !b?.length) return 0
  const sa = new Set(a.map(s => s.toLowerCase()))
  const sb = new Set(b.map(s => s.toLowerCase()))
  let inter = 0
  for (const v of sa) if (sb.has(v)) inter++
  const union = new Set([...sa, ...sb]).size
  return union === 0 ? 0 : inter / union
}

function tasteDistance(a, b) {
  if (!a || !b) return 1
  const keys = ['sweetness', 'acidity', 'tannin', 'body', 'fruitiness']
  let sum = 0
  for (const k of keys) {
    const diff = (a[k] || 3) - (b[k] || 3)
    sum += diff * diff
  }
  // max possible distance = sqrt(5 * 4^2) = sqrt(80) ≈ 8.94
  return Math.sqrt(sum) / 8.94
}

function regionScore(a, b) {
  if (!a || !b) return 0
  if (a.region === b.region && a.subregion === b.subregion) return 1
  if (a.region === b.region) return 0.6
  if (a.country === b.country) return 0.3
  return 0
}

function similarity(wine, other) {
  const taste  = 1 - tasteDistance(wine.tasteProfile, other.tasteProfile)
  const grape  = jaccard(wine.grapes, other.grapes)
  const style  = jaccard(wine.style, other.style)
  const cat    = wine.category === other.category ? 1 : 0
  const region = regionScore(wine, other)

  return taste * 0.35 + grape * 0.25 + style * 0.20 + cat * 0.10 + region * 0.10
}

/**
 * Get wines most similar to a given wine.
 */
export function getRecommendations(wine, allWines, count = 6) {
  return allWines
    .filter(w => w.id !== wine.id)
    .map(w => ({ wine: w, score: similarity(wine, w) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(r => r.wine)
}

/**
 * Get recommendations based on the user's cellar profile.
 * Aggregates taste preferences from all cellar bottles and finds
 * wines from the database that best match but aren't already in the cellar.
 */
export function getCellarRecommendations(bottles, allWines, count = 6) {
  if (!bottles.length) return []

  // Build an aggregate cellar profile
  const cellarIds = new Set(bottles.map(b => b.wineId).filter(Boolean))
  const cellarWines = allWines.filter(w => cellarIds.has(w.id))

  if (cellarWines.length === 0) return []

  // Average taste profile
  const keys = ['sweetness', 'acidity', 'tannin', 'body', 'fruitiness']
  const avgProfile = {}
  for (const k of keys) {
    const vals = cellarWines.map(w => w.tasteProfile?.[k]).filter(v => v != null)
    avgProfile[k] = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 3
  }

  // Collect all grapes and styles
  const allGrapes = cellarWines.flatMap(w => w.grapes || [])
  const allStyles = cellarWines.flatMap(w => w.style || [])

  // Most common category
  const catCounts = {}
  cellarWines.forEach(w => { catCounts[w.category] = (catCounts[w.category] || 0) + 1 })
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'red'

  // Most common region/country
  const regionCounts = {}
  cellarWines.forEach(w => { regionCounts[w.region] = (regionCounts[w.region] || 0) + 1 })
  const topRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

  const profile = {
    tasteProfile: avgProfile,
    grapes: allGrapes,
    style: allStyles,
    category: topCat,
    region: topRegion,
    country: cellarWines[0]?.country,
  }

  return allWines
    .filter(w => !cellarIds.has(w.id))
    .map(w => ({ wine: w, score: similarity(profile, w) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(r => r.wine)
}
