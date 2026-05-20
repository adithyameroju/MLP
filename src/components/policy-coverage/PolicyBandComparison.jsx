import { bandHeaderGradient } from '../../data/policyCoveragePageMock'

export default function PolicyBandComparison({ bands, className = '' }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {bands.map((b) => (
        <div
          key={b.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md transition hover:border-gray-300 hover:shadow-lg"
        >
          <div className={`bg-gradient-to-br px-4 py-4 text-white ${bandHeaderGradient(b.tint)}`}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-90">{b.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{b.sumInsured}</p>
          </div>
          <dl className="flex flex-1 flex-col gap-3 p-4 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase text-gray-400">Family</dt>
              <dd className="mt-0.5 font-semibold leading-snug text-gray-900">{b.familyCoverage}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-gray-400">Room rent</dt>
              <dd className="mt-0.5 text-gray-700">{b.roomRent}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-gray-400">Maternity</dt>
              <dd className="mt-0.5 font-semibold text-indigo-900">{b.maternity}</dd>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <dt className="text-[10px] font-bold uppercase text-violet-700">Highlight</dt>
              <dd className="mt-1 text-xs leading-relaxed text-gray-600">{b.highlight}</dd>
            </div>
          </dl>
          <div className="px-4 pb-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className={`h-full rounded-full ${b.accentClass}`} style={{ width: `${b.widthPct}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
