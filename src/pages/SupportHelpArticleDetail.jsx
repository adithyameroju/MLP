import { useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BookOpen, Clock, FileText, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import HelpCenterEscalation from '../components/help/HelpCenterEscalation'
import { getKnowledgeArticleById } from '../data/supportHelpMock'

export default function SupportHelpArticleDetail() {
  const { articleId } = useParams()
  const navigate = useNavigate()

  const article = useMemo(() => (articleId ? getKnowledgeArticleById(articleId) : null), [articleId])

  if (!article) {
    return <Navigate to="/support/help" replace />
  }

  const breadcrumbs = [{ label: 'Help center', path: '/support/help' }, { label: article.title }]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader title={article.title} subtitle={article.snippet} breadcrumbs={breadcrumbs} />

      <div className="w-full min-w-0 space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/90 px-3 py-1 text-xs font-semibold text-gray-800">
              <Clock size={14} className="text-indigo-500" aria-hidden />
              {article.readMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <BookOpen size={14} className="text-indigo-500" aria-hidden />
              Guide
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Best when</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-800">{article.bestWhen}</p>
          </div>

          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">What you&apos;ll get out of this</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-800">{article.outcome}</p>
          </div>

          <div className="mt-8 space-y-8">
            {(article.detailSections ?? []).map((section) => (
              <section key={section.id} className="scroll-mt-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <FileText size={18} className="text-indigo-600" aria-hidden />
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {article.tryItPath ? (
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => navigate(article.tryItPath)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              >
                <Sparkles size={16} aria-hidden />
                {article.tryItLabel ?? 'Try it in the product'}
              </button>
              <Link
                to="/support/help"
                className="text-sm font-medium text-indigo-600 underline-offset-4 hover:underline"
              >
                Back to Help center
              </Link>
            </div>
          ) : (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <Link
                to="/support/help"
                className="text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline"
              >
                ← Back to Help center
              </Link>
            </div>
          )}
        </div>

        <HelpCenterEscalation
          emphasis="default"
          onFeedback={() => navigate('/support/feedback')}
          contactLinkTo="/support/help#help-contact-heading"
        />
      </div>
    </div>
  )
}
