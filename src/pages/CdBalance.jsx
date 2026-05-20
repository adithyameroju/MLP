import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  AlertTriangle,
  CheckCircle,
  Link2,
  Download,
  Copy,
  X,
  Banknote,
  Scale,
  Bell,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import {
  CD_CURRENT_BALANCE_RUPEES,
  CD_THRESHOLDS,
  CD_MONTHLY_BURN_RUPEES,
  CD_BALANCE_AS_OF_ISO,
  CD_BALANCE_SOURCE_LABEL,
  CD_PREMIUM_SPLIT,
  cdRunwayWeeks,
  cdRunwayMonths,
  cdRiskLevel,
  cdTransactions,
  cdDisputes,
  readCdDraftImpact,
  clearCdDraftImpact,
} from '../data/cdWalletMock'
import { formatInr, formatInrSigned } from '../lib/currencyFormat'

const MS_30_DAYS = 30 * 24 * 60 * 60 * 1000

const CD_ALERT_PREFS_STORAGE_KEY = 'mlp_cd_alert_prefs_v1'

const defaultAlertPrefs = {
  notifyOnDeduction: false,
  highUsageEnabled: false,
  highUsagePct: 85,
  monthlyDigest: false,
}

function readAlertPrefs() {
  if (typeof localStorage === 'undefined') return { ...defaultAlertPrefs }
  try {
    const raw = localStorage.getItem(CD_ALERT_PREFS_STORAGE_KEY)
    if (!raw) return { ...defaultAlertPrefs }
    const o = JSON.parse(raw)
    return {
      notifyOnDeduction: Boolean(o.notifyOnDeduction),
      highUsageEnabled: Boolean(o.highUsageEnabled),
      highUsagePct: typeof o.highUsagePct === 'number' ? Math.min(100, Math.max(50, o.highUsagePct)) : 85,
      monthlyDigest: Boolean(o.monthlyDigest),
    }
  } catch {
    return { ...defaultAlertPrefs }
  }
}

function writeAlertPrefs(prefs) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(CD_ALERT_PREFS_STORAGE_KEY, JSON.stringify(prefs))
}

function formatAsOf(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function formatDisputeDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function buildLedgerCsv(rows) {
  const header = ['date_iso', 'type', 'description', 'amount_paise', 'balance_after_paise', 'endorsement_ref', 'settlement']
  const esc = (s) => `"${String(s).replace(/"/g, '""')}"`
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.at,
        r.type,
        esc(r.description),
        r.amount,
        r.balanceAfter,
        r.endorsementRef ?? '',
        r.settlement ?? 'settled',
      ].join(','),
    ),
  ]
  return lines.join('\n')
}

function triggerDownload(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function settlementBadge(settlement) {
  if (settlement === 'pending_recon') {
    return (
      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900"
        title="Awaiting finance / billing reconciliation in this demo."
      >
        Pending recon
      </span>
    )
  }
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700" title="Posted to wallet in this demo.">
      Settled
    </span>
  )
}

function disputeStatusLabel(status) {
  if (status === 'under_review') return 'Under review'
  if (status === 'open') return 'Open'
  return status
}

