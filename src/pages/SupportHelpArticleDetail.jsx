import { useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Clock, Lightbulb, Star } from 'lucide-react'
import { useHelpFavorites } from '../context/HelpFavoritesContext'
import PageHeader from '../components/PageHeader'
import HelpArticleFeedback from '../components/help/HelpArticleFeedback'
import HelpCenterEscalation from '../components/help/HelpCenterEscalation'
import HelpCardNewBadge from '../components/help/HelpCardNewBadge'
import {
  helpCalloutWarning,
  helpCardSurface,
  helpChipMeta,
  helpLink,
  helpSecondaryBtn,
  helpSectionTitle,
  helpStepBadge,
} from '../lib/helpUiTokens'
import {
  formatHelpDate,
  getArticleStepCount,
  getKnowledgeArticleById,
  getTopicTitle,
} from '../data/supportHelpMock'

function articleContextSentence(bestWhen, outcome) {
  const when = (bestWhen ?? '').trim().replace(/\.$/, '')
  const result = (outcome ?? '').trim().replace(/\.$/, '')
  if (!when && !result) return ''
  if (!when) return `${result}.`
  if (!result) return `${when}.`

  const whenLower = when.charAt(0).toLowerCase() + when.slice(1)
  let outcomeText = result
  if (/^you will /i.test(outcomeText)) {
    outcomeText = outcomeText.replace(/^you will /i, "you'll ")
  } else if (/^You will /.test(outcomeText)) {
    outcomeText = outcomeText.replace(/^You will /, "You'll ")
  } else if (!/^you'll/i.test(outcomeText) && !/^You'll/.test(outcomeText)) {
    outcomeText = `You'll ${outcomeText.charAt(0).toLowerCase()}${outcomeText.slice(1)}`
  }

  return `Use this when ${whenLower}. ${outcomeText}${outcomeText.endsWith('.') ? '' : '.'}`
}

function ProcedureStepList({ steps }) {
  if (steps.length === 0) return null

  return (
    <ol className="mt-4">
      {steps.map((step, idx) => (
        <li key={`${step.title}-${idx}`} className="relative flex gap-4 pb-8 last:pb-0">
          <div className="relative flex flex-col items-center">
            <span className={`${helpStepBadge} relative z-10 bg-gray-100`} aria-hidden>
              {idx + 1}
            </span>
            {idx < steps.length - 1 ? (
              <span
                className="absolute top-7 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-200"
                aria-hidden
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function SupportHelpArticleDetail() {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const { isArticleFavorite, toggleArticleFavorite } = useHelpFavorites()

  const article = useMemo(() => (articleId ? getKnowledgeArticleById(articleId) : null), [articleId])

  if (!article) {
    return <Navigate to="/support/help" replace />
  }

  const favorited = isArticleFavorite(article.id)
  const topicLabel = getTopicTitle(article.topicId)
  const steps = article.procedureSteps ?? []
  const stepCount = getArticleStepCount(article)
  const contextSentence = articleContextSentence(article.bestWhen, article.outcome)
  const breadcrumbs = [
    { label: 'Help center', path: '/support/help' },
    { label: topicLabel, path: `/support/help/topics/${article.topicId}` },
    { label: article.title },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-6 lg:px-8">
      <PageHeader title={article.title} subtitle={article.snippet} breadcrumbs={breadcrumbs} />

      <div className="mt-6 w-full min-w-0 space-y-6">
        <article className={`${helpCardSurface} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className={`inline-flex items-center gap-1.5 ${helpChipMeta} normal-case tracking-normal px-2.5 py-1`}>
                <Clock size={13} className="text-gray-500" aria-hidden />
                {article.readMinutes} min read
              </span>
              {stepCount > 0 ? (
                <span className={`${helpChipMeta} normal-case tracking-normal px-2.5 py-1`}>
                  {stepCount} steps
                </span>
              ) : null}
              {article.publishedAt ? (
                <time dateTime={article.publishedAt} className={`${helpChipMeta} normal-case tracking-normal px-2.5 py-1`}>
                  Added {formatHelpDate(article.publishedAt)}
                </time>
              ) : null}
              <HelpCardNewBadge show={article.isNew} />
              <span className="text-gray-400">{topicLabel}</span>
            </div>
            <button
              type="button"
              onClick={() => toggleArticleFavorite(article.id)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/40 ${
                favorited
                  ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/60'
              }`}
              aria-pressed={favorited}
            >
              <Star size={14} className={favorited ? 'fill-current' : ''} aria-hidden />
              {favorited ? 'Saved' : 'Save guide'}
            </button>
          </div>

          {contextSentence ? (
            <div className={`mt-5 ${helpCalloutWarning}`}>
              <p className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
                <span>{contextSentence}</span>
              </p>
            </div>
          ) : null}

          <section className="mt-8" aria-labelledby="article-steps-heading">
            <h2 id="article-steps-heading" className={helpSectionTitle}>
              Step-by-step
            </h2>
            <p className="mt-1 text-sm text-gray-500">Follow these steps in order to complete the task in the portal.</p>
            <ProcedureStepList steps={steps} />
          </section>

          {article.tryItPath ? (
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => navigate(article.tryItPath)}
                className={`${helpSecondaryBtn} gap-2 px-4 py-2 text-sm`}
              >
                {article.tryItLabel ?? 'Try it in the product'}
                <ArrowRight size={14} aria-hidden />
              </button>
              <Link to={`/support/help/topics/${article.topicId}`} className={helpLink}>
                More {topicLabel.toLowerCase()} guides
              </Link>
            </div>
          ) : (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <Link to={`/support/help/topics/${article.topicId}`} className={helpLink}>
                ← More {topicLabel.toLowerCase()} guides
              </Link>
            </div>
          )}
        </article>

        <HelpArticleFeedback
          articleId={article.id}
          articleTitle={article.title}
          topicId={article.topicId}
        />

        <HelpCenterEscalation
          emphasis="default"
          onFeedback={() => navigate('/support/feedback')}
          contactLinkTo="/support/help#help-contact-heading"
        />
      </div>
    </div>
  )
}
