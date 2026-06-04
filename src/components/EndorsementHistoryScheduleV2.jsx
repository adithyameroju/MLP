import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Eye, FileDown, FileStack, Info, Loader2, Search } from 'lucide-react'
import {
  EndorsementLogStatusBadge,
  EndorsementLogDateCell,
  resolveEndorsementDisplayStatus,
} from './endorsementLogTableCells'
import { useEndorsements } from '../store/EndorsementStore'
import EndorsementSortTh from './EndorsementSortTh'
import {
  ENDORSEMENT_TABLE_ICON_BTN,
  ENDORSEMENT_SCHEDULE_VIEW_BTN,
  ScheduleBatchConfirmModal,
} from './ScheduleDocumentModals'
import {
  SCHEDULE_PER_PAGE,
  TYPE_OPTIONS,
  endorsementNumber,
  EndorsementPremiumImpactCell,
  EndorsementTypeCell,
  masterPolicyNumber,
  memberLivesAffected,
  rowMatchesSearch,
  entryMatchesDateRange,
  formatShortDate,
  getEndorsementScheduleStatus,
  isGeneratedScheduleChipRow,
  isScheduleDocumentReady,
  canViewEndorsementSchedule,
  downloadEndorsementDetailsExcel,
  downloadScheduleBatchDetailsExcel,
  isScheduleEligibleEndorsement,
  generateClubbedPendingSchedules,
  getPendingScheduleRowIds,
  aggregateScheduleBatchRows,
  countGeneratedScheduleBatches,
  batchRowMatchesTypeFilter,
  batchRowMatchesDateRange,
  batchRowMatchesSearch,
  EndorsementScheduleStatusCell,
  ENDORSEMENT_THEAD_TR_CLASS,
  compareScheduleRowsGenerated,
  compareScheduleRowsPending,
  scheduleRowRecordedSortKey,
} from './endorsementScheduleShared'

const SCHEDULE_TOOLBAR_DATE_INPUT_CLASS =
  'min-h-[1.75rem] min-w-[7.5rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const SCHEDULE_TOOLBAR_SELECT_CLASS =
  'min-h-[1.75rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const generateToolbarBtnClass =
  'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-gray-100'

function EndorsementScheduleActionsCell({ row, onViewSchedule, onDownloadPdf }) {
  const scheduleStatus = getEndorsementScheduleStatus(row)
  if (scheduleStatus === 'pending' || !scheduleStatus) {
    return <span className="text-[12px] text-gray-400">—</span>
  }

  const viewReady = canViewEndorsementSchedule(row)
  const pdfReady = isScheduleDocumentReady(row)

  function handleDownloadExcel() {
    if (row.isScheduleBatchRow) {
      downloadScheduleBatchDetailsExcel(row)
    } else {
      downloadEndorsementDetailsExcel(row)
    }
  }

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        disabled={!viewReady}
        className={ENDORSEMENT_SCHEDULE_VIEW_BTN}
        title={viewReady ? `View schedule ${row.scheduleRef}` : 'View unavailable until generation completes'}
        aria-label={viewReady ? `View schedule ${row.scheduleRef}` : 'View unavailable until generation completes'}
        onClick={() => onViewSchedule?.(row)}
      >
        <Eye size={11} strokeWidth={2} className="shrink-0" aria-hidden />
        View
      </button>
      <button
        type="button"
        disabled={!pdfReady}
        className={ENDORSEMENT_TABLE_ICON_BTN}
        title={pdfReady ? 'Download Excel details' : 'Available when generation completes'}
        aria-label={pdfReady ? 'Download Excel details' : 'Excel download unavailable until generation completes'}
        onClick={handleDownloadExcel}
      >
        <Download size={12} strokeWidth={2} className="shrink-0" aria-hidden />
      </button>
      <button
        type="button"
        disabled={!pdfReady}
        className={ENDORSEMENT_TABLE_ICON_BTN}
        title={pdfReady ? 'Download schedule PDF' : 'Available when generation completes'}
        aria-label={pdfReady ? 'Download schedule PDF' : 'PDF download unavailable until generation completes'}
        onClick={() => onDownloadPdf?.(row)}
      >
        <FileDown size={12} strokeWidth={2} className="shrink-0" aria-hidden />
      </button>
    </div>
  )
}

/**
 * Endorsement schedules table (V3 schedules tab).
 */
