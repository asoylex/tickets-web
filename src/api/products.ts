import type { Paginated, Product } from '@/interfaces'
import { api } from './client'

export const listProducts = async (params: { search?: string; isActive?: boolean; page?: number; limit?: number } = {}) => {
  const { data } = await api.get<Paginated<Product>>('/products', { params })
  return data
}
