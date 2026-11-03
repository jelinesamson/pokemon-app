import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import { db } from '../firebase/firebaseConfig'
import { deletePokemonImage } from './storageService'

const POKEMON_PATH = 'pokemon'

function ensureDb() {
  if (!db) {
    throw new Error(
      'Firebase is not configured. Add your Firebase credentials to .env.local and restart the dev server.',
    )
  }
}

function friendlyError(error) {
  if (!error) return new Error('An unknown Firebase error occurred.')
  const code = error.code ?? ''

  if (code === 'PERMISSION_DENIED' || code === 'database/permission-denied') {
    return new Error(
      'You do not have permission to perform this action. You can only manage Pokémon that belong to your account.',
    )
  }

  if (
    code === 'network-request-failed' ||
    code === 'database/unavailable' ||
    code === 'database/disconnected'
  ) {
    return new Error('Could not reach Firebase. Check your internet connection and try again.')
  }

  return new Error(error.message || 'The Firebase request failed. Please try again.')
}

function normalizeValues(values = {}) {
  return {
    name: String(values.name ?? '').trim(),
    type: String(values.type ?? ''),
    description: String(values.description ?? '').trim(),
    level: Number(values.level),
    hp: Number(values.hp),
    attack: Number(values.attack),
    defense: Number(values.defense),
    imageUrl: String(values.imageUrl ?? '').trim(),
  }
}

/**
 * Subscribes to every Pokémon created by a user.
 * Uses a Realtime Database query (createdBy == uid) so that the security rules
 * can restrict reads to the signed-in trainer's own records.
 */
export function subscribeToUserPokemon(uid, onData, onError) {
  ensureDb()
  const pokemonQuery = query(
    ref(db, POKEMON_PATH),
    orderByChild('createdBy'),
    equalTo(uid),
  )

  return onValue(
    pokemonQuery,
    (snapshot) => {
      const pokemon = []
      snapshot.forEach((childSnapshot) => {
        pokemon.push({ id: childSnapshot.key, ...childSnapshot.val() })
      })
      pokemon.sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0))
      onData(pokemon)
    },
    (error) => {
      onError?.(friendlyError(error))
    },
  )
}

export async function fetchPokemonById(id) {
  ensureDb()
  try {
    const snapshot = await get(ref(db, `${POKEMON_PATH}/${id}`))
    if (!snapshot.exists()) return null
    return { id: snapshot.key, ...snapshot.val() }
  } catch (error) {
    throw friendlyError(error)
  }
}

export async function createPokemon(uid, values) {
  ensureDb()
  const recordRef = push(ref(db, POKEMON_PATH))
  const timestamp = Date.now()
  const record = {
    id: recordRef.key,
    ...normalizeValues(values),
    createdBy: uid,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  try {
    await set(recordRef, record)
    return record
  } catch (error) {
    throw friendlyError(error)
  }
}

export async function updatePokemon(id, uid, values) {
  ensureDb()
  try {
    const snapshot = await get(ref(db, `${POKEMON_PATH}/${id}`))
    if (!snapshot.exists()) {
      throw new Error('This Pokémon no longer exists. It may have been deleted.')
    }
    const existing = snapshot.val()
    if (existing.createdBy !== uid) {
      throw new Error('You can only edit Pokémon that belong to your account.')
    }

    const updatedAt = Date.now()
    // Only editable fields are written: createdAt and createdBy are preserved.
    await update(ref(db, `${POKEMON_PATH}/${id}`), {
      ...normalizeValues(values),
      updatedAt,
    })
    return updatedAt
  } catch (error) {
    throw friendlyError(error)
  }
}

export async function deletePokemon(id, uid) {
  ensureDb()
  try {
    const snapshot = await get(ref(db, `${POKEMON_PATH}/${id}`))
    if (!snapshot.exists()) {
      throw new Error('This Pokémon no longer exists. It may have been deleted.')
    }
    if (snapshot.val().createdBy !== uid) {
      throw new Error('You can only delete Pokémon that belong to your account.')
    }
    const deleted = snapshot.val()
    await remove(ref(db, `${POKEMON_PATH}/${id}`))
    // The record is gone; clean up its uploaded artwork without blocking the UI.
    void deletePokemonImage(deleted.imageUrl)
  } catch (error) {
    throw friendlyError(error)
  }
}
