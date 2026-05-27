import { Link } from 'react-router-dom'
import { MessageCircleQuestion, Phone } from 'lucide-react'

/**
 * “Still stuck?” — primary escalation. Strong visual weight matches enterprise help hubs.
 *
 * `contactLinkTo` — use on inner help pages so “Contact teams” navigates back to Help center’s contact block.
 */
export default function HelpCenterEscalation({
  emphasis = 'default',
  searchedQuery = '',
  onClearSearch,
  onFeedback,
  contactHeadingId = 'help-contact-heading',
  contactLinkTo = null,
}) {
  const prominent = emphasis === 'prominent'

  return (
    <section
      className={`relative w-full overflow-hidden rounded-2xl border px-6 py-7 sm:px-8 sm:py-10 ${
        prominent
          ? 'border-indigo-300/70 bg-gradient-to-br from-indigo-100/90 via-indigo-50/50 to-white shadow-md ring-1 ring-indigo-200/60'
          : 'border-indigo-200/80 bg-gradient-to-br from-indigo-50/95 via-white to-slate-50/40 shadow-md ring-1 ring-indigo-100/80'
      }`}
      aria-labelledby="help-escalation-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-200/25 blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              prominent ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/15' : 'bg-indigo-600 text-white shadow-sm'
            }`}
            aria-hidden
          >
            <MessageCircleQuestion size={22} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 id="help-escalation-heading" className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
              {prominent && searchedQuery.trim() ? (
                <>
                  No hits for{' '}
                  <span className="font-semibold text-gray-800">&ldquo;{searchedQuery.trim()}&rdquo;</span>.
                  Tell us briefly what you needed—we&apos;ll route it—or try a desk below during working hours.
                </>
              ) : (
                <>
                  Send feedback and we&apos;ll route to endorsements, CD, claims, or policy. Prefer a desk?{' '}
                  {contactLinkTo ? (
                    <Link to={contactLinkTo} className="font-semibold text-indigo-600 underline-offset-2 hover:underline">
                      Contact teams
                    </Link>
                  ) : (
                    <a href={`#${contactHeadingId}`} className="font-semibold text-indigo-600 underline-offset-2 hover:underline">
                      Contact teams
                    </a>
                  )}
                  .
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          <button
            type="button"
            onClick={onFeedback}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
          >
            Share feedback
          </button>
          {typeof onClearSearch === 'function' ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300/90 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25"
            >
              Clear search
            </button>
          ) : null}
          {contactLinkTo ? (
            <Link
              to={contactLinkTo}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300/90 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25"
            >
              <Phone size={17} aria-hidden />
              Contact teams
            </Link>
          ) : (
            <a
              href={`#${contactHeadingId}`}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300/90 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25"
            >
              <Phone size={17} aria-hidden />
              Contact teams
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
