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

export const knowledgeArticles = [
  {
    id: 'kb_add_quick',
    title: 'Quick Add: plans, dependents, and CD impact',
    tags: ['add employee', 'quick add', 'cd', 'dependents'],
    snippet: 'Walk through adding up to five employees in one batch and when premium is drawn from your CD wallet.',
  },
  {
    id: 'kb_update_life',
    title: 'Life events: spouse and newborn on cover',
    tags: ['update', 'spouse', 'newborn', 'maternity'],
    snippet: 'Steps to register dependents after marriage or birth, including documents HR typically needs.',
  },
  {
    id: 'kb_delete_bulk',
    title: 'Bulk delete: file format and validation',
    tags: ['delete', 'bulk', 'csv', 'date of leaving'],
    snippet: 'How to prepare the employee ID file and what happens after you submit a bulk deletion.',
  },
  {
    id: 'kb_hrms',
    title: 'HRMS sync: approving joining and leaving',
    tags: ['hrms', 'sync', 'joining', 'leaving'],
    snippet: 'Review HRMS-driven changes before they become endorsements on the master policy.',
  },
  {
    id: 'kb_policy_coverage',
    title: 'Policy coverage page for HR queries',
    tags: ['policy', 'coverage', 'bands', 'lasik'],
    snippet: 'Use search and quick questions to answer employee queries without opening the full policy PDF.',
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

export function matchesSupportQuery(text, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return text.toLowerCase().includes(q)
}
