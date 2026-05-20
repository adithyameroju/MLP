import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  AlertTriangle,
  Info,
  AlertCircle,
  ArrowRight,
  Mail,
  Layers,
  MapPin,
  Zap,
} from 'lucide-react'
import { formatInr } from '../lib/currencyFormat'
import {
  cdRisk,
  metrics,
  priorityAlerts,
  systemBanners,
  activityFeed,
  feedItemMeta,
  getSmartActions,
  claimsTrendDetailed,
  claimsTrendInsight,
  dashboardPrimaryQuickActions,
} from '../data/dashboardMock'
import { cdBalanceTrend } from '../data/cdWalletMock'
import CdBalanceTrendChart from '../components/CdBalanceTrendChart'

function severityStyles(sev) {
  if (sev === 'critical')
    return {
      icon: AlertTriangle,
      iconClass: 'text-red-600',
      badge: 'bg-red-100 text-red-800 border-red-200',
    }
  if (sev === 'warning')
    return {
      icon: AlertCircle,
      iconClass: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-900 border-amber-200',
    }
  return {
    icon: Info,
    iconClass: 'text-sky-600',
    badge: 'bg-sky-100 text-sky-900 border-sky-200',
  }
}

function PrimaryQuickIcon({ name, className }) {
  const c = className || 'w-5 h-5'
  switch (name) {
    case 'mail':
      return <Mail className={c} />
    case 'layers':
      return <Layers className={c} />
    case 'mapPin':
      return <MapPin className={c} />
    default:
      return <ArrowRight className={c} />
  }
}

/** Two-segment donut using conic-gradient; center shows label + main number. */
function DonutSplit({ segments, size = 92, centerLabel, centerValue }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let acc = 0
  const stops = segments.map((seg) => {
    const start = (acc / total) * 100
    acc += seg.value
    const end = (acc / total) * 100
    return `${seg.color} ${start}% ${end}%`
  })
  const gradient = `conic-gradient(${stops.join(', ')})`

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full shadow-inner" style={{ background: gradient }} />
      <div className="absolute inset-[18%] rounded-full bg-white flex flex-col items-center justify-center text-center leading-tight shadow-sm border border-gray-100">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">{centerLabel}</span>
        <span className="text-sm font-bold text-gray-900 tabular-nums">{centerValue}</span>
      </div>
    </div>
  )
}

