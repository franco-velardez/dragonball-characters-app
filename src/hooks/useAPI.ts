import { useState, useCallback } from 'react'

import { fetchCharacters, fetchCharacterById } from '@/api/api'
import { Character } from '@/types'

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])

  const getCharacters = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await fetchCharacters()

      const fetchedCharacters = result?.characters || []
      const total = fetchedCharacters.length

      // Ensure characters are set in state
      setCharacters(fetchedCharacters)

      return {
        characters: fetchedCharacters,
        total,
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch characters. Please try again later.'

      setError(errorMessage)
      console.error('Error in getCharacters:', err)

      setCharacters([])
      return { characters: [], total: 0 }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCharacterById = useCallback(async (characterId: number) => {
    // Validate input
    if (!characterId || characterId <= 0) {
      console.error('Invalid character ID:', characterId)
      setError(`Invalid character ID`)
      return null
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch character details
      const character = await fetchCharacterById(characterId)

      if (!character) {
        console.warn(`No character found with ID: ${characterId}`)
        setError(`Character with ID ${characterId} not found`)
        return null
      }

      return character
    } catch (err) {
      // More detailed error handling
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Unexpected error fetching character with ID ${characterId}`

      console.error('Error in getCharacterById:', {
        characterId,
        error: err,
        errorMessage,
      })

      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    characters,
    getCharacters,
    getCharacterById,
  }
}
