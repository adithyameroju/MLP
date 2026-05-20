/**
 * Mock dashboard state for MLP UI. Replace with API integration later.
 */

import {
  CD_CURRENT_BALANCE_RUPEES,
  CD_THRESHOLDS,
  cdRunwayWeeks,
  cdRiskLevel,
} from './cdWalletMock'

export { cdBalanceTrend } from './cdWalletMock'

export const entityOptions = [
  { id: 'ent_1', label: 'Acme India Pvt Ltd', policyNo: 'POL-2024-8891' },
  { id: 'ent_2', label: 'Acme Labs SEA', policyNo: 'POL-2024-9022' },
  { id: 'ent_3', label: 'Vertex Technosystems Ltd', policyNo: 'POL-2025-1044' },
  { id: 'ent_4', label: 'Northstar Retail Holdings', policyNo: 'POL-2024-7702' },
  { id: 'ent_5', label: 'Indus Manufacturing Co.', policyNo: 'POL-2025-2201' },
  { id: 'ent_6', label: 'Coastal Logistics Pvt Ltd', policyNo: 'POL-2024-5518' },
  { id: 'ent_7', label: 'Skyline Finserve Pvt Ltd', policyNo: 'POL-2025-3301' },
  { id: 'ent_8', label: 'BluePeak Healthcare Group', policyNo: 'POL-2024-6604' },
  { id: 'ent_9', label: 'Kaveri Agro & Allied Industries', policyNo: 'POL-2025-1188' },
  { id: 'ent_10', label: 'Metro Urban Developers Ltd', policyNo: 'POL-2024-4402' },
  { id: 'ent_11', label: 'Nimbus IT Solutions Pvt Ltd', policyNo: 'POL-2025-9090' },
  { id: 'ent_12', label: 'Riverside Textiles (India)', policyNo: 'POL-2024-7711' },
]

/** @typedef {'healthy' | 'warning' | 'critical'} CdRiskLevel */

function cdRiskLabel(level) {
  if (level === 'critical') return 'Below minimum — endorsements may be blocked'
  if (level === 'warning') return 'Below buffer — monitor endorsements'
  return 'CD position is healthy'
}

/** Single source of truth with [`cdWalletMock`](./cdWalletMock.js). */
/** @type {{ level: CdRiskLevel, balance: number, minimum: number, buffer: number, runwayWeeks: number | null, label: string }} */
export const cdRisk = (() => {
  const balance = CD_CURRENT_BALANCE_RUPEES
  const level = cdRiskLevel(balance)
  return {
    level,
    balance,
    minimum: CD_THRESHOLDS.minimum,
    buffer: CD_THRESHOLDS.buffer,
    runwayWeeks: cdRunwayWeeks(balance),
    label: cdRiskLabel(level),
  }
})()

export const metrics = {
  totalLives: { employees: 1240, dependents: 2100 },
  openClaims: { count: 18, inReview: 5, awaitingDocs: 4 },
  totalClaimsYtd: { count: 312, amount: 1_42_00_000 },
}

/** Grouped claims trend — counts and amounts for dashboard chart toggle. */
export const claimsTrendDetailed = {
  months: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  byCount: {
    approved: [28, 32, 35, 30, 38, 34],
    inProgress: [14, 12, 16, 11, 15, 13],
    rejected: [4, 3, 5, 4, 2, 3],
    completed: [22, 24, 20, 26, 28, 25],
  },
  byAmountLakh: {
    approved: [42, 48, 51, 45, 58, 52],
    inProgress: [18, 16, 22, 14, 20, 17],
    rejected: [6, 5, 8, 6, 4, 5],
    completed: [38, 40, 35, 44, 48, 42],
  },
}

export const claimsTrendInsight =
  '312 claims YTD · avg. approval time 2.4 days · 5 claims awaiting documents'

/** Primary dashboard quick actions (hero panel). */
export const dashboardPrimaryQuickActions = [
  {
    id: 'ecards',
    title: 'Send e-Cards',
    description: 'ID cards & policy docs to members',
    icon: 'mail',
    path: '/e-cards',
  },
  {
    id: 'endorse',
    title: 'Start endorsement',
    description: 'Quick add, bulk upload, or updates',
    icon: 'layers',
    path: '/add',
  },
  {
    id: 'hospitals',
    title: 'Find hospitals',
    description: 'Cashless network near your team',
    icon: 'mapPin',
    path: '/network/hospitals',
  },
]

/** Slim secondary links under the hero row. */
export const dashboardSecondaryLinks = [
  { label: 'CD wallet', path: '/cd-balance' },
  { label: 'Claims', path: '/claims' },
  { label: 'HRMS sync', path: '/hrms-sync' },
  { label: 'Update member', path: '/update' },
  { label: 'Remove member', path: '/delete' },
]

