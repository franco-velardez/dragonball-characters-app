import { render, screen } from '@testing-library/react'

import { Transformation } from '@/types'

import { TransformationsList } from './TransformationsList'

const mockTransformations: Transformation[] = [
  {
    id: 0,
    name: 'Super Saiyan',
    description: 'First transformation',
    image: 'ssj.jpg',
    ki: '1000',
  },
  {
    id: 1,
    name: 'Super Saiyan 2',
    description: 'Second transformation',
    image: 'ssj2.jpg',
    ki: '2000',
  },
]

describe('TransformationsList', () => {
  it('renders transformations correctly', () => {
    render(
      <TransformationsList
        transformations={mockTransformations}
        isLoading={false}
      />,
    )

    expect(screen.getByText('TRANSFORMATIONS')).toBeInTheDocument()
    expect(screen.getByText(mockTransformations[0].name)).toBeInTheDocument()
    expect(
      screen.getByText(mockTransformations[0].description),
    ).toBeInTheDocument()

    const kiElements = screen.getAllByText('KI:')
    expect(kiElements).toHaveLength(mockTransformations.length)
    expect(screen.getByText(mockTransformations[0].ki)).toBeInTheDocument()
  })

  it('shows no transformations message when empty', () => {
    render(<TransformationsList transformations={[]} isLoading={false} />)

    expect(
      screen.getByText('No transformations found for this character.'),
    ).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(<TransformationsList transformations={[]} isLoading={true} />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
