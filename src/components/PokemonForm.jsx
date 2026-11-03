import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import PokemonPreview from './PokemonPreview'
import { deletePokemonImage } from '../services/storageService'
import { EMPTY_POKEMON_FORM, validatePokemonForm } from '../utils/validation'
import { POKEMON_TYPES } from '../utils/pokemonTypes'

const FIELD_IDS = {
  name: 'pokemon-name',
  type: 'pokemon-type',
  description: 'pokemon-description',
  level: 'pokemon-level',
  hp: 'pokemon-hp',
  attack: 'pokemon-attack',
  defense: 'pokemon-defense',
  imageUrl: 'pokemon-imageUrl',
}

const ALL_FIELDS = Object.keys(EMPTY_POKEMON_FORM)

const STAT_FIELDS = [
  { name: 'level', label: 'Level', placeholder: 'e.g. 25', maxLength: 3, hint: '1 – 100' },
  { name: 'hp', label: 'HP', placeholder: 'e.g. 100', maxLength: 3, hint: '1 – 999' },
  { name: 'attack', label: 'Attack', placeholder: 'e.g. 55', maxLength: 3, hint: '1 – 999' },
  { name: 'defense', label: 'Defense', placeholder: 'e.g. 40', maxLength: 3, hint: '1 – 999' },
]

function toFormValues(values = {}) {
  const numberOrEmpty = (value) =>
    value === undefined || value === null || value === '' ? '' : String(value)

  return {
    name: values.name ?? '',
    type: values.type ?? '',
    description: values.description ?? '',
    level: numberOrEmpty(values.level),
    hp: numberOrEmpty(values.hp),
    attack: numberOrEmpty(values.attack),
    defense: numberOrEmpty(values.defense),
    imageUrl: values.imageUrl ?? '',
  }
}

