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
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-40 card p-4 shadow-2xl border border-gold/30 flex items-center gap-3">
      <div className="flex-1">
        <p className="font-display font-semibold text-sm text-slate">Install Wine Guide</p>
        <p className="font-body text-xs text-slate-lt">Add to home screen for offline access</p>
      </div>
      <button onClick={install} className="btn-primary text-xs px-3 py-1.5 flex-shrink-0">Install</button>
      <button onClick={dismiss} className="text-slate-lt hover:text-slate text-lg leading-none">&times;</button>
    </div>
  )
}
