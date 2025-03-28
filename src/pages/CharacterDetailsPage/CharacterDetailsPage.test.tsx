import { render, screen, waitFor } from '@testing-library/react'

import { mockReactRouterDom, mockUseAPI, mockUseStore } from '@/jest.setup'
import { Character } from '@/types'

import { CharacterDetailsPage } from './CharacterDetailsPage'

jest.mock('@/components/ui', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

jest.mock('@/components/features', () => ({
  CharacterDetails: ({ character }: { character: Character }) => (
    <div data-testid="character-details">{character.name}</div>
  ),
}))

jest.mock('@/components/shared', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}))

const mockCharacter: Character = {
  id: 0,
  name: 'Goku',
  description: 'Saiyan warrior',
  transformations: [],
  image: 'goku.jpg',
}

describe('CharacterDetailsPage', () => {
  const mockNavigate = jest.fn()
  const defaultReactRouterDomState = {
    navigate: mockNavigate,
    params: { id: mockCharacter.id.toString() },
  }

  const defaultStoreState = {
    searchResults: [mockCharacter],
    favorites: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockReactRouterDom(defaultReactRouterDomState)
    mockUseStore(defaultStoreState)
  })

  it('renders loading spinner while fetching character', () => {
    mockUseAPI({
      isLoading: true,
      error: null,
      getCharacterById: jest.fn(),
    })
    render(<CharacterDetailsPage />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders character details when character is found', async () => {
    mockUseAPI({
      isLoading: false,
      error: null,
      getCharacterById: jest.fn().mockResolvedValue(mockCharacter),
    })
    render(<CharacterDetailsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('character-details')).toBeInTheDocument()
      expect(screen.getByText(mockCharacter.name)).toBeInTheDocument()
    })
  })

  it('displays error message when fetching fails', async () => {
    mockUseAPI({
      isLoading: false,
      error: 'Failed to fetch character',
      getCharacterById: jest.fn(),
    })
    render(<CharacterDetailsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch character')).toBeInTheDocument()
    })
  })
})
