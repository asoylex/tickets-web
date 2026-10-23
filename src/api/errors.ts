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
export const getFieldErrors = (error: unknown): FieldError[] => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return []
  const details = error.response?.data?.details
  if (!Array.isArray(details)) return []
  return details.filter(
    (item): item is FieldError =>
      typeof item === 'object' && item !== null && 'field' in item && 'message' in item,
  )
}
