import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  ClipboardList,
  Clock,
  Lightbulb,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

const KIND_OPTIONS = [
  {
    id: 'feedback',
    label: 'General feedback',
    description: 'Usability, copy, speed—or anything we should hear.',
    Icon: MessageSquare,
  },
  {
    id: 'bug',
    label: 'Something broke',
    description: 'Errors, wrong numbers, flows you cannot finish.',
    Icon: Bug,
  },
  {
    id: 'idea',
    label: 'Improvement idea',
    description: 'A tweak that would make your week easier.',
    Icon: Lightbulb,
  },
  {
    id: 'request',
    label: 'Change / request',
    description: 'Policy, access, integrations, or a net-new workflow.',
    Icon: ClipboardList,
  },
]

const AREA_OPTIONS = [
  { value: '', label: 'General / not sure' },
  { value: 'endorsements', label: 'Endorsements & HRMS sync' },
  { value: 'cd', label: 'CD wallet & premiums' },
  { value: 'claims', label: 'Claims' },
  { value: 'policy', label: 'Policy & coverage' },
  { value: 'portal', label: 'Portal, login, navigation' },
]

const MESSAGE_SOFT_MAX = 2000

/** Demo ticket id formatted like a backlog reference */
function makeDemoTicketId() {
  const n = Math.floor(10000 + Math.random() * 89999)
  return `FB-${n}`
}

