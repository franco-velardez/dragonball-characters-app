import { fireEvent, render, screen } from '@testing-library/react'

import { mockUseStore } from '@/jest.setup'
import { Character } from '@/types'

import { CharacterDetails } from './CharacterDetails'

const mockCharacter: Character = {
  id: 0,
  name: 'Goku',
  description: 'The main character',
  image: 'goku.jpg',
  transformations: [
    {
      id: 0,
      name: 'Super Saiyan',
      description: 'First transformation',
      image: 'ssj.jpg',
      ki: '1000',
    },
  ],
}

describe('CharacterDetails', () => {
  const mockAddFavorite = jest.fn()
  const mockRemoveFavorite = jest.fn()
  const mockIsFavorite = jest.fn()
  const defaultStoreState = {
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    isFavorite: mockIsFavorite,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseStore(defaultStoreState)
  })

  it('renders character details correctly', () => {
    render(<CharacterDetails character={mockCharacter} isLoading={false} />)

    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument()
    expect(screen.getByText(mockCharacter.description)).toBeInTheDocument()
    expect(screen.getByText('TRANSFORMATIONS')).toBeInTheDocument()
    expect(
      screen.getByText(mockCharacter.transformations[0].name),
    ).toBeInTheDocument()
  })

  it('shows placeholder when no description', () => {
    const noDescChar = { ...mockCharacter, description: '' }
    render(<CharacterDetails character={noDescChar} isLoading={false} />)

    expect(screen.getByText('No description available.')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(<CharacterDetails character={mockCharacter} isLoading={true} />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('add favorite character when favorite button is clicked', () => {
    mockIsFavorite.mockReturnValue(false)
    render(<CharacterDetails character={mockCharacter} isLoading={false} />)

    fireEvent.click(screen.getByTestId('favorite-button'))
    expect(mockAddFavorite).toHaveBeenCalledWith(mockCharacter)
    expect(mockRemoveFavorite).not.toHaveBeenCalled()
  })

  it('remove favorite character when favorite button is clicked', () => {
    mockIsFavorite.mockReturnValue(true)
    render(<CharacterDetails character={mockCharacter} isLoading={false} />)

    fireEvent.click(screen.getByTestId('favorite-button'))
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockCharacter.id)
  })
})
