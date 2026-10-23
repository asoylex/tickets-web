import { listLands } from '@/api/lands'
import { listSuppliers } from '@/api/suppliers'
import type { Land, Supplier } from '@/interfaces'
import { useEffect, useState } from 'react'

// Opciones para los selectores. La API limita las páginas a 100 registros.
const OPTIONS_LIMIT = 100

export function useSupplierOptions() {
  const [options, setOptions] = useState<Supplier[]>([])

  useEffect(() => {
    let ignore = false
    listSuppliers({ limit: OPTIONS_LIMIT })
      .then((result) => {
        if (!ignore) setOptions(result.data)
      })
      .catch(() => undefined)
    return () => {
      ignore = true
    }
  }, [])

  return options
}

export function useLandOptions() {
  const [options, setOptions] = useState<Land[]>([])

  useEffect(() => {
    let ignore = false
    listLands({ limit: OPTIONS_LIMIT })
      .then((result) => {
        if (!ignore) setOptions(result.data)
      })
      .catch(() => undefined)
    return () => {
      ignore = true
    }
  }, [])

  return options
}
