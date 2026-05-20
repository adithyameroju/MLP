import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { useEntity } from '../context/EntityContext'
import { getPortalAssistantReply } from '../lib/portalAssistantReplies'

/**
 * Fixed FAB; click to open. Demo: rule-based assistant. Outer layer does not block clicks to content below.
 */
export default function FloatingAiChat() {
  const location = useLocation()
  const { selectedEntity } = useEntity()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text:
        "Hi — I'm your ACKO assistant (demo). Ask about CD balance, burn rate, endorsements, the history log, or how to use the portal. I answer from help text, not a live model.",
    },
  ])
  const endRef = useRef(null)
  const listRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [open, messages, pending, scrollToBottom])

  const send = useCallback(() => {
    const text = input.trim()
    if (!text || pending) return
    const userId = `u-${Date.now()}`
    setMessages((m) => [...m, { id: userId, role: 'user', text }])
    setInput('')
    setPending(true)
    const entityLabel = selectedEntity?.label
    const path = location.pathname
    window.setTimeout(() => {
      const reply = getPortalAssistantReply(text, { entityLabel, pathname: path })
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', text: reply }])
      setPending(false)
    }, 450)
  }, [input, pending, location.pathname, selectedEntity?.label])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70]">
      <div className="flex max-w-[min(100vw-1rem,22.5rem)] flex-col-reverse items-end gap-2 rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-indigo-200 bg-indigo-600 text-white shadow-md transition-transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          aria-expanded={open}
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          title="ACKO assistant (click to open)"
        >
          <Sparkles className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
        </button>

        <div
          className={`w-[min(100vw-2rem,22rem)] overflow-hidden transition-all duration-200 ease-out ${
            open
              ? 'pointer-events-auto max-h-[min(70vh,28rem)] opacity-100'
              : 'pointer-events-none max-h-0 opacity-0'
          }`}
          aria-hidden={!open}
        >
          <div className="mb-0 flex max-h-[min(70vh,28rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 px-3 py-2.5">
              <p className="text-[12px] font-semibold text-gray-900">ACKO assistant</p>
              <p className="text-[10px] text-gray-500">Demo — replies are pre-written, not a live model.</p>
            </div>

            <div
              ref={listRef}
              className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2 py-2"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-left text-[13px] leading-snug text-gray-800 ${
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-indigo-600 text-white'
                        : 'rounded-bl-sm border border-gray-100 bg-gray-50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {pending ? (
                <div className="flex justify-start pl-0.5">
                  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 px-3 py-2 text-gray-500">
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
                    <span className="text-xs">Writing…</span>
                  </div>
                </div>
              ) : null}
              <div ref={endRef} className="h-0 w-full shrink-0" />
            </div>

            <div className="border-t border-gray-100 p-2.5">
              <label htmlFor="floating-ai-input" className="sr-only">
                Message the assistant
              </label>
              <textarea
                id="floating-ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="Ask about CD, endorsements, or the portal…"
                disabled={pending}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[10px] text-gray-400">Enter to send · Shift+Enter newline</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!input.trim() || pending}
                  onClick={send}
                >
                  <Send className="h-3.5 w-3.5" aria-hidden />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
