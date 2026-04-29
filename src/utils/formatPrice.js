export function formatPrice(value, { currency = '£', decimals = 2 } = {}) {
  const num = typeof value === 'number' ? value : Number.parseFloat(value)
  if (!Number.isFinite(num)) return null
  return `${currency}${num.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}
