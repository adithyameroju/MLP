import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { headerNotificationsSeed } from '../../data/notificationsMock'
import { headerDropdownPanel, headerIconButton } from '../../lib/headerUiTokens'
import HeaderDropdownPortal from './HeaderDropdownPortal'

export default function HeaderNotifications() {
  const navigate = useNavigate()
  const triggerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(() => headerNotificationsSeed.map((n) => ({ ...n })))

  const unreadCount = items.filter((n) => n.unread).length

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const openNotification = (notification) => {
    setItems((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n)),
    )
    setOpen(false)
    if (notification.path) navigate(notification.path)
  }

  return (
    <div ref={triggerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${headerIconButton} relative`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <Bell size={20} aria-hidden />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" aria-hidden />
        ) : null}
      </button>

      <HeaderDropdownPortal open={open} triggerRef={triggerRef} onClose={() => setOpen(false)}>
        <div role="menu" aria-label="Notifications" className={`${headerDropdownPanel} w-[min(100vw-2rem,22rem)]`}>
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <ul className="max-h-72 overflow-y-auto py-1">
            {items.map((n) => (
              <li key={n.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openNotification(n)}
                  className={`flex w-full cursor-pointer gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                    n.unread ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-indigo-500' : 'bg-transparent'}`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-gray-900">{n.title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-gray-500">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-gray-400">{n.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </HeaderDropdownPortal>
    </div>
  )
}
