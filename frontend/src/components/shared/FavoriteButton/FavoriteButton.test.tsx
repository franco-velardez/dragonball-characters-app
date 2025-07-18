import { render, screen, fireEvent } from '@testing-library/react'

import { FavoriteButton } from './FavoriteButton'

describe('FavoriteButton', () => {
  const mockHandleClick = jest.fn()

  it('renders active state correctly', () => {
    render(
      <FavoriteButton
        isCharacterFavorite={true}
        handleFavoriteClick={mockHandleClick}
      />,
    )

    expect(
      screen.getByRole('button', { name: /Remove favorite/ }),
    ).toBeInTheDocument()
  })

  it('renders inactive state correctly', () => {
    render(
      <FavoriteButton
        isCharacterFavorite={false}
        handleFavoriteClick={mockHandleClick}
      />,
    )

    expect(
      screen.getByRole('button', { name: /Add favorite/ }),
    ).toBeInTheDocument()
  })

  it('calls handler when clicked', () => {
    render(
      <FavoriteButton
        isCharacterFavorite={false}
        handleFavoriteClick={mockHandleClick}
      />,
    )

    fireEvent.click(screen.getByRole('button'))
    expect(mockHandleClick).toHaveBeenCalled()
  })
})
