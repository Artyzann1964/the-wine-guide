import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import crypto from 'crypto'
import pg from 'pg'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DIST_DIR = path.join(__dirname, 'dist')
const STORE_PATH = process.env.CELLAR_SYNC_STORE_PATH || path.join(__dirname, 'data', 'cellar-sync-store.json')
const PORT = Number(process.env.PORT || 3000)
const DATABASE_URL = String(process.env.DATABASE_URL || '').trim()

const app = express()
app.use(express.json({ limit: '2mb' }))

app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true })
})

let writeQueue = Promise.resolve()

const database = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
    })
  : null

function normalizeSyncId(value) {
  const raw = String(value || '').trim()
  if (!/^[a-zA-Z0-9_-]{8,96}$/.test(raw)) return ''
  return raw
}

function normalizeIsoTimestamp(value, fallback = new Date().toISOString()) {
  const raw = String(value || '').trim()
  if (!raw) return fallback
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return fallback
  return parsed.toISOString()
}

function normalizeOpaqueId(value) {
  const raw = String(value || '').trim()
  if (!/^[a-zA-Z0-9_-]{8,128}$/.test(raw)) return ''
  return raw
}

function generateOpaqueId(prefix) {
  return `${prefix}-${crypto.randomBytes(12).toString('base64url')}`
}

function generateAuthToken() {
  return `wgat-${crypto.randomBytes(24).toString('base64url')}`
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex')
}

