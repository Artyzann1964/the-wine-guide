import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DIST_DIR = path.join(__dirname, 'dist')
const STORE_PATH = process.env.CELLAR_SYNC_STORE_PATH || path.join(__dirname, 'data', 'cellar-sync-store.json')
const PORT = Number(process.env.PORT || 3000)

const app = express()
app.use(express.json({ limit: '2mb' }))

let writeQueue = Promise.resolve()

function normalizeSyncId(value) {
  const raw = String(value || '').trim()
  if (!/^[a-zA-Z0-9_-]{8,96}$/.test(raw)) return ''
  return raw
}

function normalizeCellarShape(value) {
  const data = value && typeof value === 'object' ? value : {}
  return {
    bottles: Array.isArray(data.bottles) ? data.bottles : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
    tasted: Array.isArray(data.tasted) ? data.tasted : [],
  }
}

async function ensureStoreDir() {
  await mkdir(path.dirname(STORE_PATH), { recursive: true })
}

async function readStore() {
  try {
    const text = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(text)
    const syncs = parsed?.syncs && typeof parsed.syncs === 'object' ? parsed.syncs : {}
    return { syncs }
  } catch {
    return { syncs: {} }
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

app.get('/api/cellar-sync/:syncId', async (req, res) => {
  const syncId = normalizeSyncId(req.params.syncId)
  if (!syncId) return res.status(400).json({ error: 'invalid_sync_id' })

  const store = await readStore()
  const record = store.syncs[syncId]
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

  const result = await withStoreWrite(async () => {
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
      cellar: incomingCellar,
      updatedAt: new Date().toISOString(),
    }
    store.syncs[syncId] = nextRecord
    await writeStore(store)

    return {
      syncId,
      revision,
      cellar: incomingCellar,
      updatedAt: nextRecord.updatedAt,
      stale: false,
    }
  })

  return res.json(result)
})

app.use(express.static(DIST_DIR, { index: false }))

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'not_found' })
  return res.sendFile(path.join(DIST_DIR, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Wine Guide server listening on ${PORT}`)
})
