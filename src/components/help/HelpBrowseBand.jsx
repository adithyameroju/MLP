/** Wrapped band so each browse block reads as its own surface (Stripe / Zendesk-style help). */
export default function HelpBrowseBand({
  headingId,
  accentClass,
  accentIconBg,
  accentIconFg,
  icon: Icon,
  title,
  description,
  countLabel,
  toolbar,
  children,
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5"
      aria-labelledby={headingId}
    >
      <div className={`flex border-b border-gray-100 ${accentClass} pl-4`}>
        <div className="flex min-w-0 flex-1 items-start gap-3 py-4 pr-4 sm:gap-4 sm:py-5 sm:pl-1 sm:pr-6">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm ${accentIconBg} ${accentIconFg}`}
          >
            <Icon size={20} aria-hidden />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 id={headingId} className="text-lg font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
                {countLabel}
              </span>
            </div>
            {description ? (
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{description}</p>
            ) : null}
          </div>
          {toolbar ? <div className="hidden shrink-0 pt-1 sm:flex sm:items-start">{toolbar}</div> : null}
        </div>
      </div>
      {toolbar ? <div className="flex border-b border-gray-100 px-4 py-3 sm:hidden">{toolbar}</div> : null}
      <div className="bg-gray-50/40 px-4 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  )
}
