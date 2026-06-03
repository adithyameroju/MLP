import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import HelpCenterEscalation from '../components/help/HelpCenterEscalation'
import HelpContactGrid from '../components/help/HelpContactGrid'
import HelpTopicSearch from '../components/help/HelpTopicSearch'
import HelpVideoList from '../components/help/HelpVideoList'
import { helpTopics, matchesSupportQuery, videoTutorials } from '../data/supportHelpMock'
import { helpLink, helpSectionBody } from '../lib/helpUiTokens'

export default function SupportHelpVideos() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')

  const topicsWithVideos = useMemo(
    () => helpTopics.filter((t) => videoTutorials.some((v) => v.topicId === t.id)),
    [],
  )

  const filtered = useMemo(() => {
    return videoTutorials.filter((v) => {
      const matchesTopic = topicFilter === 'all' || v.topicId === topicFilter
      const text = `${v.title} ${v.tags.join(' ')} ${v.topicId}`
      const matchesQuery = !query.trim() || matchesSupportQuery(text, query)
      return matchesTopic && matchesQuery
    })
  }, [query, topicFilter])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="Video tutorials"
        subtitle="Screen-led walkthroughs for multi-step flows across the portal."
        breadcrumbs={[{ label: 'Help center', path: '/support/help' }, { label: 'Video tutorials' }]}
      />

      <div className="mt-6 w-full space-y-4">
        <HelpTopicSearch
          value={query}
          onChange={setQuery}
          placeholder="Search videos by title or topic…"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopicFilter('all')}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${
              topicFilter === 'all'
                ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            All topics
          </button>
          {topicsWithVideos.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopicFilter(t.id)}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${
                topicFilter === t.id
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          {filtered.length} video{filtered.length === 1 ? '' : 's'}
          {query.trim() ? (
            <>
              {' '}
              matching &ldquo;{query.trim()}&rdquo; —{' '}
              <button type="button" onClick={() => setQuery('')} className={`${helpLink} text-xs`}>
                clear search
              </button>
            </>
          ) : null}
        </p>
      </div>

      <div className={`${helpSectionBody} w-full`}>
        <HelpVideoList videos={filtered} emptyMessage="No videos match your filters." />
      </div>

      <div className="mt-8 w-full space-y-8">
        <HelpContactGrid />
        <HelpCenterEscalation
          onFeedback={() => navigate('/support/feedback')}
          contactLinkTo="/support/help#help-contact-heading"
        />
      </div>
    </div>
  )
}
