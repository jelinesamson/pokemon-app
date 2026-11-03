import { getTypeMeta } from '../utils/pokemonTypes'

export default function TypeBadge({ type, icon = true, className = '' }) {
  const meta = getTypeMeta(type)
  return (
    <span
      className={`type-badge ${className}`.trim()}
      style={{
        '--type-color': meta.color,
        '--type-accent': meta.accent,
        '--type-ink': meta.ink,
      }}
    >
      {icon && <span aria-hidden="true">{meta.icon}</span>}
      {type}
    </span>
  )
}
