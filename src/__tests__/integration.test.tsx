import { describe, it, expect } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../test-utils/renderWithProviders'
import Layout from '../components/Layout'

describe('Integration: search → history → undo', () => {
  it('full flow: search city, appears in history, delete, undo restores', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Layout />)

    // Search for a city — select from dropdown (no free-text entry)
    await user.type(screen.getByPlaceholderText('Search city...'), 'London')
    const option = await screen.findByRole('option', { name: /^London\s+GB/i })
    await user.click(option)

    // Weather card appears (temp is the clearest unique indicator)
    await waitFor(() =>
      expect(screen.getByText(/°C/)).toBeInTheDocument(),
    )

    // City appears in both weather card and history panel
    expect(screen.getAllByText(/london/i).length).toBeGreaterThanOrEqual(2)

    // Delete from history
    await user.click(screen.getByLabelText(/remove london/i))

    // Snackbar appears
    expect(await screen.findByText(/city removed/i)).toBeInTheDocument()

    // History item gone from list
    const historyItems = screen.queryAllByRole('button', { name: /london/i })
    expect(historyItems.filter((el) => el.closest('li'))).toHaveLength(0)

    // Undo restores it (use the snackbar Undo button, not the Header icon button)
    const snackbar = await screen.findByRole('presentation')
    await user.click(within(snackbar).getByRole('button', { name: /undo/i }))
    await waitFor(() =>
      expect(screen.getByText('london')).toBeInTheDocument(),
    )
  })
})
