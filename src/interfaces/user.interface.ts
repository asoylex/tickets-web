export type Role = 'admin' | 'user'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}
