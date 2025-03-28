import { render, screen } from '@testing-library/react'

import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders correctly', () => {
    render(<LoadingSpinner />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
