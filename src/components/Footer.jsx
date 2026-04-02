import { Link } from 'react-router-dom'
import { AmandaAvatar, AmandaBrandGlyph } from './Logo'

const GUIDE_CLOSE_ROUTES = [
  {
    label: 'Explore the guide',
    to: '/explore',
    note: 'Filter by style, price, producer, or country when you want the full picture.',
  },
  {
    label: 'Start with pairings',
    to: '/pairing',
    note: 'Best when dinner is already decided and the bottle still is not.',
  },
  {
    label: 'Open my cellar',
    to: '/cellar',
    note: 'Save the good ideas, keep notes, and make the next choice faster.',
  },
]

export default function Footer() {
  return (
    <footer className="bg-slate text-white/70 mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 mb-10">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div>
              <p className="font-body text-[11px] tracking-[0.18em] uppercase text-gold/75 mb-2">Guide Close</p>
              <h3 className="font-display text-3xl text-white">Keep the next bottle easy.</h3>
              <p className="font-body text-sm text-white/55 mt-3 max-w-2xl">
                Explore the guide when you want depth, open pairings when dinner is already on the go, or save bottles to the cellar so the good ideas stick.
              </p>
            </div>
            <div className="space-y-3">
              {GUIDE_CLOSE_ROUTES.map(({ label, to, note }) => (
                <Link
                  key={to}
                  to={to}
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-body text-sm text-white">{label}</span>
                    <span aria-hidden="true" className="text-white/65">→</span>
                  </div>
                  <p className="font-body text-xs text-white/45 mt-1.5">{note}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <AmandaAvatar size={22} alt="Amanda Holmes" />
              <AmandaBrandGlyph size={18} />
              <div>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-gold/80">Amanda's</p>
                <p className="font-display text-lg text-white font-semibold leading-none">Wine Guide</p>
                <p className="font-body text-[10px] tracking-[0.16em] uppercase text-white/45 mt-0.5">by Richard</p>
              </div>
            </div>
            <p className="font-body text-xs leading-relaxed text-white/50">
              Amanda's curated guide to the world's finest wines — a personal gift by Richard, built for curious drinkers, enthusiastic cooks, and anyone who believes life is too short for bad wine.
            </p>
            <div className="flex gap-2 mt-4">
              <Link to="/explore" className="chip bg-white/10 text-white hover:bg-white/20">Explore</Link>
              <Link to="/pairing" className="chip bg-gold/20 text-gold-lt hover:bg-gold/30">Pairings</Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gold mb-4 font-medium">Explore</h4>
            <ul className="space-y-2">
              {[
                ['Sparkling Wines', '/sparkling'],
                ['White Wines', '/explore?category=white'],
                ['Red Wines', '/explore?category=red'],
                ['Rosé & Dessert', '/explore?category=rosé'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="font-body text-xs hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gold mb-4 font-medium">Learn</h4>
            <ul className="space-y-2">
              {[
                ['How Wine Is Made', '/learn#production'],
                ['Reading a Label', '/learn#labels'],
                ['Understanding Vintages', '/learn#vintages'],
                ['Food Pairings', '/pairing'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="font-body text-xs hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cellar */}
          <div>
            <h4 className="font-body text-xs tracking-[0.15em] uppercase text-gold mb-4 font-medium">My Cellar</h4>
            <ul className="space-y-2">
              {[
                ['My Bottles', '/cellar'],
                ['Wishlist', '/cellar#wishlist'],
                ['Tasting Notes', '/cellar#tasted'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="font-body text-xs hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} Amanda's Wine Guide by Richard. All wine notes are for informational purposes.
          </p>
          <p className="font-body text-xs text-white/30">
            Please drink responsibly. Must be 18+ to purchase alcohol.
          </p>
        </div>
      </div>
    </footer>
  )
}