function hashesMatch(left, right) {
  const leftValue = String(left || '')
  const rightValue = String(right || '')
  if (!leftValue || !rightValue) return false
  const leftBuffer = Buffer.from(leftValue)
  const rightBuffer = Buffer.from(rightValue)
  if (leftBuffer.length !== rightBuffer.length) return false
  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function normalizePassphrase(value) {
  const raw = String(value || '').trim()
  if (raw.length < 6 || raw.length > 128) return ''
  return raw
}

function normalizeOwnerEmail(value) {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return ''
  return raw
}

function generateRecoveryKey() {
  return `wgrk-${crypto.randomBytes(18).toString('base64url')}`
}

function createSyncError(code, status) {
  const error = new Error(code)
  error.code = code
  error.status = status
  return error
}

function readBearerToken(headerValue) {
  const raw = String(headerValue || '').trim()
  const match = raw.match(/^Bearer\s+(.+)$/i)
  if (!match) return ''
  return String(match[1] || '').trim()
}

function normalizeCellarItem(value) {
  const item = value && typeof value === 'object' ? value : {}
  const now = new Date().toISOString()
  const status = ['bottle', 'wishlist', 'tasted'].includes(item.status) ? item.status : 'bottle'
  return {
    ...item,
    id: String(item.id || '').trim(),
    status,
    updatedAt: normalizeIsoTimestamp(item.updatedAt || item.tastedAt || item.addedAt, now),
    createdAt: normalizeIsoTimestamp(item.createdAt || item.addedAt || item.updatedAt, now),
  }
}

function normalizeItemSet(value) {
  const data = value && typeof value === 'object' ? value : {}
  return {
    items: Array.isArray(data.items)
      ? data.items.map(normalizeCellarItem).filter(item => item.id)
      : [],
  }
}

function normalizeCellarShape(value) {
  const data = value && typeof value === 'object' ? value : {}
  return {
    bottles: Array.isArray(data.bottles) ? data.bottles : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
    tasted: Array.isArray(data.tasted) ? data.tasted : [],
  }
}

function latestItemTimestamp(items = []) {
  return items.reduce((latest, item) => {
    const updatedAt = normalizeIsoTimestamp(item?.updatedAt, '')
    return updatedAt > latest ? updatedAt : latest
  }, '')
}

async function ensureStoreDir() {
  await mkdir(path.dirname(STORE_PATH), { recursive: true })
}

async function readStore() {
  try {
    const text = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(text)
    const syncs = parsed?.syncs && typeof parsed.syncs === 'object' ? parsed.syncs : {}
    const itemSyncs = parsed?.itemSyncs && typeof parsed.itemSyncs === 'object' ? parsed.itemSyncs : {}
    const itemSyncNamespaces = parsed?.itemSyncNamespaces && typeof parsed.itemSyncNamespaces === 'object' ? parsed.itemSyncNamespaces : {}
    const itemSyncSessions = parsed?.itemSyncSessions && typeof parsed.itemSyncSessions === 'object' ? parsed.itemSyncSessions : {}
    const itemSyncOwnerSessions = parsed?.itemSyncOwnerSessions && typeof parsed.itemSyncOwnerSessions === 'object' ? parsed.itemSyncOwnerSessions : {}
    return { syncs, itemSyncs, itemSyncNamespaces, itemSyncSessions, itemSyncOwnerSessions }
  } catch {
    return { syncs: {}, itemSyncs: {}, itemSyncNamespaces: {}, itemSyncSessions: {}, itemSyncOwnerSessions: {} }
  }
}

async function writeStore(store) {
  await ensureStoreDir()
  const tempPath = `${STORE_PATH}.tmp`
  await writeFile(tempPath, JSON.stringify(store), 'utf8')
  await rename(tempPath, STORE_PATH)
}

function withStoreWrite(task) {
  writeQueue = writeQueue.then(task, task)
  return writeQueue
}

async function ensureDatabaseSchema() {
  if (!database) return
  await database.query(`
    create table if not exists cellar_sync_namespace (
      sync_id text primary key,
      owner_user_id text not null,
      owner_secret_hash text,
      owner_email text,
      recovery_key_hash text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists cellar_sync_item (
      sync_id text not null references cellar_sync_namespace(sync_id) on delete cascade,
      item_id text not null,
      item_updated_at timestamptz not null,
      payload jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      primary key (sync_id, item_id)
    );

    create index if not exists idx_cellar_sync_item_sync_id_updated_at
      on cellar_sync_item(sync_id, item_updated_at desc);

    create table if not exists cellar_sync_session (
      sync_id text not null references cellar_sync_namespace(sync_id) on delete cascade,
      token_hash text primary key,
      user_id text not null,
      device_id text not null,
      created_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now()
    );

    create index if not exists idx_cellar_sync_session_sync_id
      on cellar_sync_session(sync_id, last_seen_at desc);

    create table if not exists cellar_sync_owner_session (
      sync_id text not null references cellar_sync_namespace(sync_id) on delete cascade,
      token_hash text primary key,
      owner_email text not null,
      created_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now()
    );

    create index if not exists idx_cellar_sync_owner_session_sync_id
      on cellar_sync_owner_session(sync_id, last_seen_at desc);
  `)

  await database.query(`
    alter table cellar_sync_namespace
    add column if not exists owner_user_id text
  `)

  await database.query(`
    alter table cellar_sync_namespace
    add column if not exists owner_secret_hash text
  `)

  await database.query(`
    alter table cellar_sync_namespace
    add column if not exists owner_email text
  `)

  await database.query(`
    alter table cellar_sync_namespace
    add column if not exists recovery_key_hash text
  `)

  await database.query(`
    update cellar_sync_namespace
    set owner_user_id = concat('usr-', encode(gen_random_bytes(12), 'base64'))
    where owner_user_id is null
  `).catch(async () => {
    const { rows } = await database.query(`
      select sync_id
      from cellar_sync_namespace
      where owner_user_id is null
    `)

    for (const row of rows) {
      await database.query(
        `
          update cellar_sync_namespace
          set owner_user_id = $2
          where sync_id = $1
        `,
        [row.sync_id, generateOpaqueId('usr')]
      )
    }
  })

  await database.query(`
    alter table cellar_sync_namespace
    alter column owner_user_id set not null
  `).catch(() => {})
}

async function getSnapshotRecord(syncId) {
  const store = await readStore()
  return store.syncs[syncId] || null
}

async function putSnapshotRecord(syncId, revision, cellar) {
  return withStoreWrite(async () => {
    const store = await readStore()
    const existing = store.syncs[syncId]
    const existingRevision = Number(existing?.revision) || 0

    if (existing && revision < existingRevision) {
      return {
        syncId,
        revision: existingRevision,
        cellar: normalizeCellarShape(existing.cellar),
        updatedAt: existing.updatedAt || null,
        stale: true,
      }
    }

    const nextRecord = {
      revision,
      cellar: normalizeCellarShape(cellar),
      updatedAt: new Date().toISOString(),
    }
    store.syncs[syncId] = nextRecord
    await writeStore(store)

    return {
      syncId,
      revision,
      cellar: nextRecord.cellar,
      updatedAt: nextRecord.updatedAt,
      stale: false,
    }
  })
}

async function getItemSync(syncId) {
  if (database) {
    const { rows } = await database.query(
      `
        select payload, item_updated_at
        from cellar_sync_item
        where sync_id = $1
        order by item_updated_at desc, item_id asc
      `,
      [syncId]
    )
    if (rows.length === 0) return null
    const items = rows.map(row => normalizeCellarItem(row.payload))
    return {
      syncId,
      items,
      updatedAt: latestItemTimestamp(items) || null,
    }
  }

  const store = await readStore()
  const record = store.itemSyncs[syncId]
  if (!record) return null
  const normalized = normalizeItemSet(record)
  return {
    syncId,
    items: normalized.items,
    updatedAt: record.updatedAt || latestItemTimestamp(normalized.items) || null,
  }
}

async function issueSyncSession(syncId, requestedDeviceId, requestedPassphrase, requestedOwnerEmail) {
  const deviceId = normalizeOpaqueId(requestedDeviceId) || generateOpaqueId('dev')
  const passphrase = normalizePassphrase(requestedPassphrase)
  const ownerEmail = normalizeOwnerEmail(requestedOwnerEmail)
  if (!passphrase) throw createSyncError('missing_passphrase', 400)
  const ownerSecretHash = hashToken(passphrase)
  const authToken = generateAuthToken()
  const tokenHash = hashToken(authToken)

  if (database) {
    await ensureDatabaseSchema()
    const client = await database.connect()
    try {
      await client.query('begin')
      const existingNamespace = await client.query(
        `
          select owner_user_id, owner_secret_hash, owner_email, recovery_key_hash
          from cellar_sync_namespace
          where sync_id = $1
          for update
        `,
        [syncId]
      )

      const userId = existingNamespace.rows[0]?.owner_user_id || generateOpaqueId('usr')
      const existingSecretHash = existingNamespace.rows[0]?.owner_secret_hash || ''
      let namespaceOwnerEmail = existingNamespace.rows[0]?.owner_email || ''
      let recoveryKey = ''
      let recoveryKeyHash = existingNamespace.rows[0]?.recovery_key_hash || ''

      if (existingNamespace.rows.length === 0) {
        if (!ownerEmail) throw createSyncError('missing_owner_email', 400)
        recoveryKey = generateRecoveryKey()
        recoveryKeyHash = hashToken(recoveryKey)
        namespaceOwnerEmail = ownerEmail
        await client.query(
          `
            insert into cellar_sync_namespace (sync_id, owner_user_id, owner_secret_hash, owner_email, recovery_key_hash, updated_at)
            values ($1, $2, $3, $4, $5, now())
          `,
          [syncId, userId, ownerSecretHash, namespaceOwnerEmail, recoveryKeyHash]
        )
      } else {
        if (existingSecretHash && !hashesMatch(existingSecretHash, ownerSecretHash)) {
          throw createSyncError('invalid_passphrase', 403)
        }

        if (requestedOwnerEmail && !ownerEmail) throw createSyncError('invalid_owner_email', 400)
        if (!namespaceOwnerEmail && ownerEmail) namespaceOwnerEmail = ownerEmail
        if (!recoveryKeyHash) {
          recoveryKey = generateRecoveryKey()
          recoveryKeyHash = hashToken(recoveryKey)
        }

        await client.query(
          `
            update cellar_sync_namespace
            set updated_at = now(),
                owner_secret_hash = coalesce(owner_secret_hash, $2),
                owner_email = coalesce(owner_email, $3),
                recovery_key_hash = coalesce(recovery_key_hash, $4)
            where sync_id = $1
          `,
          [syncId, ownerSecretHash, namespaceOwnerEmail || null, recoveryKeyHash || null]
        )
      }

      await client.query(
        `
          insert into cellar_sync_session (sync_id, token_hash, user_id, device_id)
          values ($1, $2, $3, $4)
        `,
        [syncId, tokenHash, userId, deviceId]
      )

      await client.query('commit')
      return { syncId, userId, deviceId, authToken, ownerEmail: namespaceOwnerEmail || null, recoveryKey: recoveryKey || null }
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }

  return withStoreWrite(async () => {
    const store = await readStore()
    if (requestedOwnerEmail && !ownerEmail) throw createSyncError('invalid_owner_email', 400)
    let recoveryKey = ''
    const namespace = store.itemSyncNamespaces[syncId] || {
      userId: generateOpaqueId('usr'),
      createdAt: new Date().toISOString(),
      ownerSecretHash,
      ownerEmail,
      recoveryKeyHash: '',
    }
    if (namespace.ownerSecretHash && !hashesMatch(namespace.ownerSecretHash, ownerSecretHash)) {
      throw createSyncError('invalid_passphrase', 403)
    }
    if (!namespace.ownerEmail && !ownerEmail) throw createSyncError('missing_owner_email', 400)
    namespace.ownerSecretHash = namespace.ownerSecretHash || ownerSecretHash
    namespace.ownerEmail = namespace.ownerEmail || ownerEmail
    if (!namespace.recoveryKeyHash) {
      recoveryKey = generateRecoveryKey()
      namespace.recoveryKeyHash = hashToken(recoveryKey)
    }
    namespace.updatedAt = new Date().toISOString()
    store.itemSyncNamespaces[syncId] = namespace
    store.itemSyncSessions[tokenHash] = {
      syncId,
      userId: namespace.userId,
      deviceId,
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    }
    await writeStore(store)
    return {
      syncId,
      userId: namespace.userId,
      deviceId,
      authToken,
      ownerEmail: namespace.ownerEmail || null,
      recoveryKey: recoveryKey || null,
    }
  })
}

async function issueOwnerSession(syncId, requestedOwnerEmail, requestedPassphrase, requestedRecoveryKey) {
  const ownerEmail = normalizeOwnerEmail(requestedOwnerEmail)
  const passphrase = normalizePassphrase(requestedPassphrase)
  const recoveryKey = String(requestedRecoveryKey || '').trim()
  if (!ownerEmail) throw createSyncError('missing_owner_email', 400)
  if (!passphrase && !recoveryKey) throw createSyncError('missing_auth_proof', 400)

  const ownerToken = generateAuthToken()
  const tokenHash = hashToken(ownerToken)

  if (database) {
    await ensureDatabaseSchema()
    const client = await database.connect()
    try {
      await client.query('begin')
      const { rows } = await client.query(
        `
          select owner_email, owner_secret_hash, recovery_key_hash
          from cellar_sync_namespace
          where sync_id = $1
          for update
        `,
        [syncId]
      )
      const namespace = rows[0]
      if (!namespace) throw createSyncError('not_found', 404)
      if (!namespace.owner_email || !hashesMatch(hashToken(ownerEmail), hashToken(namespace.owner_email))) {
        throw createSyncError('invalid_owner_email', 403)
      }

      const passphraseMatches = passphrase && hashesMatch(namespace.owner_secret_hash, hashToken(passphrase))
      const recoveryMatches = recoveryKey && hashesMatch(namespace.recovery_key_hash, hashToken(recoveryKey))
      if (!passphraseMatches && !recoveryMatches) {
        throw createSyncError(recoveryKey ? 'invalid_recovery_key' : 'invalid_passphrase', 403)
      }

      await client.query(
        `
          insert into cellar_sync_owner_session (sync_id, token_hash, owner_email)
          values ($1, $2, $3)
        `,
        [syncId, tokenHash, ownerEmail]
      )
      await client.query('commit')
      return { syncId, ownerEmail, ownerToken }
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }

  return withStoreWrite(async () => {
    const store = await readStore()
    const namespace = store.itemSyncNamespaces[syncId]
    if (!namespace) throw createSyncError('not_found', 404)
    if (!namespace.ownerEmail || namespace.ownerEmail !== ownerEmail) {
      throw createSyncError('invalid_owner_email', 403)
    }

    const passphraseMatches = passphrase && hashesMatch(namespace.ownerSecretHash, hashToken(passphrase))
    const recoveryMatches = recoveryKey && hashesMatch(namespace.recoveryKeyHash, hashToken(recoveryKey))
    if (!passphraseMatches && !recoveryMatches) {
      throw createSyncError(recoveryKey ? 'invalid_recovery_key' : 'invalid_passphrase', 403)
    }

    store.itemSyncOwnerSessions[tokenHash] = {
      syncId,
      ownerEmail,
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    }
    await writeStore(store)
    return { syncId, ownerEmail, ownerToken }
  })
}

async function authenticateOwnerSession(syncId, authToken) {
  const tokenHash = hashToken(authToken)
  if (!tokenHash) return null

  if (database) {
    const { rows } = await database.query(
      `
        select sync_id, owner_email
        from cellar_sync_owner_session
        where sync_id = $1
          and token_hash = $2
      `,
      [syncId, tokenHash]
    )
    const session = rows[0] || null
    if (!session) return null
    await database.query(
      `
        update cellar_sync_owner_session
        set last_seen_at = now()
        where token_hash = $1
      `,
      [tokenHash]
    ).catch(() => {})
    return {
      syncId: session.sync_id,
      ownerEmail: session.owner_email,
    }
  }

  const store = await readStore()
  const session = store.itemSyncOwnerSessions[tokenHash]
  if (!session || session.syncId !== syncId) return null

  return withStoreWrite(async () => {
    const latestStore = await readStore()
    const latestSession = latestStore.itemSyncOwnerSessions[tokenHash]
    if (!latestSession || latestSession.syncId !== syncId) return null
    latestSession.lastSeenAt = new Date().toISOString()
    await writeStore(latestStore)
    return {
      syncId: latestSession.syncId,
      ownerEmail: latestSession.ownerEmail,
    }
  })
}

async function listSyncDevices(syncId) {
  if (database) {
    const namespaceResult = await database.query(
      `
        select owner_email
        from cellar_sync_namespace
        where sync_id = $1
      `,
      [syncId]
    )
    const ownerEmail = namespaceResult.rows[0]?.owner_email || null
    const { rows } = await database.query(
      `
        select device_id, created_at, last_seen_at
        from cellar_sync_session
        where sync_id = $1
        order by last_seen_at desc, created_at desc
      `,
      [syncId]
    )
    return {
      syncId,
      ownerEmail,
      devices: rows.map(row => ({
        deviceId: row.device_id,
        createdAt: row.created_at,
        lastSeenAt: row.last_seen_at,
      })),
    }
  }

  const store = await readStore()
  const namespace = store.itemSyncNamespaces[syncId]
  const devices = Object.values(store.itemSyncSessions)
    .filter(session => session?.syncId === syncId)
    .sort((left, right) => String(right.lastSeenAt || '').localeCompare(String(left.lastSeenAt || '')))
    .map(session => ({
      deviceId: session.deviceId,
      createdAt: session.createdAt || null,
      lastSeenAt: session.lastSeenAt || null,
    }))

  return {
    syncId,
    ownerEmail: namespace?.ownerEmail || null,
    devices,
  }
}

async function revokeSyncDevice(syncId, deviceId) {
  const normalizedDeviceId = normalizeOpaqueId(deviceId)
  if (!normalizedDeviceId) throw createSyncError('invalid_device_id', 400)

  if (database) {
    const result = await database.query(
      `
        delete from cellar_sync_session
        where sync_id = $1
          and device_id = $2
      `,
      [syncId, normalizedDeviceId]
    )
    return { revoked: result.rowCount > 0 }
  }

  return withStoreWrite(async () => {
    const store = await readStore()
    let revoked = false
    Object.keys(store.itemSyncSessions).forEach(tokenHash => {
      const session = store.itemSyncSessions[tokenHash]
      if (session?.syncId === syncId && session?.deviceId === normalizedDeviceId) {
        delete store.itemSyncSessions[tokenHash]
        revoked = true
      }
    })
    await writeStore(store)
    return { revoked }
  })
}

async function rotateSyncPassphrase(syncId, requestedNewPassphrase, requestedCurrentPassphrase, requestedRecoveryKey, requestedOwnerEmail) {
  const newPassphrase = normalizePassphrase(requestedNewPassphrase)
  const currentPassphrase = normalizePassphrase(requestedCurrentPassphrase)
  const recoveryKey = String(requestedRecoveryKey || '').trim()
  const ownerEmail = requestedOwnerEmail ? normalizeOwnerEmail(requestedOwnerEmail) : ''
  if (!newPassphrase) throw createSyncError('missing_new_passphrase', 400)
  if (requestedOwnerEmail && !ownerEmail) throw createSyncError('invalid_owner_email', 400)
  if (!currentPassphrase && !recoveryKey) throw createSyncError('missing_auth_proof', 400)

  const nextSecretHash = hashToken(newPassphrase)
  const nextRecoveryKey = generateRecoveryKey()
  const nextRecoveryKeyHash = hashToken(nextRecoveryKey)

  if (database) {
    await ensureDatabaseSchema()
    const client = await database.connect()
    try {
      await client.query('begin')
      const { rows } = await client.query(
        `
          select owner_secret_hash, owner_email, recovery_key_hash
          from cellar_sync_namespace
          where sync_id = $1
          for update
        `,
        [syncId]
      )
      const namespace = rows[0]
      if (!namespace) throw createSyncError('not_found', 404)

      const passphraseMatches = currentPassphrase && hashesMatch(namespace.owner_secret_hash, hashToken(currentPassphrase))
      const recoveryMatches = recoveryKey && hashesMatch(namespace.recovery_key_hash, hashToken(recoveryKey))
      if (!passphraseMatches && !recoveryMatches) {
        throw createSyncError(recoveryKey ? 'invalid_recovery_key' : 'invalid_passphrase', 403)
      }

      const nextOwnerEmail = ownerEmail || namespace.owner_email || null
      await client.query(
        `
          update cellar_sync_namespace
          set owner_secret_hash = $2,
              recovery_key_hash = $3,
              owner_email = $4,
              updated_at = now()
          where sync_id = $1
        `,
        [syncId, nextSecretHash, nextRecoveryKeyHash, nextOwnerEmail]
      )
      await client.query(`delete from cellar_sync_session where sync_id = $1`, [syncId])
      await client.query(`delete from cellar_sync_owner_session where sync_id = $1`, [syncId])
      await client.query('commit')
      return {
        syncId,
        ownerEmail: nextOwnerEmail,
        recoveryKey: nextRecoveryKey,
      }
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }

  return withStoreWrite(async () => {
    const store = await readStore()
    const namespace = store.itemSyncNamespaces[syncId]
    if (!namespace) throw createSyncError('not_found', 404)

    const passphraseMatches = currentPassphrase && hashesMatch(namespace.ownerSecretHash, hashToken(currentPassphrase))
    const recoveryMatches = recoveryKey && hashesMatch(namespace.recoveryKeyHash, hashToken(recoveryKey))
    if (!passphraseMatches && !recoveryMatches) {
      throw createSyncError(recoveryKey ? 'invalid_recovery_key' : 'invalid_passphrase', 403)
    }

    namespace.ownerSecretHash = nextSecretHash
    namespace.recoveryKeyHash = nextRecoveryKeyHash
    namespace.ownerEmail = ownerEmail || namespace.ownerEmail || ''
    namespace.updatedAt = new Date().toISOString()

    Object.keys(store.itemSyncSessions).forEach(tokenHash => {
      if (store.itemSyncSessions[tokenHash]?.syncId === syncId) {
        delete store.itemSyncSessions[tokenHash]
      }
    })
    Object.keys(store.itemSyncOwnerSessions).forEach(tokenHash => {
      if (store.itemSyncOwnerSessions[tokenHash]?.syncId === syncId) {
        delete store.itemSyncOwnerSessions[tokenHash]
      }
    })

    await writeStore(store)
    return {
      syncId,
      ownerEmail: namespace.ownerEmail || null,
      recoveryKey: nextRecoveryKey,
    }
  })
}

async function authenticateItemSync(syncId, authToken) {
  const tokenHash = hashToken(authToken)
  if (!tokenHash) return null

  if (database) {
    const { rows } = await database.query(
      `
        select sync_id, user_id, device_id
        from cellar_sync_session
        where sync_id = $1
          and token_hash = $2
      `,
      [syncId, tokenHash]
    )
    const session = rows[0] || null
    if (!session) return null
    await database.query(
      `
        update cellar_sync_session
        set last_seen_at = now()
        where token_hash = $1
      `,
      [tokenHash]
    ).catch(() => {})
    return {
      syncId: session.sync_id,
      userId: session.user_id,
      deviceId: session.device_id,
    }
  }

  const store = await readStore()
  const session = store.itemSyncSessions[tokenHash]
  if (!session || session.syncId !== syncId) return null

  return withStoreWrite(async () => {
    const latestStore = await readStore()
    const latestSession = latestStore.itemSyncSessions[tokenHash]
    if (!latestSession || latestSession.syncId !== syncId) return null
    latestSession.lastSeenAt = new Date().toISOString()
    await writeStore(latestStore)
    return {
      syncId: latestSession.syncId,
      userId: latestSession.userId,
      deviceId: latestSession.deviceId,
    }
  })
}

async function putItemSync(syncId, incomingItems, ownerUserId = '') {
  const normalizedItems = normalizeItemSet({ items: incomingItems }).items

  if (database) {
    await ensureDatabaseSchema()
    const client = await database.connect()
    try {
      await client.query('begin')
      await client.query(
        `
          insert into cellar_sync_namespace (sync_id, owner_user_id, updated_at)
          values ($1, $2, now())
          on conflict (sync_id)
          do update set updated_at = now()
        `,
        [syncId, ownerUserId || generateOpaqueId('usr')]
      )

      for (const item of normalizedItems) {
        await client.query(
          `
            insert into cellar_sync_item (sync_id, item_id, item_updated_at, payload)
            values ($1, $2, $3::timestamptz, $4::jsonb)
            on conflict (sync_id, item_id)
            do update
            set item_updated_at = excluded.item_updated_at,
                payload = excluded.payload,
                updated_at = now()
            where excluded.item_updated_at >= cellar_sync_item.item_updated_at
          `,
          [syncId, item.id, normalizeIsoTimestamp(item.updatedAt), JSON.stringify(item)]
        )
      }

      await client.query('commit')
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }

    return getItemSync(syncId)
  }

  return withStoreWrite(async () => {
    const store = await readStore()
    if (!store.itemSyncNamespaces[syncId]) {
      store.itemSyncNamespaces[syncId] = {
        userId: ownerUserId || generateOpaqueId('usr'),
        ownerSecretHash: '',
        ownerEmail: '',
        recoveryKeyHash: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
    const existing = normalizeItemSet(store.itemSyncs[syncId] || {})
    const itemMap = new Map(existing.items.map(item => [item.id, item]))

    normalizedItems.forEach(item => {
      const current = itemMap.get(item.id)
      if (!current || normalizeIsoTimestamp(item.updatedAt, '') >= normalizeIsoTimestamp(current.updatedAt, '')) {
        itemMap.set(item.id, item)
      }
    })

    const items = [...itemMap.values()].sort((a, b) => normalizeIsoTimestamp(b.updatedAt, '').localeCompare(normalizeIsoTimestamp(a.updatedAt, '')))
    store.itemSyncs[syncId] = {
      items,
      updatedAt: latestItemTimestamp(items) || new Date().toISOString(),
    }
    await writeStore(store)
    return {
      syncId,
      items,
      updatedAt: store.itemSyncs[syncId].updatedAt,
    }
  })
}

app.get('/api/cellar-sync/:syncId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })

  const record = await getSnapshotRecord(syncId)
  if (!record) return res.status(404).json({ error: 'not_found' })

  return res.json({
    syncId,
    revision: Number(record.revision) || 0,
    cellar: normalizeCellarShape(record.cellar),
    updatedAt: record.updatedAt || null,
  })
})

app.put('/api/cellar-sync/:syncId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })

  const incomingCellar = normalizeCellarShape(req.body?.cellar)
  const incomingRevision = Number(req.body?.revision)
  const revision = Number.isFinite(incomingRevision) && incomingRevision > 0
    ? Math.floor(incomingRevision)
    : Date.now()

  const result = await putSnapshotRecord(syncId, revision, incomingCellar)
  return res.json(result)
})

app.post('/api/cellar-sync-session/:syncId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })

  try {
    const session = await issueSyncSession(syncId, req.body?.deviceId, req.body?.passphrase, req.body?.ownerEmail)
    return res.json(session)
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.code || 'sync_session_failed' })
    }
    return res.status(500).json({ error: 'sync_session_failed' })
  }
})