export default function EndorsementHistoryScheduleV2({
  hideTitle = false,
  dateFrom = '',
  dateTo = '',
  onDateFromChange,
  onDateToChange,
  onViewSchedule,
  onDownloadPdf,
}) {
  const { history, updateEntry } = useEndorsements()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [scheduleChipFilter, setScheduleChipFilter] = useState('pending')
  const [tablePage, setTablePage] = useState(1)
  const [scheduleSort, setScheduleSort] = useState(() => ({ key: 'date', dir: 'desc' }))
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const genTimersRef = useRef([])

  useEffect(() => {
    return () => {
      genTimersRef.current.forEach((tid) => window.clearTimeout(tid))
    }
  }, [])

  useEffect(() => {
    setTablePage(1)
    setScheduleSort((prev) => {
      if (scheduleChipFilter === 'generated' && prev.key !== 'scheduleDate' && prev.key !== 'scheduleNo' && prev.key !== 'masterPolicy') {
        return { key: 'scheduleDate', dir: 'desc' }
      }
      if (scheduleChipFilter === 'pending' && (prev.key === 'scheduleDate' || prev.key === 'scheduleNo' || prev.key === 'masterPolicy')) {
        return { key: 'date', dir: 'desc' }
      }
      return prev
    })
  }, [query, typeFilter, scheduleChipFilter, dateFrom, dateTo])

  const pendingPortfolioCount = useMemo(() => getPendingScheduleRowIds(history).length, [history])

  const scheduleEligibleRows = useMemo(
    () =>
      [...history]
        .filter((e) => isScheduleEligibleEndorsement(e) && getEndorsementScheduleStatus(e))
        .sort((a, b) => String(b.recordedAt || b.date).localeCompare(String(a.recordedAt || a.date))),
    [history],
  )

  const scheduleChipCounts = useMemo(
    () => ({
      pending: scheduleEligibleRows.filter((r) => getEndorsementScheduleStatus(r) === 'pending').length,
      generated: countGeneratedScheduleBatches(scheduleEligibleRows),
    }),
    [scheduleEligibleRows],
  )

  const filteredRows = useMemo(() => {
    let list = scheduleEligibleRows
    if (scheduleChipFilter === 'generated') {
      list = aggregateScheduleBatchRows(list.filter((r) => isGeneratedScheduleChipRow(r)))
      if (typeFilter !== 'all') list = list.filter((b) => batchRowMatchesTypeFilter(b, typeFilter))
      if (dateFrom || dateTo) list = list.filter((b) => batchRowMatchesDateRange(b, dateFrom, dateTo))
      list = list.filter((b) => batchRowMatchesSearch(b, query))
    } else {
      list = list.filter((r) => getEndorsementScheduleStatus(r) === 'pending')
      if (typeFilter !== 'all') list = list.filter((e) => e.type === typeFilter)
      if (dateFrom || dateTo) list = list.filter((e) => entryMatchesDateRange(e, dateFrom, dateTo))
      list = list.filter((e) => rowMatchesSearch(e, query))
    }
    return list
  }, [scheduleEligibleRows, typeFilter, scheduleChipFilter, query, dateFrom, dateTo])

  function handleScheduleSort(columnKey) {
    setScheduleSort((prev) => {
      if (prev.key === columnKey) return { key: columnKey, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      const preferDesc =
        columnKey === 'scheduleDate' ||
        columnKey === 'generatedOn' ||
        columnKey === 'recordedAt' ||
        columnKey === 'date' ||
        columnKey === 'premiumImpact' ||
        columnKey === 'memberCount' ||
        columnKey === 'endorsementStatus' ||
        columnKey === 'scheduleStatus'
      return { key: columnKey, dir: preferDesc ? 'desc' : 'asc' }
    })
    setTablePage(1)
  }

  const isPendingView = scheduleChipFilter === 'pending'

  const showGenerateShimmer = isPendingView && pendingPortfolioCount > 0 && !bulkGenerating

  const sortedFilteredRows = useMemo(() => {
    const list = [...filteredRows]
    const compare = isPendingView ? compareScheduleRowsPending : compareScheduleRowsGenerated
    list.sort((a, b) => {
      const cmp = compare(a, b, scheduleSort.key, scheduleSort.dir)
      if (cmp !== 0) return cmp
      return scheduleRowRecordedSortKey(b).localeCompare(scheduleRowRecordedSortKey(a))
    })
    return list
  }, [filteredRows, scheduleSort, isPendingView])

  const scheduleTotalPages = Math.max(1, Math.ceil(sortedFilteredRows.length / SCHEDULE_PER_PAGE))
  const scheduleSafePage = Math.min(tablePage, scheduleTotalPages)
  const paginatedRows = sortedFilteredRows.slice(
    (scheduleSafePage - 1) * SCHEDULE_PER_PAGE,
    scheduleSafePage * SCHEDULE_PER_PAGE,
  )

  useEffect(() => {
    setTablePage((p) => Math.min(Math.max(1, p), scheduleTotalPages))
  }, [scheduleTotalPages])

  function confirmGenerateAllPendingSchedules() {
    if (pendingPortfolioCount === 0 || bulkGenerating) return
    setBulkGenerating(true)
    setConfirmOpen(false)
    setScheduleChipFilter('generated')
    setTablePage(1)
    genTimersRef.current.forEach((tid) => window.clearTimeout(tid))
    genTimersRef.current = []
    generateClubbedPendingSchedules(history, updateEntry, genTimersRef, {
      onBatchComplete: () => {
        setBulkGenerating(false)
      },
    })
  }

  const tableColSpan = isPendingView ? 6 : 5

  const toolbarContent = (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Schedule status">
        {[
          { id: 'pending', label: 'Pending schedules', count: scheduleChipCounts.pending },
          { id: 'generated', label: 'Schedules generated', count: scheduleChipCounts.generated },
        ].map((chip) => {
          const active = scheduleChipFilter === chip.id
          const label =
            chip.id === 'pending' && chip.count != null ? `${chip.label} (${chip.count})` : chip.label
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                setScheduleChipFilter(chip.id)
                setTablePage(1)
              }}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        <div className="relative min-w-[11rem] w-full max-w-[296px] sm:w-auto sm:flex-initial">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isPendingView ? 'Search type, status…' : 'Search schedule no., master policy…'}
            autoComplete="off"
            title="Search schedules"
            aria-label="Search schedules"
            className="min-h-[1.75rem] w-full rounded-lg border border-gray-200 bg-white py-1 pl-8 pr-2.5 text-xs text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <span className="hidden h-5 w-px shrink-0 bg-gray-200 sm:block" aria-hidden />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange?.(e.target.value)}
          className={`${SCHEDULE_TOOLBAR_DATE_INPUT_CLASS} shrink-0`}
          title="From date"
          aria-label="Filter from date"
        />
        <span className="text-xs text-gray-400" aria-hidden>
          –
        </span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange?.(e.target.value)}
          className={`${SCHEDULE_TOOLBAR_DATE_INPUT_CLASS} shrink-0`}
          title="To date"
          aria-label="Filter to date"
        />
        <span className="h-6 w-px shrink-0 self-center bg-gray-200" aria-hidden />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`${SCHEDULE_TOOLBAR_SELECT_CLASS} shrink-0`}
          aria-label="Filter by run type"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        {isPendingView ? (
          <>
            <span className="h-6 w-px shrink-0 self-center bg-gray-200" aria-hidden />
            <button
              id="eh-v3-generate-schedule-btn"
              type="button"
              disabled={bulkGenerating || pendingPortfolioCount === 0}
              onClick={() => setConfirmOpen(true)}
              className={`${generateToolbarBtnClass}${showGenerateShimmer ? ' generate-schedule-shimmer' : ''}`}
              title={
                pendingPortfolioCount === 0
                  ? 'No pending endorsements to include in a schedule'
                  : `Generate one schedule for ${pendingPortfolioCount} pending endorsement${pendingPortfolioCount === 1 ? '' : 's'}`
              }
            >
              <span className="relative z-[1] inline-flex items-center gap-2">
                {bulkGenerating ? (
                  <Loader2 size={16} className="shrink-0 animate-spin" aria-hidden />
                ) : (
                  <FileStack size={16} aria-hidden />
                )}
                {bulkGenerating ? 'Generating…' : `Generate schedule (${pendingPortfolioCount})`}
              </span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  )

  return (
    <>
      <ScheduleBatchConfirmModal
        open={confirmOpen}
        pendingCount={pendingPortfolioCount}
        generating={bulkGenerating}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void confirmGenerateAllPendingSchedules()}
      />
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative z-20 shrink-0 border-b border-gray-100 px-6 py-3" role="tabpanel" aria-labelledby="eh-v3-tab-schedules">
        {hideTitle ? (
          toolbarContent
        ) : (
          <>
            <h2 className="text-[15px] font-medium text-gray-900">Endorsement schedules</h2>
            <div className="mt-3 border-t border-gray-100 pt-3">{toolbarContent}</div>
          </>
        )}
        {isPendingView ? (
          <div className="mt-3">
            <div
              role="note"
              className="flex items-start gap-2 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-2.5 text-xs leading-snug text-indigo-950"
            >
              <Info size={14} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden />
              <p>Schedules not generated will auto-generate at the end of the month.</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [min-height:max(16rem,28dvh)]">
          <table className="w-full min-w-0 table-fixed border-collapse">
            <thead className="sticky top-0 z-[1]">
              <tr className={ENDORSEMENT_THEAD_TR_CLASS}>
                {isPendingView ? (
                  <>
                    <EndorsementSortTh columnKey="date" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                      Date completed
                    </EndorsementSortTh>
                    <EndorsementSortTh columnKey="endorsementType" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                      Endorsement type
                    </EndorsementSortTh>
                    <EndorsementSortTh
                      columnKey="memberCount"
                      sortKey={scheduleSort.key}
                      sortDir={scheduleSort.dir}
                      onSort={handleScheduleSort}
                      align="right"
                      className="whitespace-nowrap"
                    >
                      Lives affected
                    </EndorsementSortTh>
                    <EndorsementSortTh
                      columnKey="premiumImpact"
                      sortKey={scheduleSort.key}
                      sortDir={scheduleSort.dir}
                      onSort={handleScheduleSort}
                      align="right"
                      className="whitespace-nowrap"
                      title="Estimated premium incl. GST for this endorsement."
                    >
                      Premium impact
                    </EndorsementSortTh>
                    <EndorsementSortTh
                      columnKey="endorsementStatus"
                      sortKey={scheduleSort.key}
                      sortDir={scheduleSort.dir}
                      onSort={handleScheduleSort}
                      className="min-w-0"
                    >
                      Endorsement status
                    </EndorsementSortTh>
                    <EndorsementSortTh columnKey="scheduleStatus" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} className="min-w-0">
                      Schedule status
                    </EndorsementSortTh>
                  </>
                ) : (
                  <>
                    <EndorsementSortTh columnKey="masterPolicy" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} className="min-w-0">
                      Master Policy Number
                    </EndorsementSortTh>
                    <EndorsementSortTh columnKey="scheduleNo" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                      Schedule No
                    </EndorsementSortTh>
                    <EndorsementSortTh columnKey="scheduleDate" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                      Schedule Date
                    </EndorsementSortTh>
                    <EndorsementSortTh columnKey="scheduleStatus" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} className="min-w-0">
                      Schedule status
                    </EndorsementSortTh>
                    <th scope="col" className="min-w-0 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                      Endorsement schedule
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedFilteredRows.length === 0 ? (
                <tr>
                  <td colSpan={tableColSpan} className="px-4 py-14 text-center align-middle">
                    <p className="text-sm text-gray-500">No schedules match your filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50/70">
                    {isPendingView ? (
                      <>
                        <td className="whitespace-nowrap px-3 py-2 align-middle">
                          <EndorsementLogDateCell row={row} />
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <EndorsementTypeCell row={row} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 align-middle text-right text-[12px] tabular-nums text-gray-800">
                          {memberLivesAffected(row)}
                          <span className="ml-1 text-[10px] font-normal text-gray-500">
                            {memberLivesAffected(row) === 1 ? 'life' : 'lives'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 align-middle">
                          <EndorsementPremiumImpactCell row={row} />
                        </td>
                        <td className="min-w-0 px-3 py-2 align-middle">
                          <EndorsementLogStatusBadge status={resolveEndorsementDisplayStatus(row)} />
                        </td>
                        <td className="min-w-0 px-3 py-2 align-middle">
                          <EndorsementScheduleStatusCell row={row} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="min-w-0 px-3 py-2 align-middle font-mono text-[12px] font-medium text-gray-900">
                          <span className="block truncate" title={masterPolicyNumber(row)}>
                            {masterPolicyNumber(row)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 align-middle font-mono text-[12px] font-medium text-gray-900">
                          {endorsementNumber(row)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 align-middle text-[12px] text-gray-700">
                          {row.scheduleGeneratedAt ? formatShortDate(row.scheduleGeneratedAt) : '—'}
                        </td>
                        <td className="min-w-0 px-3 py-2 align-middle">
                          <EndorsementScheduleStatusCell row={row} />
                        </td>
                        <td className="min-w-0 px-3 py-2 align-middle">
                          <EndorsementScheduleActionsCell
                            row={row}
                            onViewSchedule={onViewSchedule}
                            onDownloadPdf={onDownloadPdf}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-white px-6 py-3">
        <p className="text-xs font-normal text-gray-400">
          {sortedFilteredRows.length > 0
            ? `Showing ${(scheduleSafePage - 1) * SCHEDULE_PER_PAGE + 1}–${Math.min(scheduleSafePage * SCHEDULE_PER_PAGE, sortedFilteredRows.length)} of ${sortedFilteredRows.length}`
            : 'No results'}
        </p>
        <div className="flex items-center gap-1" role="navigation" aria-label="Schedule table pagination">
          <button
            type="button"
            onClick={() => setTablePage((p) => Math.max(1, p - 1))}
            disabled={scheduleSafePage === 1 || sortedFilteredRows.length === 0}
            aria-label="Previous page"
            className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          {Array.from({ length: scheduleTotalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setTablePage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === scheduleSafePage ? 'page' : undefined}
              className={`min-w-[1.75rem] cursor-pointer rounded-md px-1.5 py-1 text-xs tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1 ${
                page === scheduleSafePage ? 'bg-indigo-600 font-semibold text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTablePage((p) => Math.min(scheduleTotalPages, p + 1))}
            disabled={scheduleSafePage === scheduleTotalPages || sortedFilteredRows.length === 0}
            aria-label="Next page"
            className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
