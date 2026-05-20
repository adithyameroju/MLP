/**
 * HR-facing Policy Coverage page — mock CMS/API shape.
 */

export const policyCoverageHero = {
  policyLabel: 'Master policy',
  title: 'Group Health Insurance',
  employerLine: 'Acme India Pvt Ltd',
  status: 'active',
  periodDisplay: '1 Apr 2024 – 31 Mar 2027',
  insurer: 'Acko General Insurance Ltd.',
  /** Shown on purple hero metadata line (shorter form ok) */
  insurerShort: 'Acko General Insurance',
  tpa: 'Acko Direct / FHPL',
  /** TPA segment on metadata line */
  tpaMeta: 'TPA: Acko Direct (FHPL)',
  coverageRange: '₹3L – ₹10L',
  coverageRangeColumnLabel: 'Coverage range (per family)',
  coverageRangeSubline: 'Sum insured varies by employee band',
  coveredLivesColumnLabel: 'Total covered lives',
  coveredLivesValue: '1,248 Employees',
  familyColumnLabel: 'Family coverage (across bands)',
  familySummaryShort: 'Employee, spouse, children, parents (in select bands)',
  familySummary:
    'Employee, spouse, children, and parents (where applicable) — exact mix depends on declared band in HRMS.',
  policyNumber: 'ACK-GHI-2024-9912',
  /** Title above the compact room-rent-by-band row inside the hero stack */
  roomRentStripTitle: 'Room rent by band',
  /**
   * Feature pills under hero — icon maps to Lucide in PolicyCoverageHero;
   * accent drives icon color only (pill stays white).
   */
  inclusionChips: [
    { id: 'c1', label: 'Cashless', icon: 'Wallet', accent: 'emerald' },
    { id: 'c2', label: 'Day 1 coverage', icon: 'Calendar', accent: 'sky' },
    { id: 'c3', label: 'Maternity covered', icon: 'HeartPulse', accent: 'violet' },
    { id: 'c4', label: 'Newborn Day 1', icon: 'Baby', accent: 'blue' },
    { id: 'c5', label: 'Parents in select bands', icon: 'Users', accent: 'rose' },
  ],
  conditionChips: [
    { id: 'w2', label: 'Modern treatments may have copay' },
    { id: 'w3', label: 'Mid-term dependent additions restricted' },
  ],
}

export const policyCoverageBands = [
  {
    id: 'band_a',
    label: 'Band A',
    sumInsured: '₹3,00,000',
    familyCoverage: 'Employee only',
    roomRent: 'Shared room',
    maternity: '₹30,000',
    highlight: 'Entry slab — no spouse or parents on cover.',
    tint: 'violet',
    widthPct: 30,
    accentClass: 'bg-violet-600',
  },
  {
    id: 'band_b',
    label: 'Band B',
    sumInsured: '₹5,00,000',
    familyCoverage: 'Employee + spouse + children',
    roomRent: 'Private room',
    maternity: '₹50,000',
    highlight: 'Core family cover; parents not included.',
    tint: 'teal',
    widthPct: 50,
    accentClass: 'bg-teal-600',
  },
  {
    id: 'band_c',
    label: 'Band C',
    sumInsured: '₹7,50,000',
    familyCoverage: 'Employee + spouse + children + parents',
    roomRent: 'Private room',
    maternity: '₹75,000',
    highlight: 'Parents included on floater; 24-month maternity wait for new joiners unless ported.',
    tint: 'sky',
    widthPct: 75,
    accentClass: 'bg-sky-700',
  },
  {
    id: 'band_d',
    label: 'Band D',
    sumInsured: '₹10,00,000',
    familyCoverage: 'Employee + spouse + children + parents',
    roomRent: 'Deluxe room',
    maternity: '₹1,00,000',
    highlight: 'Highest SI and room entitlement; same network & TPA rules.',
    tint: 'indigo',
    widthPct: 100,
    accentClass: 'bg-indigo-700',
  },
]

