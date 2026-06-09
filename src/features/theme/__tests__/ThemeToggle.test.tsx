import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test-utils/renderWithProviders'
import ThemeToggle from '../ThemeToggle'

describe('ThemeToggle', () => {
  it('renders DarkMode icon in light mode', () => {
    renderWithProviders(<ThemeToggle />, {
      preloadedState: { theme: { mode: 'light' } },
    })
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('renders LightMode icon in dark mode', () => {
    renderWithProviders(<ThemeToggle />, {
      preloadedState: { theme: { mode: 'dark' } },
    })
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })

  it('dispatches toggleTheme on click', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<ThemeToggle />, {
      preloadedState: { theme: { mode: 'dark' } },
    })
    await user.click(screen.getByRole('button'))
    expect(store.getState().theme.mode).toBe('light')
  })
})
