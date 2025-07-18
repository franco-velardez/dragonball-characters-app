import { Character } from 'shared-types'

export interface CharactersState {
  searchQuery: string
  searchResults: Character[]
  setSearchQuery: (query: string) => void
  setSearchResults: (characters: Character[]) => void
  clearSearchQuery: () => void
}
