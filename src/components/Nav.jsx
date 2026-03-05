import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/explore',   label: 'Explore' },
  { to: '/shop',      label: 'Shops' },
  { to: '/sparkling', label: 'Sparkling' },
  { to: '/pairing',   label: 'Pairings' },
  { to: '/critics',   label: 'Critics' },
  { to: '/learn',     label: 'Learn' },
  { to: '/cellar',    label: 'My Cellar' },
]

export default function Nav() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-navy/98 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06),0_4px_32px_rgba(0,0,0,0.35)]'
        : 'bg-navy/88 backdrop-blur-sm'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <WineGlassIcon className="w-7 h-7 text-gold transition-transform duration-300 group-hover:rotate-6" />
          <span className="font-display font-semibold text-xl text-white tracking-wide">
            The Wine Guide
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname.startsWith(to)
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`font-body text-sm px-4 py-2 rounded-full transition-all duration-200
                    ${active
                      ? 'bg-gold/20 text-gold font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                    }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy/98 backdrop-blur-md border-t border-white/8 animate-fade-in">
          <ul className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="block font-body text-sm px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

function WineGlassIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10M7 3c0 4 2 7 5 8M7 3c0 4-2 7-5 8m10-8c0 4 2 7 5 8m-5-8c0 4-2 7-5 8m0 0v7m0 0h-3m3 0h3" />
    </svg>
  )
}
