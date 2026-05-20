import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function SupportFeedback() {
  const [searchParams] = useSearchParams()
  const cdDisputePresetApplied = useRef(false)
  const [kind, setKind] = useState('feedback')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (cdDisputePresetApplied.current) return
    if (searchParams.get('preset') !== 'cd_dispute') return
    cdDisputePresetApplied.current = true
    setSubject('CD ledger dispute — ')
    setMessage(
      'Please include: transaction date, amount, ledger description, and why you believe the entry is incorrect.\n\n',
    )
  }, [searchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
        <PageHeader title="Feedback" subtitle="Received." breadcrumbs={[]} />
        <div className="mt-6 w-full min-w-0 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" aria-hidden />
          <p className="mt-3 text-base font-semibold text-gray-900">Thank you</p>
          <p className="mt-1 text-sm text-gray-600">Demo only — connect this form to your ticketing API when ready.</p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false)
              setSubject('')
              setMessage('')
              setContact('')
              setKind('feedback')
            }}
            className="mt-5 text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
          >
            Send another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
      <PageHeader
        title="Feedback"
        subtitle="Tell us what’s wrong or what you need."
        breadcrumbs={[]}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 w-full min-w-0 space-y-4"
      >
        <div className="flex gap-6 text-sm text-gray-800">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="kind"
              value="feedback"
              checked={kind === 'feedback'}
              onChange={() => setKind('feedback')}
              className="accent-indigo-600"
            />
            Feedback
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="kind"
              value="request"
              checked={kind === 'request'}
              onChange={() => setKind('request')}
              className="accent-indigo-600"
            />
            Request
          </label>
        </div>

        <div>
          <label htmlFor="fb-subject" className="text-sm text-gray-700">
            Subject
          </label>
          <input
            id="fb-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            placeholder="Short summary"
          />
        </div>

        <div>
          <label htmlFor="fb-message" className="text-sm text-gray-700">
            Message
          </label>
          <textarea
            id="fb-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            placeholder="What happened or what do you need?"
          />
        </div>

        <div>
          <label htmlFor="fb-contact" className="text-sm text-gray-700">
            Contact <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="fb-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            placeholder="Email or phone"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
        >
          <Send className="h-4 w-4" aria-hidden />
          Submit
        </button>
      </form>
    </div>
  )
}
