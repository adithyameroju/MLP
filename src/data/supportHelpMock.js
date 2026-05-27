/** HR-facing help & support — mock CMS/API shape */

export const contactChannels = [
  {
    id: 'claims',
    label: 'Claims support',
    description: 'Cashless, reimbursements, and claim status',
    phone: '1800-XXX-2525',
    hours: 'Mon–Sat, 9:00–18:00 IST',
    email: 'claims-hr@example.com',
  },
  {
    id: 'endorsements',
    label: 'Endorsements desk',
    description: 'Adds, updates, deletions, and HRMS sync',
    phone: '1800-XXX-3636',
    hours: 'Mon–Fri, 9:00–19:00 IST',
    email: 'endorsements@example.com',
  },
  {
    id: 'cd',
    label: 'CD wallet & premium accounting',
    description: 'Cash deposit balance and recharge',
    phone: '1800-XXX-4747',
    hours: 'Mon–Fri, 10:00–17:00 IST',
    email: 'cd-wallet@example.com',
  },
  {
    id: 'policy',
    label: 'Policy & coverage',
    description: 'Coverage rules, bands, and employee FAQs',
    phone: '1800-XXX-5858',
    hours: 'Mon–Fri, 9:00–18:00 IST',
    email: 'policy-support@example.com',
  },
]

/** @typedef {{ id: string, heading: string, paragraphs: string[] }} KnowledgeArticleSection */

export const knowledgeArticles = [
  {
    id: 'kb_add_quick',
    title: 'Quick Add: plans, dependents, and CD impact',
    tags: ['add employee', 'quick add', 'cd', 'dependents'],
    snippet: 'Walk through adding up to five employees in one batch and when premium is drawn from your CD wallet.',
    readMinutes: 4,
    bestWhen: 'You need to enrol a small batch without opening the full Quick Add spreadsheet flow.',
    outcome: 'You will know exactly when premium hits the CD wallet and what to validate before submit.',
    tryItLabel: 'Open Quick Add',
    tryItPath: '/add/quick',
    detailSections: [
      {
        id: 's1',
        heading: 'Before you start',
        paragraphs: [
          'Confirm employee IDs follow your HR convention—duplicates fail validation and block the batch.',
          'Have plan selections ready; dependent rules follow the active master policy for this entity.',
        ],
      },
      {
        id: 's2',
        heading: 'CD and premium timing',
        paragraphs: [
          'Premium is reserved against your cash deposit (CD) balance when you submit—not when endorsements finalize in the insurer system.',
          'If runway looks tight after preview, recharge or narrow the batch before confirming.',
        ],
      },
      {
        id: 's3',
        heading: 'After submission',
        paragraphs: [
          'Successful Quick Add rows appear on the endorsement schedule with a clear status; use that list as your audit trail for HR stakeholders.',
          'Employees without email on file still get created; reminder comms depend on your org’s notification settings.',
        ],
      },
    ],
  },
  {
    id: 'kb_update_life',
    title: 'Life events: spouse and newborn on cover',
    tags: ['update', 'spouse', 'newborn', 'maternity'],
    snippet: 'Steps to register dependents after marriage or birth, including documents HR typically needs.',
    readMinutes: 5,
    bestWhen: 'A life event landed in HR and dependents must reflect on corporate cover without delaying care.',
    outcome: 'You will collect the right proofs once and submit an endorsement that underwriting can approve quickly.',
    tryItLabel: 'Life event flows',
    tryItPath: '/update',
    detailSections: [
      {
        id: 's1',
        heading: 'Which flow to choose',
        paragraphs: [
          'Use spouse when marriage is registered and the employee requests addition of a legally recognized partner.',
          'Use newborn once birth records are available; maternity riders may apply—check the policy coverage page for sub-limits.',
        ],
      },
      {
        id: 's2',
        heading: 'Documents HR usually keeps',
        paragraphs: [
          'Marriage certificate or equivalent; newborn birth certificate; any insurer-specific declaration your TPA published for the plan year.',
          'Store copies in your HRIS so renewals and audits do not require a second collection round.',
        ],
      },
      {
        id: 's3',
        heading: 'Timeline expectations',
        paragraphs: [
          'Endorsements appear on the schedule first; card and network eligibility can trail by a few business days—set that expectation with employees.',
          'If the event is within the insurer’s waiting window, the preview will call it out before you commit.',
        ],
      },
    ],
  },
  {
    id: 'kb_delete_bulk',
    title: 'Bulk delete: file format and validation',
    tags: ['delete', 'bulk', 'csv', 'date of leaving'],
    snippet: 'How to prepare the employee ID file and what happens after you submit a bulk deletion.',
    readMinutes: 3,
    bestWhen: 'Several exits happened in the same period and line-by-line delete is too slow.',
    outcome: 'You will pass file validation first try and understand what the schedule shows after upload.',
    tryItLabel: 'Bulk delete',
    tryItPath: '/delete/bulk',
    detailSections: [
      {
        id: 's1',
        heading: 'File shape',
        paragraphs: [
          'One column: employee IDs exactly as in your roster. No headers required in the demo—match the template your admin shared.',
          'Dates of leaving belong in the flow form, not always in the raw file; follow the on-screen mapping.',
        ],
      },
      {
        id: 's2',
        heading: 'Validation errors you can fix yourself',
        paragraphs: [
          'Unknown IDs mean a typo or a person already removed—export a fresh roster slice and compare.',
          'Future-dated exits may be blocked if they break continuity rules; adjust the date or split the batch after checking with endorsements.',
        ],
      },
      {
        id: 's3',
        heading: 'After upload',
        paragraphs: [
          'Each row becomes a pending endorsement until finance and CD impacts are reconciled in preview.',
          'Keep the upload receipt email (when wired) as proof for internal SOX-style controls.',
        ],
      },
    ],
  },
  {
    id: 'kb_hrms',
    title: 'HRMS sync: approving joining and leaving',
    tags: ['hrms', 'sync', 'joining', 'leaving'],
    snippet: 'Review HRMS-driven changes before they become endorsements on the master policy.',
    readMinutes: 4,
    bestWhen: 'Your HRIS pushes deltas and you must reconcile them against insurance reality.',
    outcome: 'You will approve only the rows that belong on policy and escalate mismatches early.',
    tryItLabel: 'Open HRMS sync',
    tryItPath: '/hrms-sync',
    detailSections: [
      {
        id: 's1',
        heading: 'Why approval exists',
        paragraphs: [
          'Insurance endorsements charge premium and alter eligibility; blindly accepting HRMS rows can over-delete or expose the wrong dependents.',
          'Treat the sync queue like a gated staging area—not the live roster.',
        ],
      },
      {
        id: 's2',
        heading: 'Joining versus leaving signals',
        paragraphs: [
          'Join rows need band and plan hints from HRMS; missing data should be fixed upstream before approve.',
          'Leaving rows should carry last working dates aligned with payroll; mismatches inflate premium recovery disputes.',
        ],
      },
      {
        id: 's3',
        heading: 'When to reject vs hold',
        paragraphs: [
          'Reject clones and junk IDs outright so they never hit the insurer.',
          'Hold edge cases—probation anomalies, overlapping contracts—for the endorsements desk using the feedback form with screenshots.',
        ],
      },
    ],
  },
  {
    id: 'kb_policy_coverage',
    title: 'Policy coverage page for HR queries',
    tags: ['policy', 'coverage', 'bands', 'lasik'],
    snippet: 'Use search and quick questions to answer employee queries without opening the full policy PDF.',
    readMinutes: 3,
    bestWhen: 'Employees ask narrow benefit questions during renewal or onboarding peaks.',
    outcome: 'You will answer confidently from structured snippets instead of quoting an outdated PDF page.',
    tryItLabel: 'Open policy coverage',
    tryItPath: '/policy-management/coverage',
    detailSections: [
      {
        id: 's1',
        heading: 'Search-first habits',
        paragraphs: [
          'Start with plain language—“LASIK inclusion”, “maternity Room Rent limit”—the demo maps keywords to canned answers.',
          'If no hit, widen terms or pivot to bands; exclusions live next to sums insured for quick scanning.',
        ],
      },
      {
        id: 's2',
        heading: 'When to escalate to policy support',
        paragraphs: [
          'Legal interpretations, cross-border treatment, or riders not modelled in the tool should go to your named policy SPOC.',
          'Attach employee scenario (anonymized) so actuarial can answer without back-and-forth.',
        ],
      },
    ],
  },
]

