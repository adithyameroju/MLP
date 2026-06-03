/** HR-facing help & support — mock CMS/API shape */

import { getArticleProcedureSteps } from './helpArticleProcedures.js'

export const keyAccountManager = {
  name: 'Priya Sharma',
  role: 'Key Account Manager',
  email: 'employer.support@acko.com',
  phone: '1800-266-2256',
  phoneDisplay: '1800-266-2256',
  hours: 'Mon–Fri, 9:00–18:00 IST',
}

/** Action cards for Contact support — single KAM, multiple channels */
export const supportContactActions = [
  {
    id: 'chat',
    label: 'AI assistant',
    description: 'Get quick answers from our assistant',
    cta: 'Open assistant',
    action: 'openChat',
    icon: 'MessageCircle',
  },
  {
    id: 'email',
    label: 'Email support',
    description: keyAccountManager.email,
    cta: 'Send email',
    action: 'mailto',
    href: `mailto:${keyAccountManager.email}`,
    icon: 'Mail',
  },
  {
    id: 'phone',
    label: 'Call support',
    description: `${keyAccountManager.phoneDisplay} · ${keyAccountManager.hours}`,
    cta: 'Call now',
    action: 'tel',
    href: `tel:${keyAccountManager.phone.replace(/\D/g, '')}`,
    icon: 'Phone',
  },
]

/** @deprecated Use supportContactActions + keyAccountManager */
export const contactChannels = []

/** @typedef {{ id: string, heading: string, paragraphs: string[] }} KnowledgeArticleSection */
/** @typedef {{ title: string, body: string }} ProcedureStep */

