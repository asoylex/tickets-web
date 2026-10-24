import { getErrorMessage } from '@/api/errors'
import { listTickets } from '@/api/tickets'
import type { PaginationMeta, TicketFilters, TicketListItem } from '@/interfaces'
import { useEffect, useState } from 'react'

interface Result {
  key: string
  data: TicketListItem[]
  meta: PaginationMeta | null
  error: string | null
}

export function useTickets({ search, supplierId, landId, dateFrom, dateTo, page, limit }: TicketFilters) {
  const [result, setResult] = useState<Result | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  // Cada combinación de filtros es una petición distinta; mientras la respuesta no coincida, se está cargando.
  const requestKey = [search, supplierId, landId, dateFrom, dateTo, page, limit, reloadCount].join('|')

  useEffect(() => {
    let ignore = false

    listTickets({ search, supplierId, landId, dateFrom, dateTo, page, limit })
      .then((response) => {
        if (!ignore) setResult({ key: requestKey, data: response.data, meta: response.meta, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ key: requestKey, data: [], meta: null, error: getErrorMessage(error) })
      })

    // Si los filtros cambian antes de que llegue la respuesta, se descarta la anterior.
    return () => {
      ignore = true
    }
  }, [search, supplierId, landId, dateFrom, dateTo, page, limit, reloadCount, requestKey])

  const loading = result?.key !== requestKey

  return {
    tickets: result?.data ?? [],
    meta: result?.meta ?? null,
    error: loading ? null : (result?.error ?? null),
    loading,
    reload: () => setReloadCount((count) => count + 1),
  }
}
