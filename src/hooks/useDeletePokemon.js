import { useCallback, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { deletePokemon } from '../services/pokemonService'

/**
 * Shared delete flow used by the dashboard, collection and details pages.
 * Opens a confirmation dialog, deletes the record from Firebase and shows a
 * success/error notification.
 */
export function useDeletePokemon({ onDeleted } = {}) {
  const { showToast } = useToast()
  const [target, setTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const requestDelete = useCallback((pokemon) => {
    setError('')
    setTarget(pokemon)
  }, [])

  const cancelDelete = useCallback(() => {
    setError('')
    setTarget(null)
    setDeleting(false)
  }, [])

  const confirmDelete = useCallback(
    async (uid) => {
      if (!target) return
      setDeleting(true)
      setError('')
      try {
        await deletePokemon(target.id, uid)
        showToast(`“${target.name}” was removed from your collection.`, 'success')
        onDeleted?.(target)
        setTarget(null)
      } catch (deleteError) {
        const message = deleteError.message || 'Could not delete this Pokémon. Please try again.'
        setError(message)
        showToast(message, 'error')
      } finally {
        setDeleting(false)
      }
    },
    [target, onDeleted, showToast],
  )

  return {
    target,
    deleting,
    error,
    isOpen: Boolean(target),
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}
