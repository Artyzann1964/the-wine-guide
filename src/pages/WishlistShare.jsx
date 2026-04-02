import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { wines as wineDB } from '../data/wines'
import { decodeWishlistPayload, getPriceTierMeta, groupWishlistByPrice } from '../utils/wishlistShare'
import { getWineVintageLabel } from '../utils/wineDisplay'

const CATEGORY_COLORS = {
  sparkling: 'bg-amber-50 text-amber-700 border-amber-200',
  white: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  rosé: 'bg-pink-50 text-pink-700 border-pink-200',
  dessert: 'bg-orange-50 text-orange-700 border-orange-200',
}

function resolveSharedWines(payloadItems = []) {
  return payloadItems.map(item => {
    const dbWine = item.wineId ? wineDB.find(w => w.id === item.wineId) : null
    return {
      ...item,
      id: dbWine?.id || item.wineId || `custom-${item.name}`,
      name: dbWine?.name || item.name || 'Unknown wine',
      producer: dbWine?.producer || item.producer || '',
      vintage: dbWine?.vintage || item.vintage || '',
      category: dbWine?.category || item.category || '',
      region: dbWine?.region || item.region || '',
      country: dbWine?.country || item.country || '',
      price: dbWine?.price || item.price || 'Price not listed',
      priceRange: dbWine?.priceRange || item.priceRange || '',
      rating: dbWine?.rating || item.rating || null,
      routeId: dbWine?.id || null,
    }
  })
}

