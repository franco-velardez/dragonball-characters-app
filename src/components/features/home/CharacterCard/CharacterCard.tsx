import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import placeholderImage from '@/assets/placeholder-image.png'
import { FavoriteButton } from '@/components/shared'
import { useCharactersStore } from '@/store/useStore'
import { Character } from '@/types'
import { ROUTES } from '@/utils/consts'

import './CharacterCard.scss'

interface CharacterCardProps {
  character: Character
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const navigate = useNavigate()

  const addFavorite = useCharactersStore((state) => state.addFavorite)
  const removeFavorite = useCharactersStore((state) => state.removeFavorite)
  const isFavorite = useCharactersStore((state) => state.isFavorite)

  const isCharacterFavorite = isFavorite(character.id)

  const handleCardClick = useCallback(() => {
    navigate(`${ROUTES.CHARACTER_DETAILS_BASE}/${character.id}`)
  }, [character.id, navigate])

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (isCharacterFavorite) {
        removeFavorite(character.id)
      } else {
        addFavorite(character)
      }
    },
    [character, isCharacterFavorite, addFavorite, removeFavorite],
  )

  const imageUrl = character.image || placeholderImage

  return (
    <div
      className="character-card"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick()
        }
      }}
      tabIndex={0}
      role="button"
    >
      <img src={imageUrl} alt={character.name} />
      <div className="character-name">
        <div className="sweep-overlay" />
        <span>{character.name}</span>
        <FavoriteButton
          isCharacterFavorite={isCharacterFavorite}
          handleFavoriteClick={handleFavoriteClick}
        />
      </div>
    </div>
  )
}