export const knowledgeArticles = [
  {
    id: 'kb_add_quick',
    topicId: 'endorsements',
    title: 'Quick Add: plans, dependents, and CD impact',
    tags: ['add employee', 'quick add', 'cd', 'dependents'],
    snippet: 'Walk through adding up to five employees in one batch and when premium is drawn from your CD wallet.',
    readMinutes: 4,
    isNew: true,
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
    topicId: 'endorsements',
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
    topicId: 'endorsements',
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
    topicId: 'endorsements',
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
    topicId: 'policy',
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
  // —— Claims (claims-context.md) ——
  {
    id: 'kb_claims_list',
    topicId: 'claims',
    title: 'Finding and filtering claims',
    tags: ['claims', 'filter', 'search', 'status'],
    snippet: 'Use summary metrics, filters, and search to locate claims and spot what needs HR attention.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'You need a claim ID or status before answering an employee or escalating to the TPA.',
    outcome: 'You will narrow the list to the right claims without exporting spreadsheets.',
    tryItLabel: 'Open Claims',
    tryItPath: '/claims',
    detailSections: [
      {
        id: 's1',
        heading: 'Start from the summary',
        paragraphs: [
          'MTD and YTD counts plus paid value give context before you drill into the table—use them in stand-ups with HR leadership.',
          'Top category and average settlement time hint where employees may ask repetitive questions.',
        ],
      },
      {
        id: 's2',
        heading: 'Filter and search',
        paragraphs: [
          'Filter by status (Approved, Processing, Under Review, Rejected) and type (Cashless / Reimbursement) to match how employees describe their case.',
          'Search by employee name, ID, or email when someone forwards a vague “my claim” message.',
        ],
      },
    ],
  },
  {
    id: 'kb_claims_detail',
    topicId: 'claims',
    title: 'Reading a claim: timeline and documents',
    tags: ['claims', 'timeline', 'documents', 'detail'],
    snippet: 'Open a claim to see treatment details, financial breakdown, uploaded files, and step-by-step progress.',
    readMinutes: 4,
    bestWhen: 'An employee asks what stage a cashless or reimbursement claim is in.',
    outcome: 'You will explain status, pending documents, and next steps from one screen.',
    tryItLabel: 'View claims',
    tryItPath: '/claims',
    detailSections: [
      {
        id: 's1',
        heading: 'What the detail view shows',
        paragraphs: [
          'Employee and hospital context sit beside claimed vs approved amounts so you can set reimbursement expectations.',
          'Document lists distinguish uploaded vs pending—use that list when chasing the employee or hospital.',
        ],
      },
      {
        id: 's2',
        heading: 'Timeline and progress',
        paragraphs: [
          'The timeline runs Submitted → documents verified → medical review → outcome, with timestamps and a progress indicator.',
          'Claims are view-only in the portal today; note gaps and escalate via the claims desk when action is stuck.',
        ],
      },
    ],
  },
  {
    id: 'kb_claims_hr_employee',
    topicId: 'claims',
    title: 'Answering “where is my claim?”',
    tags: ['claims', 'employee', 'hr query', 'escalation'],
    snippet: 'A short script for HR: locate the claim, read the timeline, and when to loop in claims support.',
    readMinutes: 3,
    bestWhen: 'Employees ping HR before the insurer has finished review.',
    outcome: 'You will give a factual update and avoid promising dates the system does not support.',
    tryItLabel: 'Open Claims',
    tryItPath: '/claims',
    detailSections: [
      {
        id: 's1',
        heading: 'Three-step check',
        paragraphs: [
          'Find the claim in the list, confirm status matches what the employee was told at admission or upload.',
          'If documents are pending, tell the employee exactly which item is missing from the detail view.',
        ],
      },
      {
        id: 's2',
        heading: 'When to escalate',
        paragraphs: [
          'Escalate to claims support when the timeline has not moved beyond SLA you publish internally, or amounts disagree with the employee’s paperwork.',
          'Share claim ID and last timeline event—avoid sending clinical details over unsecured channels.',
        ],
      },
    ],
  },
  // —— CD & premium (cd-balance-context.md, flows-cd-balance.md) ——
  {
    id: 'kb_cd_dashboard',
    topicId: 'cd',
    title: 'CD balance dashboard and transaction log',
    tags: ['cd', 'wallet', 'transactions', 'balance'],
    snippet: 'Read current balance, last update time, and the ledger of deposits, deductions, and refunds.',
    readMinutes: 4,
    bestWhen: 'Finance or HR needs to reconcile wallet movement before month-end.',
    outcome: 'You will trace a balance change to a specific endorsement or recharge line item.',
    tryItLabel: 'Open CD balance',
    tryItPath: '/cd-balance',
    detailSections: [
      {
        id: 's1',
        heading: 'Summary cards',
        paragraphs: [
          'Current balance and monthly burn rate are the headline numbers—confirm last-updated time before quoting in email.',
          'Treat the dashboard as the portal source of truth; avoid parallel spreadsheets when disputing premium.',
        ],
      },
      {
        id: 's2',
        heading: 'Transaction history',
        paragraphs: [
          'Each row shows type (Deposit / Deduction / Refund), description, amount, and running balance.',
          'Use daily, monthly, or quarterly views plus date filters when finance asks for a slice of activity.',
        ],
      },
    ],
  },
  {
    id: 'kb_cd_runway',
    topicId: 'cd',
    title: 'Burn rate and runway',
    tags: ['cd', 'runway', 'burn rate', 'forecast'],
    snippet: 'Interpret burn rate and months of runway so endorsements do not outpace available CD.',
    readMinutes: 3,
    bestWhen: 'Planning a large add batch or renewal period with heavy movement.',
    outcome: 'You will know when to recharge before operations stall.',
    tryItLabel: 'Check CD balance',
    tryItPath: '/cd-balance',
    detailSections: [
      {
        id: 's1',
        heading: 'Reading runway',
        paragraphs: [
          'Burn rate averages recent deductions—spikes after bulk endorsements are normal; smooth trends matter for forecasting.',
          'Compare runway to your endorsement calendar (joining waves, annual deletes).',
        ],
      },
      {
        id: 's2',
        heading: 'Act before you hit zero',
        paragraphs: [
          'If runway is inside your finance policy window, initiate recharge and pause non-urgent bulk uploads until balance confirms.',
          'Share projected balance with approvers when leadership sign-off is required.',
        ],
      },
    ],
  },
  {
    id: 'kb_cd_before_endorsement',
    topicId: 'cd',
    title: 'Check balance before an endorsement',
    tags: ['cd', 'premium', 'preview', 'endorsement'],
    snippet: 'Follow the pre-action pattern: preview premium impact and confirm wallet headroom before submit.',
    readMinutes: 4,
    bestWhen: 'Any mutating endorsement flow where premium hits the CD wallet.',
    outcome: 'You will avoid false success—submit only when preview and balance align.',
    tryItLabel: 'CD balance',
    tryItPath: '/cd-balance',
    detailSections: [
      {
        id: 's1',
        heading: 'Preview impact first',
        paragraphs: [
          'Quick Add and similar flows show premium before commit—match that figure to expected CD deduction.',
          'If preview is missing (some bulk paths), open CD balance in another tab and note balance before upload.',
        ],
      },
      {
        id: 's2',
        heading: 'After submit',
        paragraphs: [
          'Verify a new deduction row appears in the transaction log with the endorsement reference.',
          'Use the post-action summary on the endorsement side plus CD ledger for audit-friendly closure.',
        ],
      },
    ],
  },
  {
    id: 'kb_cd_reports',
    topicId: 'cd',
    title: 'Export CD statement for finance',
    tags: ['cd', 'report', 'export', 'finance'],
    snippet: 'Generate and download CD balance reports for finance reconciliation.',
    readMinutes: 3,
    bestWhen: 'Month-end close or auditor asks for wallet history.',
    outcome: 'You will pull a statement without manual CSV wrangling.',
    tryItLabel: 'CD balance',
    tryItPath: '/cd-balance',
    detailSections: [
      {
        id: 's1',
        heading: 'Generate',
        paragraphs: [
          'Pick the date range that matches finance’s ledger period; wider ranges take longer in production systems.',
          'Confirm report status moves to completed before sharing download links internally.',
        ],
      },
      {
        id: 's2',
        heading: 'Share safely',
        paragraphs: [
          'CD statements contain employer financial data—use approved internal channels only.',
          'If generation fails, retry once then contact the CD wallet desk with the request ID.',
        ],
      },
    ],
  },
  // —— Policy (policy module + coverage page) ——
  {
    id: 'kb_policy_bands',
    topicId: 'policy',
    title: 'Reading bands and sums insured',
    tags: ['policy', 'bands', 'sum insured', 'coverage'],
    snippet: 'Navigate band structure and sums insured when employees ask “what am I covered for?”',
    readMinutes: 4,
    bestWhen: 'Questions tie to grade, location, or family structure on the master policy.',
    outcome: 'You will point to the correct band without opening the full PDF.',
    tryItLabel: 'Policy coverage',
    tryItPath: '/policy-management/coverage',
    detailSections: [
      {
        id: 's1',
        heading: 'Band-first answers',
        paragraphs: [
          'Start from the employee’s band on the policy coverage page—limits and sub-limits roll up from there.',
          'Dependent rules differ by band; do not assume one-size answers across grades.',
        ],
      },
      {
        id: 's2',
        heading: 'Exclusions',
        paragraphs: [
          'Exclusions sit beside inclusions in the accordion—quote them when employees ask about elective or cosmetic procedures.',
          'When wording is ambiguous, escalate to policy support with band ID and scenario.',
        ],
      },
    ],
  },
  {
    id: 'kb_policy_search',
    topicId: 'policy',
    title: 'Using Ask about this policy',
    tags: ['policy', 'search', 'faq', 'lasik'],
    snippet: 'Use keyword search and suggested chips to answer common employee FAQs on the coverage page.',
    readMinutes: 3,
    bestWhen: 'You get repeat questions during onboarding or renewal weeks.',
    outcome: 'You will answer from structured snippets with copy-paste friendly text.',
    tryItLabel: 'Try policy search',
    tryItPath: '/policy-management/coverage',
    detailSections: [
      {
        id: 's1',
        heading: 'Search tips',
        paragraphs: [
          'Plain language works—“room rent”, “LASIK”, “maternity”—the demo maps keywords to canned answers.',
          'Suggested chips cover the highest-volume HR questions; use them in town halls as a cheat sheet.',
        ],
      },
      {
        id: 's2',
        heading: 'When search misses',
        paragraphs: [
          'Broaden terms or open the band accordion; if still no hit, use Help center policy guides or policy support.',
          'Do not invent coverage—link employees to written policy language.',
        ],
      },
    ],
  },
  // —— Enrolment (enrolment-context.md) ——
  {
    id: 'kb_enrolment_overview',
    topicId: 'enrolment',
    title: 'Enrolment vs endorsements',
    tags: ['enrolment', 'onboarding', 'endorsements'],
    snippet: 'Know when to use enrolment cycles vs endorsement adds for getting people on cover.',
    readMinutes: 3,
    bestWhen: 'New HR admins confuse onboarding uploads with Quick Add.',
    outcome: 'You will pick the right module and set employee expectations on timing.',
    tryItLabel: 'Open Enrolment',
    tryItPath: '/enrolment',
    detailSections: [
      {
        id: 's1',
        heading: 'Enrolment is cycle-based',
        paragraphs: [
          'Enrolment handles bulk onboarding windows, completion tracking, and reminders—common at joiner waves and renewal.',
          'Day-to-day single adds often flow through Endorsements Quick Add once someone is already in HRIS.',
        ],
      },
      {
        id: 's2',
        heading: 'Dependencies',
        paragraphs: [
          'HRMS feeds employee data; policy rules define eligibility; endorsements apply changes after enrolment completes.',
          'If someone is stuck “pending enrolment”, check both enrolment status and whether an endorsement is still required.',
        ],
      },
    ],
  },
  {
    id: 'kb_enrolment_bulk',
    topicId: 'enrolment',
    title: 'Bulk upload template and validation',
    tags: ['enrolment', 'bulk', 'excel', 'template'],
    snippet: 'Download the template, fill employee rows, and upload without re-doing the whole file on minor errors.',
    readMinutes: 4,
    bestWhen: 'Onboarding a cohort at once during a hiring spike.',
    outcome: 'You will pass validation and see clear per-row outcomes.',
    tryItLabel: 'Enrolment module',
    tryItPath: '/enrolment',
    detailSections: [
      {
        id: 's1',
        heading: 'Prepare the file',
        paragraphs: [
          'Use the latest template from the module—column order matters for automated mapping.',
          'Validate employee IDs and corporate email format before upload to reduce reject rows.',
        ],
      },
      {
        id: 's2',
        heading: 'After upload',
        paragraphs: [
          'Review success vs failed rows inline; fix only failed lines instead of re-uploading the entire roster when the product supports it.',
          'Track completion status until employees finish self-serve steps if your plan requires them.',
        ],
      },
    ],
  },
  {
    id: 'kb_enrolment_tracking',
    topicId: 'enrolment',
    title: 'Tracking pending vs completed enrolment',
    tags: ['enrolment', 'status', 'pending', 'reminders'],
    snippet: 'Monitor who has finished enrolment and send reminders for stragglers before cover gaps appear.',
    readMinutes: 3,
    bestWhen: 'HR is chasing employees before a coverage start date.',
    outcome: 'You will report completion rates to leadership with named pending lists.',
    tryItLabel: 'Enrolment status',
    tryItPath: '/enrolment',
    detailSections: [
      {
        id: 's1',
        heading: 'Status columns',
        paragraphs: [
          'Completed vs pending should drive your weekly nudges—not anecdotal Slack threads.',
          'Pair status with join date so you prioritize people closest to policy start.',
        ],
      },
      {
        id: 's2',
        heading: 'Reminders',
        paragraphs: [
          'Use built-in reminder flows where available; otherwise export pending IDs for HRIS campaigns.',
          'Once complete, confirm endorsements or card issuance on the schedule if your process requires it.',
        ],
      },
    ],
  },
  // —— Reports (reports-context.md) ——
  {
    id: 'kb_reports_generate',
    topicId: 'reports',
    title: 'Generate a report',
    tags: ['reports', 'generate', 'date range'],
    snippet: 'Choose report type and date range, submit the job, and know what each report contains.',
    readMinutes: 3,
    bestWhen: 'Finance or leadership asks for claims, endorsement, CD, or policy extracts.',
    outcome: 'You will submit the right report request the first time.',
    tryItLabel: 'Open Reports',
    tryItPath: '/reports',
    detailSections: [
      {
        id: 's1',
        heading: 'Report types',
        paragraphs: [
          'Claims, endorsements, CD statement, and policy reports pull from different modules—pick the one that matches the question.',
          'Align date range to the question (MTD vs quarter vs policy year).',
        ],
      },
      {
        id: 's2',
        heading: 'Submit',
        paragraphs: [
          'Large ranges may queue longer; do not double-submit identical jobs while one is processing.',
          'Note the request timestamp for follow-up if status stays processing.',
        ],
      },
    ],
  },
  {
    id: 'kb_reports_status',
    topicId: 'reports',
    title: 'Report status: processing, completed, failed',
    tags: ['reports', 'status', 'processing'],
    snippet: 'Read job status and know when to retry or contact support.',
    readMinutes: 2,
    bestWhen: 'A stakeholder is waiting on a download link.',
    outcome: 'You will explain delay vs failure and next steps clearly.',
    tryItLabel: 'Reports',
    tryItPath: '/reports',
    detailSections: [
      {
        id: 's1',
        heading: 'Statuses',
        paragraphs: [
          'Processing means the job is queued or running—refresh after a few minutes in the demo environment.',
          'Completed unlocks download; failed should show a reason or error code when wired to production APIs.',
        ],
      },
      {
        id: 's2',
        heading: 'Retry discipline',
        paragraphs: [
          'Retry once with a narrower date range if failed; persistent failures go to support with report type and range.',
          'Do not circulate partial exports as final until status is completed.',
        ],
      },
    ],
  },
  {
    id: 'kb_reports_download',
    topicId: 'reports',
    title: 'Download and share with finance',
    tags: ['reports', 'download', 'finance'],
    snippet: 'Retrieve completed reports and share them through approved internal channels.',
    readMinutes: 2,
    bestWhen: 'Month-end packs or audit requests.',
    outcome: 'You will deliver the correct file version without leakage.',
    tryItLabel: 'Reports',
    tryItPath: '/reports',
    detailSections: [
      {
        id: 's1',
        heading: 'Download',
        paragraphs: [
          'Open the completed row and download once—some systems invalidate links after first fetch.',
          'Filename usually encodes report type and period; rename only if your finance team requires a convention.',
        ],
      },
      {
        id: 's2',
        heading: 'Governance',
        paragraphs: [
          'Reports may contain PII and financials—use SSO-protected shares, not personal email.',
          'Archive according to your retention policy; the portal may not keep infinite history.',
        ],
      },
    ],
  },
  // —— Getting started ——
  {
    id: 'kb_gs_portal_nav',
    topicId: 'getting-started',
    title: 'Navigating the employer portal',
    tags: ['getting started', 'navigation', 'overview'],
    snippet: 'How the sidebar, search, and module landing pages fit together for daily HR work.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'You are new to the portal or onboarding a colleague.',
    outcome: 'You will know where endorsements, claims, CD, and policy live.',
    tryItLabel: 'Open dashboard',
    tryItPath: '/dashboard',
    detailSections: [
      { id: 's1', heading: 'Sidebar modules', paragraphs: ['Endorsements is the default home for adds and updates.', 'Claims, CD balance, policy coverage, and reports each have dedicated tools.'] },
      { id: 's2', heading: 'Search and help', paragraphs: ['Header search filters the current module.', 'Help center aggregates guides, FAQs, and videos across all modules.'] },
    ],
  },
  {
    id: 'kb_gs_first_endorsement',
    topicId: 'getting-started',
    title: 'Your first endorsement in five steps',
    tags: ['getting started', 'quick add', 'endorsements'],
    snippet: 'A minimal path from empty roster to one employee on cover—with CD preview before submit.',
    readMinutes: 4,
    isNew: true,
    bestWhen: 'You need a safe first transaction without bulk files.',
    outcome: 'You will complete one Quick Add and read the schedule row.',
    tryItLabel: 'Try Quick Add',
    tryItPath: '/add/quick',
    detailSections: [
      { id: 's1', heading: 'Prepare', paragraphs: ['Confirm plan and employee ID format with HR.', 'Check CD runway on the dashboard if premium will draw immediately.'] },
      { id: 's2', heading: 'Submit and verify', paragraphs: ['Use Quick Add, preview premium, then submit.', 'Find the row on the endorsement schedule with a clear status.'] },
    ],
  },
  {
    id: 'kb_gs_cd_mental_model',
    topicId: 'getting-started',
    title: 'CD balance vs premium: what hits when',
    tags: ['getting started', 'cd', 'premium'],
    snippet: 'Why HR thinks in net impact—wallet balance plus endorsement premium timing.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'Finance asks why CD moved after an HR action.',
    outcome: 'You can explain reservation vs finalisation in plain language.',
    tryItPath: '/cd-balance',
    tryItLabel: 'Open CD balance',
    detailSections: [
      { id: 's1', heading: 'Two moments', paragraphs: ['Preview shows expected premium before submit.', 'CD updates when the endorsement is accepted into the wallet ledger.'] },
    ],
  },
  {
    id: 'kb_gs_help_escalation',
    topicId: 'getting-started',
    title: 'When to use self-serve vs contact a desk',
    tags: ['getting started', 'support', 'contact'],
    snippet: 'Use guides and videos first; reach claims, endorsements, or CD desks when urgency or policy nuance beats search.',
    readMinutes: 2,
    isNew: true,
    bestWhen: 'You are stuck mid-flow or need a human confirmation.',
    outcome: 'You will pick the right speciality queue with context ready.',
    tryItPath: '/support/help',
    tryItLabel: 'Help center',
    detailSections: [
      { id: 's1', heading: 'Self-serve first', paragraphs: ['Search help center and topic hubs before calling.', 'Star guides you reuse often for quick access.'] },
      { id: 's2', heading: 'Escalate with context', paragraphs: ['Have policy number, employee ID (anonymised if needed), and screenshots.', 'Use feedback in help center if search results were wrong.'] },
    ],
  },
  // —— Additional endorsements ——
  {
    id: 'kb_bulk_upload',
    topicId: 'endorsements',
    title: 'Bulk upload: file format and validation',
    tags: ['bulk', 'upload', 'csv'],
    snippet: 'Prepare a compliant file, upload, fix row errors inline, and submit once validation passes.',
    readMinutes: 5,
    isNew: true,
    bestWhen: 'Monthly hire batches exceed Quick Add limits.',
    outcome: 'You will avoid reject loops from format or duplicate ID errors.',
    tryItPath: '/add/bulk',
    tryItLabel: 'Bulk upload',
    detailSections: [
      { id: 's1', heading: 'File prep', paragraphs: ['Download the template and match column headers exactly.', 'Remove blank rows and trailing spaces on employee IDs.'] },
      { id: 's2', heading: 'After upload', paragraphs: ['Fix validation errors per row before submit.', 'Preview total premium and CD impact for the whole file.'] },
    ],
  },
  {
    id: 'kb_schedule_overview',
    topicId: 'endorsements',
    title: 'Reading the endorsement schedule',
    tags: ['schedule', 'status', 'audit'],
    snippet: 'Statuses, dates, and amounts on the schedule—and how finance uses the same list.',
    readMinutes: 3,
    bestWhen: 'You need an audit trail after submit or HRMS sync.',
    outcome: 'You will explain a row to finance or leadership without opening raw logs.',
    tryItPath: '/endorsements/schedule',
    tryItLabel: 'Open schedule',
    detailSections: [
      { id: 's1', heading: 'Key columns', paragraphs: ['Activity type, effective date, and premium drive most HR questions.', 'Status tells you if the insurer has accepted the change.'] },
    ],
  },
  // —— Additional claims ——
  {
    id: 'kb_claims_cashless',
    topicId: 'claims',
    title: 'Cashless vs reimbursement: HR talking points',
    tags: ['claims', 'cashless', 'reimbursement'],
    snippet: 'What employees should expect at network hospitals vs post-treatment claims.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'Employees ask which path applies before admission.',
    outcome: 'You will set expectations without promising insurer outcomes.',
    tryItPath: '/claims',
    tryItLabel: 'Claims list',
    detailSections: [
      { id: 's1', heading: 'Cashless', paragraphs: ['Network hospital + pre-auth where required.', 'HR tracks status; employee carries e-card and ID.'] },
      { id: 's2', heading: 'Reimbursement', paragraphs: ['Paid first, documents submitted after discharge.', 'Turnaround depends on document completeness.'] },
    ],
  },
  {
    id: 'kb_claims_documents',
    topicId: 'claims',
    title: 'Documents employees should prepare',
    tags: ['claims', 'documents', 'checklist'],
    snippet: 'Discharge summary, bills, and ID proofs—what slows reimbursements when missing.',
    readMinutes: 2,
    bestWhen: 'Preparing a one-pager for employees.',
    outcome: 'Fewer back-and-forth requests from the claims desk.',
    tryItPath: '/claims',
    tryItLabel: 'Claims',
    detailSections: [
      { id: 's1', heading: 'Checklist', paragraphs: ['Itemised bills and pharmacy breakups where applicable.', 'KYC and policy relationship proof for dependents.'] },
    ],
  },
  // —— Additional CD ——
  {
    id: 'kb_cd_recharge',
    topicId: 'cd',
    title: 'When and how to recharge CD',
    tags: ['cd', 'recharge', 'runway'],
    snippet: 'Runway bands, who approves top-ups, and what to tell finance before endorsements stall.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'Runway enters warning after a large batch.',
    outcome: 'You will trigger recharge before endorsements queue behind balance.',
    tryItPath: '/cd-balance',
    tryItLabel: 'CD balance',
    detailSections: [
      { id: 's1', heading: 'Signals', paragraphs: ['Dashboard runway and pending premium together show risk.', 'Coordinate with treasury using the same numbers as the portal.'] },
    ],
  },
  {
    id: 'kb_cd_disputes',
    topicId: 'cd',
    title: 'Disputing a CD ledger entry',
    tags: ['cd', 'dispute', 'ledger'],
    snippet: 'When to open a dispute, what evidence to attach, and expected resolution time.',
    readMinutes: 3,
    bestWhen: 'A line item does not match an approved endorsement.',
    outcome: 'CD desk can investigate without multiple email threads.',
    tryItPath: '/cd-balance',
    tryItLabel: 'CD balance',
    detailSections: [
      { id: 's1', heading: 'Before you dispute', paragraphs: ['Confirm endorsement schedule status and effective date.', 'Attach endorsement reference and expected amount.'] },
    ],
  },
  // —— Additional policy ——
  {
    id: 'kb_policy_faq_template',
    topicId: 'policy',
    title: 'Answering employee FAQs from coverage search',
    tags: ['policy', 'faq', 'employees'],
    snippet: 'Use search snippets in replies—room rent, LASIK, maternity sub-limits—without quoting outdated PDFs.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'HR inbox spikes during renewal or onboarding.',
    outcome: 'Consistent answers aligned to active policy bands.',
    tryItPath: '/policy-management/coverage',
    tryItLabel: 'Policy coverage',
    detailSections: [
      { id: 's1', heading: 'Reply pattern', paragraphs: ['Quote band and limit from the tool.', 'Escalate legal or cross-border cases to policy SPOC.'] },
    ],
  },
  {
    id: 'kb_policy_exclusions',
    topicId: 'policy',
    title: 'Common exclusions HR should know',
    tags: ['policy', 'exclusions'],
    snippet: 'Cosmetic, experimental, and waiting-period rules—how to explain without over-promising.',
    readMinutes: 4,
    bestWhen: 'Employees ask about elective or non-standard treatment.',
    outcome: 'Clear boundary before they incur costs.',
    tryItPath: '/policy-management/coverage',
    tryItLabel: 'Coverage',
    detailSections: [
      { id: 's1', heading: 'Exclusions', paragraphs: ['Check band-specific exclusion lists in coverage search.', 'Waiting periods apply from member start date unless waived in policy.'] },
    ],
  },
  // —— Additional enrolment ——
  {
    id: 'kb_enrolment_dependents',
    topicId: 'enrolment',
    title: 'Dependent eligibility and proof',
    tags: ['enrolment', 'dependents'],
    snippet: 'Who can be added, age limits, and documents HR collects once per life event.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'Open enrolment or life-event windows.',
    outcome: 'Fewer rejected dependent rows at submission.',
    tryItPath: '/enrolment',
    tryItLabel: 'Enrolment',
    detailSections: [
      { id: 's1', heading: 'Rules', paragraphs: ['Match relationship and age to master policy.', 'Collect proofs before the window closes.'] },
    ],
  },
  {
    id: 'kb_enrolment_deadlines',
    topicId: 'enrolment',
    title: 'Enrolment windows and reminders',
    tags: ['enrolment', 'deadlines'],
    snippet: 'Track completion rates and nudge employees before cover start dates slip.',
    readMinutes: 2,
    isNew: true,
    bestWhen: 'Mid-window with low completion.',
    outcome: 'Higher completion before payroll cut-off.',
    tryItPath: '/enrolment',
    tryItLabel: 'Enrolment',
    detailSections: [
      { id: 's1', heading: 'Reminders', paragraphs: ['Export pending list for managers if your process allows.', 'Communicate hard stop date and consequences clearly.'] },
    ],
  },
  // —— Additional reports ——
  {
    id: 'kb_reports_scheduled',
    topicId: 'reports',
    title: 'Scheduled vs on-demand reports',
    tags: ['reports', 'scheduled'],
    snippet: 'When finance needs recurring utilisation packs vs ad-hoc extracts.',
    readMinutes: 3,
    isNew: true,
    bestWhen: 'Setting up month-end reporting.',
    outcome: 'Right report type without duplicate runs.',
    tryItPath: '/reports',
    tryItLabel: 'Reports',
    detailSections: [
      { id: 's1', heading: 'Choose mode', paragraphs: ['Scheduled for recurring KPIs.', 'On-demand for audit or one-off investigations.'] },
    ],
  },
  {
    id: 'kb_reports_utilisation',
    topicId: 'reports',
    title: 'Reading utilisation and claims experience',
    tags: ['reports', 'utilisation'],
    snippet: 'What HR vs finance extracts from the same report—and common misreads.',
    readMinutes: 4,
    isNew: true,
    bestWhen: 'Renewal planning or broker reviews.',
    outcome: 'You will narrate trends without misinterpreting lag.',
    tryItPath: '/reports',
    tryItLabel: 'Reports',
    detailSections: [
      { id: 's1', heading: 'Interpretation', paragraphs: ['Claims lag means recent months understate experience.', 'Compare band and location slices before concluding trend.'] },
    ],
  },
]

/** Local screen recordings — run `npm run record:help-videos` to regenerate. */
function helpVideoSrc(id) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
  return `${base}help/videos/${id}.webm`
}

