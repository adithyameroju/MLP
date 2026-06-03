import { Link } from 'react-router-dom'
import { ChevronRight, FileText } from 'lucide-react'
import { getArticleStepCount } from '../../data/supportHelpMock'
import HelpCardNewBadge from './HelpCardNewBadge'
import {
  helpCardGridGap,
  helpCardHover,
  helpCardPadding,
  helpCardSubtext,
  helpCardSurface,
  helpChipMeta,
  helpIconTile,
} from '../../lib/helpUiTokens'

function ArticleCard({ article, compact = false }) {
  const steps = getArticleStepCount(article)

  return (
    <Link
      to={`/support/help/articles/${article.id}`}
      className={`group relative flex h-full cursor-pointer flex-col ${helpCardSurface} ${helpCardPadding} ${helpCardHover} ${
        compact ? 'w-[220px] shrink-0' : 'w-full'
      }`}
      aria-label={`Read guide: ${article.title}`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className={helpIconTile}>
          <FileText size={18} aria-hidden />
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <HelpCardNewBadge show={article.isNew} />
          <ChevronRight
            size={18}
            className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600"
            aria-hidden
          />
        </span>
      </span>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-indigo-800">
        {article.title}
      </h3>
      <p className={`mt-2 ${helpCardSubtext}`}>{article.snippet}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
        {steps > 0 ? (
          <span className={helpChipMeta}>
            {steps} step{steps === 1 ? '' : 's'}
          </span>
        ) : null}
        <span className={helpChipMeta}>{article.readMinutes} min read</span>
      </div>
    </Link>
  )
}

/** Compact article tiles — snippet, chips, chevron; save guide only on article detail page. */
export default function HelpGuideCardGrid({ articles, layout = 'grid' }) {
  if (articles.length === 0) return null

  if (layout === 'row') {
    return (
      <ul className="flex flex-nowrap list-none gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {articles.map((a) => (
          <li key={a.id} className="flex">
            <ArticleCard article={a} compact />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={`grid list-none grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${helpCardGridGap}`}>
      {articles.map((a) => (
        <li key={a.id} className="flex">
          <ArticleCard article={a} />
        </li>
      ))}
    </ul>
  )
}
