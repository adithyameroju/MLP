import { useState } from 'react'
import { Play } from 'lucide-react'
import { getTopicTitle, helpVideoThumbnailSrc } from '../../data/supportHelpMock'
import {
  helpCardGridGap,
  helpCardHover,
  helpCardSurface,
  helpCardTitle,
  helpCategoryLabel,
} from '../../lib/helpUiTokens'
import HelpCardNewBadge from './HelpCardNewBadge'
import HelpVideoModal from './HelpVideoModal'

function HelpVideoThumbnail({ video }) {
  const [imgFailed, setImgFailed] = useState(false)
  const thumbnailSrc = video.thumbnailSrc ?? helpVideoThumbnailSrc(video.id)

  if (!imgFailed) {
    return (
      <img
        src={thumbnailSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => setImgFailed(true)}
      />
    )
  }

  if (video.videoSrc) {
    return (
      <video
        src={`${video.videoSrc}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }

  return <div className="absolute inset-0 bg-gray-200" aria-hidden />
}

function HelpVideoCard({ video, onPlay, className = '' }) {
  const category = getTopicTitle(video.topicId).toUpperCase()

  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className={`group relative flex h-full w-full cursor-pointer flex-col overflow-hidden text-left ${helpCardSurface} ${helpCardHover} ${className}`}
    >
      <div className="relative h-[138px] overflow-hidden border-b border-gray-200 bg-gray-100 sm:h-[148px]">
        <HelpVideoThumbnail video={video} />

        <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105">
            <Play size={22} className="ml-0.5 fill-indigo-600 text-indigo-600" aria-hidden />
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-3 pt-3">
        <p className={helpCategoryLabel}>{category}</p>
        <h3 className={`mt-1 line-clamp-2 ${helpCardTitle}`}>{video.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="tabular-nums text-xs font-medium text-gray-400">{video.duration}</span>
          <HelpCardNewBadge show={video.isNew} />
        </div>
      </div>
    </button>
  )
}

/**
 * @param {number} [limit] — max videos shown (e.g. 4 on help home)
 */
export default function HelpVideoList({ videos, emptyMessage, limit }) {
  const [activeVideo, setActiveVideo] = useState(null)
  const visible = limit != null ? videos.slice(0, limit) : videos

  if (visible.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-10 text-center">
        <p className="text-sm font-semibold text-gray-800">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <ul className={`grid list-none grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${helpCardGridGap}`}>
        {visible.map((v) => (
          <li key={v.id} className="flex min-w-0">
            <HelpVideoCard video={v} onPlay={setActiveVideo} />
          </li>
        ))}
      </ul>
      <HelpVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  )
}
