import type { PaymentWeek, WeeklyPayments } from '@/interfaces'
import { api } from './client'

// Semanas que tienen tickets, de la más reciente a la más antigua.
export const listPaymentWeeks = async (year?: number) => {
  const { data } = await api.get<{ data: PaymentWeek[] }>('/payments/weeks', {
    params: year === undefined ? undefined : { year },
  })
  return data.data
}

export const getWeeklyPayments = async (year: number, week: number, supplierId?: number) => {
  const { data } = await api.get<WeeklyPayments>('/payments/weekly', {
    params: { year, week, ...(supplierId === undefined ? {} : { supplierId }) },
  })
  return data
}
