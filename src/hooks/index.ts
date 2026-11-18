import { useEffect, useState } from 'react'

/** Live clock that re-renders every `intervalMs`. */
export function useClock(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

/** useState that survives reloads (fails silently if storage is unavailable). */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])
  return [value, setValue] as const
}

export type Theme = 'dark' | 'light'

const THEME_COLOR: Record<Theme, string> = { dark: '#000000', light: '#f5f5f7' }

/**
 * Dark by default. The choice is stored under `nm.theme`; index.html applies it
 * before first paint so there is no flash of the wrong theme.
 */
export function useTheme() {
  const [stored, setTheme] = usePersistentState<Theme>('nm.theme', 'dark')
  const theme: Theme = stored === 'light' ? 'light' : 'dark' // ignore unknown/legacy values
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
