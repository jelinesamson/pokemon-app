import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import LoadingSpinner from '../components/LoadingSpinner'
import PokemonForm from '../components/PokemonForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { usePokemonRecord } from '../hooks/usePokemonRecord'
import { updatePokemon } from '../services/pokemonService'

export default function EditPokemon() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const { pokemon, loading, error, retry } = usePokemonRecord(id, user?.uid)

  const handleUpdate = async (values) => {
    await updatePokemon(id, user.uid, values)
    showToast(`“${values.name.trim()}” was updated in Firebase.`, 'success')
    navigate(`/pokemon/${id}`, { replace: true })
  }

  return (
    <div className="page">
      <div className="page-back">
        <Link to={`/pokemon/${id}`} className="back-link">
          <Icon name="arrowLeft" size={17} />
          Back to details
        </Link>
      </div>

      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">Update Pokédex entry</p>
          <h1>Edit {pokemon?.name ?? 'Pokémon'}</h1>
          <p className="page-header__lead">
            The original creation date is preserved while the modification timestamp and record
            data are updated in Firebase.
          </p>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner label="Loading Pokémon from Firebase…" />
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Could not open this Pokémon"
          message={error}
          action={
            <div className="button-row">
              <button type="button" className="btn btn--secondary" onClick={retry}>
                Try again
              </button>
              <Link to="/pokemon" className="btn btn--primary">
                Back to collection
              </Link>
            </div>
          }
        />
      ) : !pokemon ? (
        <EmptyState
          icon="🔍"
          title="Pokémon not found"
          message="This record may have been deleted or the link is incorrect."
          action={
            <Link to="/pokemon" className="btn btn--primary">
              Back to collection
            </Link>
          }
        />
      ) : (
        <PokemonForm
          initialValues={pokemon}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
          cancelTo={`/pokemon/${id}`}
          cancelLabel="Discard changes"
        />
      )}
    </div>
  )
}
