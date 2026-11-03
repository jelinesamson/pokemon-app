import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteConfirmation from '../components/DeleteConfirmation'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PokemonCard from '../components/PokemonCard'
import PokemonGridSkeleton from '../components/PokemonGridSkeleton'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import { useDeletePokemon } from '../hooks/useDeletePokemon'
import { usePokemonCollection } from '../hooks/usePokemonCollection'
import { filterPokemon } from '../utils/pokemonCollection'

export default function PokemonList() {
  const { user } = useAuth()
  const { pokemon, loading, error, retry } = usePokemonCollection(user?.uid)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const deleteFlow = useDeletePokemon()

  const filtered = useMemo(
    () => filterPokemon(pokemon, search, typeFilter),
    [pokemon, search, typeFilter],
  )

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('All')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Pokédex collection</p>
          <h1>Your Pokémon</h1>
          <p className="page-header__lead">
            {pokemon.length > 0
              ? `${pokemon.length} ${pokemon.length === 1 ? 'card' : 'cards'} synced from Firebase Realtime Database.`
              : 'Every Pokémon you create is stored in Firebase and appears here in real time.'}
          </p>
        </div>
        <Link to="/pokemon/create" className="btn btn--primary btn--lg">
          <Icon name="plus" size={18} />
          Add Pokémon
        </Link>
      </header>

      {error && (
        <div className="alert alert--error alert--row" role="alert">
          <Icon name="alert" size={18} />
          <span>
            <strong>Could not load your collection.</strong> {error.message}
          </span>
          <button type="button" className="btn btn--secondary btn--sm" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Sync in progress</p>
              <h2>Loading Pokémon…</h2>
            </div>
          </div>
          <PokemonGridSkeleton count={6} />
        </section>
      ) : pokemon.length === 0 ? (
        error ? (
          <EmptyState
            icon="📡"
            title="Could not connect to Firebase"
            message={error.message}
            action={
              <button type="button" className="btn btn--primary" onClick={retry}>
                Try again
              </button>
            }
          />
        ) : (
          <EmptyState
            icon="🔴"
            title="No Pokémon in your Pokédex yet"
            message="Your collection is empty. Create your first Pokémon card and it will be saved to Firebase Realtime Database."
            action={
              <Link to="/pokemon/create" className="btn btn--primary btn--lg">
                <Icon name="plus" size={18} />
                Create your first Pokémon
              </Link>
            }
          />
        )
      ) : (
        <>
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            type={typeFilter}
            onTypeChange={setTypeFilter}
            onClear={clearFilters}
            total={pokemon.length}
            filtered={filtered.length}
            placeholder="Search your collection by name…"
          />

          {filtered.length > 0 ? (
            <div className="card-grid">
              {filtered.map((item) => (
                <PokemonCard
                  key={item.id}
                  pokemon={item}
                  onDelete={deleteFlow.requestDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="No Pokémon match those filters"
              message={`Nothing matched “${search.trim() || typeFilter}”. Try another search or clear the filters to see all ${pokemon.length} cards.`}
              action={
                <button type="button" className="btn btn--secondary" onClick={clearFilters}>
                  Clear filters
                </button>
              }
              compact
            />
          )}
        </>
      )}

      <DeleteConfirmation
        pokemon={deleteFlow.target}
        loading={deleteFlow.deleting}
        error={deleteFlow.error}
        onCancel={deleteFlow.cancelDelete}
        onConfirm={() => deleteFlow.confirmDelete(user.uid)}
      />
    </div>
  )
}
