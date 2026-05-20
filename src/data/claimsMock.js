/**
 * Demo claims data — aligned with MLP context/claims-context.md (hub + detail + reports).
 */

/** Portfolio-level headline metrics (demo). Split rows Cashless vs Reimbursement are scaled from `claimsRows` ratios where marked “scaled”. */
export const claimsSummary = {
  totalMtd: 14,
  totalYtd: 128,
  claimsPaidInr: 42_35_000,
  topCategoryLabel: 'Hospitalisation',
  avgSettlementDays: 12,
}

/** Clinical / benefit groupings typical in group health analytics (demo). */
export const CLAIM_SERVICE_CATEGORIES = [
  'Hospitalisation',
  'Day care / short stay',
  'Outpatient (OPD)',
  'Maternity & newborn',
  'Cardiology & cardiovascular',
  'Oncology',
  'Orthopaedics & spine',
  'Diagnostics & imaging',
  'Dental',
  'Vision & ophthalmology',
  'Mental health',
  'Preventive & wellness',
]

export const CLAIM_STATUSES = ['Approved', 'Processing', 'Under Review', 'Rejected']

export const CLAIM_TYPES = ['Cashless', 'Reimbursement']

/** @typedef {'completed'|'processing'|'failed'} ReportStatus */

/** @type {{ id: string, name: string, requestedAt: string, status: ReportStatus }[]} */
export const claimsReportRows = [
  {
    id: 'rep_01',
    name: 'Claims summary (YTD)',
    requestedAt: '2026-04-28T10:15:00',
    status: 'completed',
  },
  {
    id: 'rep_02',
    name: 'Reimbursement deep-dive — Apr 2026',
    requestedAt: '2026-05-02T09:00:00',
    status: 'processing',
  },
  {
    id: 'rep_03',
    name: 'Cashless utilisation by hospital',
    requestedAt: '2026-04-15T14:40:00',
    status: 'failed',
  },
  {
    id: 'rep_04',
    name: 'Day-care episode ledger — Q1',
    requestedAt: '2026-04-12T08:30:00',
    status: 'completed',
  },
  {
    id: 'rep_05',
    name: 'Rejected claims root-cause pack',
    requestedAt: '2026-04-09T16:45:00',
    status: 'completed',
  },
  {
    id: 'rep_06',
    name: 'Employee-wise aged claims (>21 days)',
    requestedAt: '2026-04-06T11:20:00',
    status: 'processing',
  },
  {
    id: 'rep_07',
    name: 'TPA SLA adherence — cashless',
    requestedAt: '2026-04-03T09:05:00',
    status: 'completed',
  },
  {
    id: 'rep_08',
    name: 'Pharmacy OPD spend (Reimbursement)',
    requestedAt: '2026-04-01T13:50:00',
    status: 'failed',
  },
  {
    id: 'rep_09',
    name: 'Hospitalisation bucket MIS — Mar',
    requestedAt: '2026-03-28T07:40:00',
    status: 'completed',
  },
  {
    id: 'rep_10',
    name: 'Documents pending master export',
    requestedAt: '2026-03-26T15:10:00',
    status: 'processing',
  },
  {
    id: 'rep_11',
    name: 'Category split vs census',
    requestedAt: '2026-03-22T10:00:00',
    status: 'completed',
  },
  {
    id: 'rep_12',
    name: 'Pre-auth turnaround histogram',
    requestedAt: '2026-03-18T12:25:00',
    status: 'completed',
  },
  {
    id: 'rep_13',
    name: 'Settlement deltas — disputed amounts',
    requestedAt: '2026-03-14T09:55:00',
    status: 'processing',
  },
  {
    id: 'rep_14',
    name: 'Open claims executive snapshot',
    requestedAt: '2026-03-11T08:15:00',
    status: 'completed',
  },
  {
    id: 'rep_15',
    name: 'Network hospital clawbacks',
    requestedAt: '2026-03-08T17:30:00',
    status: 'failed',
  },
  {
    id: 'rep_16',
    name: 'CD adjustment linkage trial extract',
    requestedAt: '2026-03-05T14:05:00',
    status: 'completed',
  },
  {
    id: 'rep_17',
    name: 'Bulk adjudication outcomes feed',
    requestedAt: '2026-03-02T11:45:00',
    status: 'processing',
  },
  {
    id: 'rep_18',
    name: 'Member grievance tags dump',
    requestedAt: '2026-02-27T09:20:00',
    status: 'completed',
  },
]

