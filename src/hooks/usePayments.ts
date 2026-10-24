import { getErrorMessage } from '@/api/errors'
import { getWeeklyPayments, listPaymentWeeks } from '@/api/payments'
import type { PaymentWeek, WeeklyPayments } from '@/interfaces'
import { useEffect, useState } from 'react'

interface WeeksState {
  weeks: PaymentWeek[]
  error: string | null
  loaded: boolean
}

// Carga una sola vez las semanas que tienen tickets, para llenar el selector.
export function usePaymentWeeks() {
  const [state, setState] = useState<WeeksState>({ weeks: [], error: null, loaded: false })

  useEffect(() => {
    let ignore = false

    listPaymentWeeks()
      .then((weeks) => {
        if (!ignore) setState({ weeks, error: null, loaded: true })
      })
      .catch((error) => {
        if (!ignore) setState({ weeks: [], error: getErrorMessage(error), loaded: true })
      })

    return () => {
      ignore = true
    }
  }, [])

  return { weeks: state.weeks, loading: !state.loaded, error: state.error }
}

interface Result {
  key: string
  data: WeeklyPayments | null
  error: string | null
}

// Con year o week en null no hay semana elegida y no se hace ninguna petición.
export function useWeeklyPayments(year: number | null, week: number | null) {
  const [result, setResult] = useState<Result | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  const requestKey = year === null || week === null ? null : `${year}-${week}-${reloadCount}`

  useEffect(() => {
    if (year === null || week === null || requestKey === null) return
    let ignore = false

    getWeeklyPayments(year, week)
      .then((data) => {
        if (!ignore) setResult({ key: requestKey, data, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ key: requestKey, data: null, error: getErrorMessage(error) })
      })

    // Si se elige otra semana antes de que llegue la respuesta, se descarta la anterior.
    return () => {
      ignore = true
    }
  }, [year, week, reloadCount, requestKey])

  // Solo se muestra el resumen de la semana elegida; el de otra semana nunca se deja a la vista.
  const current = requestKey !== null && result?.key === requestKey ? result : null

  return {
    payments: current?.data ?? null,
    error: current?.error ?? null,
    loading: requestKey !== null && current === null,
    reload: () => setReloadCount((count) => count + 1),
  }
}
