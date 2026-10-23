import type { Paginated, Supplier } from '@/interfaces'
import { api } from './client'

export const listSuppliers = async (params: { search?: string; isActive?: boolean; page?: number; limit?: number } = {}) => {
  const { data } = await api.get<Paginated<Supplier>>('/suppliers', { params })
  return data
}
