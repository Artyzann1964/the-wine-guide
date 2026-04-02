import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NavLogo } from './Logo'

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/places', label: 'Places' },
  { to: '/shop', label: 'Shops' },
  { to: '/sparkling', label: 'Sparkling' },
  { to: '/pairing', label: 'Pairings' },
  { to: '/taste-quiz', label: 'My Taste' },
  { to: '/critics', label: 'Critics' },
  { to: '/vintages', label: 'Vintages' },
  { to: '/learn', label: 'Learn' },
  { to: '/cellar', label: 'My Cellar' },
]

const MOBILE_DOCK_LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/explore', label: 'Explore', icon: 'explore' },
  { to: '/places', label: 'Places', icon: 'places' },
  { to: '/pairing', label: 'Pair', icon: 'pairing' },
  { to: '/cellar', label: 'Cellar', icon: 'cellar' },
]

const MOBILE_QUICK_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/places', label: 'Places' },
]

function isActivePath(pathname, to) {
  if (to === '/places') return pathname.startsWith('/places') || pathname.startsWith('/sheffield')
  if (to === '/') return pathname === '/'
  return pathname.startsWith(to)
}

export default function Nav({ onSearchOpen }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [menuOpen])

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(21, 22, 40, 0.97)' : 'rgba(25, 26, 46, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.07), 0 14px 36px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <NavLogo />

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/18 bg-white/10 text-white/70 hover:text-white hover:bg-white/16 transition-all"
              aria-label="Search wines (⌘K)"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-body text-xs">Search</span>
              <kbd className="font-body text-xs text-white/40 border border-white/20 rounded px-1 py-0.5 leading-none">⌘K</kbd>
            </button>
            <ul className="hidden lg:flex items-center gap-1 rounded-full border border-white/18 bg-white/10 p-1.5 backdrop-blur-xl shadow-[0_8px_26px_rgba(0,0,0,0.2)]">
              {NAV_LINKS.map(({ to, label }) => {
                const active = isActivePath(location.pathname, to)
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`relative px-3.5 py-2 font-body text-sm rounded-full transition-all duration-200 ${
                        active ? 'text-white bg-gold/30 shadow-gold' : 'text-white/90 hover:text-white hover:bg-white/16'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="lg:hidden flex items-center gap-2 min-w-0 flex-1 justify-end">
            <div className="hidden min-[360px]:flex items-center gap-1.5 min-w-0">
              {MOBILE_QUICK_LINKS.map(({ to, label }) => {
                const active = isActivePath(location.pathname, to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-2.5 py-1.5 rounded-full font-body text-[11px] tracking-wide transition-all ${
                      active
                        ? 'bg-gold/30 text-white border border-gold/45'
                        : 'bg-white/10 text-white/85 border border-white/15'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
            <button
              onClick={onSearchOpen}
              className="h-10 w-10 rounded-xl border border-white/15 bg-white/6 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Search wines"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="h-10 rounded-xl border border-white/15 bg-white/6 flex items-center justify-center gap-1.5 px-3 hover:bg-white/10 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className="hidden min-[440px]:inline font-body text-[11px] tracking-wide text-white/90 uppercase">Menu</span>
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none">
                {menuOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M4 6h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-250 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute inset-0 bg-black/45"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu overlay"
        />
        <aside className="absolute top-20 left-4 right-4 mx-auto max-w-md surface-panel p-4 safe-bottom">
          <p className="section-label mb-3">Navigate</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                setMenuOpen(false)
                onSearchOpen?.()
              }}
              className="rounded-xl px-3 py-3 text-sm font-body bg-slate text-white text-left"
            >
              Search the guide
            </button>
            <Link
              to="/pairing"
              className="block rounded-xl px-3 py-3 text-sm font-body bg-white/70 text-slate-lt hover:bg-white hover:text-slate transition-colors"
            >
              Start with pairings
            </Link>
          </div>
          <div className="rounded-2xl border border-cream bg-white/70 px-4 py-3 mb-4">
            <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-1">Quick read</p>
            <p className="font-display text-xl text-slate">Explore, then save</p>
            <p className="font-body text-sm text-slate-lt mt-2">
              Use the menu for a fast jump, then keep the best bottles in My Cellar once you find them.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map(({ to, label }) => {
              const active = isActivePath(location.pathname, to)
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block rounded-xl px-3 py-3 text-sm font-body transition-colors ${
                      active
                        ? 'bg-slate text-white'
                        : 'bg-white/70 text-slate-lt hover:bg-white hover:text-slate'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>

      <nav className="lg:hidden fixed bottom-2 left-4 right-4 z-50">
        <div
          className="rounded-[1.35rem] border border-white/50 px-1.5 py-1 safe-bottom shadow-[0_18px_40px_rgba(25,26,46,0.18)]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.78), rgba(255,255,255,0.62))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <ul className="grid grid-cols-5 gap-1">
            {MOBILE_DOCK_LINKS.map(({ to, label, icon }) => {
              const active = isActivePath(location.pathname, to)
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all ${
                      active
                        ? 'bg-slate/92 text-white shadow-[0_8px_18px_rgba(32,35,58,0.2)]'
                        : 'text-slate-lt hover:text-slate hover:bg-white/70'
                    }`}
                  >
                    <NavIcon type={icon} active={active} />
                    <span className="font-body text-[10px] font-semibold tracking-wide">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}

function NavIcon({ type, active }) {
  const stroke = active ? '#FFFFFF' : 'currentColor'
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
      {type === 'home' && (
        <path d="M3 9.2L10 3l7 6.2V17h-4.2v-4.5H7.2V17H3V9.2z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
      )}
      {type === 'explore' && (
        <>
          <circle cx="9" cy="9" r="5.5" stroke={stroke} strokeWidth="1.5" />
          <path d="M13 13l4 4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {type === 'pairing' && (
        <>
          <path d="M6 4v5M8 4v5M5 7h4M7 9v7" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13.8 4c1.3 0 2.2 1 2.2 2.4 0 2.4-2 3.3-2.8 4.4-.3.4-.4.7-.4 1.1V16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {type === 'learn' && (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H16v13H6.5A2.5 2.5 0 0 0 4 18V5.5z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M7.5 6.5h5M7.5 9.5h5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {type === 'places' && (
        <>
          <path d="M10 3l5 2v4.8c0 3.2-2.1 6.1-5 7.2-2.9-1.1-5-4-5-7.2V5l5-2z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 9.5h4M10 7.5v4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {type === 'cellar' && (
        <>
          <rect x="4" y="5" width="12" height="11" rx="1.7" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 5V3.7c0-.9.7-1.7 1.7-1.7h.6c1 0 1.7.8 1.7 1.7V5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
