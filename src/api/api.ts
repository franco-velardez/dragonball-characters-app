import axios from 'axios'

import { FetchCharactersResponse, Character } from '@/types'
import { getCachedData, setCachedData } from '@/utils/cache'
import { API_BASE_URL, CHARACTERS_LIMIT } from '@/utils/consts'

export const fetchCharacters = async (): Promise<{
  characters: Character[]
  total: number
}> => {
  const cacheKey = `characters_all_${CHARACTERS_LIMIT}`

  // Check localStorage
  const localStorageCachedData = getCachedData<{
    characters: Character[]
    total: number
  }>(cacheKey)
  if (localStorageCachedData) {
    // If cached data exists and is valid, return it
    return localStorageCachedData
  }

  try {
    const response = await axios.get<FetchCharactersResponse>(
      `${API_BASE_URL}/characters`,
      { params: { limit: CHARACTERS_LIMIT } },
    )

    const result = {
      characters: response.data.items,
      total: response.data.total,
    }

    // Cache in localStorage
    setCachedData(cacheKey, result)

    return result
  } catch (error) {
    console.error('Error fetching characters:', error)
    return {
      characters: [],
      total: 0,
    }
  }
}

export const fetchCharacterById = async (
  characterId: number,
): Promise<Character | null> => {
  const cacheKey = `character_${characterId}`

  // Check localStorage
  const localStorageCachedData = getCachedData<Character>(cacheKey)
  if (localStorageCachedData) {
    // If cached data exists and is valid, return it
    return localStorageCachedData
  }

  try {
    const response = await axios.get<Character>(
      `${API_BASE_URL}/characters/${characterId}`,
    )

    // Cache in localStorage
    setCachedData(cacheKey, response.data)

    return response.data
  } catch (error) {
    console.error(`Error fetching character with ID ${characterId}:`, error)
    return null
  }
}
