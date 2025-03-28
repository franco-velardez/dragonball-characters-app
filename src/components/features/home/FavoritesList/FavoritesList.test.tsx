import { render, screen } from '@testing-library/react'

import { mockUseStore } from '@/jest.setup'
import { Character } from '@/types'

import { FavoritesList } from './FavoritesList'

const mockFavorites: Character[] = [
  {
    id: 0,
    name: 'Goku',
    description: 'The main character',
    image: 'goku.jpg',
    transformations: [],
  },
]

describe('FavoritesList', () => {
  const defaultStoreState = {
    favorites: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseStore(defaultStoreState)
  })

  it('renders favorites list correctly', () => {
    mockUseStore({
      favorites: mockFavorites,
    })

    render(<FavoritesList />)

    expect(screen.getByText('FAVORITES')).toBeInTheDocument()
    expect(screen.getByText(mockFavorites[0].name)).toBeInTheDocument()
  })

  it('shows empty message when no favorites', () => {
    render(<FavoritesList />)

    expect(screen.getByText(/No favorite characters yet/)).toBeInTheDocument()
  })
})
