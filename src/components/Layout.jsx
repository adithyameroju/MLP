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
  HelpCircle,
  Menu,
  Search,
  ChevronDown,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useGlobalSearch } from '../context/GlobalSearchContext'
import { useEntity } from '../context/EntityContext'
import FloatingAiChat from './FloatingAiChat'
import AckoForBusinessLogo from './branding/AckoForBusinessLogo'
import HeaderNotifications from './header/HeaderNotifications'
import HeaderProfileMenu from './header/HeaderProfileMenu'
import HeaderDropdownPortal from './header/HeaderDropdownPortal'
import { headerControlHeight, headerDropdownPanel, headerIconButton } from '../lib/headerUiTokens'

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
  const triggerRef = useRef(null)
  const listId = `${idPrefix}-entity-listbox`
  const selected = entityOptions.find((e) => e.id === entityId) ?? entityOptions[0]

  return (
    <div
      className="w-[min(10.5rem,30vw)] min-w-0 max-w-[11.5rem] shrink-0 sm:max-w-[12.5rem]"
      ref={triggerRef}
    >
      <button
        type="button"
        id={`${idPrefix}-entity-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`flex ${headerControlHeight} w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white pl-2.5 pr-2 text-left text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20`}
      >
        <span className="min-w-0 flex-1 truncate" title={selected?.label}>
          {selected?.label}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <HeaderDropdownPortal
        open={open}
        triggerRef={triggerRef}
        onClose={() => setOpen(false)}
        align="right"
        matchTriggerWidth
      >
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${idPrefix}-entity-trigger`}
          className={`${headerDropdownPanel} max-h-60 min-w-full overflow-y-auto py-1`}
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
      </HeaderDropdownPortal>
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
        <div className={`flex h-16 items-center gap-2 border-b border-white/10 px-3 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-indigo-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Menu size={20} />
          </button>
          {!collapsed ? (
            <AckoForBusinessLogo className="h-7 w-auto max-w-[148px] min-w-0 flex-1 object-contain object-left" />
          ) : null}
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

        <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2 px-1 py-1">
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-indigo-300/80">
                Powered by
              </span>
              <AckoForBusinessLogo className="h-5 w-auto max-w-[96px] min-w-0 object-contain object-left opacity-90" />
            </div>
          ) : null}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="relative z-40 flex h-16 flex-shrink-0 items-center overflow-visible border-b border-gray-200 bg-white px-3 sm:px-6">
          <div className="mx-auto flex h-full w-full min-w-0 max-w-[1600px] flex-nowrap items-center justify-end gap-1.5 overflow-x-auto sm:gap-2.5 [scrollbar-width:thin]">
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
                className={`${headerControlHeight} w-full min-w-0 rounded-lg border border-gray-200 bg-white py-0 pl-9 pr-3 text-left text-sm text-gray-900 shadow-sm placeholder:text-gray-400 outline-none transition-shadow focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/25`}
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
              <HeaderNotifications />
              <button
                type="button"
                onClick={() => navigate('/support/help')}
                className={headerIconButton}
                aria-label="Help center"
              >
                <HelpCircle size={20} />
              </button>
            </div>

            <div className="mx-0.5 hidden h-6 w-px self-stretch bg-gray-200 sm:mx-1 sm:block" aria-hidden />

            <HeaderProfileMenu />
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