export const videoTutorials = [
  {
    id: 'vid_quick_add',
    title: 'Quick Add walkthrough (8 min)',
    tags: ['quick add', 'video', 'onboarding'],
    duration: '8:12',
    url: '#',
  },
  {
    id: 'vid_cd_wallet',
    title: 'Understanding CD balance and runway (5 min)',
    tags: ['cd', 'wallet', 'premium'],
    duration: '5:03',
    url: '#',
  },
  {
    id: 'vid_hrms',
    title: 'HRMS sync approval flow (6 min)',
    tags: ['hrms', 'sync', 'approval'],
    duration: '6:45',
    url: '#',
  },
]

/** Shortcuts for the Help center search hero (label + query applied to global search) */
export const helpCenterQuickPrompts = [
  { id: 'quick_add', label: 'Quick Add', query: 'quick add' },
  { id: 'cd', label: 'CD wallet', query: 'cd balance' },
  { id: 'hrms', label: 'HRMS sync', query: 'hrms' },
  { id: 'bulk', label: 'Bulk upload', query: 'bulk' },
  { id: 'policy', label: 'Policy coverage', query: 'policy coverage' },
  { id: 'releases', label: 'Latest releases', query: 'invoice schedule' },
]

export function matchesSupportQuery(text, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return text.toLowerCase().includes(q)
}

export function getKnowledgeArticleById(id) {
  return knowledgeArticles.find((a) => a.id === id) ?? null
}

/** Plain text for article search indexing */
export function knowledgeArticleSearchText(a) {
  const sectionBlob = (a.detailSections ?? [])
    .map((s) => `${s.heading} ${s.paragraphs.join(' ')}`)
    .join(' ')
  return `${a.title} ${a.snippet} ${a.tags.join(' ')} ${a.bestWhen ?? ''} ${a.outcome ?? ''} ${sectionBlob}`
}
