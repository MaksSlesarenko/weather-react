import { describe, it, expect, beforeEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer, { toggleTheme, selectThemeMode } from '../themeSlice'
import { themeMiddleware } from '../themeMiddleware'

function makeStore(initialMode?: 'light' | 'dark') {
  return configureStore({
    reducer: { theme: themeReducer },
    middleware: (getDefault) => getDefault().concat(themeMiddleware),
    ...(initialMode
      ? { preloadedState: { theme: { mode: initialMode } } }
      : {}),
  })
}

describe('themeSlice', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('defaults to dark mode', () => {
    const store = makeStore()
    expect(selectThemeMode(store.getState())).toBe('dark')
  })

  it('reads initial mode from localStorage', () => {
    localStorage.setItem('theme', 'light')
    // Re-import to pick up localStorage value — use fresh store
    const store = configureStore({
      reducer: { theme: themeReducer },
      middleware: (getDefault) => getDefault().concat(themeMiddleware),
    })
    expect(selectThemeMode(store.getState())).toBe('light')
  })

  it('toggleTheme switches dark → light', () => {
    const store = makeStore('dark')
    store.dispatch(toggleTheme())
    expect(selectThemeMode(store.getState())).toBe('light')
  })

  it('toggleTheme switches light → dark', () => {
    const store = makeStore('light')
    store.dispatch(toggleTheme())
    expect(selectThemeMode(store.getState())).toBe('dark')
  })

  it('themeMiddleware persists mode to localStorage on toggle', () => {
    const store = makeStore('dark')
    store.dispatch(toggleTheme())
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
