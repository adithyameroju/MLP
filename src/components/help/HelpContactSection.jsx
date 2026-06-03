import { keyAccountManager, supportContactActions } from '../../data/supportHelpMock'
import { helpLink } from '../../lib/helpUiTokens'
import HelpBrowseBand from './HelpBrowseBand'
import HelpSupportActionCard from './HelpSupportActionCard'
import { Phone } from 'lucide-react'

export default function HelpContactSection({ subtitle }) {
  return (
    <HelpBrowseBand
      headingId="help-contact-heading"
      accentClass="border-l-[3px] border-l-gray-800"
      accentIconBg="bg-gray-900"
      accentIconFg="text-white"
      icon={Phone}
      title="Contact support"
      description={subtitle ?? 'One dedicated Key Account Manager — chat, email, or call.'}
      countLabel="Support"
      toolbar={null}
    >
      <div className="-m-px grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {supportContactActions.map((action) => (
          <HelpSupportActionCard key={action.id} action={action} />
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{keyAccountManager.name}</span>
        <span className="text-gray-500"> · {keyAccountManager.role} · </span>
        <a href={`mailto:${keyAccountManager.email}`} className={helpLink}>
          {keyAccountManager.email}
        </a>
      </div>
    </HelpBrowseBand>
  )
}
