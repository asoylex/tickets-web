import type { CatalogFilters, CatalogPayload, Land, Paginated } from '@/interfaces'
import { api } from './client'

export const listLands = async (params: CatalogFilters = {}) => {
  const { data } = await api.get<Paginated<Land>>('/lands', { params })
  return data
}

export const createLand = async (payload: CatalogPayload) => {
  const { data } = await api.post<Land>('/lands', payload)
  return data
}

export const updateLand = async (id: number, payload: CatalogPayload) => {
  const { data } = await api.put<Land>(`/lands/${id}`, payload)
  return data
}

export const deleteLand = async (id: number) => {
  await api.delete(`/lands/${id}`)
}
