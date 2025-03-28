import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { mockReactRouterDom, mockUseStore } from '@/jest.setup'
import { Character } from '@/types'

import { CharacterCard } from './CharacterCard'

const mockCharacter: Character = {
  id: 0,
  name: 'Goku',
  description: 'Saiyan warrior',
  transformations: [],
  image: 'goku.jpg',
}

describe('CharacterCard', () => {
  const mockNavigate = jest.fn()
  const defaultReactRouterDomState = {
    navigate: mockNavigate,
  }

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
    mockReactRouterDom(defaultReactRouterDomState)
    mockUseStore(defaultStoreState)
  })

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>)
  }

  it('renders character name and image', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)

    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'goku.jpg')
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockCharacter.name)
  })

  it('calls navigate when clicked', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(mockNavigate).toHaveBeenCalledWith(`/character/${mockCharacter.id}`)
  })

  it('calls navigate when Enter key is pressed', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)

    fireEvent.keyDown(screen.getAllByRole('button')[0], { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith(`/character/${mockCharacter.id}`)
  })

  it('add favorite character when favorite button is clicked', () => {
    mockIsFavorite.mockReturnValue(false)
    renderWithRouter(<CharacterCard character={mockCharacter} />)

    fireEvent.click(screen.getByTestId('favorite-button'))
    expect(mockAddFavorite).toHaveBeenCalledWith(mockCharacter)
    expect(mockRemoveFavorite).not.toHaveBeenCalled()
  })

  it('remove favorite character when favorite button is clicked', () => {
    mockIsFavorite.mockReturnValue(true)
    renderWithRouter(<CharacterCard character={mockCharacter} />)

    fireEvent.click(screen.getByTestId('favorite-button'))
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockCharacter.id)
  })
})
