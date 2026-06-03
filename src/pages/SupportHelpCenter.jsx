import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Sparkles, X } from 'lucide-react'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { useHelpFavorites } from '../context/HelpFavoritesContext'
import PageHeader from '../components/PageHeader'
import BrowseByTopic from '../components/help/BrowseByTopic'
import HelpCenterEscalation from '../components/help/HelpCenterEscalation'
import HelpContactGrid from '../components/help/HelpContactGrid'
import HelpFavoritesStrip from '../components/help/HelpFavoritesStrip'
import HelpGuideCardGrid from '../components/help/HelpGuideCardGrid'
import HelpSectionHeader from '../components/help/HelpSectionHeader'
import HelpVideoList from '../components/help/HelpVideoList'
import { ReleaseTeaserCard } from '../components/releases/ReleaseCard'
import {
  helpCenterQuickPrompts,
  knowledgeArticles,
  knowledgeArticleSearchText,
  matchesSupportQuery,
  videoTutorials,
} from '../data/supportHelpMock'
import { matchesNewReleasesQuery, getCurrentReleases, releaseSearchText } from '../data/newReleasesMock'
import {
  helpCardGridGap,
  helpHeroInner,
  helpHeroPromptChip,
  helpHeroShell,
  helpLink,
  helpSearchInput,
  helpSectionBody,
  helpSectionSubtitle,
  helpSectionTitle,
} from '../lib/helpUiTokens'

function searchResultsSummary(articles, videos, releases, total) {
  const parts = []
  if (articles > 0) parts.push(`${articles} article${articles === 1 ? '' : 's'}`)
  if (videos > 0) parts.push(`${videos} video${videos === 1 ? '' : 's'}`)
  if (releases > 0) parts.push(`${releases} release guide${releases === 1 ? '' : 's'}`)
  const breakdown = parts.length ? parts.join(', ') : 'no matches'
  return `${total} match${total === 1 ? '' : 'es'} — ${breakdown}`
}