function helpVideoCaptionsSrc(id) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
  return `${base}help/videos/captions/${id}.vtt`
}

function helpVideoNarrationSrc(id) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
  const ext = 'm4a'
  return `${base}help/videos/narration/${id}.${ext}`
}

export function helpVideoThumbnailSrc(id) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
  return `${base}help/videos/thumbnails/${id}.jpg`
}

export const videoTutorials = [
  {
    id: 'vid_portal_overview',
    topicId: 'getting-started',
    title: 'Employer portal overview',
    tags: ['getting started', 'video', 'navigation'],
    duration: '0:06',
    viewCount: '4.2k',
    isNew: true,
    flowPath: '/dashboard',
    videoSrc: helpVideoSrc('vid_portal_overview'),
    captionsSrc: helpVideoCaptionsSrc('vid_portal_overview'),
    narrationSrc: helpVideoNarrationSrc('vid_portal_overview'),
  },
  {
    id: 'vid_quick_add',
    topicId: 'endorsements',
    title: 'Quick Add — end-to-end walkthrough',
    tags: ['quick add', 'video', 'onboarding'],
    duration: '0:06',
    viewCount: '3.1k',
    isNew: false,
    flowPath: '/add/quick',
    videoSrc: helpVideoSrc('vid_quick_add'),
    captionsSrc: helpVideoCaptionsSrc('vid_quick_add'),
    narrationSrc: helpVideoNarrationSrc('vid_quick_add'),
  },
  {
    id: 'vid_cd_wallet',
    topicId: 'cd',
    title: 'CD balance and runway explained',
    tags: ['cd', 'wallet', 'premium'],
    duration: '0:06',
    viewCount: '1.8k',
    isNew: false,
    flowPath: '/cd-balance',
    videoSrc: helpVideoSrc('vid_cd_wallet'),
    captionsSrc: helpVideoCaptionsSrc('vid_cd_wallet'),
    narrationSrc: helpVideoNarrationSrc('vid_cd_wallet'),
  },
  {
    id: 'vid_hrms',
    topicId: 'endorsements',
    title: 'HRMS sync approval flow',
    tags: ['hrms', 'sync', 'approval'],
    duration: '0:06',
    viewCount: '2.2k',
    isNew: true,
    flowPath: '/hrms-sync',
    videoSrc: helpVideoSrc('vid_hrms'),
    captionsSrc: helpVideoCaptionsSrc('vid_hrms'),
    narrationSrc: helpVideoNarrationSrc('vid_hrms'),
  },
  {
    id: 'vid_claims_status',
    topicId: 'claims',
    title: 'Cashless claim — end-to-end walkthrough',
    tags: ['claims', 'video', 'timeline'],
    duration: '0:06',
    viewCount: '2.4k',
    isNew: true,
    flowPath: '/claims',
    videoSrc: helpVideoSrc('vid_claims_status'),
    captionsSrc: helpVideoCaptionsSrc('vid_claims_status'),
    narrationSrc: helpVideoNarrationSrc('vid_claims_status'),
  },
  {
    id: 'vid_policy_bands',
    topicId: 'policy',
    title: 'Policy bands and coverage search',
    tags: ['policy', 'video', 'coverage'],
    duration: '0:06',
    viewCount: '980',
    isNew: false,
    flowPath: '/policy-management/coverage',
    videoSrc: helpVideoSrc('vid_policy_bands'),
    captionsSrc: helpVideoCaptionsSrc('vid_policy_bands'),
    narrationSrc: helpVideoNarrationSrc('vid_policy_bands'),
  },
  {
    id: 'vid_enrolment_tracking',
    topicId: 'enrolment',
    title: 'Enrolment completion tracking',
    tags: ['enrolment', 'video', 'onboarding'],
    duration: '0:06',
    viewCount: '1.1k',
    isNew: true,
    flowPath: '/enrolment',
    videoSrc: helpVideoSrc('vid_enrolment_tracking'),
    captionsSrc: helpVideoCaptionsSrc('vid_enrolment_tracking'),
    narrationSrc: helpVideoNarrationSrc('vid_enrolment_tracking'),
  },
  {
    id: 'vid_reports_generate',
    topicId: 'reports',
    title: 'Generate and download reports',
    tags: ['reports', 'video', 'download'],
    duration: '0:06',
    viewCount: '760',
    isNew: true,
    flowPath: '/reports',
    videoSrc: helpVideoSrc('vid_reports_generate'),
    captionsSrc: helpVideoCaptionsSrc('vid_reports_generate'),
    narrationSrc: helpVideoNarrationSrc('vid_reports_generate'),
  },
]

