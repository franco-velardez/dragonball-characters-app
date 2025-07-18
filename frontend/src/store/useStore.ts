import { Character } from 'shared-types'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface CharactersState {
  searchQuery: string
  searchResults: Character[]
  setSearchQuery: (query: string) => void
  setSearchResults: (characters: Character[]) => void
  clearSearchQuery: () => void
}

export const useCharactersStore = create<CharactersState>()(
  devtools(
    persist(
      immer((set) => ({
        searchQuery: '',
        searchResults: [],

        setSearchQuery: (query: string) => {
          const trimmedQuery = query.trim().toLowerCase()
          set((state) => {
            if (state.searchQuery !== trimmedQuery) {
              state.searchQuery = trimmedQuery
            }
          })
        },

        setSearchResults: (characters: Character[]) => {
          set((state) => {
            if (state.searchResults !== characters) {
              state.searchResults = characters
            }
          })
        },

        clearSearchQuery: () => {
          set({ searchQuery: '', searchResults: [] })
        },
      })),
      {
        name: 'characters-storage',
        partialize: (state) => ({
          searchQuery: state.searchQuery,
          searchResults: state.searchResults,
        }),
      },
    ),
  ),
)
