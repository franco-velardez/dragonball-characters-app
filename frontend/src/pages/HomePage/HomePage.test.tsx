import { render, screen } from '@testing-library/react'

import { mockReactRouterDom } from '@/jest.setup'
import { ROUTES } from '@/utils/consts'

import { HomePage } from './HomePage'

jest.mock('@/components/ui', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

jest.mock('@/components/features', () => ({
  CharacterList: ({ showOnlyFavorites }: { showOnlyFavorites?: boolean }) => (
    <div data-testid="character-list">
      {showOnlyFavorites ? 'Favorites List' : 'All Characters List'}
    </div>
  ),
}))

describe('HomePage', () => {
  const mockLocation = {
    pathname: ROUTES.HOME,
    search: '',
    hash: '',
    state: null,
  }
  const defaultReactRouterDomState = {
    location: mockLocation,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockReactRouterDom(defaultReactRouterDomState)
  })

  it('renders header and character list', () => {
    render(<HomePage />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('character-list')).toBeInTheDocument()
    expect(screen.getByText('All Characters List')).toBeInTheDocument()
  })

  it('shows favorites list when on favorites route', () => {
    mockReactRouterDom({
      location: {
        pathname: ROUTES.FAVORITES,
        search: '',
        hash: '',
        state: null,
      },
    })
    render(<HomePage />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('character-list')).toBeInTheDocument()
    expect(screen.getByText('Favorites List')).toBeInTheDocument()
  })
})
