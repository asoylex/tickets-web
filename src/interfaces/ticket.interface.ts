import type { CatalogItem, CatalogRef } from './catalog.interface'

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

export interface TicketFilters {
  search?: string
  supplierId?: string
  landId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
