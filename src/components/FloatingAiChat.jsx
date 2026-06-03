import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Sparkles, Send } from 'lucide-react'
import { useEntity } from '../context/EntityContext'
import { useAiChat } from '../context/AiChatContext'
import { chatAssistantQuickPrompts } from '../lib/portalAssistantContext'
import { assistantReplyDelay, getPortalAssistantReply } from '../lib/portalAssistantReplies'
import { chatActionChip, chatPromptChip } from '../lib/headerUiTokens'

const USER_INITIALS = 'AM'

function BotAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200"
      aria-hidden
    >
      <Sparkles className="h-4 w-4" strokeWidth={2} />
    </div>
  )
}

function UserAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 ring-2 ring-indigo-50"
      aria-hidden
    >
      {USER_INITIALS}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-indigo-600">
        <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
        <span className="chat-typing-dot chat-typing-dot-delay-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
        <span className="chat-typing-dot chat-typing-dot-delay-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
      </div>
    </div>
  )
}

const HIGHLIGHT_TONE = {
  neutral: 'border-indigo-100 bg-indigo-50/60 text-indigo-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  danger: 'border-red-200 bg-red-50 text-red-900',
}

function MessageHighlights({ highlights }) {
  if (!highlights?.length) return null
  return (
    <div className="mt-2 space-y-1.5">
      {highlights.map((h) => (
        <div
          key={`${h.label}-${h.value}`}
          className={`flex items-center justify-between gap-3 rounded-lg border px-2.5 py-1.5 text-[11px] ${HIGHLIGHT_TONE[h.tone ?? 'neutral']}`}
        >
          <span className="font-medium opacity-80">{h.label}</span>
          <span className="font-semibold tabular-nums">{h.value}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * Fixed FAB; click to open. Demo assistant with conversational replies and in-chat actions.
 */
export default function FloatingAiChat() {
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedEntity } = useEntity()
  const { open, closeChat, toggleChat } = useAiChat()
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const assistantContext = useMemo(
    () => ({
      entityLabel: selectedEntity?.label,
      policyNo: selectedEntity?.policyNo,
      pathname: location.pathname,
    }),
    [selectedEntity?.label, selectedEntity?.policyNo, location.pathname],
  )

  const [messages, setMessages] = useState(() => {
    const welcome = getPortalAssistantReply('', assistantContext)
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: `Hi! I'm your ACKO assistant. Ask me for live numbers — like your current CD balance — or tell me where you want to go.`,
        highlights: welcome.highlights,
        actions: welcome.actions,
      },
    ]
  })
  const endRef = useRef(null)
  const listRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [open, messages, pending, scrollToBottom])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, closeChat])

  const appendAssistantReply = useCallback(
    (reply) => {
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: reply.text,
          actions: reply.actions ?? [],
          highlights: reply.highlights ?? [],
        },
      ])
      setPending(false)
    },
    [],
  )

  const submitText = useCallback(
    (rawText) => {
      const text = (rawText || '').trim()
      if (!text || pending) return
      setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text }])
      setInput('')
      setPending(true)
      const reply = getPortalAssistantReply(text, assistantContext)
      window.setTimeout(() => {
        appendAssistantReply(reply)
      }, assistantReplyDelay(text))
    },
    [pending, assistantContext, appendAssistantReply],
  )

  const send = useCallback(() => submitText(input), [input, submitText])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onPromptClick = (prompt) => {
    submitText(prompt.query)
  }

  const onActionClick = (action) => {
    if (action.path) {
      navigate(action.path)
      setMessages((m) => [
        ...m,
        {
          id: `a-nav-${Date.now()}`,
          role: 'assistant',
          text: `Opening ${action.label} for you now…`,
        },
      ])
      return
    }
    if (action.message) {
      submitText(action.message)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] cursor-pointer bg-black/30 transition-opacity duration-300 ease-out ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
        onClick={closeChat}
      />

      <div className="pointer-events-none fixed bottom-5 right-5 z-[70]">
        <div className="flex max-w-[min(100vw-1rem,26rem)] flex-col-reverse items-end gap-3">
          <div className="chat-fab-glow pointer-events-auto rounded-full">
            <button
              type="button"
              onClick={toggleChat}
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-indigo-200 bg-indigo-600 text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
              aria-expanded={open}
              aria-label={open ? 'Close assistant' : 'Open assistant'}
              title="ACKO assistant"
            >
              <Sparkles className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <div
            className={`w-[min(100vw-2rem,25rem)] origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none translate-y-3 scale-[0.97] opacity-0'
            }`}
            aria-hidden={!open}
          >
            <div className="flex h-[min(80vh,36rem)] flex-col overflow-hidden rounded-xl border border-indigo-200/60 bg-white shadow-2xl ring-1 ring-indigo-100/80">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-sidebar via-[#252256] to-sidebar-hover px-4 py-3 text-white">
                <div className="flex min-w-0 items-center gap-3">
                  <BotAvatar />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">ACKO assistant</p>
                    <p className="flex items-center gap-1.5 text-xs text-indigo-200">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                      Online · ready to help
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeChat}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-indigo-100 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label="Close assistant"
                >
                  <ChevronDown className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div
                ref={listRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-indigo-50/40 to-white px-3 py-4"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex w-full items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' ? <BotAvatar /> : null}
                    <div className="max-w-[82%]">
                      <div
                        className={`rounded-2xl px-3 py-2.5 text-left text-[13px] leading-snug ${
                          msg.role === 'user'
                            ? 'rounded-br-md bg-indigo-600 text-white shadow-sm'
                            : 'rounded-bl-md border border-indigo-100 bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.role === 'assistant' ? <MessageHighlights highlights={msg.highlights} /> : null}
                      {msg.role === 'assistant' && msg.actions?.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.actions.map((action) => (
                            <button
                              key={action.id}
                              type="button"
                              disabled={pending}
                              onClick={() => onActionClick(action)}
                              className={`${chatActionChip} disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {msg.role === 'user' ? <UserAvatar /> : null}
                  </div>
                ))}
                {pending ? <TypingIndicator /> : null}
                <div ref={endRef} className="h-0 w-full shrink-0" />
              </div>

              <div className="shrink-0 border-t border-indigo-100 bg-white px-3 py-3">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-indigo-400">
                  Quick prompts
                </p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {chatAssistantQuickPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      disabled={pending}
                      onClick={() => onPromptClick(prompt)}
                      className={`${chatPromptChip} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>

                <label htmlFor="floating-ai-input" className="sr-only">
                  Message the assistant
                </label>
                <textarea
                  id="floating-ai-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={3}
                  placeholder="Try: What's my current CD? · Open claims · HRMS pending…"
                  disabled={pending}
                  className="w-full resize-none rounded-lg border border-indigo-200/80 bg-indigo-50/30 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] text-gray-400">Enter to send · Shift+Enter newline</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  )
}
