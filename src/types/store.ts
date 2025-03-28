import { Character } from './character.ts'

export interface CharactersState {
  favorites: Character[]
  searchQuery: string
  searchResults: Character[]
  addFavorite: (character: Character) => void
  removeFavorite: (characterId: number) => void
  isFavorite: (characterId: number) => boolean
  setSearchQuery: (query: string) => void
  setSearchResults: (characters: Character[]) => void
  clearSearchQuery: () => void
}
