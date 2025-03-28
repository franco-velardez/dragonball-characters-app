import { useMemo } from 'react'

import placeholderImage from '@/assets/placeholder-image.png'
import { FavoriteButton } from '@/components/shared'
import { useCharactersStore } from '@/store/useStore'
import { Character } from '@/types'
import { TRANSFORMATIONS_LIMIT } from '@/utils/consts'

import './CharacterDetails.scss'
import { TransformationsList } from '../TransformationsList'

interface CharacterDetailsProps {
  character: Character
  isLoading: boolean
}

export const CharacterDetails = ({
  character,
  isLoading,
}: CharacterDetailsProps) => {
  const addFavorite = useCharactersStore((state) => state.addFavorite)
  const removeFavorite = useCharactersStore((state) => state.removeFavorite)
  const isFavorite = useCharactersStore((state) => state.isFavorite)

  const slicedTransformations = useMemo(
    () => character.transformations.slice(0, TRANSFORMATIONS_LIMIT),
    [character.transformations],
  )

  const isCharacterFavorite = isFavorite(character.id)

  const handleFavoriteClick = () => {
    if (isCharacterFavorite) {
      removeFavorite(character.id)
    } else {
      addFavorite(character)
    }
  }

  const imageUrl = character.image || placeholderImage

  return (
    <div className="character-details">
      <div className="character-description-wrapper-container">
        <div className="character-description-wrapper">
          {/* Character Image */}
          <div className="character-hero">
            <img src={imageUrl} alt={character.name} />
          </div>

          {/* Character Details */}
          <div className="character-content">
            <div className="character-title">
              <h1>{character.name}</h1>
              <FavoriteButton
                isCharacterFavorite={isCharacterFavorite}
                handleFavoriteClick={handleFavoriteClick}
              />
            </div>
            <div className="character-description">
              <p>{character.description || 'No description available.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Character Transformations */}
      <div className="transformations-list-container">
        <TransformationsList
          transformations={slicedTransformations}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
