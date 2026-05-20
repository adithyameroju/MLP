import { Copy, ExternalLink, ChevronRight } from 'lucide-react'
import { answerStatusBadgeClass, answerStatusLabel } from '../../data/policyCoveragePageMock'

function scrollToPolicySection(sectionId) {
  if (!sectionId) return
  const el = document.getElementById(sectionId)
  if (!el) return
  if (el.tagName === 'DETAILS') el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  el.classList.add('ring-2', 'ring-violet-400', 'ring-offset-2', 'rounded-2xl', 'transition-shadow')
  window.setTimeout(() => {
    el.classList.remove('ring-2', 'ring-violet-400', 'ring-offset-2', 'rounded-2xl', 'transition-shadow')
  }, 2000)
}

export default function PolicyAnswerCard({ answer, onCopied }) {
  if (!answer) return null

  const badgeLabel = answerStatusLabel(answer.status)
  const badgeClass = answerStatusBadgeClass(answer.status)

  const buildCopyText = () => {
    const lines = [
      answer.title,
      `${badgeLabel}: ${answer.summary}`,
      ...(answer.details || []),
      answer.bandNotes?.length
        ? '\nBands:\n' + answer.bandNotes.map((b) => `• ${b.band}: ${b.note}`).join('\n')
        : '',
      answer.reference ? `\nReference: ${answer.reference}` : '',
    ].filter(Boolean)
    return lines.join('\n')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText())
      if (typeof onCopied === 'function') onCopied()
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Answer</p>
          <h2 className="mt-0.5 text-xl font-bold text-gray-900">{answer.title}</h2>
        </div>
        <span className={`shrink-0 rounded-lg border px-3 py-1 text-xs font-bold ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed text-gray-800">{answer.summary}</p>

      {answer.details?.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          {answer.details.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      {answer.bandNotes?.length > 0 && (
        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-800">Applicable bands</p>
          <ul className="mt-2 space-y-2">
            {answer.bandNotes.map((b, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold text-gray-900">{b.band}</span>
                <span className="text-gray-600"> — {b.note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-600">
        <span className="font-semibold text-gray-500">Reference · </span>
        {answer.reference}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Copy answer
        </button>
        <button
          type="button"
          onClick={() => scrollToPolicySection(answer.jumpSectionId)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100 cursor-pointer"
        >
          Jump to section
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollToPolicySection(answer.viewSourceSectionId)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-900 transition hover:bg-violet-100 cursor-pointer"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          View source
        </button>
      </div>
    </div>
  )
}