app.post('/api/cellar-sync-owner/:syncId/rotate-passphrase', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })

  try {
    const result = await rotateSyncPassphrase(
      syncId,
      req.body?.newPassphrase,
      req.body?.currentPassphrase,
      req.body?.recoveryKey,
      req.body?.ownerEmail
    )
    return res.json(result)
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.code || 'sync_rotate_failed' })
    }
    return res.status(500).json({ error: 'sync_rotate_failed' })
  }
})

app.post('/api/cellar-sync-owner/:syncId/session', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })

  try {
    const session = await issueOwnerSession(syncId, req.body?.ownerEmail, req.body?.passphrase, req.body?.recoveryKey)
    return res.json(session)
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.code || 'owner_session_failed' })
    }
    return res.status(500).json({ error: 'owner_session_failed' })
  }
})

app.get('/api/cellar-sync-owner/:syncId/devices', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })
  const authToken = readBearerToken(req.headers.authorization)
  const session = await authenticateOwnerSession(syncId, authToken)
  if (!session) return res.status(401).json({ error: 'unauthorized' })

  try {
    const payload = await listSyncDevices(syncId)
    return res.json(payload)
  } catch (error) {
    return res.status(500).json({ error: 'owner_devices_failed' })
  }
})

app.delete('/api/cellar-sync-owner/:syncId/devices/:deviceId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })
  const authToken = readBearerToken(req.headers.authorization)
  const session = await authenticateOwnerSession(syncId, authToken)
  if (!session) return res.status(401).json({ error: 'unauthorized' })

  try {
    const result = await revokeSyncDevice(syncId, req.params.deviceId)
    return res.json({ syncId, deviceId: normalizeOpaqueId(req.params.deviceId), revoked: result.revoked })
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.code || 'owner_device_revoke_failed' })
    }
    return res.status(500).json({ error: 'owner_device_revoke_failed' })
  }
})

