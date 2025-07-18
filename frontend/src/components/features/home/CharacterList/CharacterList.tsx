import { useEffect, useState } from 'react'
import { Character } from 'shared-types'

import { LoadingSpinner, SearchBar } from '@/components/shared'
import { useAPI } from '@/hooks/useAPI'
import { useCharactersStore } from '@/store/useStore'

import './CharacterList.scss'
import { CharacterCard } from '../CharacterCard'

interface CharacterListProps {
  showOnlyFavorites?: boolean
}

export const CharacterList = ({
  showOnlyFavorites = false,
}: CharacterListProps) => {
  const {
    characters: apiCharacters,
    favoriteCharacters,
    getCharacters,
    isLoading: apiLoading,
    error: apiError,
  } = useAPI()

  const searchQuery = useCharactersStore((state) => state.searchQuery)
  const setSearchResults = useCharactersStore((state) => state.setSearchResults)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [totalResults, setTotalResults] = useState(0)

  // Load data based on showOnlyFavorites
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await getCharacters()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load data'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [showOnlyFavorites])

  // Handle all character display logic
  useEffect(() => {
    const updateDisplayedCharacters = () => {
      const sourceCharacters = showOnlyFavorites
        ? favoriteCharacters
        : apiCharacters

      const filtered = searchQuery
        ? sourceCharacters.filter((c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : sourceCharacters

      setCharacters(filtered)
      setTotalResults(filtered.length)
      setSearchResults(filtered)
    }

    updateDisplayedCharacters()
  }, [
    showOnlyFavorites,
    favoriteCharacters,
    apiCharacters,
    searchQuery,
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
      {!Array.isArray(safeCharacters) || safeCharacters.length === 0 ? (
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