export const predefinedQuestions = [
  { id: 'pq_mat', label: 'Is maternity covered?', stubId: 'ans_maternity' },
  { id: 'pq_parents', label: 'Are parents covered?', stubId: 'ans_parents' },
  { id: 'pq_lasik', label: 'Is LASIK covered?', stubId: 'ans_lasik' },
  { id: 'pq_room', label: 'What is room rent?', stubId: 'ans_room' },
  { id: 'pq_excl', label: 'What are the exclusions?', stubId: 'ans_exclusions' },
  { id: 'pq_bandb', label: 'What is covered in Band B?', stubId: 'ans_band_b' },
  { id: 'pq_amb', label: 'What is the ambulance limit?', stubId: 'ans_ambulance' },
  { id: 'pq_opd', label: 'Is OPD included?', stubId: 'ans_opd' },
]

const answerStubs = [
  {
    id: 'ans_lasik',
    keywords: ['lasik', 'lasik surgery', 'refractive', 'eye surgery'],
    title: 'LASIK surgery',
    status: 'conditional',
    summary: 'Covered above a defined threshold / with conditions as per modern-treatment and refractive procedure schedules.',
    details: [
      'Listed daycare / specified surgery schedules apply; prior authorization may be required.',
      'Cosmetic refractive correction without clinical indication may be excluded.',
    ],
    bandNotes: [
      { band: 'All bands', note: 'Disease-wise cap applies — confirm schedule before advising employees.' },
    ],
    reference: 'Inclusions & exclusions · Sub-limits & caps (Schedule D)',
    jumpSectionId: 'policy-section-inclusions-exclusions',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_maternity',
    keywords: ['maternity', 'maternity covered', 'delivery', 'pregnancy'],
    title: 'Maternity benefit',
    status: 'band_specific',
    summary: 'Maternity is covered for declared spouse with per-delivery limits that vary by band.',
    details: [
      'Up to two deliveries per policy period unless policy states otherwise.',
      '24-month waiting period from first coverage for new joiners unless continuity is certified.',
    ],
    bandNotes: [
      { band: 'Band A', note: 'Not applicable (employee-only).' },
      { band: 'Band B', note: '₹50,000 per delivery · max 2.' },
      { band: 'Bands C & D', note: '₹75,000 / ₹1,00,000 per delivery respectively · max 2.' },
    ],
    reference: 'Maternity & newborn benefits',
    jumpSectionId: 'policy-section-maternity-newborn',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_parents',
    keywords: ['parents', 'parent covered', 'mother', 'father', 'parents-in-law'],
    title: 'Parents on cover',
    status: 'band_specific',
    summary: 'Parents are covered only on higher bands when declared as dependents in HRMS.',
    details: [
      'Parents share the family floater with employee, spouse, and children.',
      'Mid-term addition of parents is restricted outside enrollment windows — follow HR policy.',
    ],
    bandNotes: [
      { band: 'Bands A & B', note: 'Parents not included.' },
      { band: 'Bands C & D', note: 'Included when declared.' },
    ],
    reference: 'Family definitions · Coverage bands',
    jumpSectionId: 'policy-section-family-definitions',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_room',
    keywords: ['room rent', 'room entitlement', 'ac room', 'private room'],
    title: 'Room rent entitlement',
    status: 'band_specific',
    summary: 'Room category is tied to band; higher room than entitlement triggers proportionate deduction on related charges.',
    details: ['ICU and allied charges may follow the same proportionate principle where applicable.'],
    bandNotes: [
      { band: 'Band A', note: 'Shared room baseline.' },
      { band: 'Band B–C', note: 'Private room as per schedule.' },
      { band: 'Band D', note: 'Deluxe / higher category.' },
    ],
    reference: 'Room rent entitlements',
    jumpSectionId: 'policy-section-room-rent',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_exclusions',
    keywords: ['exclusions', 'not covered', 'excluded', 'cosmetic', 'experimental'],
    title: 'Key exclusions',
    status: 'excluded',
    summary:
      'Standard exclusions include experimental treatment, cosmetic surgery (except accident/cancer), war, self-inflicted injury, and non-medical hospital charges unless stated otherwise.',
    details: ['Always verify the full exclusion list before confirming to an employee.'],
    bandNotes: null,
    reference: 'Inclusions & exclusions',
    jumpSectionId: 'policy-section-inclusions-exclusions',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_band_b',
    keywords: ['band b', 'slab b', 'band b coverage', 'covered in band b'],
    title: 'Band B snapshot',
    status: 'included',
    summary:
      'Band B provides ₹5L family floater for employee, spouse, and children with private room category and maternity up to ₹50,000 per delivery (max 2).',
    details: [
      'Cashless on network hospitals; reimbursement elsewhere per policy.',
      'Parents are not covered on this slab.',
    ],
    bandNotes: [{ band: 'Band B', note: 'Refer to coverage bands card for full comparison.' }],
    reference: 'Coverage bands',
    jumpSectionId: 'policy-section-coverage-bands',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_ambulance',
    keywords: ['ambulance', 'ambulance limit', 'emergency transport'],
    title: 'Ambulance',
    status: 'conditional',
    summary: 'Ground ambulance is covered up to a per-event sublimit; air ambulance where listed may require pre-approval.',
    details: ['Sublimits vary by procedure context — see sub-limits table in policy details.'],
    bandNotes: [
      { band: 'Typical', note: '₹2,000–₹3,000 per hospitalisation (demo values).' },
    ],
    reference: 'Sub-limits & caps',
    jumpSectionId: 'policy-section-sublimits',
    viewSourceSectionId: 'policy-section-source-document',
  },
  {
    id: 'ans_opd',
    keywords: ['opd', 'outpatient', 'out-patient', 'doctor consultation'],
    title: 'OPD coverage',
    status: 'conditional',
    summary:
      'OPD may be available through a corporate buffer or rider depending on employer purchase — not always part of the base floater.',
    details: ['Check the corporate benefit letter for OPD pool limits and approval rules.'],
    bandNotes: null,
    reference: 'Claims process / policy rules',
    jumpSectionId: 'policy-section-claims-rules',
    viewSourceSectionId: 'policy-section-source-document',
  },
]

