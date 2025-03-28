import { useLocation } from 'react-router-dom'

import { CharacterList } from '@/components/features'
import { Header } from '@/components/ui'
import { ROUTES } from '@/utils/consts'

export const HomePage = () => {
  const location = useLocation()
  const showFavorites = location.pathname === ROUTES.FAVORITES

  return (
    <div>
      <Header />
      <div className="container">
        <CharacterList showOnlyFavorites={showFavorites} />
      </div>
    </div>
  )
}
