/**
 * Action-oriented procedure steps for help article detail pages.
 * @typedef {{ title: string, body: string }} ProcedureStep
 */

/** @type {Record<string, ProcedureStep[]>} */
export const ARTICLE_PROCEDURE_OVERRIDES = {
  kb_add_quick: [
    { title: 'Open Quick Add', body: 'From the sidebar, go to Endorsements → Add → Quick Add. The form supports up to five employees in one batch.' },
    { title: 'Enter employee details', body: 'Add employee ID (must match HR roster), name, plan, and dependents as required. Duplicate IDs fail validation before you can submit.' },
    { title: 'Review CD and premium preview', body: 'Before submit, read the premium preview. Premium reserves against your CD wallet on submit—not when the insurer finalises. If runway is tight, recharge or reduce the batch.' },
    { title: 'Submit and confirm on the schedule', body: 'Submit only when preview and balance look correct. Successful rows appear on the endorsement schedule with a clear status—use that as your audit trail.' },
    { title: 'Verify outcome', body: 'Confirm schedule status and CD deduction match expectations. Employees without email still get created; comms depend on your notification settings.' },
  ],
  kb_gs_first_endorsement: [
    { title: 'Confirm plan and ID format', body: 'With HR, confirm active plan and employee ID format. Glance at CD runway on the dashboard if premium draws immediately.' },
    { title: 'Open Quick Add', body: 'Sidebar → Endorsements → Quick Add. Enter one employee to keep the first transaction simple.' },
    { title: 'Fill the form and preview premium', body: 'Complete required fields, add dependents if needed, then open the premium preview. Do not submit until the CD impact is acceptable.' },
    { title: 'Submit the endorsement', body: 'Submit the batch. You should see a success state—not a silent failure.' },
    { title: 'Find the row on the schedule', body: 'Open the endorsement schedule and locate your row by employee ID and activity type. Note status for finance or leadership if asked.' },
  ],
  kb_gs_cd_mental_model: [
    { title: 'Open CD balance', body: 'From the sidebar, open CD Balance. Note current balance and last-updated time before explaining movement to finance.' },
    { title: 'Understand preview vs finalisation', body: 'Endorsement flows show expected premium in preview before submit. That is the number HR should quote—not an estimate from spreadsheets.' },
    { title: 'Trace a deduction after submit', body: 'After an endorsement submits, find the matching deduction in the transaction log with the endorsement reference.' },
    { title: 'Explain net impact in plain language', body: 'Tell stakeholders: premium timing follows submit/reservation rules; CD updates when the endorsement hits the wallet ledger.' },
  ],
  kb_schedule_overview: [
    { title: 'Open the endorsement schedule', body: 'From Endorsements, open the schedule view (or use the dedicated schedules page). This is the audit list finance and HR share.' },
    { title: 'Locate activity and effective date', body: 'Scan for activity type (add, update, delete) and effective date—these drive most employee and finance questions.' },
    { title: 'Read status and premium columns', body: 'Status shows whether the insurer accepted the change. Premium amount ties back to CD deductions—use both when explaining a row.' },
    { title: 'Export or share for audit', body: 'Use filters to narrow the period, then share row references with leadership instead of raw screenshots when possible.' },
  ],
  kb_claims_documents: [
    { title: 'Open Claims', body: 'Go to Claims from the sidebar. You will use document requirements from claim detail when coaching employees.' },
    { title: 'Share the standard checklist', body: 'Ask for itemised bills, discharge summary, pharmacy breakups where applicable, and KYC or relationship proof for dependents.' },
    { title: 'Match pending vs uploaded', body: 'On a claim detail view, compare uploaded vs pending documents before telling the employee everything is complete.' },
    { title: 'Set reimbursement expectations', body: 'Explain that missing documents delay reimbursement turnaround—HR should not promise dates the portal does not show.' },
  ],
  kb_cd_recharge: [
    { title: 'Check runway on CD balance', body: 'Open CD Balance and read runway together with pending premium from upcoming endorsements.' },
    { title: 'Identify the warning signal', body: 'If runway is inside your finance policy window, pause non-urgent bulk uploads until balance is confirmed.' },
    { title: 'Coordinate with treasury', body: 'Use the same dashboard numbers when requesting top-up—avoid parallel spreadsheets that disagree with the portal.' },
    { title: 'Recharge before operations stall', body: 'Initiate recharge and wait for confirmation before submitting large batches that would exceed available CD.' },
  ],
  kb_cd_disputes: [
    { title: 'Confirm on the endorsement schedule', body: 'Find the endorsement by reference and verify status and effective date match what you expected to hit CD.' },
    { title: 'Locate the ledger line', body: 'On CD Balance, find the deduction or credit row. Note amount, date, and description.' },
    { title: 'Gather evidence', body: 'Attach endorsement reference, expected premium from preview, and screenshots of both schedule and ledger rows.' },
    { title: 'Open a dispute with CD desk', body: 'Contact CD wallet support with evidence in one thread so investigation does not restart across emails.' },
  ],
  kb_policy_faq_template: [
    { title: 'Open policy coverage', body: 'From the sidebar, open Policy → Coverage. Use search before opening the full PDF.' },
    { title: 'Search the employee question', body: 'Enter plain language—room rent, LASIK, maternity sub-limits. Read the snippet tied to the employee band.' },
    { title: 'Draft your reply from the tool', body: 'Quote band and limit from the portal answer. Do not paste outdated PDF pages into email.' },
    { title: 'Escalate edge cases', body: 'Legal interpretation, cross-border care, or unmodelled riders go to your policy SPOC with an anonymised scenario.' },
  ],
  kb_policy_exclusions: [
    { title: 'Open coverage search', body: 'Go to Policy coverage and search the treatment or benefit the employee asked about.' },
    { title: 'Check band-specific exclusions', body: 'Exclusions and waiting periods vary by grade—confirm the employee band before answering.' },
    { title: 'Explain waiting periods', body: 'Waiting periods usually run from member start date unless the master policy documents a waiver.' },
    { title: 'Set cost expectations early', body: 'If excluded or waiting, tell the employee before they incur costs—do not imply coverage the tool does not show.' },
  ],
  kb_enrolment_dependents: [
    { title: 'Open Enrolment', body: 'From the sidebar, open Enrolment during the active window or life-event period.' },
    { title: 'Verify relationship and age rules', body: 'Match dependent relationship and age to the master policy before collecting proofs.' },
    { title: 'Collect documents once', body: 'Gather marriage or birth certificates (as applicable) before the window closes to avoid rejected rows.' },
    { title: 'Submit and track status', body: 'Submit dependent additions and track completion on the enrolment dashboard until confirmed.' },
  ],
  kb_enrolment_deadlines: [
    { title: 'Review completion on Enrolment', body: 'Open Enrolment and filter pending employees. Note completion rate against your payroll cut-off.' },
    { title: 'Export or share pending list', body: 'If your process allows, share pending names with managers for nudges—avoid sharing clinical details.' },
    { title: 'Send a clear deadline message', body: 'Communicate the hard stop date and what happens if enrolment is incomplete (cover start delay, etc.).' },
    { title: 'Confirm before cut-off', body: 'Re-check the dashboard after reminders; escalate stragglers before the window closes.' },
  ],
  kb_reports_scheduled: [
    { title: 'Open Reports', body: 'From the sidebar, open Reports. Decide if finance needs recurring or one-off output.' },
    { title: 'Choose scheduled for recurring KPIs', body: 'Use scheduled reports for month-end utilisation or claims packs that repeat every period.' },
    { title: 'Choose on-demand for audits', body: 'Use on-demand generation for ad-hoc investigations or auditor requests with a custom date range.' },
    { title: 'Avoid duplicate runs', body: 'Confirm no one else queued the same report—duplicate runs waste processing and confuse download folders.' },
  ],
  kb_reports_utilisation: [
    { title: 'Generate the utilisation report', body: 'Open Reports, pick utilisation or claims experience, and set a date range that matches renewal discussion.' },
    { title: 'Account for claims lag', body: 'Recent months understate experience because claims arrive late—do not treat last month as final.' },
    { title: 'Slice by band or location', body: 'Compare segments before concluding a trend; company-wide averages hide hot spots.' },
    { title: 'Narrate for renewal', body: 'Present trends with lag caveats to finance and brokers—tie numbers back to portal export timestamps.' },
  ],
}

