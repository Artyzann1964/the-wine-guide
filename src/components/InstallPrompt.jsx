import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('pwa-dismissed') === '1')

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredPrompt || dismissed) return null

  const install = async () => {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  const dismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  return (
    <div className="fixed bottom-[5.75rem] left-4 right-4 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm z-40 rounded-3xl border border-gold/25 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/70 via-terracotta/60 to-gold/40" />
      <div className="p-4">
        <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
          <span aria-hidden="true">↓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm text-slate">Install Wine Guide</p>
          <p className="font-body text-xs text-slate-lt">
            Add it to your home screen for quicker opening, easier re-entry, and offline access when signal is patchy.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="text-slate-lt hover:text-slate text-lg leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream/70 transition-colors"
          aria-label="Dismiss install prompt"
        >
          &times;
        </button>
        </div>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
          <button onClick={install} className="btn-primary text-xs px-3 py-2 flex-shrink-0">
            Install now
          </button>
          <button
            onClick={dismiss}
            className="font-body text-xs text-slate-lt hover:text-slate rounded-full border border-cream px-3 py-2 hover:border-gold/35 transition-colors"
          >
            Not now
          </button>
          <p className="font-body text-[11px] text-slate-lt/75 sm:ml-auto">
            Best on mobile when you want the guide to behave more like an app.
          </p>
        </div>
      </div>
    </div>
  )
}
