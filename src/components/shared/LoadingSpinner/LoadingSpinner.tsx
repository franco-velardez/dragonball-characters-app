import './LoadingSpinner.scss'

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner" data-testid="loading-spinner">
      <div className="spinner" />
    </div>
  )
}
