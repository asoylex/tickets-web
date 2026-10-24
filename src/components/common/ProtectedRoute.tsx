import PageLoader from '@/components/common/PageLoader'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  // Se guarda la ruta pedida para volver a ella después de iniciar sesión.
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
