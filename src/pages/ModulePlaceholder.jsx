import PageHeader from '../components/PageHeader'

/**
 * Placeholder for sidebar modules (Claims, Reports, e-Cards, Hospital network, etc.).
 * Uses the same page shell and PageHeader contract as CdBalance / Policy coverage.
 */
export default function ModulePlaceholder({ title, description }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-gray-50 px-6 py-3 lg:px-8">
      <PageHeader title={title} subtitle={description} breadcrumbs={[]} />
      <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-sm">
        MLP placeholder — wire to backend when APIs are available.
      </div>
    </div>
  )
}
