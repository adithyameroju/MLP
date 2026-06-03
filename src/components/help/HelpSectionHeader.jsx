import { helpSectionSubtitle, helpSectionTitle } from '../../lib/helpUiTokens'

/** Section heading row — title, optional subtitle, optional trailing action (See all, etc.) */
export default function HelpSectionHeader({ id, title, subtitle, action = null }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {id ? (
          <h2 id={id} className={helpSectionTitle}>
            {title}
          </h2>
        ) : (
          <h2 className={helpSectionTitle}>{title}</h2>
        )}
        {subtitle ? <p className={helpSectionSubtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
