/** Demo in-app notifications for the header bell menu. */
export const headerNotificationsSeed = [
  {
    id: 'n1',
    title: 'CD balance below buffer',
    body: 'Acme India Pvt Ltd wallet is below the recommended buffer. Review before your next endorsement batch.',
    time: '2h ago',
    unread: true,
    path: '/cd-balance',
  },
  {
    id: 'n2',
    title: 'Endorsement batch #8841 completed',
    body: '12 employees were added successfully. Premium debit posted to CD wallet.',
    time: 'Yesterday',
    unread: true,
    path: '/',
  },
  {
    id: 'n3',
    title: 'HRMS sync ready for review',
    body: '4 joining and 2 leaving employees are pending your review.',
    time: 'Yesterday',
    unread: false,
    path: '/hrms-sync',
  },
  {
    id: 'n4',
    title: 'New release: Invoice schedule',
    body: 'See how invoice schedules work in the latest portal update.',
    time: '3 days ago',
    unread: false,
    path: '/new-releases',
  },
  {
    id: 'n5',
    title: 'Claim CLM-2025-441 updated',
    body: 'Documents verified — status moved to assessment.',
    time: '5 days ago',
    unread: false,
    path: '/claims',
  },
]
