export function getWineVintageLabel(wine) {
  const editionMatch = wine?.name?.match(/\bNo\.\s*(\d+)\b/i)
  if (editionMatch) return `No. ${editionMatch[1]}`

  const value = wine?.vintage
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string' && value.trim()) return value.trim()

  if (wine?.category === 'sparkling') return 'NV'
  return ''
}
