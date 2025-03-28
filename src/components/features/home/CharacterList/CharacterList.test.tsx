import { render, screen, waitFor } from '@testing-library/react'

import { mockUseStore, mockUseAPI } from '@/jest.setup'
import { Character } from '@/types'

import { CharacterList } from './CharacterList'

const mockCharacters: Character[] = [
  {
    id: 0,
    name: 'Goku',
    description: 'Saiyan warrior',
    transformations: [],
    image: 'goku.jpg',
  },
  {
    id: 1,
    name: 'Vegeta',
    description: 'Saiyan prince',
    transformations: [],
    image: 'vegeta.jpg',
  },
]

describe('CharacterList', () => {
  const favorites = [mockCharacters[0]]
  const mockSetSearchResults = jest.fn()
  const defaultStoreState = {
    setSearchResults: mockSetSearchResults,
    favorites: favorites,
    searchResults: mockCharacters,
    searchQuery: '',
  }

  const defaultUseAPIState = {
    isLoading: false,
    error: null,
    characters: mockCharacters,
    getCharacters: jest.fn().mockResolvedValue({
      characters: mockCharacters,
      total: mockCharacters.length,
    }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseStore(defaultStoreState)
    mockUseAPI(defaultUseAPIState)
  })

  it('shows loading spinner when loading', async () => {
    mockUseAPI({
      isLoading: true,
      error: null,
      characters: [],
      getCharacters: jest.fn(),
    })

    render(<CharacterList />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('does not show loading spinner when not loading', async () => {
    render(<CharacterList />)
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    })
  })

  it('displays error message when there is an error', async () => {
    mockUseAPI({
      isLoading: false,
      error: 'Failed to fetch',
      characters: [],
      getCharacters: jest.fn(),
    })

    render(<CharacterList />)
    await waitFor(() => {
      expect(
        screen.getByText('Failed to load characters. Please try again later.'),
      ).toBeInTheDocument()
    })
  })

  it('displays characters when loaded', async () => {
    render(<CharacterList />)
    await waitFor(() => {
      expect(screen.getByText(mockCharacters[0].name)).toBeInTheDocument()
      expect(screen.getByText(mockCharacters[1].name)).toBeInTheDocument()
      expect(
        screen.getByText(`${mockCharacters.length} RESULTS`),
      ).toBeInTheDocument()
    })
  })

  it('shows favorites only when showOnlyFavorites is true', async () => {
    render(<CharacterList showOnlyFavorites={true} />)
    await waitFor(() => {
      expect(screen.getByText('FAVORITES')).toBeInTheDocument()
      expect(screen.getByText(mockCharacters[0].name)).toBeInTheDocument()
      expect(screen.queryByText(mockCharacters[1].name)).not.toBeInTheDocument()
      expect(screen.getByText(`${favorites.length} RESULT`)).toBeInTheDocument()
    })
  })

  it('shows no results message when no characters found', async () => {
    mockUseAPI({
      isLoading: false,
      error: null,
      characters: [],
      getCharacters: jest.fn().mockResolvedValue({
        characters: [],
        total: 0,
      }),
    })

    render(<CharacterList />)
    await waitFor(() => {
      expect(
        screen.getByText('No characters found. Try a different search term.'),
      ).toBeInTheDocument()
    })
  })
})
