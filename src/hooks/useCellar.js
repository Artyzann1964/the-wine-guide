import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wine-guide-cellar'
const BACKUP_KEY = 'wine-guide-cellar-backup'

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

export function useCellar() {
  const [cellar, setCellar] = useState(readStoredCellar)

  useEffect(() => {
    const payload = JSON.stringify(cellar)
    try {
      localStorage.setItem(STORAGE_KEY, payload)
      localStorage.setItem(BACKUP_KEY, payload)
    } catch {
      // storage full or unavailable
    }
  }, [cellar])

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
    setCellar(prev => ({ ...prev, bottles: [entry, ...prev.bottles] }))
    return entry
  }, [])

  // Remove a bottle from cellar
  const removeBottle = useCallback((id) => {
    setCellar(prev => ({ ...prev, bottles: prev.bottles.filter(b => b.id !== id) }))
  }, [])

  // Update a bottle's details
  const updateBottle = useCallback((id, updates) => {
    setCellar(prev => ({
      ...prev,
      bottles: prev.bottles.map(b => b.id === id ? { ...b, ...updates } : b),
    }))
  }, [])

  // Mark a bottle as tasted (move from bottles → tasted)
  const markTasted = useCallback((bottleId, tastingNote) => {
    setCellar(prev => {
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
  }, [])

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
    setCellar(prev => ({ ...prev, wishlist: [entry, ...prev.wishlist] }))
    return entry
  }, [])

  // Remove from wishlist
  const removeFromWishlist = useCallback((id) => {
    setCellar(prev => ({ ...prev, wishlist: prev.wishlist.filter(w => w.id !== id) }))
  }, [])

  const importTastedEntries = useCallback((entries) => {
    const safeEntries = Array.isArray(entries) ? entries : []
    if (safeEntries.length === 0) return { added: 0, skipped: 0, total: 0 }

    let result = { added: 0, skipped: 0, total: safeEntries.length }

    setCellar(prev => {
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
  }, [])

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
    stats,
    addBottle,
    removeBottle,
    updateBottle,
    markTasted,
    addToWishlist,
    removeFromWishlist,
    importTastedEntries,
    isInCellar,
    isInWishlist,
  }
}
