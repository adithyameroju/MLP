import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import { GlobalSearchProvider } from './context/GlobalSearchContext'
import { EntityProvider } from './context/EntityContext'
import { EndorsementProvider } from './store/EndorsementStore'
import EndorsementsDashboard from './pages/EndorsementsDashboard'
import EndorsementSchedule from './pages/EndorsementSchedule'
import AddEmployee from './pages/AddEmployee'
import QuickAdd from './pages/QuickAdd'
import BulkUpload from './pages/BulkUpload'
import UpdateEmployee from './pages/UpdateEmployee'
import QuickUpdate from './pages/QuickUpdate'
import BulkUpdate from './pages/BulkUpdate'
import AddDependents from './pages/AddDependents'
import LifeEventSpouse from './pages/LifeEventSpouse'
import LifeEventNewborn from './pages/LifeEventNewborn'
import DeleteEmployee from './pages/DeleteEmployee'
import QuickDelete from './pages/QuickDelete'
import BulkDelete from './pages/BulkDelete'
import HRMSSync from './pages/HRMSSync'
import Dashboard from './pages/Dashboard'
import CdBalanceEnterprise from './pages/CdBalanceEnterprise'
import ModulePlaceholder from './pages/ModulePlaceholder'
import PolicyCoverage from './pages/PolicyCoverage'
import Claims from './pages/Claims'
import ClaimsDetail from './pages/ClaimsDetail'
import SupportFeedback from './pages/SupportFeedback'
import SupportHelpCenter from './pages/SupportHelpCenter'

function MainLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <GlobalSearchProvider>
      <EntityProvider>
      <EndorsementProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/claims/:claimId" element={<ClaimsDetail />} />
          <Route
            path="/enrolment"
            element={
              <ModulePlaceholder
                title="Enrolment"
                description="Employee and dependent enrolment overview, app requests, and eligibility — coming soon."
              />
            }
          />
          <Route path="/cd-balance" element={<CdBalanceEnterprise />} />
          <Route path="/policy-management" element={<Navigate to="/policy-management/coverage" replace />} />
          <Route path="/policy-management/coverage" element={<PolicyCoverage />} />
          <Route
            path="/reports"
            element={
              <ModulePlaceholder
                title="Reports"
                description="Claims experience, utilisation, downloads, and scheduled report status."
              />
            }
          />
          <Route
            path="/e-cards"
            element={
              <ModulePlaceholder
                title="Send e-Cards"
                description="Distribute digital ID cards and policy documents to employees and dependents."
              />
            }
          />
          <Route
            path="/network/hospitals"
            element={
              <ModulePlaceholder
                title="Hospital network"
                description="Search cashless hospitals and clinics in your insurer network."
              />
            }
          />
          <Route path="/endorsements/schedule" element={<EndorsementSchedule />} />
          <Route path="/" element={<EndorsementsDashboard />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/add/quick" element={<QuickAdd />} />
          <Route path="/add/bulk" element={<BulkUpload />} />
          <Route path="/update" element={<UpdateEmployee />} />
          <Route path="/update/quick" element={<QuickUpdate />} />
          <Route path="/update/bulk" element={<BulkUpdate />} />
          <Route path="/update/add-dependents" element={<AddDependents />} />
          <Route path="/update/life-event/spouse" element={<LifeEventSpouse />} />
          <Route path="/update/life-event/newborn" element={<LifeEventNewborn />} />
          <Route path="/delete" element={<DeleteEmployee />} />
          <Route path="/delete/quick" element={<QuickDelete />} />
          <Route path="/delete/bulk" element={<BulkDelete />} />
          <Route path="/hrms-sync" element={<HRMSSync />} />
          <Route path="/support/feedback" element={<SupportFeedback />} />
          <Route path="/support/help" element={<SupportHelpCenter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </EndorsementProvider>
      </EntityProvider>
    </GlobalSearchProvider>
  )
}
