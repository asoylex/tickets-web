import type { ImportAnalysis, ImportOptions, ImportResult } from '@/interfaces'
import { api } from './client'

// El archivo viaja como formulario (multipart); las opciones, como texto JSON en otro campo.
const toFormData = (file: File, options?: ImportOptions) => {
  const form = new FormData()
  form.append('file', file)
  if (options) form.append('options', JSON.stringify(options))
  return form
}

// Solo lee el archivo y devuelve el informe; no escribe nada en la base.
export const analyzeImport = async (file: File) => {
  const { data } = await api.post<ImportAnalysis>('/imports/analyze', toFormData(file))
  return data
}

export const executeImport = async (file: File, options: ImportOptions) => {
  const { data } = await api.post<ImportResult>('/imports/execute', toFormData(file, options))
  return data
}