export default function CdBalance() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('all')
  const [recentOnly, setRecentOnly] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [draftBanner, setDraftBanner] = useState(() => readCdDraftImpact())
  const [alertPrefs, setAlertPrefs] = useState(readAlertPrefs)
  const [prefsSavedFlash, setPrefsSavedFlash] = useState(false)

  useEffect(() => {
    setDraftBanner(readCdDraftImpact())
  }, [])

  const risk = cdRiskLevel()
  const runwayWks = cdRunwayWeeks()
  const runwayMos = cdRunwayMonths()

  const filteredTx = useMemo(() => {
    let list = cdTransactions
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter)
    if (recentOnly) {
      const cutoff = Date.now() - MS_30_DAYS
      list = list.filter((t) => {
        const tMs = new Date(t.at).getTime()
        return !Number.isNaN(tMs) && tMs >= cutoff
      })
    }
    return list
  }, [typeFilter, recentOnly])

  const typicalPremiumTotal = CD_PREMIUM_SPLIT.gmcPremiumMonthly + CD_PREMIUM_SPLIT.gpaPremiumMonthly

  const financeSummaryText = useMemo(() => {
    const lines = [
      `CD balance (demo): ${formatInr(CD_CURRENT_BALANCE_RUPEES)}`,
      `As of: ${formatAsOf(CD_BALANCE_AS_OF_ISO)}`,
      `Source: ${CD_BALANCE_SOURCE_LABEL}`,
      `Est. monthly burn: ${formatInr(CD_MONTHLY_BURN_RUPEES)}`,
      runwayWks != null && runwayMos != null
        ? `Runway (est.): ~${runwayWks} wks · ~${runwayMos} mos`
        : '',
      `Minimum: ${formatInr(CD_THRESHOLDS.minimum)} · Buffer: ${formatInr(CD_THRESHOLDS.buffer)}`,
      `Alert prefs (demo): deduction=${alertPrefs.notifyOnDeduction}, highUsage=${alertPrefs.highUsageEnabled}@${alertPrefs.highUsagePct}%, monthly=${alertPrefs.monthlyDigest}`,
    ]
    return lines.filter(Boolean).join('\n')
  }, [runwayWks, runwayMos, alertPrefs])

  const handleCopySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(financeSummaryText)
    } catch {
      // ignore
    }
  }, [financeSummaryText])

  const handleDownloadCsv = useCallback(() => {
    const csv = buildLedgerCsv(cdTransactions)
    triggerDownload(`cd-ledger-demo-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }, [])

  const dismissDraft = () => {
    clearCdDraftImpact()
    setDraftBanner(null)
  }

  const raiseDispute = () => {
    navigate('/support/feedback?preset=cd_dispute')
  }

  const persistAlertPrefs = (next) => {
    setAlertPrefs(next)
    writeAlertPrefs(next)
    setPrefsSavedFlash(true)
    window.setTimeout(() => setPrefsSavedFlash(false), 2000)
  }

  const addFundsButton = (
    <button
      type="button"
      onClick={() => setTopUpOpen(true)}
      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 cursor-pointer"
    >
      <Banknote size={18} aria-hidden />
      Add funds
    </button>
  )

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
      <PageHeader
        title="CD balance"
        subtitle="Cash deposit wallet for premiums and endorsements."
        breadcrumbs={[]}
        trailing={addFundsButton}
      />

      {topUpOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cd-topup-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <button
              type="button"
              onClick={() => setTopUpOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h2 id="cd-topup-title" className="text-lg font-bold text-gray-900 pr-8">
              Request a CD top-up
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Top-ups are coordinated with finance (NEFT / instructions from your account manager). This dialog is a
              demo — wire to your treasury workflow when ready.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTopUpOpen(false)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopUpOpen(false)
                  navigate('/add/quick')
                }}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Estimate impact in Quick Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1 — Primary metrics */}
      <section className="mt-2" aria-labelledby="cd-primary-heading">
        <h2 id="cd-primary-heading" className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Overview
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden divide-y divide-gray-100">
          {draftBanner && (
            <div className="flex flex-wrap items-start justify-between gap-3 bg-indigo-50/90 px-4 sm:px-5 py-3 text-sm text-indigo-950">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900">Draft from {draftBanner.sourceLabel}</p>
                <p className="text-xs text-gray-700 mt-1">
                  After that batch (est.): balance ≈{' '}
                  <span className="font-semibold tabular-nums">{formatInr(draftBanner.projectedBalanceAfter)}</span>
                  {draftBanner.estimatedDraw ? (
                    <>
                      {' '}
                      · draw ≈ <span className="font-semibold tabular-nums">{formatInr(draftBanner.estimatedDraw)}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <button
                type="button"
                onClick={dismissDraft}
                className="shrink-0 rounded-lg p-1 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                aria-label="Dismiss draft notice"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="p-4 sm:p-6 space-y-6">
            {/* Hero: CD balance */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                <Wallet size={14} className="text-indigo-500" aria-hidden />
                Current CD balance
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-gray-900 tabular-nums tracking-tight leading-none">
                {formatInr(CD_CURRENT_BALANCE_RUPEES)}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                As of <span className="font-semibold text-gray-800">{formatAsOf(CD_BALANCE_AS_OF_ISO)}</span>
                <span className="text-gray-400"> · </span>
                {CD_BALANCE_SOURCE_LABEL}
              </p>
              <p className="mt-2 text-xs text-gray-500 max-w-2xl leading-relaxed">
                Ledger total after the latest posted movements (demo). Rounding in rupees; GST lines may differ from
                endorsement preview totals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Consumption (est.)</p>
                <div className="flex items-baseline justify-between gap-3 border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-600">Est. monthly burn</span>
                  <span className="text-2xl font-bold text-gray-900 tabular-nums">{formatInr(CD_MONTHLY_BURN_RUPEES)}</span>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{CD_PREMIUM_SPLIT.periodLabel}</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  <li className="flex justify-between gap-3">
                    <span className="text-gray-600">GMC (medical)</span>
                    <span className="font-semibold tabular-nums text-gray-900">{formatInr(CD_PREMIUM_SPLIT.gmcPremiumMonthly)}</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span className="text-gray-600">GPA</span>
                    <span className="font-semibold tabular-nums text-gray-900">{formatInr(CD_PREMIUM_SPLIT.gpaPremiumMonthly)}</span>
                  </li>
                  <li className="flex justify-between gap-3 pt-2 border-t border-gray-100 font-bold text-gray-900">
                    <span>Typical monthly premium</span>
                    <span className="tabular-nums">{formatInr(typicalPremiumTotal)}</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => navigate('/policy-management/coverage')}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Policy coverage
                </button>
              </div>
              <div className="lg:border-l lg:border-gray-100 lg:pl-8 space-y-3">
                <div className="rounded-lg border border-gray-100 bg-gray-50/90 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Runway (est.)</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {runwayWks != null && runwayMos != null ? (
                      <span className="tabular-nums" title="Weeks ≈ 4.33 per month; months = floor(balance ÷ burn).">
                        ~{runwayWks} wks · ~{runwayMos} mos
                      </span>
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50/90 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Risk vs thresholds</p>
                  <p
                    className={`text-xl font-bold mt-1 ${
                      risk === 'critical' ? 'text-red-700' : risk === 'warning' ? 'text-amber-800' : 'text-emerald-700'
                    }`}
                  >
                    {risk === 'critical' ? 'Critical' : risk === 'warning' ? 'Elevated' : 'Safe'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Min {formatInr(CD_THRESHOLDS.minimum)} · Buffer {formatInr(CD_THRESHOLDS.buffer)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl border px-4 py-3 flex flex-wrap items-start gap-3 ${
                risk === 'critical'
                  ? 'border-red-200 bg-red-50/90'
                  : risk === 'warning'
                    ? 'border-amber-200 bg-amber-50/90'
                    : 'border-emerald-200 bg-emerald-50/80'
              }`}
            >
              {risk === 'critical' ? (
                <AlertTriangle className="shrink-0 text-red-600 mt-0.5" size={20} aria-hidden />
              ) : risk === 'warning' ? (
                <AlertTriangle className="shrink-0 text-amber-600 mt-0.5" size={20} aria-hidden />
              ) : (
                <CheckCircle className="shrink-0 text-emerald-600 mt-0.5" size={20} aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">
                  {risk === 'critical'
                    ? 'Balance below minimum threshold'
                    : risk === 'warning'
                      ? 'Below buffer — monitor usage and endorsements'
                      : 'CD position is healthy'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Endorsements may be blocked if premium exceeds available CD (
                  <button
                    type="button"
                    onClick={() => navigate('/add/quick')}
                    className="font-semibold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Quick Add
                  </button>{' '}
                  checks this before submit).
                </p>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-gray-900 inline-flex items-center gap-2">
                  <Scale size={16} className="text-gray-500" aria-hidden />
                  Disputes
                </h3>
                <button
                  type="button"
                  onClick={raiseDispute}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100/90 cursor-pointer"
                >
                  Raise a dispute
                </button>
              </div>
              {cdDisputes.length === 0 ? (
                <p className="text-sm text-gray-500 rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-3 py-3">
                  No open disputes on this wallet.
                </p>
              ) : (
                <ul className="rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {cdDisputes.map((d) => (
                    <li key={d.id} className="px-3 py-3 flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{d.summary}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Opened {formatDisputeDate(d.openedAt)}
                          {d.relatedRef ? (
                            <>
                              {' '}
                              · <span className="font-mono text-gray-700">{d.relatedRef}</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-sm font-bold tabular-nums text-gray-900">{formatInr(d.amount)}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          {disputeStatusLabel(d.status)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <h3 className="text-sm font-bold text-gray-900 inline-flex items-center gap-2 mb-1">
                <Bell size={16} className="text-indigo-600" aria-hidden />
                Alert preferences
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Demo only — choices are saved in this browser. Production would send email or in-app notifications.
              </p>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-800">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-gray-300 accent-indigo-600"
                    checked={alertPrefs.notifyOnDeduction}
                    onChange={(e) => persistAlertPrefs({ ...alertPrefs, notifyOnDeduction: e.target.checked })}
                  />
                  <span>
                    <span className="font-medium">Notify on balance reduction</span>
                    <span className="block text-xs text-gray-500 mt-0.5">When any deduction posts to the CD wallet.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-800">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-gray-300 accent-indigo-600"
                    checked={alertPrefs.highUsageEnabled}
                    onChange={(e) => persistAlertPrefs({ ...alertPrefs, highUsageEnabled: e.target.checked })}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">High usage vs typical premium</span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Alert when estimated monthly burn exceeds{' '}
                      <input
                        type="number"
                        min={50}
                        max={100}
                        value={alertPrefs.highUsagePct}
                        disabled={!alertPrefs.highUsageEnabled}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          persistAlertPrefs({
                            ...alertPrefs,
                            highUsagePct: Number.isFinite(v) ? Math.min(100, Math.max(50, v)) : alertPrefs.highUsagePct,
                          })
                        }}
                        className="mx-0.5 w-14 rounded border border-gray-200 px-1 py-0.5 text-xs text-center disabled:opacity-50"
                      />
                      % of typical monthly premium ({formatInr(typicalPremiumTotal)}).
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-800">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-gray-300 accent-indigo-600"
                    checked={alertPrefs.monthlyDigest}
                    onChange={(e) => persistAlertPrefs({ ...alertPrefs, monthlyDigest: e.target.checked })}
                  />
                  <span>
                    <span className="font-medium">Monthly digest</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Summary of balance, burn, and largest movements.</span>
                  </span>
                </label>
              </div>
              {prefsSavedFlash ? (
                <p className="mt-3 text-xs font-medium text-emerald-700" role="status">
                  Preferences saved in this browser (demo).
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Activity log */}
      <section className="mt-8 mb-2" aria-labelledby="cd-logs-heading">
        <h2 id="cd-logs-heading" className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Activity log
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col min-h-[220px]">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900">Ledger</h3>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recentOnly}
                  onChange={(e) => setRecentOnly(e.target.checked)}
                  className="rounded border-gray-300 accent-indigo-600"
                />
                Last 30 days
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
              >
                <option value="all">All types</option>
                <option value="deposit">Deposits</option>
                <option value="deduction">Deductions</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-2.5">Date &amp; time</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-right" title="Wallet balance immediately after this line posts.">
                    Balance after
                  </th>
                  <th className="px-4 py-2.5">Settlement</th>
                  <th className="px-4 py-2.5">Endorsement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTx.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      No rows match these filters.
                    </td>
                  </tr>
                ) : (
                  filteredTx.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap text-xs">
                        {new Date(row.at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            row.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-800 max-w-[220px]">{row.description}</td>
                      <td className="px-4 py-2.5 text-right font-medium tabular-nums text-gray-900">
                        {formatInrSigned(row.amount)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">{formatInr(row.balanceAfter)}</td>
                      <td className="px-4 py-2.5">{settlementBadge(row.settlement)}</td>
                      <td className="px-4 py-2.5">
                        {row.endorsementRef ? (
                          <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                          >
                            <Link2 size={12} aria-hidden /> {row.endorsementRef}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-gray-500">Demo export — no server call.</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:border-indigo-200 hover:bg-indigo-50/40 cursor-pointer"
              >
                <Download size={14} aria-hidden /> Download CSV
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:border-indigo-200 hover:bg-indigo-50/40 cursor-pointer"
              >
                <Copy size={14} aria-hidden /> Copy summary for finance
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-gray-400">
          Production: source system IDs, immutable audit trail, and server-driven alert delivery.
        </p>
      </section>
    </div>
  )
}
