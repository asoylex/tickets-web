import ThemeToggleButton from '@/components/common/ThemeToggleButton'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { roleLabels } from '@/utils/labels'
import { ArrowRightStartOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface AppHeaderProps {
  onMenuClick: () => void
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 xl:px-6 xl:py-4 dark:border-gray-800 dark:bg-gray-900">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="flex size-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 xl:hidden dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Bars3Icon className="size-6" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggleButton />

        {user && (
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="hidden text-left sm:block">
              <p className="text-theme-sm leading-5 font-medium text-gray-800 dark:text-white/90">{user.name}</p>
              <Badge color={user.role === 'admin' ? 'primary' : 'light'}>{roleLabels[user.role]}</Badge>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          startIcon={<ArrowRightStartOnRectangleIcon className="size-4" />}
        >
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  )
}
