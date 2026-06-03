/**
 * Release notes & tutorials for newly shipped portal behaviour (demo content).
 * Shared by **New releases** page and Help center teaser section.
 */

export function matchesNewReleasesQuery(blob, rawQuery) {
  const q = String(rawQuery || '').trim().toLowerCase()
  if (!q) return true
  return String(blob || '').toLowerCase().includes(q)
}

export function formatReleaseDate(isoDate) {
  if (!isoDate) return ''
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function releaseTypeLabel(type) {
  const map = { major: 'Major', minor: 'Minor', patch: 'Patch' }
  return map[type] ?? type
}

export function releaseSearchText(item) {
  return [
    item.title,
    item.summary,
    item.area,
    item.version,
    item.releaseType,
    releaseTypeLabel(item.releaseType),
    item.releaseLabel,
    formatReleaseDate(item.releasedAt),
    ...(item.tags ?? []),
    ...(item.steps ?? []),
  ].join(' ')
}

export const newReleasesTutorials = [
  {
    id: 'endorsements-v2-overview',
    version: 'v2.8.0',
    releaseType: 'minor',
    title: 'Endorsements hub: tabs and schedules in one view',
    area: 'Endorsements',
    tags: ['Endorsements', 'Dashboard', 'Schedules'],
    status: 'current',
    releasedAt: '2026-05-15',
    releaseLabel: 'May 2026',
    summary:
      'The endorsements dashboard can show full activity history, endorsements pending a schedule, and generated schedules side by side—without bouncing to separate tools.',
    steps: [
      'Open Endorsements from the left navigation.',
      'Use **All endorsements**, **Pending schedules**, or **Generated schedules** tabs at the top of the card.',
      'Search and date filters apply per tab so you narrow the slice you care about.',
    ],
    tryItPath: '/',
    tryItLabel: 'Open endorsements',
  },
  {
    id: 'pending-generate-tutorial',
    version: 'v2.7.2',
    releaseType: 'major',
    title: 'Invoice schedules from pending endorsements',
    area: 'Endorsements · Schedules',
    tags: ['Endorsements', 'Schedules', 'Bulk generate'],
    status: 'current',
    releasedAt: '2026-05-12',
    releaseLabel: 'May 2026',
    summary:
      'Select eligible completed endorsements, generate schedules in bulk, then track PDF and export readiness from one table.',
    steps: [
      'Go to **Pending schedules**.',
      'Use filters (search, **date range**, run type) to find rows.',
      'Select one or more rows; choose **Generate** (hover reads *Select rows to generate* until at least one row is eligible).',
      'Use **Clear** when more than two rows were selected but you want to reset the checkbox state.',
      'After generation, open **Generated schedules** for downloads.',
    ],
    tryItPath: '/',
    tryItLabel: 'Try on dashboard',
    altTryItPath: '/endorsements/schedule',
    altTryItLabel: 'Dedicated schedules page',
  },
  {
    id: 'table-sort-columns',
    version: 'v2.6.1',
    releaseType: 'minor',
    title: 'Sort history and schedules from column headers',
    area: 'Endorsements · Tables',
    tags: ['Endorsements', 'Tables', 'Sorting'],
    status: 'past',
    releasedAt: '2026-04-20',
    releaseLabel: 'April 2026',
    summary:
      'Column headers expose sort affordances with clear ascending and descending cues—matching behavior across endorsement history and schedule grids.',
    steps: [
      'Tap a column label (with the sort arrows) once to sort, again to toggle direction.',
      'Endorsements table supports sort on activity, dates, modes, counts, etc.',
      'Schedule tables support endorsement number, dates, amounts, status, as applicable.',
    ],
    tryItPath: '/',
    tryItLabel: 'Sort on endorsements tab',
  },
  {
    id: 'cd-claims-awareness',
    version: 'v2.5.0',
    releaseType: 'minor',
    title: 'CD balance and Claims highlights',
    area: 'CD balance · Claims',
    tags: ['CD balance', 'Claims', 'KPIs'],
    status: 'past',
    releasedAt: '2026-04-08',
    releaseLabel: 'April 2026',
    summary:
      'Recent iterations surface KPI-style snapshots and disclaimers alongside actions so employers see totals in context—not as isolated numbers.',
    steps: [
      'Open **CD Balance** from the sidebar for treasury-style dashboards (demo data).',
      'Open **Claims** to review KPI bands and disclaimers beside quick actions.',
    ],
    tryItPath: '/claims',
    tryItLabel: 'Claims overview',
    altTryItPath: '/cd-balance',
    altTryItLabel: 'CD balance',
  },
  {
    id: 'help-center-v2',
    version: 'v2.4.0',
    releaseType: 'major',
    title: 'Help center: topics, videos, and saved guides',
    area: 'Support',
    tags: ['Support', 'Help center', 'Videos'],
    status: 'past',
    releasedAt: '2026-03-18',
    releaseLabel: 'March 2026',
    summary:
      'Browse by topic, watch in-app walkthroughs with captions, and star guides for quick access from the home page.',
    steps: [
      'Open **Help center** from the sidebar.',
      'Pick a topic or search across articles and videos.',
      'Star a guide to pin it under **Saved guides** on the home page.',
    ],
    tryItPath: '/support/help',
    tryItLabel: 'Open help center',
  },
]

export function getCurrentReleases() {
  return newReleasesTutorials.filter((t) => t.status === 'current')
}

export function getPastReleaseNotes() {
  return newReleasesTutorials.filter((t) => t.status === 'past')
}

/** Group past releases by releaseLabel for accordion UI */
export function getPastReleaseGroups() {
  const past = getPastReleaseNotes()
  const map = new Map()
  past.forEach((item) => {
    const key = item.releaseLabel ?? 'Earlier'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  })
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}
