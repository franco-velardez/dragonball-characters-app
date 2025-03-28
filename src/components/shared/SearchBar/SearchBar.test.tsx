import { render, screen, fireEvent } from '@testing-library/react'

import { mockUseStore } from '@/jest.setup'

import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  const mockSetSearchQuery = jest.fn()
  const defaultStoreState = {
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseStore(defaultStoreState)
  })

  it('renders with placeholder', () => {
    render(<SearchBar />)

    expect(
      screen.getByPlaceholderText('SEARCH A CHARACTER...'),
    ).toBeInTheDocument()
  })

  it('focuses input on mount', () => {
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('SEARCH A CHARACTER...')
    expect(input).toHaveFocus()
  })

  it('updates search query on input change', async () => {
    render(<SearchBar />)

    const newInputValue = 'Goku'
    const input = screen.getByPlaceholderText('SEARCH A CHARACTER...')
    fireEvent.change(input, { target: { value: newInputValue } })
    expect(mockSetSearchQuery).toHaveBeenCalledTimes(1)
    expect(mockSetSearchQuery).toHaveBeenCalledWith(newInputValue)
  })

  it('clears input when searchQuery is cleared', async () => {
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('SEARCH A CHARACTER...')
    fireEvent.change(input, { target: { value: 'Goku' } })
    fireEvent.change(input, { target: { value: '' } })
    expect(mockSetSearchQuery).toHaveBeenCalledWith('')
  })
})
