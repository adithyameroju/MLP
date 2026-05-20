/**
 * ACKO Employer Portal — CD Balance (straightforward: balance, burn rate, history log).
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Banknote,
  Download,
  Settings2,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bell,
  Scale,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pencil,
} from 'lucide-react'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { CD_BALANCE_AS_OF_ISO, CD_MONTHLY_BURN_RUPEES, CD_PREMIUM_SPLIT, CD_THRESHOLDS } from '../data/cdWalletMock'

// —— Types ——————————————————————————————————————————————————————————

type TxType = 'deduction' | 'deposit' | 'refund'
type TxStatus = 'settled' | 'pending_recon'

type TransactionRow = {
  id: string
  at: string
  type: TxType
  description: string
  amount: number
  balanceAfter: number
  status: TxStatus
  referenceId: string | null
  settlementNote?: string
}

type DisputeRecord = {
  id: string
  linkedRef: string
  createdAt: string
  status: string
}

type MainTab = 'history' | 'disputes' | 'alerts'

type DisputeScope = 'transaction' | 'period' | 'general'

// —— Utils ——————————————————————————————————————————————————————————

function formatInr(amount: number, signed = false): string {
  const abs = Math.abs(amount)
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(abs)
  if (!signed) return formatted
  if (amount > 0) return `+${formatted}`
  if (amount < 0) return `-${formatted.replace('₹', '₹')}` // format already has ₹
  return formatted
}

function formatInrSigned(amount: number): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      signDisplay: 'exceptZero',
    }).format(amount)
  } catch {
    const core = formatInr(Math.abs(amount), false)
    if (amount === 0) return core
    return amount < 0 ? `-${core}` : `+${core}`
  }
}

function formatDateTime(iso: string): string {
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

function formatAsOfDisplay(iso: string): string {
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

type DateRangePreset = '30d' | '90d' | 'ytd'

function transactionInDateRange(iso: string, range: DateRangePreset): boolean {
  const t = new Date(iso)
  if (Number.isNaN(t.getTime())) return true
  const now = new Date()
  if (range === '30d') {
    const start = new Date(now)
    start.setDate(start.getDate() - 30)
    start.setHours(0, 0, 0, 0)
    return t >= start
  }
  if (range === '90d') {
    const start = new Date(now)
    start.setDate(start.getDate() - 90)
    start.setHours(0, 0, 0, 0)
    return t >= start
  }
  if (range === 'ytd') {
    const start = new Date(now.getFullYear(), 0, 1)
    start.setHours(0, 0, 0, 0)
    return t >= start
  }
  return true
}

/** Shared typography for the three CD metric cards */
const W_LABEL = 'text-[10px] font-semibold uppercase tracking-wide text-gray-500'
const W_VALUE = 'text-3xl font-bold tabular-nums tracking-tight text-gray-900'
const W_SUB = 'text-sm text-gray-600'
const W_BAR_H = 'h-2 w-full overflow-hidden rounded-full bg-gray-100'
const W_CAP = 'text-xs text-gray-500'

// —— Mock data ———————————————————————————————————————————————————————

const MOCK_TOTAL_TX = 450

const MOCK_METRICS = {
  balance: 48_50_000,
  monthlyBurn: CD_MONTHLY_BURN_RUPEES,
  runwayMonthsLabel: '~4 months',
  pendingReconAmount: 36_000,
  pendingReconCount: 2,
  totalTransactions: MOCK_TOTAL_TX,
}

const LEDGER_TEMPLATES: { type: TxType; desc: string; ref: (i: number) => string | null }[] = [
  { type: 'deduction', desc: 'Premium settlement — monthly cycle', ref: (i) => `END-${2024 + (i % 4)}` },
  { type: 'deduction', desc: 'Endorsement — Quick Add (employees)', ref: (i) => `QA-${8800 + (i * 17) % 999}` },
  { type: 'deposit', desc: 'Wallet top-up — NEFT / RTGS', ref: () => null },
  { type: 'deduction', desc: 'Endorsement — Bulk upload (add / update)', ref: (i) => `BU-${4400 + i}` },
  { type: 'refund', desc: 'Employee exit refund (pro-rata)', ref: (i) => `RF-${8200 + i}` },
  { type: 'deduction', desc: 'GMC adjustment — dependent add', ref: (i) => `GMC-A${i}` },
  { type: 'deduction', desc: 'GPA premium debit — batch', ref: (i) => `GPA-${9100 + i}` },
  { type: 'deposit', desc: 'Interest credit — CD wallet (demo)', ref: () => 'INT-CRED' },
  { type: 'refund', desc: 'Member downgrade — premium difference', ref: (i) => `DN-${i}` },
  { type: 'deduction', desc: 'Life event — newborn cover (add)', ref: (i) => `LE-NB-${i}` },
  { type: 'deduction', desc: 'Mid-term correction — salary revision', ref: (i) => `MTC-${i}` },
  { type: 'deduction', desc: 'COI / TPA fee settlement', ref: (i) => `TPA-${i}` },
  { type: 'deduction', desc: 'Brokerage & charges — net off', ref: (i) => `BRK-${i}` },
  { type: 'refund', desc: 'Duplicate debit reversal', ref: (i) => `REV-${i}` },
  { type: 'deposit', desc: 'Treasury funding — corporate transfer', ref: () => 'TRF-IN' },
]