/**
 * Status buckets for lifecycle pills (All / Open / Closed / Rejected).
 */
export const CLAIM_OPEN_STATUSES = ['Processing', 'Under Review']

export function deriveClaimsLifecycleCounts(rows) {
  const total = rows.length
  const open = rows.filter((r) => CLAIM_OPEN_STATUSES.includes(r.status)).length
  const closed = rows.filter((r) => r.status === 'Approved').length
  const rejected = rows.filter((r) => r.status === 'Rejected').length
  return { total, open, closed, rejected }
}

/** Open claims split by settlement channel (Cashless vs Reimbursement). */
export function deriveOpenClaimsByChannel(rows) {
  const openRows = rows.filter((r) => CLAIM_OPEN_STATUSES.includes(r.status))
  return {
    cashless: openRows.filter((r) => r.claimType === 'Cashless').length,
    reimbursement: openRows.filter((r) => r.claimType === 'Reimbursement').length,
  }
}

/** Highest-frequency service category vs everything else (preview table). */
export function deriveTopCategoryVsOther(rows) {
  if (!rows.length) return { topCategory: '—', topCount: 0, other: 0 }
  const freq = {}
  rows.forEach((r) => {
    const k = r.serviceCategory || 'Other'
    freq[k] = (freq[k] || 0) + 1
  })
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const topCategory = sorted[0][0]
  const topCount = sorted[0][1]
  const other = rows.length - topCount
  return { topCategory, topCount, other }
}

/**
 * Work-queue buckets derived from demo rows (single source of truth).
 * @param {{ needsAttention?: boolean, awaitingDocuments?: boolean, delayed?: boolean, claimType?: string }[]} rows
 */
export function deriveClaimsQueueCounts(rows) {
  const agg = (pred) => {
    const sub = rows.filter(pred)
    return {
      total: sub.length,
      cashless: sub.filter((r) => r.claimType === 'Cashless').length,
      reimbursement: sub.filter((r) => r.claimType === 'Reimbursement').length,
    }
  }
  return {
    attention: agg((r) => r.needsAttention),
    documents: agg((r) => r.awaitingDocuments),
    delayed: agg((r) => r.delayed),
  }
}

/**
 * Cashless vs reimbursement shares within demo dataset (for scaling headline totals).
 */
export function deriveChannelShares(rows) {
  const n = rows.length || 1
  const cs = rows.filter((r) => r.claimType === 'Cashless').length
  const re = rows.filter((r) => r.claimType === 'Reimbursement').length
  return {
    cashlessCount: cs,
    reimbursementCount: re,
    cashlessShare: cs / n,
    reimbursementShare: re / n,
  }
}

function splitRounded(total, shareA) {
  const a = Math.round(total * shareA)
  return { cashless: a, reimbursement: Math.max(0, total - a) }
}

/**
 * Paid amounts summed by channel from Approved rows with numeric approvedAmountInr.
 */
export function derivePaidByChannel(rows) {
  let cashless = 0
  let reimbursement = 0
  rows.forEach((r) => {
    if (r.status !== 'Approved' || r.approvedAmountInr == null) return
    if (r.claimType === 'Cashless') cashless += r.approvedAmountInr
    else reimbursement += r.approvedAmountInr
  })
  return { cashless, reimbursement, combined: cashless + reimbursement }
}

/** Modal category label within channel subset */
export function topServiceCategoryForChannel(rows, claimType) {
  const subset = rows.filter((r) => r.claimType === claimType)
  if (subset.length === 0) return '—'
  const freq = {}
  subset.forEach((r) => {
    const k = r.serviceCategory || 'Other'
    freq[k] = (freq[k] || 0) + 1
  })
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
}

export function deriveAvgSettlementProxy(rows, fallbackCombinedDays) {
  const approvedRe = rows.filter((r) => r.status === 'Approved' && r.claimType === 'Reimbursement')
  return {
    cashless: fallbackCombinedDays,
    reimbursement: approvedRe.length ? fallbackCombinedDays + 2 : fallbackCombinedDays,
  }
}

