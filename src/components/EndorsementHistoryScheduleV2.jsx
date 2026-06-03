import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Eye, FileDown, FileStack, Loader2, Search } from 'lucide-react'
import {
  EndorsementActivityCell,
  EndorsementRunModeCell,
  EndorsementDoneByCell,
} from './endorsementLogTableCells'
import ScheduleGenerateHoverTip from './ScheduleGenerateHoverTip'
import { formatInr } from '../lib/currencyFormat'
import { useEndorsements } from '../store/EndorsementStore'
import EndorsementSortTh from './EndorsementSortTh'
import {
  ENDORSEMENT_TABLE_ICON_BTN,
  ENDORSEMENT_SCHEDULE_GENERATE_BTN,
} from './ScheduleDocumentModals'
import {
  SCHEDULE_PER_PAGE,
  TYPE_OPTIONS,
  endorsementNumber,
  entryCdImpactInr,
  rowMatchesSearch,
  entryMatchesDateRange,
  formatShortDate,
  getEndorsementScheduleStatus,
  isScheduleDocumentReady,
  canViewEndorsementSchedule,
  downloadEndorsementDetailsExcel,
  eligibleForSchedule,
  generateScheduleForRows,
  EndorsementScheduleStatusCell,
  ENDORSEMENT_THEAD_TR_CLASS,
  compareScheduleRowsGenerated,
  scheduleRowRecordedSortKey,
} from './endorsementScheduleShared'

const SCHEDULE_TOOLBAR_DATE_INPUT_CLASS =
  'min-h-[1.75rem] min-w-[7.5rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const SCHEDULE_TOOLBAR_SELECT_CLASS =
  'min-h-[1.75rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const SCHEDULE_VIEW_BTN_CLASS =
  'inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-md bg-[#f0f2ff] px-2 text-[11px] font-medium text-[#4c46d9] transition-colors hover:bg-[#e6eaff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4c46d9]/35 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40'

const generateToolbarBtnClass =
  'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-gray-100'

const clearSelectionBtnClass =
  'inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-40'

