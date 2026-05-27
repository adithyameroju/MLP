import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileHeart,
  FileText,
  ClipboardSignature,
  Wallet,
  Shield,
  BarChart3,
  MessageSquare,
  Headphones,
  Sparkles,
  Bell,
  HelpCircle,
  Menu,
  Search,
  ChevronDown,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { useEntity } from '../context/EntityContext'
import FloatingAiChat from './FloatingAiChat'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileHeart, label: 'Claims', path: '/claims' },
  { icon: FileText, label: 'Endorsements', path: '/' },
  { icon: ClipboardSignature, label: 'Enrolment', path: '/enrolment' },
  { icon: Wallet, label: 'CD Balance', path: '/cd-balance' },
  { icon: Shield, label: 'Policy coverage', path: '/policy-management/coverage' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: MessageSquare, label: 'Feedback', path: '/support/feedback' },
  { icon: Headphones, label: 'Help center', path: '/support/help' },
]

/** Highlighted sidebar section for release tutorials */
const newReleasesNavItem = { icon: Sparkles, label: 'New releases', path: '/new-releases' }

const endorsementPaths = ['/', '/add', '/update', '/delete', '/hrms-sync', '/endorsements/schedule']

function isEndorsementRoute(pathname) {
  return endorsementPaths.some(p =>
    p === '/' ? pathname === '/' : pathname.startsWith(p)
  )
}

function globalSearchPlaceholder(pathname) {
  if (pathname.startsWith('/dashboard')) return 'Search employees by name, ID, or email'
  if (pathname.startsWith('/claims')) return 'Search claims by employee name, ID, or claim ID'
  if (pathname.startsWith('/enrolment')) return 'Search enrolments by employee name or ID'
  if (pathname.startsWith('/cd-balance')) return 'Search transactions by description or reference'
  if (pathname.startsWith('/hrms-sync')) return 'Search by name, ID, or email'
  if (pathname.startsWith('/support/help')) return 'Search guides and videos…'
  if (pathname.startsWith('/new-releases')) return 'Search release tutorials…'
  return 'Search portal…'
}

