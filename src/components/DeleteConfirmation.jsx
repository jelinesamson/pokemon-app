import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

export default function DeleteConfirmation({
  pokemon,
  onCancel,
  onConfirm,
  loading = false,
  error = '',
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!pokemon) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pokemon, loading, onCancel])

  if (!pokemon) return null

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel()
      }}
    >
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <div className="modal__icon" aria-hidden="true">
          <Icon name="trash" size={26} />
        </div>
        <h2 id="delete-dialog-title" className="modal__title">
          Delete this Pokémon?
        </h2>
        <p id="delete-dialog-description" className="modal__text">
          <strong>{pokemon.name}</strong> will be permanently removed from your collection and
          from Firebase Realtime Database. This action cannot be undone.
        </p>

        {error && (
          <p className="alert alert--error" role="alert">
            <Icon name="alert" size={17} />
            <span>{error}</span>
          </p>
        )}

        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={loading}
            ref={cancelRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn__spinner" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              <>
                <Icon name="trash" size={17} />
                Delete Pokémon
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
