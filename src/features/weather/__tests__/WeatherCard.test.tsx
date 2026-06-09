import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import { OWM_BASE_URL } from '../../../app/constants'
import { renderWithProviders } from '../../../test-utils/renderWithProviders'
import WeatherCard from '../WeatherCard'

describe('WeatherCard', () => {
  it('shows prompt when no city is selected', () => {
    renderWithProviders(<WeatherCard city={null} />)
    expect(screen.getByText(/search for a city/i)).toBeInTheDocument()
  })

  it('shows skeleton while loading', async () => {
    // Delay MSW response so loading state is visible
    server.use(
      http.get(`${OWM_BASE_URL}/weather`, async () => {
        await new Promise((r) => setTimeout(r, 200))
        return HttpResponse.json({ cod: 200 })
      }),
    )
    renderWithProviders(<WeatherCard city="london" />)
    // Skeletons render as aria-busy="true" in MUI
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays weather data on success', async () => {
    renderWithProviders(<WeatherCard city="london" />)
    await waitFor(() =>
      expect(screen.getByText(/london/i)).toBeInTheDocument(),
    )
    expect(screen.getByText(/°C/)).toBeInTheDocument()
    expect(screen.getByText(/m\/s/i)).toBeInTheDocument()
  })

  it('shows warning alert on 404', async () => {
    server.use(
      http.get(`${OWM_BASE_URL}/weather`, () =>
        HttpResponse.json({ cod: '404', message: 'city not found' }, { status: 404 }),
      ),
    )
    renderWithProviders(<WeatherCard city="unknowncity99" />)
    await waitFor(() =>
      expect(screen.getByText(/city not found/i)).toBeInTheDocument(),
    )
  })

  it('shows error boundary fallback on 500', async () => {
    server.use(
      http.get(`${OWM_BASE_URL}/weather`, () =>
        HttpResponse.json({ message: 'internal error' }, { status: 500 }),
      ),
    )
    renderWithProviders(<WeatherCard city="london" />)
    await waitFor(() =>
      expect(screen.getByText(/weather data unavailable/i)).toBeInTheDocument(),
    )
  })
})