app.get('/api/cellar-items/:syncId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })
  const authToken = readBearerToken(req.headers.authorization)
  const session = await authenticateItemSync(syncId, authToken)
  if (!session) return res.status(401).json({ error: 'unauthorized' })

  try {
    const record = await getItemSync(syncId)
    if (!record) return res.status(404).json({ error: 'not_found' })
    return res.json(record)
  } catch (error) {
    return res.status(500).json({ error: 'item_sync_fetch_failed' })
  }
})

app.put('/api/cellar-items/:syncId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })
  const authToken = readBearerToken(req.headers.authorization)
  const session = await authenticateItemSync(syncId, authToken)
  if (!session) return res.status(401).json({ error: 'unauthorized' })

  const incoming = normalizeItemSet({ items: req.body?.items }).items

  try {
    const record = await putItemSync(syncId, incoming, session.userId)
    return res.json({
      syncId,
      items: record?.items || [],
      updatedAt: record?.updatedAt || null,
    })
  } catch (error) {
    return res.status(500).json({ error: 'item_sync_push_failed' })
  }
})

// ── YouTube recent videos proxy ────────────────────────────────────────────────
// Resolves a YouTube @handle → channel ID → RSS feed → last 5 videos.
// No API key required; uses the public RSS feed + channel page scrape.
const youtubeChannelIdCache = new Map()

