import { useState } from 'react'
import { Outlet } from 'react-router'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar open={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-gray-900/50 xl:hidden" onClick={closeSidebar} aria-hidden="true" />}

      <div className="min-w-0 flex-1 xl:ml-72.5">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
