import {
  AlertTriangle,
  Baby,
  BedDouble,
  Calendar,
  CalendarDays,
  HeartPulse,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'

/** Single icon tone so chips scan as a list, not a rainbow. */
const CHIP_ICON_CLASS = 'h-4 w-4 shrink-0 text-violet-600'

const CHIP_ICONS = {
  Wallet,
  Calendar,
  HeartPulse,
  Baby,
  Users,
}

export default function PolicyCoverageHero({ data, bands = [] }) {
  const insurerLine = data.insurerShort || data.insurer
  const tpaLine = data.tpaMeta || `TPA: ${data.tpa}`
  const coverageLabel = data.coverageRangeColumnLabel || 'Coverage range (per family)'
  const livesLabel = data.coveredLivesColumnLabel || 'Total covered lives'
  const livesValue = data.coveredLivesValue || data.coveredLives
  const familyLabel = data.familyColumnLabel || 'Family coverage (across bands)'
  const familyShort = data.familySummaryShort || data.familySummary
  const roomRentTitle = data.roomRentStripTitle || 'Room rent by band'

  return (
    <section className="space-y-3" aria-labelledby="policy-hero-title">
      <div className="overflow-hidden rounded-2xl border border-violet-900/15 shadow-md">
        <div className="bg-gradient-to-br from-violet-800 via-violet-900 to-indigo-950 px-5 py-5 text-white sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-200/90">{data.policyLabel}</p>
              <h1 id="policy-hero-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {data.title}
              </h1>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
              {data.status === 'active' ? 'Active' : data.status}
            </span>
          </div>

          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-violet-100/95">
            <CalendarDays className="h-4 w-4 shrink-0 text-violet-200/90" aria-hidden />
            <span>{data.periodDisplay}</span>
            <span className="text-violet-400/90" aria-hidden>
              ·
            </span>
            <span>{insurerLine}</span>
            <span className="text-violet-400/90" aria-hidden>
              ·
            </span>
            <span>{tpaLine}</span>
          </p>

          <div className="mt-5 border-t border-white/15 pt-5 sm:mt-6 sm:pt-6">
            <div className="grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-0 py-4 sm:px-4 sm:py-0 sm:first:pl-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-200/85">{coverageLabel}</p>
                <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl">
                  {data.coverageRange}
                </p>
                {data.coverageRangeSubline ? (
                  <p className="mt-1 text-xs text-violet-200/80">{data.coverageRangeSubline}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 px-0 py-4 sm:px-4 sm:py-0">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-violet-200/85">
                  <Users className="h-4 w-4 shrink-0 text-violet-200/90" aria-hidden />
                  {livesLabel}
                </p>
                <p className="text-lg font-bold text-white sm:text-xl">{livesValue}</p>
              </div>
              <div className="flex flex-col gap-2 px-0 py-4 sm:px-4 sm:py-0 sm:last:pr-0">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-violet-200/85">
                  <Shield className="h-4 w-4 shrink-0 text-violet-200/90" aria-hidden />
                  {familyLabel}
                </p>
                <p className="text-sm font-medium leading-snug text-violet-50/95">{familyShort}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-5">
          <p className="mb-3 text-xs font-medium text-gray-500">Key benefits</p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {data.inclusionChips.map((c) => {
              const Icon = CHIP_ICONS[c.icon] || Wallet
              return (
                <li
                  key={c.id}
                  className="flex min-h-[2.75rem] items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-900"
                >
                  <Icon className={CHIP_ICON_CLASS} aria-hidden />
                  <span className="leading-snug">{c.label}</span>
                </li>
              )
            })}
          </ul>
        </div>

        {bands.length > 0 ? (
          <div className="border-t border-gray-200 bg-slate-50 px-4 py-3 sm:px-5">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <BedDouble className="h-3.5 w-3.5 text-gray-400" aria-hidden />
              {roomRentTitle}
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 md:mx-0 md:flex-wrap md:overflow-visible">
              {bands.map((b) => (
                <div
                  key={b.id}
                  className="min-w-[140px] shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 md:min-w-0 md:flex-1"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{b.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">{b.roomRent}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {data.conditionChips?.length > 0 ? (
          <div className="border-t border-amber-200/90 bg-amber-50/95 px-4 py-3 sm:px-5">
            <div className="flex flex-col divide-y divide-amber-200/80 sm:flex-row sm:divide-x sm:divide-y-0">
              {data.conditionChips.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-2 py-2.5 text-sm text-amber-950 first:pt-0 last:pb-0 sm:flex-1 sm:px-4 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {data.policyNumber ? (
        <p className="px-1 text-center text-[11px] text-gray-500 sm:text-left">Policy reference · {data.policyNumber}</p>
      ) : null}
    </section>
  )
}
