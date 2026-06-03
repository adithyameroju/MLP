import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronDown, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { helpLink, helpPrimaryBtn } from '../lib/helpUiTokens'

const KIND_OPTIONS = [
  { id: 'feedback', label: 'Feedback' },
  { id: 'bug', label: 'Bug' },
  { id: 'idea', label: 'Idea' },
  { id: 'request', label: 'Request' },
]

const AREA_OPTIONS = [
  { value: '', label: 'General' },
  { value: 'endorsements', label: 'Endorsements' },
  { value: 'cd', label: 'CD wallet' },
  { value: 'claims', label: 'Claims' },
  { value: 'policy', label: 'Policy' },
  { value: 'portal', label: 'Portal / login' },
]

const MESSAGE_SOFT_MAX = 2000

function makeDemoTicketId() {
  const n = Math.floor(10000 + Math.random() * 89999)
  return `FB-${n}`
}

export default function SupportFeedback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const presetAppliedRef = useRef(false)

  const [kind, setKind] = useState('feedback')
  const [message, setMessage] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [area, setArea] = useState('')
  const [priority, setPriority] = useState('normal')
  const [subject, setSubject] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [lastTicketId, setLastTicketId] = useState('')

  useEffect(() => {
    if (presetAppliedRef.current) return
    if (searchParams.get('preset') !== 'cd_dispute') return
    presetAppliedRef.current = true
    setKind('bug')
    setArea('cd')
    setPriority('high')
    setShowDetails(true)
    setSubject('CD ledger dispute')
    setMessage(
      'Transaction date:\nAmount:\nWhy this looks wrong:\nReference / screenshot names:\n',
    )
  }, [searchParams])

  const selectedKind = useMemo(() => KIND_OPTIONS.find((k) => k.id === kind) ?? KIND_OPTIONS[0], [kind])
  const messageRemaining = MESSAGE_SOFT_MAX - message.length

  const handleSubmit = (e) => {
    e.preventDefault()
    setLastTicketId(makeDemoTicketId())
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setSubmitted(false)
    setMessage('')
    setSubject('')
    setContact('')
    setKind('feedback')
    setArea('')
    setPriority('normal')
    setShowDetails(false)
  }

  const inputCls =
    'mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'

  if (submitted) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
        <PageHeader title="Feedback" subtitle="Thank you — we've logged your note." breadcrumbs={[]} />

        <div className="mx-auto mt-10 w-full max-w-lg">
          <div className="rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900">We&apos;ve received your {selectedKind.label.toLowerCase()}</p>
            <p className="mt-2 font-mono text-sm font-semibold text-indigo-600">{lastTicketId}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Your account manager will review this in the demo flow. Production routes bugs within one business day.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button type="button" onClick={resetForm} className={helpPrimaryBtn}>
                Send another
              </button>
              <button
                type="button"
                onClick={() => navigate('/support/help')}
                className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader
        title="Feedback"
        subtitle="Share a bug, idea, or general note — we aim to respond within one business day."
        breadcrumbs={[]}
      />

      <div className="mx-auto mt-8 w-full max-w-xl">
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <fieldset>
            <legend className="text-sm font-medium text-gray-900">What would you like to share?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {KIND_OPTIONS.map((opt) => {
                const active = kind === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setKind(opt.id)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="fb-message" className="text-sm font-medium text-gray-900">
              Tell us what happened
            </label>
            <textarea
              id="fb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              maxLength={MESSAGE_SOFT_MAX + 200}
              className={`${inputCls} mt-2 min-h-[9rem] resize-y`}
              placeholder="Describe what you saw, what you expected, and any IDs (endorsement, claim, employee) that help us investigate."
            />
            <p className={`mt-1.5 text-right text-xs tabular-nums ${messageRemaining < 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {messageRemaining} characters left
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              aria-expanded={showDetails}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                aria-hidden
              />
              {showDetails ? 'Hide optional details' : 'Add optional details'}
            </button>
          </div>

          {showDetails ? (
            <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fb-area" className="text-sm font-medium text-gray-800">
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
                  <label htmlFor="fb-priority" className="text-sm font-medium text-gray-800">
                    Urgency
                  </label>
                  <select
                    id="fb-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={inputCls}
                  >
                    <option value="low">Routine</option>
                    <option value="normal">Normal</option>
                    <option value="high">High — payroll / closing</option>
                    <option value="critical">Critical — blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fb-subject" className="text-sm font-medium text-gray-800">
                  Subject <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="fb-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputCls}
                  placeholder="Short headline for your note"
                />
              </div>

              <div>
                <label htmlFor="fb-contact" className="text-sm font-medium text-gray-800">
                  Contact <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  id="fb-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={inputCls}
                  placeholder="Work email or phone"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              Prefer self-serve?{' '}
              <button type="button" onClick={() => navigate('/support/help')} className={helpLink}>
                Browse the help center
              </button>
            </p>
            <button
              type="submit"
              disabled={!message.trim()}
              className={`${helpPrimaryBtn} inline-flex w-full items-center justify-center gap-2 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Send className="h-4 w-4" aria-hidden />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
