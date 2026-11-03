import Pokeball from './Pokeball'

export default function LoadingSpinner({ label = 'Loading…', fullScreen = false, size = 46 }) {
  if (fullScreen) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="loading-screen__brand">
          <Pokeball size={56} spinning />
          <span>PokéDex Manager</span>
        </div>
        <p className="loading-screen__label">{label}</p>
      </div>
    )
  }

  return (
    <div className="loading-block" role="status" aria-live="polite">
      <Pokeball size={size} spinning />
      <p className="loading-block__label">{label}</p>
    </div>
  )
}
