import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Hash,
  Loader2,
  Plus,
  Search,
  X,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ClaimsCompactKpi from '../components/ClaimsCompactKpi'
import { KeyMetricDonut } from '../components/KeyMetricCard'
import {
  CLAIM_OPEN_STATUSES,
  CLAIM_SERVICE_CATEGORIES,
  CLAIM_TYPES,
  claimsReportRows,
  claimsRows,
  claimsSummary,
  deriveClaimsLifecycleCounts,
  deriveClaimsOverview,
  deriveOpenClaimsByChannel,
  deriveTopCategoryVsOther,
} from '../data/claimsMock'
import { formatInr } from '../lib/currencyFormat'

const SORT_OPTIONS = [
  { id: 'submitted-desc', label: 'Newest first' },
  { id: 'submitted-asc', label: 'Oldest first' },
  { id: 'amount-desc', label: 'Amount (high)' },
  { id: 'amount-asc', label: 'Amount (low)' },
  { id: 'urgency', label: 'Urgency (high first)' },
]

const LIFECYCLE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
  { id: 'rejected', label: 'Rejected' },
]

const CLAIM_VIEW_CTA =
  'inline-flex h-8 min-w-[4.75rem] shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium border-0 shadow-none transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 bg-[#f0f2ff] text-[#4c46d9] hover:bg-[#e6eaff] focus-visible:ring-[#4c46d9]/35'

const PER_PAGE = 10
const REPORTS_PER_PAGE = 10

function toIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatIsoShort(iso) {
  if (!iso) return ''
  try {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function ClaimsDateRangeControl({ dateFrom, dateTo, onApply, compact = false }) {
  const [open, setOpen] = useState(false)
  const [draftFrom, setDraftFrom] = useState(dateFrom)
  const [draftTo, setDraftTo] = useState(dateTo)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setDraftFrom(dateFrom)
    setDraftTo(dateTo)
  }, [open, dateFrom, dateTo])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const label =
    !dateFrom && !dateTo
      ? 'All dates'
      : dateFrom && dateTo
        ? `${formatIsoShort(dateFrom)} – ${formatIsoShort(dateTo)}`
        : dateFrom
          ? `From ${formatIsoShort(dateFrom)}`
          : `Until ${formatIsoShort(dateTo)}`

  function applyAndClose(from, to) {
    onApply(from, to)
    setOpen(false)
  }

  function handlePresetLast30() {
    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - 30)
    applyAndClose(toIsoDate(start), toIsoDate(end))
  }

  function handlePresetYtd() {
    const end = new Date()
    const start = new Date(end.getFullYear(), 0, 1)
    applyAndClose(toIsoDate(start), toIsoDate(end))
  }

  function handlePresetAll() {
    applyAndClose('', '')
  }

  function handleApplyDraft() {
    applyAndClose(draftFrom, draftTo)
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          compact
            ? 'inline-flex min-w-[7rem] max-w-[14rem] cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-left text-xs text-gray-900 hover:border-gray-300'
            : 'flex h-10 min-w-[10.5rem] max-w-[18rem] cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-left text-sm text-gray-900 shadow-sm hover:border-gray-300'
        }
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <CalendarDays size={compact ? 14 : 16} className="shrink-0 text-gray-400" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
        <ChevronDown size={compact ? 14 : 16} className="shrink-0 text-gray-400" aria-hidden />
      </button>
      {open ? (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-[min(calc(100vw-3rem),22rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
          role="dialog"
          aria-label="Submitted date range"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Quick presets</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-100"
              onClick={handlePresetLast30}
            >
              Last 30 days
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-100"
              onClick={handlePresetYtd}
            >
              Year to date
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-100"
              onClick={handlePresetAll}
            >
              All dates
            </button>
          </div>
          <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50/80 p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Custom range</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="date"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
                className="min-h-[2.25rem] flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
                aria-label="Range start"
              />
              <span className="hidden text-gray-400 sm:inline">–</span>
              <input
                type="date"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
                className="min-h-[2.25rem] flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
                aria-label="Range end"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              onClick={handleApplyDraft}
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function parseBucket(searchParams) {
  const v = searchParams.get('bucket')
  if (v === 'attention' || v === 'documents' || v === 'delayed') return v
  return ''
}

function statusBadgeClasses(status) {
  switch (status) {
    case 'Approved':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    case 'Processing':
      return 'border-indigo-200 bg-indigo-50 text-indigo-800'
    case 'Under Review':
      return 'border-amber-200 bg-amber-50 text-amber-900'
    case 'Rejected':
      return 'border-rose-200 bg-rose-50 text-rose-800'
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700'
  }
}

function formatShortDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatReq(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function rowInDateRange(rowIso, dateFrom, dateTo) {
  if (!dateFrom && !dateTo) return true
  const row = rowIso.slice(0, 10)
  if (dateFrom && row < dateFrom) return false
  if (dateTo && row > dateTo) return false
  return true
}

/** Two-line KPI legend — marker colors must match the sibling KeyMetricDonut colorA / colorB. */
function KpiDonutLegendLines({ labelA, labelB, valueA, valueB, colorA, colorB }) {
  const row = (label, value, color) => (
    <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-normal leading-snug text-gray-500 motion-safe:transition-opacity motion-safe:duration-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} aria-hidden />
      <span>{label}</span>
      <span className="min-w-0 flex-1 truncate tabular-nums text-gray-500">{value}</span>
    </div>
  )
  return (
    <div className="flex flex-col gap-1">
      {row(labelA, valueA, colorA)}
      {row(labelB, valueB, colorB)}
    </div>
  )
}

export default function Claims() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const bucket = parseBucket(searchParams)
  const fromDashboard = searchParams.get('from') === 'dashboard'

  const overview = useMemo(() => deriveClaimsOverview(claimsRows, claimsSummary), [])
  const lifecyclePortfolio = useMemo(() => deriveClaimsLifecycleCounts(claimsRows), [])
  const openByChannel = useMemo(() => deriveOpenClaimsByChannel(claimsRows), [])
  const catSplit = useMemo(() => deriveTopCategoryVsOther(claimsRows), [])

  const [query, setQuery] = useState('')
  const [lifecycleFilter, setLifecycleFilter] = useState('all')
  const [type, setType] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortId, setSortId] = useState('submitted-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [reportPage, setReportPage] = useState(1)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportDateFrom, setReportDateFrom] = useState('')
  const [reportDateTo, setReportDateTo] = useState('')
  const [mainTab, setMainTab] = useState('history')

  useEffect(() => {
    if (!reportModalOpen) return
    const end = new Date()
    const start = new Date(end.getFullYear(), 0, 1)
    setReportDateFrom(toIsoDate(start))
    setReportDateTo(toIsoDate(end))
  }, [reportModalOpen])

  const filteredRows = useMemo(() => {
    let list = [...claimsRows]

    if (bucket === 'attention') list = list.filter((r) => r.needsAttention)
    else if (bucket === 'documents') list = list.filter((r) => r.awaitingDocuments)
    else if (bucket === 'delayed') list = list.filter((r) => r.delayed)

    if (lifecycleFilter === 'open') list = list.filter((r) => CLAIM_OPEN_STATUSES.includes(r.status))
    else if (lifecycleFilter === 'closed') list = list.filter((r) => r.status === 'Approved')
    else if (lifecycleFilter === 'rejected') list = list.filter((r) => r.status === 'Rejected')
    if (type !== 'All') list = list.filter((r) => r.claimType === type)
    if (categoryFilter !== 'All') list = list.filter((r) => r.serviceCategory === categoryFilter)

    list = list.filter((r) => rowInDateRange(r.submittedAtIso, dateFrom, dateTo))

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      )
    }

    list.sort((a, b) => {
      if (sortId === 'urgency') {
        if (a.urgency === b.urgency) return b.submittedAtIso.localeCompare(a.submittedAtIso)
        return a.urgency === 'high' ? -1 : 1
      }
      if (sortId === 'amount-desc') return b.amountInr - a.amountInr
      if (sortId === 'amount-asc') return a.amountInr - b.amountInr
      if (sortId === 'submitted-asc') return a.submittedAtIso.localeCompare(b.submittedAtIso)
      return b.submittedAtIso.localeCompare(a.submittedAtIso)
    })

    return list
  }, [bucket, lifecycleFilter, type, categoryFilter, dateFrom, dateTo, query, sortId])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedRows = filteredRows.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const reportTotalPages = Math.max(1, Math.ceil(claimsReportRows.length / REPORTS_PER_PAGE))
  const safeReportPage = Math.min(reportPage, reportTotalPages)
  const paginatedReportRows = claimsReportRows.slice(
    (safeReportPage - 1) * REPORTS_PER_PAGE,
    safeReportPage * REPORTS_PER_PAGE,
  )

  useEffect(() => {
    setReportPage((p) => Math.min(Math.max(1, p), reportTotalPages))
  }, [reportTotalPages])

  function setBucket(next) {
    const nextParams = new URLSearchParams(searchParams)
    if (next) nextParams.set('bucket', next)
    else nextParams.delete('bucket')
    setSearchParams(nextParams, { replace: true })
  }

  function clearDashboardContext() {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('from')
    nextParams.delete('bucket')
    setSearchParams(nextParams, { replace: true })
  }

  const hasFilters =
    lifecycleFilter !== 'all' ||
    type !== 'All' ||
    categoryFilter !== 'All' ||
    !!dateFrom ||
    !!dateTo ||
    !!query.trim() ||
    !!bucket

  function clearFilters() {
    setQuery('')
    setLifecycleFilter('all')
    setType('All')
    setCategoryFilter('All')
    setDateFrom('')
    setDateTo('')
    setSortId('submitted-desc')
    setCurrentPage(1)
    setBucket('')
  }

  function applyDateRange(from, to) {
    setDateFrom(from)
    setDateTo(to)
    setCurrentPage(1)
  }

  const bannerMessage =
    bucket === 'delayed'
      ? 'Showing delayed claims from your dashboard context.'
      : bucket === 'documents'
        ? 'Showing claims awaiting documents.'
        : bucket === 'attention'
          ? 'Showing claims that need attention.'
          : 'Showing claims from your dashboard alert.'

  const { claimsPaidSplitInr, avgSettlementDaysByChannel, topCategoryByChannel } = overview
  const csDays = avgSettlementDaysByChannel.cashless
  const rbDays = avgSettlementDaysByChannel.reimbursement

  const openVsRest = Math.max(0, lifecyclePortfolio.total - lifecyclePortfolio.open)

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-gray-50 px-6 py-3 lg:px-8">
      <div className="shrink-0">
        <PageHeader
          title="Claims"
          subtitle="See claim status, what's blocking progress, and what to do next."
          breadcrumbs={[]}
          trailing={
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-2"
            >
              <Plus size={18} aria-hidden />
              Generate report
            </button>
          }
        />
      </div>

      {fromDashboard && (
        <div className="mb-5 flex shrink-0 flex-wrap items-start justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/90 px-4 py-3 text-sm text-indigo-950">
          <p className="min-w-0 leading-snug">
            <span className="font-semibold">From dashboard.</span>{' '}
            <span className="text-indigo-900/90">{bucket ? bannerMessage : 'Showing all claims.'}</span>
          </p>
          <button
            type="button"
            onClick={clearDashboardContext}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-50"
          >
            <X size={14} aria-hidden />
            Clear context
          </button>
        </div>
      )}

      {/* Overview — compact KPI row + donuts only */}
      <section className="mt-1 mb-3 shrink-0" aria-labelledby="claims-overview-heading">
        <h2 id="claims-overview-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ClaimsCompactKpi
            title="Open vs total claims"
            metric={
              <>
                <span className="tabular-nums">{lifecyclePortfolio.open}</span>
                <span className="mx-0.5 text-xl font-semibold text-gray-400">/</span>
                <span className="tabular-nums">{lifecyclePortfolio.total}</span>
              </>
            }
            subtitle={
              <KpiDonutLegendLines
                labelA="Open"
                labelB="Other"
                valueA={String(lifecyclePortfolio.open)}
                valueB={String(openVsRest)}
                colorA="#047857"
                colorB="#94a3b8"
              />
            }
            tooltip={`Open claims ${lifecyclePortfolio.open} (${openByChannel.cashless} cashless, ${openByChannel.reimbursement} reimbursement). Total ${lifecyclePortfolio.total}.`}
            delayMs={0}
            donut={
              <KeyMetricDonut
                valueA={lifecyclePortfolio.open}
                valueB={openVsRest}
                labelA="Open"
                labelB="Other"
                colorA="#047857"
                colorB="#94a3b8"
                size={56}
                formatValue={(n) => String(Math.round(Number(n) || 0))}
              />
            }
          />
          <ClaimsCompactKpi
            title="Avg claim processing time"
            metric={<span className="tabular-nums">{claimsSummary.avgSettlementDays} days</span>}
            subtitle={
              <KpiDonutLegendLines
                labelA="Cashless"
                labelB="Reimbursement"
                valueA={`${csDays} days`}
                valueB={`${rbDays} days`}
                colorA="#4338ca"
                colorB="#0f766e"
              />
            }
            tooltip={`Portfolio blended average ${claimsSummary.avgSettlementDays} days. Cashless proxy ${csDays} days · Reimbursement proxy ${rbDays} days.`}
            delayMs={75}
            donut={
              <KeyMetricDonut
                valueA={csDays}
                valueB={rbDays}
                labelA="Cashless"
                labelB="Reimbursement"
                colorA="#4338ca"
                colorB="#0f766e"
                size={56}
                formatValue={(n) => `${Math.round(Number(n) || 0)} days`}
              />
            }
          />
          <ClaimsCompactKpi
            title="Top claim category"
            metric={catSplit.topCategory}
            metricClassName="text-[30px] font-bold leading-snug text-gray-900 line-clamp-2"
            subtitle={
              <KpiDonutLegendLines
                labelA="Top category"
                labelB="Other"
                valueA={String(catSplit.topCount)}
                valueB={String(catSplit.other)}
                colorA="#6d28d9"
                colorB="#94a3b8"
              />
            }
            tooltip={`Most frequent category in portfolio: ${catSplit.topCategory} (${catSplit.topCount} claims). Top within cashless: ${topCategoryByChannel.cashless}. Top within reimbursement: ${topCategoryByChannel.reimbursement}.`}
            delayMs={150}
            donut={
              <KeyMetricDonut
                valueA={catSplit.topCount}
                valueB={catSplit.other}
                labelA="Top category"
                labelB="Other"
                colorA="#6d28d9"
                colorB="#94a3b8"
                size={56}
                formatValue={(n) => String(Math.round(Number(n) || 0))}
              />
            }
          />
          <ClaimsCompactKpi
            title="Claim amount paid"
            metric={<span className="tabular-nums">{formatInr(claimsSummary.claimsPaidInr)}</span>}
            subtitle={
              <KpiDonutLegendLines
                labelA="Cashless"
                labelB="Reimbursement"
                valueA={formatInr(claimsPaidSplitInr.cashless)}
                valueB={formatInr(claimsPaidSplitInr.reimbursement)}
                colorA="#3730a3"
                colorB="#0f766e"
              />
            }
            tooltip={`Reported paid YTD ${formatInr(claimsSummary.claimsPaidInr)}. Split · Cashless ${formatInr(claimsPaidSplitInr.cashless)} · Reimbursement ${formatInr(claimsPaidSplitInr.reimbursement)}.`}
            delayMs={225}
            donut={
              <KeyMetricDonut
                valueA={claimsPaidSplitInr.cashless}
                valueB={claimsPaidSplitInr.reimbursement}
                labelA="Cashless"
                labelB="Reimbursement"
                colorA="#3730a3"
                colorB="#0f766e"
                size={56}
                formatValue={(n) => formatInr(Number(n) || 0)}
              />
            }
          />
        </div>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">
          All reported metrics are calculated from the start date of the master policy.
        </p>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div
          className="relative flex shrink-0 gap-8 border-b border-gray-200 px-4 pt-3"
          role="tablist"
          aria-label="Claims workspace"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mainTab === 'history'}
            id="claims-tab-history"
            className={`-mb-px cursor-pointer border-b-2 pb-2.5 pt-0.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
              mainTab === 'history'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-800'
            }`}
            onClick={() => setMainTab('history')}
          >
            Claims history
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mainTab === 'reports'}
            id="claims-tab-reports"
            className={`-mb-px cursor-pointer border-b-2 pb-2.5 pt-0.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
              mainTab === 'reports'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-800'
            }`}
            onClick={() => setMainTab('reports')}
          >
            Reports
          </button>
        </div>

        {mainTab === 'history' ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-gray-100 px-6 py-3" role="tabpanel" aria-labelledby="claims-tab-history">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 shrink-0">
                  <h2 className="text-[15px] font-medium text-gray-900">Claims history</h2>
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
                  <div className="relative min-w-[11rem] w-full max-w-[280px] sm:w-auto sm:flex-initial">
                    <Search
                      size={14}
                      className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      placeholder="Search name, ID, email, claim ID…"
                      autoComplete="off"
                      title="Search claims"
                      aria-label="Search claims"
                      className="min-h-[1.75rem] w-full rounded-lg border border-gray-200 bg-white py-1 pl-8 pr-2.5 text-xs text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <ClaimsDateRangeControl
                      compact
                      dateFrom={dateFrom}
                      dateTo={dateTo}
                      onApply={applyDateRange}
                    />

                    <div className="hidden h-5 w-px shrink-0 bg-gray-200 sm:block" aria-hidden />

                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-900 hover:border-gray-300"
                      aria-label="Filter by claim category"
                    >
                      <option value="All">All categories</option>
                      {CLAIM_SERVICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <select
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-900 hover:border-gray-300"
                      aria-label="Filter by claim type"
                    >
                      <option value="All">All types</option>
                      {CLAIM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sortId}
                      onChange={(e) => {
                        setSortId(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="min-w-[8.5rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-900 hover:border-gray-300"
                      aria-label="Sort claims"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>

                    {hasFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="cursor-pointer whitespace-nowrap text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-50 pt-3" role="group" aria-label="Claim lifecycle">
                {LIFECYCLE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setLifecycleFilter(f.id)
                      setCurrentPage(1)
                    }}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      lifecycleFilter === f.id
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [-webkit-overflow-scrolling:touch] border-t border-gray-50 [min-height:max(16rem,28dvh)]">
              <table className="w-full min-w-0 table-fixed border-collapse">
            <colgroup>
              <col className="w-[11%]" />
              <col className="w-[18%]" />
              <col className="w-[9%]" />
              <col className="w-[18%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="sticky top-0 z-[1]">
              <tr className="border-b border-gray-200 bg-[#f1f3f5]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Claim ID
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Employee
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Claim category
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Submitted
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center align-middle">
                    <p className="text-sm font-normal text-gray-500">
                      No claims match your filters.{' '}
                      <button type="button" onClick={clearFilters} className="font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">
                        Clear filters
                      </button>{' '}
                      to see all.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-4 py-2.5 align-middle">
                      <button
                        type="button"
                        onClick={() => navigate(`/claims/${encodeURIComponent(row.id)}`)}
                        className="cursor-pointer text-left text-[12px] font-semibold text-[#4c46d9] hover:underline"
                      >
                        {row.id}
                      </button>
                    </td>
                    <td className="min-w-0 px-4 py-2.5 align-middle">
                      <span className="block truncate text-[12px] font-normal text-gray-800" title={row.employeeName}>
                        {row.employeeName}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] font-normal tabular-nums text-gray-400" title={row.empId}>
                        {row.empId}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span className="inline-flex rounded-full border border-gray-100 bg-slate-50 px-2 py-0.5 text-[11px] font-normal text-gray-600">
                        {row.claimType}
                      </span>
                    </td>
                    <td className="min-w-0 px-4 py-2.5 align-middle">
                      <span className="line-clamp-2 text-[12px] font-normal leading-snug text-gray-800" title={row.serviceCategory}>
                        {row.serviceCategory}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right align-middle text-[12px] font-semibold tabular-nums text-gray-900">
                      {formatInr(row.amountInr)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 align-middle text-[12px] font-normal text-gray-600">
                      {formatShortDate(row.submittedAtIso)}
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClasses(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <button
                        type="button"
                        className={CLAIM_VIEW_CTA}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/claims/${encodeURIComponent(row.id)}`)
                        }}
                      >
                        <Eye size={12} className="shrink-0" aria-hidden />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
            </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-white px-6 py-3">
          <p className="text-xs font-normal text-gray-400">
            {filteredRows.length > 0
              ? `Showing ${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, filteredRows.length)} of ${filteredRows.length}`
              : 'No results'}
          </p>
          <div className="flex items-center gap-1" role="navigation" aria-label="Claim history pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1 || filteredRows.length === 0}
              aria-label="Previous page"
              className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === safePage ? 'page' : undefined}
                className={`h-8 w-8 cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1 ${
                  page === safePage ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages || filteredRows.length === 0}
              aria-label="Next page"
              className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>
        </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-gray-100 px-6 py-3" role="tabpanel" aria-labelledby="claims-tab-reports">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 shrink-0">
                  <h2 className="text-[15px] font-medium text-gray-900">Reports</h2>
                  <p className="mt-0.5 text-[11px] font-normal text-gray-400">
                    Generate downloads and track processing status (demo).
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                      Cashless + reimbursement
                    </span>
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-gray-600">
                      Preview table · CS {overview.datasetShares.cashlessCount} · RB {overview.datasetShares.reimbursementCount}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                >
                  <Plus size={18} aria-hidden />
                  Generate report
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [-webkit-overflow-scrolling:touch] px-0 [min-height:max(16rem,28dvh)]">
              <table className="w-full min-w-0 table-fixed border-collapse">
                <colgroup>
                  <col className="w-[42%]" />
                  <col className="w-[23%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead className="sticky top-0 z-[1]">
                  <tr className="border-b border-gray-200 bg-[#f1f3f5]">
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                      Report
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                      Requested
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedReportRows.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/60">
                      <td className="min-w-0 px-4 py-2.5 align-middle">
                        <span className="line-clamp-2 text-[12px] font-semibold text-gray-900" title={r.name}>
                          {r.name}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 align-middle text-[12px] font-normal text-gray-600">
                        {formatReq(r.requestedAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 align-middle">
                        {r.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                            <Hash size={11} aria-hidden />
                            Completed
                          </span>
                        ) : r.status === 'processing' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                            <Loader2 size={11} className="animate-spin" aria-hidden />
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                            <AlertTriangle size={11} aria-hidden />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 align-middle">
                        {r.status === 'completed' ? (
                          <button
                            type="button"
                            className={CLAIM_VIEW_CTA}
                            onClick={() => alert('Demo: CSV download would start here.')}
                          >
                            Download
                          </button>
                        ) : (
                          <span className="text-[12px] font-normal text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-3">
              <p className="text-xs font-normal text-gray-400">
                {claimsReportRows.length > 0
                  ? `Showing ${(safeReportPage - 1) * REPORTS_PER_PAGE + 1}–${Math.min(safeReportPage * REPORTS_PER_PAGE, claimsReportRows.length)} of ${claimsReportRows.length}`
                  : 'No results'}
              </p>
              <div className="flex items-center gap-1" role="navigation" aria-label="Reports pagination">
                <button
                  type="button"
                  onClick={() => setReportPage((p) => Math.max(1, p - 1))}
                  disabled={safeReportPage === 1 || claimsReportRows.length === 0}
                  aria-label="Previous page"
                  className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
                >
                  <ChevronLeft size={16} aria-hidden />
                </button>
                {Array.from({ length: reportTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setReportPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === safeReportPage ? 'page' : undefined}
                    className={`h-8 w-8 cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1 ${
                      page === safeReportPage ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setReportPage((p) => Math.min(reportTotalPages, p + 1))}
                  disabled={safeReportPage === reportTotalPages || claimsReportRows.length === 0}
                  aria-label="Next page"
                  className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
                >
                  <ChevronRight size={16} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {reportModalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="claims-report-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div>
                <h2 id="claims-report-modal-title" className="text-lg font-bold text-gray-900">
                  Generate report
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure a claims export. This prototype does not call a backend.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setReportModalOpen(false)}
                className="cursor-pointer rounded-lg border border-transparent p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Date range</p>
                <p className="mt-1 text-xs text-gray-500">
                  Applies to the exported claims report (separate from the table filters below).
                </p>
                <div className="mt-3">
                  <ClaimsDateRangeControl
                    dateFrom={reportDateFrom}
                    dateTo={reportDateTo}
                    onApply={(from, to) => {
                      setReportDateFrom(from)
                      setReportDateTo(to)
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="rep-format" className="block text-sm font-semibold text-gray-700">
                  Format
                </label>
                <select id="rep-format" className="mt-2 w-full min-h-[2.75rem] rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
                  <option>CSV</option>
                  <option>XLSX (demo)</option>
                </select>
              </div>
              <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs text-amber-950">
                You’ll get a confirmation toast when the job is queued (demo only).
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportModalOpen(false)
                  const rangeLabel =
                    reportDateFrom && reportDateTo
                      ? `${formatIsoShort(reportDateFrom)} – ${formatIsoShort(reportDateTo)}`
                      : reportDateFrom
                        ? `From ${formatIsoShort(reportDateFrom)}`
                        : reportDateTo
                          ? `Until ${formatIsoShort(reportDateTo)}`
                          : 'All dates'
                  alert(`Demo: claims report queued for ${rangeLabel}. A new row would appear in Reports after refresh.`)
                }}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Queue report (demo)
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
