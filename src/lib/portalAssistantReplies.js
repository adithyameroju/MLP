/**
 * Demo-only rule-based replies for the floating assistant (no API).
 * @param {string} input
 * @param {{ entityLabel?: string, pathname?: string }} context
 * @returns {string}
 */
export function getPortalAssistantReply(input, context = {}) {
  const { entityLabel, pathname = '' } = context
  const q = (input || '').trim().toLowerCase()
  const ent = entityLabel ? ` for ${entityLabel}` : ''

  if (!q) {
    return "I'm here to help. Ask about your CD balance, burn rate, endorsement history, or where to find something in the portal. (Demo — answers are pre-written.)"
  }

  if (/^(hi|hello|hey|namaste|good\s(morning|afternoon|evening))\b/.test(q)) {
    return `Hi there. I can walk you through this employer portal${ent}. Try asking what CD balance is, how burn rate is estimated, or how to export your ledger.`
  }

  if (/\b(thank|thanks|thx)\b/.test(q)) {
    return "You're welcome. If you need anything else, just ask — CD wallet, endorsements, or help topics."
  }

  if (pathname.includes('cd-balance') && /\b(where|here|this\s+page)\b/.test(q)) {
    return "You're on CD Balance: the headline numbers show your current wallet and estimated monthly burn. The history log lists every posting; use the top search bar to filter by description or reference."
  }

  if (/\b(cd|wallet|cash\s*deposit|balance|prepaid|ledger)\b/.test(q)) {
    return 'CD (Cash Deposit) is the prepaid wallet used to pay premiums and endorsement-related debits. Your CD balance is the available amount after posted movements. When it runs low, finance may need to add funds before some endorsements can go through. (Numbers here are demo data.)'
  }

  if (/\b(burn|monthly|draw|spend|outflow|usage)\b/.test(q)) {
    return "Burn rate (est.) is a simple forecast of how much the wallet typically uses per month, based on recent activity. The small trend chart shows how that estimate moved month to month. It's a planning guide, not a bill."
  }

  if (/\b(endorse|endorsement|add\s+employee|policy\s+change|quick\s*add|bulk)\b/.test(q)) {
    return 'Endorsements (add, update, delete employees) are under Endorsements in the left nav. Successful runs usually create deductions on the CD when premiums apply. You can open an endorsement from History and trace it back to the wallet via reference IDs in the CD history log.'
  }

  if (/\b(hrms|sync|joining|leaving)\b/.test(q)) {
    return 'HRMS sync lets you review joining and leaving employees pulled from your HR system before you process them. Open it from the endorsements area when you have pending items.'
  }

  if (/\b(history|log|table|export|csv|transaction|receipt|statement)\b/.test(q)) {
    return 'The History log table lists each wallet movement. Use the date and type filters, and the search field in the top bar to match descriptions or reference IDs. Export CSV downloads what you have filtered (demo download).'
  }

  if (/\b(help|support|how\s+do\s+i|where\s+is)\b/.test(q)) {
    return 'For guides and contact options, go to Help center in the left navigation. I can also answer short questions about CD balance and endorsements from this chat (demo only).'
  }

  if (/\b(hello|acko|what\s+can\s+you|who\s+are\s+you)\b/.test(q)) {
    return "I'm a demo assistant built into this UI — I don't call a real model. I match your question to pre-written help text so the flow feels like a product chat. Your messages aren't sent to a server."
  }

  return 'I can help with CD balance, burn rate, the history log, and how endorsements connect to the wallet. Try: "What is burn rate?", "How do I find a transaction?", or "Explain endorsements." (Demo only.)'
}
