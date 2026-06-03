import HelpBadge from './HelpBadge'

/** Inline "New" badge — place beside title or before chevron (never absolute top-right). */
export default function HelpCardNewBadge({ show, className = '' }) {
  if (!show) return null
  return <HelpBadge variant="new" className={className} />
}
