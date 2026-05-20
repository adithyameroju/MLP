import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const GlobalSearchContext = createContext(null)

export function GlobalSearchProvider({ children }) {
  const [query, setQuery] = useState('')

  const clear = useCallback(() => setQuery(''), [])

  const value = useMemo(() => ({ query, setQuery, clear }), [query, clear])

  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext)
  if (!ctx) {
    throw new Error('useGlobalSearch must be used within GlobalSearchProvider')
  }
  return ctx
}
