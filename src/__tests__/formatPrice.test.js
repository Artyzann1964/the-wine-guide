import { describe, it, expect } from 'vitest'
import { formatPrice } from '../utils/formatPrice.js'

describe('formatPrice', () => {
  it('formats whole numbers with two decimals by default', () => {
    expect(formatPrice(21)).toBe('£21.00')
  })

  it('formats fractional numbers with two decimals', () => {
    expect(formatPrice(21.5)).toBe('£21.50')
  })

  it('honours decimals: 0 with thousands separator', () => {
    expect(formatPrice(1234, { decimals: 0 })).toBe('£1,234')
  })

  it('parses numeric strings', () => {
    expect(formatPrice('21.5')).toBe('£21.50')
  })

  it('returns null for non-numeric input', () => {
    expect(formatPrice(null)).toBeNull()
    expect(formatPrice(undefined)).toBeNull()
    expect(formatPrice('Price on menu')).toBeNull()
    expect(formatPrice(NaN)).toBeNull()
  })

  it('respects custom currency', () => {
    expect(formatPrice(10, { currency: '$' })).toBe('$10.00')
  })
})
