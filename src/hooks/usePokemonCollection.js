import { useCallback, useEffect, useState } from 'react'
import { isFirebaseConfigured } from '../firebase/firebaseConfig'
import { subscribeToUserPokemon } from '../services/pokemonService'

/**
 * Real-time subscription to the signed-in trainer's Pokémon collection.
 * Firebase is the single source of truth; there is no local copy or mock data.
 */
export function usePokemonCollection(uid) {
  const canSubscribe = Boolean(uid && isFirebaseConfigured)
  const [trackedUid, setTrackedUid] = useState(uid)
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(canSubscribe)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  // Reset collection state immediately when the signed-in trainer changes so
  // one account never sees another account's cached cards.
  if (trackedUid !== uid) {
    setTrackedUid(uid)
    setPokemon([])
    setError(null)
    setLoading(canSubscribe)
  }

  useEffect(() => {
    if (!canSubscribe) return undefined

    let active = true

    const unsubscribe = subscribeToUserPokemon(
      uid,
      (records) => {
        if (!active) return
        setPokemon(records)
        setError(null)
        setLoading(false)
      },
      (subscriptionError) => {
        if (!active) return
        setError(subscriptionError)
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [uid, canSubscribe, retryKey])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setRetryKey((key) => key + 1)
  }, [])

  return { pokemon, loading, error, retry }
}
