import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import PokemonForm from '../components/PokemonForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createPokemon } from '../services/pokemonService'

export default function CreatePokemon() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleCreate = async (values) => {
    const created = await createPokemon(user.uid, values)
    showToast(`“${created.name}” was added to your Pokédex and saved to Firebase.`, 'success')
    navigate(`/pokemon/${created.id}`, { replace: true })
  }

  return (
    <div className="page">
      <div className="page-back">
        <Link to="/pokemon" className="back-link">
          <Icon name="arrowLeft" size={17} />
          Back to collection
        </Link>
      </div>

      <header className="page-header page-header--stacked">
        <div>
          <p className="eyebrow">New Pokédex entry</p>
          <h1>Add a Pokémon</h1>
          <p className="page-header__lead">
            Fill in the details below. The card is saved to Firebase Realtime Database and
            associated with your trainer account.
          </p>
        </div>
      </header>

      <PokemonForm
        onSubmit={handleCreate}
        submitLabel="Create Pokémon"
        cancelTo="/pokemon"
        cancelLabel="Back to collection"
      />
    </div>
  )
}