function buildTransactionDataset(): TransactionRow[] {
  const rows: TransactionRow[] = []
  const typesRot: TxType[] = ['deduction', 'deposit', 'deduction', 'refund']
  const statusesRot: TxStatus[] = ['settled', 'settled', 'settled', 'pending_recon']
  let running = 62_00_000

  for (let i = 0; i < MOCK_TOTAL_TX; i++) {
    const dayOff = Math.floor(i * 1.35)
    const at = new Date(2025, 8, 5)
    at.setHours(9 + (i % 8), 10 + (i % 40), 0, 0)
    at.setDate(at.getDate() + dayOff)

    const tmpl = LEDGER_TEMPLATES[i % LEDGER_TEMPLATES.length]
    const type = i < 12 ? tmpl.type : typesRot[i % typesRot.length]
    const isDep = type === 'deposit'
    const isRef = type === 'refund'
    const magnitude = 12_000 + (i % 17) * 8_100 + (i % 5) * 13_000
    const amount = isDep ? Math.min(28_00_000, 3_00_000 + magnitude) : isRef ? 8_000 + (i % 9) * 2_200 : -Math.min(14_00_000, 18_000 + magnitude)

    running += amount
    const status: TxStatus = i % 23 === 0 ? 'pending_recon' : statusesRot[i % statusesRot.length]

    const desc = i < 12 ? tmpl.desc : `${LEDGER_TEMPLATES[i % LEDGER_TEMPLATES.length].desc} (#${1000 + i})`
    const referenceId = i < 12 ? tmpl.ref(i) : `REF-${2024 + (i % 400)}-${(i % 90) + 10}`

    rows.push({
      id: `t-${i + 1}`,
      at: at.toISOString(),
      type,
      description: desc,
      amount,
      balanceAfter: Math.max(35_00_000, running - (i % 3) * 2_000),
      status,
      referenceId,
      settlementNote: status === 'pending_recon' ? 'Awaiting confirmation (demo).' : undefined,
    })
  }

  rows.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  return rows
}

const ALL_TRANSACTIONS = buildTransactionDataset()

const INITIAL_MOCK_DISPUTES: DisputeRecord[] = [
  { id: 'DSP-901', linkedRef: 'QA-9921', createdAt: '2026-03-22', status: 'Under review' },
  { id: 'DSP-884', linkedRef: 'BU-4410', createdAt: '2026-03-11', status: 'Awaiting documents' },
]

// —— Badges ——————————————————————————————————————————————————————————

/** Same visual language as `HistoryStatusMetadata` in EndorsementHistory (rounded-full, text-xs, tinted fill). */
function TypeBadge({ type }: { type: TxType }) {
  const map: Record<TxType, string> = {
    deduction: 'bg-rose-50 text-rose-800',
    deposit: 'bg-emerald-50 text-emerald-700',
    refund: 'bg-sky-50 text-sky-800',
  }
  const label = type.charAt(0).toUpperCase() + type.slice(1)
  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[type]}`}
    >
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: TxStatus }) {
  const settled = status === 'settled'
  const base = 'inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium'
  if (settled) {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden />
        <span className="truncate">Settled</span>
      </span>
    )
  }
  return (
    <span className={`${base} bg-amber-50 text-amber-800`}>
      <Clock className="h-3 w-3 shrink-0 text-amber-700" aria-hidden />
      <span className="truncate">Pending recon</span>
    </span>
  )
}

function CdBalancePrimaryCard({ balance }: { balance: number }) {
  const policyFloor = CD_THRESHOLDS.minimum + CD_THRESHOLDS.buffer
  const remainingBalance = Math.max(0, balance - policyFloor)
  const remainingPct = balance > 0 ? Math.min(100, (remainingBalance / balance) * 100) : 0

  return (
    <section
      aria-label="CD balance"
      className="flex h-full min-h-[15rem] flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm sm:p-5"
    >
      <p className={W_LABEL}>CD balance</p>
      <p className={`mt-1 ${W_VALUE}`}>{formatInr(balance, false)}</p>
      <p className={`${W_SUB} mt-1`}>
        As of <span className="font-semibold text-gray-900">{formatAsOfDisplay(CD_BALANCE_AS_OF_ISO)}</span>
      </p>
      <div className="min-h-[0.5rem] flex-1" aria-hidden />
      <div className="mt-auto" aria-label="Remaining balance after minimum and buffer">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-600">
          <span>Remaining after min + buffer</span>
          <span className="tabular-nums text-gray-900">{formatInr(remainingBalance, false)}</span>
        </div>
        <div className={W_BAR_H}>
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width]"
            style={{ width: `${remainingPct}%` }}
            title="Remaining as share of current balance (above min + buffer)"
          />
        </div>
        <p className={`mt-1.5 ${W_CAP}`}>Share of balance above policy floor (illustrative)</p>
      </div>
    </section>
  )
}

function CdBurnRunwayCard({
  monthlyBurn,
  balance,
  runwayLabel,
}: {
  monthlyBurn: number
  balance: number
  runwayLabel: string
}) {
  const burnShareOfBalance = balance > 0 ? (monthlyBurn / balance) * 100 : 0
  const monthsMatch = runwayLabel.match(/(\d+(?:\.\d+)?)/)
  const runwayMonths = monthsMatch ? Math.min(12, Math.max(0, parseFloat(monthsMatch[1]))) : 4
  const runwayBarPct = Math.min(100, (runwayMonths / 12) * 100)

  return (
    <section
      aria-label="Burn rate"
      className="flex h-full min-h-[15rem] flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm sm:p-5"
    >
      <p className={W_LABEL}>Est. monthly burn</p>
      <p className={`mt-1 ${W_VALUE}`}>{formatInr(monthlyBurn, false)}</p>
      <p className={`${W_SUB} mt-1`}>~{burnShareOfBalance.toFixed(0)}% of current balance per month (demo)</p>
      <div className="min-h-[0.5rem] flex-1" aria-hidden />
      <div className="mt-auto">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-600">
          <span>Runway vs 12 mo. reference</span>
          <span className="tabular-nums text-gray-900">{runwayLabel}</span>
        </div>
        <div className={W_BAR_H}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            style={{ width: `${runwayBarPct}%` }}
            title={`~${runwayMonths} months of cover (illustrative)`}
          />
        </div>
        <p className={`mt-1.5 ${W_CAP}`}>
          ~{runwayMonths} months of cover at current burn (illustrative)
        </p>
      </div>
    </section>
  )
}

function CdPremiumSplitDonut({ balance }: { balance: number }) {
  const gmcRatio = CD_PREMIUM_SPLIT.gmcPremiumMonthly
  const gpaRatio = CD_PREMIUM_SPLIT.gpaPremiumMonthly
  const ratioTotal = gmcRatio + gpaRatio || 1
  const gmcPct = (gmcRatio / ratioTotal) * 100
  const gpaPct = (gpaRatio / ratioTotal) * 100
  const gmcFromBalance = (balance * gmcRatio) / ratioTotal
  const gpaFromBalance = (balance * gpaRatio) / ratioTotal

  return (
    <section
      aria-label="GMC versus GPA apportionment of current CD balance"
      className="flex h-full min-h-[15rem] flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm sm:p-5"
    >
      <p className={W_LABEL}>GMC vs GPA (current CD)</p>
      <p className={`${W_SUB} mt-1`}>
        {formatInr(gmcFromBalance + gpaFromBalance, false)} total apportioned
      </p>

      <div className="mt-3 flex min-h-0 flex-1 flex-row items-stretch justify-between gap-3">
        <ul className="min-w-0 flex-1 space-y-2 text-sm text-gray-700">
          <li className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-violet-600" aria-hidden />
              GMC
            </span>
            <span className="font-semibold tabular-nums text-gray-900">
              {gmcPct.toFixed(0)}% · {formatInr(gmcFromBalance, false)}
            </span>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-600" aria-hidden />
              GPA
            </span>
            <span className="font-semibold tabular-nums text-gray-900">
              {gpaPct.toFixed(0)}% · {formatInr(gpaFromBalance, false)}
            </span>
          </li>
        </ul>
        <div
          className="relative h-24 w-24 shrink-0 self-center sm:h-28 sm:w-28"
          role="img"
          aria-label={`GMC ${gmcPct.toFixed(0)} percent, GPA ${gpaPct.toFixed(0)} percent of balance`}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#7c3aed 0% ${gmcPct}%, #0891b2 ${gmcPct}% 100%)`,
            }}
          />
          <div className="absolute inset-[22%] rounded-full bg-white shadow-inner" />
        </div>
      </div>
      <div className="min-h-[0.25rem] flex-1" aria-hidden />
      <div className="mt-auto">
        <div className="flex w-full overflow-hidden rounded-full bg-gray-100" style={{ height: '0.5rem' }}>
          <div className="h-full bg-violet-500" style={{ width: `${gmcPct}%` }} title="GMC share" />
          <div className="h-full bg-cyan-500" style={{ width: `${gpaPct}%` }} title="GPA share" />
        </div>
        <p className={`mt-1.5 ${W_CAP}`}>GMC and GPA share of current balance (illustrative)</p>
      </div>
    </section>
  )
}

