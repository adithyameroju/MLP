import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { headerDropdownItem, headerDropdownPanel } from '../../lib/headerUiTokens'
import HeaderDropdownPortal from './HeaderDropdownPortal'

const profileMenuItems = [
  { id: 'profile', label: 'Profile', icon: User, path: '/dashboard' },
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
]

export default function HeaderProfileMenu({
  name = 'Adithya M.',
  role = 'HR Admin',
  initials = 'AM',
}) {
  const navigate = useNavigate()
  const triggerRef = useRef(null)
  const [open, setOpen] = useState(false)

  const onSelect = (item) => {
    setOpen(false)
    if (item.action === 'logout') {
      window.alert('Logged out (demo). Production would clear your session and redirect to login.')
      return
    }
    if (item.path) navigate(item.path)
  }

  return (
    <div className="min-w-0" ref={triggerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 min-w-0 max-w-[10rem] cursor-pointer items-center gap-1.5 rounded-lg px-1.5 transition-colors hover:bg-gray-100 sm:max-w-none sm:gap-2 sm:pr-2"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
          <span className="text-sm font-semibold text-indigo-600">{initials}</span>
        </div>
        <div className="hidden min-w-0 text-left sm:block sm:max-w-[9rem]">
          <p className="truncate text-sm font-medium leading-tight text-gray-900">{name}</p>
          <p className="truncate text-xs leading-tight text-gray-500">{role}</p>
        </div>
        <ChevronDown
          className={`hidden h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform sm:block ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <HeaderDropdownPortal open={open} triggerRef={triggerRef} onClose={() => setOpen(false)}>
        <div role="menu" aria-label="Account menu" className={`${headerDropdownPanel} min-w-[10.5rem]`}>
          <div className="border-b border-gray-100 px-3 py-2 sm:hidden">
            <p className="truncate text-sm font-medium text-gray-900">{name}</p>
            <p className="truncate text-xs text-gray-500">{role}</p>
          </div>
          <ul className="py-1">
            {profileMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => onSelect(item)}
                    className={`${headerDropdownItem} items-center gap-2 ${
                      item.action === 'logout' ? 'text-red-600 hover:bg-red-50' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </HeaderDropdownPortal>
    </div>
  )
}
