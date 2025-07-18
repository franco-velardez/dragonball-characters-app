/// <reference types="vite-plugin-svgr/client" />
import HeartActive from '@/assets/heart-active.svg?react'
import HeartInactive from '@/assets/heart-inactive.svg?react'

import './FavoriteButton.scss'

interface FavoriteButtonProps {
  isCharacterFavorite: boolean
  handleFavoriteClick: (e: React.MouseEvent) => void
  header?: boolean
}

export const FavoriteButton = ({
  isCharacterFavorite,
  handleFavoriteClick,
  header,
}: FavoriteButtonProps) => {
  return (
    <button
      className={`favorite-button ${isCharacterFavorite ? 'active' : ''} ${header ? 'big-icon' : ''}`}
      onClick={handleFavoriteClick}
      type="button"
      aria-label={isCharacterFavorite ? 'Remove favorite' : 'Add favorite'}
      onMouseDown={(e) => e.stopPropagation()}
      data-testid="favorite-button"
    >
      {isCharacterFavorite ? (
        <HeartActive aria-label="Character is favorite" />
      ) : (
        <HeartInactive aria-label="Character is not favorite" />
      )}
    </button>
  )
}