function DashboardClaimsTrendBlock({ navigate }) {
  const [tab, setTab] = useState('status')
  const [mode, setMode] = useState('count')

  const data = mode === 'count' ? claimsTrendDetailed.byCount : claimsTrendDetailed.byAmountLakh
  const keys = ['approved', 'inProgress', 'rejected', 'completed']
  const labels = ['Approved', 'In progress', 'Rejected', 'Completed']
  const colors = ['bg-sky-300', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-950']

  const maxStack = useMemo(() => {
    let m = 1
    claimsTrendDetailed.months.forEach((_, i) => {
      const sum = keys.reduce((s, k) => s + data[k][i], 0)
      m = Math.max(m, sum)
    })
    return m
  }, [data])

  const yTicks = useMemo(() => {
    const step = maxStack <= 50 ? 10 : maxStack <= 120 ? 20 : 50
    const ticks = []
    for (let v = 0; v <= maxStack; v += step) ticks.push(v)
    if (ticks[ticks.length - 1] < maxStack) ticks.push(Math.ceil(maxStack / step) * step)
    return ticks.slice(0, 6)
  }, [maxStack])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-base font-bold text-gray-900">Claims trend</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-gray-100 p-0.5 text-xs font-semibold">
            {[
              { id: 'status', label: 'By status' },
              { id: 'family', label: 'By family' },
              { id: 'treatment', label: 'By treatment' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  tab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-2.5 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <Info size={14} className="text-indigo-500 shrink-0" />
        <span>{claimsTrendInsight}</span>
      </div>

      <div className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-500">
          {tab === 'status' && 'Volume by claim stage each month.'}
          {tab === 'family' && 'Family-level view — mock; same layout as status for now.'}
          {tab === 'treatment' && 'Treatment category view — mock; same layout as status for now.'}
        </p>
        <div className="inline-flex rounded-full border border-gray-200 bg-white p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('count')}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              mode === 'count' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Count
          </button>
          <button
            type="button"
            onClick={() => setMode('amount')}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              mode === 'amount' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Amount
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-5">
        <div className="flex gap-3">
          <div className="flex flex-col justify-between text-[10px] text-gray-400 font-medium pt-1 pb-8 w-8 shrink-0 text-right tabular-nums">
            {[...yTicks].reverse().map((t) => (
              <span key={t}>{mode === 'amount' ? `₹${t}L` : t}</span>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-end gap-2 sm:gap-3 h-44 border-b border-gray-100">
              {claimsTrendDetailed.months.map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0 h-full">
                  <div className="w-full flex gap-px items-end justify-center flex-1 max-h-[152px]">
                    {keys.map((k, ki) => {
                      const v = data[k][i]
                      const hPct = (v / maxStack) * 100
                      return (
                        <div
                          key={k}
                          className={`flex-1 min-w-0 max-w-[22%] rounded-t ${colors[ki]} opacity-90 hover:opacity-100 transition-opacity`}
                          style={{ height: `${hPct}%`, minHeight: v > 0 ? '4px' : '0' }}
                          title={`${labels[ki]}: ${v}${mode === 'amount' ? ' L' : ''}`}
                        />
                      )
                    })}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">{month}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-[10px] text-gray-600">
              {keys.map((k, ki) => (
                <span key={k} className="inline-flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${colors[ki]}`} />
                  {labels[ki]}
                </span>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/claims?from=dashboard')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
              >
                Open claims module <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [actionCenterOpen, setActionCenterOpen] = useState(false)
  const smartActions = useMemo(() => getSmartActions().slice(0, 3), [])
  const actionCenterCount = priorityAlerts.length + smartActions.length
  const criticalAlertCount = priorityAlerts.filter((a) => a.severity === 'critical').length

  const totalLives = metrics.totalLives.employees + metrics.totalLives.dependents
  const claimsClosed = Math.max(0, metrics.totalClaimsYtd.count - metrics.openClaims.count)

  const levelColor =
    cdRisk.level === 'critical' ? 'text-red-700' : cdRisk.level === 'warning' ? 'text-amber-800' : 'text-emerald-700'

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto px-6 py-3 lg:px-8">
      <div className="mb-5 flex-shrink-0 text-left">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, Adithya — program health, shortcuts, and what needs attention.
        </p>
      </div>

      {systemBanners.length > 0 && (
        <div className="space-y-2 mb-5 flex-shrink-0">
          {systemBanners.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/90 px-4 py-3 text-sm text-indigo-950"
            >
              <span>{b.message}</span>
              <button
                type="button"
                onClick={() => navigate(b.path)}
                className="font-semibold text-indigo-700 hover:text-indigo-900 whitespace-nowrap cursor-pointer"
              >
                {b.actionLabel}
              </button>
            </div>
          ))}
        </div>
      )}

      <section className="mb-4 flex-shrink-0" aria-label="Key metrics and quick actions">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <button
              type="button"
              onClick={() => navigate('/cd-balance')}
              className="w-full text-left rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200/80 transition-all cursor-pointer group"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">CD balance trend</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums tracking-tight">{formatInr(cdRisk.balance)}</p>
              <p className={`text-xs font-medium mt-1 mb-3 ${levelColor}`}>{cdRisk.label}</p>
              <CdBalanceTrendChart labels={cdBalanceTrend.labels} values={cdBalanceTrend.values} detailed />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-[11px] text-gray-500">
                  Min {formatInr(cdRisk.minimum)} · Buffer {formatInr(cdRisk.buffer)}
                </span>
                <span className="text-xs font-semibold text-indigo-600 inline-flex items-center gap-0.5 group-hover:gap-1 transition-all">
                  CD wallet <ChevronRight size={14} className="text-indigo-500" />
                </span>
              </div>
            </button>
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 flex items-center gap-4 p-5 text-left hover:bg-gray-50/80 transition-colors cursor-pointer border-b border-gray-100"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Total lives</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums mt-1">{totalLives.toLocaleString('en-IN')}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {metrics.totalLives.employees.toLocaleString('en-IN')} employees
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    {metrics.totalLives.dependents.toLocaleString('en-IN')} dependents
                  </span>
                </div>
              </div>
              <DonutSplit
                segments={[
                  { value: metrics.totalLives.employees, color: '#f59e0b' },
                  { value: metrics.totalLives.dependents, color: '#4f46e5' },
                ]}
                centerLabel="Lives"
                centerValue={totalLives.toLocaleString('en-IN')}
              />
            </button>
            <button
              type="button"
              onClick={() => navigate('/claims?from=dashboard')}
              className="flex-1 flex items-center gap-4 p-5 text-left hover:bg-gray-50/80 transition-colors cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Open claims</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums mt-1">{metrics.openClaims.count}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.openClaims.inReview} in review · {metrics.openClaims.awaitingDocs} awaiting documents
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold text-gray-900">{metrics.totalClaimsYtd.count}</span> claims YTD ·{' '}
                  {formatInr(metrics.totalClaimsYtd.amount)}
                </p>
              </div>
              <DonutSplit
                segments={[
                  { value: metrics.openClaims.count, color: '#f59e0b' },
                  { value: claimsClosed, color: '#4f46e5' },
                ]}
                centerLabel="YTD"
                centerValue={String(metrics.totalClaimsYtd.count)}
              />
            </button>
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col min-h-[280px] lg:min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-md">
                <Zap size={18} strokeWidth={2.25} />
              </span>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quick actions</h2>
            </div>
            <ul className="space-y-2 flex-1">
              {dashboardPrimaryQuickActions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100/80 hover:border-indigo-200 px-3 py-3 text-left transition-colors cursor-pointer group"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm border border-indigo-100">
                      <PrimaryQuickIcon name={item.icon} className="w-5 h-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.description}</p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </section>

      <section className="mb-5 flex-shrink-0" aria-label="Action center">
        <button
          type="button"
          onClick={() => setActionCenterOpen((o) => !o)}
          aria-expanded={actionCenterOpen}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 hover:shadow-sm"
        >
          <span className="flex min-w-0 items-center gap-2">
            <ChevronRight
              size={18}
              className={`shrink-0 text-gray-400 transition-transform ${actionCenterOpen ? 'rotate-90' : ''}`}
              aria-hidden
            />
            <span className="font-semibold text-gray-900">Action center</span>
            <span className="hidden text-xs text-gray-500 sm:inline">Alerts and suggested steps</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
            {criticalAlertCount > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-semibold text-red-800 border border-red-200">
                {criticalAlertCount} critical
              </span>
            )}
            <span>{actionCenterCount} items</span>
          </span>
        </button>

        {actionCenterOpen && (
          <div className="mt-3 space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <p className="mb-2 text-xs font-bold text-gray-900">Needs attention</p>
              <ul className="space-y-2">
                {priorityAlerts.map((a) => {
                  const sev = a.severity === 'critical' ? 'critical' : a.severity === 'warning' ? 'warning' : 'info'
                  const st = severityStyles(sev)
                  const Icon = st.icon
                  const borderAccent =
                    sev === 'critical' ? 'border-l-red-500' : sev === 'warning' ? 'border-l-amber-500' : 'border-l-sky-400'
                  return (
                    <li
                      key={a.id}
                      className={`flex flex-col gap-2 rounded-r-xl border border-gray-100 border-l-[3px] ${borderAccent} bg-gray-50/50 py-3 pl-3 pr-3 sm:flex-row sm:items-center sm:justify-between`}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-2">
                        <Icon size={18} className={`mt-0.5 shrink-0 ${st.iconClass}`} />
                        <div className="min-w-0">
                          <span className={`mb-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${st.badge}`}>
                            {a.severity}
                          </span>
                          <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{a.detail}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(a.path)}
                        className="shrink-0 self-start rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 sm:self-center cursor-pointer"
                      >
                        {a.actionLabel}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs font-bold text-gray-900">Suggested next steps</p>
              <ul className="space-y-2">
                {smartActions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => navigate(s.path)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/40 px-3 py-2.5 text-left text-xs font-semibold text-gray-800 hover:border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="min-w-0">{s.title}</span>
                      <ArrowRight size={14} className="shrink-0 text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="mb-5 flex-shrink-0">
        <DashboardClaimsTrendBlock navigate={navigate} />
      </section>

      <section className="flex-1 min-h-0 mb-2" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-sm font-bold text-gray-900 mb-3">
          Recent activity
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col min-h-[200px]">
          <ul className="divide-y divide-gray-100">
            {activityFeed.map((row) => {
              const meta = feedItemMeta(row.module)
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => navigate(row.path)}
                    className="w-full text-left px-4 py-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.color}`}>{meta.label}</span>
                      <span className="text-xs text-gray-400">{row.time}</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug">{row.text}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
