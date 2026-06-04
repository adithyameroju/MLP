/**
 * Demo assistant — intent router with live mock data + in-chat actions.
 *
 * @typedef {{ id: string, label: string, path?: string, message?: string }} AssistantAction
 * @typedef {'neutral'|'success'|'warning'|'danger'} HighlightTone
 * @typedef {{ label: string, value: string, tone?: HighlightTone }} AssistantHighlight
 * @typedef {{ text: string, actions?: AssistantAction[], highlights?: AssistantHighlight[] }} AssistantReply
 */

import { claimsSummary } from '../data/claimsMock'
import { formatInr } from './currencyFormat'
import {
  buildAssistantSnapshot,
  isCdBurnDataQuery,
  isCdDisputeQuery,
  isCdRunwayQuery,
  isCdStatusQuery,
  isClaimsPaidQuery,
  isCurrentCdBalanceQuery,
  isExplainBurnQuery,
  isExplainCdQuery,
  isGreetingQuery,
  isHrmsPendingQuery,
  isLivesCountQuery,
  isOpenClaimsQuery,
  isPolicyInfoQuery,
  isPremiumSplitQuery,
  isRecentCdTransactionQuery,
  isThanksQuery,
  normalizeAssistantQuery,
} from './portalAssistantContext'

/**
 * @param {string} input
 * @param {{ entityLabel?: string, policyNo?: string, pathname?: string }} context
 * @returns {AssistantReply}
 */
