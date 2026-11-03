import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DeleteConfirmation from '../components/DeleteConfirmation'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import LoadingSpinner from '../components/LoadingSpinner'
import TypeBadge from '../components/TypeBadge'
import { useAuth } from '../context/AuthContext'
import { useDeletePokemon } from '../hooks/useDeletePokemon'
import { usePokemonRecord } from '../hooks/usePokemonRecord'
import { formatDateTime, shortId } from '../utils/format'
import { getTypeMeta } from '../utils/pokemonTypes'

export default function PokemonDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { pokemon, loading, error, retry } = usePokemonRecord(id, user?.uid)
  const [imageFailed, setImageFailed] = useState(false)

  const deleteFlow = useDeletePokemon({
    onDeleted: () => navigate('/pokemon', { replace: true }),
  })

  if (loading) {
    return (
      <div className="page">
        <div className="page-back">
          <Link to="/pokemon" className="back-link">
            <Icon name="arrowLeft" size={17} />
            Back to collection
          </Link>
        </div>
        <LoadingSpinner label="Opening Pokémon card…" />
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="page">
        <div className="page-back">
          <Link to="/pokemon" className="back-link">
            <Icon name="arrowLeft" size={17} />
            Back to collection
          </Link>
        </div>
        <EmptyState
          icon={error ? '⚠️' : '🔍'}
          title={error ? 'Could not open this Pokémon' : 'Pokémon not found'}
          message={
            error ||
            'This record may have been deleted, or the link in the address bar is incorrect.'
          }
          action={
            <div className="button-row">
              {error && (
                <button type="button" className="btn btn--secondary" onClick={retry}>
                  Try again
                </button>
              )}
              <Link to="/pokemon" className="btn btn--primary">
                Back to collection
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  const meta = getTypeMeta(pokemon.type)
  const stats = [
    { key: 'hp', label: 'HP', value: Number(pokemon.hp ?? 0) },
    { key: 'attack', label: 'Attack', value: Number(pokemon.attack ?? 0) },
    { key: 'defense', label: 'Defense', value: Number(pokemon.defense ?? 0) },
  ]

  return (
    <div className="page">
      <div className="page-back">
        <Link to="/pokemon" className="back-link">
          <Icon name="arrowLeft" size={17} />
          Back to collection
        </Link>
      </div>

      <div className="detail-layout">
        <section
          className="detail-visual"
          style={{
            '--type-color': meta.color,
            '--type-accent': meta.accent,
            '--type-ink': meta.ink,
          }}
          aria-label={`${pokemon.name} card artwork`}
        >
          <span className="detail-visual__pattern" aria-hidden="true" />
          <span className="detail-visual__dex">#{shortId(pokemon.id)}</span>

          {pokemon.imageUrl && !imageFailed ? (
            <img
              src={pokemon.imageUrl}
              alt={`${pokemon.name} artwork`}
              className="detail-visual__image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="detail-visual__emoji" aria-hidden="true">
              {meta.icon}
            </span>
          )}

          <div className="detail-visual__footer">
            <div>
              <span className="detail-visual__label">Pokémon</span>
              <h1>{pokemon.name}</h1>
            </div>
            <TypeBadge type={pokemon.type} />
          </div>

          <span className="detail-visual__level">Level {pokemon.level}</span>
        </section>

        <section className="detail-panel">
          <div className="detail-panel__head">
            <div>
              <p className="eyebrow">Pokédex entry</p>
              <h2>About this Pokémon</h2>
            </div>
            <div className="detail-actions">
              <Link to={`/pokemon/edit/${pokemon.id}`} className="btn btn--primary">
                <Icon name="edit" size={17} />
                Edit
              </Link>
              <button
                type="button"
                className="btn btn--danger-ghost"
                onClick={() => deleteFlow.requestDelete(pokemon)}
              >
                <Icon name="trash" size={17} />
                Delete
              </button>
            </div>
          </div>

          <p className="detail-description">{pokemon.description}</p>

          <div className="detail-stats">
            {stats.map((stat) => (
              <div className="detail-stat" key={stat.key}>
                <div className="detail-stat__head">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
                <span className="detail-stat__track" aria-hidden="true">
                  <span
                    className="detail-stat__fill"
                    style={{
                      width: `${Math.min(100, Math.round(stat.value / 2))}%`,
                      background: `linear-gradient(90deg, ${meta.color}, ${meta.accent})`,
                    }}
                  />
                </span>
              </div>
            ))}
          </div>

          <div className="detail-meta">
            <div>
              <span>Level</span>
              <strong>{pokemon.level}</strong>
            </div>
            <div>
              <span>Type</span>
              <strong>{pokemon.type}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{formatDateTime(pokemon.createdAt)}</strong>
            </div>
            <div>
              <span>Last updated</span>
              <strong>{formatDateTime(pokemon.updatedAt)}</strong>
            </div>
            <div className="detail-meta__wide">
              <span>Record ID</span>
              <strong className="mono">{pokemon.id}</strong>
            </div>
            <div className="detail-meta__wide">
              <span>Owner UID (createdBy)</span>
              <strong className="mono">{pokemon.createdBy}</strong>
            </div>
          </div>

          <p className="detail-note">
            <Icon name="database" size={16} />
            <span>
              Stored in Firebase Realtime Database at <code>pokemon/{pokemon.id}</code>
            </span>
          </p>

          <div className="detail-footer">
            <Link to="/pokemon" className="btn btn--secondary">
              <Icon name="arrowLeft" size={17} />
              Back to collection
            </Link>
          </div>
        </section>
      </div>

      <DeleteConfirmation
        pokemon={deleteFlow.target}
        loading={deleteFlow.deleting}
        error={deleteFlow.error}
        onCancel={deleteFlow.cancelDelete}
        onConfirm={() => deleteFlow.confirmDelete(user.uid)}
      />
    </div>
  )
}
