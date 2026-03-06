import { useCallback, useEffect, useRef, useState } from 'react'
import { useCellar } from '../hooks/useCellar'
import { CLOUD_SYNC_EVENT, CLOUD_SYNC_ID_KEY, normalizeCloudSyncId } from '../utils/cellarSync'

const POLL_INTERVAL_MS = 20000

function readCloudSyncId() {
  if (typeof window === 'undefined') return ''
  return normalizeCloudSyncId(localStorage.getItem(CLOUD_SYNC_ID_KEY))
}

function normalizeRemoteCellar(value) {
  const data = value && typeof value === 'object' ? value : {}
  return {
    bottles: Array.isArray(data.bottles) ? data.bottles : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
    tasted: Array.isArray(data.tasted) ? data.tasted : [],
  }
}

async function fetchRemoteCellar(syncId) {
  const response = await fetch(`/api/cellar-sync/${encodeURIComponent(syncId)}`, { cache: 'no-store' })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('sync-fetch-failed')
  const payload = await response.json()
  return {
    revision: Number(payload?.revision) || 0,
    cellar: normalizeRemoteCellar(payload?.cellar),
  }
}

async function pushRemoteCellar(syncId, cellar, revision) {
  const response = await fetch(`/api/cellar-sync/${encodeURIComponent(syncId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revision, cellar }),
  })
  if (!response.ok) throw new Error('sync-push-failed')
}

export default function CellarCloudSyncBridge() {
  const { cellar, cellarRevision, importCellarData } = useCellar()
  const [syncId, setSyncId] = useState(readCloudSyncId)
  const [syncReady, setSyncReady] = useState(false)
  const pushInFlightRef = useRef(false)
  const lastPushedRevisionRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const refreshSyncId = () => {
      setSyncId(readCloudSyncId())
    }

    const onStorage = (event) => {
      if (event.key !== CLOUD_SYNC_ID_KEY) return
      refreshSyncId()
    }

    window.addEventListener(CLOUD_SYNC_EVENT, refreshSyncId)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener(CLOUD_SYNC_EVENT, refreshSyncId)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const pullRemote = useCallback(async () => {
    if (!syncId) return
    try {
      const remote = await fetchRemoteCellar(syncId)
      if (!remote) return
      if (remote.revision <= cellarRevision) return
      importCellarData(remote.cellar, 'replace')
    } catch {
      // Keep local data on transient network/API failures.
    }
  }, [syncId, cellarRevision, importCellarData])

  useEffect(() => {
    lastPushedRevisionRef.current = 0
    setSyncReady(false)
    if (!syncId) return undefined

    let cancelled = false
    const boot = async () => {
      await pullRemote()
      if (!cancelled) setSyncReady(true)
    }
    boot()

    const intervalId = setInterval(() => {
      pullRemote()
    }, POLL_INTERVAL_MS)

    const onFocus = () => pullRemote()
    const onVisible = () => {
      if (!document.hidden) pullRemote()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(intervalId)
    }
  }, [syncId, pullRemote])

  useEffect(() => {
    if (!syncId || !syncReady) return
    if (!cellarRevision) return
    if (cellarRevision <= lastPushedRevisionRef.current) return
    if (pushInFlightRef.current) return

    let cancelled = false
    pushInFlightRef.current = true

    const run = async () => {
      try {
        await pushRemoteCellar(syncId, cellar, cellarRevision)
        if (!cancelled) lastPushedRevisionRef.current = cellarRevision
      } catch {
        // Retry on next local change or poll cycle.
      } finally {
        if (!cancelled) pushInFlightRef.current = false
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [syncId, syncReady, cellar, cellarRevision])

  return null
}