export default function PokemonForm({
  initialValues,
  onSubmit,
  submitLabel = 'Create Pokémon',
  cancelTo,
  cancelLabel = 'Cancel',
}) {
  const [values, setValues] = useState(() => toFormValues(initialValues))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const initialImageUrlRef = useRef(String(initialValues?.imageUrl ?? '').trim())

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setSubmitError('')
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    const validation = validatePokemonForm(values)
    setErrors((current) => ({ ...current, [name]: validation[name] ?? '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validation = validatePokemonForm(values)
    setErrors(validation)
    setTouched(Object.fromEntries(ALL_FIELDS.map((field) => [field, true])))
    setSubmitError('')

    const invalidFields = Object.keys(validation)
    if (invalidFields.length > 0) {
      const firstField = document.getElementById(FIELD_IDS[invalidFields[0]])
      firstField?.focus()
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const savedImageUrl = String(values.imageUrl ?? '').trim()

      await onSubmit({ ...values, imageUrl: savedImageUrl })

      // Best-effort cleanup when an existing Storage image was replaced or removed.
      if (initialImageUrlRef.current && initialImageUrlRef.current !== savedImageUrl) {
        void deletePokemonImage(initialImageUrlRef.current)
      }
    } catch (error) {
      setSubmitError(error.message || 'Could not save this Pokémon. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="pokemon-form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <p className="alert alert--error" role="alert">
          <Icon name="alert" size={18} />
          <span>{submitError}</span>
        </p>
      )}

      <div className="form-layout">
        <div className="form-main">
          <section className="form-section">
            <div className="form-section__head">
              <span className="form-section__number">01</span>
              <div>
                <h2>Identity</h2>
                <p>Give your Pokémon a name and a type.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className={`field field--span-2 ${errors.name ? 'field--error' : ''}`.trim()}>
                <label htmlFor={FIELD_IDS.name}>
                  Pokémon name <span className="required">*</span>
                </label>
                <input
                  id={FIELD_IDS.name}
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Pikachu"
                  maxLength={40}
                  autoComplete="off"
                  required
                  aria-invalid={Boolean(errors.name && touched.name)}
                  aria-describedby={errors.name ? 'pokemon-name-error' : undefined}
                />
                {errors.name && (
                  <p className="field__error" id="pokemon-name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={`field ${errors.type ? 'field--error' : ''}`.trim()}>
                <label htmlFor={FIELD_IDS.type}>
                  Pokémon type <span className="required">*</span>
                </label>
                <select
                  id={FIELD_IDS.type}
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-invalid={Boolean(errors.type && touched.type)}
                  aria-describedby={errors.type ? 'pokemon-type-error' : undefined}
                >
                  <option value="">Select a type</option>
                  {POKEMON_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="field__error" id="pokemon-type-error">
                    {errors.type}
                  </p>
                )}
              </div>

              <div
                className={`field field--span-2 ${errors.imageUrl ? 'field--error' : ''}`.trim()}
              >
                <label htmlFor={FIELD_IDS.imageUrl}>
                  Card artwork URL <span className="optional">optional</span>
                </label>
                <input
                  id={FIELD_IDS.imageUrl}
                  name="imageUrl"
                  type="url"
                  value={values.imageUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://example.com/pokemon.png"
                  disabled={submitting}
                  aria-invalid={Boolean(errors.imageUrl && touched.imageUrl)}
                  aria-describedby={errors.imageUrl ? 'pokemon-image-error' : 'pokemon-image-hint'}
                />

                {errors.imageUrl ? (
                  <p className="field__error" id="pokemon-image-error">
                    {errors.imageUrl}
                  </p>
                ) : (
                  <p className="field__hint" id="pokemon-image-hint">
                    Paste a direct image link. Leave empty to use a colourful type illustration.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section__head">
              <span className="form-section__number">02</span>
              <div>
                <h2>Battle stats</h2>
                <p>Numbers only — negative values are not allowed.</p>
              </div>
            </div>

            <div className="form-grid form-grid--stats">
              {STAT_FIELDS.map((field) => (
                <div
                  key={field.name}
                  className={`field ${errors[field.name] ? 'field--error' : ''}`.trim()}
                >
                  <label htmlFor={FIELD_IDS[field.name]}>
                    {field.label} <span className="required">*</span>
                  </label>
                  <input
                    id={FIELD_IDS[field.name]}
                    name={field.name}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    autoComplete="off"
                    required
                    aria-invalid={Boolean(errors[field.name] && touched[field.name])}
                    aria-describedby={
                      errors[field.name] ? `${FIELD_IDS[field.name]}-error` : undefined
                    }
                  />
                  {errors[field.name] ? (
                    <p className="field__error" id={`${FIELD_IDS[field.name]}-error`}>
                      {errors[field.name]}
                    </p>
                  ) : (
                    <p className="field__hint">Range: {field.hint}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="form-section__head">
              <span className="form-section__number">03</span>
              <div>
                <h2>Pokédex entry</h2>
                <p>Tell the story behind this card.</p>
              </div>
            </div>

            <div className="form-grid">
              <div
                className={`field field--span-2 ${errors.description ? 'field--error' : ''}`.trim()}
              >
                <div className="field__label-row">
                  <label htmlFor={FIELD_IDS.description}>
                    Description <span className="required">*</span>
                  </label>
                  <span className="field__counter">{values.description.length}/500</span>
                </div>
                <textarea
                  id={FIELD_IDS.description}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe your Pokémon's personality, powers or backstory…"
                  rows={5}
                  maxLength={500}
                  required
                  aria-invalid={Boolean(errors.description && touched.description)}
                  aria-describedby={errors.description ? 'pokemon-description-error' : undefined}
                />
                {errors.description && (
                  <p className="field__error" id="pokemon-description-error">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="form-actions">
            {cancelTo && (
              <Link to={cancelTo} className="btn btn--ghost">
                {cancelLabel}
              </Link>
            )}
            <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" />
                  Saving to Firebase…
                </>
              ) : (
                <>
                  <Icon name="check" size={18} />
                  {submitLabel}
                </>
              )}
            </button>
          </div>

          <p className="form-footnote">
            <Icon name="database" size={15} />
            Saved securely to Firebase Realtime Database under your trainer account.
          </p>
        </div>

        <PokemonPreview values={values} />
      </div>
    </form>
  )
}
