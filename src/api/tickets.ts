import type { Paginated, Ticket, TicketFilters, TicketListItem, TicketPayload } from '@/interfaces'
import { api } from './client'

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

export const createTicket = async (payload: TicketPayload) => {
  const { data } = await api.post<Ticket>('/tickets', payload)
  return data
}

// Al editar, las líneas enviadas reemplazan a las anteriores.
export const updateTicket = async (id: number, payload: TicketPayload) => {
  const { data } = await api.put<Ticket>(`/tickets/${id}`, payload)
  return data
}

export const deleteTicket = async (id: number) => {
  await api.delete(`/tickets/${id}`)
}