// —— Page header ——————————————————————————————————————————————————————

function CdPageHeader({
  onAddFunds,
  onDownloadStatement,
  onOpenConfigure,
}: {
  onAddFunds: () => void
  onDownloadStatement: () => void
  onOpenConfigure: () => void
}) {
  return (
    <header className="mb-3 flex shrink-0 flex-col gap-4 text-left sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900">CD Balance</h1>
        <p className="mt-1 text-sm text-gray-500">Cash deposit wallet for premiums and endorsements</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:ml-auto">
        <button
          type="button"
          onClick={onAddFunds}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Banknote className="h-4 w-4 shrink-0" aria-hidden />
          Add funds
        </button>
        <button
          type="button"
          onClick={onDownloadStatement}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100"
        >
          <Download className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
          Download statement
        </button>
        <button
          type="button"
          onClick={onOpenConfigure}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          aria-label="Open configure menu"
        >
          <Settings2 className="h-4 w-4 shrink-0" aria-hidden />
        </button>
      </div>
    </header>
  )
}

// —— Drawer shell ——————————————————————————————————————————————————————

function DrawerShell({
  open,
  title,
  onClose,
  children,
  widthClass = 'max-w-md',
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  widthClass?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close drawer" onClick={onClose} />
      <div
        className={`relative flex h-full w-full ${widthClass} flex-col border-l border-gray-200 bg-white shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 id="drawer-title" className="text-sm font-bold text-gray-900">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  )
}

function ModalShell({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 id="modal-title" className="text-sm font-bold text-gray-900">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[min(80vh,520px)] overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  )
}

function ConfigureModal({
  open,
  onClose,
  onOpenAlertsTab,
  onOpenDisputesTab,
  onHelp,
}: {
  open: boolean
  onClose: () => void
  onOpenAlertsTab: () => void
  onOpenDisputesTab: () => void
  onHelp: () => void
}) {
  const Row = ({
    icon: Icon,
    label,
    hint,
    onClick,
  }: {
    icon: typeof Bell
    label: string
    hint: string
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={() => {
        onClick()
        onClose()
      }}
      className="flex w-full items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3 text-left transition-colors hover:border-gray-200 hover:bg-gray-50"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-900">{label}</span>
        <span className="mt-0.5 block text-xs leading-snug text-gray-500">{hint}</span>
      </span>
    </button>
  )

  return (
    <ModalShell open={open} title="Configure" onClose={onClose}>
      <p className="text-sm text-gray-600">Alerts, disputes, and help for your CD wallet.</p>
      <div className="mt-4 flex flex-col gap-2">
        <Row
          icon={Bell}
          label="Alerts"
          hint="Notification preferences and subscription status."
          onClick={onOpenAlertsTab}
        />
        <Row
          icon={Scale}
          label="Disputes"
          hint="Review or raise reconciliation issues."
          onClick={onOpenDisputesTab}
        />
        <div className="my-1 border-t border-gray-100" />
        <Row
          icon={HelpCircle}
          label="Help & resources"
          hint="Guides and support from the help center."
          onClick={onHelp}
        />
      </div>
    </ModalShell>
  )
}

// —— Row overflow menu ——————————————————————————————————————————————————

function RowActionsMenu({
  open,
  anchorEl,
  onClose,
  onViewDetails,
  onRaiseDispute,
  onCopyRef,
  referenceId,
}: {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  onViewDetails: () => void
  onRaiseDispute: () => void
  onCopyRef: () => void
  referenceId: string | null
}) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      if (anchorEl?.contains(t)) return
      onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose, anchorEl])

  if (!open || !anchorEl) return null
  const rect = anchorEl.getBoundingClientRect()
  const top = rect.bottom + 4
  const left = Math.min(rect.left, window.innerWidth - 200)

  return (
    <div
      ref={menuRef}
      className="fixed z-40 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      style={{ top, left }}
      role="menu"
    >
      <button
        type="button"
        className="flex w-full px-3 py-2 text-left text-xs font-medium text-gray-800 hover:bg-gray-50"
        onClick={() => {
          onViewDetails()
          onClose()
        }}
      >
        View details
      </button>
      <button
        type="button"
        className="flex w-full px-3 py-2 text-left text-xs font-medium text-gray-800 hover:bg-gray-50"
        onClick={() => {
          onRaiseDispute()
          onClose()
        }}
      >
        Raise dispute
      </button>
      <button
        type="button"
        disabled={!referenceId}
        className="flex w-full px-3 py-2 text-left text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => {
          if (referenceId) onCopyRef()
          onClose()
        }}
      >
        Copy reference ID
      </button>
    </div>
  )
}

function CdAlertsPreferencesForm({
  alertLowBalance,
  setAlertLowBalance,
  alertPendingRecon,
  setAlertPendingRecon,
  alertBurnAnomaly,
  setAlertBurnAnomaly,
  alertMonthlyDigest,
  setAlertMonthlyDigest,
  alertEmail,
  setAlertEmail,
}: {
  alertLowBalance: boolean
  setAlertLowBalance: (v: boolean) => void
  alertPendingRecon: boolean
  setAlertPendingRecon: (v: boolean) => void
  alertBurnAnomaly: boolean
  setAlertBurnAnomaly: (v: boolean) => void
  alertMonthlyDigest: boolean
  setAlertMonthlyDigest: (v: boolean) => void
  alertEmail: string
  setAlertEmail: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Demo only—preferences are not persisted.</p>
      <label className="flex items-start gap-3 text-sm text-gray-800">
        <input type="checkbox" className="mt-0.5 accent-indigo-600" checked={alertLowBalance} onChange={(e) => setAlertLowBalance(e.target.checked)} />
        <span>
          <span className="font-semibold">Low balance &amp; buffer</span>
          <span className="mt-0.5 block text-xs text-gray-500">When available balance is near the policy floor or block threshold.</span>
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm text-gray-800">
        <input
          type="checkbox"
          className="mt-0.5 accent-indigo-600"
          checked={alertPendingRecon}
          onChange={(e) => setAlertPendingRecon(e.target.checked)}
        />
        <span>
          <span className="font-semibold">Pending reconciliation</span>
          <span className="mt-0.5 block text-xs text-gray-500">When rows stay unsettled past the expected window.</span>
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm text-gray-800">
        <input
          type="checkbox"
          className="mt-0.5 accent-indigo-600"
          checked={alertBurnAnomaly}
          onChange={(e) => setAlertBurnAnomaly(e.target.checked)}
        />
        <span>
          <span className="font-semibold">Unusual burn</span>
          <span className="mt-0.5 block text-xs text-gray-500">When draw versus trend suggests a material change.</span>
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm text-gray-800">
        <input
          type="checkbox"
          className="mt-0.5 accent-indigo-600"
          checked={alertMonthlyDigest}
          onChange={(e) => setAlertMonthlyDigest(e.target.checked)}
        />
        <span>
          <span className="font-semibold">Monthly digest</span>
          <span className="mt-0.5 block text-xs text-gray-500">End-of-month closing balance and activity summary (non-urgent).</span>
        </span>
      </label>
      <div>
        <label className="text-xs font-semibold text-gray-600" htmlFor="cd-alert-email">
          Primary email
        </label>
        <input
          id="cd-alert-email"
          value={alertEmail}
          onChange={(e) => setAlertEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
          placeholder="finance@company.com"
        />
      </div>
      <p className="text-xs text-gray-400">Urgent items can still be sent immediately in production, independent of digest.</p>
    </div>
  )
}

function DisputeRaiseFormBody({
  disputeScope,
  setDisputeScope,
  disputeSelectedTxId,
  setDisputeSelectedTxId,
  disputeDateFrom,
  setDisputeDateFrom,
  disputeDateTo,
  setDisputeDateTo,
  disputeRefPrefill,
  setDisputeRefPrefill,
  disputeReason,
  setDisputeReason,
  disputeNotes,
  setDisputeNotes,
  disputePickOptions,
}: {
  disputeScope: DisputeScope
  setDisputeScope: (s: DisputeScope) => void
  disputeSelectedTxId: string
  setDisputeSelectedTxId: (id: string) => void
  disputeDateFrom: string
  setDisputeDateFrom: (v: string) => void
  disputeDateTo: string
  setDisputeDateTo: (v: string) => void
  disputeRefPrefill: string | null
  setDisputeRefPrefill: (r: string | null) => void
  disputeReason: string
  setDisputeReason: (v: string) => void
  disputeNotes: string
  setDisputeNotes: (v: string) => void
  disputePickOptions: TransactionRow[]
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Report an issue with a movement or a period. Demo only—no case is created.</p>
      <fieldset className="space-y-2">
        <legend className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Scope</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {(
            [
              { id: 'transaction' as const, label: 'Single transaction' },
              { id: 'period' as const, label: 'Date range' },
              { id: 'general' as const, label: 'General' },
            ] as const
          ).map((o) => (
            <label key={o.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="dispute-scope-modal"
                className="accent-indigo-600"
                checked={disputeScope === o.id}
                onChange={() => {
                  setDisputeScope(o.id)
                  if (o.id === 'transaction' && !disputeSelectedTxId) {
                    const first = disputePickOptions[0]
                    if (first) setDisputeSelectedTxId(first.id)
                  }
                }}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      {disputeScope === 'transaction' ? (
        <div>
          <label className="text-xs font-semibold text-gray-600" htmlFor="dispute-tx-pick-m">
            Transaction
          </label>
          <select
            id="dispute-tx-pick-m"
            value={disputeSelectedTxId}
            onChange={(e) => {
              const id = e.target.value
              setDisputeSelectedTxId(id)
              const row = ALL_TRANSACTIONS.find((r) => r.id === id)
              setDisputeRefPrefill(row?.referenceId ?? null)
            }}
            className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
          >
            <option value="">Select a transaction</option>
            {disputePickOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {formatDateTime(r.at)} — {r.description.length > 48 ? `${r.description.slice(0, 48)}…` : r.description} ({r.referenceId ?? 'no ref'})
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {disputeScope === 'period' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gray-600" htmlFor="dispute-df-m">
              From
            </label>
            <input
              id="dispute-df-m"
              type="date"
              value={disputeDateFrom}
              onChange={(e) => setDisputeDateFrom(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600" htmlFor="dispute-dt-m">
              To
            </label>
            <input
              id="dispute-dt-m"
              type="date"
              value={disputeDateTo}
              onChange={(e) => setDisputeDateTo(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      ) : null}
      {disputeScope === 'general' ? (
        <p className="text-xs text-gray-500">Describe the issue below. We will route it without tie-in to a single ledger line.</p>
      ) : null}
      {disputeScope !== 'transaction' ? (
        <div>
          <label className="text-xs font-semibold text-gray-600" htmlFor="dispute-ref-opt-m">
            Reference (optional)
          </label>
          <input
            id="dispute-ref-opt-m"
            value={disputeRefPrefill ?? ''}
            onChange={(e) => setDisputeRefPrefill(e.target.value || null)}
            placeholder="e.g. batch or invoice ID"
            className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 font-mono text-sm"
          />
        </div>
      ) : null}
      <div>
        <label className="text-xs font-semibold text-gray-600" htmlFor="dispute-reason-sel-m">
          Reason
        </label>
        <select
          id="dispute-reason-sel-m"
          value={disputeReason}
          onChange={(e) => setDisputeReason(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
        >
          <option value="amount_mismatch">Amount mismatch</option>
          <option value="duplicate">Duplicate posting</option>
          <option value="timing">Settlement timing</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600" htmlFor="dispute-notes-ta-m">
          Notes
        </label>
        <textarea
          id="dispute-notes-ta-m"
          value={disputeNotes}
          onChange={(e) => setDisputeNotes(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm"
          placeholder="Include any context…"
        />
      </div>
    </div>
  )
}

// —— Main page ——————————————————————————————————————————————————————————

export default function CdBalanceEnterprise() {
  const navigate = useNavigate()
  const { query: globalSearchQuery } = useGlobalSearch()
  const [configureModalOpen, setConfigureModalOpen] = useState(false)
  const [addFundsOpen, setAddFundsOpen] = useState(false)
  const [proformaAmountInr, setProformaAmountInr] = useState('')
  const [proformaAmountError, setProformaAmountError] = useState('')
  const [mainTab, setMainTab] = useState<MainTab>('history')
  const [disputesList, setDisputesList] = useState<DisputeRecord[]>(() => [...INITIAL_MOCK_DISPUTES])
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [alertsPrefModalOpen, setAlertsPrefModalOpen] = useState(false)
  const [disputeScope, setDisputeScope] = useState<DisputeScope>('transaction')
  const [disputeSelectedTxId, setDisputeSelectedTxId] = useState('')
  const [disputeDateFrom, setDisputeDateFrom] = useState('')
  const [disputeDateTo, setDisputeDateTo] = useState('')
  const [detailDrawer, setDetailDrawer] = useState(false)
  const [selectedTx, setSelectedTx] = useState<TransactionRow | null>(null)
  const [disputeRefPrefill, setDisputeRefPrefill] = useState<string | null>(null)

  const [dateRange, setDateRange] = useState<DateRangePreset>('30d')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 18

  const [rowMenuId, setRowMenuId] = useState<string | null>(null)
  const [rowMenuAnchor, setRowMenuAnchor] = useState<HTMLElement | null>(null)
  const rowBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  /** Simplified alert toggles — sensible defaults on */
  const [alertLowBalance, setAlertLowBalance] = useState(true)
  const [alertPendingRecon, setAlertPendingRecon] = useState(true)
  const [alertBurnAnomaly, setAlertBurnAnomaly] = useState(true)
  const [alertMonthlyDigest, setAlertMonthlyDigest] = useState(true)
  const [alertEmail, setAlertEmail] = useState('finance@acme.example')

  const [disputeReason, setDisputeReason] = useState('amount_mismatch')
  const [disputeNotes, setDisputeNotes] = useState('')
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false
      if (!transactionInDateRange(r.at, dateRange)) return false
      const q = globalSearchQuery.trim().toLowerCase()
      if (q) {
        const inDesc = r.description.toLowerCase().includes(q)
        const ref = (r.referenceId ?? '').toLowerCase()
        if (!inDesc && !ref.includes(q)) return false
      }
      return true
    })
  }, [dateRange, typeFilter, globalSearchQuery])

  const totalFiltered = filtered.length
  const pageCount = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const pageSafe = Math.min(page, pageCount)
  const sliceStart = (pageSafe - 1) * pageSize
  const pageRows = filtered.slice(sliceStart, sliceStart + pageSize)

  const disputePickOptions = useMemo(() => ALL_TRANSACTIONS.slice(0, 80), [])

  useEffect(() => {
    setPage(1)
  }, [dateRange, typeFilter, globalSearchQuery])

  const openTxDetail = useCallback((tx: TransactionRow) => {
    setSelectedTx(tx)
    setDetailDrawer(true)
  }, [])

  const openRaiseDispute = useCallback((ref: string | null) => {
    setMainTab('disputes')
    setDisputeRefPrefill(ref)
    if (ref) {
      const match = ALL_TRANSACTIONS.find((r) => r.referenceId === ref)
      if (match) {
        setDisputeScope('transaction')
        setDisputeSelectedTxId(match.id)
      } else {
        setDisputeScope('transaction')
        setDisputeSelectedTxId('')
      }
    } else {
      setDisputeScope('transaction')
      setDisputeSelectedTxId('')
    }
    setDisputeModalOpen(true)
  }, [])

  const openDisputesHub = useCallback(() => {
    setMainTab('disputes')
  }, [])

  const submitDisputeDemo = useCallback(() => {
    const linked =
      disputeScope === 'transaction'
        ? ALL_TRANSACTIONS.find((r) => r.id === disputeSelectedTxId)?.referenceId ?? disputeRefPrefill ?? '—'
        : (disputeRefPrefill ?? '—')
    const n = 700 + Math.floor(Math.random() * 8999)
    const newRow: DisputeRecord = {
      id: `DSP-${n}`,
      linkedRef: linked,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
    }
    setDisputesList((prev) => [newRow, ...prev])
    setDisputeModalOpen(false)
  }, [disputeRefPrefill, disputeScope, disputeSelectedTxId])

  const copyRef = useCallback(async (ref: string | null) => {
    if (!ref) return
    try {
      await navigator.clipboard.writeText(ref)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }, [])

  const summaryLeft =
    totalFiltered === 0
      ? 'No results'
      : `Showing ${sliceStart + 1}–${sliceStart + pageRows.length} of ${totalFiltered}`

  const configuredAlerts = useMemo(
    () => [
      {
        id: 'a1',
        name: 'Low balance & buffer',
        channel: 'Email' as const,
        enabled: alertLowBalance,
        lastSent: '25 Mar 2026, 2:20 pm',
      },
      {
        id: 'a2',
        name: 'Pending reconciliation',
        channel: 'Email' as const,
        enabled: alertPendingRecon,
        lastSent: '20 Mar 2026, 11:05 am',
      },
      {
        id: 'a3',
        name: 'Unusual burn',
        channel: 'Email' as const,
        enabled: alertBurnAnomaly,
        lastSent: '18 Mar 2026, 8:00 am',
      },
      {
        id: 'a4',
        name: 'Monthly digest',
        channel: 'Email' as const,
        enabled: alertMonthlyDigest,
        lastSent: '28 Mar 2026, 9:00 am',
      },
    ],
    [alertLowBalance, alertPendingRecon, alertBurnAnomaly, alertMonthlyDigest],
  )

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-gray-50 px-6 py-3 text-left lg:px-8">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-1 flex-col">
        <CdPageHeader
          onAddFunds={() => setAddFundsOpen(true)}
          onDownloadStatement={() => {
            const blob = new Blob(['CD statement (demo)'], { type: 'text/plain' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'cd-statement-demo.txt'
            a.click()
            URL.revokeObjectURL(a.href)
          }}
          onOpenConfigure={() => setConfigureModalOpen(true)}
        />

        <div className="mb-3 grid flex-shrink-0 grid-cols-1 gap-3 lg:grid-cols-3 lg:items-stretch">
          <CdBalancePrimaryCard balance={MOCK_METRICS.balance} />
          <CdBurnRunwayCard
            balance={MOCK_METRICS.balance}
            monthlyBurn={MOCK_METRICS.monthlyBurn}
            runwayLabel={MOCK_METRICS.runwayMonthsLabel}
          />
          <CdPremiumSplitDonut balance={MOCK_METRICS.balance} />
        </div>

        {MOCK_METRICS.pendingReconCount > 0 ? (
          <div className="mb-3 flex flex-shrink-0 items-start gap-2 rounded-lg border border-amber-200/90 bg-amber-50/90 px-3 py-2.5 text-sm text-amber-950">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-medium">Attention needed</p>
              <p className="text-xs text-amber-900/90">
                {MOCK_METRICS.pendingReconCount} transaction{MOCK_METRICS.pendingReconCount !== 1 ? 's' : ''} pending
                reconciliation ({formatInr(MOCK_METRICS.pendingReconAmount, false)}). Filter by status in the log or open{' '}
                <button
                  type="button"
                  className="font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-900"
                  onClick={() => openDisputesHub()}
                >
                  Disputes
                </button>{' '}
                if you need to raise an issue.
              </p>
            </div>
          </div>
        ) : null}

        <ModalShell
          open={addFundsOpen}
          title="Request proforma invoice"
          onClose={() => {
            setAddFundsOpen(false)
            setProformaAmountInr('')
            setProformaAmountError('')
          }}
        >
          <p className="text-sm text-gray-600">
            Raise a proforma invoice for the CD top-up amount you need. ACKO will share bank / UTR instructions after your request is
            logged (demo flow — nothing is sent).
          </p>
          <label htmlFor="cd-proforma-amount" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Amount (INR)
          </label>
          <input
            id="cd-proforma-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="e.g. 500000"
            value={proformaAmountInr}
            onChange={(e) => {
              setProformaAmountInr(e.target.value)
              if (proformaAmountError) setProformaAmountError('')
            }}
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          {proformaAmountError ? <p className="mt-2 text-xs font-medium text-red-600">{proformaAmountError}</p> : null}
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            Coordinate internally before submitting. You’ll receive the proforma reference on email in production.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => {
                setAddFundsOpen(false)
                setProformaAmountInr('')
                setProformaAmountError('')
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              onClick={() => {
                const raw = proformaAmountInr.replace(/,/g, '').trim()
                const n = Number(raw)
                if (!Number.isFinite(n) || n <= 0) {
                  setProformaAmountError('Enter a valid amount in INR (greater than zero).')
                  return
                }
                setProformaAmountError('')
                window.alert(
                  `Demo only: Proforma invoice request for ${formatInr(Math.round(n))} would be shared with ACKO for treasury processing.`,
                )
                setAddFundsOpen(false)
                setProformaAmountInr('')
              }}
            >
              Request proforma invoice
            </button>
          </div>
        </ModalShell>

        <ModalShell open={disputeModalOpen} title="Raise a dispute" onClose={() => setDisputeModalOpen(false)}>
          <DisputeRaiseFormBody
            disputeScope={disputeScope}
            setDisputeScope={setDisputeScope}
            disputeSelectedTxId={disputeSelectedTxId}
            setDisputeSelectedTxId={setDisputeSelectedTxId}
            disputeDateFrom={disputeDateFrom}
            setDisputeDateFrom={setDisputeDateFrom}
            disputeDateTo={disputeDateTo}
            setDisputeDateTo={setDisputeDateTo}
            disputeRefPrefill={disputeRefPrefill}
            setDisputeRefPrefill={setDisputeRefPrefill}
            disputeReason={disputeReason}
            setDisputeReason={setDisputeReason}
            disputeNotes={disputeNotes}
            setDisputeNotes={setDisputeNotes}
            disputePickOptions={disputePickOptions}
          />
          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setDisputeModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              onClick={submitDisputeDemo}
            >
              Submit (demo)
            </button>
          </div>
        </ModalShell>

        <ModalShell open={alertsPrefModalOpen} title="Alerts" onClose={() => setAlertsPrefModalOpen(false)}>
          <p className="mb-3 text-sm text-gray-600">
            Add or change which notifications you get. Edits are demo only and are not saved to a server.
          </p>
          <CdAlertsPreferencesForm
            alertLowBalance={alertLowBalance}
            setAlertLowBalance={setAlertLowBalance}
            alertPendingRecon={alertPendingRecon}
            setAlertPendingRecon={setAlertPendingRecon}
            alertBurnAnomaly={alertBurnAnomaly}
            setAlertBurnAnomaly={setAlertBurnAnomaly}
            alertMonthlyDigest={alertMonthlyDigest}
            setAlertMonthlyDigest={setAlertMonthlyDigest}
            alertEmail={alertEmail}
            setAlertEmail={setAlertEmail}
          />
          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            onClick={() => setAlertsPrefModalOpen(false)}
          >
            Save (demo)
          </button>
        </ModalShell>

        <div className="mt-0 flex min-h-0 flex-1 flex-col gap-0">
          <div className="flex flex-shrink-0 flex-col gap-3 border-b border-gray-200 pb-0 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex min-w-0 flex-wrap gap-1 sm:gap-8" role="tablist" aria-label="CD balance sections">
              {(
                [
                  { id: 'history' as const, label: 'History' },
                  { id: 'disputes' as const, label: 'Disputes' },
                  { id: 'alerts' as const, label: 'Alerts' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={mainTab === t.id}
                  onClick={() => setMainTab(t.id)}
                  className={`-mb-px border-b-2 px-0 py-2.5 text-sm transition-colors sm:px-0.5 ${
                    mainTab === t.id
                      ? 'border-indigo-600 font-semibold text-indigo-800'
                      : 'border-transparent font-medium text-gray-500 hover:border-gray-200 hover:text-gray-900'
                  } `}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center pb-2 sm:pb-2.5">
              {mainTab === 'alerts' ? (
                <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setAlertsPrefModalOpen(true)}
                    className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100 sm:w-auto"
                  >
                    <Bell className="h-4 w-4 shrink-0" aria-hidden />
                    Add alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertsPrefModalOpen(true)}
                    className="inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
                  >
                    <Pencil className="h-4 w-4 shrink-0" aria-hidden />
                    Edit alerts
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openRaiseDispute(null)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
                >
                  <Scale className="h-4 w-4 shrink-0" aria-hidden />
                  Raise a dispute
                </button>
              )}
            </div>
          </div>

          {mainTab === 'history' && (
            <section
              className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              aria-label="CD transaction history"
            >
          <div className="flex-shrink-0 border-b border-gray-100 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">Filter and export</p>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRangePreset)}
                  className="h-8 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  aria-label="Date range"
                >
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="ytd">Year to date</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-8 min-w-[7.5rem] cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  aria-label="Transaction type"
                >
                  <option value="all">All types</option>
                  <option value="deduction">Deduction</option>
                  <option value="deposit">Deposit</option>
                  <option value="refund">Refund</option>
                </select>
                <button
                  type="button"
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-800 transition-colors hover:border-gray-300"
                  onClick={() => {
                    const header = ['datetime', 'type', 'description', 'amount', 'balance_after', 'status', 'reference']
                    const lines = filtered.map((r) =>
                      [r.at, r.type, `"${r.description.replace(/"/g, '""')}"`, r.amount, r.balanceAfter, r.status, r.referenceId ?? ''].join(','),
                    )
                    const csv = [header.join(','), ...lines].join('\n')
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = 'cd-transactions.csv'
                    a.click()
                    URL.revokeObjectURL(a.href)
                  }}
                >
                  <Download className="h-3.5 w-3.5 text-gray-500" aria-hidden />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto overflow-x-hidden [min-height:max(16rem,28dvh)]">
            <table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
              <colgroup>
                <col className="w-[16%]" />
                <col className="w-[9%]" />
                <col className="w-[28%]" />
                <col className="w-[11%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-12" />
              </colgroup>
              <thead className="sticky top-0 z-[1]">
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date &amp; time</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="min-w-0 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Balance after</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="min-w-0 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Reference</th>
                  <th className="w-12 px-2 py-3 text-right text-xs font-semibold text-gray-500" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center align-middle">
                      <p className="text-sm font-normal text-gray-500">No transactions match your filters or search.</p>
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr
                      key={row.id}
                      className="cursor-pointer text-gray-800 transition-colors hover:bg-gray-50/50"
                      onClick={() => openTxDetail(row)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 align-middle text-xs font-normal tabular-nums text-gray-800">
                        <span className="block" title={formatDateTime(row.at)}>
                          {formatDateTime(row.at)}
                        </span>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <TypeBadge type={row.type} />
                      </td>
                      <td className="min-w-0 max-w-0 px-3 py-3 align-middle">
                        <span className="line-clamp-2 text-xs font-normal text-gray-800" title={row.description}>
                          {row.description}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-right text-xs">
                        <span
                          className={`block font-semibold tabular-nums ${
                            row.amount < 0 ? 'text-rose-600' : row.amount > 0 ? 'text-emerald-600' : 'text-gray-800'
                          }`}
                        >
                          {formatInrSigned(row.amount)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 align-middle text-right text-xs text-gray-600">
                        <span className="block font-normal tabular-nums">{formatInr(row.balanceAfter, false)}</span>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="min-w-0 max-w-0 px-3 py-3 align-middle">
                        <span className="block truncate font-mono text-xs text-gray-700" title={row.referenceId ?? undefined}>
                          {row.referenceId ?? '—'}
                        </span>
                      </td>
                      <td className="w-12 px-2 py-2 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          ref={(el) => {
                            rowBtnRefs.current[row.id] = el
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
                          aria-label="Row actions"
                          onClick={(e) => {
                            e.stopPropagation()
                            const el = rowBtnRefs.current[row.id]
                            setRowMenuId((id) => {
                              if (id === row.id) {
                                setRowMenuAnchor(null)
                                return null
                              }
                              setRowMenuAnchor(el ?? null)
                              return row.id
                            })
                            setSelectedTx(row)
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <RowActionsMenu
                          open={rowMenuId === row.id}
                          anchorEl={rowMenuAnchor}
                          onClose={() => {
                            setRowMenuId(null)
                            setRowMenuAnchor(null)
                          }}
                          onViewDetails={() => openTxDetail(row)}
                          onRaiseDispute={() => openRaiseDispute(row.referenceId)}
                          onCopyRef={() => copyRef(row.referenceId)}
                          referenceId={row.referenceId}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-white px-6 py-3 sm:rounded-b-xl">
            <p className="text-xs font-normal text-gray-400">{summaryLeft}</p>
            <div className="flex items-center gap-2 sm:gap-3" role="navigation" aria-label="Transaction table pagination">
              <button
                type="button"
                disabled={pageSafe <= 1 || totalFiltered === 0}
                onClick={() => setPage(1)}
                className="hidden cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:inline"
                aria-label="First page"
              >
                First
              </button>
              <button
                type="button"
                disabled={pageSafe <= 1 || totalFiltered === 0}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <span className="min-w-[7rem] text-center text-xs tabular-nums text-gray-600">
                Page {totalFiltered === 0 ? 0 : pageSafe} of {pageCount}
              </span>
              <button
                type="button"
                disabled={pageSafe >= pageCount || totalFiltered === 0}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                disabled={pageSafe >= pageCount || totalFiltered === 0}
                onClick={() => setPage(pageCount)}
                className="hidden cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:inline"
                aria-label="Last page"
              >
                Last
              </button>
            </div>
          </div>
            </section>
          )}
          {mainTab === 'disputes' && (
            <section
              className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              aria-label="Disputes"
            >
              <div className="flex-shrink-0 border-b border-gray-100 px-4 py-3 sm:px-6">
                <p className="text-sm font-medium text-gray-800">Open disputes</p>
                <p className="text-xs text-gray-500">Raise a new dispute using the button above. Demo data only.</p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto overflow-x-hidden [min-height:max(16rem,28dvh)]">
                <table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-[1] border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Dispute ID</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Linked ref</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {disputesList.map((d) => (
                      <tr key={d.id} className="text-gray-800">
                        <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{d.id}</td>
                        <td className="px-3 py-3 font-mono text-xs text-gray-700">{d.linkedRef}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{d.createdAt}</td>
                        <td className="px-3 py-3 text-xs text-gray-800">{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </section>
          )}
          {mainTab === 'alerts' && (
            <section
              className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              aria-label="Alerts"
            >
              <div className="flex-shrink-0 border-b border-gray-100 px-4 py-3 sm:px-6">
                <p className="text-sm font-medium text-gray-800">Alerts</p>
                <p className="text-xs text-gray-500">
                  Add new alerts or edit existing ones. Use <span className="font-medium">Edit</span> or the buttons above to open
                  settings (demo only).
                </p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto overflow-x-hidden [min-height:max(16rem,28dvh)]">
                  <table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-[1] border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="min-w-0 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Alert</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Channel</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">On / off</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Last sent</th>
                        <th className="w-24 px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"> </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {configuredAlerts.map((a) => (
                        <tr key={a.id} className="text-gray-800">
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{a.name}</td>
                          <td className="px-3 py-3 text-xs text-gray-700">{a.channel}</td>
                          <td className="px-3 py-3 text-xs text-gray-800">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                a.enabled ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {a.enabled ? 'On' : 'Off'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-600">{a.lastSent}</td>
                          <td className="px-2 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setAlertsPrefModalOpen(true)}
                              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <ConfigureModal
        open={configureModalOpen}
        onClose={() => setConfigureModalOpen(false)}
        onOpenAlertsTab={() => {
          setMainTab('alerts')
        }}
        onOpenDisputesTab={() => {
          openDisputesHub()
        }}
        onHelp={() => {
          setConfigureModalOpen(false)
          navigate('/support/help')
        }}
      />

      <DrawerShell open={detailDrawer} title="Transaction details" onClose={() => setDetailDrawer(false)} widthClass="max-w-md">
        {selectedTx ? (
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TypeBadge type={selectedTx.type} />
              <StatusBadge status={selectedTx.status} />
            </div>
            <p className="text-xs text-gray-500">{formatDateTime(selectedTx.at)}</p>
            <p className="font-medium text-gray-900">{selectedTx.description}</p>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <dt className="text-gray-500">Amount</dt>
              <dd className="text-right font-semibold tabular-nums">{formatInrSigned(selectedTx.amount)}</dd>
              <dt className="text-gray-500">Balance after</dt>
              <dd className="text-right tabular-nums text-gray-800">{formatInr(selectedTx.balanceAfter, false)}</dd>
              <dt className="text-gray-500">Reference</dt>
              <dd className="text-right font-mono">{selectedTx.referenceId ?? '—'}</dd>
            </dl>
            {selectedTx.settlementNote ? <p className="rounded-md bg-gray-50 p-2 text-xs text-gray-600">{selectedTx.settlementNote}</p> : null}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold hover:bg-gray-50"
                onClick={() => copyRef(selectedTx.referenceId)}
              >
                Copy reference
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                onClick={() => {
                  setDetailDrawer(false)
                  openRaiseDispute(selectedTx.referenceId)
                }}
              >
                Raise dispute
              </button>
            </div>
          </div>
        ) : null}
      </DrawerShell>

      {copied ? (
        <div className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900 shadow-md">
          <Check className="h-3.5 w-3.5" aria-hidden />
          Copied to clipboard
        </div>
      ) : null}
    </div>
  )
}
