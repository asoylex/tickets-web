import type { Role } from '@/interfaces'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

// Deja pasar solo a los usuarios con alguno de los roles indicados; a los demás los manda al inicio.
export default function RoleRoute({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}
