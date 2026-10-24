import { AuthContext } from '@/context/authContext'
import { useContext } from 'react'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
