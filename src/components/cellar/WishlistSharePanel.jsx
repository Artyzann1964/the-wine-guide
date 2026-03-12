import { useEffect, useMemo, useState } from 'react'
import { wines as wineDB } from '../../data/wines'
import { buildWishlistSharePayload, buildWishlistShareUrl, encodeWishlistPayload } from '../../utils/wishlistShare'
import { WISHLIST_OWNER_KEY } from './constants'

export default function WishlistSharePanel({ wishlist }) {
  const [ownerName, setOwnerName] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  useEffect(() => {
    try {
      setOwnerName(localStorage.getItem(WISHLIST_OWNER_KEY) || '')
    } catch {
      setOwnerName('')
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_OWNER_KEY, ownerName)
    } catch {
      // Ignore write failures
    }
  }, [ownerName])

  const shareUrl = useMemo(() => {
    const payload = buildWishlistSharePayload({
      ownerName,
      wishlist,
      wineLookup: wineId => wineDB.find(w => w.id === wineId),
    })
    const encoded = encodeWishlistPayload(payload)
    return buildWishlistShareUrl(encoded)
  }, [ownerName, wishlist])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setCopyError('')
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopyError('Could not copy automatically. Long-press to copy the link below.')
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      copyLink()
      return
    }
    try {
      await navigator.share({
        title: `${ownerName || 'Amanda'}'s Wine Wishlist`,
        text: 'Gift ideas by price tier from Amanda\'s Wine Guide',
        url: shareUrl,
      })
    } catch {
      // User cancelled share sheet.
    }
  }

  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-label mb-2">Wishlist Share</p>
          <h3 className="font-display font-semibold text-2xl text-slate mb-1">Share gift ideas with friends</h3>
          <p className="font-body text-sm text-slate-lt">Generate a private link that organises wines by budget so people can choose the right gift quickly.</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button onClick={nativeShare} className="btn-primary flex-1 lg:flex-none">Share</button>
          <button onClick={copyLink} className="btn-secondary flex-1 lg:flex-none">
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3 mt-4">
        <label className="block">
          <span className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Wishlist owner</span>
          <input
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
            placeholder="Amanda"
            className="w-full rounded-xl border border-cream bg-ivory px-4 py-2.5 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
          />
        </label>
        <div className="rounded-xl border border-cream bg-white px-3 py-2.5 text-xs font-mono text-slate/75 break-all">
          {shareUrl}
        </div>
      </div>

      {copyError && (
        <p className="font-body text-xs text-terracotta mt-2">{copyError}</p>
      )}
    </div>
  )
}
