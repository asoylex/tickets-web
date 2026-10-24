import { ThemeContext } from '@/context/themeContext'
import { useContext } from 'react'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return context
}
