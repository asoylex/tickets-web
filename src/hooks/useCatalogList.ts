import { getErrorMessage } from '@/api/errors'
import type { CatalogFilters, CatalogItem, CatalogResource, PaginationMeta } from '@/interfaces'
import { useEffect, useState } from 'react'

interface Result {
  key: string
  data: CatalogItem[]
  meta: PaginationMeta | null
  error: string | null
}

export function useCatalogList(list: CatalogResource['list'], { search, isActive, page, limit }: CatalogFilters) {
  const [result, setResult] = useState<Result | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  const requestKey = [search, isActive, page, limit, reloadCount].join('|')

  useEffect(() => {
    let ignore = false

    list({ search, isActive, page, limit })
      .then((response) => {
        if (!ignore) setResult({ key: requestKey, data: response.data, meta: response.meta, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ key: requestKey, data: [], meta: null, error: getErrorMessage(error) })
      })

    return () => {
      ignore = true
    }
  }, [list, search, isActive, page, limit, requestKey])

  const loading = result?.key !== requestKey

  return {
    items: result?.data ?? [],
    meta: result?.meta ?? null,
    error: loading ? null : (result?.error ?? null),
    loading,
    reload: () => setReloadCount((count) => count + 1),
  }
}
