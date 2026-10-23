import type { Paginated, Ticket, TicketListItem } from '@/types'
import { api } from './client'

export interface TicketFilters {
  search?: string
  supplierId?: string
  landId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// Solo se envían los filtros que tienen valor.
const toParams = (filters: TicketFilters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))

export const listTickets = async (filters: TicketFilters) => {
  const { data } = await api.get<Paginated<TicketListItem>>('/tickets', { params: toParams(filters) })
  return data
}

export const getTicket = async (id: number) => {
  const { data } = await api.get<Ticket>(`/tickets/${id}`)
  return data
}