/**
 * Scaled headline splits + narrative helpers for Claims overview UI.
 */
export function deriveClaimsOverview(rows, summary = claimsSummary) {
  const shares = deriveChannelShares(rows)
  const paid = derivePaidByChannel(rows)
  const mtdSplit = splitRounded(summary.totalMtd, shares.cashlessShare)
  const ytdSplit = splitRounded(summary.totalYtd, shares.cashlessShare)

  const paidPortfolioCashless =
    paid.combined > 0 ? Math.round(summary.claimsPaidInr * (paid.cashless / paid.combined)) : splitRounded(summary.claimsPaidInr, shares.cashlessShare).cashless
  const paidPortfolioReimbursement = summary.claimsPaidInr - paidPortfolioCashless

  const settlement = deriveAvgSettlementProxy(rows, summary.avgSettlementDays)

  return {
    mtdSplit,
    ytdSplit,
    claimsPaidSplitInr: { cashless: paidPortfolioCashless, reimbursement: paidPortfolioReimbursement },
    topCategoryByChannel: {
      cashless: topServiceCategoryForChannel(rows, 'Cashless'),
      reimbursement: topServiceCategoryForChannel(rows, 'Reimbursement'),
      headlineCombined: summary.topCategoryLabel,
    },
    avgSettlementDaysByChannel: settlement,
    datasetShares: shares,
    queueCounts: deriveClaimsQueueCounts(rows),
    demoPaidApprovedSum: paid,
  }
}

/**
 * @typedef {object} ClaimTimelineStep
 * @property {string} key
 * @property {string} label
 * @property {'done'|'current'|'upcoming'} state
 * @property {string} [at]
 */

/**
 * @typedef {object} ClaimRow
 * @property {string} id
 * @property {string} employeeName
 * @property {string} empId
 * @property {string} email
 * @property {'Cashless'|'Reimbursement'} claimType
 * @property {string} serviceCategory — see `CLAIM_SERVICE_CATEGORIES`
 * @property {number} amountInr
 * @property {string} submittedAtIso
 * @property {string} status
 * @property {string} nextAction
 * @property {'high'|'normal'} urgency
 * @property {boolean} needsAttention
 * @property {boolean} awaitingDocuments
 * @property {boolean} delayed
 * @property {string} owner
 * @property {string} treatmentSummary
 * @property {string} hospitalName
 * @property {string} diagnosis
 * @property {number} claimedAmountInr
 * @property {number|null} approvedAmountInr
 * @property {string[]} uploadedDocs
 * @property {string[]} pendingDocs
 * @property {ClaimTimelineStep[]} timeline
 * @property {number} progressPct
 * @property {string} nextTimelineHint
 */

