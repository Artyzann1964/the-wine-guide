import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Ensure the app-shell bundle changes with this release so existing PWA/browser
// caches discover the new lazy-loaded Budapest Places chunk immediately.
document.documentElement.dataset.release = 'budapest-guide-2026-08-28'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
