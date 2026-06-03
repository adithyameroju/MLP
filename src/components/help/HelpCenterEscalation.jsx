import { Link } from 'react-router-dom'
import { MessageCircleQuestion, Phone } from 'lucide-react'
import {
  helpCardPadding,
  helpEscalationIcon,
  helpEscalationShell,
  helpLinkInline,
  helpPrimaryBtn,
  helpSecondaryBtn,
} from '../../lib/helpUiTokens'

/**
 * “Still stuck?” — primary escalation block at the bottom of help flows.
 *
 * `contactLinkTo` — use on inner help pages so “Contact support” navigates back to Help center’s contact block.
 */
export default function HelpCenterEscalation({
  emphasis = 'default',
  searchedQuery = '',
  onClearSearch,
  onFeedback,
  contactHeadingId = 'help-contact-heading',
  contactLinkTo = null,
}) {
  const isProminent = emphasis === 'prominent'

  const contactAction = contactLinkTo ? (
    <Link to={contactLinkTo} className={`${helpSecondaryBtn} gap-2 px-4 py-2 text-sm`}>
      <Phone size={16} aria-hidden />
      Contact support
    </Link>
  ) : (
    <a href={`#${contactHeadingId}`} className={`${helpSecondaryBtn} gap-2 px-4 py-2 text-sm`}>
      <Phone size={16} aria-hidden />
      Contact support
    </a>
  )

  return (
    <section
      className={`${helpEscalationShell} ${helpCardPadding} ${isProminent ? 'border-indigo-200 bg-indigo-50' : ''}`}
      aria-labelledby="help-escalation-heading"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span
            className={`${helpEscalationIcon} ${isProminent ? 'bg-indigo-600 text-white ring-indigo-600/20' : ''}`}
            aria-hidden
          >
            <MessageCircleQuestion size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="help-escalation-heading" className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-600">
              {isProminent && searchedQuery.trim() ? (
                <>
                  No hits for{' '}
                  <span className="font-semibold text-gray-800">&ldquo;{searchedQuery.trim()}&rdquo;</span>.
                  Tell us briefly what you needed—we&apos;ll route it—or try a desk below during working hours.
                </>
              ) : (
                <>
                  Send feedback and we&apos;ll route it to your account manager. Prefer to talk now?{' '}
                  {contactLinkTo ? (
                    <Link to={contactLinkTo} className={helpLinkInline}>
                      Contact support
                    </Link>
                  ) : (
                    <a href={`#${contactHeadingId}`} className={helpLinkInline}>
                      Contact support
                    </a>
                  )}
                  .
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          <button type="button" onClick={onFeedback} className={`${helpPrimaryBtn} px-4 py-2 text-sm`}>
            Share feedback
          </button>
          {typeof onClearSearch === 'function' ? (
            <button type="button" onClick={onClearSearch} className={`${helpSecondaryBtn} px-4 py-2 text-sm`}>
              Clear search
            </button>
          ) : null}
          {contactAction}
        </div>
      </div>
    </section>
  )
}
