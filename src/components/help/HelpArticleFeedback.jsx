import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { helpFeedbackBtn, helpLink } from '../../lib/helpUiTokens'

const STORAGE_PREFIX = 'help-article-feedback:'

function storageKey(articleId) {
  return `${STORAGE_PREFIX}${articleId}`
}

/** Compact one-line "Was this helpful?" row. */
export default function HelpArticleFeedback({ articleId, articleTitle, topicId }) {
  const [vote, setVote] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(articleId))
      if (stored === 'yes' || stored === 'no') setVote(stored)
    } catch {
      /* ignore */
    }
  }, [articleId])

  const recordVote = (value) => {
    setVote(value)
    try {
      localStorage.setItem(storageKey(articleId), value)
    } catch {
      /* ignore */
    }
  }

  const feedbackHref = `/support/feedback?preset=help_article&article=${encodeURIComponent(articleId)}&topic=${encodeURIComponent(topicId ?? '')}`

  return (
    <div className="flex flex-wrap items-center gap-3" aria-labelledby="help-article-feedback-heading">
      {vote ? (
        <>
          <p className="text-sm text-gray-600">Thanks for your feedback.</p>
          {vote === 'no' ? (
            <Link to={feedbackHref} className={`${helpLink} text-xs`}>
              Tell us more
            </Link>
          ) : null}
        </>
      ) : (
        <>
          <p id="help-article-feedback-heading" className="text-sm text-gray-700">
            Was this helpful?
          </p>
          <button
            type="button"
            onClick={() => recordVote('yes')}
            className={`${helpFeedbackBtn} gap-1.5`}
            aria-label={`Yes, ${articleTitle} was helpful`}
          >
            <ThumbsUp size={14} aria-hidden />
            Yes
          </button>
          <button
            type="button"
            onClick={() => recordVote('no')}
            className={`${helpFeedbackBtn} gap-1.5`}
            aria-label={`No, ${articleTitle} was not helpful`}
          >
            <ThumbsDown size={14} aria-hidden />
            No
          </button>
        </>
      )}
    </div>
  )
}
