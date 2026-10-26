import type { CatalogFilters, CatalogPayload, Supplier, Paginated } from '@/interfaces'
import { api } from './client'

export const listSuppliers = async (params: CatalogFilters = {}) => {
  const { data } = await api.get<Paginated<Supplier>>('/suppliers', { params })
  return data
}

export const createSupplier = async (payload: CatalogPayload) => {
  const { data } = await api.post<Supplier>('/suppliers', payload)
  return data
}

export const updateSupplier = async (id: number, payload: CatalogPayload) => {
  const { data } = await api.put<Supplier>(`/suppliers/${id}`, payload)
  return data
}

export const deleteSupplier = async (id: number) => {
  await api.delete(`/suppliers/${id}`)
}
