const amountFormatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const quantityFormatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

// Los precios unitarios pueden tener hasta 4 decimales (por ejemplo 1.023).
const priceFormatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})

export const formatAmount = (value: number) => amountFormatter.format(value)

export const formatQuantity = (value: number) => quantityFormatter.format(value)

export const formatPrice = (value: number) => priceFormatter.format(value)

export const formatCount = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`

// Las fechas llegan como YYYY-MM-DD; se formatean sin pasar por Date para evitar desfases de zona horaria.
export const formatDate = (value: string) => {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}