/**
 * @param {Record<string, unknown>} article
 * @returns {ProcedureStep[]}
 */
export function buildProcedureSteps(article) {
  if (ARTICLE_PROCEDURE_OVERRIDES[article.id]) {
    return ARTICLE_PROCEDURE_OVERRIDES[article.id]
  }

  /** @type {ProcedureStep[]} */
  const steps = []

  if (article.bestWhen) {
    steps.push({
      title: 'When to use this guide',
      body: article.bestWhen,
    })
  }

  if (article.tryItPath && article.tryItLabel) {
    steps.push({
      title: article.tryItLabel,
      body: `In the employer portal, use the sidebar to open **${article.tryItLabel}**. You should land on the screen where you perform the task described in the steps below.`,
    })
  }

  for (const section of article.detailSections ?? []) {
    section.paragraphs.forEach((para, idx) => {
      const title =
        section.paragraphs.length === 1
          ? section.heading
          : `${section.heading} (${idx + 1} of ${section.paragraphs.length})`
      steps.push({ title, body: para })
    })
  }

  steps.push({
    title: 'Confirm the outcome',
    body:
      article.outcome ??
      'Check that the portal shows the result you expected. If not, capture reference numbers and escalate via the appropriate help desk.',
  })

  return steps
}

/** @param {{ id: string, procedureSteps?: ProcedureStep[] } & Record<string, unknown>} article */
export function getArticleProcedureSteps(article) {
  if (article.procedureSteps?.length) return article.procedureSteps
  return buildProcedureSteps(article)
}
