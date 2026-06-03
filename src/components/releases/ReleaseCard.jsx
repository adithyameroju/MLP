import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import HelpBadge from '../help/HelpBadge'
import { formatReleaseDate, releaseTypeLabel } from '../../data/newReleasesMock'
import {
  helpCardHover,
  helpCardPadding,
  helpCardSubtext,
  helpCardSurface,
  helpChip,
  helpSecondaryBtn,
} from '../../lib/helpUiTokens'

const TYPE_VARIANT = {
  major: 'major',
  minor: 'minor',
  patch: 'minor',
}

function RichSteps({ lines }) {
  return (
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
      {lines.map((line, idx) => (
        <li key={idx} className="leading-relaxed">
          {line.split('**').map((chunk, i) =>
            i % 2 === 1 ? (
              <strong key={`${line}-${i}`} className="font-semibold text-gray-800">
                {chunk}
              </strong>
            ) : (
              <span key={`${line}-${i}`}>{chunk}</span>
            ),
          )}
        </li>
      ))}
    </ol>
  )
}

function ReleaseTypeBadge({ type }) {
  if (!type) return null
  const variant = TYPE_VARIANT[type] ?? 'minor'
  return <HelpBadge variant={variant} label={releaseTypeLabel(type)} />
}

export function ReleaseMetaRow({ item, showLatest = false }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {item.version ? (
          <span className="text-sm font-bold tabular-nums text-gray-900">{item.version}</span>
        ) : null}
        <ReleaseTypeBadge type={item.releaseType} />
        {showLatest ? <HelpBadge variant="latest" /> : null}
      </div>
      {item.releasedAt ? (
        <time dateTime={item.releasedAt} className="text-sm text-gray-500">
          {formatReleaseDate(item.releasedAt)}
        </time>
      ) : null}
    </div>
  )
}

function ReleaseTags({ tags, className = 'mt-2.5' }) {
  if (!tags?.length) return null
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span key={tag} className={helpChip}>
          {tag}
        </span>
      ))}
    </div>
  )
}

/** Collapsed release summary — shared by full card and help center teaser */
export function ReleaseCardSummary({ item, showLatest = false, titleAs = 'h2' }) {
  const TitleTag = titleAs
  return (
    <>
      <ReleaseMetaRow item={item} showLatest={showLatest} />
      <TitleTag className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-gray-900 sm:text-base">
        {item.title}
      </TitleTag>
      <p className={`mt-1 ${helpCardSubtext} text-sm text-gray-600`}>{item.summary}</p>
      <ReleaseTags tags={item.tags} />
    </>
  )
}

/** Full card for /new-releases — title + summary + chips; expand for details */
export function ReleaseCard({ item, navigate, prominent = false }) {
  const [open, setOpen] = useState(false)

  return (
    <article
      className={`overflow-hidden ${helpCardSurface} ${helpCardHover} ${
        prominent ? 'border-indigo-200 ring-1 ring-indigo-100' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full cursor-pointer items-start gap-3 text-left ${helpCardPadding}`}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <ReleaseCardSummary item={item} showLatest={prominent} titleAs="h2" />
        </div>
        <ChevronDown
          size={18}
          className={`mt-1 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          {item.steps?.length ? (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Walkthrough</p>
              <RichSteps lines={item.steps} />
            </div>
          ) : null}

          {item.tryItPath ? (
            <button
              type="button"
              onClick={() => navigate(item.tryItPath)}
              className={`${helpSecondaryBtn} mt-4 gap-1 px-3 py-2 text-xs`}
            >
              {item.tryItLabel}
              <ArrowRight size={14} aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

/** Compact teaser for help center grid — same collapsed metadata as inner release cards */
export function ReleaseTeaserCard({ item, onViewRelease, showLatest = false }) {
  return (
    <button
      type="button"
      onClick={onViewRelease}
      className={`flex h-full w-full cursor-pointer flex-col text-left ${helpCardSurface} ${helpCardPadding} ${helpCardHover}`}
    >
      <ReleaseCardSummary item={item} showLatest={showLatest} titleAs="h3" />
    </button>
  )
}
