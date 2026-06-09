import type { Middleware } from '@reduxjs/toolkit'
import { toggleTheme } from './themeSlice'

export const themeMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  if (toggleTheme.match(action)) {
    const mode = (store.getState() as { theme: { mode: string } }).theme.mode
    localStorage.setItem('theme', mode)
  }
  return result
}
