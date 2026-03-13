import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'wine-guide-cellar'
const BACKUP_KEY = 'wine-guide-cellar-backup'
const REVISION_KEY = 'wine-guide-cellar-revision'
const CELLAR_EVENT = 'wine-guide-cellar-updated'

const ITEM_STATUS = {
  bottle: 'bottle',
  wishlist: 'wishlist',
  tasted: 'tasted',
}

const defaultCellarStore = {
  items: [],
}

function createItemId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeText(value) {
  return String(value || '').trim()
}

function normalizeOptionalText(value) {
  const text = normalizeText(value)
  return text || ''
}

function normalizeNullableText(value) {
  const text = normalizeText(value)
  return text || null
}

function normalizeQuantity(value) {
  const parsed = Number.parseInt(String(value || ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function normalizePurchasePrice(value) {
  if (value == null) return null
  const raw = String(value).trim()
  if (!raw) return null
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  if (!cleaned) return null
  const parsed = Number.parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed.toFixed(2).replace(/\.00$/, '') : null
}

function normalizeScore(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeRating(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeTimestamp(value, fallback) {
  const text = normalizeText(value)
  return text || fallback
}

function normalizeDeletedAt(value) {
  const text = normalizeText(value)
  return text || null
}

function normalizeDateOnly(value, fallback) {
  const text = normalizeText(value)
  return text || fallback
}

function normalizeStatus(value, fallback = ITEM_STATUS.bottle) {
  if (value === ITEM_STATUS.bottle || value === ITEM_STATUS.wishlist || value === ITEM_STATUS.tasted) {
    return value
  }
  return fallback
}

function tastingSignature(entry) {
  return [
    entry?.producer || '',
    entry?.name || '',
    entry?.vintage || '',
    entry?.country || '',
  ].join('|').toLowerCase().trim()
}

function bottleSignature(entry) {
  return [
    entry?.wineId || '',
    entry?.producer || '',
    entry?.name || '',
    entry?.vintage || '',
    entry?.purchaseDate || '',
    entry?.location || '',
  ].join('|').toLowerCase().trim()
}

function wishlistSignature(entry) {
  return [
    entry?.wineId || '',
    entry?.producer || '',
    entry?.name || '',
    entry?.vintage || '',
  ].join('|').toLowerCase().trim()
}

function hasAnyCellarData(store) {
  return Array.isArray(store?.items) && store.items.length > 0
}

function normalizeCellarItem(entry, fallbackStatus = ITEM_STATUS.bottle) {
  const now = new Date().toISOString()
  const today = now.slice(0, 10)
  const status = normalizeStatus(entry?.status, fallbackStatus)
  const createdAt = normalizeTimestamp(entry?.createdAt || entry?.addedAt || entry?.tastedAt, now)
  const updatedAt = normalizeTimestamp(entry?.updatedAt || entry?.tastedAt || entry?.addedAt, createdAt)

  return {
    id: normalizeText(entry?.id) || createItemId(status),
    status,
    wineId: normalizeNullableText(entry?.wineId),
    name: normalizeOptionalText(entry?.name),
    producer: normalizeOptionalText(entry?.producer),
    vintage: entry?.vintage == null ? '' : String(entry.vintage).trim(),
    region: normalizeOptionalText(entry?.region),
    country: normalizeOptionalText(entry?.country),
    category: normalizeOptionalText(entry?.category),
    quantity: normalizeQuantity(entry?.quantity),
    purchasePrice: normalizePurchasePrice(entry?.purchasePrice),
    purchaseDate: normalizeDateOnly(entry?.purchaseDate, today),
    drinkFrom: normalizeNullableText(entry?.drinkFrom),
    drinkBy: normalizeNullableText(entry?.drinkBy),
    notes: normalizeOptionalText(entry?.notes),
    tastingNote: normalizeOptionalText(entry?.tastingNote),
    location: normalizeOptionalText(entry?.location),
    purchaseSourceType: normalizeOptionalText(entry?.purchaseSourceType),
    purchaseRetailer: normalizeOptionalText(entry?.purchaseRetailer),
    purchaseRetailerOther: normalizeOptionalText(entry?.purchaseRetailerOther),
    addedAt: normalizeTimestamp(entry?.addedAt, createdAt),
    createdAt,
    updatedAt,
    tastedAt: status === ITEM_STATUS.tasted ? normalizeTimestamp(entry?.tastedAt, updatedAt) : null,
    rating: normalizeRating(entry?.rating),
    wouldBuyAgain: normalizeRating(entry?.wouldBuyAgain),
    score: normalizeScore(entry?.score),
    colour: normalizeNullableText(entry?.colour),
    nose: Array.isArray(entry?.nose) && entry.nose.length ? entry.nose.filter(Boolean) : null,
    body: normalizeNullableText(entry?.body),
    acidity: normalizeNullableText(entry?.acidity),
    tannins: normalizeNullableText(entry?.tannins),
    finish: normalizeNullableText(entry?.finish),
    source: normalizeOptionalText(entry?.source),
    signature: normalizeOptionalText(entry?.signature),
    deletedAt: normalizeDeletedAt(entry?.deletedAt),
  }
}

function normalizeCellarStore(value) {
  const data = value && typeof value === 'object' ? value : {}

  if (Array.isArray(data.items)) {
    return {
      items: data.items.map(item => normalizeCellarItem(item, item?.status)),
    }
  }

  return {
    items: [
      ...(Array.isArray(data.bottles) ? data.bottles.map(item => normalizeCellarItem(item, ITEM_STATUS.bottle)) : []),
      ...(Array.isArray(data.wishlist) ? data.wishlist.map(item => normalizeCellarItem(item, ITEM_STATUS.wishlist)) : []),
      ...(Array.isArray(data.tasted) ? data.tasted.map(item => normalizeCellarItem(item, ITEM_STATUS.tasted)) : []),
    ],
  }
}

function toBottleView(item) {
  return { ...item }
}

function toWishlistView(item) {
  return { ...item }
}

function toTastedView(item) {
  return {
    ...item,
    notes: item.tastingNote || item.notes || '',
  }
}

function exportCellarShape(store) {
  const items = Array.isArray(store?.items) ? store.items.map(item => ({ ...item })) : []
  return {
    items,
    bottles: items.filter(item => !item.deletedAt && item.status === ITEM_STATUS.bottle).map(toBottleView),
    wishlist: items.filter(item => !item.deletedAt && item.status === ITEM_STATUS.wishlist).map(toWishlistView),
    tasted: items.filter(item => !item.deletedAt && item.status === ITEM_STATUS.tasted).map(toTastedView),
  }
}

function readStoredCellarStore() {
  try {
    const primary = localStorage.getItem(STORAGE_KEY)
    if (primary) return normalizeCellarStore(JSON.parse(primary))
  } catch {
    // Fall through to backup key.
  }

  try {
    const backup = localStorage.getItem(BACKUP_KEY)
    if (backup) return normalizeCellarStore(JSON.parse(backup))
  } catch {
    // If both are unreadable, return defaults.
  }

  return defaultCellarStore
}

function readStoredRevision() {
  try {
    const value = Number(localStorage.getItem(REVISION_KEY) || 0)
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function persistCellar(store, revision = Date.now()) {
  const payload = JSON.stringify(exportCellarShape(store))
  try {
    localStorage.setItem(STORAGE_KEY, payload)
    localStorage.setItem(BACKUP_KEY, payload)
    localStorage.setItem(REVISION_KEY, String(revision))
  } catch {
    // storage full or unavailable
  }
}

function broadcastCellarUpdate() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CELLAR_EVENT))
}

export function useCellar() {
  const [cellarStore, setCellarStore] = useState(readStoredCellarStore)
  const [cellarRevision, setCellarRevision] = useState(readStoredRevision)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncFromStorage = () => {
      setCellarStore(readStoredCellarStore())
      setCellarRevision(readStoredRevision())
    }

    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY && event.key !== BACKUP_KEY) return
      syncFromStorage()
    }

    window.addEventListener(CELLAR_EVENT, syncFromStorage)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener(CELLAR_EVENT, syncFromStorage)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    if (cellarRevision > 0) return
    if (!hasAnyCellarData(cellarStore)) return
    const migratedRevision = Date.now()
    persistCellar(cellarStore, migratedRevision)
    setCellarRevision(migratedRevision)
    broadcastCellarUpdate()
  }, [cellarStore, cellarRevision])

  const cellar = useMemo(() => exportCellarShape(cellarStore), [cellarStore])
  const { items, bottles, wishlist, tasted } = cellar

  const applyUpdate = useCallback((updater) => {
    const revision = Date.now()
    setCellarRevision(revision)
    setCellarStore(() => {
      const latest = readStoredCellarStore()
      const base = normalizeCellarStore(latest)
      const nextStore = normalizeCellarStore(
        typeof updater === 'function' ? updater(base) : updater
      )
      persistCellar(nextStore, revision)
      broadcastCellarUpdate()
      return nextStore
    })
  }, [])

  const softDeleteItem = useCallback((id, status) => {
    applyUpdate(prev => ({
      items: prev.items.map(item => {
        if (item.id !== id || item.status !== status || item.deletedAt) return item
        const now = new Date().toISOString()
        return normalizeCellarItem({
          ...item,
          updatedAt: now,
          deletedAt: now,
        }, status)
      }),
    }))
  }, [applyUpdate])

  const addBottle = useCallback((wine) => {
    const now = new Date().toISOString()
    const entry = normalizeCellarItem({
      ...wine,
      id: createItemId('cellar'),
      status: ITEM_STATUS.bottle,
      purchaseDate: wine?.purchaseDate || now.slice(0, 10),
      addedAt: now,
      createdAt: now,
      updatedAt: now,
    }, ITEM_STATUS.bottle)

    applyUpdate(prev => ({
      items: [entry, ...prev.items],
    }))

    return entry
  }, [applyUpdate])

  const removeBottle = useCallback((id) => {
    softDeleteItem(id, ITEM_STATUS.bottle)
  }, [softDeleteItem])

  const updateBottle = useCallback((id, updates) => {
    applyUpdate(prev => ({
      items: prev.items.map(item => {
        if (item.id !== id || item.status !== ITEM_STATUS.bottle) return item
        return normalizeCellarItem({
          ...item,
          ...updates,
          status: ITEM_STATUS.bottle,
          updatedAt: new Date().toISOString(),
        }, ITEM_STATUS.bottle)
      }),
    }))
  }, [applyUpdate])

  const updateTastedEntry = useCallback((id, updates) => {
    applyUpdate(prev => ({
      items: prev.items.map(item => {
        if (item.id !== id || item.status !== ITEM_STATUS.tasted) return item
        return normalizeCellarItem({
          ...item,
          ...updates,
          status: ITEM_STATUS.tasted,
          updatedAt: new Date().toISOString(),
        }, ITEM_STATUS.tasted)
      }),
    }))
  }, [applyUpdate])

  const markTasted = useCallback((bottleId, tastingNote) => {
    applyUpdate(prev => {
      const target = prev.items.find(item => item.id === bottleId && item.status === ITEM_STATUS.bottle && !item.deletedAt)
      if (!target) return prev

      const now = new Date().toISOString()
      const tastedEntry = normalizeCellarItem({
        ...target,
        id: target.quantity > 1 ? createItemId('tasted') : target.id,
        status: ITEM_STATUS.tasted,
        quantity: 1,
        tastedAt: now,
        updatedAt: now,
        rating: tastingNote?.rating ?? null,
        wouldBuyAgain: tastingNote?.wouldBuyAgain ?? null,
        tastingNote: tastingNote?.note || '',
        score: tastingNote?.score ?? null,
        colour: tastingNote?.colour ?? null,
        nose: tastingNote?.nose ?? null,
        body: tastingNote?.body ?? null,
        acidity: tastingNote?.acidity ?? null,
        tannins: tastingNote?.tannins ?? null,
        finish: tastingNote?.finish ?? null,
      }, ITEM_STATUS.tasted)

      return {
        items: [
          tastedEntry,
          ...prev.items.flatMap(item => {
            if (item.id !== bottleId || item.status !== ITEM_STATUS.bottle) return [item]
            if (item.quantity > 1) {
              return [normalizeCellarItem({
                ...item,
                quantity: item.quantity - 1,
                updatedAt: now,
              }, ITEM_STATUS.bottle)]
            }
            return []
          }),
        ],
      }
    })
  }, [applyUpdate])

  const addToWishlist = useCallback((wine) => {
    const now = new Date().toISOString()
    const entry = normalizeCellarItem({
      ...wine,
      id: createItemId('wish'),
      status: ITEM_STATUS.wishlist,
      addedAt: now,
      createdAt: now,
      updatedAt: now,
    }, ITEM_STATUS.wishlist)

    applyUpdate(prev => ({
      items: [entry, ...prev.items],
    }))

    return entry
  }, [applyUpdate])

  const removeFromWishlist = useCallback((id) => {
    softDeleteItem(id, ITEM_STATUS.wishlist)
  }, [softDeleteItem])

  const importTastedEntries = useCallback((entries) => {
    const safeEntries = Array.isArray(entries) ? entries : []
    if (safeEntries.length === 0) return { added: 0, skipped: 0, total: 0 }

    let result = { added: 0, skipped: 0, total: safeEntries.length }

    applyUpdate(prev => {
      const prevCellar = exportCellarShape(prev)
      const existingIds = new Set(prevCellar.tasted.map(item => item.id).filter(Boolean))
      const existingSignatures = new Set(prevCellar.tasted.map(tastingSignature).filter(Boolean))

      const toAdd = []
      safeEntries.forEach(entry => {
        const normalized = normalizeCellarItem({
          ...entry,
          status: ITEM_STATUS.tasted,
        }, ITEM_STATUS.tasted)
        const signature = tastingSignature(normalized)
        const duplicate = (normalized.id && existingIds.has(normalized.id)) || (signature && existingSignatures.has(signature))
        if (duplicate) return
        toAdd.push(normalized)
        if (normalized.id) existingIds.add(normalized.id)
        if (signature) existingSignatures.add(signature)
      })

      result = {
        added: toAdd.length,
        skipped: safeEntries.length - toAdd.length,
        total: safeEntries.length,
      }

      if (toAdd.length === 0) return prev
      return {
        items: [...toAdd, ...prev.items],
      }
    })

    return result
  }, [applyUpdate])

  const importCellarData = useCallback((incomingCellar, mode = 'merge') => {
    const incomingStore = normalizeCellarStore(incomingCellar)
    const incoming = exportCellarShape(incomingStore)
    const usesItemSyncPayload = Array.isArray(incomingCellar?.items)
    let result = {
      mode,
      added: { bottles: 0, wishlist: 0, tasted: 0 },
      skipped: { bottles: 0, wishlist: 0, tasted: 0 },
      totals: { bottles: 0, wishlist: 0, tasted: 0 },
    }

    applyUpdate(prev => {
      const prevCellar = exportCellarShape(prev)

      if (mode === 'replace') {
        result = {
          mode,
          added: {
            bottles: incoming.bottles.length,
            wishlist: incoming.wishlist.length,
            tasted: incoming.tasted.length,
          },
          skipped: { bottles: 0, wishlist: 0, tasted: 0 },
          totals: {
            bottles: incoming.bottles.length,
            wishlist: incoming.wishlist.length,
            tasted: incoming.tasted.length,
          },
        }
        return incomingStore
      }

      if (usesItemSyncPayload) {
        const mergedById = new Map(prev.items.map(item => [item.id, item]))
        let addedBottles = 0
        let addedWishlist = 0
        let addedTasted = 0

        incomingStore.items.forEach(item => {
          const existing = mergedById.get(item.id)
          const incomingUpdatedAt = normalizeTimestamp(item.updatedAt, '')
          const existingUpdatedAt = normalizeTimestamp(existing?.updatedAt, '')
          if (!existing || incomingUpdatedAt >= existingUpdatedAt) {
            mergedById.set(item.id, item)
            if (!existing && !item.deletedAt) {
              if (item.status === ITEM_STATUS.bottle) addedBottles += 1
              if (item.status === ITEM_STATUS.wishlist) addedWishlist += 1
              if (item.status === ITEM_STATUS.tasted) addedTasted += 1
            }
          }
        })

        const mergedStore = {
          items: [...mergedById.values()].sort((a, b) => normalizeTimestamp(b.updatedAt, '').localeCompare(normalizeTimestamp(a.updatedAt, ''))),
        }
        const mergedCellar = exportCellarShape(mergedStore)

        result = {
          mode,
          added: {
            bottles: addedBottles,
            wishlist: addedWishlist,
            tasted: addedTasted,
          },
          skipped: { bottles: 0, wishlist: 0, tasted: 0 },
          totals: {
            bottles: mergedCellar.bottles.length,
            wishlist: mergedCellar.wishlist.length,
            tasted: mergedCellar.tasted.length,
          },
        }

        return mergedStore
      }

      const existingBottleIds = new Set(prevCellar.bottles.map(item => item.id).filter(Boolean))
      const existingBottleSignatures = new Set(prevCellar.bottles.map(bottleSignature).filter(Boolean))
      const existingWishlistIds = new Set(prevCellar.wishlist.map(item => item.id).filter(Boolean))
      const existingWishlistSignatures = new Set(prevCellar.wishlist.map(wishlistSignature).filter(Boolean))
      const existingTastedIds = new Set(prevCellar.tasted.map(item => item.id).filter(Boolean))
      const existingTastedSignatures = new Set(prevCellar.tasted.map(tastingSignature).filter(Boolean))

      const bottlesToAdd = []
      incoming.bottles.forEach(entry => {
        const signature = bottleSignature(entry)
        const duplicate = (entry.id && existingBottleIds.has(entry.id)) || (signature && existingBottleSignatures.has(signature))
        if (duplicate) return
        const normalized = normalizeCellarItem(entry, ITEM_STATUS.bottle)
        bottlesToAdd.push(normalized)
        if (normalized.id) existingBottleIds.add(normalized.id)
        if (signature) existingBottleSignatures.add(signature)
      })

      const wishlistToAdd = []
      incoming.wishlist.forEach(entry => {
        const signature = wishlistSignature(entry)
        const duplicate = (entry.id && existingWishlistIds.has(entry.id)) || (signature && existingWishlistSignatures.has(signature))
        if (duplicate) return
        const normalized = normalizeCellarItem(entry, ITEM_STATUS.wishlist)
        wishlistToAdd.push(normalized)
        if (normalized.id) existingWishlistIds.add(normalized.id)
        if (signature) existingWishlistSignatures.add(signature)
      })

      const tastedToAdd = []
      incoming.tasted.forEach(entry => {
        const signature = tastingSignature(entry)
        const duplicate = (entry.id && existingTastedIds.has(entry.id)) || (signature && existingTastedSignatures.has(signature))
        if (duplicate) return
        const normalized = normalizeCellarItem(entry, ITEM_STATUS.tasted)
        tastedToAdd.push(normalized)
        if (normalized.id) existingTastedIds.add(normalized.id)
        if (signature) existingTastedSignatures.add(signature)
      })

      result = {
        mode,
        added: {
          bottles: bottlesToAdd.length,
          wishlist: wishlistToAdd.length,
          tasted: tastedToAdd.length,
        },
        skipped: {
          bottles: incoming.bottles.length - bottlesToAdd.length,
          wishlist: incoming.wishlist.length - wishlistToAdd.length,
          tasted: incoming.tasted.length - tastedToAdd.length,
        },
        totals: {
          bottles: prevCellar.bottles.length + bottlesToAdd.length,
          wishlist: prevCellar.wishlist.length + wishlistToAdd.length,
          tasted: prevCellar.tasted.length + tastedToAdd.length,
        },
      }

      if (bottlesToAdd.length === 0 && wishlistToAdd.length === 0 && tastedToAdd.length === 0) {
        return prev
      }

      return {
        items: [...bottlesToAdd, ...wishlistToAdd, ...tastedToAdd, ...prev.items],
      }
    })

    return result
  }, [applyUpdate])

  const isInCellar = useCallback((wineId) =>
    bottles.some(item => item.wineId === wineId), [bottles])

  const isInWishlist = useCallback((wineId) =>
    wishlist.some(item => item.wineId === wineId), [wishlist])

  const stats = useMemo(() => ({
    totalBottles: bottles.reduce((sum, item) => sum + (item.quantity || 1), 0),
    totalWines: bottles.length,
    wishlistCount: wishlist.length,
    tastedCount: tasted.length,
    byCategory: bottles.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + (item.quantity || 1)
      return acc
    }, {}),
  }), [bottles, wishlist.length, tasted.length])

  return {
    cellar,
    items,
    bottles,
    wishlist,
    tasted,
    cellarRevision,
    stats,
    addBottle,
    removeBottle,
    updateBottle,
    markTasted,
    updateTastedEntry,
    addToWishlist,
    removeFromWishlist,
    importTastedEntries,
    importCellarData,
    isInCellar,
    isInWishlist,
  }
}
