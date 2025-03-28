import { CACHE_EXPIRATION_TIME } from './consts'

interface CacheItem<T> {
  data: T
  timestamp: number
}

export const setCachedData = <T>(key: string, data: T): void => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    }

    localStorage.setItem(key, JSON.stringify(cacheItem))
  } catch (error) {
    console.error('Error setting cached data:', error)
  }
}

export const getCachedData = <T>(key: string): T | null => {
  const cachedItem = localStorage.getItem(key)

  if (!cachedItem) {
    return null
  }

  try {
    const parsed = JSON.parse(cachedItem) as CacheItem<T>
    const now = Date.now()

    // Check if cache has expired
    if (now - parsed.timestamp > CACHE_EXPIRATION_TIME) {
      localStorage.removeItem(key)
      return null
    }

    return parsed.data
  } catch (error) {
    console.error('Error parsing cached data:', error)
    localStorage.removeItem(key)
    return null
  }
}