/** Browse-by-topic tiles — aligned to employer portal modules */
export const helpTopics = [
  {
    id: 'getting-started',
    title: 'Getting started',
    subtitle: 'Portal overview, navigation, and your first HR admin tasks.',
    iconBg: 'bg-indigo-50',
    iconFg: 'text-indigo-600',
    modulePath: '/dashboard',
    contactChannelId: 'endorsements',
    isNew: true,
  },
  {
    id: 'claims',
    title: 'Claims',
    subtitle: 'Cashless, reimbursements, and claim status for employees.',
    iconBg: 'bg-rose-50',
    iconFg: 'text-rose-600',
    modulePath: '/claims',
    contactChannelId: 'claims',
  },
  {
    id: 'endorsements',
    title: 'Endorsements',
    subtitle: 'Adds, updates, bulk files, HRMS sync, and life events.',
    iconBg: 'bg-sky-50',
    iconFg: 'text-sky-600',
    modulePath: '/',
    contactChannelId: 'endorsements',
  },
  {
    id: 'policy',
    title: 'Policy & coverage',
    subtitle: 'Bands, coverage rules, and answers to employee FAQs.',
    iconBg: 'bg-teal-50',
    iconFg: 'text-teal-700',
    modulePath: '/policy-management/coverage',
    contactChannelId: 'policy',
  },
  {
    id: 'cd',
    title: 'CD & premium',
    subtitle: 'Cash deposit wallet, runway, recharge, and premium timing.',
    iconBg: 'bg-amber-50',
    iconFg: 'text-amber-700',
    modulePath: '/cd-balance',
    contactChannelId: 'cd',
  },
  {
    id: 'enrolment',
    title: 'Enrolment',
    subtitle: 'Employee and dependent enrolment requests and eligibility.',
    iconBg: 'bg-orange-50',
    iconFg: 'text-orange-600',
    modulePath: '/enrolment',
    contactChannelId: 'endorsements',
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: 'Utilisation, claims experience, and scheduled downloads.',
    iconBg: 'bg-violet-50',
    iconFg: 'text-violet-600',
    modulePath: '/reports',
    contactChannelId: 'cd',
  },
  {
    id: 'releases',
    title: 'New releases',
    subtitle: 'Walkthroughs for features we shipped recently.',
    iconBg: 'bg-indigo-50',
    iconFg: 'text-indigo-600',
    modulePath: '/new-releases',
    contactChannelId: 'endorsements',
    isNew: true,
  },
]

