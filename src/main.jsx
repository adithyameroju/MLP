import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EnsureHashRoute from './EnsureHashRoute.jsx'

/**
 * HashRouter only reads `location.hash`. Without a `#/…` segment, the first paint can be blank
 * until a later `useEffect` fixes the URL — especially in embedded previews.
 *
 * On Vite dev / preview ports we also normalize path-style URLs (`/claims`) → `#/claims`
 * for any hostname (localhost, LAN IP, tunnels). Static GitHub Pages-style deploys on :443
 * are left unchanged.
 */
function bootstrapHashRouterUrl() {
  if (typeof window === 'undefined') return
  const { pathname, search, hash, origin, port } = window.location
  const p = Number.parseInt(String(port), 10)
  const viteLikePort =
    p === 4173 || (Number.isFinite(p) && p >= 5173 && p <= 5199)
  if (!import.meta.env.DEV && !viteLikePort) return

  const hasHashRoute = typeof hash === 'string' && hash.startsWith('#/')

  if (!hasHashRoute && pathname && pathname !== '/') {
    window.location.replace(`${origin}/#${pathname}${search}`)
    return
  }

  if (
    !hasHashRoute &&
    (pathname === '/' || pathname === '') &&
    (hash === '' || hash === '#')
  ) {
    window.location.hash = '#/'
  }
}

bootstrapHashRouterUrl()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <EnsureHashRoute />
      <App />
    </HashRouter>
  </StrictMode>,
)
