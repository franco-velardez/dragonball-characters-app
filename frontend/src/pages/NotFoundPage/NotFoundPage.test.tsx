import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ROUTES } from '@/utils/consts'

import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>)
  }

  it('renders 404 page with correct content', () => {
    renderWithRouter(<NotFoundPage />)

    expect(
      screen.getByRole('heading', { name: /404 - Page Not Found/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/The page you're looking for doesn't exist./i),
    ).toBeInTheDocument()
    const homeLink = screen.getByRole('link', { name: /Return to Home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', ROUTES.HOME)
  })
})
