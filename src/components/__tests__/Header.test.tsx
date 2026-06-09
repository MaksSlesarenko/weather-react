import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import Header from '../Header'

describe('Header', () => {
  it('renders app title', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('Weather Forecast')).toBeInTheDocument()
  })
})
