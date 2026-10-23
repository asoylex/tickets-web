import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { NavLink } from 'react-router'
import { navigation } from './navigation'

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

export default function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { user } = useAuth()

  const groups = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || (user && item.roles.includes(user.role))),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-50 flex h-screen w-72.5 flex-col border-r border-gray-200 bg-white px-5 transition-transform duration-300 ease-in-out xl:translate-x-0 dark:border-gray-800 dark:bg-gray-900',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex items-center gap-3 py-8">
        <img src="/favicon.svg" alt="" className="size-8" />
        <span className="text-lg font-semibold text-gray-800 dark:text-white/90">Gestión de Tickets</span>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto" aria-label="Menú principal">
        {groups.map((group) => (
          <div key={group.title} className="mb-6">
            <h2 className="mb-3 text-xs leading-5 text-gray-400 uppercase">{group.title}</h2>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => cn('group menu-item', isActive ? 'menu-item-active' : 'menu-item-inactive')}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn('size-6', isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive')} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
