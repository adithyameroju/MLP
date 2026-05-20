import { CheckCircle2, Download, FileDown, Loader2 } from 'lucide-react'
import {
  historyRowResultCsvSummary,
  formatDoneBySummary,
  deriveRunModeLabel,
  deriveActionCategory,
} from './endorsementLogTableCells'

export const SCHEDULE_PER_PAGE = 10

export const TYPE_OPTIONS = [
  { id: 'all', label: 'All types' },
  { id: 'quick', label: 'Quick' },
  { id: 'bulk', label: 'Bulk' },
  { id: 'sync', label: 'HRMS sync' },
  { id: 'enrollment', label: 'App enrolment' },
]

export const HISTORY_DOWNLOAD_ICON_BTN =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-0 shadow-none bg-[#f3f4f6] text-[#4b5563] hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/40 focus-visible:ring-offset-1'

export const SCHEDULE_FILE_ICON_BTN = `${HISTORY_DOWNLOAD_ICON_BTN} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#f3f4f6] disabled:hover:text-[#4b5563]`

export const FILTER_SELECT_CLASS =
  'min-h-[2.25rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

export function escapeCsvCell(v) {
  const s = String(v ?? '')
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadCsv(filename, headerRow, dataRows) {
  const lines = [
    headerRow.map(escapeCsvCell).join(','),
    ...dataRows.map((row) => row.map(escapeCsvCell).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function escapeHtmlCell(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function downloadExcelHtmlTable(filename, headerRow, dataRows) {
  const headerTr = `<tr>${headerRow.map((h) => `<th>${escapeHtmlCell(h)}</th>`).join('')}</tr>`
  const bodyTrs = dataRows
    .map((row) => `<tr>${row.map((c) => `<td>${escapeHtmlCell(c)}</td>`).join('')}</tr>`)
    .join('')
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">${headerTr}${bodyTrs}</table></body></html>`
  const blob = new Blob([`\ufeff${html}`], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function endorsementDetailsExcelHeaders() {
  return [
    'endorsement_no',
    'internal_id',
    'schedule_reference',
    'schedule_generated_at_iso',
    'recorded_at_iso',
    'calendar_date',
    'endorsement_status',
    'run_type',
    'action_category',
    'activity',
    'activity_detail',
    'entry_mode',
    'done_by',
    'member_count',
    'success_count',
    'failed_count',
    'amount_inr_estimate',
    'premium_total_incl_gst',
    'premium_breakdown_json',
    'result_summary',
    'document_generation_status',
    'raw_payload_json',
  ]
}

export function serializeEndorsementRawPayload(row) {
  try {
    const payload = {
      details: row.details ?? null,
      changeSummary: row.changeSummary ?? null,
      premiumSummary: row.premiumSummary ?? null,
    }
    if (!payload.details && !payload.changeSummary && !payload.premiumSummary) return ''
    return JSON.stringify(payload)
  } catch {
    return ''
  }
}

export function endorsementNumber(row) {
  return `ENDOR-${row.id}`
}

export function endorsementDetailsExcelRow(row) {
  const ps = row.premiumSummary
  const premiumTotal = typeof ps?.totalInclGst === 'number' && Number.isFinite(ps.totalInclGst) ? String(ps.totalInclGst) : ''
  const premiumLines = Array.isArray(ps?.lines) ? JSON.stringify(ps.lines) : ''
  return [
    endorsementNumber(row),
    String(row.id),
    row.scheduleRef ?? '',
    row.scheduleGeneratedAt ?? '',
    row.recordedAt ?? '',
    row.date ?? '',
    row.status ?? '',
    row.type ?? '',
    row.actionCategory ?? deriveActionCategory(row.action),
    row.action ?? '',
    row.activityDetail ?? '',
    deriveRunModeLabel(row),
    formatDoneBySummary(row),
    String(row.count ?? ''),
    row.successCount != null ? String(row.successCount) : '',
    row.failedCount != null ? String(row.failedCount) : '',
    String(entryCdImpactInr(row)),
    premiumTotal,
    premiumLines,
    historyRowResultCsvSummary(row),
    row.schedulePdfStatus ?? '',
    serializeEndorsementRawPayload(row),
  ]
}

export function downloadEndorsementDetailsExcel(row) {
  downloadExcelHtmlTable(
    `endorsement-details-${endorsementNumber(row)}.xls`,
    endorsementDetailsExcelHeaders(),
    [endorsementDetailsExcelRow(row)],
  )
}

export function formatShortDate(iso) {
  if (!iso) return '—'
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

export function entryCdImpactInr(entry) {
  const direct = entry.premiumSummary?.totalInclGst
  if (typeof direct === 'number' && Number.isFinite(direct) && direct > 0) return direct
  return Math.round(Number(entry.count) || 0) * 12500
}

export function createBatchScheduleRefs(count) {
  const batch = Date.now()
  return Array.from({ length: count }, (_, i) => `SCH-BATCH-${batch}-${i + 1}`)
}

export function eligibleForSchedule(e) {
  return e.status === 'Success' && !e.scheduleRef
}

/** Calendar `entry.date` (YYYY-MM-DD) must fall within range when bounds are set */
export function entryMatchesDateRange(entry, dateFrom, dateTo) {
  const d = entry.date
  if (dateFrom && (!d || d < dateFrom)) return false
  if (dateTo && (!d || d > dateTo)) return false
  return true
}

export function rowMatchesSearch(entry, q) {
  if (!q.trim()) return true
  const s = q.trim().toLowerCase()
  const cat = entry.actionCategory ?? deriveActionCategory(entry.action)
  const mode = deriveRunModeLabel(entry)
  const doneByLine = formatDoneBySummary(entry)
  const blob = [
    entry.action,
    entry.activityDetail,
    entry.doneBy,
    cat,
    mode,
    doneByLine,
    entry.status,
    entry.type,
    entry.scheduleRef,
    String(entry.count),
    endorsementNumber(entry),
    formatShortDate(entry.recordedAt || entry.date),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(s)
}

/** Shared `<thead>` row styling for endorsement history + schedule tables */
export const ENDORSEMENT_THEAD_TR_CLASS = 'border-b border-gray-200 bg-[#f1f3f5]'

export function scheduleRowRecordedSortKey(row) {
  return String(row.recordedAt || row.date || '')
}

export function scheduleRowGeneratedSortKey(row) {
  return String(row.scheduleGeneratedAt || '')
}

export function compareScheduleRowsPending(a, b, sortKey, sortDir) {
  const m = sortDir === 'asc' ? 1 : -1
  switch (sortKey) {
    case 'endorsementNo':
      return m * (Number(a.id) - Number(b.id))
    case 'date':
      return m * scheduleRowRecordedSortKey(a).localeCompare(scheduleRowRecordedSortKey(b))
    case 'activity':
      return m * String(a.action || '').localeCompare(String(b.action || ''))
    case 'entryMode':
      return m * deriveRunModeLabel(a).localeCompare(deriveRunModeLabel(b))
    case 'doneBy':
      return m * formatDoneBySummary(a).localeCompare(formatDoneBySummary(b))
    default:
      return 0
  }
}

export function compareScheduleRowsGenerated(a, b, sortKey, sortDir) {
  const m = sortDir === 'asc' ? 1 : -1
  switch (sortKey) {
    case 'endorsementNo':
      return m * (Number(a.id) - Number(b.id))
    case 'generatedOn':
      return m * scheduleRowGeneratedSortKey(a).localeCompare(scheduleRowGeneratedSortKey(b))
    case 'activity':
      return m * String(a.action || '').localeCompare(String(b.action || ''))
    case 'entryMode':
      return m * deriveRunModeLabel(a).localeCompare(deriveRunModeLabel(b))
    case 'doneBy':
      return m * formatDoneBySummary(a).localeCompare(formatDoneBySummary(b))
    case 'amount':
      return m * (entryCdImpactInr(a) - entryCdImpactInr(b))
    case 'status':
      return m * String(a.schedulePdfStatus || '').localeCompare(String(b.schedulePdfStatus || ''))
    default:
      return 0
  }
}

export const SCHEDULE_PDF_STEPS = 22
export const SCHEDULE_PDF_STEP_MS = 85

export function isScheduleDocumentReady(row) {
  if (!row.scheduleRef || row.status !== 'Success') return false
  if (row.schedulePdfStatus === 'generating') return false
  return row.schedulePdfStatus === 'ready' || row.schedulePdfStatus == null
}

export function ScheduleDocumentStatusCell({ row }) {
  const ready = isScheduleDocumentReady(row)
  const generating = row.schedulePdfStatus === 'generating'
  const pct = typeof row.schedulePdfProgress === 'number' ? row.schedulePdfProgress : generating ? 0 : 100
  const pillBase = 'inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium'

  if (generating) {
    return (
      <span
        className={`${pillBase} bg-indigo-50 text-indigo-700`}
        role="status"
        aria-live="polite"
        aria-label={`Generating document, ${pct} percent`}
      >
        <Loader2 size={12} className="shrink-0 animate-spin text-indigo-600" aria-hidden />
        <span className="truncate">Generating</span>
        <span className="tabular-nums text-indigo-600/90">{pct}%</span>
      </span>
    )
  }
  if (ready) {
    return (
      <span className={`${pillBase} bg-emerald-50 text-emerald-700`}>
        <CheckCircle2 size={12} className="shrink-0" aria-hidden />
        <span className="truncate">Success</span>
      </span>
    )
  }
  return <span className="text-[12px] text-gray-400">—</span>
}

export function runSchedulePdfProgressDemo(ids, updateEntry, timersRef) {
  ids.forEach((id, idx) => {
    let step = 0
    const tick = () => {
      step += 1
      const pct = Math.min(100, Math.round((step / SCHEDULE_PDF_STEPS) * 100))
      if (step < SCHEDULE_PDF_STEPS) {
        updateEntry(id, { schedulePdfProgress: pct })
        timersRef.current.push(window.setTimeout(tick, SCHEDULE_PDF_STEP_MS))
      } else {
        updateEntry(id, { schedulePdfStatus: 'ready', schedulePdfProgress: 100 })
      }
    }
    timersRef.current.push(window.setTimeout(tick, 140 + idx * 48))
  })
}
