import {
  helpBadgeBeta,
  helpBadgeLatest,
  helpBadgeMajor,
  helpBadgeMinor,
  helpBadgeNew,
} from '../../lib/helpUiTokens'

const VARIANT_CLASS = {
  new: helpBadgeNew,
  latest: helpBadgeLatest,
  beta: helpBadgeBeta,
  major: helpBadgeMajor,
  minor: helpBadgeMinor,
}

const VARIANT_LABEL = {
  new: 'New',
  latest: 'Latest',
  beta: 'Beta',
  major: 'Major',
  minor: 'Minor',
}

/** Semantic status pill — never use red for "New". */
export default function HelpBadge({ variant = 'new', label, className = '' }) {
  const text = label ?? VARIANT_LABEL[variant] ?? variant
  const classes = VARIANT_CLASS[variant] ?? helpBadgeNew

  return (
    <span className={`${classes} ${className}`.trim()}>
      {text}
    </span>
  )
}
