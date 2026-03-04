import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate text-white/70 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold text-xl">⌀</span>
              <span className="font-display text-lg text-white font-semibold">The Wine Guide</span>
            </div>
            <p className="font-body text-xs leading-relaxed text-white/50">
              A curated guide to the world's finest wines — built for curious drinkers, enthusiastic cooks, and anyone who believes life is too short for bad wine.
            </p>
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
            © {new Date().getFullYear()} The Wine Guide. All wine notes are for informational purposes.
          </p>
          <p className="font-body text-xs text-white/30">
            Please drink responsibly. Must be 18+ to purchase alcohol.
          </p>
        </div>
      </div>
    </footer>
  )
}
