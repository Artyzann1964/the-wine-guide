/**
 * Data invariant tests for src/data/wines.js
 *
 * These tests run against the live exported `wines` array (post-normalization)
 * and against the raw `_wines` internals we can observe through normalization.
 * They do not import any UI components.
 */

import { describe, it, expect } from 'vitest'
import { wines } from '../data/wines.js'

// ─── Helpers ────────────────────────────────────────────────────────────────

const NON_BREAKING_HYPHEN = '\u2011'
const NBHYPHEN_RE = new RegExp(NON_BREAKING_HYPHEN)

// ─── Suite ──────────────────────────────────────────────────────────────────

describe('wines dataset — structural invariants', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(wines)).toBe(true)
    expect(wines.length).toBeGreaterThan(0)
  })

  it('every wine has a non-empty string id', () => {
    const badIds = wines.filter(w => typeof w.id !== 'string' || !w.id.trim())
    expect(badIds).toHaveLength(0)
  })

  it('all ids are unique', () => {
    const ids = wines.map(w => w.id)
    const unique = new Set(ids)
    expect(ids.length).toBe(unique.size)
  })

  it('every wine has a non-empty name string', () => {
    const bad = wines.filter(w => typeof w.name !== 'string' || !w.name.trim())
    expect(bad).toHaveLength(0)
  })
})

describe('wines dataset — normalization outputs', () => {
  const VALID_CATEGORIES = new Set(['sparkling', 'white', 'red', 'rosé', 'dessert', 'orange', 'fortified'])
  const VALID_PRICE_RANGES = new Set(['budget', 'mid', 'premium', 'luxury'])

  it('category is always lowercase and one of the known values', () => {
    const bad = wines.filter(w => !VALID_CATEGORIES.has(w.category))
    if (bad.length > 0) {
      console.error('Unknown categories:', [...new Set(bad.map(w => w.category))])
    }
    expect(bad).toHaveLength(0)
  })

  it('priceRange is always one of the named tiers', () => {
    const bad = wines.filter(w => !VALID_PRICE_RANGES.has(w.priceRange))
    if (bad.length > 0) {
      console.error('Invalid priceRange values:', [...new Set(bad.map(w => `${w.id}: ${w.priceRange}`))])
    }
    expect(bad).toHaveLength(0)
  })

  it('price is always a non-empty string (display format)', () => {
    const bad = wines.filter(w => typeof w.price !== 'string' || !w.price.trim())
    expect(bad).toHaveLength(0)
  })

  it('grapes is always an array', () => {
    const bad = wines.filter(w => !Array.isArray(w.grapes))
    expect(bad).toHaveLength(0)
  })

  it('style is always an array', () => {
    const bad = wines.filter(w => !Array.isArray(w.style))
    expect(bad).toHaveLength(0)
  })

  it('pairings is always an array of objects', () => {
    const bad = wines.filter(w => {
      if (!Array.isArray(w.pairings)) return true
      return w.pairings.some(p => typeof p !== 'object' || p === null)
    })
    expect(bad).toHaveLength(0)
  })

  it('vintageGuide is always an array', () => {
    const bad = wines.filter(w => !Array.isArray(w.vintageGuide))
    expect(bad).toHaveLength(0)
  })

  it('whereToBuy is always an array', () => {
    const bad = wines.filter(w => !Array.isArray(w.whereToBuy))
    expect(bad).toHaveLength(0)
  })

  it('producer is always a non-empty string', () => {
    const bad = wines.filter(w => typeof w.producer !== 'string' || !w.producer.trim())
    expect(bad).toHaveLength(0)
  })

  it('decant is null or a string, never boolean', () => {
    const bad = wines.filter(w => w.decant === true || w.decant === false)
    if (bad.length > 0) {
      console.error('Boolean decant values:', bad.map(w => w.id))
    }
    expect(bad).toHaveLength(0)
  })
})

// ─── Known bugs (tracked in WINES_AUDIT.md, fix owned by Codex) ─────────────
// The three tests below document real data quality issues found during the
// 2026-03-13 audit. They are EXPECTED TO FAIL until wines.js is patched:
//   • ~70 wines have string-typed vintage (e.g. "2019" or "NV")
//   • 10 wines have non-breaking hyphens (U+2011) in region strings
//   • ~77 vintageGuide entries have string year values ("NV", "2019", etc.)
// Do not mark these as .todo or .skip — the failures serve as regression signals.
// ─────────────────────────────────────────────────────────────────────────────

describe('wines dataset — data quality checks', () => {
  it('vintage is numeric where present (not a string digit)', () => {
    const bad = wines.filter(w => {
      if (w.vintage === undefined || w.vintage === null) return false
      return typeof w.vintage !== 'number'
    })
    if (bad.length > 0) {
      console.error('String-typed vintages:', bad.map(w => `${w.id}: ${JSON.stringify(w.vintage)}`))
    }
    expect(bad).toHaveLength(0)
  })

  it('region strings contain no non-breaking hyphens (U+2011)', () => {
    const bad = wines.filter(w => typeof w.region === 'string' && NBHYPHEN_RE.test(w.region))
    if (bad.length > 0) {
      console.error('Non-breaking hyphens in region:', bad.map(w => `${w.id}: ${w.region}`))
    }
    expect(bad).toHaveLength(0)
  })

  it('producer strings contain no backslash characters', () => {
    const bad = wines.filter(w => typeof w.producer === 'string' && w.producer.includes('\\'))
    if (bad.length > 0) {
      console.error('Backslash in producer:', bad.map(w => `${w.id}: ${w.producer}`))
    }
    expect(bad).toHaveLength(0)
  })

  it('rating is numeric between 0 and 100 where present', () => {
    const bad = wines.filter(w => {
      if (w.rating === undefined || w.rating === null) return false
      return typeof w.rating !== 'number' || w.rating < 0 || w.rating > 100
    })
    expect(bad).toHaveLength(0)
  })

  it('tasteProfile values are numeric where present', () => {
    const bad = wines.filter(w => {
      if (!w.tasteProfile || typeof w.tasteProfile !== 'object') return false
      return Object.values(w.tasteProfile).some(v => typeof v !== 'number')
    })
    expect(bad).toHaveLength(0)
  })

  it('vintageGuide entries have numeric year values', () => {
    const bad = wines.flatMap(w =>
      w.vintageGuide.filter(v => typeof v.year !== 'number').map(v => `${w.id}: year=${JSON.stringify(v.year)}`)
    )
    if (bad.length > 0) console.error('Non-numeric vintageGuide years:', bad)
    expect(bad).toHaveLength(0)
  })
})
