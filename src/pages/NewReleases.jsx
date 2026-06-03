import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Search, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { helpLink, helpSearchInput, helpSectionSubtitle, helpSectionTitle } from '../lib/helpUiTokens'
import { ReleaseCard } from '../components/releases/ReleaseCard'
import {
  getCurrentReleases,
  getPastReleaseGroups,
  matchesNewReleasesQuery,
  releaseSearchText,
} from '../data/newReleasesMock'

export default function NewReleases() {
  const navigate = useNavigate()
  const [releaseQuery, setReleaseQuery] = useState('')
  const [openPast, setOpenPast] = useState({})

  const hasQuery = releaseQuery.trim().length > 0

  const filterFn = (t) => matchesNewReleasesQuery(releaseSearchText(t), releaseQuery)

  const current = useMemo(() => getCurrentReleases().filter(filterFn), [releaseQuery])
  const pastGroups = useMemo(() => {
    const groups = getPastReleaseGroups()
    return groups
      .map((g) => ({ ...g, items: g.items.filter(filterFn) }))
      .filter((g) => g.items.length > 0)
  }, [releaseQuery])

  const totalMatches = current.length + pastGroups.reduce((n, g) => n + g.items.length, 0)
  const hasAny = totalMatches > 0

  const togglePast = (label) => {
    setOpenPast((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="New releases"
        subtitle="Latest shipments first—browse previous releases for earlier updates."
        breadcrumbs={[]}
      />

      <section className="mt-6 w-full min-w-0" aria-labelledby="releases-search-heading">
        <label htmlFor="releases-page-search" className="sr-only">
          Search releases
        </label>
        <div className="relative max-w-2xl">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            id="releases-page-search"
            type="search"
            role="searchbox"
            inputMode="search"
            enterKeyHint="search"
            value={releaseQuery}
            onChange={(e) => setReleaseQuery(e.target.value)}
            placeholder="Search by feature, version, or topic…"
            autoComplete="off"
            className={helpSearchInput}
          />
          {hasQuery ? (
            <button
              type="button"
              onClick={() => setReleaseQuery('')}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={16} aria-hidden />
            </button>
          ) : null}
        </div>
        {hasQuery ? (
          <p id="releases-search-heading" className="mt-2 text-xs text-gray-500">
            {totalMatches} release{totalMatches === 1 ? '' : 's'} match “{releaseQuery.trim()}”
          </p>
        ) : null}
      </section>

      <div className="mt-6 w-full min-w-0 space-y-8">
        {!hasAny ? (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 shadow-sm">
            Nothing matches “{releaseQuery.trim()}”.{' '}
            <button
              type="button"
              onClick={() => setReleaseQuery('')}
              className={`${helpLink} font-semibold`}
            >
              Clear search
            </button>{' '}
            or try another keyword.
          </div>
        ) : (
          <>
            {current.length > 0 ? (
              <section aria-labelledby="releases-current-heading">
                <h2 id="releases-current-heading" className={helpSectionTitle}>
                  Latest releases
                </h2>
                <p className={helpSectionSubtitle}>
                  {current.length} current release{current.length === 1 ? '' : 's'} in this cycle.
                </p>
                <div className="mt-4 space-y-4">
                  {current.map((t) => (
                    <ReleaseCard key={t.id} item={t} navigate={navigate} prominent />
                  ))}
                </div>
              </section>
            ) : null}

            {pastGroups.length > 0 ? (
              <section aria-labelledby="releases-past-heading" className="border-t border-gray-200 pt-8">
                <h2 id="releases-past-heading" className={helpSectionTitle}>
                  Previous releases
                </h2>
                <div className="mt-4 space-y-2">
                  {pastGroups.map(({ label, items }) => {
                    const open = openPast[label] ?? false
                    return (
                      <div key={label} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() => togglePast(label)}
                          className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50"
                          aria-expanded={open}
                        >
                          <span className="text-sm font-semibold text-gray-900">{label}</span>
                          <span className="flex items-center gap-2 text-xs text-gray-500">
                            {items.length} release{items.length === 1 ? '' : 's'}
                            <ChevronDown
                              size={16}
                              className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                              aria-hidden
                            />
                          </span>
                        </button>
                        {open ? (
                          <div className="space-y-3 border-t border-gray-100 bg-gray-50/40 p-4">
                            {items.map((t) => (
                              <ReleaseCard key={t.id} item={t} navigate={navigate} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Demo content for this prototype. Production dates come from your account team—or open{' '}
        <button
          type="button"
          onClick={() => navigate('/support/help')}
          className={`${helpLink} font-medium`}
        >
          Help center
        </button>{' '}
        for evergreen guides.
      </p>
    </div>
  )
}