function CompanySelect({ entityId, setEntityId, entityOptions, idPrefix }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const listId = `${idPrefix}-entity-listbox`
  const selected = entityOptions.find((e) => e.id === entityId) ?? entityOptions[0]

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      className="relative w-[min(10.5rem,30vw)] min-w-0 max-w-[11.5rem] shrink-0 sm:max-w-[12.5rem]"
      ref={containerRef}
    >
      <button
        type="button"
        id={`${idPrefix}-entity-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white pl-2.5 pr-2 text-left text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
      >
        <span className="min-w-0 flex-1 truncate" title={selected?.label}>
          {selected?.label}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${idPrefix}-entity-trigger`}
          className="absolute right-0 z-50 mt-1 max-h-60 min-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-md"
        >
          {entityOptions.map((opt) => (
            <li key={opt.id} className="px-0" role="none">
              <button
                type="button"
                role="option"
                aria-selected={opt.id === entityId}
                onClick={() => {
                  setEntityId(opt.id)
                  setOpen(false)
                }}
                className={`flex w-full cursor-pointer px-3 py-1.5 text-left text-sm text-gray-800 transition-colors hover:bg-gray-50 ${
                  opt.id === entityId ? 'bg-indigo-50 text-indigo-800' : ''
                }`}
              >
                <span className="truncate" title={opt.label}>
                  {opt.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { query, setQuery } = useGlobalSearch()
  const { entityId, setEntityId, entityOptions } = useEntity()
  const searchPlaceholder = useMemo(() => globalSearchPlaceholder(location.pathname), [location.pathname])
  const NewReleasesIcon = newReleasesNavItem.icon

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside
        className={`${collapsed ? 'w-[72px]' : 'w-[250px]'} bg-sidebar flex flex-col transition-all duration-200 flex-shrink-0`}
      >
        <div className={`flex items-center gap-3 px-5 h-16 border-b border-white/10 ${collapsed ? 'justify-center px-0' : ''}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">ACKO for Business</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === '/'
                  ? isEndorsementRoute(location.pathname)
                  : item.path === '/policy-management/coverage'
                    ? location.pathname.startsWith('/policy-management')
                    : item.path.startsWith('/support/')
                      ? location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      : location.pathname.startsWith(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.label : undefined}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer
                  ${isActive
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-indigo-200 hover:bg-sidebar-hover hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              )
            })}
          </div>

          <div className={`mt-4 pt-4 border-t border-white/15 ${collapsed ? 'space-y-1' : 'space-y-2'}`}>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-indigo-300/90">
                New releases & tutorials
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate(newReleasesNavItem.path)}
              title={collapsed ? newReleasesNavItem.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ring-1 ring-white/15 bg-white/5
                ${
                  location.pathname.startsWith(newReleasesNavItem.path)
                    ? 'bg-indigo-500 text-white font-medium ring-transparent'
                    : 'text-white/95 hover:bg-white/10 hover:ring-white/25'
                }
                ${collapsed ? 'justify-center' : ''}`}
            >
              <NewReleasesIcon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{newReleasesNavItem.label}</span>}
            </button>
          </div>
        </nav>

        <div className={`p-3 border-t border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <div className="px-3 py-2">
              <svg width="120" height="29" viewBox="0 0 590 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M251.777 1.21069H276.615L316.195 95.4729H288.57L281.797 78.763H245.935L239.288 95.4729H212.197L251.777 1.21069ZM274.362 58.562L263.999 31.9557L253.51 58.562H274.362Z" fill="#818CF8"/>
                <path d="M310.068 48.6091V48.3417C310.068 21.2568 330.921 0 359.082 0C378.077 0 390.299 7.9678 398.535 19.3846L379.146 34.3911C373.838 27.7465 367.727 23.4952 358.828 23.4952C345.818 23.4952 336.651 34.5177 336.651 48.0602V48.3277C336.651 62.2783 345.818 73.1602 358.828 73.1602C368.529 73.1602 374.233 68.6414 379.808 61.8701L399.197 75.68C390.425 87.7584 378.612 96.6554 358.026 96.6554C331.457 96.6554 310.082 76.3417 310.082 48.5811L310.068 48.6091Z" fill="#818CF8"/>
                <path d="M407.279 1.21069H433.045V39.4589L465.051 1.21069H495.605L460.404 41.7395L496.803 95.4729H465.853L442.48 60.4623L433.045 71.1048V95.4729H407.279V1.21069Z" fill="#818CF8"/>
                <path d="M489.158 48.6091V48.3417C489.158 21.651 510.672 0 539.369 0C568.064 0 589.311 21.3836 589.311 48.0743V48.3417C589.311 75.0324 567.796 96.6834 539.101 96.6834C510.405 96.6834 489.158 75.3 489.158 48.6091ZM563.009 48.6091V48.3417C563.009 34.926 553.307 23.2418 539.101 23.2418C524.894 23.2418 515.587 34.6585 515.587 48.0743V48.3417C515.587 61.7574 525.289 73.4416 539.354 73.4416C553.42 73.4416 562.995 62.0249 562.995 48.6091H563.009Z" fill="#818CF8"/>
                <path d="M188.638 50.411V93.2344C188.638 96.5145 187.104 99.3581 184.02 101.329C145.285 125.894 115.955 136.213 105.705 139.084C91.5541 143.04 84.0493 142.631 82.8385 142.548C57.0009 140.745 13.4785 106.312 13.4785 106.312C13.4785 106.312 48.9892 114.716 131.036 76.9046C146.425 69.8096 163.589 62.1656 183.555 53.2124C183.555 53.2124 187.92 51.3965 188.652 50.411H188.638Z" fill="#6366F1"/>
                <path d="M186.358 49.2146C186.851 48.9049 187.512 48.4967 187.738 47.6802C187.948 46.9482 187.85 46.0331 187.428 45.3715C186.668 44.1609 185.4 43.3585 184.006 42.4716C145.285 17.9207 115.956 7.6019 105.691 4.73011C91.5404 0.774368 84.0356 1.18261 82.8247 1.26708C56.9872 3.06898 13.4648 37.5022 13.4648 37.5022C13.4648 37.5022 48.9756 29.0981 131.022 66.9099C133.669 68.1206 136.358 69.3594 139.105 70.6122L183.921 50.4957C183.921 50.4957 185.569 49.6932 186.343 49.2146H186.358Z" fill="#A5B4FC"/>
                <path d="M55.06 71.8652C55.1023 62.7289 56.285 53.5927 58.4534 44.5551L58.7491 43.4289C42.5848 39.7547 30.6728 38.9805 23.5199 38.9805C17.6203 38.9805 14.4804 39.5013 13.4103 39.7265C11.4813 40.1348 10.1296 41.6129 9.15801 42.8658C3.38506 50.2846 0.0761719 60.8567 0.0761719 71.8793C0.0761719 82.9018 3.38506 93.4739 9.15801 100.893C10.1296 102.132 11.4813 103.624 13.4103 104.032C14.4804 104.257 17.6203 104.778 23.5199 104.778C30.6728 104.778 42.5848 104.004 58.7491 100.33L58.4534 99.2034C56.285 90.1658 55.1023 81.0296 55.06 71.8933V71.8652Z" fill="#C7D2FE"/>
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 190 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M188.638 50.411V93.2344C188.638 96.5145 187.104 99.3581 184.02 101.329C145.285 125.894 115.955 136.213 105.705 139.084C91.5541 143.04 84.0493 142.631 82.8385 142.548C57.0009 140.745 13.4785 106.312 13.4785 106.312C13.4785 106.312 48.9892 114.716 131.036 76.9046C146.425 69.8096 163.589 62.1656 183.555 53.2124C183.555 53.2124 187.92 51.3965 188.652 50.411H188.638Z" fill="#6366F1"/>
                <path d="M186.358 49.2146C186.851 48.9049 187.512 48.4967 187.738 47.6802C187.948 46.9482 187.85 46.0331 187.428 45.3715C186.668 44.1609 185.4 43.3585 184.006 42.4716C145.285 17.9207 115.956 7.6019 105.691 4.73011C91.5404 0.774368 84.0356 1.18261 82.8247 1.26708C56.9872 3.06898 13.4648 37.5022 13.4648 37.5022C13.4648 37.5022 48.9756 29.0981 131.022 66.9099C133.669 68.1206 136.358 69.3594 139.105 70.6122L183.921 50.4957C183.921 50.4957 185.569 49.6932 186.343 49.2146H186.358Z" fill="#A5B4FC"/>
                <path d="M55.06 71.8652C55.1023 62.7289 56.285 53.5927 58.4534 44.5551L58.7491 43.4289C42.5848 39.7547 30.6728 38.9805 23.5199 38.9805C17.6203 38.9805 14.4804 39.5013 13.4103 39.7265C11.4813 40.1348 10.1296 41.6129 9.15801 42.8658C3.38506 50.2846 0.0761719 60.8567 0.0761719 71.8793C0.0761719 82.9018 3.38506 93.4739 9.15801 100.893C10.1296 102.132 11.4813 103.624 13.4103 104.032C14.4804 104.257 17.6203 104.778 23.5199 104.778C30.6728 104.778 42.5848 104.004 58.7491 100.33L58.4534 99.2034C56.285 90.1658 55.1023 81.0296 55.06 71.8933V71.8652Z" fill="#C7D2FE"/>
              </svg>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 border-b border-gray-200 bg-white px-3 py-2 sm:px-6">
          <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-nowrap items-center justify-end gap-1.5 overflow-x-auto overflow-y-hidden sm:gap-2.5 [scrollbar-width:thin]">
            {/* LTR: Search → Company | Notifications → Help → Profile — single row, no wrap */}
            <div className="relative w-[min(16.5rem,90vw)] min-w-0 max-w-[20rem] shrink-0 sm:w-60">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                title="Type to search this section"
                autoComplete="off"
                className="h-9 w-full min-w-0 rounded-lg border border-gray-200 bg-white py-0 pl-9 pr-3 text-left text-sm text-gray-900 shadow-sm placeholder:text-gray-400 outline-none transition-shadow focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/25"
                aria-label={searchPlaceholder}
              />
            </div>

            <CompanySelect
              idPrefix="layout"
              entityId={entityId}
              setEntityId={setEntityId}
              entityOptions={entityOptions}
            />

            <div className="hidden h-5 w-px flex-none self-stretch bg-gray-200 sm:mx-0.5 sm:block" aria-hidden />

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                className="relative cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Help"
              >
                <HelpCircle size={20} />
              </button>
            </div>

            <div className="mx-0.5 hidden h-6 w-px self-stretch bg-gray-200 sm:mx-1 sm:block" aria-hidden />

            <div className="flex min-w-0 max-w-[10rem] shrink-0 items-center gap-1.5 sm:max-w-none sm:gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-sm font-semibold text-indigo-600">AM</span>
              </div>
              <div className="min-w-0 text-left sm:max-w-[9rem]">
                <p className="truncate text-sm font-medium leading-tight text-gray-900">Adithya M.</p>
                <p className="truncate text-xs leading-tight text-gray-500">HR Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden pb-3 pr-0 sm:pb-4">
          {children}
        </main>

        <FloatingAiChat />
      </div>
    </div>
  )
}