export function getHelpTopicById(topicId) {
  return helpTopics.find((t) => t.id === topicId) ?? null
}

/** Where a topic card should navigate (hub vs product landing). */
export function getTopicNavigationPath(topicId) {
  if (topicId === 'releases') return '/new-releases'
  return `/support/help/topics/${topicId}`
}

export function getArticlesForTopic(topicId) {
  return knowledgeArticles.filter((a) => a.topicId === topicId)
}

export function getVideosForTopic(topicId) {
  return videoTutorials.filter((v) => v.topicId === topicId)
}

export function countArticlesForTopic(topicId) {
  return knowledgeArticles.filter((a) => a.topicId === topicId).length
}

export function countVideosForTopic(topicId) {
  return videoTutorials.filter((v) => v.topicId === topicId).length
}

export function getTopicTitle(topicId) {
  return helpTopics.find((t) => t.id === topicId)?.title ?? topicId
}

export function getContactChannelForTopic() {
  return null
}

/** Shortcuts for the Help center search hero (label + query applied to global search) */
export const helpCenterQuickPrompts = [
  { id: 'quick_add', label: 'Quick Add', query: 'quick add' },
  { id: 'cd', label: 'Current CD', query: "what's my current cd balance" },
  { id: 'hrms', label: 'HRMS sync', query: 'hrms' },
  { id: 'bulk', label: 'Bulk upload', query: 'bulk' },
  { id: 'policy', label: 'Policy coverage', query: 'policy coverage' },
  { id: 'claims', label: 'Claims status', query: 'claims timeline' },
  { id: 'releases', label: 'Latest releases', query: 'invoice schedule' },
]

