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

export interface TicketItem {
  id: number
  ticketId: number
  productId: number
  quantity: number
  price: number
  total: number
  product?: CatalogRef
}

export interface TicketListItem {
  id: number
  code: string
  date: string
  supplierId: number
  landId: number
  total: number
  itemsCount: number
  supplier: CatalogRef
  land: CatalogRef
}

export interface Ticket {
  id: number
  code: string
  date: string
  supplierId: number
  landId: number
  total: number
  supplier: CatalogItem
  land: CatalogItem
  items: TicketItem[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: string
  user: User
}
