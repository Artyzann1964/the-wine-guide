/**
 * Data invariant tests for src/data/venueWineLists.js
 *
 * Checks that:
 * - Every venue-list ID exists in the Sheffield VENUES array
 * - Every item has the required fields and valid category values
 * - Prices are numeric where present (not strings)
 */

import { describe, it, expect } from 'vitest'
import { venueWineLists, venueWineListIds } from '../data/venueWineLists.js'

// We pull the VENUES array directly from Sheffield.jsx so the check stays
// authoritative. Sheffield.jsx is a React component but exports a plain JS
// array — we can import it with a mock for JSX if needed. To keep this
// test file free of React dependencies we read the IDs from a known-good
// list derived from the file. If Sheffield IDs change, update this set.
const KNOWN_SHEFFIELD_IDS = new Set([
  'gill-and-co',
  'harritt-wine-bar',
  'rafters-restaurant',
  'domo-vino',
  'joro-restaurant',
  'grazie-sheffield',
  'la-bottega-sheffield',
  'guyshi-sheffield',
  'peacock-inn',
  'rose-and-crown',
  'crown-and-glove',
  'the-swan-walton',
  'the-anglers',
  'stroud-hotel',
  'painwick-hotel',
  'linden-hall',
  'eshott-hall',
  'galvin-green-man',
  'el-poblet-valencia',
  'forastera-valencia',
  'tinto-fino-ultramarino',
  'taberna-la-samorra',
  'ostras-pedro-valencia',
  'barbaric-valencia',
  'vivevino-valencia',
  'flama-valencia',
  'goya-gallery-valencia',
  'rausell-valencia',
  'casa-montana-valencia',
  'casa-carmela-valencia',
  'hawksmoor-air-street',
  'lowell-hotel-nyc',
  'blue-box-cafe-nyc',
])

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
  it('every wine-list ID exists in the VENUES array (Sheffield.jsx)', () => {
    const orphans = venueWineListIds.filter(id => !KNOWN_SHEFFIELD_IDS.has(id))
    if (orphans.length > 0) {
      console.error('Wine-list IDs not found in VENUES:', orphans)
    }
    expect(orphans).toHaveLength(0)
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
