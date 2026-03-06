import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'wine-guide-explorer-queue'

function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildMatchKey(candidate) {
  return `${candidate.venueId || 'venue'}::${String(candidate.name || '').toLowerCase().trim()}`
}

export function useExplorerQueue() {
  const [queue, setQueue] = useState(readQueue)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
    } catch {
      // ignore storage failures
    }
  }, [queue])

  const addCandidate = useCallback((candidate) => {
    const normalized = {
      id: candidate.id || `candidate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: candidate.name || 'Unnamed wine',
      venueId: candidate.venueId || '',
      venueName: candidate.venueName || '',
      category: candidate.category || 'wine',
      country: candidate.country || '',
      price: typeof candidate.price === 'number' ? candidate.price : null,
      review: candidate.review || '',
      stars: typeof candidate.stars === 'number' ? candidate.stars : null,
      sourceUrl: candidate.sourceUrl || '',
      libraryWineId: candidate.libraryWineId || '',
      createdAt: candidate.createdAt || new Date().toISOString(),
    }
    normalized.matchKey = buildMatchKey(normalized)

    let result = { added: false, item: null, reason: 'unknown' }
    setQueue(prev => {
      const existing = prev.find(item => item.matchKey === normalized.matchKey)
      if (existing) {
        result = { added: false, item: existing, reason: 'duplicate' }
        return prev
      }
      const next = [normalized, ...prev]
      result = { added: true, item: normalized, reason: 'added' }
      return next
    })
    return result
  }, [])

  const removeCandidate = useCallback((id) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  const markLinked = useCallback((id, libraryWineId) => {
    const nextId = String(libraryWineId || '').trim()
    if (!nextId) return
    setQueue(prev => prev.map(item => (
      item.id === id ? { ...item, libraryWineId: nextId } : item
    )))
  }, [])

  const queuedKeys = useMemo(() => new Set(queue.map(item => item.matchKey)), [queue])

  return {
    queue,
    queuedKeys,
    addCandidate,
    removeCandidate,
    clearQueue,
    markLinked,
  }
}

export function buildExplorerCandidateFromVenue(venue, item, sourceUrl = '') {
  return {
    name: item?.name || '',
    venueId: venue?.id || '',
    venueName: venue?.name || '',
    category: item?.category || 'wine',
    country: item?.country || '',
    price: typeof item?.price === 'number' ? item.price : null,
    review: item?.review || '',
    stars: typeof item?.stars === 'number' ? item.stars : null,
    sourceUrl,
    libraryWineId: item?.libraryWineId || '',
  }
}

