import { Link } from 'react-router-dom'
import {
  BarChart3,
  ChevronRight,
  ClipboardSignature,
  Compass,
  FileHeart,
  FileText,
  Rocket,
  Shield,
  Wallet,
} from 'lucide-react'
import HelpCardNewBadge from './HelpCardNewBadge'
import {
  countArticlesForTopic,
  countVideosForTopic,
  getTopicNavigationPath,
  helpTopics,
} from '../../data/supportHelpMock'
import { helpCardGridGap, helpCardHover, helpCardPadding, helpCardSubtext, helpCardSurface, helpCardTitle, helpSectionBody, helpSectionSubtitle, helpSectionTitle } from '../../lib/helpUiTokens'

const TOPIC_ICONS = {
  'getting-started': Compass,
  claims: FileHeart,
  endorsements: FileText,
  policy: Shield,
  cd: Wallet,
  enrolment: ClipboardSignature,
  reports: BarChart3,
  releases: Rocket,
}

function topicMetaLine(topicId, releaseGuideCount) {
  if (topicId === 'releases') {
    const n = releaseGuideCount
    return `${n} release guide${n === 1 ? '' : 's'}`
  }
  const guides = countArticlesForTopic(topicId)
  const videos = countVideosForTopic(topicId)
  return `${guides} guide${guides === 1 ? '' : 's'} · ${videos} video${videos === 1 ? '' : 's'}`
}

export default function BrowseByTopic({ releaseGuideCount = 0 }) {
  return (
    <section className="w-full" aria-labelledby="help-browse-topics-heading">
      <h2 id="help-browse-topics-heading" className={helpSectionTitle}>
        Browse by topic
      </h2>
      <p className={helpSectionSubtitle}>Guides and videos organised by module.</p>
      <ul className={`${helpSectionBody} grid list-none grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${helpCardGridGap}`}>
        {helpTopics.map((topic) => {
          const Icon = TOPIC_ICONS[topic.id] ?? FileText
          const to = getTopicNavigationPath(topic.id)
          return (
            <li key={topic.id} className="flex">
              <Link
                to={to}
                className={`group flex h-full w-full cursor-pointer flex-col ${helpCardSurface} ${helpCardPadding} text-left ${helpCardHover}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${topic.iconBg} ${topic.iconFg}`}
                  >
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <HelpCardNewBadge show={topic.isNew} />
                    <ChevronRight
                      size={18}
                      className="text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600"
                      aria-hidden
                    />
                  </span>
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`line-clamp-2 ${helpCardTitle}`}>{topic.title}</span>
                </span>
                <span className={`mt-1 ${helpCardSubtext}`}>{topic.subtitle}</span>
                <span className="mt-auto pt-2 tabular-nums text-xs font-medium text-gray-400">
                  {topicMetaLine(topic.id, releaseGuideCount)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
