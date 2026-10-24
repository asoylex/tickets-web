import { getErrorMessage } from '@/api/errors'
import { analyzeImport, executeImport } from '@/api/imports'
import type { ImportAnalysis, ImportOptions, ImportResult } from '@/interfaces'
import { buildImportPreview, DEFAULT_IMPORT_OPTIONS, validateImportFile } from '@/utils/importFlow'
import { useCallback, useMemo, useRef, useState } from 'react'

export type ImportPhase = 'idle' | 'analyzing' | 'review' | 'executing' | 'done'

interface ImportState {
  phase: ImportPhase
  file: File | null
  analysis: ImportAnalysis | null
  options: ImportOptions
  result: ImportResult | null
  error: string | null
}

const initialState: ImportState = {
  phase: 'idle',
  file: null,
  analysis: null,
  options: DEFAULT_IMPORT_OPTIONS,
  result: null,
  error: null,
}

// Recorre los pasos de la importación: elegir archivo, analizarlo, decidir y ejecutar.
export function useImportFlow() {
  const [state, setState] = useState<ImportState>(initialState)

  // Cada acción lleva un número; si llega la respuesta de una anterior, se descarta.
  const currentRequest = useRef(0)

  const selectFile = useCallback(async (file: File) => {
    const requestId = ++currentRequest.current

    const fileError = validateImportFile(file)
    if (fileError) {
      setState({ ...initialState, error: fileError })
      return
    }

    setState({ ...initialState, phase: 'analyzing', file })
    try {
      const analysis = await analyzeImport(file)
      if (requestId === currentRequest.current) setState((current) => ({ ...current, phase: 'review', analysis }))
    } catch (error) {
      if (requestId === currentRequest.current) setState({ ...initialState, error: getErrorMessage(error) })
    }
  }, [])

  const setOption = useCallback(<K extends keyof ImportOptions>(key: K, value: ImportOptions[K]) => {
    setState((current) => ({ ...current, options: { ...current.options, [key]: value } }))
  }, [])

  const execute = useCallback(async () => {
    const { phase, file, analysis, options } = state
    if (phase !== 'review' || !file || !analysis?.canImport) return

    const requestId = ++currentRequest.current
    setState((current) => ({ ...current, phase: 'executing', error: null }))
    try {
      const result = await executeImport(file, options)
      if (requestId === currentRequest.current) setState((current) => ({ ...current, phase: 'done', result }))
    } catch (error) {
      if (requestId === currentRequest.current) {
        setState((current) => ({ ...current, phase: 'review', error: getErrorMessage(error) }))
      }
    }
  }, [state])

  const reset = useCallback(() => {
    currentRequest.current += 1
    setState(initialState)
  }, [])

  const preview = useMemo(
    () => (state.analysis ? buildImportPreview(state.analysis, state.options) : null),
    [state.analysis, state.options],
  )

  return { ...state, preview, selectFile, setOption, execute, reset }
}
