import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { CharacterDetailsPage } from './pages/CharacterDetailsPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { ROUTES } from './utils/consts'

const router = createBrowserRouter(
  [
    { path: ROUTES.HOME, element: <HomePage /> },
    { path: ROUTES.FAVORITES, element: <HomePage /> },
    { path: ROUTES.CHARACTER_DETAILS_ID, element: <CharacterDetailsPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
)

function App() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  )
}

export default App
