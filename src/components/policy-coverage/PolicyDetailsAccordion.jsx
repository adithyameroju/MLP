import {
  ChevronDown,
  Layers,
  Users,
  BedDouble,
  Gauge,
  Baby,
  ListChecks,
  Handshake,
  Scale,
  FileText,
  Download,
  ExternalLink,
} from 'lucide-react'
import PolicyBandComparison from './PolicyBandComparison'

const ICONS = {
  Layers,
  Users,
  BedDouble,
  Gauge,
  Baby,
  ListChecks,
  Handshake,
  Scale,
  FileText,
}

function SectionBody({ section, bands }) {
  const { body } = section
  if (!body) return null

  if (body.kind === 'bands') {
    return <PolicyBandComparison bands={bands} />
  }

  if (body.kind === 'bullets') {
    return (
      <ul className="space-y-2 text-sm text-gray-700">
        {body.items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (body.kind === 'table') {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[280px] text-sm">
          <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
            <tr>
              {body.columns.map((col) => (
                <th key={col} className="px-4 py-2.5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {body.rows.map((row, i) => (
              <tr key={i} className="bg-white hover:bg-gray-50/80">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-gray-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (body.kind === 'sublimits') {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[320px] text-sm">
          <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2.5">Benefit</th>
              <th className="px-4 py-2.5">Limit</th>
              <th className="px-4 py-2.5">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {body.rows.map((r) => (
              <tr key={r.benefit} className="bg-white hover:bg-gray-50/80">
                <td className="px-4 py-2.5 font-medium text-gray-900">{r.benefit}</td>
                <td className="px-4 py-2.5 text-gray-700">{r.limit}</td>
                <td className="px-4 py-2.5 text-gray-500">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (body.kind === 'keyvalue') {
    return (
      <dl className="space-y-3">
        {body.rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-violet-700">{r.label}</dt>
            <dd className="mt-1 text-sm text-gray-800">{r.value}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (body.kind === 'inclusionsExclusions') {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <p className="text-xs font-bold uppercase text-emerald-800">Included</p>
          <ul className="mt-2 space-y-1.5 text-sm text-emerald-950">
            {body.included.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <p className="text-xs font-bold uppercase text-amber-900">Conditional</p>
          <ul className="mt-2 space-y-1.5 text-sm text-amber-950">
            {body.conditional.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600">◆</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50/40 p-4">
          <p className="text-xs font-bold uppercase text-red-800">Excluded</p>
          <ul className="mt-2 space-y-1.5 text-sm text-red-950">
            {body.excluded.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-500">×</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (body.kind === 'sourceActions') {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
        >
          <FileText className="h-4 w-4" aria-hidden />
          View original policy (PDF)
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 cursor-pointer"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download summary
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100 cursor-pointer"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View clause references
        </button>
      </div>
    )
  }

  return null
}

export default function PolicyDetailsAccordion({ sections, bands }) {
  return (
    <section aria-labelledby="policy-details-heading">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Policy details</p>
        <h2 id="policy-details-heading" className="text-xl font-bold text-gray-900">
          Full reference
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Expand a section for structured detail. Coverage bands are emphasised for quick HR comparison.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = ICONS[section.iconKey] || FileText
          return (
            <details
              key={section.id}
              id={section.id}
              className="group scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-gray-50/80 [&::-webkit-details-marker]:hidden">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="text-sm font-bold text-gray-900">{section.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{section.summary}</p>
                </div>
                <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition group-open:rotate-180" aria-hidden />
              </summary>
              <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-5 lg:px-6">
                <SectionBody section={section} bands={bands} />
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}
