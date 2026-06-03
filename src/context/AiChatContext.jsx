import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AiChatContext = createContext(null)

export function AiChatProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openChat = useCallback(() => setOpen(true), [])
  const closeChat = useCallback(() => setOpen(false), [])
  const toggleChat = useCallback(() => setOpen((v) => !v), [])

  const value = useMemo(
    () => ({ open, setOpen, openChat, closeChat, toggleChat }),
    [open, openChat, closeChat, toggleChat],
  )

  return <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>
}

export function useAiChat() {
  const ctx = useContext(AiChatContext)
  if (!ctx) {
    throw new Error('useAiChat must be used within AiChatProvider')
  }
  return ctx
}
