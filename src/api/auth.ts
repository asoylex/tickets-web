import type { LoginResponse, User } from '@/types'
import { api } from './client'

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export const getCurrentUser = async () => {
  const { data } = await api.get<User>('/auth/me')
  return data
}
