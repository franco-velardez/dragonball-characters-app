import { useNavigate } from 'react-router-dom'

import HeaderLogo from '@/assets/header-logo.svg?react'
import { FavoriteButton } from '@/components/shared'
import { useCharactersStore } from '@/store/useStore'
import { ROUTES } from '@/utils/consts'

import './Header.scss'

export const Header = () => {
  const favorites = useCharactersStore((state) => state.favorites)
  const clearSearchQuery = useCharactersStore((state) => state.clearSearchQuery)

  const navigate = useNavigate()

  const handleHomeNavigation = () => {
    clearSearchQuery()
    navigate(ROUTES.HOME)
  }

  const handleFavoritesNavigation = () => {
    clearSearchQuery()
    navigate(ROUTES.FAVORITES)
  }

  return (
    <header className="header">
      {/* Header Logo */}
      <button
        className="header-logo-button"
        onClick={handleHomeNavigation}
        data-testid="header-logo-button"
      >
        <HeaderLogo className="header-logo" aria-label="Dragonball logo" />
      </button>

      {/* Header Favorite Button */}
      <div className="header-right-icons">
        <FavoriteButton
          isCharacterFavorite={true}
          handleFavoriteClick={handleFavoritesNavigation}
          header
        />
        {favorites.length > 0 && (
          <span className="favorites-count">{favorites.length}</span>
        )}
      </div>
    </header>
  )
}
