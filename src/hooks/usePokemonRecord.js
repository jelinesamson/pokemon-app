import { useCallback, useEffect, useState } from 'react'
import { fetchPokemonById } from '../services/pokemonService'

/**
 * Loads a single Pokémon record from Firebase and verifies that it belongs to
 * the signed-in trainer. The request state is reset when the route id changes.
 */
export function usePokemonRecord(id, uid) {
  const requestKey = `${id ?? ''}:${uid ?? ''}`
  const [trackedKey, setTrackedKey] = useState(requestKey)
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(Boolean(id && uid))
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  if (trackedKey !== requestKey) {
    setTrackedKey(requestKey)
    setPokemon(null)
    setLoading(Boolean(id && uid))
    setError('')
  }

  useEffect(() => {
    if (!id || !uid) return undefined

    let active = true

    async function load() {
      try {
        const record = await fetchPokemonById(id)
        if (!active) return

        if (!record) {
          setPokemon(null)
          return
        }

        if (record.createdBy !== uid) {
          setError("This Pokémon belongs to another trainer's account.")
          setPokemon(null)
          return
        }

        setPokemon(record)
      } catch (loadError) {
        if (!active) return
        setError(loadError.message || 'Could not load this Pokémon from Firebase.')
        setPokemon(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [id, uid, retryKey])

  const retry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((key) => key + 1)
  }, [])

  return { pokemon, loading, error, retry }
}
