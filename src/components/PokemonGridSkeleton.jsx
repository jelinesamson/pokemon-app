export default function PokemonGridSkeleton({ count = 6 }) {
  return (
    <div className="card-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-card__visual" />
          <div className="skeleton-card__body">
            <span className="skeleton-line skeleton-line--lg" />
            <span className="skeleton-line skeleton-line--sm" />
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <div className="skeleton-card__actions">
              <span className="skeleton-pill" />
              <span className="skeleton-pill" />
              <span className="skeleton-pill" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
