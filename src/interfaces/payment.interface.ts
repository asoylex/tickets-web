import type { CatalogRef } from './catalog.interface'

export interface PaymentWeek {
  year: number
  week: number
  startDate: string
  endDate: string
  suppliersCount: number
  ticketsCount: number
  total: number
}

export interface PaymentItem {
  id: number
  product: CatalogRef
  quantity: number
  price: number
  total: number
}

export interface PaymentTicket {
  id: number
  code: string
  date: string
  land: CatalogRef
  total: number
  items: PaymentItem[]
}

export interface SupplierPayment {
  supplier: CatalogRef
  ticketsCount: number
  itemsCount: number
  total: number
  tickets: PaymentTicket[]
}

export interface PaymentTotals {
  suppliers: number
  tickets: number
  items: number
  amount: number
}

export interface WeeklyPayments {
  year: number
  week: number
  startDate: string
  endDate: string
  totals: PaymentTotals
  suppliers: SupplierPayment[]
}
