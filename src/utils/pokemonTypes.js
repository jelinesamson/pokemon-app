/**
 * Central type data for the app.
 * Colours are inspired by the official Pokémon type colours.
 */
export const POKEMON_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
]

export const TYPE_META = {
  Normal: { color: '#A8A77A', accent: '#C9C8A4', ink: '#24240f', icon: '🐾' },
  Fire: { color: '#F97316', accent: '#EF4444', ink: '#ffffff', icon: '🔥' },
  Water: { color: '#6390F0', accent: '#3B82F6', ink: '#ffffff', icon: '💧' },
  Grass: { color: '#7AC74C', accent: '#22C55E', ink: '#08280f', icon: '🌿' },
  Electric: { color: '#F7D02C', accent: '#FBBF24', ink: '#3a2c00', icon: '⚡' },
  Ice: { color: '#96D9D6', accent: '#67E8F9', ink: '#103b3b', icon: '❄️' },
  Fighting: { color: '#C22E28', accent: '#DC2626', ink: '#ffffff', icon: '🥊' },
  Poison: { color: '#A33EA1', accent: '#C026D3', ink: '#ffffff', icon: '☠️' },
  Ground: { color: '#E2BF65', accent: '#D97706', ink: '#3b2a00', icon: '🏜️' },
  Flying: { color: '#A98FF3', accent: '#818CF8', ink: '#211466', icon: '🪶' },
  Psychic: { color: '#F95587', accent: '#EC4899', ink: '#ffffff', icon: '🔮' },
  Bug: { color: '#A6B91A', accent: '#84CC16', ink: '#1f2600', icon: '🐛' },
  Rock: { color: '#B6A136', accent: '#A16207', ink: '#ffffff', icon: '🪨' },
  Ghost: { color: '#735797', accent: '#6D28D9', ink: '#ffffff', icon: '👻' },
  Dragon: { color: '#6F35FC', accent: '#4F46E5', ink: '#ffffff', icon: '🐉' },
  Dark: { color: '#705746', accent: '#334155', ink: '#ffffff', icon: '🌙' },
  Steel: { color: '#B7B7CE', accent: '#94A3B8', ink: '#1f2937', icon: '⚙️' },
  Fairy: { color: '#D685AD', accent: '#F472B6', ink: '#3b0d24', icon: '✨' },
}

const FALLBACK_META = { color: '#64748B', accent: '#475569', ink: '#ffffff', icon: '❔' }

export function getTypeMeta(type) {
  return TYPE_META[type] ?? FALLBACK_META
}

export function typeGradient(type) {
  const meta = getTypeMeta(type)
  return `linear-gradient(135deg, ${meta.color}, ${meta.accent})`
}
