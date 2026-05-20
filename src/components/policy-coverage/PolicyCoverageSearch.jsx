import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import PolicyAnswerCard from './PolicyAnswerCard'
import { predefinedQuestions, resolvePolicyAnswer, getPolicyAnswerByStubId } from '../../data/policyCoveragePageMock'

const SUGGESTED_CHIPS = predefinedQuestions.slice(0, 3)

export default function PolicyCoverageSearch() {
  const [query, setQuery] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [copiedFlash, setCopiedFlash] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempted(true)
    setAnswer(resolvePolicyAnswer(query))
  }

  const handleChip = (pq) => {
    setQuery(pq.label)
    setAttempted(true)
    setAnswer(getPolicyAnswerByStubId(pq.stubId))
  }

  const handleCopied = () => {
    setCopiedFlash(true)
    window.setTimeout(() => setCopiedFlash(false), 2000)
  }

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="policy-search-heading"
    >
      <h2 id="policy-search-heading" className="text-lg font-bold tracking-tight text-gray-900">
        Ask about this policy
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question…"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
        >
          Answer
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_CHIPS.map((pq) => (
          <button
            key={pq.id}
            type="button"
            onClick={() => handleChip(pq)}
            className="rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1 text-xs font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            {pq.label}
          </button>
        ))}
      </div>

      <div className="relative mt-5">
        {copiedFlash ? (
          <p className="absolute -top-0.5 right-0 z-10 text-xs font-medium text-emerald-600" role="status">
            Copied
          </p>
        ) : null}

        {!attempted && (
          <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
            Answers use demo keyword matching. For broader help see{' '}
            <Link to="/support/help" className="font-medium text-indigo-600 hover:underline">
              Help center
            </Link>
            .
          </p>
        )}

        {attempted && !answer && (
          <div className="rounded-lg border border-amber-100 bg-amber-50/70 px-4 py-3">
            <p className="text-sm text-amber-950">
              No quick match — try different words or open a section below.
            </p>
          </div>
        )}

        {answer ? <PolicyAnswerCard answer={answer} onCopied={handleCopied} /> : null}
      </div>
    </section>
  )
}
