import Input from '@/components/form/Input'
import Select from '@/components/form/Select'
import Button from '@/components/ui/Button'
import type { Product, TicketItemForm, TicketItemFormErrors } from '@/interfaces'
import { formatAmount } from '@/utils/format'
import { selectableOptions } from '@/utils/options'
import { calculateLineTotal, calculateTotal, createEmptyItem } from '@/utils/ticketForm'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface TicketItemsEditorProps {
  items: TicketItemForm[]
  products: Product[]
  errors: Record<number, TicketItemFormErrors>
  error?: string
  onChange: (items: TicketItemForm[]) => void
}

const rowColumns = 'sm:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_2.75rem]'

export default function TicketItemsEditor({ items, products, errors, error, onChange }: TicketItemsEditorProps) {
  const updateItem = (index: number, patch: Partial<TicketItemForm>) =>
    onChange(items.map((item, current) => (current === index ? { ...item, ...patch } : item)))

  const removeItem = (index: number) => onChange(items.filter((_, current) => current !== index))

  return (
    <div>
      <div className={`hidden gap-3 px-1 pb-2 text-theme-xs font-medium text-gray-500 sm:grid dark:text-gray-400 ${rowColumns}`}>
        <span>Producto</span>
        <span>Cantidad</span>
        <span>Precio</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.key}
            className={`grid gap-3 rounded-xl border border-gray-100 p-3 sm:items-start sm:border-0 sm:p-0 dark:border-gray-800 ${rowColumns}`}
          >
            <Select
              aria-label={`Producto de la línea ${index + 1}`}
              value={item.productId}
              error={errors[index]?.productId}
              onChange={(event) => updateItem(index, { productId: event.target.value })}
            >
              <option value="">Selecciona un producto</option>
              {selectableOptions(products, item.productId).map((product) => (
                <option key={product.id} value={product.id}>
                  {product.code} · {product.name}
                </option>
              ))}
            </Select>

            <Input
              aria-label={`Cantidad de la línea ${index + 1}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Cantidad"
              value={item.quantity}
              error={errors[index]?.quantity}
              onChange={(event) => updateItem(index, { quantity: event.target.value })}
            />

            <Input
              aria-label={`Precio de la línea ${index + 1}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.0001"
              placeholder="Precio"
              value={item.price}
              error={errors[index]?.price}
              onChange={(event) => updateItem(index, { price: event.target.value })}
            />

            <div className="flex h-11 items-center justify-between text-theme-sm font-medium text-gray-800 sm:justify-end dark:text-white/90">
              <span className="text-gray-500 sm:hidden dark:text-gray-400">Total</span>
              {formatAmount(calculateLineTotal(item))}
            </div>

            <button
              type="button"
              aria-label={`Quitar la línea ${index + 1}`}
              disabled={items.length === 1}
              onClick={() => removeItem(index)}
              className="flex size-11 items-center justify-center rounded-lg text-gray-500 transition hover:bg-error-50 hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-error-500/15"
            >
              <TrashIcon className="size-5" />
            </button>
          </div>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-error-500">{error}</p>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" size="sm" startIcon={<PlusIcon className="size-4" />} onClick={() => onChange([...items, createEmptyItem()])}>
          Agregar línea
        </Button>
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          Total del ticket{' '}
          <span className="ml-1 text-base font-semibold text-gray-800 dark:text-white/90">{formatAmount(calculateTotal(items))}</span>
        </p>
      </div>
    </div>
  )
}