/**
 * @typedef {{ id: string, title: string, status: string, summary: string, details: string[], bandNotes: { band: string, note: string }[] | null, reference: string, jumpSectionId: string, viewSourceSectionId: string }} PolicyAnswer
 */

function normalizeAnswer(stub) {
  return {
    id: stub.id,
    title: stub.title,
    status: stub.status,
    summary: stub.summary,
    details: stub.details,
    bandNotes: stub.bandNotes,
    reference: stub.reference,
    jumpSectionId: stub.jumpSectionId,
    viewSourceSectionId: stub.viewSourceSectionId || stub.jumpSectionId,
  }
}

export function resolvePolicyAnswer(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return null
  for (const stub of answerStubs) {
    if (stub.keywords.some((kw) => q.includes(kw))) return normalizeAnswer(stub)
  }
  return null
}

export function getPolicyAnswerByStubId(stubId) {
  const stub = answerStubs.find((s) => s.id === stubId)
  return stub ? normalizeAnswer(stub) : null
}

/** Accordion sections — body blocks consumed by PolicyDetailsAccordion */
export const policyDetailSections = [
  {
    id: 'policy-section-coverage-bands',
    iconKey: 'Layers',
    title: 'Coverage bands',
    summary: 'Compare sum insured, family composition, room, and maternity across grades.',
    body: { kind: 'bands' },
  },
  {
    id: 'policy-section-family-definitions',
    iconKey: 'Users',
    title: 'Family definitions',
    summary: 'Who can be insured under the master policy and typical age or relationship rules.',
    body: {
      kind: 'bullets',
      items: [
        'Employee: active payroll member enrolled under HRMS.',
        'Spouse: legally married partner declared at enrollment.',
        'Children: biological or legally adopted, typically covered up to age 25 if unmarried and financially dependent.',
        'Parents / parents-in-law: only on Bands C & D when declared; documentation may be required at enrollment.',
      ],
    },
  },
  {
    id: 'policy-section-room-rent',
    iconKey: 'BedDouble',
    title: 'Room rent entitlements',
    summary: 'Room category is band-driven; exceeding entitlement reduces related claim pay-outs proportionately.',
    body: {
      kind: 'table',
      columns: ['Band', 'Entitlement'],
      rows: [
        ['Band A', 'Shared / multi-bed as per schedule'],
        ['Band B', 'Private room (schedule category)'],
        ['Band C', 'Private room'],
        ['Band D', 'Deluxe / higher category'],
      ],
    },
  },
  {
    id: 'policy-section-sublimits',
    iconKey: 'Gauge',
    title: 'Sub-limits & caps',
    summary: 'Illustrative disease / benefit caps — align to master schedule for production.',
    body: {
      kind: 'sublimits',
      rows: [
        { benefit: 'Ambulance (ground)', limit: '₹2,000 – ₹3,000 / event', note: 'Per hospitalisation' },
        { benefit: 'Cataract', limit: '₹40,000 / eye', note: 'Disease-wise cap' },
        { benefit: 'LASIK / refractive', limit: 'Schedule + cap', note: 'Conditional / listed procedures' },
        { benefit: 'Kidney stone (laser)', limit: 'As per daycare list', note: 'Pre-auth may apply' },
        { benefit: 'Joint replacement', limit: 'Defined per knee/hip', note: 'Waiting may apply' },
      ],
    },
  },
  {
    id: 'policy-section-maternity-newborn',
    iconKey: 'Baby',
    title: 'Maternity & newborn benefits',
    summary: 'Delivery benefit, waiting rules, and newborn cover highlights.',
    body: {
      kind: 'keyvalue',
      rows: [
        { label: 'Maternity benefit', value: 'Varies by band — see coverage bands (e.g. ₹30K–₹1L per delivery, max 2).' },
        { label: 'Waiting period', value: '24 months from first coverage for new joiners unless continuity certified.' },
        { label: 'Newborn Day 1', value: 'Newborn covered from Day 1 when declared within stipulated intimation window.' },
        { label: 'Pre / post natal', value: 'Pre/post limits as per schedule — typically bounded OPD amounts under maternity.' },
      ],
    },
  },
  {
    id: 'policy-section-inclusions-exclusions',
    iconKey: 'ListChecks',
    title: 'Inclusions & exclusions',
    summary: 'High-level view — always cite the policy PDF for final wording.',
    body: {
      kind: 'inclusionsExclusions',
      included: ['In-patient hospitalisation for medically necessary treatment', 'Daycare procedures listed in schedule', 'Emergency ambulance within sublimit'],
      conditional: ['Modern / robotic procedures (co-pay or package)', 'OPD via corporate buffer if purchased'],
      excluded: ['Cosmetic surgery (except accident/cancer)', 'Experimental treatment', 'War and nuclear risks'],
    },
  },
  {
    id: 'policy-section-claims-rules',
    iconKey: 'Handshake',
    title: 'Claims process / policy rules',
    summary: 'Cashless, reimbursement, and operational rules HR should know.',
    body: {
      kind: 'bullets',
      items: [
        'Cashless: available at network hospitals with ID card and pre-authorization when required.',
        'TPA: Acko Direct / FHPL — follow intimation timelines for planned admissions.',
        'Claims timelines: submit documents within policy-specified days from discharge.',
        'Mid-term additions: allowed only during declared windows or life events per HR / insurer rules.',
        'Deletions: effective from next billing cycle unless otherwise endorsed.',
      ],
    },
  },
  {
    id: 'policy-section-terms',
    iconKey: 'Scale',
    title: 'Terms & conditions',
    summary: 'Non-exhaustive checklist — full terms in the policy kit.',
    body: {
      kind: 'bullets',
      items: [
        'Portability and continuity clauses apply per IRDAI guidelines.',
        'Geography and network definitions as per policy.',
        'Dispute resolution and jurisdiction as per policy wording.',
      ],
    },
  },
  {
    id: 'policy-section-source-document',
    iconKey: 'FileText',
    title: 'Source document / original PDF',
    summary: 'Downloadable references for HR records and employee queries.',
    body: { kind: 'sourceActions' },
  },
]

export function bandHeaderGradient(tint) {
  const map = {
    violet: 'from-violet-700 via-violet-800 to-indigo-950',
    teal: 'from-teal-800 via-teal-900 to-emerald-950',
    sky: 'from-slate-600 via-sky-800 to-blue-950',
    indigo: 'from-indigo-800 via-indigo-900 to-slate-950',
  }
  return map[tint] || map.violet
}

export function answerStatusLabel(status) {
  const map = {
    included: 'Included',
    excluded: 'Excluded',
    conditional: 'Conditional',
    band_specific: 'Band-specific',
  }
  return map[status] || status
}

export function answerStatusBadgeClass(status) {
  if (status === 'included') return 'border-emerald-200 bg-emerald-50 text-emerald-900'
  if (status === 'excluded') return 'border-red-200 bg-red-50 text-red-900'
  if (status === 'band_specific') return 'border-violet-200 bg-violet-50 text-violet-900'
  return 'border-amber-200 bg-amber-50 text-amber-950'
}