/** Priority: lower = higher urgency */
export const priorityAlerts = [
  {
    id: 'a1',
    severity: 'info',
    title: 'CD runway looks healthy',
    detail:
      'Balance is above buffer vs estimated monthly burn. Still review before large endorsement batches.',
    actionLabel: 'View CD wallet',
    path: '/cd-balance',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: '2 endorsements need attention',
    detail: 'One upload failed validation; one batch is pending HR approval.',
    actionLabel: 'Open endorsements',
    path: '/',
  },
  {
    id: 'a3',
    severity: 'info',
    title: '5 claims awaiting documents',
    detail: 'Employees were notified; follow up to avoid delays.',
    actionLabel: 'View in claims',
    path: '/claims?from=dashboard&bucket=documents',
  },
]

export const systemBanners = [
  {
    id: 'b1',
    type: 'progress',
    message: 'Bulk upload processing — 240 of 500 rows validated.',
    actionLabel: 'View status',
    path: '/add/bulk',
  },
]

export const activityFeed = [
  { id: 'f1', time: '10 min ago', module: 'endorsements', text: 'Quick add: 3 employees added — est. CD impact ₹42,300', path: '/' },
  { id: 'f2', time: '1 hr ago', module: 'cd', text: 'CD debited ₹1,12,400 for monthly premium settlement', path: '/cd-balance' },
  { id: 'f3', time: '3 hr ago', module: 'claims', text: 'Claim #CLM-9921 moved to under review', path: '/claims' },
  { id: 'f4', time: 'Yesterday', module: 'reports', text: 'Claims experience report ready to download', path: '/reports' },
]

const moduleMeta = {
  endorsements: { label: 'Endorsements', color: 'text-indigo-600 bg-indigo-50' },
  cd: { label: 'CD', color: 'text-emerald-700 bg-emerald-50' },
  claims: { label: 'Claims', color: 'text-rose-700 bg-rose-50' },
  reports: { label: 'Reports', color: 'text-amber-800 bg-amber-50' },
}

export function feedItemMeta(moduleKey) {
  return moduleMeta[moduleKey] || { label: moduleKey, color: 'text-gray-600 bg-gray-100' }
}

/**
 * Smart actions derived from mock state (simulates contextual rules).
 */
export function getSmartActions() {
  const actions = []
  if (cdRisk.level === 'critical' || cdRisk.level === 'warning') {
    actions.push({
      id: 'sa_cd',
      title: cdRisk.level === 'critical' ? 'Add funds to CD' : 'Review CD runway',
      description:
        cdRisk.level === 'critical'
          ? 'Balance is below minimum — unblock endorsements.'
          : 'You are approaching the buffer threshold.',
      path: '/cd-balance',
      emphasis: true,
    })
  }
  actions.push({
    id: 'sa_end',
    title: 'Complete pending endorsement tasks',
    description: '2 items need action — failed upload & pending approval.',
    path: '/',
    emphasis: false,
  })
  actions.push({
    id: 'sa_claims',
    title: 'Resolve claims needing documents',
    description: `${metrics.openClaims.awaitingDocs} claims stuck at document stage.`,
    path: '/claims?from=dashboard&bucket=documents',
    emphasis: false,
  })
  actions.push({
    id: 'sa_hrms',
    title: 'Sync HRMS changes',
    description: 'New joiners detected from last HRMS pull.',
    path: '/hrms-sync',
    emphasis: false,
  })
  return actions.slice(0, 4)
}

export const moduleNav = [
  {
    id: 'm_claims',
    title: 'Claims',
    description: 'Track open claims, escalations, and settlements.',
    path: '/claims',
    accent: 'from-rose-500/15 to-rose-100/80',
    icon: 'claims',
  },
  {
    id: 'm_end',
    title: 'Endorsements',
    description: 'Add, update, or remove members; bulk & HRMS flows.',
    path: '/',
    accent: 'from-indigo-500/15 to-indigo-100/80',
    icon: 'endorsements',
  },
  {
    id: 'm_cd',
    title: 'CD balance',
    description: 'Balance, statements, and reconciliation vs endorsements.',
    path: '/cd-balance',
    accent: 'from-emerald-500/15 to-emerald-100/80',
    icon: 'cd',
  },
  {
    id: 'm_policy',
    title: 'Policy coverage',
    description: 'Master policy, bands, limits, and quick answers for HR.',
    path: '/policy-management/coverage',
    accent: 'from-violet-500/15 to-violet-100/80',
    icon: 'policy',
  },
  {
    id: 'm_reports',
    title: 'Reports',
    description: 'Claims experience, utilisation, and downloads.',
    path: '/reports',
    accent: 'from-amber-500/15 to-amber-100/80',
    icon: 'reports',
  },
]
