import Card from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/Table'
import type { SupplierPayment } from '@/interfaces'
import { cn } from '@/utils/cn'
import { formatAmount, formatCount, formatDate, formatPrice, formatQuantity } from '@/utils/format'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface SupplierPaymentCardProps {
  payment: SupplierPayment
  defaultOpen?: boolean
}

export default function SupplierPaymentCard({ payment, defaultOpen = false }: SupplierPaymentCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { supplier, tickets } = payment

  return (
    <Card>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <ChevronDownIcon className={cn('size-5 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-800 dark:text-white/90">{supplier.name}</p>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            {supplier.code} · {formatCount(payment.ticketsCount, 'ticket', 'tickets')} ·{' '}
            {formatCount(payment.itemsCount, 'línea', 'líneas')}
          </p>
        </div>
        <p className="text-lg font-semibold text-gray-800 dark:text-white/90">{formatAmount(payment.total)}</p>
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border-b border-gray-100 px-5 py-4 last:border-b-0 dark:border-gray-800">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                  Ticket {ticket.code}
                  <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
                    {formatDate(ticket.date)} · {ticket.land.name}
                  </span>
                </p>
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{formatAmount(ticket.total)}</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableCell header className="px-2">
                      Producto
                    </TableCell>
                    <TableCell header align="right" className="px-2">
                      Cantidad
                    </TableCell>
                    <TableCell header align="right" className="px-2">
                      Precio
                    </TableCell>
                    <TableCell header align="right" className="px-2">
                      Total
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticket.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-2 py-2">{item.product.name}</TableCell>
                      <TableCell align="right" className="px-2 py-2">
                        {formatQuantity(item.quantity)}
                      </TableCell>
                      <TableCell align="right" className="px-2 py-2">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell align="right" className="px-2 py-2">
                        {formatAmount(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
