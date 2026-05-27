import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, PlayCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { matchesNewReleasesQuery, newReleasesTutorials } from '../data/newReleasesMock'

function RichSteps({ lines }) {
  return (
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
      {lines.map((line, idx) => (
        <li key={idx} className="leading-relaxed">
          {line.split('**').map((chunk, i) =>
            i % 2 === 1 ? (
              <strong key={`${line}-${i}`} className="font-semibold text-gray-800">
                {chunk}
              </strong>
            ) : (
              <span key={`${line}-${i}`}>{chunk}</span>
            ),
          )}
        </li>
      ))}
    </ol>
  )
}

export default function NewReleases() {
  const navigate = useNavigate()
  const { query } = useGlobalSearch()

  const filtered = useMemo(
    () =>
      newReleasesTutorials.filter((t) =>
        matchesNewReleasesQuery([t.title, t.summary, t.area, ...t.steps].join(' '), query),
      ),
    [query],
  )

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="New releases"
        subtitle="Tutorials for what shipped recently—so your team can adopt features without guessing."
        breadcrumbs={[]}
      />

      <p className="mt-1 text-sm text-gray-500">
        The header search filters the tutorials below. Each card ends with steps and a{' '}
        <span className="font-medium text-gray-700">Try it</span> jump into the demo screens where relevant.
      </p>

      <div className="mt-6 w-full min-w-0 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 shadow-sm">
            Nothing matches “{query.trim()}”. Clear the header search or try another keyword.
          </div>
        ) : (
          filtered.map((t) => (
            <article
              key={t.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                      {t.area}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      <PlayCircle size={14} aria-hidden /> Walkthrough
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-gray-900">{t.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{t.summary}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <button
                    type="button"
                    onClick={() => navigate(t.tryItPath)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                  >
                    {t.tryItLabel}
                    <ArrowRight size={14} aria-hidden />
                  </button>
                  {t.altTryItPath ? (
                    <button
                      type="button"
                      onClick={() => navigate(t.altTryItPath)}
                      className="cursor-pointer text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      {t.altTryItLabel}
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Steps</p>
                <RichSteps lines={t.steps} />
              </div>
            </article>
          ))
        )}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Demo content for this prototype. Production dates and rollout windows come from your account team—or open{' '}
        <button
          type="button"
          onClick={() => navigate('/support/help')}
          className="font-medium text-indigo-600 hover:underline"
        >
          Help center
        </button>{' '}
        for evergreen guides.
      </p>
    </div>
  )
}
