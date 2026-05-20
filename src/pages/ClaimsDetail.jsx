import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  FileText,
  Stethoscope,
  Upload,
  UserRound,
  PhoneForwarded,
  ShieldAlert,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { getClaimById } from '../data/claimsMock'
import { claimsModuleCrumb } from '../lib/breadcrumbPresets'
import { formatInr } from '../lib/currencyFormat'

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

export default function ClaimsDetail() {
  const { claimId } = useParams()
  const navigate = useNavigate()
  const decodedId = claimId ? decodeURIComponent(claimId) : ''
  const claim = useMemo(() => getClaimById(decodedId), [decodedId])
  const [demoBanner, setDemoBanner] = useState('')

  if (!claim) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
        <PageHeader
          title="Claim not found"
          subtitle="This claim ID isn’t in the demo dataset."
          breadcrumbs={[claimsModuleCrumb, { label: decodedId || 'Unknown' }]}
          backPath="/claims"
        />
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Try returning to the claims list and pick another row.
          </p>
          <button
            type="button"
            onClick={() => navigate('/claims')}
            className="mt-4 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Claims
          </button>
        </div>
      </div>
    )
  }

  const needsAction =
    claim.needsAttention ||
    claim.awaitingDocuments ||
    (claim.status !== 'Approved' && claim.status !== 'Rejected')
  const actionTitle = claim.awaitingDocuments
    ? 'Documents required'
    : claim.delayed
      ? 'Delayed claim'
      : claim.status === 'Rejected'
        ? 'Claim rejected'
        : claim.status === 'Approved'
          ? 'No action needed'
          : 'Track progress'

  const actionBody = claim.awaitingDocuments
    ? `Upload: ${claim.pendingDocs.join('; ') || 'pending documents'}.`
    : claim.delayed
      ? claim.nextTimelineHint || 'This claim is past typical insurer turnaround — monitor or escalate with context.'
      : claim.status === 'Rejected'
        ? claim.nextAction
        : claim.status === 'Approved'
          ? claim.nextTimelineHint || 'Settlement follows insurer payment timelines.'
          : claim.nextAction

  function demoAction(label) {
    setDemoBanner(`${label} recorded (demo — no backend).`)
    window.setTimeout(() => setDemoBanner(''), 3200)
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
      <PageHeader
        title={claim.id}
        subtitle={`${claim.employeeName} · ${claim.claimType} · ${claim.serviceCategory} · Submitted ${claim.submittedAtIso}`}
        breadcrumbs={[claimsModuleCrumb, { label: claim.id }]}
        backPath="/claims"
      />

      {demoBanner ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
          {demoBanner}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="space-y-6 lg:col-span-8">
          <section
            className={`rounded-xl border p-4 shadow-sm ${
              needsAction && claim.status !== 'Approved'
                ? 'border-amber-200 bg-amber-50/90'
                : claim.status === 'Approved'
                  ? 'border-emerald-200 bg-emerald-50/80'
                  : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                {claim.awaitingDocuments ? (
                  <Upload className="text-amber-700" size={20} aria-hidden />
                ) : claim.delayed ? (
                  <AlertTriangle className="text-amber-700" size={20} aria-hidden />
                ) : claim.status === 'Rejected' ? (
                  <ShieldAlert className="text-rose-700" size={20} aria-hidden />
                ) : (
                  <ChevronRight className="text-emerald-700" size={20} aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Required focus</p>
                <p className="mt-1 text-base font-bold text-gray-900">{actionTitle}</p>
                <p className="mt-1 text-sm leading-snug text-gray-700">{actionBody}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={claim.pendingDocs.length === 0}
                    onClick={() => demoAction('Document upload')}
                    className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Upload document (demo)
                  </button>
                  <button
                    type="button"
                    onClick={() => demoAction('Follow-up')}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-300"
                  >
                    Mark follow-up sent (demo)
                  </button>
                  <button
                    type="button"
                    onClick={() => demoAction('Escalation')}
                    className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-900 hover:bg-rose-100"
                  >
                    Escalate (demo)
                  </button>
                </div>
              </div>
              <span className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClasses(claim.status)}`}>
                {claim.status}
              </span>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <UserRound size={18} className="text-gray-500" aria-hidden />
              Claim information
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Employee</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{claim.employeeName}</dd>
                <dd className="text-xs text-gray-500">{claim.empId}</dd>
                <dd className="truncate text-xs text-gray-500">{claim.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Claim channel</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{claim.claimType}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Claim category</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{claim.serviceCategory}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Treatment</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{claim.treatmentSummary}</dd>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Building2 size={16} className="mt-0.5 shrink-0 text-gray-400" aria-hidden />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Hospital / facility</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{claim.hospitalName}</dd>
                </div>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Stethoscope size={16} className="mt-0.5 shrink-0 text-gray-400" aria-hidden />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Diagnosis</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{claim.diagnosis}</dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Financial details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Claimed amount</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-gray-900">{formatInr(claim.claimedAmountInr)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Approved amount</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                  {claim.approvedAmountInr == null ? (
                    <span className="text-gray-400">Pending</span>
                  ) : (
                    formatInr(claim.approvedAmountInr)
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <FileText size={18} className="text-gray-500" aria-hidden />
              Documents
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uploaded</p>
                <ul className="mt-2 space-y-2">
                  {claim.uploadedDocs.length === 0 ? (
                    <li className="text-sm text-gray-500">None listed.</li>
                  ) : (
                    claim.uploadedDocs.map((d) => (
                      <li key={d} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                        {d}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pending</p>
                <ul className="mt-2 space-y-2">
                  {claim.pendingDocs.length === 0 ? (
                    <li className="text-sm text-emerald-800">No pending documents.</li>
                  ) : (
                    claim.pendingDocs.map((d) => (
                      <li
                        key={d}
                        className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm font-medium text-amber-950"
                      >
                        {d}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Ownership</h2>
            <p className="mt-2 text-sm text-gray-600">
              Primary actor for the next step (demo):
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-indigo-600">
                <UserRound size={16} aria-hidden />
              </span>
              {claim.owner}
            </p>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Progress</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-[width]"
                    style={{ width: `${claim.progressPct}%` }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums text-gray-900">{claim.progressPct}%</span>
              </div>
              {claim.nextTimelineHint ? (
                <p className="mt-3 text-xs leading-snug text-gray-500">{claim.nextTimelineHint}</p>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
            <ol className="relative mt-4 space-y-0 border-l border-gray-200 pl-4">
              {claim.timeline.map((step, idx) => (
                <li key={step.key} className="pb-6 last:pb-0">
                  <span
                    className={`absolute -left-[9px] mt-1 flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 bg-white ${
                      step.state === 'done'
                        ? 'border-indigo-600 bg-indigo-600'
                        : step.state === 'current'
                          ? 'border-indigo-600'
                          : 'border-gray-300'
                    }`}
                    aria-hidden
                  >
                    {step.state === 'done' ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>
                  <p className="text-sm font-bold text-gray-900">{step.label}</p>
                  <p className="text-xs text-gray-500">{step.at}</p>
                  {step.state === 'current' && idx < claim.timeline.length - 1 ? (
                    <p className="mt-1 text-xs font-medium text-indigo-700">Current stage</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <PhoneForwarded size={18} className="text-indigo-600" aria-hidden />
              Related coverage
            </h2>
            <p className="mt-2 text-sm leading-snug text-gray-700">
              Cross-check limits and eligibility against your master policy (system rule: Claims ↔ Policy).
            </p>
            <Link
              to="/policy-management/coverage"
              className="mt-4 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Open policy coverage
              <ChevronRight size={16} aria-hidden />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  )
}
