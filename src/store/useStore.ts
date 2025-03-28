import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { Character, CharactersState } from '@/types'

export const useCharactersStore = create<CharactersState>()(
  devtools(
    persist(
      immer((set, get) => ({
        favorites: [],
        searchQuery: '',
        searchResults: [],

        addFavorite: (character: Character) => {
          set((state) => {
            // Only add if not already a favorite to prevent unnecessary updates
            if (!state.favorites.some((fav) => fav.id === character.id)) {
              state.favorites.push(character)
            }
          })
        },

        removeFavorite: (characterId: number) => {
          set((state) => {
            state.favorites = state.favorites.filter(
              (fav) => fav.id !== characterId,
            )
          })
        },

        isFavorite: (characterId: number) => {
          return get().favorites.some((fav) => fav.id === characterId)
        },

        setSearchQuery: (query: string) => {
          const trimmedQuery = query.trim().toLowerCase()
          set((state) => {
            // Only update if query actually changes
            if (state.searchQuery !== trimmedQuery) {
              state.searchQuery = trimmedQuery
            }
          })
        },

        setSearchResults: (characters: Character[]) => {
          set((state) => {
            // Shallow comparison to prevent unnecessary updates
            if (state.searchResults !== characters) {
              state.searchResults = characters
            }
          })
        },

        clearSearchQuery: () => {
          set((state) => {
            state.searchQuery = ''
            state.searchResults = []
          })
        },
      })),
      {
        name: 'characters-storage',
        partialize: (state) => ({
          favorites: state.favorites,
          searchQuery: state.searchQuery,
          searchResults: state.searchResults,
        }),
      },
    ),
  ),
)
