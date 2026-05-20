import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  FileStack,
  Loader2,
  Search,
} from 'lucide-react'
import {
  EndorsementActivityCell,
  EndorsementRunModeCell,
  EndorsementDoneByCell,
} from './endorsementLogTableCells'
import { formatInr } from '../lib/currencyFormat'
import { useEndorsements } from '../store/EndorsementStore'
import EndorsementSortTh from './EndorsementSortTh'
import ScheduleGenerateHoverTip from './ScheduleGenerateHoverTip'
import {
  SCHEDULE_PER_PAGE,
  TYPE_OPTIONS,
  SCHEDULE_FILE_ICON_BTN,
  downloadEndorsementDetailsExcel,
  eligibleForSchedule,
  endorsementNumber,
  entryCdImpactInr,
  rowMatchesSearch,
  entryMatchesDateRange,
  createBatchScheduleRefs,
  formatShortDate,
  isScheduleDocumentReady,
  ScheduleDocumentStatusCell,
  runSchedulePdfProgressDemo,
  SCHEDULE_PDF_STEPS,
  SCHEDULE_PDF_STEP_MS,
  ENDORSEMENT_THEAD_TR_CLASS,
  compareScheduleRowsPending,
  compareScheduleRowsGenerated,
} from './endorsementScheduleShared'

const generateToolbarBtnClass =
  'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-gray-100'

const clearSelectionBtnClass =
  'shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-40'

const SCHEDULE_TOOLBAR_DATE_INPUT_CLASS =
  'min-h-[1.75rem] min-w-[7.5rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const SCHEDULE_TOOLBAR_SELECT_CLASS =
  'min-h-[1.75rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

/**
 * Pending or generated schedule table — same rows/columns as `EndorsementSchedule` page.
 * Used inside Endorsements dashboard V2 (parent owns tabs).
 *
 * @param {{ slice: 'pending' | 'generated'; onAfterGenerate?: () => void; dateFrom?: string; dateTo?: string; onDateFromChange?: (v: string) => void; onDateToChange?: (v: string) => void }} props
 */
