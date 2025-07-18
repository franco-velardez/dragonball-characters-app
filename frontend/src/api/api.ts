import axios from 'axios'
import {
  API_CHARACTERS,
  API_FAVORITES,
  API_FAVORITES_TOGGLE,
  Character,
} from 'shared'

const API_URL = import.meta.env.VITE_API_URL

// Session management
const getSessionId = () => {
  let sessionId = localStorage.getItem('db_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('db_session_id', sessionId)
  }
  return sessionId
}

// Fetch all characters
export const fetchCharacters = async (): Promise<{
  characters: Character[]
  total: number
}> => {
  try {
    const response = await axios.get(`${API_URL}/${API_CHARACTERS}`)
    return {
      characters: response.data.items,
      total: response.data.total,
    }
  } catch (error) {
    console.error('Error fetching characters:', error)
    return {
      characters: [],
      total: 0,
    }
  }
}

// Get single character
export const fetchCharacterById = async (
  characterId: number,
): Promise<Character | null> => {
  try {
    const response = await axios.get(
      `${API_URL}/${API_CHARACTERS}/${characterId}`,
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching character ${characterId}:`, error)
    return null
  }
}

// Favorites system
export const getFavorites = async (): Promise<number[]> => {
  const response = await axios.get(`${API_URL}/${API_FAVORITES}`, {
    params: { sessionId: getSessionId() },
  })
  return response.data
}

export const toggleFavorite = async (
  characterId: number,
): Promise<number[]> => {
  try {
    const response = await axios.post(
      `${API_URL}/${API_FAVORITES}/${API_FAVORITES_TOGGLE}`,
      {
        sessionId: getSessionId(),
        characterId,
      },
    )
    return response.data.favorites || []
  } catch (error) {
    console.error('Error toggling favorite:', error)
    throw error
  }
}
