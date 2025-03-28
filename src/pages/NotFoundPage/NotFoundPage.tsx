import { Link } from 'react-router-dom'

import { ROUTES } from '@/utils/consts'

import './NotFoundPage.scss'

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>{`The page you're looking for doesn't exist.`}</p>
      <Link to={ROUTES.HOME}>Return to Home</Link>
    </div>
  )
}