function EndorsementScheduleActionsCell({ row, onGenerateSchedule, onViewSchedule, onDownloadPdf }) {
  const scheduleStatus = getEndorsementScheduleStatus(row)
  if (scheduleStatus === 'pending') {
    return (
      <button
        type="button"
        className={ENDORSEMENT_SCHEDULE_GENERATE_BTN}
        onClick={() => onGenerateSchedule?.(row)}
      >
        Generate
      </button>
    )
  }
  if (scheduleStatus === 'processing') {
    return (
      <div className="inline-flex items-center gap-1 text-indigo-600">
        <Loader2 size={14} className="animate-spin" aria-hidden />
        <span className="text-[11px] font-medium">Generating…</span>
      </div>
    )
  }
  if (scheduleStatus === 'generated') {
    const viewReady = canViewEndorsementSchedule(row)
    const pdfReady = isScheduleDocumentReady(row)
    return (
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          disabled={!viewReady}
          className={SCHEDULE_VIEW_BTN_CLASS}
          title={viewReady ? `View schedule ${row.scheduleRef}` : 'View unavailable'}
          aria-label={viewReady ? `View schedule ${row.scheduleRef}` : 'View unavailable'}
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
          aria-label={pdfReady ? 'Download Excel details' : 'Excel download unavailable'}
          onClick={() => downloadEndorsementDetailsExcel(row)}
        >
          <Download size={12} strokeWidth={2} className="shrink-0" aria-hidden />
        </button>
        <button
          type="button"
          disabled={!pdfReady}
          className={ENDORSEMENT_TABLE_ICON_BTN}
          title={pdfReady ? 'Download schedule PDF' : 'Available when generation completes'}
          aria-label={pdfReady ? 'Download schedule PDF' : 'PDF download unavailable'}
          onClick={() => onDownloadPdf?.(row)}
        >
          <FileDown size={12} strokeWidth={2} className="shrink-0" aria-hidden />
        </button>
      </div>
    )
  }
  return <span className="text-[12px] text-gray-400">—</span>
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
  enableRowSelection = false,
  onGenerateSchedule,
  onViewSchedule,
  onDownloadPdf,
}) {
  const { history, updateEntry } = useEndorsements()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [scheduleChipFilter, setScheduleChipFilter] = useState('all')
  const [tablePage, setTablePage] = useState(1)
  const [scheduleSort, setScheduleSort] = useState(() => ({ key: 'recordedAt', dir: 'desc' }))
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const headerSelectRef = useRef(null)
  const genTimersRef = useRef([])

  useEffect(() => {
    return () => {
      genTimersRef.current.forEach((tid) => window.clearTimeout(tid))
    }
  }, [])

  useEffect(() => {
    setTablePage(1)
  }, [query, typeFilter, scheduleChipFilter, dateFrom, dateTo])

  const scheduleEligibleRows = useMemo(
    () =>
      [...history]
        .filter((e) => e.status === 'Success' && getEndorsementScheduleStatus(e))
        .sort((a, b) => String(b.recordedAt || b.date).localeCompare(String(a.recordedAt || a.date))),
    [history],
  )

  const scheduleChipCounts = useMemo(
    () => ({
      pending: scheduleEligibleRows.filter((r) => getEndorsementScheduleStatus(r) === 'pending').length,
      generated: scheduleEligibleRows.filter((r) => getEndorsementScheduleStatus(r) === 'generated').length,
    }),
    [scheduleEligibleRows],
  )

  const filteredRows = useMemo(() => {
    let list = scheduleEligibleRows
    if (typeFilter !== 'all') list = list.filter((e) => e.type === typeFilter)
    if (dateFrom || dateTo) list = list.filter((e) => entryMatchesDateRange(e, dateFrom, dateTo))
    if (scheduleChipFilter === 'pending') {
      list = list.filter((r) => getEndorsementScheduleStatus(r) === 'pending')
    } else if (scheduleChipFilter === 'generated') {
      list = list.filter((r) => getEndorsementScheduleStatus(r) === 'generated')
    }
    return list.filter((e) => rowMatchesSearch(e, query))
  }, [scheduleEligibleRows, typeFilter, scheduleChipFilter, query, dateFrom, dateTo])

  function handleScheduleSort(columnKey) {
    setScheduleSort((prev) => {
      if (prev.key === columnKey) return { key: columnKey, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      const preferDesc =
        columnKey === 'generatedOn' ||
        columnKey === 'recordedAt' ||
        columnKey === 'date' ||
        columnKey === 'amount' ||
        columnKey === 'status' ||
        columnKey === 'scheduleStatus'
      return { key: columnKey, dir: preferDesc ? 'desc' : 'asc' }
    })
    setTablePage(1)
  }

  const sortedFilteredRows = useMemo(() => {
    const list = [...filteredRows]
    list.sort((a, b) => {
      const cmp = compareScheduleRowsGenerated(a, b, scheduleSort.key, scheduleSort.dir)
      if (cmp !== 0) return cmp
      return scheduleRowRecordedSortKey(b).localeCompare(scheduleRowRecordedSortKey(a))
    })
    return list
  }, [filteredRows, scheduleSort])

  const scheduleTotalPages = Math.max(1, Math.ceil(sortedFilteredRows.length / SCHEDULE_PER_PAGE))
  const scheduleSafePage = Math.min(tablePage, scheduleTotalPages)
  const paginatedRows = sortedFilteredRows.slice(
    (scheduleSafePage - 1) * SCHEDULE_PER_PAGE,
    scheduleSafePage * SCHEDULE_PER_PAGE,
  )

  useEffect(() => {
    setTablePage((p) => Math.min(Math.max(1, p), scheduleTotalPages))
  }, [scheduleTotalPages])

  const eligibleFiltered = useMemo(() => filteredRows.filter(eligibleForSchedule), [filteredRows])

  const selectedEligibleCount = useMemo(
    () => sortedFilteredRows.filter((e) => selectedIds.has(e.id) && eligibleForSchedule(e)).length,
    [sortedFilteredRows, selectedIds],
  )

  const allEligibleSelected =
    eligibleFiltered.length > 0 && eligibleFiltered.every((e) => selectedIds.has(e.id))

  const someEligibleSelected = eligibleFiltered.some((e) => selectedIds.has(e.id))

  useEffect(() => {
    const el = headerSelectRef.current
    if (!el) return
    el.indeterminate = !allEligibleSelected && someEligibleSelected
  }, [allEligibleSelected, someEligibleSelected])

  function toggleSelected(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAllEligible() {
    if (allEligibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        eligibleFiltered.forEach((e) => next.delete(e.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        eligibleFiltered.forEach((e) => next.add(e.id))
        return next
      })
    }
  }

  async function generateForSelection() {
    const ids = sortedFilteredRows.filter((e) => selectedIds.has(e.id) && eligibleForSchedule(e)).map((e) => e.id)
    if (ids.length === 0) return
    setBulkGenerating(true)
    genTimersRef.current.forEach((tid) => window.clearTimeout(tid))
    genTimersRef.current = []
    try {
      await new Promise((r) => window.setTimeout(r, 450))
      generateScheduleForRows(ids, updateEntry, genTimersRef)
      setSelectedIds(new Set())
    } finally {
      setBulkGenerating(false)
    }
  }

  const tableColSpan = (enableRowSelection ? 1 : 0) + 8

  const toolbarContent = (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Schedule status">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending schedules', count: scheduleChipCounts.pending },
          { id: 'generated', label: 'Generated', count: scheduleChipCounts.generated },
        ].map((chip) => {
          const active = scheduleChipFilter === chip.id
          const label =
            chip.id !== 'all' && chip.count != null ? `${chip.label} (${chip.count})` : chip.label
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
        <div className="relative min-w-[11rem] w-full max-w-[280px] sm:w-auto sm:flex-initial">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endorsement no., action, done by…"
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
      </div>
    </div>
  )

  const selectionBanner =
    enableRowSelection && selectedEligibleCount >= 2 ? (
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50/90 px-4 py-2.5">
        <p className="text-sm font-medium text-indigo-950">
          <span className="tabular-nums font-semibold">{selectedEligibleCount}</span> selected — generate schedules
          for these endorsements.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <ScheduleGenerateHoverTip>
            <button
              type="button"
              disabled={bulkGenerating || selectedEligibleCount === 0}
              onClick={() => void generateForSelection()}
              className={generateToolbarBtnClass}
            >
              {bulkGenerating ? (
                <Loader2 size={16} className="shrink-0 animate-spin" aria-hidden />
              ) : (
                <FileStack size={16} aria-hidden />
              )}
              {bulkGenerating ? 'Generating…' : 'Generate schedule'}
            </button>
          </ScheduleGenerateHoverTip>
          <button
            type="button"
            disabled={bulkGenerating}
            onClick={() => setSelectedIds(new Set())}
            className={clearSelectionBtnClass}
            aria-label="Clear selected rows"
          >
            Clear
          </button>
        </div>
      </div>
    ) : null

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-gray-100 px-6 py-3" role="tabpanel" aria-labelledby="eh-v3-tab-schedules">
        {selectionBanner}
        {hideTitle ? (
          toolbarContent
        ) : (
          <>
            <h2 className="text-[15px] font-medium text-gray-900">Endorsement schedules</h2>
            <div className="mt-3 border-t border-gray-100 pt-3">{toolbarContent}</div>
          </>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [min-height:max(16rem,28dvh)]">
          <table className="w-full min-w-0 table-fixed border-collapse">
            <thead className="sticky top-0 z-[1]">
              <tr className={ENDORSEMENT_THEAD_TR_CLASS}>
                {enableRowSelection ? (
                  <th className="w-11 px-3 py-2.5 text-left align-middle" scope="col">
                    <input
                      ref={headerSelectRef}
                      type="checkbox"
                      checked={allEligibleSelected}
                      disabled={eligibleFiltered.length === 0}
                      onChange={toggleSelectAllEligible}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Select all eligible schedules in view"
                    />
                  </th>
                ) : null}
                <EndorsementSortTh columnKey="endorsementNo" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                  Endorsement no.
                </EndorsementSortTh>
                <EndorsementSortTh columnKey="generatedOn" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                  Generated on
                </EndorsementSortTh>
                <EndorsementSortTh columnKey="activity" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} className="min-w-0">
                  Activity
                </EndorsementSortTh>
                <EndorsementSortTh columnKey="entryMode" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                  Entry mode
                </EndorsementSortTh>
                <EndorsementSortTh columnKey="doneBy" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} className="min-w-0">
                  Done by
                </EndorsementSortTh>
                <EndorsementSortTh columnKey="amount" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} align="right">
                  Amount
                </EndorsementSortTh>
                <EndorsementSortTh columnKey="scheduleStatus" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort} className="min-w-0">
                  Schedule status
                </EndorsementSortTh>
                <th scope="col" className="min-w-0 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]">
                  Endorsement schedule
                </th>
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
                paginatedRows.map((row) => {
                  const rowEligible = eligibleForSchedule(row)
                  return (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50/70">
                    {enableRowSelection ? (
                      <td className="px-3 py-2 align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          disabled={!rowEligible}
                          onChange={() => toggleSelected(row.id)}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Select ${endorsementNumber(row)}`}
                        />
                      </td>
                    ) : null}
                    <td className="whitespace-nowrap px-3 py-2 align-middle font-mono text-[12px] font-medium text-gray-900">
                      {endorsementNumber(row)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 align-middle text-[12px] text-gray-700">
                      {row.scheduleGeneratedAt ? formatShortDate(row.scheduleGeneratedAt) : '—'}
                    </td>
                    <td className="min-w-0 px-4 py-2 align-middle">
                      <EndorsementActivityCell row={row} singleLineSubtext />
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <EndorsementRunModeCell row={row} />
                    </td>
                    <td className="min-w-0 truncate px-3 py-2 align-middle">
                      <EndorsementDoneByCell row={row} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right align-middle text-[12px] font-semibold tabular-nums text-gray-900">
                      {formatInr(entryCdImpactInr(row))}
                    </td>
                    <td className="min-w-0 px-3 py-2 align-middle">
                      <EndorsementScheduleStatusCell row={row} />
                    </td>
                    <td className="min-w-0 px-3 py-2 align-middle">
                      <EndorsementScheduleActionsCell
                        row={row}
                        onGenerateSchedule={onGenerateSchedule}
                        onViewSchedule={onViewSchedule}
                        onDownloadPdf={onDownloadPdf}
                      />
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-white px-6 py-3">
        <p className="text-xs font-normal text-gray-400">
          {sortedFilteredRows.length > 0
            ? `Showing ${(scheduleSafePage - 1) * SCHEDULE_PER_PAGE + 1}–${Math.min(scheduleSafePage * SCHEDULE_PER_PAGE, sortedFilteredRows.length)} of ${sortedFilteredRows.length}${
                enableRowSelection && selectedIds.size > 0 ? ` · ${selectedIds.size} selected` : ''
              }`
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
  )
}
