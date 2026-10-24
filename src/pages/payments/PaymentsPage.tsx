import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import SupplierPaymentCard from '@/components/payments/SupplierPaymentCard'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { usePaymentWeeks, useWeeklyPayments } from '@/hooks/usePayments'
import { formatAmount } from '@/utils/format'
import { formatWeekLabel, formatWeekRange, parseWeekKey, toWeekKey } from '@/utils/week'
import { BanknotesIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">{value}</p>
    </Card>
  )
}

export default function PaymentsPage() {
  const { weeks, loading: loadingWeeks, error: weeksError } = usePaymentWeeks()
  const [chosenKey, setChosenKey] = useState<string | null>(null)

  // Mientras no se elija otra, se muestra la semana más reciente.
  const selectedKey = chosenKey ?? (weeks.length > 0 ? toWeekKey(weeks[0].year, weeks[0].week) : null)
  const selection = selectedKey === null ? null : parseWeekKey(selectedKey)

  const { payments, loading, error, reload } = useWeeklyPayments(selection?.year ?? null, selection?.week ?? null)

  return (
    <>
      <PageHeader title="Pagos semanales" description="Resumen de lo que se paga a cada proveedor en una semana ISO." />

      {loadingWeeks && (
        <div className="flex justify-center py-24">
          <Spinner className="size-8 text-brand-500" />
        </div>
      )}

      {weeksError && (
        <Card>
          <EmptyState icon={CalendarDaysIcon} title="No se pudieron cargar las semanas" description={weeksError} />
        </Card>
      )}

      {!loadingWeeks && !weeksError && weeks.length === 0 && (
        <Card>
          <EmptyState icon={CalendarDaysIcon} title="Todavía no hay semanas con tickets" description="Registra tickets para ver los pagos." />
        </Card>
      )}

      {weeks.length > 0 && (
        <div className="space-y-6">
          <Card>
            <div className="max-w-md p-5">
              <Label htmlFor="week">Semana</Label>
              <Select id="week" value={selectedKey ?? ''} onChange={(event) => setChosenKey(event.target.value)}>
                {weeks.map((week) => (
                  <option key={toWeekKey(week.year, week.week)} value={toWeekKey(week.year, week.week)}>
                    {formatWeekLabel(week)}
                  </option>
                ))}
              </Select>
              {payments && <p className="mt-2 text-theme-xs text-gray-500">{formatWeekRange(payments.startDate, payments.endDate)}</p>}
            </div>
          </Card>

          {loading && (
            <div className="flex justify-center py-16">
              <Spinner className="size-8 text-brand-500" />
            </div>
          )}

          {error && (
            <Card>
              <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                <p className="text-theme-sm text-error-600 dark:text-error-500">{error}</p>
                <Button variant="outline" size="sm" onClick={reload}>
                  Reintentar
                </Button>
              </div>
            </Card>
          )}

          {payments && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Total a pagar" value={formatAmount(payments.totals.amount)} />
                <Stat label="Proveedores" value={String(payments.totals.suppliers)} />
                <Stat label="Tickets" value={String(payments.totals.tickets)} />
                <Stat label="Líneas" value={String(payments.totals.items)} />
              </div>

              {payments.suppliers.length === 0 ? (
                <Card>
                  <EmptyState icon={BanknotesIcon} title="No hay pagos en esta semana" description="Ningún ticket cae dentro de estas fechas." />
                </Card>
              ) : (
                <div className="space-y-3">
                  {payments.suppliers.map((payment) => (
                    <SupplierPaymentCard key={`${payments.year}-${payments.week}-${payment.supplier.id}`} payment={payment} />
                  ))}
                  <p className="px-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    El total de cada proveedor se redondea una sola vez al final, por eso puede diferir por centavos de la suma de sus tickets.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
