import { keyAccountManager, supportContactActions } from '../../data/supportHelpMock'
import { helpCardGridGap, helpSectionSubtitle, helpSectionTitle } from '../../lib/helpUiTokens'
import HelpSupportActionCard from './HelpSupportActionCard'

export default function HelpContactGrid({ topicLabel = null }) {
  return (
    <section className="w-full" aria-labelledby="help-contact-heading" id="help-contact-heading">
      <h2 id="help-contact-heading" className={helpSectionTitle}>
        Contact support
      </h2>
      <p className={helpSectionSubtitle}>
        {topicLabel
          ? `Your Key Account Manager can help with ${topicLabel.toLowerCase()} — chat, email, or call.`
          : 'One dedicated partner for your account — chat with our assistant, email, or call directly.'}
      </p>

      <div className={`mt-4 grid list-none grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${helpCardGridGap}`}>
        {supportContactActions.map((action) => (
          <HelpSupportActionCard key={action.id} action={action} />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Your account manager</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-gray-900">{keyAccountManager.name}</span>
          <span className="text-xs text-gray-500">· {keyAccountManager.role}</span>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          {keyAccountManager.email}
          <span className="mx-1.5 text-gray-300" aria-hidden>
            ·
          </span>
          {keyAccountManager.phoneDisplay}
          <span className="mx-1.5 text-gray-300" aria-hidden>
            ·
          </span>
          {keyAccountManager.hours}
        </p>
      </div>
    </section>
  )
}
