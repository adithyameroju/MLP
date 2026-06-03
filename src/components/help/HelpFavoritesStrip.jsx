import HelpGuideCardGrid from './HelpGuideCardGrid'
import { helpSectionBody, helpSectionSubtitle, helpSectionTitle } from '../../lib/helpUiTokens'

export default function HelpFavoritesStrip({ articles }) {
  if (articles.length === 0) return null

  return (
    <section className="w-full" aria-labelledby="help-favorites-heading">
      <h2 id="help-favorites-heading" className={helpSectionTitle}>
        Saved guides
      </h2>
      <p className={helpSectionSubtitle}>Guides you starred for quick access.</p>
      <div className={helpSectionBody}>
        <HelpGuideCardGrid articles={articles} layout="row" />
      </div>
    </section>
  )
}