export default function EndorsementHistoryScheduleV2({
  slice,
  onAfterGenerate,
  dateFrom = '',
  dateTo = '',
  onDateFromChange,
  onDateToChange,
}) {
  const { history, updateEntry } = useEndorsements()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const headerSelectRef = useRef(null)
  const [tablePage, setTablePage] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)
  const genTimersRef = useRef([])
  const [scheduleSort, setScheduleSort] = useState(() =>
    slice === 'pending' ? { key: 'date', dir: 'desc' } : { key: 'generatedOn', dir: 'desc' },
  )

  useEffect(() => {
    return () => {
      genTimersRef.current.forEach((tid) => window.clearTimeout(tid))
      genTimersRef.current = []
    }
  }, [])

  useEffect(() => {
    setSelectedIds(new Set())
  }, [slice])

  useEffect(() => {
    setScheduleSort(slice === 'pending' ? { key: 'date', dir: 'desc' } : { key: 'generatedOn', dir: 'desc' })
  }, [slice])

  useEffect(() => {
    setTablePage(1)
  }, [slice, query, typeFilter, dateFrom, dateTo])

  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => String(b.recordedAt || b.date).localeCompare(String(a.recordedAt || a.date))),
    [history],
  )

  const portfolioPending = useMemo(
    () => sortedHistory.filter((e) => e.status === 'Success' && !e.scheduleRef),
    [sortedHistory],
  )

  const portfolioGenerated = useMemo(
    () => sortedHistory.filter((e) => !!e.scheduleRef && e.status === 'Success'),
    [sortedHistory],
  )

  const tabSourceRows = useMemo(() => {
    return slice === 'pending' ? portfolioPending : portfolioGenerated
  }, [slice, portfolioPending, portfolioGenerated])

  const filteredRows = useMemo(() => {
    let list = tabSourceRows
    if (typeFilter !== 'all') list = list.filter((e) => e.type === typeFilter)
    if (dateFrom || dateTo) list = list.filter((e) => entryMatchesDateRange(e, dateFrom, dateTo))
    list = list.filter((e) => rowMatchesSearch(e, query))
    return list
  }, [tabSourceRows, typeFilter, query, dateFrom, dateTo])

  function handleScheduleSort(columnKey) {
    setScheduleSort((prev) => {
      if (prev.key === columnKey) return { key: columnKey, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      const preferDesc =
        columnKey === 'date' ||
        columnKey === 'generatedOn' ||
        columnKey === 'amount' ||
        columnKey === 'status'
      return { key: columnKey, dir: preferDesc ? 'desc' : 'asc' }
    })
    setTablePage(1)
  }

  const sortedFilteredRows = useMemo(() => {
    const list = [...filteredRows]
    const cmp = slice === 'pending' ? compareScheduleRowsPending : compareScheduleRowsGenerated
    list.sort((a, b) => cmp(a, b, scheduleSort.key, scheduleSort.dir))
    return list
  }, [filteredRows, slice, scheduleSort])

  const scheduleTotalPages = Math.max(1, Math.ceil(sortedFilteredRows.length / SCHEDULE_PER_PAGE))
  const scheduleSafePage = Math.min(tablePage, scheduleTotalPages)
  const paginatedRows = sortedFilteredRows.slice((scheduleSafePage - 1) * SCHEDULE_PER_PAGE, scheduleSafePage * SCHEDULE_PER_PAGE)

  useEffect(() => {
    setTablePage((p) => Math.min(Math.max(1, p), scheduleTotalPages))
  }, [scheduleTotalPages])

  const eligibleFiltered = useMemo(() => filteredRows.filter(eligibleForSchedule), [filteredRows])

  const allEligibleSelected =
    eligibleFiltered.length > 0 && eligibleFiltered.every((e) => selectedIds.has(e.id))

  const someEligibleSelected = eligibleFiltered.some((e) => selectedIds.has(e.id))

  useEffect(() => {
    const el = headerSelectRef.current
    if (!el) return
    el.indeterminate = !allEligibleSelected && someEligibleSelected
  }, [allEligibleSelected, someEligibleSelected])

  const showSelectionColumn = slice === 'pending'

  const selectedEligibleCount = sortedHistory.filter((e) => selectedIds.has(e.id) && eligibleForSchedule(e)).length

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
    const eligible = sortedHistory.filter((e) => selectedIds.has(e.id) && eligibleForSchedule(e))
    const ids = eligible.map((e) => e.id)
    if (ids.length === 0) {
      alert('Select at least one completed endorsement that does not have a schedule yet.')
      return
    }
    setGenerating(true)
    genTimersRef.current.forEach((tid) => window.clearTimeout(tid))
    genTimersRef.current = []
    try {
      await new Promise((r) => window.setTimeout(r, 450))
      const refs = createBatchScheduleRefs(ids.length)
      const ts = new Date().toISOString()
      ids.forEach((id, i) => {
        updateEntry(id, {
          scheduleRef: refs[i],
          scheduleGeneratedAt: ts,
          schedulePdfStatus: 'generating',
          schedulePdfProgress: 0,
        })
      })
      setSelectedIds(new Set())
      onAfterGenerate?.()
      runSchedulePdfProgressDemo(ids, updateEntry, genTimersRef)

      const staggerMax = ids.length > 0 ? 140 + (ids.length - 1) * 48 : 0
      const progressMs = SCHEDULE_PDF_STEPS * SCHEDULE_PDF_STEP_MS
      const csvDelayMs = staggerMax + progressMs + 120

      genTimersRef.current.push(
        window.setTimeout(() => {
          if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
          setToast({
            message: `Invoice schedules generated for ${ids.length} endorsement(s). Download PDF or details from the table when ready.`,
          })
          toastTimerRef.current = window.setTimeout(() => setToast(null), 5200)
        }, csvDelayMs),
      )
    } finally {
      setGenerating(false)
    }
  }

  function emptyColspan() {
    return slice === 'pending' ? 6 : 9
  }

  return (
    <>
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed left-1/2 top-4 z-[120] flex max-w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/95 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-lg backdrop-blur-[2px]"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
          <span>{toast.message}</span>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="shrink-0 border-b border-gray-100 px-6 py-3"
          role="tabpanel"
          aria-labelledby={slice === 'pending' ? 'eh-v2-tab-pending' : 'eh-v2-tab-generated'}
        >
          <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
            <p className="hidden shrink-0 text-xs font-normal leading-snug text-gray-500 md:block md:max-w-[13rem] lg:max-w-xs">
              {slice === 'pending'
                ? 'Select rows to generate.'
                : 'Download PDF and endorsement details for generated schedules.'}
            </p>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <div className="relative min-w-[11rem] max-w-md flex-[1_0_14rem]">
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
              <span className="h-6 w-px shrink-0 self-center bg-gray-200" aria-hidden />
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
              {slice === 'pending' ? (
                <div className="flex shrink-0 items-center gap-2">
                  <ScheduleGenerateHoverTip>
                    <button
                      type="button"
                      disabled={generating || selectedEligibleCount === 0}
                      onClick={() => void generateForSelection()}
                      className={`${generateToolbarBtnClass} shrink-0`}
                    >
                      {generating ? (
                        <Loader2 size={18} className="shrink-0 animate-spin" aria-hidden />
                      ) : (
                        <FileStack size={18} aria-hidden />
                      )}
                      <span>{generating ? 'Generating…' : 'Generate'}</span>
                      {!generating && selectedEligibleCount > 0 ? (
                        <span className="inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold tabular-nums text-indigo-700 shadow-sm">
                          {selectedEligibleCount}
                        </span>
                      ) : null}
                    </button>
                  </ScheduleGenerateHoverTip>
                  {selectedIds.size >= 2 ? (
                    <button
                      type="button"
                      disabled={generating}
                      onClick={() => setSelectedIds(new Set())}
                      className={clearSelectionBtnClass}
                      aria-label="Clear selected rows"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [min-height:max(16rem,28dvh)]">
            <table className="w-full min-w-0 table-fixed border-collapse">
              <thead className="sticky top-0 z-[1]">
                <tr className={ENDORSEMENT_THEAD_TR_CLASS}>
                  {showSelectionColumn ? (
                    <th className="w-11 px-3 py-2.5 text-left align-middle" scope="col">
                      <input
                        ref={headerSelectRef}
                        type="checkbox"
                        checked={allEligibleSelected}
                        disabled={eligibleFiltered.length === 0}
                        onChange={toggleSelectAllEligible}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Select all eligible endorsements in view"
                      />
                    </th>
                  ) : null}
                  {slice === 'pending' ? (
                    <>
                      <EndorsementSortTh
                        columnKey="endorsementNo"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                      >
                        Endorsement no.
                      </EndorsementSortTh>
                      <EndorsementSortTh columnKey="date" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                        Date
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="activity"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                        className="min-w-0"
                      >
                        Activity
                      </EndorsementSortTh>
                      <EndorsementSortTh columnKey="entryMode" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                        Entry mode
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="doneBy"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                        className="min-w-0"
                      >
                        Done by
                      </EndorsementSortTh>
                    </>
                  ) : (
                    <>
                      <EndorsementSortTh
                        columnKey="endorsementNo"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                      >
                        Endorsement no.
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="generatedOn"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                      >
                        Generated on
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="activity"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                        className="min-w-0"
                      >
                        Activity
                      </EndorsementSortTh>
                      <EndorsementSortTh columnKey="entryMode" sortKey={scheduleSort.key} sortDir={scheduleSort.dir} onSort={handleScheduleSort}>
                        Entry mode
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="doneBy"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                        className="min-w-0"
                      >
                        Done by
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="amount"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                        align="right"
                      >
                        Amount
                      </EndorsementSortTh>
                      <EndorsementSortTh
                        columnKey="status"
                        sortKey={scheduleSort.key}
                        sortDir={scheduleSort.dir}
                        onSort={handleScheduleSort}
                        className="min-w-0"
                      >
                        Status
                      </EndorsementSortTh>
                      <th
                        scope="col"
                        className="min-w-0 px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]"
                      >
                        PDF
                      </th>
                      <th
                        scope="col"
                        className="min-w-0 px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#495057]"
                      >
                        Endorsement details
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedFilteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={emptyColspan()} className="px-4 py-14 text-center align-middle">
                      <p className="text-sm text-gray-500">No endorsements match your filters.</p>
                    </td>
                  </tr>
                ) : slice === 'pending' ? (
                  paginatedRows.map((row) => {
                    const eligible = eligibleForSchedule(row)
                    return (
                      <tr key={row.id} className="bg-amber-50/30 transition-colors hover:bg-gray-50/70">
                        <td className="px-3 py-2.5 align-middle">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(row.id)}
                            disabled={!eligible}
                            onChange={() => toggleSelected(row.id)}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Select ${endorsementNumber(row)}`}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 align-middle font-mono text-[12px] font-medium text-gray-900">
                          {endorsementNumber(row)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 align-middle text-[12px] text-gray-700">
                          {formatShortDate(row.recordedAt || row.date)}
                        </td>
                        <td className="min-w-0 px-4 py-2.5 align-middle">
                          <EndorsementActivityCell row={row} />
                        </td>
                        <td className="px-4 py-2.5 align-middle">
                          <EndorsementRunModeCell row={row} />
                        </td>
                        <td className="min-w-0 px-4 py-2.5 align-middle">
                          <EndorsementDoneByCell row={row} />
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-gray-50/70">
                      <td className="whitespace-nowrap px-4 py-2.5 align-middle font-mono text-[12px] font-medium text-gray-900">
                        {endorsementNumber(row)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 align-middle text-[12px] text-gray-700">
                        {formatShortDate(row.scheduleGeneratedAt)}
                      </td>
                      <td className="min-w-0 px-4 py-2.5 align-middle">
                        <EndorsementActivityCell row={row} />
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        <EndorsementRunModeCell row={row} />
                      </td>
                      <td className="min-w-0 px-4 py-2.5 align-middle">
                        <EndorsementDoneByCell row={row} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right align-middle text-[12px] font-semibold tabular-nums text-gray-900">
                        {formatInr(entryCdImpactInr(row))}
                      </td>
                      <td className="min-w-0 px-4 py-2.5 align-middle">
                        <ScheduleDocumentStatusCell row={row} />
                      </td>
                      <td className="min-w-0 px-4 py-2.5 align-middle">
                        <button
                          type="button"
                          disabled={!isScheduleDocumentReady(row)}
                          title={
                            isScheduleDocumentReady(row)
                              ? 'Download PDF'
                              : 'Available when document generation completes'
                          }
                          aria-label={
                            isScheduleDocumentReady(row)
                              ? 'Download PDF'
                              : 'PDF download unavailable until generation completes'
                          }
                          onClick={() => alert(`Demo: PDF download for ${row.scheduleRef}`)}
                          className={SCHEDULE_FILE_ICON_BTN}
                        >
                          <FileDown size={16} strokeWidth={2} className="shrink-0" aria-hidden />
                        </button>
                      </td>
                      <td className="min-w-0 px-4 py-2.5 align-middle">
                        <button
                          type="button"
                          disabled={!isScheduleDocumentReady(row)}
                          title={
                            isScheduleDocumentReady(row)
                              ? 'Download endorsement details (Excel)'
                              : 'Available when document generation completes'
                          }
                          aria-label={
                            isScheduleDocumentReady(row)
                              ? 'Download endorsement details as Excel'
                              : 'Excel download unavailable until generation completes'
                          }
                          onClick={() => downloadEndorsementDetailsExcel(row)}
                          className={SCHEDULE_FILE_ICON_BTN}
                        >
                          <Download size={16} strokeWidth={2} className="shrink-0" aria-hidden />
                        </button>
                      </td>
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
                className={`h-8 w-8 cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1 ${
                  page === scheduleSafePage ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
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
