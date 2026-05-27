import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  Phone,
  PlayCircle,
  Rocket,
  Search,
  Sparkles,
  Video,
  X,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import HelpCenterEscalation from '../components/help/HelpCenterEscalation'
import {
  contactChannels,
  helpCenterQuickPrompts,
  knowledgeArticles,
  knowledgeArticleSearchText,
  matchesSupportQuery,
  videoTutorials,
} from '../data/supportHelpMock'
import { matchesNewReleasesQuery, newReleasesTutorials } from '../data/newReleasesMock'

/** Wrapped band so each browse block reads as its own surface (Stripe / Zendesk-style help). */
function HelpBrowseBand({
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
        <div className={`flex min-w-0 flex-1 items-start gap-3 py-4 pr-4 sm:gap-4 sm:py-5 sm:pl-1 sm:pr-6`}>
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
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{description}</p>
          </div>
          {toolbar ? <div className="hidden shrink-0 pt-1 sm:flex sm:items-start">{toolbar}</div> : null}
        </div>
      </div>
      {toolbar ? <div className="flex border-b border-gray-100 px-4 py-3 sm:hidden">{toolbar}</div> : null}
      <div className="bg-gray-50/40 px-4 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  )
}

function HelpContactSection({ subtitle }) {
  return (
    <HelpBrowseBand
      headingId="help-contact-heading"
      accentClass="border-l-[3px] border-l-gray-800"
      accentIconBg="bg-gray-900"
      accentIconFg="text-white"
      icon={Phone}
      title="Contact our teams"
      description={subtitle}
      countLabel="Support"
      toolbar={null}
    >
      <div className="-m-px grid gap-4 sm:grid-cols-2">
        {contactChannels.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <h3 className="text-sm font-semibold text-gray-900">{c.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{c.description}</p>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
              <div className="flex items-start gap-2 text-gray-800">
                <Phone size={16} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden />
                <span className="font-mono text-xs font-semibold">{c.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Mail size={16} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden />
                <a href={`mailto:${c.email}`} className="text-xs font-semibold text-indigo-600 hover:underline">
                  {c.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-gray-500">
                <Clock size={16} className="mt-0.5 shrink-0 text-gray-400" aria-hidden />
                <span className="text-xs">{c.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </HelpBrowseBand>
  )
}

export default function SupportHelpCenter() {
  const navigate = useNavigate()
  const { query, setQuery } = useGlobalSearch()

  const filteredArticles = useMemo(
    () =>
      knowledgeArticles.filter((a) => matchesSupportQuery(knowledgeArticleSearchText(a), query)),
    [query],
  )

  const filteredVideos = useMemo(
    () =>
      videoTutorials.filter((v) => matchesSupportQuery(`${v.title} ${v.tags.join(' ')}`, query)),
    [query],
  )

  const filteredReleases = useMemo(
    () =>
      newReleasesTutorials.filter((t) =>
        matchesNewReleasesQuery([t.title, t.summary, t.area, ...t.steps].join(' '), query),
      ),
    [query],
  )

  const totalResources = knowledgeArticles.length + videoTutorials.length + newReleasesTutorials.length
  const visibleCount = filteredArticles.length + filteredVideos.length + filteredReleases.length
  const hasActiveQuery = query.trim().length > 0
  const noMatches = hasActiveQuery && visibleCount === 0

  const resourceSummary = hasActiveQuery
    ? `${visibleCount} match${visibleCount === 1 ? '' : 'es'} · ${filteredArticles.length} articles · ${filteredVideos.length} videos · ${filteredReleases.length} release guides`
    : `${totalResources} resources · ${knowledgeArticles.length} articles · ${videoTutorials.length} videos · ${newReleasesTutorials.length} release guides`

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="Help center"
        subtitle="Browse self-serve guides or reach the right specialist."
        breadcrumbs={[]}
      />

      {/* Knowledge search — simplified content, retained hero background shell */}
      <section className="mt-6 w-full min-w-0" aria-labelledby="help-search-heading">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-300/55 bg-white shadow-xl shadow-indigo-950/[0.07] ring-1 ring-indigo-400/25">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" aria-hidden />
          <div className="absolute -right-24 -top-28 h-56 w-56 rounded-full bg-indigo-400/[0.12] blur-3xl motion-reduce:opacity-70" aria-hidden />
          <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-violet-300/10 blur-3xl motion-reduce:opacity-70" aria-hidden />

          <div className="relative border-b border-indigo-100/90 bg-gradient-to-br from-indigo-100/60 via-white to-white px-5 py-7 sm:px-10 sm:py-9">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
              <Sparkles size={13} className="shrink-0 text-indigo-500" aria-hidden />
              Knowledge base
            </div>
            <h2
              id="help-search-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
            >
              What do you need help with?
            </h2>
            <p className="mt-2 max-w-xl text-xs font-medium leading-relaxed text-gray-600">
              Articles, tutorials, and release guides—scoped to HR admin tasks. Results sync with the header search as you type.
            </p>

            <div className="relative mt-6 max-w-3xl">
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
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 shadow-inner shadow-gray-950/5 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setQuery(p.query)}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <p className="mt-4 tabular-nums text-xs font-medium tracking-tight text-gray-500">{resourceSummary}</p>
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
        <div className="mt-8 flex w-full min-w-0 flex-col gap-6">
          {hasActiveQuery && visibleCount > 0 ? (
            <p className="text-xs text-gray-600">
              <button
                type="button"
                className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
                onClick={() => navigate('/support/feedback')}
              >
                Wrong results?
              </button>
              <span className="text-gray-400"> · </span>
              <span className="text-gray-500">Tell us and we&apos;ll reroute quickly.</span>
            </p>
          ) : null}

          {/* Guides */}
          <HelpBrowseBand
            headingId="help-articles-heading"
            accentClass="border-l-[3px] border-l-indigo-600"
            accentIconBg="bg-indigo-600"
            accentIconFg="text-white"
            icon={BookOpen}
            title="Guides & articles"
            description="Step-by-step for endorsements and policy workflows."
            countLabel={`${filteredArticles.length} articles`}
          >
            {filteredArticles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-12 text-center">
                <p className="text-sm font-semibold text-gray-800">Nothing here for that search.</p>
                <p className="mt-1 text-xs text-gray-500">Clear the bar or tap a shortcut above.</p>
              </div>
            ) : (
              <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredArticles.map((a) => (
                  <li key={a.id}>
                    <Link
                      to={`/support/help/articles/${a.id}`}
                      className="group flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                      aria-label={`Read guide: ${a.title}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <FileText size={20} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-indigo-700">
                              {a.title}
                            </h3>
                            <ChevronRight
                              size={20}
                              className="mt-0.5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600"
                              aria-hidden
                            />
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-gray-600">{a.snippet}</p>
                          <p className="mt-2 line-clamp-2 text-xs leading-snug text-gray-500">
                            <span className="tabular-nums font-semibold text-gray-700">{a.readMinutes} min read</span>
                            <span className="mx-1.5 text-gray-300">·</span>
                            <span>{a.bestWhen}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                        {a.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </HelpBrowseBand>

          {/* Videos */}
          <HelpBrowseBand
            headingId="help-videos-heading"
            accentClass="border-l-[3px] border-l-slate-700"
            accentIconBg="bg-slate-800"
            accentIconFg="text-white"
            icon={Video}
            title="Video tutorials"
            description="Screen-led walkthroughs for multi-step flows."
            countLabel={`${filteredVideos.length} videos`}
          >
            {filteredVideos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-12 text-center">
                <p className="text-sm font-semibold text-gray-800">No videos match.</p>
                <p className="mt-1 text-xs text-gray-500">Widen keywords or reset search.</p>
              </div>
            ) : (
              <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((v) => (
                  <li key={v.id}>
                    <a
                      href={v.url}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-5 text-white">
                        <PlayCircle size={32} className="shrink-0 text-white/95" aria-hidden />
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold tabular-nums text-white">
                          {v.duration}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                          Watch
                        </span>
                        <span className="mt-1 text-sm font-semibold leading-snug text-gray-900 group-hover:text-indigo-700">
                          {v.title}
                        </span>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {v.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </HelpBrowseBand>

          {/* Releases */}
          <HelpBrowseBand
            headingId="help-releases-heading"
            accentClass="border-l-[3px] border-l-emerald-600"
            accentIconBg="bg-emerald-600"
            accentIconFg="text-white"
            icon={Rocket}
            title="New releases"
            description="Recently shipped—the same list lives under New releases in the sidebar."
            countLabel={`${filteredReleases.length} guides`}
            toolbar={
              <button
                type="button"
                onClick={() => navigate('/new-releases')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
              >
                All releases <ArrowRight size={14} aria-hidden />
              </button>
            }
          >
            {filteredReleases.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-12 text-center">
                <p className="text-sm font-semibold text-gray-800">No matching release guides.</p>
                <p className="mt-1 text-xs text-gray-500">
                  Reset search or{' '}
                  <button type="button" className="font-semibold text-indigo-600 hover:underline" onClick={() => navigate('/new-releases')}>
                    open releases
                  </button>
                  .
                </p>
              </div>
            ) : (
              <ul className="grid list-none gap-4 lg:grid-cols-2">
                {filteredReleases.map((t) => (
                  <li key={t.id}>
                    <article className="flex h-full flex-col rounded-xl border border-emerald-200/70 bg-white p-4 shadow-sm ring-1 ring-emerald-600/15 transition-colors hover:border-emerald-400/70">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">
                          {t.area}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                          <Sparkles size={11} aria-hidden /> Release tutorial
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold leading-snug text-gray-900">{t.title}</h3>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-600">{t.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                        <button
                          type="button"
                          onClick={() => navigate('/new-releases')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                        >
                          Full walkthrough <ArrowRight size={12} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(t.tryItPath)}
                          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/60"
                        >
                          {t.tryItLabel}
                        </button>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </HelpBrowseBand>

          <HelpContactSection subtitle="Phone and email queues by speciality. Use when urgency or policy nuance beats self-serve." />
        </div>
      ) : (
        <div className="mt-8 flex w-full min-w-0 flex-col gap-6">
          <HelpContactSection subtitle="Try a speciality desk below while we tighten search." />
        </div>
      )}

      <div className="mt-8 w-full shrink-0 pb-4">
        <HelpCenterEscalation
          onFeedback={() => navigate('/support/feedback')}
          onClearSearch={hasActiveQuery ? () => setQuery('') : undefined}
        />
      </div>
    </div>
  )
}
