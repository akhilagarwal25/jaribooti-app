import { createContext, useContext, useState, ReactNode } from 'react'
import { colors } from '../theme'

interface ThemeContextType {
  colors: typeof colors
  isDark: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  const toggleDark = () => setIsDark(prev => !prev)

  const value: ThemeContextType = {
    colors,
    isDark,
    toggleDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider')
  return ctx
}
