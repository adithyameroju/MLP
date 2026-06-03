import {
  CD_BALANCE_AS_OF_ISO,
  CD_BALANCE_SOURCE_LABEL,
  CD_CURRENT_BALANCE_RUPEES,
  CD_MONTHLY_BURN_RUPEES,
  CD_PREMIUM_SPLIT,
  CD_THRESHOLDS,
  cdDisputes,
  cdRiskLevel,
  cdRunwayMonths,
  cdRunwayWeeks,
  cdTransactions,
} from '../data/cdWalletMock'
import { claimsSummary } from '../data/claimsMock'
import { hrmsJoiningEmployees, hrmsLeavingEmployees } from '../data/mockData'
import { metrics } from '../data/dashboardMock'
import { formatInr } from './currencyFormat'

function formatAsOf(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function riskLabel(level) {
  if (level === 'critical') return 'Below minimum — endorsements may be blocked'
  if (level === 'warning') return 'Below buffer — monitor closely'
  return 'Healthy — above buffer threshold'
}

function riskTone(level) {
  if (level === 'critical') return 'danger'
  if (level === 'warning') return 'warning'
  return 'success'
}

/**
 * Live demo snapshot wired to the same mock sources as CD Balance + dashboard.
 * @param {{ entityLabel?: string, policyNo?: string, pathname?: string }} context
 */
export function buildAssistantSnapshot(context = {}) {
  const balance = CD_CURRENT_BALANCE_RUPEES
  const level = cdRiskLevel(balance)
  const lastTxn = cdTransactions[0] ?? null

  return {
    entityLabel: context.entityLabel ?? 'your entity',
    policyNo: context.policyNo ?? '—',
    pathname: context.pathname ?? '',
    balance,
    balanceFormatted: formatInr(balance),
    monthlyBurn: CD_MONTHLY_BURN_RUPEES,
    monthlyBurnFormatted: formatInr(CD_MONTHLY_BURN_RUPEES),
    minimum: CD_THRESHOLDS.minimum,
    minimumFormatted: formatInr(CD_THRESHOLDS.minimum),
    buffer: CD_THRESHOLDS.buffer,
    bufferFormatted: formatInr(CD_THRESHOLDS.buffer),
    runwayWeeks: cdRunwayWeeks(balance),
    runwayMonths: cdRunwayMonths(balance),
    riskLevel: level,
    riskLabel: riskLabel(level),
    riskTone: riskTone(level),
    asOfFormatted: formatAsOf(CD_BALANCE_AS_OF_ISO),
    sourceLabel: CD_BALANCE_SOURCE_LABEL,
    lastTxn,
    openDisputes: cdDisputes.length,
    claimsOpen: metrics.openClaims.count,
    claimsInReview: metrics.openClaims.inReview,
    claimsAwaitingDocs: metrics.openClaims.awaitingDocs,
    claimsPaidYtd: formatInr(claimsSummary.claimsPaidInr),
    totalEmployees: metrics.totalLives.employees,
    totalDependents: metrics.totalLives.dependents,
    hrmsJoining: hrmsJoiningEmployees.length,
    hrmsLeaving: hrmsLeavingEmployees.length,
    gmcPremium: CD_PREMIUM_SPLIT.gmcPremiumMonthly,
    gpaPremium: CD_PREMIUM_SPLIT.gpaPremiumMonthly,
    gmcPremiumFormatted: formatInr(CD_PREMIUM_SPLIT.gmcPremiumMonthly),
    gpaPremiumFormatted: formatInr(CD_PREMIUM_SPLIT.gpaPremiumMonthly),
  }
}

export const chatAssistantQuickPrompts = [
  { id: 'current_cd', label: 'Current CD', query: "what's my current cd" },
  { id: 'burn', label: 'Burn rate', query: 'what is my burn rate' },
  { id: 'claims', label: 'Open claims', query: 'how many open claims' },
  { id: 'hrms', label: 'HRMS pending', query: 'hrms pending review' },
  { id: 'runway', label: 'CD runway', query: 'how long will cd last' },
  { id: 'txn', label: 'Last transaction', query: 'latest cd transaction' },
]

export function normalizeAssistantQuery(input) {
  return (input || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

/** User wants the live balance figure — not a concept explanation. */
export function isCurrentCdBalanceQuery(q) {
  if (!q) return false
  return (
    /\b(current|today|now|latest|available|remaining|my)\b.*\b(cd|wallet|balance|cash deposit)\b/.test(q) ||
    /\b(how much|show me|tell me|give me|check|see)\b.*\b(cd|wallet|balance|cash deposit|money)\b/.test(q) ||
    /\b(what is|what's|whats)\b.*\b(cd|wallet)\b.*\b(balance|amount|money)\b/.test(q) ||
    /\b(what is|what's|whats)\b.*\b(my )?(cd|wallet)\s+balance\b/.test(q) ||
    /\b(cd|wallet)\s+balance\b/.test(q) ||
    /^cd\??$/.test(q) ||
    /\bwhat('s|s| is)\s+(the\s+)?(current\s+)?cd\b/.test(q)
  )
}

/** User wants a definition / concept — not the live number. */
export function isExplainCdQuery(q) {
  if (!q) return false
  if (isCurrentCdBalanceQuery(q)) return false
  return (
    /\b(what is|what's|whats|explain|define|tell me about|meaning of|how does)\b.*\b(cd|cash deposit|wallet)\b/.test(q) ||
    /\b(cd|cash deposit|wallet)\s+(mean|work)\b/.test(q)
  )
}

export function isCdRunwayQuery(q) {
  return /\b(runway|how long|weeks left|months left|last|run out)\b/.test(q) && /\b(cd|wallet|balance|fund)\b/.test(q)
}

export function isCdBurnDataQuery(q) {
  if (isExplainBurnQuery(q)) return false
  return (
    /\b(burn rate|monthly burn|burn amount|draw rate|spend rate)\b/.test(q) ||
    (/\b(burn|draw|spend|usage|outflow)\b/.test(q) && /\b(how much|current|what|amount|rate|monthly)\b/.test(q))
  )
}

export function isExplainBurnQuery(q) {
  return /\b(what is|explain|define|tell me about|meaning of)\b.*\b(burn|burn rate)\b/.test(q)
}

export function isCdStatusQuery(q) {
  return (
    /\b(cd|wallet)\s+(status|health|position|risk|level)\b/.test(q) ||
    /\b(is|are)\s+(cd|wallet|balance)\b.*\b(low|ok|healthy|fine|critical|warning)\b/.test(q) ||
    /\bbelow\b.*\b(buffer|minimum|threshold)\b/.test(q)
  )
}

export function isRecentCdTransactionQuery(q) {
  return (
    /\b(last|latest|recent|newest)\b.*\b(transaction|deduction|deposit|posting|movement|entry)\b/.test(q) ||
    /\b(recent|latest)\b.*\b(cd|wallet|ledger|history)\b/.test(q)
  )
}

export function isCdDisputeQuery(q) {
  return /\b(dispute|disputed|recon|reconciliation|under review)\b/.test(q)
}

export function isOpenClaimsQuery(q) {
  return /\b(open|pending|in review|awaiting)\b.*\bclaim/.test(q) || /\bclaim(s)?\s+(status|count|open)\b/.test(q)
}

export function isClaimsPaidQuery(q) {
  return /\b(claims paid|paid claims|claim amount|ytd claim)\b/.test(q)
}

export function isHrmsPendingQuery(q) {
  return /\b(hrms|joining|leaving|sync)\b/.test(q) && /\b(pending|review|how many|count)\b/.test(q)
}

export function isPolicyInfoQuery(q) {
  return /\b(policy no|policy number|policy #|which policy)\b/.test(q)
}

export function isLivesCountQuery(q) {
  return /\b(how many|total|count)\b.*\b(employee|lives|dependents|members)\b/.test(q)
}

export function isPremiumSplitQuery(q) {
  return /\b(gmc|gpa|premium split|premium breakdown|next billing)\b/.test(q)
}

export function isGreetingQuery(q) {
  return /^(hi|hello|hey|namaste|good\s(morning|afternoon|evening))\b/.test(q)
}

export function isThanksQuery(q) {
  return /\b(thank|thanks|thx)\b/.test(q)
}
