/**
 * Release notes & tutorials for newly shipped portal behaviour (demo content).
 * Shared by **New releases** page and Help center teaser section.
 */

export function matchesNewReleasesQuery(blob, rawQuery) {
  const q = String(rawQuery || '').trim().toLowerCase()
  if (!q) return true
  return String(blob || '').toLowerCase().includes(q)
}

export const newReleasesTutorials = [
  {
    id: 'endorsements-v2-overview',
    title: 'Endorsements hub: tabs and schedules in one view',
    area: 'Endorsements',
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
    title: 'Invoice schedules from pending endorsements',
    area: 'Endorsements · Schedules',
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
    title: 'Sort history and schedules from column headers',
    area: 'Endorsements · Tables',
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
    title: 'CD balance and Claims highlights',
    area: 'CD balance · Claims',
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
]
