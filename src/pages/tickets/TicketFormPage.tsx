import { getErrorMessage, getFieldErrors } from '@/api/errors'
import { createTicket, getTicket, updateTicket } from '@/api/tickets'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Input from '@/components/form/Input'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import TicketItemsEditor from '@/components/tickets/TicketItemsEditor'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { useLandOptions, useProductOptions, useSupplierOptions } from '@/hooks/useCatalogOptions'
import type { TicketFormErrors, TicketFormValues, TicketItemForm } from '@/interfaces'
import { showError, showSuccess } from '@/utils/alerts'
import { selectableOptions } from '@/utils/options'
import {
  applyServerErrors,
  buildTicketPayload,
  createEmptyErrors,
  createEmptyForm,
  hasErrors,
  ticketToForm,
  validateTicketForm,
} from '@/utils/ticketForm'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'

type HeaderField = 'code' | 'date' | 'supplierId' | 'landId'

export default function TicketFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ticketId = id === undefined ? null : Number(id)
  const isEdit = ticketId !== null

  const suppliers = useSupplierOptions()
  const lands = useLandOptions()
  const products = useProductOptions()

  const [values, setValues] = useState<TicketFormValues>(createEmptyForm)
  const [errors, setErrors] = useState<TicketFormErrors>(createEmptyErrors)
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // En modo edición se carga el ticket y se rellena el formulario.
  useEffect(() => {
    if (ticketId === null) return
    let ignore = false

    getTicket(ticketId)
      .then((ticket) => {
        if (ignore) return
        setValues(ticketToForm(ticket))
        setLoading(false)
      })
      .catch((error) => {
        if (ignore) return
        setLoadError(getErrorMessage(error))
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [ticketId])

  const setField = (field: HeaderField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const setItems = (items: TicketItemForm[]) => {
    setValues((current) => ({ ...current, items }))
    setErrors((current) => ({ ...current, items: undefined, itemErrors: {} }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const validation = validateTicketForm(values)
    setErrors(validation)
    if (hasErrors(validation)) return

    setSubmitting(true)
    try {
      const payload = buildTicketPayload(values)
      if (ticketId === null) await createTicket(payload)
      else await updateTicket(ticketId, payload)

      showSuccess(isEdit ? 'Ticket actualizado' : 'Ticket creado')
      navigate('/tickets')
    } catch (error) {
      setSubmitting(false)
      const serverErrors = applyServerErrors(getFieldErrors(error))
      if (hasErrors(serverErrors)) setErrors(serverErrors)
      else showError(getErrorMessage(error))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8 text-brand-500" />
      </div>
    )
  }

  if (loadError) {
    return (
      <Card>
        <EmptyState icon={ExclamationTriangleIcon} title="No se pudo cargar el ticket" description={loadError} />
        <div className="flex justify-center pb-10">
          <Button variant="outline" onClick={() => navigate('/tickets')}>
            Volver a tickets
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title={isEdit ? `Editar ticket ${values.code}` : 'Nuevo ticket'}
        description={isEdit ? 'Modifica los datos y las líneas del ticket.' : 'Registra un ticket de compra con sus líneas.'}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="code" required>
                Código
              </Label>
              <Input
                id="code"
                value={values.code}
                placeholder="Ej. 1115651"
                error={errors.code}
                onChange={(event) => setField('code', event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date" required>
                Fecha
              </Label>
              <Input id="date" type="date" value={values.date} error={errors.date} onChange={(event) => setField('date', event.target.value)} />
            </div>
            <div>
              <Label htmlFor="supplierId" required>
                Proveedor
              </Label>
              <Select id="supplierId" value={values.supplierId} error={errors.supplierId} onChange={(event) => setField('supplierId', event.target.value)}>
                <option value="">Selecciona un proveedor</option>
                {selectableOptions(suppliers, values.supplierId).map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="landId" required>
                Ubicación
              </Label>
              <Select id="landId" value={values.landId} error={errors.landId} onChange={(event) => setField('landId', event.target.value)}>
                <option value="">Selecciona una ubicación</option>
                {selectableOptions(lands, values.landId).map((land) => (
                  <option key={land.id} value={land.id}>
                    {land.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Líneas del ticket</h2>
            <TicketItemsEditor items={values.items} products={products} errors={errors.itemErrors} error={errors.items} onChange={setItems} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/tickets')} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? 'Guardar cambios' : 'Crear ticket'}
          </Button>
        </div>
      </form>
    </>
  )
}
