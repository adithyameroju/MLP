import PageHeader from '../components/PageHeader'
import PolicyCoverageHero from '../components/policy-coverage/PolicyCoverageHero'
import PolicyCoverageSearch from '../components/policy-coverage/PolicyCoverageSearch'
import PolicyDetailsAccordion from '../components/policy-coverage/PolicyDetailsAccordion'
import {
  policyCoverageHero,
  policyCoverageBands,
  policyDetailSections,
} from '../data/policyCoveragePageMock'

export default function PolicyCoverage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
      <PageHeader
        title="Policy coverage"
        subtitle="Master policy at a glance — answer employee questions without opening the PDF."
        breadcrumbs={[]}
      />

      <div className="mt-6 flex flex-col gap-8 lg:gap-10">
        <PolicyCoverageHero data={policyCoverageHero} bands={policyCoverageBands} />
        <PolicyCoverageSearch />
        <PolicyDetailsAccordion sections={policyDetailSections} bands={policyCoverageBands} />
      </div>
    </div>
  )
}
