import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react'
import { useAiChat } from '../../context/AiChatContext'
import { helpCardHover, helpCardSurface, helpLink } from '../../lib/helpUiTokens'

const ACTION_ICONS = {
  MessageCircle,
  Mail,
  Phone,
}

export default function HelpSupportActionCard({ action }) {
  const { openChat } = useAiChat()
  const Icon = ACTION_ICONS[action.icon] ?? MessageCircle

  const handleClick = (e) => {
    if (action.action === 'openChat') {
      e.preventDefault()
      openChat()
    }
  }

  const ctaClass = `${helpLink} inline-flex items-center gap-0.5 text-sm font-medium no-underline hover:underline`

  let ctaEl
  if (action.action === 'openChat') {
    ctaEl = (
      <button type="button" onClick={handleClick} className={ctaClass}>
        {action.cta}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    )
  } else if (action.href) {
    ctaEl = (
      <a href={action.href} className={ctaClass}>
        {action.cta}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </a>
    )
  } else {
    ctaEl = null
  }

  return (
    <article className={`flex h-full flex-col ${helpCardSurface} ${helpCardHover} p-5`}>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{action.label}</h3>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-gray-500">{action.description}</p>
      <div className="mt-4">{ctaEl}</div>
    </article>
  )
}
