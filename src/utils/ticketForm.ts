import type { FieldError } from '@/api/errors'
import type {
  Ticket,
  TicketFormErrors,
  TicketFormValues,
  TicketItemForm,
  TicketItemFormErrors,
  TicketPayload,
} from '@/interfaces'

let nextKey = 0
const newKey = () => `item-${nextKey++}`

const today = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export const createEmptyItem = (): TicketItemForm => ({ key: newKey(), productId: '', quantity: '', price: '' })

export const createEmptyErrors = (): TicketFormErrors => ({ itemErrors: {} })

export const createEmptyForm = (): TicketFormValues => ({
  code: '',
  date: today(),
  supplierId: '',
  landId: '',
  items: [createEmptyItem()],
})

export const ticketToForm = (ticket: Ticket): TicketFormValues => ({
  code: ticket.code,
  date: ticket.date,
  supplierId: String(ticket.supplierId),
  landId: String(ticket.landId),
  items: ticket.items.map((item) => ({
    key: newKey(),
    productId: String(item.productId),
    quantity: String(item.quantity),
    price: String(item.price),
  })),
})

const parseAmount = (value: string) => (value.trim() === '' ? NaN : Number(value))

export const validateTicketForm = (values: TicketFormValues): TicketFormErrors => {
  const errors = createEmptyErrors()

  if (!values.code.trim()) errors.code = 'Ingresa el código del ticket'
  if (!values.date) errors.date = 'Selecciona la fecha'
  if (!values.supplierId) errors.supplierId = 'Selecciona un proveedor'
  if (!values.landId) errors.landId = 'Selecciona una ubicación'
  if (values.items.length === 0) errors.items = 'Agrega al menos una línea'

  values.items.forEach((item, index) => {
    const itemErrors: TicketItemFormErrors = {}
    if (!item.productId) itemErrors.productId = 'Selecciona un producto'

    const quantity = parseAmount(item.quantity)
    if (Number.isNaN(quantity) || quantity < 0) itemErrors.quantity = 'Cantidad no válida'

    const price = parseAmount(item.price)
    if (Number.isNaN(price) || price < 0) itemErrors.price = 'Precio no válido'

    if (Object.keys(itemErrors).length > 0) errors.itemErrors[index] = itemErrors
  })

  return errors
}

export const hasErrors = (errors: TicketFormErrors) =>
  Boolean(
    errors.code || errors.date || errors.supplierId || errors.landId || errors.items || Object.keys(errors.itemErrors).length > 0,
  )

export const buildTicketPayload = (values: TicketFormValues): TicketPayload => ({
  code: values.code.trim(),
  date: values.date,
  supplierId: Number(values.supplierId),
  landId: Number(values.landId),
  items: values.items.map((item) => ({
    productId: Number(item.productId),
    quantity: Number(item.quantity),
    price: Number(item.price),
  })),
})

export const calculateLineTotal = (item: TicketItemForm) => {
  const quantity = parseAmount(item.quantity)
  const price = parseAmount(item.price)
  if (Number.isNaN(quantity) || Number.isNaN(price)) return 0
  return Math.round(quantity * price * 10000) / 10000
}

export const calculateTotal = (items: TicketItemForm[]) =>
  Math.round(items.reduce((sum, item) => sum + calculateLineTotal(item), 0) * 10000) / 10000

// Convierte los errores por campo que devuelve la API en los errores del formulario.
export const applyServerErrors = (fieldErrors: FieldError[]): TicketFormErrors => {
  const errors = createEmptyErrors()

  fieldErrors.forEach(({ field, message }) => {
    const itemMatch = field.match(/^items\[(\d+)\]\.(productId|quantity|price)$/)
    if (itemMatch) {
      const index = Number(itemMatch[1])
      const key = itemMatch[2] as keyof TicketItemFormErrors
      errors.itemErrors[index] = { ...errors.itemErrors[index], [key]: message }
    } else if (field === 'code' || field === 'date' || field === 'supplierId' || field === 'landId' || field === 'items') {
      errors[field] = message
    }
  })

  return errors
}
