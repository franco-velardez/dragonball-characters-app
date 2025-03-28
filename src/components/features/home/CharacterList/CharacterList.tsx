import { useEffect, useMemo, useState } from 'react'

import { LoadingSpinner, SearchBar } from '@/components/shared'
import { useAPI } from '@/hooks/useAPI'
import { useCharactersStore } from '@/store/useStore'
import { Character } from '@/types'

import './CharacterList.scss'
import { CharacterCard } from '../CharacterCard'

interface CharacterListProps {
  showOnlyFavorites?: boolean
}

export const CharacterList = ({
  showOnlyFavorites = false,
}: CharacterListProps) => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchQuery = useCharactersStore((state) => state.searchQuery)
  const setSearchResults = useCharactersStore((state) => state.setSearchResults)
  const favorites = useCharactersStore((state) => state.favorites)
  const searchResults = useCharactersStore((state) => state.searchResults)

  const { getCharacters, isLoading: apiLoading, error: apiError } = useAPI()

  // For actual searches, filter the existing search results
  const filteredCharacters = useMemo(() => {
    const resultsToFilter =
      searchResults.length > 0 ? searchResults : characters
    return resultsToFilter.filter((character) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, searchResults, characters])

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (showOnlyFavorites) {
          // When showing only favorites
          let filteredFavorites = favorites || []

          // Apply search filter to favorites if there's a search query
          if (searchQuery.length > 0) {
            filteredFavorites = filteredFavorites.filter((character) =>
              character.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          }

          setCharacters(filteredFavorites)
          setTotalResults(filteredFavorites.length)
          setSearchResults(filteredFavorites)
          setIsLoading(false)
          return
        }

        // For non-favorites view
        // Always fetch fresh data when searchQuery is empty
        if (searchQuery.length === 0) {
          const result = await getCharacters()
          setCharacters(result.characters)
          setTotalResults(result.total)
          setSearchResults(result.characters)
          return
        }

        setCharacters(filteredCharacters)
        setTotalResults(filteredCharacters.length)

        // Only update search results if we're doing a new search
        if (searchResults.length === 0) {
          setSearchResults(filteredCharacters)
        }
      } catch (err) {
        setError('Failed to load characters. Please try again later.')
        console.error(err)
        setCharacters([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacters()
  }, [
    searchQuery,
    showOnlyFavorites,
    favorites,
    getCharacters,
    setSearchResults,
  ])

  if (isLoading || apiLoading) {
    return <LoadingSpinner />
  }

  if (error || apiError) {
    return <div className="error-message">{error || apiError}</div>
  }

  const safeCharacters = characters || []

  return (
    <div>
      {showOnlyFavorites ? <h2 className="header-title">FAVORITES</h2> : <></>}

      {/* Search Bar */}
      <SearchBar />
      <div className="results-count">
        {totalResults} RESULT{totalResults !== 1 ? 'S' : ''}
      </div>

      {/* Empty Characters List Message */}
      {safeCharacters.length === 0 ? (
        <div className="no-results">
          {showOnlyFavorites
            ? searchQuery.length > 0
              ? 'No favorite characters match your search.'
              : 'No favorite characters yet. Add some favorites to see them here!'
            : 'No characters found. Try a different search term.'}
        </div>
      ) : (
        // Characters List
        <div className="characters-grid">
          {safeCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  )
}