export default function SupportHelpCenter() {
  const navigate = useNavigate()
  const { query, setQuery } = useGlobalSearch()
  const { getFavoriteArticles } = useHelpFavorites()

  const hasActiveQuery = query.trim().length > 0
  const favoriteArticles = useMemo(() => getFavoriteArticles(), [getFavoriteArticles])

  const filteredArticles = useMemo(() => {
    if (!hasActiveQuery) return []
    return knowledgeArticles.filter((a) => matchesSupportQuery(knowledgeArticleSearchText(a), query))
  }, [query, hasActiveQuery])

  const filteredVideos = useMemo(() => {
    if (!hasActiveQuery) return []
    return videoTutorials.filter((v) => matchesSupportQuery(`${v.title} ${v.tags.join(' ')}`, query))
  }, [query, hasActiveQuery])

  const currentReleases = useMemo(() => getCurrentReleases(), [])
  const filteredReleases = useMemo(
    () => currentReleases.filter((t) => matchesNewReleasesQuery(releaseSearchText(t), query)),
    [query, currentReleases],
  )

  const visibleCount = filteredArticles.length + filteredVideos.length + filteredReleases.length
  const noMatches = hasActiveQuery && visibleCount === 0
  const showSearchResults = hasActiveQuery && !noMatches
  const showReleasesBand =
    !noMatches && (!hasActiveQuery || filteredReleases.length > 0)

  const searchResultsLine = hasActiveQuery
    ? searchResultsSummary(filteredArticles.length, filteredVideos.length, filteredReleases.length, visibleCount)
    : null

  const displayVideos = hasActiveQuery ? filteredVideos : videoTutorials
  const topTopicBrowsePath =
    filteredArticles[0]?.topicId != null
      ? `/support/help/topics/${filteredArticles[0].topicId}`
      : filteredVideos[0]?.topicId != null
        ? `/support/help/topics/${filteredVideos[0].topicId}`
        : '/support/help/topics/endorsements'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="Help center"
        subtitle="Browse self-serve guides or reach the right specialist."
        breadcrumbs={[]}
      />

      <section className="mt-6 w-full min-w-0" aria-labelledby="help-search-heading">
        <div className={helpHeroShell}>
          <div className={helpHeroInner}>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-200">
              <Sparkles size={13} className="shrink-0 text-indigo-300" aria-hidden />
              Knowledge base
            </div>
            <h2 id="help-search-heading" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              What do you need help with?
            </h2>
            <p className="mt-2 truncate text-sm font-medium text-indigo-200 sm:whitespace-nowrap">
              Browse tutorials, step-by-step guides, FAQs and video walkthroughs
            </p>

            <div className="relative mt-6 max-w-2xl">
              <label htmlFor="help-center-primary-search" className="sr-only">
                Search help articles and videos
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                id="help-center-primary-search"
                type="text"
                role="searchbox"
                inputMode="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CD wallet, bulk delete, HRMS sync…"
                autoComplete="off"
                className={helpSearchInput}
              />
              {hasActiveQuery ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={17} aria-hidden />
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {helpCenterQuickPrompts.map((p) => (
                <button key={p.id} type="button" onClick={() => setQuery(p.query)} className={helpHeroPromptChip}>
                  {p.label}
                </button>
              ))}
            </div>

            {searchResultsLine ? (
              <p className="mt-4 tabular-nums text-xs font-medium tracking-tight text-indigo-300/90">{searchResultsLine}</p>
            ) : null}
          </div>
        </div>
      </section>

      {noMatches ? (
        <div className="mt-6 w-full">
          <HelpCenterEscalation
            emphasis="prominent"
            searchedQuery={query}
            onClearSearch={() => setQuery('')}
            onFeedback={() => navigate('/support/feedback')}
          />
        </div>
      ) : null}

      {!noMatches ? (
        <div className="mt-8 flex w-full min-w-0 flex-col gap-8">
          {showSearchResults ? (
            <div className="space-y-1">
              <p className="text-sm text-gray-700">{searchResultsSummary(filteredArticles.length, filteredVideos.length, filteredReleases.length, visibleCount)}.</p>
              {filteredArticles.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Try broader terms or{' '}
                  <Link to={topTopicBrowsePath} className={`${helpLink} font-semibold`}>
                    browse by topic
                  </Link>
                  .
                </p>
              ) : (
                <p className="text-xs text-gray-600">
                  <button
                    type="button"
                    className={`${helpLink} font-semibold underline-offset-2`}
                    onClick={() => navigate('/support/feedback')}
                  >
                    Wrong results?
                  </button>
                  <span className="text-gray-400"> · </span>
                  <span className="text-gray-500">Tell us and we&apos;ll reroute quickly.</span>
                </p>
              )}
            </div>
          ) : null}

          {!hasActiveQuery && favoriteArticles.length > 0 ? <HelpFavoritesStrip articles={favoriteArticles} /> : null}

          {!hasActiveQuery ? <BrowseByTopic releaseGuideCount={currentReleases.length} /> : null}

          {showSearchResults && filteredArticles.length > 0 ? (
            <section className="w-full" aria-labelledby="help-articles-heading">
              <HelpSectionHeader
                id="help-articles-heading"
                title="Guides & articles"
                subtitle="Written walkthroughs matching your search."
              />
              <div className={helpSectionBody}>
                <HelpGuideCardGrid articles={filteredArticles} />
              </div>
            </section>
          ) : null}

          {showSearchResults && filteredVideos.length > 0 ? (
            <section className="w-full" aria-labelledby="help-videos-search-heading">
              <HelpSectionHeader
                id="help-videos-search-heading"
                title="Video tutorials"
                subtitle="Screen-led walkthroughs matching your search."
              />
              <div className={helpSectionBody}>
                <HelpVideoList videos={filteredVideos} emptyMessage="No videos match your search." />
              </div>
            </section>
          ) : null}

          {!hasActiveQuery ? (
            <section className="w-full" aria-labelledby="help-videos-heading">
              <HelpSectionHeader
                id="help-videos-heading"
                title="Video tutorials"
                subtitle="Screen-led walkthroughs for multi-step flows across modules."
                action={
                  <Link to="/support/help/videos" className={`${helpLink} inline-flex items-center gap-1`}>
                    See all
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                }
              />
              <div className={helpSectionBody}>
                <HelpVideoList videos={displayVideos} limit={4} emptyMessage="No videos available." />
              </div>
            </section>
          ) : null}

          {showReleasesBand && (hasActiveQuery ? filteredReleases.length > 0 : true) ? (
            <section className="w-full" aria-labelledby="help-releases-heading">
              <HelpSectionHeader
                id="help-releases-heading"
                title="New releases"
                subtitle="Recently shipped walkthroughs for new features."
                action={
                  <Link
                    to="/new-releases"
                    className={`${helpLink} inline-flex items-center gap-1`}
                  >
                    All releases
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                }
              />
              <ul className={`${helpSectionBody} grid list-none sm:grid-cols-2 ${helpCardGridGap}`}>
                {(hasActiveQuery ? filteredReleases : currentReleases).map((t, index) => (
                  <li key={t.id} className="flex">
                    <ReleaseTeaserCard
                      item={t}
                      showLatest={!hasActiveQuery && index === 0}
                      onViewRelease={() => navigate('/new-releases')}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <HelpContactGrid />
        </div>
      ) : (
        <div className="mt-8 flex w-full min-w-0 flex-col gap-8">
          <HelpContactGrid />
        </div>
      )}

      {!noMatches ? (
        <div className="mt-8 w-full shrink-0 pb-4">
          <HelpCenterEscalation
            onFeedback={() => navigate('/support/feedback')}
            onClearSearch={hasActiveQuery ? () => setQuery('') : undefined}
          />
        </div>
      ) : null}
    </div>
  )
}
