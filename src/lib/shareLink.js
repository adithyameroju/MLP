/**
 * Build a shareable URL for HashRouter apps (path becomes #/path).
 * @param {string} routePath - e.g. '/dashboard' or '/cd-balance'
 */
export function getCanonicalPortalUrl(routePath) {
  if (typeof window === 'undefined') return routePath || ''
  const { origin, pathname } = window.location
  const p = routePath.startsWith('/') ? routePath : `/${routePath}`
  return `${origin}${pathname}#${p}`
}

/**
 * Copy link to clipboard for partner sharing.
 * @param {string} routePath
 * @returns {Promise<boolean>}
 */
export async function copyPartnerLink(routePath) {
  const url = getCanonicalPortalUrl(routePath)
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
