import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'

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
const Critics        = lazy(() => import('./pages/Critics'))
const TasteProfiler  = lazy(() => import('./pages/TasteProfiler'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageLoader() {
  return <div className="min-h-screen bg-ivory pt-16" aria-hidden="true" />
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explorer />} />
          <Route path="/explore/:id" element={<WineDetail />} />
          <Route path="/sparkling" element={<Sparkling />} />
          <Route path="/pairing" element={<Pairing />} />
          <Route path="/cellar" element={<Cellar />} />
          <Route path="/learn" element={<Education />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/critics" element={<Critics />} />
          <Route path="/taste-quiz" element={<TasteProfiler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
    <div className="min-h-screen bg-ivory flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="font-display font-bold text-8xl text-gold/20 mb-4">404</p>
        <h1 className="font-display font-bold text-2xl text-slate mb-3">Page not found</h1>
        <p className="font-body text-sm text-slate-lt mb-6">This bottle seems to have been misplaced in the cellar.</p>
        <a href="#/" className="btn-primary">Back to Home</a>
      </div>
    </div>
  )
}