app.get('/api/youtube-recent', async (req, res) => {
  const handle = String(req.query.handle || '').replace(/^@/, '').trim()
  if (!handle || !/^[A-Za-z0-9_.-]{2,60}$/.test(handle)) {
    return res.status(400).json({ error: 'Invalid handle' })
  }

  try {
    let channelId = youtubeChannelIdCache.get(handle)

    if (!channelId) {
      const pageResp = await fetch(`https://www.youtube.com/@${handle}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
      })
      if (!pageResp.ok) return res.status(502).json({ error: 'channel_page_unavailable' })
      const html = await pageResp.text()
      const match = html.match(/"channelId":"(UC[A-Za-z0-9_-]{22})"/)
      if (!match) return res.status(404).json({ error: 'channel_id_not_found' })
      channelId = match[1]
      youtubeChannelIdCache.set(handle, channelId)
    }

    const rssResp = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!rssResp.ok) return res.status(502).json({ error: 'rss_unavailable' })
    const xml = await rssResp.text()

    const videos = []
    const entryRe = /<entry>([\s\S]*?)<\/entry>/g
    let m
    while ((m = entryRe.exec(xml)) !== null && videos.length < 5) {
      const block = m[1]
      const get = (tag) => { const x = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>`)); return x ? (x[1] ?? x[2] ?? '').trim() : '' }
      const videoId = get('yt:videoId')
      const title = get('title')
      const published = get('published')
      if (videoId && title) {
        videos.push({
          videoId,
          title,
          published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        })
      }
    }

    res.set('Cache-Control', 'public, max-age=3600')
    return res.json({ channelId, handle, videos })
  } catch (err) {
    return res.status(502).json({ error: 'youtube_fetch_failed' })
  }
})

app.use(express.static(DIST_DIR, { index: false }))

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'not_found' })
  return res.sendFile(path.join(DIST_DIR, 'index.html'))
})

async function boot() {
  if (database) {
    await ensureDatabaseSchema()
  }

  app.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`Wine Guide server listening on ${PORT}`)
  })
}

boot().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to boot Wine Guide server', error)
  process.exit(1)
})
