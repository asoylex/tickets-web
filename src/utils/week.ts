import type { PaymentWeek } from '@/interfaces'
import { formatDate } from './format'

type WeekRange = Pick<PaymentWeek, 'year' | 'week' | 'startDate' | 'endDate'>

// Las fechas llegan como YYYY-MM-DD; se manejan como texto para evitar desfases de zona horaria.
const shortDate = (value: string) => {
  const [, month, day] = value.split('-')
  return `${day}/${month}`
}

export const formatWeekLabel = ({ year, week, startDate, endDate }: WeekRange) =>
  `Semana ${week} de ${year} (${shortDate(startDate)} – ${shortDate(endDate)})`

export const formatWeekRange = (startDate: string, endDate: string) =>
  `Del ${formatDate(startDate)} al ${formatDate(endDate)}`

// El selector de semanas usa un solo valor de texto: "2023-3".
export const toWeekKey = (year: number, week: number) => `${year}-${week}`

export const parseWeekKey = (key: string) => {
  const parts = key.split('-')
  if (parts.length !== 2 || parts.some((part) => part === '')) return null

  const [year, week] = parts.map(Number)
  return Number.isInteger(year) && Number.isInteger(week) ? { year, week } : null
}
