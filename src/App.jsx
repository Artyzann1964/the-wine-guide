import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explorer from './pages/Explorer'
import WineDetail from './pages/WineDetail'
import Sparkling from './pages/Sparkling'
import Pairing from './pages/Pairing'
import Cellar from './pages/Cellar'
import Education from './pages/Education'
import Shop from './pages/Shop'
import Critics from './pages/Critics'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Nav />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
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
