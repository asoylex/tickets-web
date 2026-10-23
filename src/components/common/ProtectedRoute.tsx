import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-brand-500" />
      </div>
    )
  }

  // Se guarda la ruta pedida para volver a ella después de iniciar sesión.
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
