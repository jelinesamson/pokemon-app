import { useState } from 'react'
import TypeBadge from './TypeBadge'
import { getTypeMeta } from '../utils/pokemonTypes'
import { truncate } from '../utils/format'
import { isValidHttpUrl } from '../utils/validation'

export default function PokemonPreview({ values, previewUrl = '' }) {
  const meta = getTypeMeta(values.type || 'Normal')
  const name = values.name.trim() || 'New Pokémon'
  const description = values.description.trim()
  const imageUrl = (previewUrl || values.imageUrl || '').trim()
  const [failedImageUrl, setFailedImageUrl] = useState('')

  const isLocalPreview = imageUrl.startsWith('blob:')
  const validImageUrl = isLocalPreview || isValidHttpUrl(imageUrl)
  const showImage = validImageUrl && failedImageUrl !== imageUrl

  const stats = [
    { label: 'HP', value: values.hp || '—' },
    { label: 'ATK', value: values.attack || '—' },
    { label: 'DEF', value: values.defense || '—' },
  ]

  return (
    <aside className="form-preview" aria-label="Live card preview">
      <p className="form-preview__label">
        <span className="live-dot" aria-hidden="true" />
        Live card preview
      </p>

      <div
        className="preview-card"
        style={{
          '--type-color': meta.color,
          '--type-accent': meta.accent,
          '--type-ink': meta.ink,
        }}
      >
        <div className="preview-card__visual">
          <span className="pokemon-card__pattern" aria-hidden="true" />
          {showImage ? (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`${name} artwork preview`}
              className="preview-card__image"
              onError={() => setFailedImageUrl(imageUrl)}
            />
          ) : (
            <span className="preview-card__emoji" aria-hidden="true">
              {meta.icon}
            </span>
          )}
          {values.level && <span className="pokemon-card__level">Lv. {values.level}</span>}
        </div>
        <div className="preview-card__body">
          <div className="preview-card__title">
            <h3>{name}</h3>
            <TypeBadge type={values.type || 'Normal'} />
          </div>
          <p className="preview-card__description">
            {description
              ? truncate(description, 100)
              : 'Your Pokédex description will appear here as you type.'}
          </p>
          <dl className="preview-card__stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {imageUrl && !showImage && (
        <p className="form-preview__hint form-preview__hint--warning" role="status">
          {validImageUrl
            ? 'This image could not be loaded. Check the URL or try a different image link.'
            : 'Enter a valid image URL to preview your artwork.'}
        </p>
      )}

      <p className="form-preview__hint">
        This is how your card will appear in the collection. Everything is saved to Firebase
        Realtime Database.
      </p>
    </aside>
  )
}
