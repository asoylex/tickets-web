import axios from 'axios'

interface ApiErrorBody {
  message?: string
  details?: unknown
}

export interface FieldError {
  field: string
  message: string
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor'
    return error.response.data?.message ?? 'Ocurrió un error inesperado'
  }
  return 'Ocurrió un error inesperado'
}

// Errores de validación por campo, tal como los devuelve la API en "details".
// Los duplicados (409) llegan como una lista de nombres de campo; se les asigna el mensaje general.
export const getFieldErrors = (error: unknown): FieldError[] => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return []
  const details = error.response?.data?.details
  if (!Array.isArray(details)) return []

  const message = error.response?.data?.message ?? ''
  return details.flatMap((item): FieldError[] => {
    if (typeof item === 'string') return [{ field: item, message }]
    if (typeof item === 'object' && item !== null && 'field' in item && 'message' in item) return [item as FieldError]
    return []
  })
}
