import { getErrorMessage, getFieldErrors } from '@/api/errors'
import Input from '@/components/form/Input'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import type { CatalogItem, CatalogPayload, CatalogResource } from '@/interfaces'
import { showSuccess } from '@/utils/alerts'
import { useState, type FormEvent } from 'react'

interface CatalogFormModalProps {
  resource: CatalogResource
  item: CatalogItem | null
  onClose: () => void
  onSaved: () => void
}

interface FormErrors {
  code?: string
  name?: string
  general?: string
}

const CODE_MAX = 30
const NAME_MAX = 160

export default function CatalogFormModal({ resource, item, onClose, onSaved }: CatalogFormModalProps) {
  const [code, setCode] = useState(item?.code ?? '')
  const [name, setName] = useState(item?.name ?? '')
  const [isActive, setIsActive] = useState(item?.isActive ?? true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): FormErrors => {
    const result: FormErrors = {}
    if (!code.trim()) result.code = 'El código es obligatorio'
    else if (code.trim().length > CODE_MAX) result.code = `El código no puede pasar de ${CODE_MAX} caracteres`
    if (!name.trim()) result.name = 'El nombre es obligatorio'
    else if (name.trim().length > NAME_MAX) result.name = `El nombre no puede pasar de ${NAME_MAX} caracteres`
    return result
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const validation = validate()
    setErrors(validation)
    if (validation.code || validation.name) return

    const payload: CatalogPayload = { code: code.trim(), name: name.trim(), isActive }
    setSubmitting(true)
    try {
      if (item) await resource.update(item.id, payload)
      else await resource.create(payload)
      onSaved()
      showSuccess(item ? 'Cambios guardados' : 'Registro creado')
    } catch (error) {
      const serverErrors: FormErrors = {}
      getFieldErrors(error).forEach(({ field, message }) => {
        if (field === 'code' || field === 'name') serverErrors[field] = message
      })
      if (!serverErrors.code && !serverErrors.name) serverErrors.general = getErrorMessage(error)
      setErrors(serverErrors)
      setSubmitting(false)
    }
  }

  return (
    <Modal title={item ? `Editar ${resource.singular}` : resource.newLabel} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="code" required>
            Código
          </Label>
          <Input
            id="code"
            value={code}
            error={errors.code}
            autoFocus
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="name" required>
            Nombre
          </Label>
          <Input id="name" value={name} error={errors.name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="status">Estado</Label>
          <Select id="status" value={isActive ? 'true' : 'false'} onChange={(event) => setIsActive(event.target.value === 'true')}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </Select>
        </div>

        {errors.general && <p className="text-theme-sm text-error-600 dark:text-error-500">{errors.general}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
