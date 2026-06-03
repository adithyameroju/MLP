import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { knowledgeArticles } from '../data/supportHelpMock'

const STORAGE_KEY = 'mlp_help_favorites'

const HelpFavoritesContext = createContext(null)

function readStoredFavorites() {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : Array.isArray(parsed?.articles) ? parsed.articles : []
  } catch {
    return []
  }
}

function writeStoredFavorites(articleIds) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articleIds))
  } catch {
    /* best-effort */
  }
}

export function HelpFavoritesProvider({ children }) {
  const [favoriteArticleIds, setFavoriteArticleIds] = useState(readStoredFavorites)

  const toggleArticleFavorite = useCallback((articleId) => {
    setFavoriteArticleIds((prev) => {
      const next = prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
      writeStoredFavorites(next)
      return next
    })
  }, [])

  const isArticleFavorite = useCallback((articleId) => favoriteArticleIds.includes(articleId), [favoriteArticleIds])

  const getFavoriteArticles = useCallback(
    () => knowledgeArticles.filter((a) => favoriteArticleIds.includes(a.id)),
    [favoriteArticleIds],
  )

  const value = useMemo(
    () => ({
      favoriteArticleIds,
      favoriteCount: favoriteArticleIds.length,
      toggleArticleFavorite,
      isArticleFavorite,
      getFavoriteArticles,
    }),
    [favoriteArticleIds, toggleArticleFavorite, isArticleFavorite, getFavoriteArticles],
  )

  return <HelpFavoritesContext.Provider value={value}>{children}</HelpFavoritesContext.Provider>
}

export function useHelpFavorites() {
  const ctx = useContext(HelpFavoritesContext)
  if (!ctx) {
    throw new Error('useHelpFavorites must be used within HelpFavoritesProvider')
  }
  return ctx
}
