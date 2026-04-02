import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CellarCloudSyncBridge from './components/CellarCloudSyncBridge'
import InstallPrompt from './components/InstallPrompt'
import GlobalSearch from './components/GlobalSearch'

// Lazy-load pages — Vite/Rollup splits each into its own chunk.
// wines.js is shared, so it lands in its own common chunk automatically.
const Home      = lazy(() => import('./pages/Home'))
const Explorer  = lazy(() => import('./pages/Explorer'))
const WineDetail = lazy(() => import('./pages/WineDetail'))
const Sparkling = lazy(() => import('./pages/Sparkling'))
const Pairing   = lazy(() => import('./pages/Pairing'))
const Cellar    = lazy(() => import('./pages/Cellar'))
const Education = lazy(() => import('./pages/Education'))
const Shop      = lazy(() => import('./pages/Shop'))
const Places = lazy(() => import('./pages/Sheffield'))
const Critics        = lazy(() => import('./pages/Critics'))
const TasteProfiler  = lazy(() => import('./pages/TasteProfiler'))
const WishlistShare  = lazy(() => import('./pages/WishlistShare'))
const Producers      = lazy(() => import('./pages/Producers'))
const ProducerDetail = lazy(() => import('./pages/ProducerDetail'))
const VintageGuide   = lazy(() => import('./pages/VintageGuide'))

const LOADER_HINTS = [
  'Pulling together critics, styles, and pairing cues.',
  'Lining up labels, regions, and Amanda notes.',
  'Opening the next guide section with the heavy lifting already done.',
]

const NOT_FOUND_ROUTES = [
  {
    label: 'Pairing Guide',
    href: '#/pairing',
    note: 'Best when dinner is decided and the bottle still is not.',
  },
  {
    label: 'Places',
    href: '#/places',
    note: 'Move from restaurants and bars into better glasses and lists.',
  },
  {
    label: 'Sparkling',
    href: '#/sparkling',
    note: 'Open the bubbles guide when the mood is celebratory.',
  },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-ivory pt-20" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="hero-mesh rounded-[2rem] overflow-hidden border border-white/10 px-6 py-10 sm:px-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-4">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-gold-lt/80">Loading the guide</p>
              <div className="h-3 w-32 rounded-full bg-white/15" />
              <div className="h-16 max-w-xl rounded-[1.5rem] bg-white/10" />
              <div className="h-5 max-w-lg rounded-full bg-white/10" />
              <div className="h-5 max-w-md rounded-full bg-white/8" />
              <div className="flex gap-3 pt-2">
                <div className="h-11 w-40 rounded-full bg-gold/20" />
                <div className="h-11 w-40 rounded-full bg-white/10" />
              </div>
              <div className="grid gap-2 pt-3 sm:max-w-xl">
                {LOADER_HINTS.map(hint => (
                  <div
                    key={hint}
                    className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 font-body text-sm text-white/70"
                  >
                    {hint}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-gold-lt/75 mb-3">Guide snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 rounded-2xl bg-white/10" />
                <div className="h-20 rounded-2xl bg-white/10" />
                <div className="h-20 rounded-2xl bg-white/8" />
                <div className="h-20 rounded-2xl bg-white/8" />
              </div>
              <div className="mt-4 h-24 rounded-2xl bg-slate/30" />
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <div className="h-3 w-24 rounded-full bg-white/15 mb-2" />
                <div className="h-4 w-full rounded-full bg-white/10 mb-2" />
                <div className="h-4 w-4/5 rounded-full bg-white/8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppLayout() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <CellarCloudSyncBridge />
      <InstallPrompt />
      <ScrollToTop />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Nav onSearchOpen={() => setSearchOpen(true)} />
      <div className="mobile-page-padding lg:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explorer />} />
            <Route path="/explore/:id" element={<WineDetail />} />
            <Route path="/sparkling" element={<Sparkling />} />
            <Route path="/pairing" element={<Pairing />} />
            <Route path="/cellar" element={<Cellar />} />
            <Route path="/wishlist-share" element={<WishlistShare />} />
            <Route path="/learn" element={<Education />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/places" element={<Places />} />
            <Route path="/sheffield" element={<Places />} />
            <Route path="/critics" element={<Critics />} />
            <Route path="/taste-quiz" element={<TasteProfiler />} />
            <Route path="/producers" element={<Producers />} />
            <Route path="/producers/:slug" element={<ProducerDetail />} />
            <Route path="/vintages" element={<VintageGuide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-ivory pt-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="surface-panel p-8 md:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="text-center lg:text-left">
              <p className="section-label mb-3">Navigation Error</p>
              <p className="font-display font-bold text-8xl text-gold/20 mb-4">404</p>
              <h1 className="font-display font-bold text-3xl text-slate mb-3">Page not found</h1>
              <p className="font-body text-sm text-slate-lt mb-6 max-w-xl">
                This bottle seems to have been misplaced in the cellar. Head back to the guide home, or jump straight into exploring wines, pairings, or places.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <a href="#/" className="btn-primary">Back to Home</a>
                <a href="#/explore" className="btn-ghost">Open Explorer</a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-cream bg-white/70 p-5">
                <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Quick routes</p>
                <div className="space-y-3">
                  {NOT_FOUND_ROUTES.map(({ label, href, note }) => (
                    <a
                      key={label}
                      href={href}
                      className="block rounded-2xl border border-cream bg-ivory/70 px-4 py-3 font-body text-sm text-slate hover:border-gold/30 hover:text-gold transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{label}</span>
                        <span aria-hidden="true">→</span>
                      </div>
                      <p className="font-body text-xs text-slate-lt mt-1.5">{note}</p>
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-cream bg-ivory/70 p-5">
                <p className="font-body text-[11px] uppercase tracking-[0.18em] text-slate/45 mb-2">Try this instead</p>
                <p className="font-display text-2xl text-slate">Start from intent.</p>
                <p className="font-body text-sm text-slate-lt mt-2">
                  If you are not sure where you meant to go, pairing and explore are the quickest way back into the guide.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a href="#/pairing" className="chip bg-slate text-white">Dinner pairing</a>
                  <a href="#/explore?category=white" className="chip bg-white text-slate border border-cream">Explore white</a>
                  <a href="#/sparkling" className="chip bg-white text-slate border border-cream">Sparkling guide</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
