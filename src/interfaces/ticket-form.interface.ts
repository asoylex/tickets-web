export interface TicketItemForm {
  key: string
  productId: string
  quantity: string
  price: string
}

export interface TicketFormValues {
  code: string
  date: string
  supplierId: string
  landId: string
  items: TicketItemForm[]
}

export interface TicketItemFormErrors {
  productId?: string
  quantity?: string
  price?: string
}

export interface TicketFormErrors {
  code?: string
  date?: string
  supplierId?: string
  landId?: string
  items?: string
  itemErrors: Record<number, TicketItemFormErrors>
}
