import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './themeContext'

const STORAGE_KEY = 'theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'))

  // La clase "dark" en <html> activa todos los estilos dark: de Tailwind.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')) }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
