import placeholderImage from '@/assets/placeholder-image.png'
import { LoadingSpinner } from '@/components/shared'
import { Transformation } from '@/types'

import './TransformationsList.scss'

interface TransformationsListProps {
  transformations?: Transformation[]
  isLoading: boolean
}

export const TransformationsList = ({
  transformations = [],
  isLoading,
}: TransformationsListProps) => {
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="transformations-section">
      <h3>TRANSFORMATIONS</h3>

      {transformations.length === 0 ? (
        <div className="no-results">
          No transformations found for this character.
        </div>
      ) : (
        <div className="transformations-grid">
          {transformations.map((transformation, index) => {
            {
              /* Transformation Details */
            }
            const imageUrl = transformation.image || placeholderImage
            return (
              <div className="transformation-card" key={index}>
                <img src={imageUrl} alt={transformation.name} />
                <div className="transformation-info">
                  <div className="transformation-name">
                    {transformation.name}
                  </div>
                  {transformation.description && (
                    <div className="transformation-description">
                      {transformation.description}
                    </div>
                  )}
                  {transformation.ki && (
                    <div className="transformation-stat">
                      <span className="stat-label">KI:</span>
                      <span className="stat-value">{transformation.ki}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
