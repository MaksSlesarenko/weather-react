import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  it('calls onSearch with ICity when selecting from dropdown', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<SearchBar onSearch={onSearch} />)
    await user.type(screen.getByPlaceholderText('Search city...'), 'London')
    const option = await screen.findByRole('option', { name: /^London\s+GB/i })
    await user.click(option)
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'London', countryCode: 'GB' }),
    )
  })

  it('calls onSearch once on selection, not on subsequent interactions', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<SearchBar onSearch={onSearch} />)
    await user.type(screen.getByPlaceholderText('Search city...'), 'Paris')
    const option = await screen.findByRole('option', { name: /^Paris\s+FR/i })
    await user.click(option)
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Paris', countryCode: 'FR' }),
    )
  })

  it('does not call onSearch with no input', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<SearchBar onSearch={onSearch} />)
    await user.keyboard('{Enter}')
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('disables input when disabled prop is true', () => {
    renderWithProviders(<SearchBar onSearch={vi.fn()} disabled />)
    expect(screen.getByPlaceholderText('Search city...')).toBeDisabled()
  })
})
