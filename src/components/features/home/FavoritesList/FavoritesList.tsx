import { useCharactersStore } from '@/store/useStore'

import { CharacterCard } from '../CharacterCard'

export const FavoritesList = () => {
  const favorites = useCharactersStore((state) => state.favorites)

  return (
    <div>
      <h2 className="header-title">FAVORITES</h2>

      {/* Empty Favorites list message */}
      {favorites.length === 0 ? (
        <div className="no-results">
          No favorite characters yet. Add some favorites to see them here!
        </div>
      ) : (
        // Favorites List
        <div className="characters-grid">
          {favorites.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  )
}
