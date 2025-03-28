import { render, screen, fireEvent } from '@testing-library/react'

import { mockReactRouterDom, mockUseStore } from '@/jest.setup'
import { Character } from '@/types'
import { ROUTES } from '@/utils/consts'

import { Header } from './Header'

const mockFavorites: Character[] = [
  {
    id: 0,
    name: 'Goku',
    description: 'The main character',
    image: 'goku.jpg',
    transformations: [],
  },
]

describe('Header', () => {
  const mockNavigate = jest.fn()
  const defaultReactRouterDomState = {
    navigate: mockNavigate,
  }

  const mockClearSearchQuery = jest.fn()
  const defaultStoreState = {
    favorites: [],
    clearSearchQuery: mockClearSearchQuery,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockReactRouterDom(defaultReactRouterDomState)
    mockUseStore(defaultStoreState)
  })

  it('renders logo and favorite button', () => {
    render(<Header />)

    expect(screen.getByTestId('header-logo-button')).toBeInTheDocument()
    expect(screen.getByTestId('favorite-button')).toBeInTheDocument()
  })

  it('navigates to home when logo is clicked', () => {
    render(<Header />)

    fireEvent.click(screen.getByTestId('header-logo-button'))
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME)
    expect(mockClearSearchQuery).toHaveBeenCalled()
  })

  it('navigates to favorites when favorite button is clicked', () => {
    render(<Header />)

    fireEvent.click(screen.getByTestId('favorite-button'))
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.FAVORITES)
    expect(mockClearSearchQuery).toHaveBeenCalled()
  })

  it('displays favorites count when there are favorites', () => {
    mockUseStore({
      favorites: mockFavorites,
      clearSearchQuery: mockClearSearchQuery,
    })
    render(<Header />)

    expect(screen.getByText(mockFavorites.length)).toBeInTheDocument()
  })

  it('does not display favorites count when there are no favorites', () => {
    render(<Header />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
