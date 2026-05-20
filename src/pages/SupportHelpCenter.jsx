import { useMemo } from 'react'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { ChevronRight, PlayCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import {
  contactChannels,
  knowledgeArticles,
  videoTutorials,
  matchesSupportQuery,
} from '../data/supportHelpMock'

export default function SupportHelpCenter() {
  const { query } = useGlobalSearch()

  const mergedResults = useMemo(() => {
    const articles = knowledgeArticles
      .filter((a) => matchesSupportQuery(`${a.title} ${a.snippet} ${a.tags.join(' ')}`, query))
      .map((a) => ({ kind: 'article', id: a.id, title: a.title, sub: a.snippet }))
    const videos = videoTutorials
      .filter((v) => matchesSupportQuery(`${v.title} ${v.tags.join(' ')}`, query))
      .map((v) => ({ kind: 'video', id: v.id, title: v.title, sub: v.duration, url: v.url }))
    return [...articles, ...videos]
  }, [query])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
      <PageHeader
        title="Help center"
        subtitle="Search help topics, or open contacts when you need a person."
        breadcrumbs={[]}
      />

      <p className="mt-4 text-sm text-gray-500">Type in the search field in the top bar to filter guides and videos.</p>

      <div className="mt-5 w-full min-w-0">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {mergedResults.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No matches. Try another word.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {mergedResults.map((row) => (
                <li key={`${row.kind}-${row.id}`}>
                  {row.kind === 'video' ? (
                    <a
                      href={row.url}
                      className="flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50/90"
                    >
                      <span className="mt-0.5 shrink-0 text-indigo-500">
                        <PlayCircle className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Video</span>
                        <span className="block text-sm font-medium text-gray-900">{row.title}</span>
                        <span className="text-xs text-gray-500">{row.sub}</span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 px-4 py-3">
                      <span className="mt-0.5 w-4 shrink-0" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Article</span>
                        <span className="block text-sm font-medium text-gray-900">{row.title}</span>
                        <span className="text-xs text-gray-600">{row.sub}</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className="group mt-8 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
            <span>Phone &amp; email by team</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-90" aria-hidden />
          </summary>
          <div className="mt-3 space-y-4 border-t border-gray-100 pt-3 pb-1">
            {contactChannels.map((c) => (
              <div key={c.id} className="text-sm">
                <p className="font-semibold text-gray-900">{c.label}</p>
                <p className="font-mono text-xs text-indigo-800">{c.phone}</p>
                <p className="text-xs text-gray-500">{c.hours}</p>
                <a href={`mailto:${c.email}`} className="text-xs text-indigo-600 hover:underline">
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}
