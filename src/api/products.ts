import type { CatalogFilters, CatalogPayload, Product, Paginated } from '@/interfaces'
import { api } from './client'

export const listProducts = async (params: CatalogFilters = {}) => {
  const { data } = await api.get<Paginated<Product>>('/products', { params })
  return data
}

export const createProduct = async (payload: CatalogPayload) => {
  const { data } = await api.post<Product>('/products', payload)
  return data
}

export const updateProduct = async (id: number, payload: CatalogPayload) => {
  const { data } = await api.put<Product>(`/products/${id}`, payload)
  return data
}

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`)
}
