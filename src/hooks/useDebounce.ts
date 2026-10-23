import { useEffect, useState } from 'react'

// Devuelve el valor solo después de que deja de cambiar durante "delay" milisegundos.
export function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
