import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import TypeBadge from './TypeBadge'
import { getTypeMeta } from '../utils/pokemonTypes'
import { shortId, truncate } from '../utils/format'

export default function PokemonCard({ pokemon, onDelete }) {
  const [imageFailed, setImageFailed] = useState(false)
  const meta = getTypeMeta(pokemon.type)
  const showImage = Boolean(pokemon.imageUrl) && !imageFailed

  const stats = [
    { label: 'HP', value: Number(pokemon.hp ?? 0) },
    { label: 'ATK', value: Number(pokemon.attack ?? 0) },
    { label: 'DEF', value: Number(pokemon.defense ?? 0) },
  ]

  return (
    <article
      className="pokemon-card"
      style={{
        '--type-color': meta.color,
        '--type-accent': meta.accent,
        '--type-ink': meta.ink,
      }}
    >
      <div className="pokemon-card__visual">
        <span className="pokemon-card__pattern" aria-hidden="true" />
        {showImage ? (
          <img
            src={pokemon.imageUrl}
            alt={`${pokemon.name} artwork`}
            className="pokemon-card__image"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="pokemon-card__emoji" aria-hidden="true">
            {meta.icon}
          </span>
        )}
        <span className="pokemon-card__level">Lv. {pokemon.level ?? '—'}</span>
        <span className="pokemon-card__dex">#{shortId(pokemon.id)}</span>
      </div>

      <div className="pokemon-card__body">
        <div className="pokemon-card__title">
          <h3 title={pokemon.name}>{pokemon.name}</h3>
          <TypeBadge type={pokemon.type} />
        </div>

        <p className="pokemon-card__description">{truncate(pokemon.description, 112)}</p>

        <div className="mini-stats">
          {stats.map((stat) => (
            <div className="mini-stat" key={stat.label}>
              <span className="mini-stat__label">{stat.label}</span>
              <span className="mini-stat__value">{stat.value}</span>
              <span className="mini-stat__track" aria-hidden="true">
                <span
                  className="mini-stat__fill"
                  style={{ width: `${Math.min(100, Math.round(stat.value / 2))}%` }}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="pokemon-card__actions">
          <Link to={`/pokemon/${pokemon.id}`} className="btn btn--secondary btn--sm">
            <Icon name="eye" size={16} />
            View
          </Link>
          <Link to={`/pokemon/edit/${pokemon.id}`} className="btn btn--ghost btn--sm">
            <Icon name="edit" size={16} />
            Edit
          </Link>
          {onDelete && (
            <button
              type="button"
              className="btn btn--danger-ghost btn--sm"
              onClick={() => onDelete(pokemon)}
              aria-label={`Delete ${pokemon.name}`}
            >
              <Icon name="trash" size={16} />
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
