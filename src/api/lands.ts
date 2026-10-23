import type { Land, Paginated } from '@/interfaces'
import { api } from './client'

export const listLands = async (params: { search?: string; isActive?: boolean; page?: number; limit?: number } = {}) => {
  const { data } = await api.get<Paginated<Land>>('/lands', { params })
  return data
}
