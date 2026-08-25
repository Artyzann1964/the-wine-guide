/**
 * Data invariant tests for src/data/venueWineLists.js
 *
 * Checks that:
 * - Every venue-list ID exists in the live VENUES array
 * - Every item has the required fields and valid category values
 * - Prices are numeric where present (not strings)
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { venueWineLists, venueWineListIds } from '../data/venueWineLists.js'
import { VENUES } from '../data/places.js'
import { wines } from '../data/wines.js'

const KNOWN_VENUE_IDS = new Set(VENUES.map(venue => venue.id))
const KNOWN_WINE_IDS = new Set(wines.map(wine => wine.id))

const VALID_CATEGORIES = new Set([
  'white',
  'red',
  'sparkling',
  'rosé',
  'orange',
  'dessert',
  'fortified',
  'sparkling-rosé',
])

function isLikelyImage(bytes) {
  if (bytes.length < 12) return false
  const ascii = bytes.subarray(0, 12).toString('ascii')
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true
  if (bytes[0] === 0x89 && ascii.slice(1, 4) === 'PNG') return true
  if (ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP') return true
  if (ascii.slice(4, 12) === 'ftypavif' || ascii.slice(4, 12) === 'ftypavis') return true
  if (ascii.trimStart().startsWith('<svg')) return true
  return false
}

function getPublicImageFiles(dir = join(process.cwd(), 'public')) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) return getPublicImageFiles(fullPath)
    if (/\.(avif|jpe?g|png|svg|webp)$/i.test(entry.name)) return [fullPath]
    return []
  })
}

describe('venueWineLists — exports', () => {
  it('venueWineLists is a non-null object', () => {
    expect(venueWineLists).toBeDefined()
    expect(typeof venueWineLists).toBe('object')
    expect(venueWineLists).not.toBeNull()
  })

  it('venueWineListIds is an array matching Object.keys(venueWineLists)', () => {
    expect(Array.isArray(venueWineListIds)).toBe(true)
    expect(venueWineListIds).toEqual(Object.keys(venueWineLists))
  })

  it('has at least one venue list', () => {
    expect(venueWineListIds.length).toBeGreaterThan(0)
  })
})

describe('venueWineLists — venue ID cross-reference', () => {
  it('every wine-list ID exists in the VENUES array', () => {
    const orphans = venueWineListIds.filter(id => !KNOWN_VENUE_IDS.has(id))
    if (orphans.length > 0) {
      console.error('Wine-list IDs not found in VENUES:', orphans)
    }
    expect(orphans).toHaveLength(0)
  })
})

describe('places — data references', () => {
  it('every venue ID is unique', () => {
    expect(KNOWN_VENUE_IDS.size).toBe(VENUES.length)
  })

  it('every suggested wine ID exists in the wine dataset', () => {
    const missing = VENUES.flatMap(venue =>
      venue.wineIds
        .filter(wineId => !KNOWN_WINE_IDS.has(wineId))
        .map(wineId => `${venue.id}: ${wineId}`)
    )

    expect(missing).toHaveLength(0)
  })
})

describe('venue image assets', () => {
  it('all public image files contain image data', () => {
    const bad = getPublicImageFiles()
      .filter(assetPath => !isLikelyImage(readFileSync(assetPath).subarray(0, 32)))
      .map(assetPath => assetPath.replace(`${process.cwd()}/`, ''))

    expect(bad).toHaveLength(0)
  })

  it('local venue image paths point to real image files in public/', () => {
    const bad = VENUES
      .filter(venue => typeof venue.image === 'string' && venue.image.startsWith('/'))
      .map(venue => {
        const assetPath = join(process.cwd(), 'public', venue.image)
        if (!existsSync(assetPath)) return `${venue.id}: missing ${venue.image}`
        const bytes = readFileSync(assetPath).subarray(0, 32)
        if (!isLikelyImage(bytes)) return `${venue.id}: not an image ${venue.image}`
        return null
      })
      .filter(Boolean)

    expect(bad).toHaveLength(0)
  })
})

describe('venueWineLists — per-venue structure', () => {
  for (const id of venueWineListIds) {
    const venue = venueWineLists[id]

    it(`${id}: has a source string`, () => {
      expect(typeof venue.source).toBe('string')
      expect(venue.source.trim().length).toBeGreaterThan(0)
    })

    it(`${id}: items is a non-empty array`, () => {
      expect(Array.isArray(venue.items)).toBe(true)
      expect(venue.items.length).toBeGreaterThan(0)
    })
  }
})

describe('venueWineLists — per-item field invariants', () => {
  for (const [venueId, venue] of Object.entries(venueWineLists)) {
    it(`${venueId}: every item has a non-empty name string`, () => {
      const bad = venue.items.filter(item => typeof item.name !== 'string' || !item.name.trim())
      expect(bad).toHaveLength(0)
    })

    it(`${venueId}: every item has a valid category`, () => {
      const bad = venue.items.filter(item => !VALID_CATEGORIES.has(item.category))
      if (bad.length > 0) {
        console.error(`${venueId} — unknown categories:`, bad.map(i => `"${i.name}": ${i.category}`))
      }
      expect(bad).toHaveLength(0)
    })

    it(`${venueId}: every item has a non-empty country string`, () => {
      // 7 items in the-swan-walton are non-alcoholic/house products with no
      // discernible country of origin in the menu (Zeno 0%, Pure, Borsori Blush, etc.)
      const KNOWN_COUNTRY_GAP_ITEMS = new Set([
        'Zeno 0%', 'Peony Blush 0%', 'Dry Dragon 0%', 'Royal Flush 0%',
        'Pure', 'Pure Rose', 'Borsori Blush',
      ])
      const bad = venue.items.filter(
        item => !KNOWN_COUNTRY_GAP_ITEMS.has(item.name) &&
          (typeof item.country !== 'string' || !item.country.trim())
      )
      if (bad.length > 0) {
        console.error(`${venueId} — items missing country:`, bad.map(i => i.name))
      }
      expect(bad).toHaveLength(0)
    })

    it(`${venueId}: price is null or a positive number (not a string)`, () => {
      const bad = venue.items.filter(item => {
        if (item.price === null || item.price === undefined) return false
        return typeof item.price !== 'number' || item.price < 0
      })
      if (bad.length > 0) {
        console.error(`${venueId} — invalid price:`, bad.map(i => `"${i.name}": ${JSON.stringify(i.price)}`))
      }
      expect(bad).toHaveLength(0)
    })
  }
})