export function getPortalAssistantReply(input, context = {}) {
  const snap = buildAssistantSnapshot(context)
  const q = normalizeAssistantQuery(input)
  const ent = snap.entityLabel !== 'your entity' ? snap.entityLabel : null

  if (!q) {
    return {
      text: `I can pull live numbers from your wallet, explain concepts, or jump you into a flow${ent ? ` for ${ent}` : ''}. Try "What's my current CD?" or "How many open claims?"`,
      highlights: [
        { label: 'CD balance', value: snap.balanceFormatted, tone: 'neutral' },
        { label: 'Status', value: snap.riskLabel.split(' — ')[0], tone: snap.riskTone },
      ],
      actions: [
        { id: 'cd', label: 'Open CD Balance', path: '/cd-balance' },
        { id: 'add', label: 'Add employees', path: '/add' },
        { id: 'help', label: 'Browse help', path: '/support/help' },
      ],
    }
  }

  if (isGreetingQuery(q)) {
    return {
      text: `Hey!${ent ? ` You're on ${ent}` : ''} — I can read your CD wallet, claims snapshot, and HRMS queue right from here. What do you want to check?`,
      highlights: [
        { label: 'Current CD', value: snap.balanceFormatted, tone: 'neutral' },
        { label: 'Open claims', value: String(snap.claimsOpen), tone: 'neutral' },
      ],
      actions: [
        { id: 'cd_val', label: 'Full CD breakdown', message: "what's my current cd balance" },
        { id: 'claims', label: 'Open claims', message: 'how many open claims' },
        { id: 'add', label: 'Add employees', path: '/add' },
      ],
    }
  }

  if (isThanksQuery(q)) {
    return { text: "Anytime — ask for a number, an explanation, or tell me where you want to go." }
  }

  if (isCurrentCdBalanceQuery(q)) {
    return {
      text: `${ent ? `For ${ent}, y` : 'Y'}our current CD balance is ${snap.balanceFormatted} as of ${snap.asOfFormatted}. ${snap.riskLabel}.`,
      highlights: [
        { label: 'Available balance', value: snap.balanceFormatted, tone: 'neutral' },
        { label: 'Average consumption', value: snap.monthlyBurnFormatted, tone: 'neutral' },
        { label: 'Buffer threshold', value: snap.bufferFormatted, tone: 'neutral' },
        { label: 'Status', value: snap.riskLabel.split(' — ')[0], tone: snap.riskTone },
      ],
      actions: [
        { id: 'cd_page', label: 'View full ledger', path: '/cd-balance' },
        { id: 'runway', label: 'Show runway', message: 'how long will cd last' },
        { id: 'last_txn', label: 'Last transaction', message: 'latest cd transaction' },
      ],
    }
  }

  if (isCdRunwayQuery(q)) {
    const weeks = snap.runwayWeeks ?? '—'
    const months = snap.runwayMonths ?? '—'
    return {
      text: `At the current burn of ${snap.monthlyBurnFormatted}/month, your ${snap.balanceFormatted} wallet gives roughly ${months} month${months === 1 ? '' : 's'} (~${weeks} weeks) of runway. That's illustrative — actual draw varies with endorsements and settlements.`,
      highlights: [
        { label: 'Balance', value: snap.balanceFormatted, tone: 'neutral' },
        { label: 'Monthly burn (est.)', value: snap.monthlyBurnFormatted, tone: 'neutral' },
        { label: 'Runway (est.)', value: `${months} mo · ${weeks} wk`, tone: snap.riskTone },
      ],
      actions: [
        { id: 'cd', label: 'See trend chart', path: '/cd-balance' },
        { id: 'burn', label: 'Explain burn rate', message: 'what is burn rate' },
      ],
    }
  }

  if (isCdBurnDataQuery(q)) {
    return {
      text: `Your estimated monthly burn is ${snap.monthlyBurnFormatted} — based on recent wallet activity, not a fixed invoice. GMC and GPA premiums together drive most of the draw.`,
      highlights: [
        { label: 'Monthly burn (est.)', value: snap.monthlyBurnFormatted, tone: 'neutral' },
        { label: 'GMC (next cycle est.)', value: snap.gmcPremiumFormatted, tone: 'neutral' },
        { label: 'GPA (next cycle est.)', value: snap.gpaPremiumFormatted, tone: 'neutral' },
      ],
      actions: [
        { id: 'cd', label: 'View on CD page', path: '/cd-balance' },
        { id: 'explain', label: 'What is burn rate?', message: 'explain burn rate' },
      ],
    }
  }

  if (isCdStatusQuery(q)) {
    return {
      text: `CD status for ${ent ?? 'your entity'}: ${snap.riskLabel}. Minimum is ${snap.minimumFormatted}; recommended buffer is ${snap.bufferFormatted}. You're at ${snap.balanceFormatted} right now.`,
      highlights: [
        { label: 'Balance', value: snap.balanceFormatted, tone: snap.riskTone },
        { label: 'Minimum', value: snap.minimumFormatted, tone: 'warning' },
        { label: 'Buffer', value: snap.bufferFormatted, tone: 'neutral' },
        { label: 'Status', value: snap.riskLabel.split(' — ')[0], tone: snap.riskTone },
      ],
      actions: [
        { id: 'cd', label: 'Open CD Balance', path: '/cd-balance' },
        { id: 'topup', label: 'How to top up?', message: 'how do I top up cd wallet' },
      ],
    }
  }

  if (isRecentCdTransactionQuery(q)) {
    const t = snap.lastTxn
    if (!t) {
      return {
        text: "I don't have a recent transaction on file yet.",
        actions: [{ id: 'cd', label: 'Open CD Balance', path: '/cd-balance' }],
      }
    }
    const amt = t.amount >= 0 ? `+${formatInr(t.amount)}` : `−${formatInr(Math.abs(t.amount))}`
    return {
      text: `Latest posting: "${t.description}" for ${amt} on ${formatTxnDate(t.at)}. Balance after: ${formatInr(t.balanceAfter)}.${t.endorsementRef ? ` Ref: ${t.endorsementRef}.` : ''}`,
      highlights: [
        { label: 'Amount', value: amt, tone: t.amount < 0 ? 'warning' : 'success' },
        { label: 'Balance after', value: formatInr(t.balanceAfter), tone: 'neutral' },
        {
          label: 'Settlement',
          value: t.settlement === 'pending_recon' ? 'Pending recon' : 'Settled',
          tone: t.settlement === 'pending_recon' ? 'warning' : 'success',
        },
      ],
      actions: [
        { id: 'cd', label: 'Full history log', path: '/cd-balance' },
        { id: 'more', label: 'Show disputes', message: 'any cd disputes' },
      ],
    }
  }

  if (isCdDisputeQuery(q)) {
    if (snap.openDisputes === 0) {
      return {
        text: 'No open CD disputes on file.',
        actions: [{ id: 'cd', label: 'Open CD Balance', path: '/cd-balance' }],
      }
    }
    return {
      text: `You have ${snap.openDisputes} open CD dispute${snap.openDisputes === 1 ? '' : 's'} under review — including a possible duplicate debit linked to Quick Add QA-9921 (${formatInr(42300)}).`,
      highlights: [{ label: 'Open disputes', value: String(snap.openDisputes), tone: 'warning' }],
      actions: [
        { id: 'cd', label: 'Review on CD page', path: '/cd-balance' },
        { id: 'txn', label: 'Last transaction', message: 'latest cd transaction' },
      ],
    }
  }

  if (isOpenClaimsQuery(q)) {
    return {
      text: `You have ${snap.claimsOpen} open claims — ${snap.claimsInReview} in review and ${snap.claimsAwaitingDocs} awaiting documents. I can take you to the claims hub to drill in.`,
      highlights: [
        { label: 'Open claims', value: String(snap.claimsOpen), tone: 'neutral' },
        { label: 'In review', value: String(snap.claimsInReview), tone: 'warning' },
        { label: 'Awaiting docs', value: String(snap.claimsAwaitingDocs), tone: 'warning' },
      ],
      actions: [
        { id: 'claims', label: 'Open claims', path: '/claims' },
        { id: 'paid', label: 'Claims paid YTD', message: 'claims paid ytd' },
      ],
    }
  }

  if (isClaimsPaidQuery(q)) {
    return {
      text: `Claims paid YTD: ${snap.claimsPaidYtd}. Average settlement is about ${claimsSummary.avgSettlementDays} days; top category is ${claimsSummary.topCategoryLabel}.`,
      highlights: [
        { label: 'Paid YTD', value: snap.claimsPaidYtd, tone: 'success' },
        { label: 'Avg settlement', value: `${claimsSummary.avgSettlementDays} days`, tone: 'neutral' },
      ],
      actions: [{ id: 'claims', label: 'View claims', path: '/claims' }],
    }
  }

  if (isHrmsPendingQuery(q) || (/\b(hrms|sync)\b/.test(q) && !/\b(how|what|explain)\b/.test(q))) {
    return {
      text: `HRMS sync has ${snap.hrmsJoining} joining and ${snap.hrmsLeaving} leaving employees waiting for review. Process them before payroll cut-off to avoid coverage gaps.`,
      highlights: [
        { label: 'Joining', value: String(snap.hrmsJoining), tone: 'success' },
        { label: 'Leaving', value: String(snap.hrmsLeaving), tone: 'warning' },
      ],
      actions: [
        { id: 'hrms', label: 'Review HRMS sync', path: '/hrms-sync' },
        { id: 'add', label: 'Quick Add instead', path: '/add' },
      ],
    }
  }

  if (isPolicyInfoQuery(q)) {
    return {
      text: `${ent ? `${ent} is` : 'Your entity is'} on policy ${snap.policyNo}. Policy coverage shows bands, limits, and benefits.`,
      highlights: [{ label: 'Policy no.', value: snap.policyNo, tone: 'neutral' }],
      actions: [
        { id: 'policy', label: 'View coverage', path: '/policy-management/coverage' },
        { id: 'cd', label: 'CD Balance', path: '/cd-balance' },
      ],
    }
  }

  if (isLivesCountQuery(q)) {
    return {
      text: `Your group covers ${snap.totalEmployees.toLocaleString('en-IN')} employees and ${snap.totalDependents.toLocaleString('en-IN')} dependents.`,
      highlights: [
        { label: 'Employees', value: snap.totalEmployees.toLocaleString('en-IN'), tone: 'neutral' },
        { label: 'Dependents', value: snap.totalDependents.toLocaleString('en-IN'), tone: 'neutral' },
      ],
      actions: [
        { id: 'dash', label: 'Dashboard', path: '/dashboard' },
        { id: 'enrol', label: 'Enrolment', path: '/enrolment' },
      ],
    }
  }

  if (isPremiumSplitQuery(q)) {
    return {
      text: `Next billing cycle estimate: GMC ${snap.gmcPremiumFormatted}/mo and GPA ${snap.gpaPremiumFormatted}/mo. These illustrate premium mix — your actual invoice may differ.`,
      highlights: [
        { label: 'GMC (est.)', value: snap.gmcPremiumFormatted, tone: 'neutral' },
        { label: 'GPA (est.)', value: snap.gpaPremiumFormatted, tone: 'neutral' },
      ],
      actions: [{ id: 'cd', label: 'See on CD page', path: '/cd-balance' }],
    }
  }

  if (/\b(top up|top-up|add funds|deposit|recharge)\b/.test(q)) {
    return {
      text: `To add funds, finance initiates a wallet top-up (NEFT/RTGS). The last deposit was ${formatInr(2500000)} on 15 Mar. After posting, balance updates in the history log.`,
      actions: [
        { id: 'cd', label: 'CD history log', path: '/cd-balance' },
        { id: 'help', label: 'CD help guide', path: '/support/help' },
      ],
    }
  }

  if (isExplainCdQuery(q)) {
    return {
      text: `CD (Cash Deposit) is your prepaid wallet for premiums and endorsement debits${ent ? ` under ${ent}` : ''}. Right now the live balance is ${snap.balanceFormatted} — ask me "what's my current CD?" anytime for the latest figure.`,
      actions: [
        { id: 'current', label: 'Show current balance', message: "what's my current cd" },
        { id: 'cd', label: 'Open CD page', path: '/cd-balance' },
      ],
    }
  }

  if (isExplainBurnQuery(q)) {
    return {
      text: `Burn rate is a forecast of typical monthly wallet usage — right now about ${snap.monthlyBurnFormatted}/month. It's for planning, not a bill.`,
      actions: [
        { id: 'burn_data', label: 'Show burn amount', message: 'what is my burn rate' },
        { id: 'cd', label: 'View trend', path: '/cd-balance' },
      ],
    }
  }

  if (snap.pathname.includes('cd-balance') && /\b(where|here|this\s+page)\b/.test(q)) {
    return {
      text: "You're on CD Balance — headline cards show wallet + burn; the table below is the full ledger. Header search filters descriptions and refs.",
      actions: [
        { id: 'export', label: 'How to export?', message: 'how do I export cd transactions' },
        { id: 'endorse', label: 'Go to endorsements', path: '/' },
      ],
    }
  }

  if (/\b(quick\s*add|add\s+employee)\b/.test(q)) {
    return {
      text: 'Quick Add guides you through employee additions with validation and premium preview before submit.',
      actions: [
        { id: 'quick_add', label: 'Start Quick Add', path: '/add' },
        { id: 'cd_impact', label: 'Check CD first', message: "what's my current cd" },
      ],
    }
  }

  if (/\b(endorse|endorsement|policy\s+change|bulk)\b/.test(q)) {
    return {
      text: 'Endorsements handle add, update, and delete. Successful runs usually debit CD — trace them via reference IDs in the ledger.',
      actions: [
        { id: 'endorse_home', label: 'Open endorsements', path: '/' },
        { id: 'quick_add', label: 'Add employees', path: '/add' },
        { id: 'cd', label: 'Check CD impact', message: "what's my current cd" },
      ],
    }
  }

  if (/\b(history|log|table|export|csv|transaction|receipt|statement)\b/.test(q)) {
    return {
      text: 'Filter the CD history log by date/type, search by description or ref, then export CSV for the filtered view.',
      actions: [
        { id: 'cd', label: 'Open CD history', path: '/cd-balance' },
        { id: 'last', label: 'Latest posting', message: 'latest cd transaction' },
      ],
    }
  }

  if (/\b(claim)\b/.test(q)) {
    return {
      text: `Claims hub tracks status and timelines. You currently have ${snap.claimsOpen} open claims.`,
      actions: [
        { id: 'claims', label: 'Open claims', path: '/claims' },
        { id: 'open', label: 'Open claim count', message: 'how many open claims' },
      ],
    }
  }

  if (/\b(policy|coverage)\b/.test(q)) {
    return {
      text: 'Policy coverage shows bands, limits, and key benefits for your group policy.',
      actions: [{ id: 'policy', label: 'View coverage', path: '/policy-management/coverage' }],
    }
  }

  if (/\b(release|tutorial|new\s+feature|invoice schedule)\b/.test(q)) {
    return {
      text: 'New releases walks through recent portal changes with short tutorials.',
      actions: [
        { id: 'releases', label: 'See releases', path: '/new-releases' },
        { id: 'help', label: 'All guides', path: '/support/help' },
      ],
    }
  }

  if (/\b(enrol|enrollment|enrolment)\b/.test(q)) {
    return {
      text: 'Enrolment tracks employee onboarding completion against your payroll cut-off.',
      actions: [{ id: 'enrol', label: 'Open enrolment', path: '/enrolment' }],
    }
  }

  if (/\b(report)\b/.test(q)) {
    return {
      text: 'Reports lets you generate and download portfolio analytics — claims summaries, utilisation, and more.',
      actions: [{ id: 'reports', label: 'Open reports', path: '/reports' }],
    }
  }

  if (/\b(feedback|complaint|suggest)\b/.test(q)) {
    return {
      text: 'Use Feedback to share product suggestions or report issues — we route it to the portal team.',
      actions: [{ id: 'feedback', label: 'Send feedback', path: '/support/feedback' }],
    }
  }

  if (/\b(help|support|how\s+do\s+i|where\s+is|guide)\b/.test(q)) {
    return {
      text: 'Help center has step-by-step guides, videos, and contact options — or keep chatting here for quick answers.',
      actions: [
        { id: 'help', label: 'Open help center', path: '/support/help' },
        { id: 'cd', label: 'Current CD', message: "what's my current cd" },
      ],
    }
  }

  if (/\b(what\s+can\s+you|who\s+are\s+you|capabilities)\b/.test(q)) {
    return {
      text: 'I can read live numbers (CD balance, burn, claims, HRMS queue), explain concepts, and open flows for you. Try: "current CD", "open claims", "HRMS pending", or "latest transaction".',
      highlights: [
        { label: 'CD balance', value: snap.balanceFormatted, tone: 'neutral' },
        { label: 'Open claims', value: String(snap.claimsOpen), tone: 'neutral' },
        { label: 'HRMS pending', value: `${snap.hrmsJoining}J · ${snap.hrmsLeaving}L`, tone: 'neutral' },
      ],
      actions: [
        { id: 'cd', label: 'Current CD', message: "what's my current cd" },
        { id: 'claims', label: 'Open claims', message: 'open claims count' },
        { id: 'help', label: 'Help center', path: '/support/help' },
      ],
    }
  }

  return {
    text: `I'm not sure about that one — but here's your snapshot${ent ? ` for ${ent}` : ''}. Rephrase or pick an action below.`,
    highlights: [
      { label: 'CD balance', value: snap.balanceFormatted, tone: snap.riskTone },
      { label: 'Burn (est.)', value: snap.monthlyBurnFormatted, tone: 'neutral' },
      { label: 'Open claims', value: String(snap.claimsOpen), tone: 'neutral' },
    ],
    actions: [
      { id: 'cd', label: 'Current CD', message: "what's my current cd" },
      { id: 'runway', label: 'CD runway', message: 'how long will cd last' },
      { id: 'help', label: 'Help center', path: '/support/help' },
    ],
  }
}

/** Variable typing delay for a more natural feel (demo). */
export function assistantReplyDelay(text) {
  const base = 380
  const perChar = 12
  return Math.min(base + (text?.length ?? 0) * perChar, 1400)
}

function formatTxnDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
