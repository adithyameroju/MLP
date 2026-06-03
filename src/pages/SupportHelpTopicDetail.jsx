import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import HelpCenterEscalation from '../components/help/HelpCenterEscalation'
import HelpContactGrid from '../components/help/HelpContactGrid'
import HelpGuideCardGrid from '../components/help/HelpGuideCardGrid'
import HelpSectionHeader from '../components/help/HelpSectionHeader'
import HelpTopicSearch from '../components/help/HelpTopicSearch'
import HelpVideoList from '../components/help/HelpVideoList'
import { helpLink, helpSecondaryBtn, helpSectionBody } from '../lib/helpUiTokens'
import {
  getArticlesForTopic,
  getHelpTopicById,
  getVideosForTopic,
  knowledgeArticleSearchText,
  matchesSupportQuery,
} from '../data/supportHelpMock'

export default function SupportHelpTopicDetail() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [topicQuery, setTopicQuery] = useState('')

  const topic = useMemo(() => (topicId ? getHelpTopicById(topicId) : null), [topicId])
  const allArticles = useMemo(() => (topicId ? getArticlesForTopic(topicId) : []), [topicId])
  const allVideos = useMemo(() => (topicId ? getVideosForTopic(topicId) : []), [topicId])

  const hasActiveQuery = topicQuery.trim().length > 0

  const articles = useMemo(() => {
    if (!hasActiveQuery) return allArticles
    return allArticles.filter((a) => matchesSupportQuery(knowledgeArticleSearchText(a), topicQuery))
  }, [allArticles, topicQuery, hasActiveQuery])

  const videos = useMemo(() => {
    if (!hasActiveQuery) return allVideos
    return allVideos.filter((v) => matchesSupportQuery(`${v.title} ${v.tags.join(' ')}`, topicQuery))
  }, [allVideos, topicQuery, hasActiveQuery])

  if (!topic || topic.id === 'releases') {
    return <Navigate to="/support/help" replace />
  }

  const hasContent = allArticles.length > 0 || allVideos.length > 0
  const noMatches = hasActiveQuery && articles.length === 0 && videos.length === 0

  const breadcrumbs = [{ label: 'Help center', path: '/support/help' }, { label: topic.title }]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title={topic.title}
        subtitle={topic.subtitle}
        breadcrumbs={breadcrumbs}
        trailing={
          topic.modulePath ? (
            <Link to={topic.modulePath} className={`${helpSecondaryBtn} gap-1.5 px-3 py-2 text-xs`}>
              Open {topic.title}
              <ArrowRight size={14} aria-hidden />
            </Link>
          ) : null
        }
      />

      <div className="mt-6 w-full min-w-0">
        <HelpTopicSearch
          value={topicQuery}
          onChange={setTopicQuery}
          placeholder={`Search within ${topic.title.toLowerCase()}…`}
        />
        {hasActiveQuery ? (
          <p className="mt-2 text-xs tabular-nums text-gray-500">
            {articles.length + videos.length} result{articles.length + videos.length === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      {noMatches ? (
        <div className="mt-6 w-full">
          <HelpCenterEscalation
            emphasis="prominent"
            searchedQuery={topicQuery}
            onClearSearch={() => setTopicQuery('')}
            onFeedback={() => navigate('/support/feedback')}
            contactLinkTo="/support/help#help-contact-heading"
          />
        </div>
      ) : null}

      <div className="mt-8 w-full min-w-0 space-y-8">
        {!hasContent && !hasActiveQuery ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
            <p className="text-sm font-semibold text-gray-800">No self-serve guides for this topic yet.</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Open the tool in the portal or contact your account manager—we&apos;re expanding this library.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {topic.modulePath ? (
                <Link to={topic.modulePath} className={`${helpSecondaryBtn} gap-2 text-sm`}>
                  Open {topic.title}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              ) : null}
              <Link
                to="/support/help#help-contact-heading"
                className="inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Contact support
              </Link>
            </div>
          </div>
        ) : null}

        {!noMatches && articles.length > 0 ? (
          <section className="w-full" aria-labelledby="topic-guides-heading">
            <HelpSectionHeader
              id="topic-guides-heading"
              title="Guides & articles"
              subtitle={
                hasActiveQuery
                  ? 'Matching guides in this topic.'
                  : `${articles.length} walkthrough${articles.length === 1 ? '' : 's'} for ${topic.title.toLowerCase()}.`
              }
            />
            <div className={helpSectionBody}>
              <HelpGuideCardGrid articles={articles} />
            </div>
          </section>
        ) : null}

        {!noMatches && videos.length > 0 ? (
          <section className="w-full" aria-labelledby="topic-videos-heading">
            <HelpSectionHeader
              id="topic-videos-heading"
              title="Video tutorials"
              subtitle="Watch screen recordings for this topic."
              action={
                <Link to="/support/help/videos" className={`${helpLink} inline-flex items-center gap-1`}>
                  See all
                  <ArrowRight size={14} aria-hidden />
                </Link>
              }
            />
            <div className={helpSectionBody}>
              <HelpVideoList videos={videos} emptyMessage="No videos match your search." />
            </div>
          </section>
        ) : null}

        <section className="w-full border-t border-gray-200 pt-8">
          <HelpContactGrid topicLabel={topic.title} />
        </section>

        {!noMatches ? (
          <HelpCenterEscalation
            onFeedback={() => navigate('/support/feedback')}
            contactLinkTo="/support/help#help-contact-heading"
          />
        ) : null}
      </div>
    </div>
  )
}
