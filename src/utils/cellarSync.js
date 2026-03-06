const CELLAR_SYNC_PREFIX = 'WGCS1_'
export const CLOUD_SYNC_ID_KEY = 'wine-guide-cloud-sync-id'
export const CLOUD_SYNC_EVENT = 'wine-guide-cloud-sync-id-updated'

function toBinaryString(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
  return binary
}

function toBase64Url(bytes) {
  const base64 = btoa(toBinaryString(bytes))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(encoded) {
  const base64 = String(encoded || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(String(encoded || '').length / 4) * 4, '=')
  const binary = atob(base64)
  return Uint8Array.from(binary, ch => ch.charCodeAt(0))
}

export function normalizeCloudSyncId(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (!/^[a-zA-Z0-9_-]{8,96}$/.test(raw)) return ''
  return raw
}

export function generateCloudSyncId() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return `wg-${toBase64Url(bytes)}`
}

export function buildCellarSyncPayload({ bottles = [], wishlist = [], tasted = [] }) {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    bottles: Array.isArray(bottles) ? bottles : [],
    wishlist: Array.isArray(wishlist) ? wishlist : [],
    tasted: Array.isArray(tasted) ? tasted : [],
  }
}

export function encodeCellarSyncPayload(payload) {
  const json = JSON.stringify(payload || {})
  const bytes = new TextEncoder().encode(json)
  return `${CELLAR_SYNC_PREFIX}${toBase64Url(bytes)}`
}

export function decodeCellarSyncPayload(encodedValue) {
  if (!encodedValue) return null
  try {
    const raw = String(encodedValue).trim()
    const extracted = raw.includes('cs=')
      ? (() => {
          const match = raw.match(/[?&]cs=([^&]+)/)
          return match ? decodeURIComponent(match[1]) : raw
        })()
      : raw
    const encoded = extracted.startsWith(CELLAR_SYNC_PREFIX)
      ? extracted.slice(CELLAR_SYNC_PREFIX.length)
      : extracted
    const bytes = fromBase64Url(encoded)
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object') return null
    if (!Array.isArray(parsed.bottles) || !Array.isArray(parsed.wishlist) || !Array.isArray(parsed.tasted)) return null
    return parsed
  } catch {
    return null
  }
}