export function matchesSupportQuery(text, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return text.toLowerCase().includes(q)
}

export function formatHelpDate(isoDate) {
  if (!isoDate) return ''
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Demo publish dates staggered from article order when not set on record */
function defaultPublishedAtForArticle(articleId) {
  const idx = knowledgeArticles.findIndex((a) => a.id === articleId)
  if (idx < 0) return '2026-03-01'
  const day = 1 + (idx % 28)
  const month = 1 + Math.floor(idx / 3) % 5
  return `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getKnowledgeArticleById(id) {
  const article = knowledgeArticles.find((a) => a.id === id) ?? null
  if (!article) return null
  return {
    ...article,
    publishedAt: article.publishedAt ?? defaultPublishedAtForArticle(id),
    procedureSteps: getArticleProcedureSteps(article),
  }
}

export function getArticleStepCount(article) {
  return getArticleProcedureSteps(article).length
}

/** Plain text for article search indexing */
export function knowledgeArticleSearchText(a) {
  const sectionBlob = (a.detailSections ?? [])
    .map((s) => `${s.heading} ${s.paragraphs.join(' ')}`)
    .join(' ')
  const procedureBlob = getArticleProcedureSteps(a)
    .map((s) => `${s.title} ${s.body}`)
    .join(' ')
  return `${a.title} ${a.snippet} ${a.tags.join(' ')} ${a.bestWhen ?? ''} ${a.outcome ?? ''} ${sectionBlob} ${procedureBlob}`
}
