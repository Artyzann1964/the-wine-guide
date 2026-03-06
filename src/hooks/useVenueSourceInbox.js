import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'wine-guide-venue-source-inbox'

function readInbox() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useVenueSourceInbox() {
  const [sources, setSources] = useState(readInbox)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sources))
    } catch {
      // ignore storage failures
    }
  }, [sources])

  const addSource = useCallback((source) => {
    const name = String(source.venueName || '').trim()
    const town = String(source.town || '').trim()
    const url = String(source.sourceUrl || '').trim()
    if (!name || !url) return { ok: false, reason: 'missing_fields' }

    const normalized = {
      id: `source-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      venueName: name,
      town,
      sourceUrl: url,
      notes: String(source.notes || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    setSources(prev => [normalized, ...prev])
    return { ok: true, item: normalized }
  }, [])

  const removeSource = useCallback((id) => {
    setSources(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearSources = useCallback(() => {
    setSources([])
  }, [])

  const markProcessed = useCallback((id) => {
    setSources(prev => prev.map(item => (
      item.id === id ? { ...item, status: 'processed', processedAt: new Date().toISOString() } : item
    )))
  }, [])

  return {
    sources,
    addSource,
    removeSource,
    clearSources,
    markProcessed,
  }
}

