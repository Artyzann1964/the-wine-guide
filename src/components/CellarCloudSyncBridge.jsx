import { useCallback, useEffect, useRef, useState } from 'react'
import { useCellar } from '../hooks/useCellar'
import {
  CLOUD_SYNC_AUTH_TOKEN_KEY,
  CLOUD_SYNC_DEVICE_ID_KEY,
  CLOUD_SYNC_EVENT,
  CLOUD_SYNC_ID_KEY,
  CLOUD_SYNC_OWNER_EMAIL_KEY,
  CLOUD_SYNC_PASSPHRASE_KEY,
  CLOUD_SYNC_USER_ID_KEY,
  normalizeCloudSyncId,
  normalizeCloudSyncOwnerEmail,
  normalizeCloudSyncPassphrase,
} from '../utils/cellarSync'

const POLL_INTERVAL_MS = 20000

function readCloudSyncId() {
  if (typeof window === 'undefined') return ''
  return normalizeCloudSyncId(localStorage.getItem(CLOUD_SYNC_ID_KEY))
}

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { authToken: '', userId: '', deviceId: '', passphrase: '', ownerEmail: '' }
  }

  return {
    authToken: String(localStorage.getItem(CLOUD_SYNC_AUTH_TOKEN_KEY) || '').trim(),
    userId: String(localStorage.getItem(CLOUD_SYNC_USER_ID_KEY) || '').trim(),
    deviceId: String(localStorage.getItem(CLOUD_SYNC_DEVICE_ID_KEY) || '').trim(),
    passphrase: normalizeCloudSyncPassphrase(localStorage.getItem(CLOUD_SYNC_PASSPHRASE_KEY)),
    ownerEmail: normalizeCloudSyncOwnerEmail(localStorage.getItem(CLOUD_SYNC_OWNER_EMAIL_KEY)),
  }
}

function persistStoredAuth({ authToken = '', userId = '', deviceId = '' }) {
  if (typeof window === 'undefined') return

  if (authToken) localStorage.setItem(CLOUD_SYNC_AUTH_TOKEN_KEY, authToken)
  else localStorage.removeItem(CLOUD_SYNC_AUTH_TOKEN_KEY)

  if (userId) localStorage.setItem(CLOUD_SYNC_USER_ID_KEY, userId)
  else localStorage.removeItem(CLOUD_SYNC_USER_ID_KEY)

  if (deviceId) localStorage.setItem(CLOUD_SYNC_DEVICE_ID_KEY, deviceId)
  else localStorage.removeItem(CLOUD_SYNC_DEVICE_ID_KEY)
}

function normalizeRemoteItemSet(value) {
  const data = value && typeof value === 'object' ? value : {}
  return {
    items: Array.isArray(data.items) ? data.items : [],
  }
}

async function createSyncSession(syncId, deviceId, passphrase, ownerEmail) {
  const response = await fetch(`/api/cellar-sync-session/${encodeURIComponent(syncId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(deviceId ? { deviceId } : {}),
      ...(passphrase ? { passphrase } : {}),
      ...(ownerEmail ? { ownerEmail } : {}),
    }),
  })
  if (response.status === 400) {
    const payload = await response.json().catch(() => ({}))
    if (payload?.error === 'missing_owner_email' || payload?.error === 'invalid_owner_email') {
      throw new Error('sync-owner-email-required')
    }
    throw new Error('sync-passphrase-required')
  }
  if (response.status === 403) throw new Error('sync-passphrase-invalid')
  if (!response.ok) throw new Error('sync-session-failed')
  return response.json()
}

async function fetchRemoteItems(syncId, authToken) {
  const response = await fetch(`/api/cellar-items/${encodeURIComponent(syncId)}`, {
    cache: 'no-store',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  })
  if (response.status === 404) return null
  if (response.status === 401) throw new Error('sync-unauthorized')
  if (!response.ok) throw new Error('sync-fetch-failed')
  const payload = await response.json()
  return {
    updatedAt: String(payload?.updatedAt || ''),
    items: normalizeRemoteItemSet(payload).items,
  }
}

async function pushRemoteItems(syncId, authToken, items) {
  const response = await fetch(`/api/cellar-items/${encodeURIComponent(syncId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ items }),
  })
  if (response.status === 401) throw new Error('sync-unauthorized')
  if (!response.ok) throw new Error('sync-push-failed')
}

export default function CellarCloudSyncBridge() {
  const { items, cellarRevision, importCellarData } = useCellar()
  const [syncId, setSyncId] = useState(readCloudSyncId)
  const [syncReady, setSyncReady] = useState(false)
  const sessionPromiseRef = useRef(null)
  const pushInFlightRef = useRef(false)
  const lastPushedRevisionRef = useRef(0)
  const lastPulledAtRef = useRef('')

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

  const ensureSession = useCallback(async (forceRefresh = false) => {
    if (!syncId) return null

    const stored = readStoredAuth()
    if (!stored.passphrase) return null

    if (!forceRefresh) {
      if (stored.authToken) return stored
    }

    if (!forceRefresh && sessionPromiseRef.current) return sessionPromiseRef.current

    const bootstrap = createSyncSession(syncId, stored.deviceId, stored.passphrase, stored.ownerEmail)
      .then(payload => {
        const nextSession = {
          authToken: String(payload?.authToken || '').trim(),
          userId: String(payload?.userId || '').trim(),
          deviceId: String(payload?.deviceId || '').trim(),
          passphrase: stored.passphrase,
          ownerEmail: normalizeCloudSyncOwnerEmail(payload?.ownerEmail || stored.ownerEmail),
        }
        persistStoredAuth(nextSession)
        return nextSession
      })
      .finally(() => {
        sessionPromiseRef.current = null
      })

    sessionPromiseRef.current = bootstrap
    return bootstrap
  }, [syncId])

  const pullRemote = useCallback(async () => {
    if (!syncId) return
    try {
      const session = await ensureSession()
      if (!session?.authToken) return
      const remote = await fetchRemoteItems(syncId, session.authToken)
      if (!remote) return
      if (remote.updatedAt && remote.updatedAt === lastPulledAtRef.current) return
      importCellarData({ items: remote.items }, 'merge')
      lastPulledAtRef.current = remote.updatedAt || ''
    } catch (error) {
      if (error instanceof Error && error.message === 'sync-unauthorized') {
        persistStoredAuth({})
        const session = await ensureSession(true).catch(() => null)
        if (!session?.authToken) return
        const remote = await fetchRemoteItems(syncId, session.authToken).catch(() => null)
        if (!remote) return
        importCellarData({ items: remote.items }, 'merge')
        lastPulledAtRef.current = remote.updatedAt || ''
      }
    }
  }, [syncId, ensureSession, importCellarData])

  useEffect(() => {
    lastPushedRevisionRef.current = 0
    lastPulledAtRef.current = ''
    sessionPromiseRef.current = null
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
        let session = await ensureSession()
        if (!session?.authToken) return
        try {
          await pushRemoteItems(syncId, session.authToken, items)
        } catch (error) {
          if (!(error instanceof Error) || error.message !== 'sync-unauthorized') throw error
          persistStoredAuth({})
          session = await ensureSession(true)
          if (!session?.authToken) return
          await pushRemoteItems(syncId, session.authToken, items)
        }
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
      pushInFlightRef.current = false
    }
  }, [syncId, syncReady, items, cellarRevision, ensureSession])

  return null
}
