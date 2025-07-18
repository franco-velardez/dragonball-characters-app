import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Character } from 'shared-types'

import { CharacterDetails } from '@/components/features'
import { LoadingSpinner } from '@/components/shared'
import { Header } from '@/components/ui'
import { useAPI } from '@/hooks/useAPI'
import { useCharactersStore } from '@/store/useStore'
import { ROUTES } from '@/utils/consts'

import './CharacterDetailsPage.scss'

export const CharacterDetailsPage = () => {
  const { id: characterId } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const {
    favoriteCharacters: favorites,
    isLoading,
    error,
    getCharacterById,
  } = useAPI()

  // Utilize the existing store
  const searchResults = useCharactersStore((state) => state.searchResults)

  const [character, setCharacter] = useState<Character | null>(null)
  const [hasTriedFetching, setHasTriedFetching] = useState(false)

  // Try to find character in existing store results first
  const existingCharacter = useMemo(() => {
    if (!characterId) return null
    const id = parseInt(characterId, 10)
    return [...searchResults, ...favorites].find((char) => char.id === id)
  }, [characterId, searchResults, favorites])

  const fetchCharacterData = useCallback(async () => {
    if (!characterId) {
      navigate(ROUTES.HOME)
      return
    }

    const id = parseInt(characterId, 10)

    // If character is already in store with transformations, use it
    if (
      existingCharacter &&
      existingCharacter.transformations &&
      existingCharacter.transformations.length > 0
    ) {
      setCharacter(existingCharacter)
      setHasTriedFetching(true)
      return
    }

    // If not in store or lacks transformations, fetch from API
    try {
      const characterData = await getCharacterById(id)
      if (characterData) {
        setCharacter(characterData)
      }
    } catch (err) {
      console.error('Error fetching character:', err)
    } finally {
      setHasTriedFetching(true)
    }
  }, [characterId, existingCharacter, getCharacterById, navigate])

  useEffect(() => {
    // Only fetch if we haven't tried fetching yet
    if (!hasTriedFetching) {
      fetchCharacterData()
    }
  }, [fetchCharacterData, hasTriedFetching])

  if (error) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  if (isLoading || !character) {
    return (
      <div>
        <Header />
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="container-character-details">
        <CharacterDetails character={character} isLoading={isLoading} />
      </div>
    </div>
  )
}
