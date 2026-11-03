import { POKEMON_TYPES } from './pokemonTypes'

export const EMPTY_POKEMON_FORM = {
  name: '',
  type: '',
  description: '',
  level: '',
  hp: '',
  attack: '',
  defense: '',
  imageUrl: '',
}

/**
 * Validates a Pokémon form. Values from text inputs are strings.
 * Returns an object whose keys are field names and whose values are messages.
 */
export function validatePokemonForm(values = {}) {
  const errors = {}
  const name = String(values.name ?? '').trim()
  const description = String(values.description ?? '').trim()

  if (!name) {
    errors.name = 'Pokémon name is required.'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (name.length > 40) {
    errors.name = 'Name must be 40 characters or fewer.'
  }

  if (!values.type) {
    errors.type = 'Please choose a Pokémon type.'
  } else if (!POKEMON_TYPES.includes(values.type)) {
    errors.type = 'Please choose a valid Pokémon type.'
  }

  if (!description) {
    errors.description = 'Description is required.'
  } else if (description.length < 10) {
    errors.description = 'Description must be at least 10 characters.'
  } else if (description.length > 500) {
    errors.description = 'Description must be 500 characters or fewer.'
  }

  const levelError = validateWholeNumber(values.level, 'Level', 1, 100)
  if (levelError) errors.level = levelError

  const hpError = validateWholeNumber(values.hp, 'HP', 1, 999)
  if (hpError) errors.hp = hpError

  const attackError = validateWholeNumber(values.attack, 'Attack', 1, 999)
  if (attackError) errors.attack = attackError

  const defenseError = validateWholeNumber(values.defense, 'Defense', 1, 999)
  if (defenseError) errors.defense = defenseError

  const imageUrl = String(values.imageUrl ?? '').trim()
  if (imageUrl) {
    if (imageUrl.length > 500) {
      errors.imageUrl = 'Image URL must be 500 characters or fewer.'
    } else if (!isValidHttpUrl(imageUrl)) {
      errors.imageUrl = 'Enter a valid image URL starting with http:// or https://.'
    }
  }

  return errors
}

function validateWholeNumber(value, label, min, max) {
  const raw = String(value ?? '').trim()
  if (!raw) return `${label} is required.`
  if (!/^\d+$/.test(raw)) return `${label} must be a whole number.`
  const number = Number(raw)
  if (number < min) return `${label} must be at least ${min}.`
  if (number > max) return `${label} must be ${max} or less.`
  return ''
}

export function isValidHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

export function passwordStrength(password = '') {
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  if (!password) return { score: 0, label: 'Enter a password', level: 'empty' }
  if (score <= 2) return { score, label: 'Weak password', level: 'weak' }
  if (score <= 3) return { score, label: 'Okay password', level: 'medium' }
  return { score, label: 'Strong password', level: 'strong' }
}
