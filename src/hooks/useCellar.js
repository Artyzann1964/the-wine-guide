import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wine-guide-cellar'
const BACKUP_KEY = 'wine-guide-cellar-backup'
const REVISION_KEY = 'wine-guide-cellar-revision'
const CELLAR_EVENT = 'wine-guide-cellar-updated'

const defaultCellar = {
  bottles: [],       // wines you own
  wishlist: [],      // wines you want to try
  tasted: [],        // wines you've drunk with notes
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

function hasAnyCellarData(cellar) {
  if (!cellar || typeof cellar !== 'object') return false
  return (
    Array.isArray(cellar.bottles) && cellar.bottles.length > 0
  ) || (
    Array.isArray(cellar.wishlist) && cellar.wishlist.length > 0
  ) || (
    Array.isArray(cellar.tasted) && cellar.tasted.length > 0
  )
}

function normalizeCellarShape(value) {
  const data = value && typeof value === 'object' ? value : {}
  return {
    bottles: Array.isArray(data.bottles) ? data.bottles : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
    tasted: Array.isArray(data.tasted) ? data.tasted : [],
  }
}

function readStoredCellar() {
  try {
    const primary = localStorage.getItem(STORAGE_KEY)
    if (primary) return normalizeCellarShape(JSON.parse(primary))
  } catch {
    // Fall through to backup key.
  }

  try {
    const backup = localStorage.getItem(BACKUP_KEY)
    if (backup) return normalizeCellarShape(JSON.parse(backup))
  } catch {
    // If both are unreadable, return defaults.
  }

  return defaultCellar
}

function readStoredRevision() {
  try {
    const value = Number(localStorage.getItem(REVISION_KEY) || 0)
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function persistCellar(nextCellar, revision = Date.now()) {
  const payload = JSON.stringify(nextCellar)
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
  const [cellar, setCellar] = useState(readStoredCellar)
  const [cellarRevision, setCellarRevision] = useState(readStoredRevision)
  
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncFromStorage = () => {
      setCellar(readStoredCellar())
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
    if (!hasAnyCellarData(cellar)) return
    const migratedRevision = Date.now()
    persistCellar(cellar, migratedRevision)
    setCellarRevision(migratedRevision)
    broadcastCellarUpdate()
  }, [cellar, cellarRevision])

  const applyUpdate = useCallback((updater) => {
    const revision = Date.now()
    setCellarRevision(revision)
    setCellar(() => {
      const latest = readStoredCellar()
      const base = normalizeCellarShape(latest)
      const next = normalizeCellarShape(
        typeof updater === 'function' ? updater(base) : updater
      )
      persistCellar(next, revision)
      broadcastCellarUpdate()
      return next
    })
  }, [])

  // Add a bottle to the cellar
  const addBottle = useCallback((wine) => {
    const entry = {
      id: `cellar-${Date.now()}`,
      wineId: wine.wineId || null,       // links to known wine DB entry
      name: wine.name,
      producer: wine.producer || '',
      vintage: wine.vintage || '',
      region: wine.region || '',
      country: wine.country || '',
      category: wine.category || '',
      quantity: wine.quantity || 1,
      purchasePrice: wine.purchasePrice || null,
      purchaseDate: wine.purchaseDate || new Date().toISOString().split('T')[0],
      drinkFrom: wine.drinkFrom || null,
      drinkBy: wine.drinkBy || null,
      notes: wine.notes || '',
      location: wine.location || '',     // e.g. "Rack 3, Row 2"
      purchaseSourceType: wine.purchaseSourceType || '',
      purchaseRetailer: wine.purchaseRetailer || '',
      purchaseRetailerOther: wine.purchaseRetailerOther || '',
      addedAt: new Date().toISOString(),
    }
    applyUpdate(prev => ({ ...prev, bottles: [entry, ...prev.bottles] }))
    return entry
  }, [applyUpdate])

  // Remove a bottle from cellar
  const removeBottle = useCallback((id) => {
    applyUpdate(prev => ({ ...prev, bottles: prev.bottles.filter(b => b.id !== id) }))
  }, [applyUpdate])

  // Update a bottle's details
  const updateBottle = useCallback((id, updates) => {
    applyUpdate(prev => ({
      ...prev,
      bottles: prev.bottles.map(b => b.id === id ? { ...b, ...updates } : b),
    }))
  }, [applyUpdate])

  // Mark a bottle as tasted (move from bottles → tasted)
  const markTasted = useCallback((bottleId, tastingNote) => {
    applyUpdate(prev => {
      const bottle = prev.bottles.find(b => b.id === bottleId)
      if (!bottle) return prev
      const tastedEntry = {
        ...bottle,
        tastedAt: new Date().toISOString(),
        rating: tastingNote?.rating || null,
        tastingNote: tastingNote?.note || '',
        score: tastingNote?.score || null,
      }
      return {
        ...prev,
        bottles: prev.bottles.filter(b => b.id !== bottleId),
        tasted: [tastedEntry, ...prev.tasted],
      }
    })
  }, [applyUpdate])

  // Add to wishlist
  const addToWishlist = useCallback((wine) => {
    const entry = {
      id: `wish-${Date.now()}`,
      wineId: wine.wineId || null,
      name: wine.name,
      producer: wine.producer || '',
      vintage: wine.vintage || '',
      region: wine.region || '',
      notes: wine.notes || '',
      addedAt: new Date().toISOString(),
    }
    applyUpdate(prev => ({ ...prev, wishlist: [entry, ...prev.wishlist] }))
    return entry
  }, [applyUpdate])

  // Remove from wishlist
  const removeFromWishlist = useCallback((id) => {
    applyUpdate(prev => ({ ...prev, wishlist: prev.wishlist.filter(w => w.id !== id) }))
  }, [applyUpdate])

  const importTastedEntries = useCallback((entries) => {
    const safeEntries = Array.isArray(entries) ? entries : []
    if (safeEntries.length === 0) return { added: 0, skipped: 0, total: 0 }

    let result = { added: 0, skipped: 0, total: safeEntries.length }

    applyUpdate(prev => {
      const existingIds = new Set(prev.tasted.map(item => item.id).filter(Boolean))
      const existingSignatures = new Set(prev.tasted.map(tastingSignature).filter(Boolean))

      const toAdd = []
      safeEntries.forEach(entry => {
        const signature = tastingSignature(entry)
        const duplicate = (entry.id && existingIds.has(entry.id)) || (signature && existingSignatures.has(signature))
        if (duplicate) return
        toAdd.push(entry)
        if (entry.id) existingIds.add(entry.id)
        if (signature) existingSignatures.add(signature)
      })

      result = {
        added: toAdd.length,
        skipped: safeEntries.length - toAdd.length,
        total: safeEntries.length,
      }

      if (toAdd.length === 0) return prev
      return {
        ...prev,
        tasted: [...toAdd, ...prev.tasted],
      }
    })

    return result
  }, [applyUpdate])

  const importCellarData = useCallback((incomingCellar, mode = 'merge') => {
    const incoming = normalizeCellarShape(incomingCellar)
    let result = {
      mode,
      added: { bottles: 0, wishlist: 0, tasted: 0 },
      skipped: { bottles: 0, wishlist: 0, tasted: 0 },
      totals: { bottles: 0, wishlist: 0, tasted: 0 },
    }

    applyUpdate(prev => {
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
        return incoming
      }

      const existingBottleIds = new Set(prev.bottles.map(item => item.id).filter(Boolean))
      const existingBottleSignatures = new Set(prev.bottles.map(bottleSignature).filter(Boolean))
      const existingWishlistIds = new Set(prev.wishlist.map(item => item.id).filter(Boolean))
      const existingWishlistSignatures = new Set(prev.wishlist.map(wishlistSignature).filter(Boolean))
      const existingTastedIds = new Set(prev.tasted.map(item => item.id).filter(Boolean))
      const existingTastedSignatures = new Set(prev.tasted.map(tastingSignature).filter(Boolean))

      const bottlesToAdd = []
      incoming.bottles.forEach(entry => {
        const signature = bottleSignature(entry)
        const duplicate = (entry.id && existingBottleIds.has(entry.id)) || (signature && existingBottleSignatures.has(signature))
        if (duplicate) return
        bottlesToAdd.push(entry)
        if (entry.id) existingBottleIds.add(entry.id)
        if (signature) existingBottleSignatures.add(signature)
      })

      const wishlistToAdd = []
      incoming.wishlist.forEach(entry => {
        const signature = wishlistSignature(entry)
        const duplicate = (entry.id && existingWishlistIds.has(entry.id)) || (signature && existingWishlistSignatures.has(signature))
        if (duplicate) return
        wishlistToAdd.push(entry)
        if (entry.id) existingWishlistIds.add(entry.id)
        if (signature) existingWishlistSignatures.add(signature)
      })

      const tastedToAdd = []
      incoming.tasted.forEach(entry => {
        const signature = tastingSignature(entry)
        const duplicate = (entry.id && existingTastedIds.has(entry.id)) || (signature && existingTastedSignatures.has(signature))
        if (duplicate) return
        tastedToAdd.push(entry)
        if (entry.id) existingTastedIds.add(entry.id)
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
          bottles: prev.bottles.length + bottlesToAdd.length,
          wishlist: prev.wishlist.length + wishlistToAdd.length,
          tasted: prev.tasted.length + tastedToAdd.length,
        },
      }

      if (bottlesToAdd.length === 0 && wishlistToAdd.length === 0 && tastedToAdd.length === 0) {
        return prev
      }

      return {
        ...prev,
        bottles: [...bottlesToAdd, ...prev.bottles],
        wishlist: [...wishlistToAdd, ...prev.wishlist],
        tasted: [...tastedToAdd, ...prev.tasted],
      }
    })

    return result
  }, [applyUpdate])

  // Check if a wine is in cellar / wishlist
  const isInCellar = useCallback((wineId) =>
    cellar.bottles.some(b => b.wineId === wineId), [cellar.bottles])

  const isInWishlist = useCallback((wineId) =>
    cellar.wishlist.some(w => w.wineId === wineId), [cellar.wishlist])

  // Stats
  const stats = {
    totalBottles: cellar.bottles.reduce((sum, b) => sum + (b.quantity || 1), 0),
    totalWines: cellar.bottles.length,
    wishlistCount: cellar.wishlist.length,
    tastedCount: cellar.tasted.length,
    byCategory: cellar.bottles.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + (b.quantity || 1)
      return acc
    }, {}),
  }

  return {
    cellar,
    bottles: cellar.bottles,
    wishlist: cellar.wishlist,
    tasted: cellar.tasted,
    cellarRevision,
    stats,
    addBottle,
    removeBottle,
    updateBottle,
    markTasted,
    addToWishlist,
    removeFromWishlist,
    importTastedEntries,
    importCellarData,
    isInCellar,
    isInWishlist,
  }
}