/** @type {ClaimRow[]} */
export const claimsRows = [
  {
    id: 'CLM-2026-0148',
    employeeName: 'Ananya Rao',
    empId: 'EMP-44821',
    email: 'ananya.rao@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Vision & ophthalmology',
    amountInr: 2_85_000,
    submittedAtIso: '2026-05-01',
    status: 'Under Review',
    nextAction: 'Insurer medical review in progress',
    urgency: 'high',
    needsAttention: true,
    awaitingDocuments: false,
    delayed: true,
    owner: 'Insurer',
    treatmentSummary: 'Planned cataract surgery — pre-auth submitted',
    hospitalName: 'Apollo Hospitals, Bengaluru',
    diagnosis: 'Senile cataract, OU',
    claimedAmountInr: 2_85_000,
    approvedAmountInr: null,
    uploadedDocs: ['Pre-auth form', 'ID proof', 'Employee declaration'],
    pendingDocs: ['Final discharge summary (post surgery)'],
    progressPct: 55,
    nextTimelineHint: 'Medical review typically completes in 2–4 working days.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '01 May 2026, 09:12' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '02 May 2026, 11:40' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'In progress' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0142',
    employeeName: 'Rahul Verma',
    empId: 'EMP-44102',
    email: 'rahul.verma@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Outpatient (OPD)',
    amountInr: 48_600,
    submittedAtIso: '2026-04-28',
    status: 'Processing',
    nextAction: 'Upload stamped pharmacy bills',
    urgency: 'high',
    needsAttention: true,
    awaitingDocuments: true,
    delayed: false,
    owner: 'HR',
    treatmentSummary: 'OPD dermatology — prescriptions and pharmacy',
    hospitalName: 'NA (OPD)',
    diagnosis: 'Chronic eczema flare',
    claimedAmountInr: 48_600,
    approvedAmountInr: null,
    uploadedDocs: ['Prescription', 'Consultation invoice'],
    pendingDocs: ['Pharmacy bills (stamped)', 'Cancelled cheque / bank proof'],
    progressPct: 35,
    nextTimelineHint: 'Claim cannot progress until mandatory bills are uploaded.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '28 Apr 2026, 16:02' },
      { key: 'docs', label: 'Documents verified', state: 'current', at: 'Awaiting uploads' },
      { key: 'medical', label: 'Medical review', state: 'upcoming' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0139',
    employeeName: 'Meera Iyer',
    empId: 'EMP-43977',
    email: 'meera.iyer@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Hospitalisation',
    amountInr: 1_95_000,
    submittedAtIso: '2026-04-22',
    status: 'Approved',
    nextAction: 'None — settlement queued',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Appendectomy — inpatient cashless',
    hospitalName: 'Manipal Hospital, Bengaluru',
    diagnosis: 'Acute appendicitis',
    claimedAmountInr: 2_10_000,
    approvedAmountInr: 1_95_000,
    uploadedDocs: ['Discharge summary', 'Final bill', 'Implant invoices'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: 'Payment will reflect per insurer TAT.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '22 Apr 2026, 08:45' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '23 Apr 2026, 10:05' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '25 Apr 2026, 14:22' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '26 Apr 2026, 09:18' },
    ],
  },
  {
    id: 'CLM-2026-0135',
    employeeName: 'Kabir Shah',
    empId: 'EMP-43156',
    email: 'kabir.shah@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Diagnostics & imaging',
    amountInr: 22_400,
    submittedAtIso: '2026-04-19',
    status: 'Rejected',
    nextAction: 'Review rejection reason with employee',
    urgency: 'high',
    needsAttention: true,
    awaitingDocuments: false,
    delayed: false,
    owner: 'HR',
    treatmentSummary: 'Dental procedures — reimbursement',
    hospitalName: 'Smile Care Dental',
    diagnosis: 'Root canal treatment',
    claimedAmountInr: 22_400,
    approvedAmountInr: 0,
    uploadedDocs: ['Invoices', 'Treatment notes'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: 'Appeal window closes on 19 May 2026 (demo).',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '19 Apr 2026, 13:10' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '20 Apr 2026, 09:55' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '22 Apr 2026, 18:30' },
      { key: 'outcome', label: 'Rejected', state: 'done', at: '23 Apr 2026, 11:02' },
    ],
  },
  {
    id: 'CLM-2026-0128',
    employeeName: 'Neha Kapoor',
    empId: 'EMP-42901',
    email: 'neha.kapoor@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Day care / short stay',
    amountInr: 76_500,
    submittedAtIso: '2026-04-12',
    status: 'Processing',
    nextAction: 'Awaiting hospital bill reconciliation',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: true,
    owner: 'Insurer',
    treatmentSummary: 'Day-care arthroscopy',
    hospitalName: 'Fortis, MG Road',
    diagnosis: 'Meniscus tear',
    claimedAmountInr: 76_500,
    approvedAmountInr: null,
    uploadedDocs: ['Pre-auth', 'Admission notes'],
    pendingDocs: [],
    progressPct: 60,
    nextTimelineHint: 'Delay flagged — insurer following up with hospital.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '12 Apr 2026, 07:50' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '13 Apr 2026, 15:12' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'Awaiting bill clarity' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0119',
    employeeName: 'Sanjay Menon',
    empId: 'EMP-42488',
    email: 'sanjay.menon@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Oncology',
    amountInr: 15_200,
    submittedAtIso: '2026-03-30',
    status: 'Approved',
    nextAction: 'None — paid',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Physiotherapy sessions',
    hospitalName: 'NA',
    diagnosis: 'Post ACL rehab',
    claimedAmountInr: 15_200,
    approvedAmountInr: 14_800,
    uploadedDocs: ['Sessions log', 'Invoices', 'Prescription'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '30 Mar 2026, 18:20' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '31 Mar 2026, 10:08' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '02 Apr 2026, 09:44' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '04 Apr 2026, 16:11' },
    ],
  },
  {
    id: 'CLM-2026-0105',
    employeeName: 'Divya Nair',
    empId: 'EMP-41890',
    email: 'divya.nair@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Orthopaedics & spine',
    amountInr: 3_40_000,
    submittedAtIso: '2026-03-18',
    status: 'Under Review',
    nextAction: 'Employee to upload implant sticker scan',
    urgency: 'high',
    needsAttention: true,
    awaitingDocuments: true,
    delayed: false,
    owner: 'HR',
    treatmentSummary: 'Joint replacement — implant documentation',
    hospitalName: 'NH Narayana Health',
    diagnosis: 'Primary osteoarthritis',
    claimedAmountInr: 3_40_000,
    approvedAmountInr: null,
    uploadedDocs: ['Discharge summary', 'Bill summary'],
    pendingDocs: ['Implant sticker / barcode scan'],
    progressPct: 48,
    nextTimelineHint: 'Medical review paused until implant proof is uploaded.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '18 Mar 2026, 12:05' },
      { key: 'docs', label: 'Documents verified', state: 'current', at: 'Awaiting implant proof' },
      { key: 'medical', label: 'Medical review', state: 'upcoming' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0098',
    employeeName: 'Arjun Desai',
    empId: 'EMP-41502',
    email: 'arjun.desai@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Diagnostics & imaging',
    amountInr: 9_850,
    submittedAtIso: '2026-03-05',
    status: 'Processing',
    nextAction: 'Awaiting insurer adjudication',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Diagnostics — MRI lumbar spine',
    hospitalName: 'Centre for MRI',
    diagnosis: 'Low back pain — rule out disc pathology',
    claimedAmountInr: 9_850,
    approvedAmountInr: null,
    uploadedDocs: ['MRI report', 'Invoice', 'Referral'],
    pendingDocs: [],
    progressPct: 62,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '05 Mar 2026, 09:40' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '06 Mar 2026, 14:01' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'In queue' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0091',
    employeeName: 'Kavya Menon',
    empId: 'EMP-41288',
    email: 'kavya.menon@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Day care / short stay',
    amountInr: 62_400,
    submittedAtIso: '2026-02-26',
    status: 'Approved',
    nextAction: 'Payment released to hospital',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Hernia repair — day-care admission',
    hospitalName: 'Manipal Hospital',
    diagnosis: 'Inguinal hernia',
    claimedAmountInr: 62_400,
    approvedAmountInr: 58_900,
    uploadedDocs: ['Discharge summary', 'Bill', 'Pre-auth'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '26 Feb 2026, 08:50' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '27 Feb 2026, 10:12' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '01 Mar 2026, 15:40' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '03 Mar 2026, 09:05' },
    ],
  },
  {
    id: 'CLM-2026-0087',
    employeeName: 'Suresh Pillai',
    empId: 'EMP-41102',
    email: 'suresh.pillai@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Hospitalisation',
    amountInr: 4_12_000,
    submittedAtIso: '2026-02-18',
    status: 'Rejected',
    nextAction: 'Appeal window closed — refer HR',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Elective ENT surgery',
    hospitalName: 'KIMS Health',
    diagnosis: 'Deviated nasal septum',
    claimedAmountInr: 4_12_000,
    approvedAmountInr: null,
    uploadedDocs: ['Discharge summary', 'Bills'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: 'Rejected for policy exclusion on cosmetic component.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '18 Feb 2026, 11:22' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '19 Feb 2026, 09:18' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '22 Feb 2026, 14:02' },
      { key: 'outcome', label: 'Rejected', state: 'done', at: '24 Feb 2026, 16:30' },
    ],
  },
  {
    id: 'CLM-2026-0084',
    employeeName: 'Priya Shah',
    empId: 'EMP-40956',
    email: 'priya.shah@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Dental',
    amountInr: 14_200,
    submittedAtIso: '2026-02-11',
    status: 'Processing',
    nextAction: 'Awaiting bank verification',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Finance',
    treatmentSummary: 'Dental crown — OPD',
    hospitalName: 'SmileCare Clinic',
    diagnosis: 'Crown replacement',
    claimedAmountInr: 14_200,
    approvedAmountInr: null,
    uploadedDocs: ['Invoice', 'Treatment notes'],
    pendingDocs: [],
    progressPct: 72,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '11 Feb 2026, 13:05' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '12 Feb 2026, 10:44' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'Routine clearance' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0079',
    employeeName: 'Vikram Singh',
    empId: 'EMP-40811',
    email: 'vikram.singh@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Cardiology & cardiovascular',
    amountInr: 8_90_000,
    submittedAtIso: '2026-02-04',
    status: 'Under Review',
    nextAction: 'Additional investigation reports requested',
    urgency: 'high',
    needsAttention: true,
    awaitingDocuments: true,
    delayed: true,
    owner: 'Insurer',
    treatmentSummary: 'Cardiac catheterisation',
    hospitalName: 'Fortis Escorts',
    diagnosis: 'CAD evaluation',
    claimedAmountInr: 8_90_000,
    approvedAmountInr: null,
    uploadedDocs: ['Admission summary', 'Investigations'],
    pendingDocs: ['Stress test report'],
    progressPct: 41,
    nextTimelineHint: 'Clinical packet incomplete.',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '04 Feb 2026, 07:55' },
      { key: 'docs', label: 'Documents verified', state: 'current', at: 'Awaiting stress test' },
      { key: 'medical', label: 'Medical review', state: 'upcoming' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0075',
    employeeName: 'Neha Kulkarni',
    empId: 'EMP-40677',
    email: 'neha.kulkarni@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Outpatient (OPD)',
    amountInr: 6_750,
    submittedAtIso: '2026-01-29',
    status: 'Approved',
    nextAction: 'No further action',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Physiotherapy sessions bundle',
    hospitalName: 'Rehab Centre OPD',
    diagnosis: 'Post ACL rehab',
    claimedAmountInr: 6_750,
    approvedAmountInr: 6_750,
    uploadedDocs: ['Sessions log', 'Prescription'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '29 Jan 2026, 15:10' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '30 Jan 2026, 09:30' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '31 Jan 2026, 11:02' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '02 Feb 2026, 08:40' },
    ],
  },
  {
    id: 'CLM-2026-0071',
    employeeName: 'Rohan Batra',
    empId: 'EMP-40544',
    email: 'rohan.batra@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Vision & ophthalmology',
    amountInr: 1_08_500,
    submittedAtIso: '2026-01-22',
    status: 'Processing',
    nextAction: 'HR verifying employer contribution split',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'HR',
    treatmentSummary: 'LASIK — day procedure',
    hospitalName: 'Narayana Nethralaya',
    diagnosis: 'Myopia correction',
    claimedAmountInr: 1_08_500,
    approvedAmountInr: null,
    uploadedDocs: ['Invoice', 'Consent', 'Discharge'],
    pendingDocs: [],
    progressPct: 58,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '22 Jan 2026, 12:18' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '23 Jan 2026, 09:55' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'Scheduled' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0068',
    employeeName: 'Sanjana Bose',
    empId: 'EMP-40402',
    email: 'sanjana.bose@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Hospitalisation',
    amountInr: 2_34_000,
    submittedAtIso: '2026-01-15',
    status: 'Approved',
    nextAction: 'Settlement reconciled',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Appendectomy',
    hospitalName: 'AMRI Hospitals',
    diagnosis: 'Acute appendicitis',
    claimedAmountInr: 2_34_000,
    approvedAmountInr: 2_28_400,
    uploadedDocs: ['Discharge summary', 'OT notes', 'Bills'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '15 Jan 2026, 06:40' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '16 Jan 2026, 10:08' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '18 Jan 2026, 09:22' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '20 Jan 2026, 13:15' },
    ],
  },
  {
    id: 'CLM-2026-0064',
    employeeName: 'Manoj Reddy',
    empId: 'EMP-40291',
    email: 'manoj.reddy@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Preventive & wellness',
    amountInr: 3_450,
    submittedAtIso: '2026-01-08',
    status: 'Rejected',
    nextAction: 'Receipt not itemised — resubmit not accepted',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Diagnostics — lipid panel',
    hospitalName: 'DiagnoLabs',
    diagnosis: 'Annual health check',
    claimedAmountInr: 3_450,
    approvedAmountInr: null,
    uploadedDocs: ['Receipt'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '08 Jan 2026, 08:05' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '09 Jan 2026, 11:50' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '10 Jan 2026, 14:28' },
      { key: 'outcome', label: 'Rejected', state: 'done', at: '11 Jan 2026, 09:12' },
    ],
  },
  {
    id: 'CLM-2026-0059',
    employeeName: 'Ishita Khanna',
    empId: 'EMP-40188',
    email: 'ishita.khanna@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Orthopaedics & spine',
    amountInr: 5_55_000,
    submittedAtIso: '2025-12-28',
    status: 'Under Review',
    nextAction: 'Peer medical opinion scheduled',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: true,
    owner: 'Insurer',
    treatmentSummary: 'Spine decompression',
    hospitalName: 'BLK-Max',
    diagnosis: 'Spinal stenosis',
    claimedAmountInr: 5_55_000,
    approvedAmountInr: null,
    uploadedDocs: ['MRI', 'Admission notes'],
    pendingDocs: [],
    progressPct: 52,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '28 Dec 2025, 10:25' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '29 Dec 2025, 09:01' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'Peer review' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0055',
    employeeName: 'Tarun Malhotra',
    empId: 'EMP-40071',
    email: 'tarun.malhotra@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Hospitalisation',
    amountInr: 3_02_000,
    submittedAtIso: '2025-12-19',
    status: 'Processing',
    nextAction: 'Insurer matching tariff code',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Kidney stone lithotripsy IP',
    hospitalName: 'Medanta',
    diagnosis: 'Renal calculus',
    claimedAmountInr: 3_02_000,
    approvedAmountInr: null,
    uploadedDocs: ['Discharge summary', 'Investigations', 'Bill'],
    pendingDocs: [],
    progressPct: 67,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '19 Dec 2025, 14:42' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '20 Dec 2025, 08:36' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'Tariff alignment' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0051',
    employeeName: 'Aditi Saxena',
    empId: 'EMP-39954',
    email: 'aditi.saxena@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Preventive & wellness',
    amountInr: 88_900,
    submittedAtIso: '2025-12-11',
    status: 'Approved',
    nextAction: 'Closed',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Colonoscopy screening',
    hospitalName: 'Aster RV',
    diagnosis: 'Screening',
    claimedAmountInr: 88_900,
    approvedAmountInr: 84_000,
    uploadedDocs: ['Procedure report', 'Bill'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '11 Dec 2025, 07:18' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '11 Dec 2025, 16:02' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '13 Dec 2025, 11:30' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '15 Dec 2025, 09:44' },
    ],
  },
  {
    id: 'CLM-2026-0048',
    employeeName: 'Kabir Anand',
    empId: 'EMP-39830',
    email: 'kabir.anand@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Orthopaedics & spine',
    amountInr: 22_100,
    submittedAtIso: '2025-12-03',
    status: 'Processing',
    nextAction: 'Awaiting stamped bills rescan',
    urgency: 'high',
    needsAttention: true,
    awaitingDocuments: true,
    delayed: false,
    owner: 'HR',
    treatmentSummary: 'Ortho consultation + imaging',
    hospitalName: 'OrthoOne',
    diagnosis: 'Meniscus tear',
    claimedAmountInr: 22_100,
    approvedAmountInr: null,
    uploadedDocs: ['MRI slip'],
    pendingDocs: ['Stamped radiology invoice'],
    progressPct: 29,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '03 Dec 2025, 09:50' },
      { key: 'docs', label: 'Documents verified', state: 'current', at: 'Awaiting scan' },
      { key: 'medical', label: 'Medical review', state: 'upcoming' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0044',
    employeeName: 'Shruti Patil',
    empId: 'EMP-39705',
    email: 'shruti.patil@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Hospitalisation',
    amountInr: 1_72_000,
    submittedAtIso: '2025-11-26',
    status: 'Approved',
    nextAction: 'Paid',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Cholecystectomy',
    hospitalName: 'Ruby Hall Clinic',
    diagnosis: 'Cholelithiasis',
    claimedAmountInr: 1_72_000,
    approvedAmountInr: 1_69_500,
    uploadedDocs: ['Discharge summary', 'Bill', 'Investigations'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '26 Nov 2025, 08:22' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '27 Nov 2025, 10:05' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '29 Nov 2025, 15:18' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '02 Dec 2025, 12:00' },
    ],
  },
  {
    id: 'CLM-2026-0040',
    employeeName: 'Pankaj Grover',
    empId: 'EMP-39582',
    email: 'pankaj.grover@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Hospitalisation',
    amountInr: 6_45_000,
    submittedAtIso: '2025-11-18',
    status: 'Under Review',
    nextAction: 'Clinical coding query open',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Stroke rehabilitation IP stay',
    hospitalName: 'AIIMS Delhi affiliate',
    diagnosis: 'Ischaemic stroke recovery',
    claimedAmountInr: 6_45_000,
    approvedAmountInr: null,
    uploadedDocs: ['Discharge summary', 'Therapy logs'],
    pendingDocs: [],
    progressPct: 46,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '18 Nov 2025, 13:08' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '19 Nov 2025, 09:41' },
      { key: 'medical', label: 'Medical review', state: 'current', at: 'Coding query' },
      { key: 'outcome', label: 'Approved / Rejected', state: 'upcoming' },
    ],
  },
  {
    id: 'CLM-2026-0036',
    employeeName: 'Leela Francis',
    empId: 'EMP-39460',
    email: 'leela.francis@example.com',
    claimType: 'Cashless',
    serviceCategory: 'Mental health',
    amountInr: 11_400,
    submittedAtIso: '2025-11-09',
    status: 'Rejected',
    nextAction: 'Duplicate submission flagged',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Insurer',
    treatmentSummary: 'Repeat physiotherapy claim',
    hospitalName: 'SportsMed OPD',
    diagnosis: 'Shoulder impingement',
    claimedAmountInr: 11_400,
    approvedAmountInr: null,
    uploadedDocs: ['Invoice duplicate'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '09 Nov 2025, 10:02' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '09 Nov 2025, 15:30' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '10 Nov 2025, 08:55' },
      { key: 'outcome', label: 'Rejected', state: 'done', at: '10 Nov 2025, 16:48' },
    ],
  },
  {
    id: 'CLM-2026-0032',
    employeeName: 'Harish Varma',
    empId: 'EMP-39344',
    email: 'harish.varma@example.com',
    claimType: 'Reimbursement',
    serviceCategory: 'Day care / short stay',
    amountInr: 54_800,
    submittedAtIso: '2025-11-01',
    status: 'Approved',
    nextAction: 'Reimbursement credited',
    urgency: 'normal',
    needsAttention: false,
    awaitingDocuments: false,
    delayed: false,
    owner: 'Finance',
    treatmentSummary: 'Ambulatory surgery — cyst removal',
    hospitalName: 'Metro Hospital DC unit',
    diagnosis: 'Sebaceous cyst',
    claimedAmountInr: 54_800,
    approvedAmountInr: 52_300,
    uploadedDocs: ['Bill', 'Discharge', 'Cancelled cheque'],
    pendingDocs: [],
    progressPct: 100,
    nextTimelineHint: '',
    timeline: [
      { key: 'submitted', label: 'Submitted', state: 'done', at: '01 Nov 2025, 09:14' },
      { key: 'docs', label: 'Documents verified', state: 'done', at: '02 Nov 2025, 11:22' },
      { key: 'medical', label: 'Medical review', state: 'done', at: '04 Nov 2025, 10:07' },
      { key: 'outcome', label: 'Approved', state: 'done', at: '06 Nov 2025, 14:51' },
    ],
  },
]

/** @deprecated Use deriveClaimsQueueCounts(claimsRows) — kept for any legacy imports */
export const claimsControlCounts = (() => {
  const q = deriveClaimsQueueCounts(claimsRows)
  return {
    needsAttention: q.attention.total,
    awaitingDocuments: q.documents.total,
    delayed: q.delayed.total,
  }
})()

export function getClaimById(id) {
  return claimsRows.find((c) => c.id === id) ?? null
}
