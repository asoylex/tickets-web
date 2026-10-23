import type { User } from './user.interface'

export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: string
  user: User
}
