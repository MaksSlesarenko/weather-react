import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test-utils/renderWithProviders'
import WeatherErrorBoundary from '../WeatherErrorBoundary'

function Thrower(): never {
  throw new Error('API unavailable')
}

describe('WeatherErrorBoundary', () => {
  it('renders children normally when no error', () => {
    renderWithProviders(
      <WeatherErrorBoundary>
        <p>All good</p>
      </WeatherErrorBoundary>,
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('shows fallback UI when child throws', () => {
    // Suppress console.error from React for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderWithProviders(
      <WeatherErrorBoundary>
        <Thrower />
      </WeatherErrorBoundary>,
    )
    expect(screen.getByText(/weather data unavailable/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    spy.mockRestore()
  })

  it('resets to children view on Retry click', async () => {
    const user = userEvent.setup()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    let shouldThrow = true
    function MaybeThrow() {
      if (shouldThrow) throw new Error('fail')
      return <p>Recovered</p>
    }

    const { rerender } = renderWithProviders(
      <WeatherErrorBoundary>
        <MaybeThrow />
      </WeatherErrorBoundary>,
    )

    shouldThrow = false
    await user.click(screen.getByRole('button', { name: /retry/i }))
    rerender(
      <WeatherErrorBoundary>
        <MaybeThrow />
      </WeatherErrorBoundary>,
    )
    expect(screen.getByText('Recovered')).toBeInTheDocument()
    spy.mockRestore()
  })
})
