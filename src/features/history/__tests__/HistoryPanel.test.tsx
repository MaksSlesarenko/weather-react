import { describe, it, expect, vi } from 'vitest'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test-utils/renderWithProviders'
import HistoryPanel from '../HistoryPanel'
import { addCity, removeCity, type CityEntry } from '../historySlice'

function entry(name: string, countryCode = '', stateCode = ''): CityEntry {
  return { name, countryCode, stateCode, query: countryCode ? `${name},${countryCode.toLowerCase()}` : name }
}

const london: CityEntry = { name: 'london', countryCode: 'GB', stateCode: 'ENG', query: 'london,gb' }

describe('HistoryPanel', () => {
  it('shows empty state when no history', () => {
    renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    expect(screen.getByText(/no searches yet/i)).toBeInTheDocument()
  })

  it('renders history cities with country code', () => {
    const { store } = renderWithProviders(
      <HistoryPanel onCitySelect={vi.fn()} />,
    )
    act(() => {
      store.dispatch(addCity(entry('London', 'GB', 'ENG')))
      store.dispatch(addCity(entry('Paris', 'FR', 'IDF')))
    })
    expect(screen.getByText('london')).toBeInTheDocument()
    expect(screen.getByText('paris')).toBeInTheDocument()
    expect(screen.getByText('GB · ENG')).toBeInTheDocument()
    expect(screen.getByText('FR · IDF')).toBeInTheDocument()
  })

  it('calls onCitySelect with full entry when city is clicked', async () => {
    const onCitySelect = vi.fn()
    const user = userEvent.setup()
    const { store } = renderWithProviders(
      <HistoryPanel onCitySelect={onCitySelect} />,
    )
    const tokyo = entry('Tokyo', 'JP', '13')
    act(() => {
      store.dispatch(addCity(tokyo))
    })
    await user.click(screen.getByText('tokyo'))
    expect(onCitySelect).toHaveBeenCalledWith({ ...tokyo, name: 'tokyo' })
  })

  it('removes city and shows undo snackbar on delete', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(
      <HistoryPanel onCitySelect={vi.fn()} />,
    )
    act(() => {
      store.dispatch(addCity(entry('Berlin', 'DE', 'BE')))
    })
    await user.click(screen.getByLabelText(/remove berlin/i))
    expect(screen.queryByText('berlin')).not.toBeInTheDocument()
    expect(await screen.findByText(/city removed/i)).toBeInTheDocument()
  })

  it('restores city on snackbar Undo click', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(
      <HistoryPanel onCitySelect={vi.fn()} />,
    )
    act(() => {
      store.dispatch(addCity(entry('Madrid', 'ES', 'MD')))
    })
    await user.click(screen.getByLabelText(/remove madrid/i))
    // findByText targets snackbar "Undo" text button, not the icon button (aria-label only)
    await user.click(await screen.findByText('Undo'))
    await waitFor(() =>
      expect(screen.getByText('madrid')).toBeInTheDocument(),
    )
  })

  it('Undo icon button is disabled when nothing to undo', () => {
    renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    expect(screen.getByLabelText('Undo')).toBeDisabled()
  })

  it('Redo icon button is disabled initially', () => {
    renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    expect(screen.getByLabelText('Redo')).toBeDisabled()
  })

  it('Undo icon button enables after a city is removed', () => {
    const { store } = renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    act(() => {
      store.dispatch(addCity(london))
      store.dispatch(removeCity(london))
    })
    expect(screen.getByLabelText('Undo')).not.toBeDisabled()
  })

  it('Undo icon button dispatches undo', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    act(() => {
      store.dispatch(addCity(london))
      store.dispatch(removeCity(london))
    })
    await user.click(screen.getByLabelText('Undo'))
    expect(store.getState().history.present.cities).toContainEqual(london)
  })

  it('Redo icon button enables after undo', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    act(() => {
      store.dispatch(addCity(london))
      store.dispatch(removeCity(london))
    })
    await user.click(screen.getByLabelText('Undo'))
    expect(screen.getByLabelText('Redo')).not.toBeDisabled()
  })

  it('Redo icon button dispatches redo', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<HistoryPanel onCitySelect={vi.fn()} />)
    act(() => {
      store.dispatch(addCity(london))
      store.dispatch(removeCity(london))
    })
    await user.click(screen.getByLabelText('Undo'))
    await user.click(screen.getByLabelText('Redo'))
    expect(store.getState().history.present.cities).not.toContainEqual(london)
  })
})