export default function SupportFeedback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const presetAppliedRef = useRef(false)
  const [kind, setKind] = useState('feedback')
  const [area, setArea] = useState('')
  const [priority, setPriority] = useState('normal')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [subscribeUpdates, setSubscribeUpdates] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [lastTicketId, setLastTicketId] = useState('')

  useEffect(() => {
    if (presetAppliedRef.current) return
    if (searchParams.get('preset') !== 'cd_dispute') return
    presetAppliedRef.current = true
    setKind('bug')
    setArea('cd')
    setPriority('high')
    setSubject('CD ledger dispute — ')
    setMessage(
      'Please include:\n• Transaction date\n• Amount and ledger line description\n• Why you believe the entry is incorrect\n• Any reference / screenshot names\n\n',
    )
  }, [searchParams])

  const messageRemaining = MESSAGE_SOFT_MAX - message.length

  const selectedKind = useMemo(() => KIND_OPTIONS.find((k) => k.id === kind) ?? KIND_OPTIONS[0], [kind])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLastTicketId(makeDemoTicketId())
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setSubmitted(false)
    setSubject('')
    setMessage('')
    setContact('')
    setKind('feedback')
    setArea('')
    setPriority('normal')
    setSubscribeUpdates(true)
  }

  if (submitted) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
        <PageHeader
          title="Feedback"
          subtitle="We’ve logged your submission in this demo build."
          breadcrumbs={[]}
        />

        <div className="mt-6 grid w-full min-w-0 gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm ring-1 ring-emerald-100/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
              </div>
              <p className="mt-4 text-lg font-bold text-gray-900">Thank you—we’ve got it</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                In production this would sync to Jira / Freshdesk behind the scenes. Here you’ll see how the receipt
                and next steps typically read for HR admins.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                  <span>
                    Routed as <strong className="font-semibold">{selectedKind.label}</strong>
                    {area ? (
                      <>
                        {' '}
                        · area <strong className="font-semibold capitalize">{area}</strong>
                      </>
                    ) : null}
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                  <span>Target first response: bugs & billing issues prioritized within one business day in many programs.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-7 lg:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Demo reference</p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-gray-900">{lastTicketId}</p>
            <p className="mt-4 text-sm text-gray-600">
              Keep this ID handy when chatting with ACKO—we’ll mirror it inside this prototype once APIs are wired.
            </p>
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/90 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">What happens next?</p>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-gray-600">
                <li>An operations analyst validates category and attaches your message.</li>
                <li>For bugs we try to reproduce on a staging tenant before reaching out.</li>
                <li>
                  If you opted in for email, you’ll hear when the ticket moves to <em>In progress</em> or{' '}
                  <em>Resolved</em>.
                </li>
              </ol>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              >
                Send another note
              </button>
              <button
                type="button"
                onClick={() => navigate('/support/help')}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                Help center
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const labelCls = 'text-sm font-medium text-gray-800'
  const inputCls =
    'mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-shadow placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
  const textareaCls = `${inputCls} min-h-[8.5rem] resize-y`

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="Feedback"
        subtitle="Structured intake so Product and Ops hear you clearly—we triage severity, reproduce bugs, and follow up fast."
        breadcrumbs={[]}
      />

      <div className="mt-6 grid w-full min-w-0 gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="space-y-4 lg:col-span-4 lg:self-start lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-sm ring-1 ring-indigo-50">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              <Sparkles className="h-4 w-4" aria-hidden />
              Richer experience
            </div>
            <p className="mt-3 text-lg font-bold text-gray-900">Tell us what you observe</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Screenshots attach in production—for now narrate timelines, screenshots filenames, endorsement numbers or
              claim IDs. The more specificity, the less back-and-forth.
            </p>
            <ul className="mt-5 space-y-3 text-xs text-gray-600">
              <li className="flex gap-2">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  1
                </span>
                Pick the intake lane that fits (bug vs idea matters for SLAs).
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  2
                </span>
                Mark the impacted area so routers send it to Claims vs Endorsements instantly.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  3
                </span>
                Optional contact helps if we cannot reproduce from data alone—never required for anon feedback.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => navigate('/support/help')}
              className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/80"
            >
              Browse guided articles
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
            <p className="font-semibold text-gray-900">Response norms (demo)</p>
            <p className="mt-2 leading-relaxed text-gray-600">
              <strong className="text-gray-800">P1 outages</strong> — same day acknowledgement.
              <br />
              <strong className="text-gray-800">Product ideas</strong> — reviewed weekly; we consolidate themes for the roadmap deck.
              <br />
              <strong className="text-gray-800">Compliance-sensitive</strong> — mention it in subject so encryption policies trip automatically.
            </p>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 bg-gray-50/90 px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold text-gray-900">What are you sending?</p>
              <p className="mt-1 text-xs text-gray-500">Choose one—we’ll tailor the questions ops asks on first pass.</p>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
              {KIND_OPTIONS.map((opt) => {
                const Icon = opt.Icon
                const active = kind === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setKind(opt.id)}
                    aria-pressed={active}
                    className={`flex flex-col gap-2 rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 cursor-pointer sm:py-4
                      ${
                        active
                          ? 'border-indigo-500 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-100'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Icon size={20} aria-hidden />
                      </span>
                      <span className="text-sm font-bold text-gray-900">{opt.label}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">{opt.description}</p>
                  </button>
                )
              })}
            </div>

            <div className="space-y-6 border-t border-gray-100 px-5 py-6 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fb-area" className={labelCls}>
                    Area
                  </label>
                  <select id="fb-area" value={area} onChange={(e) => setArea(e.target.value)} className={inputCls}>
                    {AREA_OPTIONS.map((o) => (
                      <option key={o.value || 'general'} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fb-priority" className={labelCls}>
                    Urgency
                  </label>
                  <select
                    id="fb-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={inputCls}
                  >
                    <option value="low">Routine — no SLA risk</option>
                    <option value="normal">Normal — default queue</option>
                    <option value="high">High — payroll day / closing</option>
                    <option value="critical">Critical — production blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fb-subject" className={labelCls}>
                  Subject
                </label>
                <input
                  id="fb-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Concise headline (e.g. “Bulk endorsement stuck at validation”)"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="fb-message" className={labelCls}>
                    Details
                  </label>
                  <span
                    className={`text-xs tabular-nums ${messageRemaining < 0 ? 'font-semibold text-red-600' : 'text-gray-400'}`}
                  >
                    {messageRemaining} characters left (soft limit {MESSAGE_SOFT_MAX})
                  </span>
                </div>
                <textarea
                  id="fb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={MESSAGE_SOFT_MAX + 200}
                  rows={8}
                  className={textareaCls}
                  placeholder="Environment, timestamps, endorsement / claim identifiers, screenshots you’ve uploaded elsewhere, reproduction steps—we love numbered lists."
                />
              </div>

              <div>
                <label htmlFor="fb-contact" className={labelCls}>
                  Contact preference <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="fb-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={inputCls}
                  placeholder="Work email / mobile / Slack alias"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-1 py-1 hover:bg-gray-50/80">
                <input
                  type="checkbox"
                  checked={subscribeUpdates}
                  onChange={(e) => setSubscribeUpdates(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span>
                  <span className="text-sm font-medium text-gray-900">Notify me when this ticket progresses</span>
                  <span className="block text-xs text-gray-500">
                    Sends status emails in production—in the demo UI we only show the acknowledgement screen.
                  </span>
                </span>
              </label>

              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">Attachments</p>
                <p className="mt-1">
                  Drag-and-drop and virus scanning arrive with the ticketing integration—reference filenames in your message so we can stitch them manually for now.
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-3 cursor-not-allowed rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-400"
                >
                  Upload files (coming soon)
                </button>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  By submitting you confirm this does not contain member health data unless encrypted per policy—see Help center Privacy note.
                </p>
                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 sm:w-auto"
                >
                  <Send className="h-4 w-4 shrink-0" aria-hidden />
                  Submit feedback
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
