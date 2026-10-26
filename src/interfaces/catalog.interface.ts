export interface CatalogItem {
  id: number
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Supplier = CatalogItem
export type Land = CatalogItem
export type Product = CatalogItem

export type CatalogRef = Pick<CatalogItem, 'id' | 'code' | 'name'>

export interface CatalogPayload {
  code: string
  name: string
  isActive: boolean
}

export interface CatalogFilters {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}
