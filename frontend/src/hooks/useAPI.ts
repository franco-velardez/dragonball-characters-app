import { useState, useCallback, useEffect } from 'react'
import { Character } from 'shared-types'

import {
  fetchCharacters,
  fetchCharacterById,
  getFavorites,
  toggleFavorite,
} from '@/api/api'

// Shared state across all hook instances
const sharedState = {
  characters: [] as Character[],
  favorites: [] as number[],
  favoriteCharacters: [] as Character[],
  subscribers: new Set<() => void>(),
}

const updateSharedState = (
  newCharacters?: Character[],
  newFavorites?: number[],
) => {
  if (newCharacters) sharedState.characters = newCharacters
  if (newFavorites) sharedState.favorites = newFavorites

  // Recalculate favorite characters
  sharedState.favoriteCharacters = sharedState.characters.filter((c) =>
    sharedState.favorites.includes(c.id),
  )

  // Notify all subscribers
  sharedState.subscribers.forEach((callback) => callback())
}

let favoritesPromise: Promise<number[]> | null = null

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Local state that mirrors shared state
  const [characters, setCharacters] = useState<Character[]>(
    sharedState.characters,
  )
  const [favorites, setFavorites] = useState<number[]>(sharedState.favorites)
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>(
    sharedState.favoriteCharacters,
  )

  // Subscribe to shared state changes
  useEffect(() => {
    const updateLocalState = () => {
      setCharacters([...sharedState.characters])
      setFavorites([...sharedState.favorites])
      setFavoriteCharacters([...sharedState.favoriteCharacters])
    }

    sharedState.subscribers.add(updateLocalState)

    return () => {
      sharedState.subscribers.delete(updateLocalState)
    }
  }, [])

  // Load favorites - shared across all hook instances
  useEffect(() => {
    let isMounted = true

    const loadFavorites = async () => {
      try {
        if (!favoritesPromise) {
          favoritesPromise = getFavorites()
        }

        const initialFavorites = await favoritesPromise

        if (isMounted) {
          updateSharedState(
            undefined,
            Array.isArray(initialFavorites) ? initialFavorites : [],
          )
        }
      } catch (err) {
        console.error('Error in loadFavorites:', err)
        updateSharedState(undefined, [])
      } finally {
        favoritesPromise = null
      }
    }

    if (sharedState.favorites.length === 0) {
      loadFavorites()
    }

    return () => {
      isMounted = false
    }
  }, [])

  const getCharacters = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [charactersResult, currentFavorites] = await Promise.all([
        fetchCharacters(),
        getFavorites(),
      ])

      // Update shared state instead of local state
      updateSharedState(charactersResult.characters, currentFavorites)

      return {
        characters: charactersResult.characters,
        total: charactersResult.total,
      }
    } catch (err) {
      console.error('Error in getCharacters:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleToggleFavorite = useCallback(
    async (characterId: number) => {
      try {
        setIsLoading(true)
        setError(null)

        await toggleFavorite(characterId)

        const [charactersResult, updatedFavorites] = await Promise.all([
          fetchCharacters(),
          getFavorites(),
        ])

        // Update shared state - this will update ALL hook instances
        updateSharedState(charactersResult.characters, updatedFavorites)
      } catch (err) {
        console.error('Error toggling favorite:', err)
        setError('Failed to update favorite')
      } finally {
        setIsLoading(false)
      }
    },
    [favorites, favoriteCharacters.length, characters.length],
  )

  const getCharacterById = useCallback(async (characterId: number) => {
    if (!characterId || characterId <= 0) {
      setError('Invalid character ID')
      return null
    }

    try {
      setIsLoading(true)
      setError(null)

      const character = await fetchCharacterById(characterId)
      if (!character) {
        setError(`Character ${characterId} not found`)
        return null
      }

      return character
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error fetching character ${characterId}`
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshFavorites = useCallback(async () => {
    try {
      const freshFavorites = await getFavorites()
      updateSharedState(undefined, freshFavorites)
      return freshFavorites
    } catch (err) {
      console.error('Error in refreshFavorites:', err)
      return []
    }
  }, [])

  const isFavorite = useCallback(
    (characterId: number): boolean => {
      return Array.isArray(favorites) ? favorites.includes(characterId) : false
    },
    [favorites],
  )

  return {
    isLoading,
    error,
    characters,
    favorites,
    favoriteCharacters,
    getCharacters,
    getCharacterById,
    toggleFavorite: handleToggleFavorite,
    isFavorite,
    refreshFavorites,
  }
}