export default function WishlistShare() {
  const location = useLocation()

  const { payload, isInvalid } = useMemo(() => {
    const encoded = new URLSearchParams(location.search).get('wl')
    if (!encoded) return { payload: null, isInvalid: false }
    const parsed = decodeWishlistPayload(encoded)
    return { payload: parsed, isInvalid: !parsed }
  }, [location.search])

  const wines = useMemo(() => resolveSharedWines(payload?.items || []), [payload])
  const grouped = useMemo(() => groupWishlistByPrice(wines), [wines])
  const ownerName = payload?.ownerName?.trim() || 'Amanda'
  const ratedCount = wines.filter(wine => wine.rating).length
  const linkedCount = wines.filter(wine => wine.routeId).length
  const leadGift = grouped[0]?.wines?.[0] || wines[0] || null

  if (isInvalid) {
    return (
      <div className="min-h-screen bg-ivory pt-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="surface-panel p-8 md:p-10 text-center">
            <p className="section-label mb-3">Gift Wishlist</p>
            <p className="text-4xl mb-3">🔗</p>
            <h1 className="font-display font-semibold text-3xl text-slate mb-3">That share link could not be read</h1>
            <p className="font-body text-slate-lt mb-6 max-w-xl mx-auto">
              This wishlist link looks broken or incomplete. Ask for a fresh share link from Amanda&apos;s Wine Guide and try again.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link className="btn-primary" to="/cellar">Back to My Cellar</Link>
              <Link className="btn-ghost" to="/explore">Browse the Guide</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!payload || wines.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="surface-panel p-8 md:p-10 text-center">
            <p className="section-label mb-3">Gift Wishlist</p>
            <p className="text-4xl mb-3">🍷</p>
            <h1 className="font-display font-semibold text-3xl text-slate mb-3">No wishlist items yet</h1>
            <p className="font-body text-slate-lt mb-6 max-w-xl mx-auto">
              This gift link is active, but no wines were included. Explore the guide instead and start a shortlist from there.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link className="btn-primary" to="/explore">Explore Amanda&apos;s Wine Guide</Link>
              <Link className="btn-ghost" to="/pairing">Start With Pairings</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory pt-20">
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-orb w-80 h-80 bg-gold/40 top-[-8rem] right-[-5rem]" />
          <div className="hero-orb w-72 h-72 bg-terracotta/35 bottom-[-6rem] left-[18%]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 relative">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_320px] lg:items-start">
            <div>
              <p className="section-label text-gold/85 mb-3">Gift Wishlist</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white text-balance">{ownerName}&rsquo;s Wine Wishlist</h1>
              <p className="font-body text-white/75 mt-3 max-w-2xl">
                Curated gift ideas grouped by budget, so friends can pick the perfect bottle quickly.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="premium-chip px-3 py-1.5 rounded-full text-xs font-body">{wines.length} wines selected</span>
                {payload.createdAt && (
                  <span className="premium-chip px-3 py-1.5 rounded-full text-xs font-body">
                    Shared {new Date(payload.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            <div className="surface-panel p-5 lg:p-6 bg-white/10 border-white/10 text-white">
              <p className="section-label text-gold/85 mb-3">Wishlist Snapshot</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  ['Bottles', wines.length],
                  ['Budgets', grouped.length],
                  ['Rated', ratedCount],
                  ['With profile', linkedCount],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-body text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</p>
                    <p className="mt-2 font-display text-2xl text-white">{value}</p>
                  </div>
                ))}
              </div>
              {leadGift && (
                <div className="rounded-2xl border border-white/10 bg-slate/35 p-4">
                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-gold/70 mb-2">Good place to start</p>
                  <p className="font-display text-xl text-white leading-tight">{leadGift.name}</p>
                  <p className="font-body text-sm text-white/60 mt-1">
                    {leadGift.producer || 'Gift-ready bottle'}
                    {leadGift.price ? ` · ${leadGift.price}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
        <div className="surface-panel p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div>
              <p className="section-label mb-2">How to use this list</p>
              <h2 className="font-display text-3xl text-slate">Pick by budget, then by bottle style</h2>
              <p className="font-body text-slate-lt mt-3 max-w-2xl">
                Each group is already organised to make gifting easier. Start with the budget that feels right, then open the full profile for any bottle that needs a closer look.
              </p>
            </div>
            <div className="rounded-2xl border border-cream bg-white/70 p-4">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Gift cue</p>
              <p className="font-display text-xl text-slate">{leadGift?.name || 'Curated shortlist'}</p>
              <p className="font-body text-sm text-slate-lt mt-2">
                The first bottle in each budget tier is a strong quick-pick if you just want a reliable yes.
              </p>
            </div>
          </div>
        </div>

        {grouped.map(group => (
          <section key={group.tier}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
              <div>
                <h2 className="font-display font-semibold text-2xl text-slate">{group.label}</h2>
                <p className="font-body text-sm text-slate-lt">{group.hint}</p>
              </div>
              <span className="chip bg-white/80 border border-cream text-slate-lt">{group.wines.length} options</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {group.wines.map(wine => (
                <article key={`${group.tier}-${wine.id}`} className="card p-5 flex flex-col gap-3 interactive-lift">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-xl text-slate leading-tight">{wine.name}</h3>
                      {wine.producer && (
                        <p className="font-body text-xs text-slate-lt mt-0.5">{wine.producer}</p>
                      )}
                    </div>
                    <span className={`tag border ${CATEGORY_COLORS[wine.category] || 'bg-cream text-slate-lt border-cream'}`}>
                      {wine.category || 'wine'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-cream px-3 py-2">
                      <p className="font-body text-[11px] uppercase tracking-wide text-slate-lt">Expected price</p>
                      <p className="font-body font-semibold text-sm text-slate">{wine.price}</p>
                    </div>
                    <div className="rounded-lg bg-cream px-3 py-2">
                      <p className="font-body text-[11px] uppercase tracking-wide text-slate-lt">Rating</p>
                      <p className="font-body font-semibold text-sm text-slate">{wine.rating ? `${wine.rating}/100` : 'Not rated'}</p>
                    </div>
                  </div>

                  <p className="font-body text-xs text-slate-lt">
                    {(wine.region || 'Region not listed')}
                    {wine.country ? `, ${wine.country}` : ''}
                    {getWineVintageLabel(wine) ? ` · ${getWineVintageLabel(wine)}` : ''}
                  </p>

                  <div className="flex gap-2 mt-auto pt-1">
                    {wine.routeId && (
                      <Link className="btn-ghost text-xs flex-1 text-center" to={`/explore/${wine.routeId}`}>
                        View Full Profile
                      </Link>
                    )}
                    <span className="btn-ghost text-xs flex-1 text-center cursor-default" title={getPriceTierMeta(wine.priceRange).hint}>
                      {getPriceTierMeta(wine.priceRange).label}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="surface-panel p-5 sm:p-6 text-center">
          <p className="font-body text-sm text-slate-lt mb-4">Want to build your own gift-ready wishlist?</p>
          <Link className="btn-primary" to="/cellar">Go to My Cellar</Link>
        </div>
      </div>
    </div>
  )
}
