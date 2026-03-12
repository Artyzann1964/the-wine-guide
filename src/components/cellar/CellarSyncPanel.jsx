import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildCellarSyncPayload,
  CLOUD_SYNC_AUTH_TOKEN_KEY,
  CLOUD_SYNC_DEVICE_ID_KEY,
  CLOUD_SYNC_EVENT,
  CLOUD_SYNC_ID_KEY,
  CLOUD_SYNC_OWNER_EMAIL_KEY,
  CLOUD_SYNC_OWNER_TOKEN_KEY,
  CLOUD_SYNC_PASSPHRASE_KEY,
  CLOUD_SYNC_RECOVERY_KEY,
  CLOUD_SYNC_USER_ID_KEY,
  decodeCellarSyncPayload,
  encodeCellarSyncPayload,
  generateCloudSyncId,
  normalizeCloudSyncId,
  normalizeCloudSyncOwnerEmail,
  normalizeCloudSyncPassphrase,
} from '../../utils/cellarSync'

export default function CellarSyncPanel({ bottles, wishlist, tasted, importCellarData, syncSeed, onSyncSeedConsumed }) {
  const syncMenuRef = useRef(null)
  const [showSyncPanel, setShowSyncPanel] = useState(false)
  const [showManualTools, setShowManualTools] = useState(false)
  const [showSyncMenu, setShowSyncMenu] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showRecoveryTools, setShowRecoveryTools] = useState(false)
  const [syncInput, setSyncInput] = useState('')
  const [syncStatus, setSyncStatus] = useState({ tone: '', message: '' })
  const [cloudSyncId, setCloudSyncId] = useState('')
  const [cloudSyncInput, setCloudSyncInput] = useState('')
  const [cloudSyncPassphrase, setCloudSyncPassphrase] = useState('')
  const [cloudSyncOwnerEmail, setCloudSyncOwnerEmail] = useState('')
  const [cloudSyncRecoveryKey, setCloudSyncRecoveryKey] = useState('')
  const [recoveryKeyInput, setRecoveryKeyInput] = useState('')
  const [linkedDevices, setLinkedDevices] = useState([])
  const [loadingLinkedDevices, setLoadingLinkedDevices] = useState(false)
  const [revokingDeviceId, setRevokingDeviceId] = useState('')
  const [magicEmail, setMagicEmail] = useState('')
  const [magicSyncId, setMagicSyncId] = useState('')
  const [magicCode, setMagicCode] = useState('')
  const [magicStep, setMagicStep] = useState('email')
  const [magicLoading, setMagicLoading] = useState(false)

  useEffect(() => {
    if (!syncSeed) return
    setSyncInput(syncSeed)
    setShowSyncPanel(true)
    setShowManualTools(true)
    setShowImport(true)
    setSyncStatus({ tone: 'info', message: 'Sync code detected in this link. Tap Merge on this device to import it.' })
    onSyncSeedConsumed?.()
  }, [syncSeed, onSyncSeedConsumed])

  useEffect(() => {
    try {
      const existing = normalizeCloudSyncId(localStorage.getItem(CLOUD_SYNC_ID_KEY))
      const existingPassphrase = normalizeCloudSyncPassphrase(localStorage.getItem(CLOUD_SYNC_PASSPHRASE_KEY))
      const existingOwnerEmail = normalizeCloudSyncOwnerEmail(localStorage.getItem(CLOUD_SYNC_OWNER_EMAIL_KEY))
      const existingRecoveryKey = String(localStorage.getItem(CLOUD_SYNC_RECOVERY_KEY) || '').trim()
      setCloudSyncId(existing)
      setCloudSyncInput(existing)
      setCloudSyncPassphrase(existingPassphrase)
      setCloudSyncOwnerEmail(existingOwnerEmail)
      setCloudSyncRecoveryKey(existingRecoveryKey)
    } catch {
      setCloudSyncId('')
      setCloudSyncInput('')
      setCloudSyncPassphrase('')
      setCloudSyncOwnerEmail('')
      setCloudSyncRecoveryKey('')
    }
  }, [])

  useEffect(() => {
    if (!showSyncMenu) return undefined

    function handlePointerDown(event) {
      if (!syncMenuRef.current?.contains(event.target)) {
        setShowSyncMenu(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setShowSyncMenu(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showSyncMenu])

  async function bootstrapCloudSync(syncId, passphrase, ownerEmail = '') {
    const response = await fetch(`/api/cellar-sync-session/${encodeURIComponent(syncId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passphrase,
        ...(ownerEmail ? { ownerEmail } : {}),
      }),
    })

    if (response.status === 400) {
      const payload = await response.json().catch(() => ({}))
      if (payload?.error === 'missing_owner_email') throw new Error('missing_owner_email')
      if (payload?.error === 'invalid_owner_email') throw new Error('invalid_owner_email')
      if (payload?.error === 'missing_passphrase') throw new Error('missing_passphrase')
    }

    if (response.status === 403) {
      const payload = await response.json().catch(() => ({}))
      if (payload?.error === 'invalid_passphrase') throw new Error('invalid_passphrase')
    }

    if (!response.ok) throw new Error('sync_bootstrap_failed')
    return response.json()
  }

  async function rotateCloudSyncCredentials(syncId, payload) {
    const response = await fetch(`/api/cellar-sync-owner/${encodeURIComponent(syncId)}/rotate-passphrase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.status === 400) {
      const parsed = await response.json().catch(() => ({}))
      if (parsed?.error === 'missing_new_passphrase') throw new Error('missing_new_passphrase')
      if (parsed?.error === 'invalid_owner_email') throw new Error('invalid_owner_email')
      if (parsed?.error === 'missing_auth_proof') throw new Error('missing_auth_proof')
    }

    if (response.status === 403) {
      const parsed = await response.json().catch(() => ({}))
      if (parsed?.error === 'invalid_passphrase') throw new Error('invalid_passphrase')
      if (parsed?.error === 'invalid_recovery_key') throw new Error('invalid_recovery_key')
    }

    if (!response.ok) throw new Error('sync_rotate_failed')
    return response.json()
  }

  async function createOwnerSession(syncId, payload) {
    const response = await fetch(`/api/cellar-sync-owner/${encodeURIComponent(syncId)}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.status === 400) {
      const parsed = await response.json().catch(() => ({}))
      if (parsed?.error === 'missing_owner_email') throw new Error('missing_owner_email')
      if (parsed?.error === 'missing_auth_proof') throw new Error('missing_auth_proof')
    }

    if (response.status === 403) {
      const parsed = await response.json().catch(() => ({}))
      if (parsed?.error === 'invalid_owner_email') throw new Error('invalid_owner_email')
      if (parsed?.error === 'invalid_passphrase') throw new Error('invalid_passphrase')
      if (parsed?.error === 'invalid_recovery_key') throw new Error('invalid_recovery_key')
    }

    if (!response.ok) throw new Error('owner_session_failed')
    return response.json()
  }

  async function fetchLinkedDevices(syncId, ownerToken) {
    const response = await fetch(`/api/cellar-sync-owner/${encodeURIComponent(syncId)}/devices`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    })
    if (response.status === 401) throw new Error('owner_unauthorized')
    if (!response.ok) throw new Error('owner_devices_failed')
    return response.json()
  }

  async function revokeLinkedDevice(syncId, ownerToken, deviceId) {
    const response = await fetch(`/api/cellar-sync-owner/${encodeURIComponent(syncId)}/devices/${encodeURIComponent(deviceId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    })
    if (response.status === 401) throw new Error('owner_unauthorized')
    if (!response.ok) throw new Error('owner_device_revoke_failed')
    return response.json()
  }

  const syncCode = useMemo(() => {
    const payload = buildCellarSyncPayload({ bottles, wishlist, tasted })
    return encodeCellarSyncPayload(payload)
  }, [bottles, wishlist, tasted])

  const syncLink = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const safe = encodeURIComponent(syncCode)
    return `${window.location.origin}${window.location.pathname}#/cellar?cs=${safe}`
  }, [syncCode])
  const hasCloudSync = Boolean(cloudSyncId)
  const currentCloudCode = cloudSyncId || normalizeCloudSyncId(cloudSyncInput)

  function applyCloudSyncId(nextId) {
    const normalized = normalizeCloudSyncId(nextId)
    const normalizedPassphrase = normalizeCloudSyncPassphrase(cloudSyncPassphrase)
    const normalizedOwnerEmail = normalizeCloudSyncOwnerEmail(cloudSyncOwnerEmail)
    try {
      const current = normalizeCloudSyncId(localStorage.getItem(CLOUD_SYNC_ID_KEY))
      const currentPassphrase = normalizeCloudSyncPassphrase(localStorage.getItem(CLOUD_SYNC_PASSPHRASE_KEY))
      const currentOwnerEmail = normalizeCloudSyncOwnerEmail(localStorage.getItem(CLOUD_SYNC_OWNER_EMAIL_KEY))
      if (normalized) localStorage.setItem(CLOUD_SYNC_ID_KEY, normalized)
      else {
        localStorage.removeItem(CLOUD_SYNC_ID_KEY)
      }

      if (normalizedPassphrase) localStorage.setItem(CLOUD_SYNC_PASSPHRASE_KEY, normalizedPassphrase)
      else localStorage.removeItem(CLOUD_SYNC_PASSPHRASE_KEY)

      if (normalizedOwnerEmail) localStorage.setItem(CLOUD_SYNC_OWNER_EMAIL_KEY, normalizedOwnerEmail)
      else localStorage.removeItem(CLOUD_SYNC_OWNER_EMAIL_KEY)

      if (current !== normalized || currentPassphrase !== normalizedPassphrase || currentOwnerEmail !== normalizedOwnerEmail) {
        localStorage.removeItem(CLOUD_SYNC_AUTH_TOKEN_KEY)
        localStorage.removeItem(CLOUD_SYNC_USER_ID_KEY)
        localStorage.removeItem(CLOUD_SYNC_DEVICE_ID_KEY)
        localStorage.removeItem(CLOUD_SYNC_OWNER_TOKEN_KEY)
      }
    } catch {
      // Ignore storage write failures.
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(CLOUD_SYNC_EVENT))
    }
    setCloudSyncId(normalized)
    setCloudSyncInput(normalized)
  }

  async function connectCloudSync() {
    const normalized = normalizeCloudSyncId(cloudSyncInput)
    const normalizedPassphrase = normalizeCloudSyncPassphrase(cloudSyncPassphrase)
    if (!normalized) {
      setSyncStatus({ tone: 'error', message: 'Enter a valid cloud sync code (letters, numbers, - or _).' })
      return
    }
    if (!normalizedPassphrase) {
      setSyncStatus({ tone: 'error', message: 'Enter a sync passphrase with at least 6 characters.' })
      return
    }
    try {
      const session = await bootstrapCloudSync(normalized, normalizedPassphrase, cloudSyncOwnerEmail)
      applyCloudSyncId(normalized)
      if (session?.authToken) localStorage.setItem(CLOUD_SYNC_AUTH_TOKEN_KEY, session.authToken)
      if (session?.userId) localStorage.setItem(CLOUD_SYNC_USER_ID_KEY, session.userId)
      if (session?.deviceId) localStorage.setItem(CLOUD_SYNC_DEVICE_ID_KEY, session.deviceId)
      if (session?.ownerEmail) {
        localStorage.setItem(CLOUD_SYNC_OWNER_EMAIL_KEY, session.ownerEmail)
        setCloudSyncOwnerEmail(session.ownerEmail)
      }
      if (session?.recoveryKey) {
        localStorage.setItem(CLOUD_SYNC_RECOVERY_KEY, session.recoveryKey)
        setCloudSyncRecoveryKey(session.recoveryKey)
        setRecoveryKeyInput(session.recoveryKey)
      }
      if (typeof window !== 'undefined') window.dispatchEvent(new Event(CLOUD_SYNC_EVENT))
      setSyncStatus({
        tone: 'success',
        message: session?.recoveryKey
          ? 'Automatic sync enabled. Save the recovery key below before you leave this screen.'
          : 'Automatic sync enabled on this device. Use the same code and passphrase on your other device.',
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'missing_owner_email') {
        setSyncStatus({ tone: 'error', message: 'Enter an owner email before creating a new cloud sync space.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_owner_email') {
        setSyncStatus({ tone: 'error', message: 'Enter a valid owner email address.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_passphrase') {
        setSyncStatus({ tone: 'error', message: 'That passphrase does not match this cloud sync space.' })
        return
      }
      setSyncStatus({ tone: 'error', message: 'Could not enable automatic sync right now. Try again in a few seconds.' })
    }
  }

  async function generateCloudSync() {
    const normalizedPassphrase = normalizeCloudSyncPassphrase(cloudSyncPassphrase)
    const normalizedOwnerEmail = normalizeCloudSyncOwnerEmail(cloudSyncOwnerEmail)
    if (!normalizedPassphrase) {
      setSyncStatus({ tone: 'error', message: 'Choose a sync passphrase with at least 6 characters before generating a new cloud code.' })
      return
    }
    if (!normalizedOwnerEmail) {
      setSyncStatus({ tone: 'error', message: 'Enter an owner email before generating a new cloud sync code.' })
      return
    }
    const generated = generateCloudSyncId()
    setCloudSyncInput(generated)
    try {
      const session = await bootstrapCloudSync(generated, normalizedPassphrase, normalizedOwnerEmail)
      applyCloudSyncId(generated)
      if (session?.authToken) localStorage.setItem(CLOUD_SYNC_AUTH_TOKEN_KEY, session.authToken)
      if (session?.userId) localStorage.setItem(CLOUD_SYNC_USER_ID_KEY, session.userId)
      if (session?.deviceId) localStorage.setItem(CLOUD_SYNC_DEVICE_ID_KEY, session.deviceId)
      if (session?.ownerEmail) localStorage.setItem(CLOUD_SYNC_OWNER_EMAIL_KEY, session.ownerEmail)
      if (session?.recoveryKey) {
        localStorage.setItem(CLOUD_SYNC_RECOVERY_KEY, session.recoveryKey)
        setCloudSyncRecoveryKey(session.recoveryKey)
        setRecoveryKeyInput(session.recoveryKey)
      }
      if (typeof window !== 'undefined') window.dispatchEvent(new Event(CLOUD_SYNC_EVENT))
      setSyncStatus({ tone: 'success', message: 'New automatic sync code created. Save the recovery key below and keep the passphrase safe.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Could not create a new cloud sync space right now. Try again in a few seconds.' })
    }
  }

  function disableCloudSync() {
    try {
      localStorage.removeItem(CLOUD_SYNC_ID_KEY)
      localStorage.removeItem(CLOUD_SYNC_PASSPHRASE_KEY)
      localStorage.removeItem(CLOUD_SYNC_OWNER_EMAIL_KEY)
      localStorage.removeItem(CLOUD_SYNC_RECOVERY_KEY)
      localStorage.removeItem(CLOUD_SYNC_OWNER_TOKEN_KEY)
      localStorage.removeItem(CLOUD_SYNC_AUTH_TOKEN_KEY)
      localStorage.removeItem(CLOUD_SYNC_USER_ID_KEY)
      localStorage.removeItem(CLOUD_SYNC_DEVICE_ID_KEY)
    } catch {
      // Ignore storage write failures.
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(CLOUD_SYNC_EVENT))
    }
    setCloudSyncId('')
    setCloudSyncInput('')
    setCloudSyncPassphrase('')
    setCloudSyncOwnerEmail('')
    setCloudSyncRecoveryKey('')
    setRecoveryKeyInput('')
    setLinkedDevices([])
    setSyncStatus({ tone: 'info', message: 'Automatic cloud sync disabled on this device.' })
  }

  async function copySyncCode() {
    try {
      await navigator.clipboard.writeText(syncCode)
      setSyncStatus({ tone: 'success', message: 'Sync code copied. Paste it on your other device and import.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Clipboard was blocked. Copy the code manually from the box below.' })
    }
  }

  async function copySyncLink() {
    try {
      await navigator.clipboard.writeText(syncLink)
      setSyncStatus({ tone: 'success', message: 'Sync link copied. Open it on your other device to import quickly.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Clipboard was blocked. Copy the link manually from the box below.' })
    }
  }

  async function copyCloudSyncCode() {
    const code = cloudSyncId || normalizeCloudSyncId(cloudSyncInput)
    if (!code) {
      setSyncStatus({ tone: 'error', message: 'No cloud sync code to copy yet. Generate one first.' })
      return
    }
    try {
      await navigator.clipboard.writeText(code)
      setSyncStatus({ tone: 'success', message: 'Cloud sync code copied. Paste this exact code on your other device.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Clipboard was blocked. Copy the cloud sync code manually from the input.' })
    }
  }

  async function copyRecoveryKey() {
    if (!cloudSyncRecoveryKey) {
      setSyncStatus({ tone: 'error', message: 'No recovery key is saved on this device yet.' })
      return
    }
    try {
      await navigator.clipboard.writeText(cloudSyncRecoveryKey)
      setSyncStatus({ tone: 'success', message: 'Recovery key copied. Store it somewhere safe.' })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Clipboard was blocked. Copy the recovery key manually from the box below.' })
    }
  }

  async function rotatePassphrase() {
    const normalized = normalizeCloudSyncId(cloudSyncId || cloudSyncInput)
    const nextPassphrase = normalizeCloudSyncPassphrase(cloudSyncPassphrase)
    const ownerEmail = normalizeCloudSyncOwnerEmail(cloudSyncOwnerEmail)
    const currentPassphrase = normalizeCloudSyncPassphrase(localStorage.getItem(CLOUD_SYNC_PASSPHRASE_KEY))
    const recoveryKey = String(recoveryKeyInput || cloudSyncRecoveryKey || '').trim()

    if (!normalized) {
      setSyncStatus({ tone: 'error', message: 'Enable cloud sync on this device before rotating credentials.' })
      return
    }
    if (!nextPassphrase) {
      setSyncStatus({ tone: 'error', message: 'Enter the new passphrase you want to use on all devices.' })
      return
    }
    if (!currentPassphrase && !recoveryKey) {
      setSyncStatus({ tone: 'error', message: 'Enter a recovery key if this device no longer has the current passphrase.' })
      return
    }

    try {
      const result = await rotateCloudSyncCredentials(normalized, {
        newPassphrase: nextPassphrase,
        ...(currentPassphrase ? { currentPassphrase } : {}),
        ...(recoveryKey ? { recoveryKey } : {}),
        ...(ownerEmail ? { ownerEmail } : {}),
      })
      try {
        localStorage.setItem(CLOUD_SYNC_PASSPHRASE_KEY, nextPassphrase)
        localStorage.removeItem(CLOUD_SYNC_AUTH_TOKEN_KEY)
        localStorage.removeItem(CLOUD_SYNC_USER_ID_KEY)
        localStorage.removeItem(CLOUD_SYNC_DEVICE_ID_KEY)
        localStorage.removeItem(CLOUD_SYNC_OWNER_TOKEN_KEY)
        if (result?.ownerEmail) localStorage.setItem(CLOUD_SYNC_OWNER_EMAIL_KEY, result.ownerEmail)
        if (result?.recoveryKey) localStorage.setItem(CLOUD_SYNC_RECOVERY_KEY, result.recoveryKey)
      } catch {
        // Ignore storage write failures.
      }
      if (result?.ownerEmail) setCloudSyncOwnerEmail(result.ownerEmail)
      if (result?.recoveryKey) {
        setCloudSyncRecoveryKey(result.recoveryKey)
        setRecoveryKeyInput(result.recoveryKey)
      }
      setLinkedDevices([])
      if (typeof window !== 'undefined') window.dispatchEvent(new Event(CLOUD_SYNC_EVENT))
      setSyncStatus({ tone: 'success', message: 'Sync passphrase rotated. Other devices will need the new passphrase and the refreshed recovery key.' })
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid_recovery_key') {
        setSyncStatus({ tone: 'error', message: 'That recovery key is not valid for this cloud sync space.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_passphrase') {
        setSyncStatus({ tone: 'error', message: 'The current passphrase does not match this cloud sync space.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_owner_email') {
        setSyncStatus({ tone: 'error', message: 'Enter a valid owner email address.' })
        return
      }
      setSyncStatus({ tone: 'error', message: 'Could not rotate sync credentials right now. Try again in a few seconds.' })
    }
  }

  async function ensureOwnerToken() {
    const syncId = normalizeCloudSyncId(cloudSyncId || cloudSyncInput)
    const ownerEmail = normalizeCloudSyncOwnerEmail(cloudSyncOwnerEmail)
    const passphrase = normalizeCloudSyncPassphrase(cloudSyncPassphrase || localStorage.getItem(CLOUD_SYNC_PASSPHRASE_KEY))
    const recoveryKey = String(recoveryKeyInput || cloudSyncRecoveryKey || '').trim()

    if (!syncId) throw new Error('missing_sync_id')
    if (!ownerEmail) throw new Error('missing_owner_email')

    const existingToken = String(localStorage.getItem(CLOUD_SYNC_OWNER_TOKEN_KEY) || '').trim()
    if (existingToken) return { syncId, ownerToken: existingToken }

    const session = await createOwnerSession(syncId, {
      ownerEmail,
      ...(passphrase ? { passphrase } : {}),
      ...(recoveryKey ? { recoveryKey } : {}),
    })
    if (session?.ownerToken) localStorage.setItem(CLOUD_SYNC_OWNER_TOKEN_KEY, session.ownerToken)
    return { syncId, ownerToken: session.ownerToken }
  }

  async function loadLinkedDevices() {
    try {
      setLoadingLinkedDevices(true)
      let { syncId, ownerToken } = await ensureOwnerToken()
      let payload
      try {
        payload = await fetchLinkedDevices(syncId, ownerToken)
      } catch (error) {
        if (!(error instanceof Error) || error.message !== 'owner_unauthorized') throw error
        localStorage.removeItem(CLOUD_SYNC_OWNER_TOKEN_KEY)
        ;({ syncId, ownerToken } = await ensureOwnerToken())
        payload = await fetchLinkedDevices(syncId, ownerToken)
      }
      setLinkedDevices(Array.isArray(payload?.devices) ? payload.devices : [])
      if (payload?.ownerEmail) setCloudSyncOwnerEmail(payload.ownerEmail)
      setSyncStatus({ tone: 'success', message: `Loaded ${payload?.devices?.length || 0} linked device${payload?.devices?.length === 1 ? '' : 's'}.` })
    } catch (error) {
      if (error instanceof Error && error.message === 'missing_owner_email') {
        setSyncStatus({ tone: 'error', message: 'Enter the owner email to manage linked devices.' })
        return
      }
      if (error instanceof Error && error.message === 'missing_auth_proof') {
        setSyncStatus({ tone: 'error', message: 'Enter the current passphrase or recovery key to manage linked devices.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_owner_email') {
        setSyncStatus({ tone: 'error', message: 'That owner email does not match this sync space.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_recovery_key') {
        setSyncStatus({ tone: 'error', message: 'That recovery key is not valid for this sync space.' })
        return
      }
      if (error instanceof Error && error.message === 'invalid_passphrase') {
        setSyncStatus({ tone: 'error', message: 'The current passphrase does not match this sync space.' })
        return
      }
      setSyncStatus({ tone: 'error', message: 'Could not load linked devices right now. Try again in a few seconds.' })
    } finally {
      setLoadingLinkedDevices(false)
    }
  }

  async function handleRevokeDevice(deviceId) {
    try {
      setRevokingDeviceId(deviceId)
      let { syncId, ownerToken } = await ensureOwnerToken()
      try {
        await revokeLinkedDevice(syncId, ownerToken, deviceId)
      } catch (error) {
        if (!(error instanceof Error) || error.message !== 'owner_unauthorized') throw error
        localStorage.removeItem(CLOUD_SYNC_OWNER_TOKEN_KEY)
        ;({ syncId, ownerToken } = await ensureOwnerToken())
        await revokeLinkedDevice(syncId, ownerToken, deviceId)
      }
      setLinkedDevices(devices => devices.filter(device => device.deviceId !== deviceId))
      setSyncStatus({ tone: 'success', message: `Revoked linked device ${deviceId}.` })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Could not revoke that device right now. Try again in a few seconds.' })
    } finally {
      setRevokingDeviceId('')
    }
  }

  async function sendMagicCode() {
    const email = normalizeCloudSyncOwnerEmail(magicEmail)
    if (!email) {
      setSyncStatus({ tone: 'error', message: 'Enter a valid email address.' })
      return
    }
    setMagicLoading(true)
    try {
      const resp = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (resp.status === 429) {
        setSyncStatus({ tone: 'error', message: 'Too many attempts. Wait 15 minutes before requesting another code.' })
        return
      }
      if (!resp.ok) {
        setSyncStatus({ tone: 'error', message: 'Could not send verification code. Try again in a moment.' })
        return
      }
      setMagicStep('code')
      setSyncStatus({ tone: 'info', message: `Code sent to ${email}. Check your inbox (and spam folder).` })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Could not send verification code. Check your connection.' })
    } finally {
      setMagicLoading(false)
    }
  }

  async function verifyMagicCode() {
    const email = normalizeCloudSyncOwnerEmail(magicEmail)
    const syncId = normalizeCloudSyncId(magicSyncId) || undefined
    if (!magicCode || !/^\d{6}$/.test(magicCode)) {
      setSyncStatus({ tone: 'error', message: 'Enter the 6-digit code from your email.' })
      return
    }
    setMagicLoading(true)
    try {
      const resp = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: magicCode, ...(syncId ? { syncId } : {}) }),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) {
        if (data?.error === 'wrong_code') {
          setSyncStatus({ tone: 'error', message: 'That code is incorrect. Check your email and try again.' })
          return
        }
        if (data?.error === 'code_expired') {
          setSyncStatus({ tone: 'error', message: 'That code has expired. Request a new one.' })
          setMagicStep('email')
          setMagicCode('')
          return
        }
        if (data?.error === 'email_mismatch') {
          setSyncStatus({ tone: 'error', message: 'That email does not match this sync space.' })
          return
        }
        setSyncStatus({ tone: 'error', message: 'Verification failed. Try again.' })
        return
      }
      applyCloudSyncId(data.syncId)
      if (data.authToken) localStorage.setItem(CLOUD_SYNC_AUTH_TOKEN_KEY, data.authToken)
      if (data.userId) localStorage.setItem(CLOUD_SYNC_USER_ID_KEY, data.userId)
      if (data.deviceId) localStorage.setItem(CLOUD_SYNC_DEVICE_ID_KEY, data.deviceId)
      if (data.ownerEmail) {
        localStorage.setItem(CLOUD_SYNC_OWNER_EMAIL_KEY, data.ownerEmail)
        setCloudSyncOwnerEmail(data.ownerEmail)
      }
      if (data.recoveryKey) {
        localStorage.setItem(CLOUD_SYNC_RECOVERY_KEY, data.recoveryKey)
        setCloudSyncRecoveryKey(data.recoveryKey)
        setRecoveryKeyInput(data.recoveryKey)
      }
      if (typeof window !== 'undefined') window.dispatchEvent(new Event(CLOUD_SYNC_EVENT))
      setMagicStep('done')
      setSyncStatus({
        tone: 'success',
        message: data.recoveryKey
          ? 'Sync enabled. Save the recovery key shown below before leaving this screen.'
          : 'Sync enabled on this device.',
      })
    } catch {
      setSyncStatus({ tone: 'error', message: 'Verification failed. Check your connection and try again.' })
    } finally {
      setMagicLoading(false)
    }
  }

  function importFromCode(mode = 'merge') {
    const parsed = decodeCellarSyncPayload(syncInput.trim())
    if (!parsed) {
      setSyncStatus({ tone: 'error', message: 'Invalid sync code. Copy it again from the source device and retry.' })
      return
    }

    if (mode === 'replace') {
      const confirmed = window.confirm('Replace all cellar data on this device with the imported data?')
      if (!confirmed) return
    }

    const result = importCellarData(parsed, mode)
    if (mode === 'replace') {
      setSyncStatus({
        tone: 'success',
        message: `Replaced this device: ${result.totals.bottles} bottles, ${result.totals.wishlist} wishlist, ${result.totals.tasted} tasted.`,
      })
      return
    }

    const totalAdded = result.added.bottles + result.added.wishlist + result.added.tasted
    const totalSkipped = result.skipped.bottles + result.skipped.wishlist + result.skipped.tasted
    setSyncStatus({
      tone: 'success',
      message: `Merged ${totalAdded} items (${result.added.bottles} bottles, ${result.added.wishlist} wishlist, ${result.added.tasted} tasted). Skipped ${totalSkipped} duplicates.`,
    })
  }

  function openManualSyncTools() {
    setShowSyncPanel(true)
    setShowManualTools(true)
    setShowImport(true)
    setShowSyncMenu(false)
  }

  function openSyncManagement() {
    setShowSyncPanel(true)
    setShowSyncMenu(false)
  }

  return (
    <div className="surface-panel p-5 sm:p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="max-w-2xl min-w-0">
          <p className="section-label mb-2">Cross-device Sync</p>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-xl text-slate">Automatic and manual sync</h3>
            <span className={`tag border ${hasCloudSync ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-cream border-cream text-slate-lt'}`}>
              {hasCloudSync ? 'Active' : 'Not linked'}
            </span>
          </div>
          <p className="font-body text-sm text-slate-lt">
            {hasCloudSync
              ? 'Sync is already active on this device. Open the panel only when you need to copy the code, manage devices, or recover access.'
              : 'Set up automatic sync once, then keep the full setup hidden until you need it again.'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {showSyncPanel && (
            <button onClick={() => setShowSyncPanel(false)} className="btn-ghost text-xs">
              Hide Tools
            </button>
          )}
          <div ref={syncMenuRef} className="relative">
            <button
              type="button"
              aria-label="Open sync menu"
              aria-expanded={showSyncMenu}
              onClick={() => setShowSyncMenu(v => !v)}
              className="h-11 w-11 rounded-xl border border-cream bg-white text-slate shadow-sm transition-colors hover:border-gold hover:text-slate focus:outline-none focus:border-gold"
            >
              <span className="block text-xl leading-none -translate-y-px">...</span>
            </button>
            {showSyncMenu && (
              <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-2xl border border-cream bg-white p-1.5 shadow-card">
                <button
                  type="button"
                  onClick={openSyncManagement}
                  className="w-full rounded-xl px-3 py-2.5 text-left font-body text-sm text-slate transition-colors hover:bg-cream"
                >
                  {hasCloudSync ? 'Manage Sync' : 'Set Up Sync'}
                </button>
                <button
                  type="button"
                  onClick={openManualSyncTools}
                  className="w-full rounded-xl px-3 py-2.5 text-left font-body text-sm text-slate transition-colors hover:bg-cream"
                >
                  Import / Backup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSyncPanel && (
        <div className="mt-4 space-y-4 border-t border-cream pt-4">
          {!hasCloudSync && (
            <div className="rounded-xl border border-gold/40 bg-gold/5 p-3 sm:p-4 space-y-3">
              <p className="font-body text-xs uppercase tracking-widest text-slate-lt">Quick Setup — Email Verification</p>
              {magicStep === 'done' ? (
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="text-lg">✓</span>
                  <span className="font-body text-sm font-medium">Sync enabled on this device.</span>
                </div>
              ) : magicStep === 'code' ? (
                <div className="space-y-3">
                  <p className="font-body text-sm text-slate-lt">
                    Enter the 6-digit code sent to <strong className="text-slate">{magicEmail}</strong>.
                  </p>
                  <label className="block">
                    <span className="font-body text-xs text-slate-lt block mb-1.5">Verification code</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={magicCode}
                      onChange={e => setMagicCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-48 rounded-xl border border-cream bg-ivory px-3 py-2.5 font-mono text-xl text-slate tracking-widest focus:outline-none focus:border-gold"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={verifyMagicCode}
                      disabled={magicLoading}
                      className={`btn-primary text-xs ${magicLoading ? 'opacity-65 cursor-wait' : ''}`}
                    >
                      {magicLoading ? 'Verifying...' : 'Verify & Enable Sync'}
                    </button>
                    <button onClick={() => { setMagicStep('email'); setMagicCode('') }} className="btn-ghost text-xs">
                      Change Email
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-body text-sm text-slate-lt">
                    Enter your email to create a new sync space, or join an existing one by entering its code too.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="font-body text-xs text-slate-lt block mb-1.5">Email address</span>
                      <input
                        type="email"
                        value={magicEmail}
                        onChange={e => setMagicEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-body text-sm text-slate focus:outline-none focus:border-gold"
                      />
                    </label>
                    <label className="block">
                      <span className="font-body text-xs text-slate-lt block mb-1.5">Sync code (to join existing)</span>
                      <input
                        value={magicSyncId}
                        onChange={e => setMagicSyncId(e.target.value)}
                        placeholder="wg-... (blank = create new)"
                        className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-mono text-xs text-slate focus:outline-none focus:border-gold"
                      />
                    </label>
                  </div>
                  <button
                    onClick={sendMagicCode}
                    disabled={magicLoading}
                    className={`btn-primary text-xs ${magicLoading ? 'opacity-65 cursor-wait' : ''}`}
                  >
                    {magicLoading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-cream bg-white/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-body text-xs uppercase tracking-widest text-slate-lt">
                {hasCloudSync ? 'Automatic Cloud Sync' : 'Passphrase Setup (Advanced)'}
              </p>
              <span className={`tag border ${hasCloudSync ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-cream border-cream text-slate-lt'}`}>
                {hasCloudSync ? 'Active' : 'Not linked'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <label className="block">
                <span className="font-body text-xs text-slate-lt block mb-1.5">Cloud sync code</span>
                <input
                  value={cloudSyncInput}
                  onChange={e => setCloudSyncInput(e.target.value)}
                  placeholder="wg-..."
                  className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-mono text-xs text-slate focus:outline-none focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="font-body text-xs text-slate-lt block mb-1.5">Owner email</span>
                <input
                  type="email"
                  value={cloudSyncOwnerEmail}
                  onChange={e => setCloudSyncOwnerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-body text-sm text-slate focus:outline-none focus:border-gold"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-body text-xs text-slate-lt block mb-1.5">Sync passphrase</span>
              <input
                type="password"
                value={cloudSyncPassphrase}
                onChange={e => setCloudSyncPassphrase(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-body text-sm text-slate focus:outline-none focus:border-gold"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button onClick={connectCloudSync} className="btn-primary text-xs">Enable with This Code</button>
              <button onClick={generateCloudSync} className="btn-secondary text-xs">Generate New Code</button>
              {currentCloudCode && (
                <button onClick={copyCloudSyncCode} className="btn-secondary text-xs">Copy Cloud Code</button>
              )}
              {hasCloudSync && (
                <button onClick={rotatePassphrase} className="btn-secondary text-xs">Rotate Passphrase</button>
              )}
              {hasCloudSync && (
                <button onClick={disableCloudSync} className="btn-ghost text-xs text-terracotta/70 hover:text-terracotta">Disable Cloud Sync</button>
              )}
            </div>
          </div>

          {(hasCloudSync || cloudSyncRecoveryKey || showRecoveryTools) && (
            <div className="rounded-xl border border-gold/30 bg-gold/10 p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-body text-xs uppercase tracking-widest text-slate-lt">Recovery and Devices</p>
                <button onClick={() => setShowRecoveryTools(v => !v)} className="btn-ghost text-xs">
                  {showRecoveryTools ? 'Hide Recovery Tools' : 'Show Recovery Tools'}
                </button>
              </div>
              {cloudSyncRecoveryKey && (
                <>
                  <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-[11px] font-mono text-slate/75 break-all">
                    {cloudSyncRecoveryKey}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={copyRecoveryKey} className="btn-secondary text-xs">Copy Recovery Key</button>
                  </div>
                </>
              )}
              {showRecoveryTools && (
                <div className="space-y-3">
                  <label className="block">
                    <span className="font-body text-xs text-slate-lt block mb-1.5">Recovery key</span>
                    <input
                      value={recoveryKeyInput}
                      onChange={e => setRecoveryKeyInput(e.target.value)}
                      placeholder="wgrk-..."
                      className="w-full rounded-xl border border-cream bg-white px-3 py-2.5 font-mono text-xs text-slate focus:outline-none focus:border-gold"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={loadLinkedDevices} className={`btn-secondary text-xs ${loadingLinkedDevices ? 'opacity-65 cursor-wait' : ''}`} disabled={loadingLinkedDevices}>
                      {loadingLinkedDevices ? 'Loading Devices...' : 'Load Linked Devices'}
                    </button>
                  </div>
                  {linkedDevices.length > 0 && (
                    <div className="space-y-2">
                      {linkedDevices.map(device => (
                        <div key={device.deviceId} className="rounded-xl border border-cream bg-white px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-[11px] text-slate break-all">{device.deviceId}</p>
                            <p className="font-body text-xs text-slate-lt mt-1">
                              Last seen {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString('en-GB') : 'unknown'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRevokeDevice(device.deviceId)}
                            disabled={revokingDeviceId === device.deviceId}
                            className={`btn-ghost text-xs text-terracotta/70 hover:text-terracotta ${revokingDeviceId === device.deviceId ? 'opacity-65 cursor-wait' : ''}`}
                          >
                            {revokingDeviceId === device.deviceId ? 'Revoking...' : 'Revoke Device'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-cream bg-white/80 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-slate-lt">Manual Backup and Import</p>
                <p className="font-body text-sm text-slate-lt mt-1">Use this only when you want to move data manually with a code or link.</p>
              </div>
              <button onClick={() => setShowManualTools(v => !v)} className="btn-ghost text-xs self-start sm:self-auto">
                {showManualTools ? 'Hide Manual Tools' : 'Show Manual Tools'}
              </button>
            </div>

            {showManualTools && (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={copySyncCode} className="btn-primary text-xs">Copy Sync Code</button>
                  <button onClick={copySyncLink} className="btn-secondary text-xs">Copy Sync Link</button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-[11px] font-mono text-slate/75 break-all max-h-32 overflow-y-auto">
                    {syncCode}
                  </div>
                  <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-[11px] font-mono text-slate/75 break-all max-h-32 overflow-y-auto">
                    {syncLink}
                  </div>
                </div>

                <div>
                  <button onClick={() => setShowImport(v => !v)} className="btn-ghost text-xs">
                    {showImport ? 'Hide Import' : 'Import on This Device'}
                  </button>
                </div>

                {showImport && (
                  <div className="rounded-xl border border-cream bg-white p-3 space-y-3">
                    <label className="block">
                      <span className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Paste sync code</span>
                      <textarea
                        value={syncInput}
                        onChange={e => setSyncInput(e.target.value)}
                        rows={4}
                        placeholder="Paste the WGCS1_... code from your other device"
                        className="w-full rounded-xl border border-cream bg-ivory px-3 py-2.5 font-mono text-xs text-slate focus:outline-none focus:border-gold resize-y"
                      />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => importFromCode('merge')} className="btn-primary text-xs">Merge into This Device</button>
                      <button onClick={() => importFromCode('replace')} className="btn-secondary text-xs">Replace This Device</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {syncStatus.message && (
        <div className={`mt-3 rounded-xl border px-3 py-2.5 ${
          syncStatus.tone === 'success'
            ? 'bg-emerald-50 border-emerald-200'
            : syncStatus.tone === 'error'
              ? 'bg-rose-50 border-rose-200'
              : 'bg-gold/10 border-gold/30'
        }`}>
          <p className="font-body text-xs text-slate">{syncStatus.message}</p>
        </div>
      )}
    </div>
  )
}
