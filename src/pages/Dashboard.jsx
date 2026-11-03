import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteConfirmation from '../components/DeleteConfirmation'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import Pokeball from '../components/Pokeball'
import PokemonCard from '../components/PokemonCard'
import PokemonGridSkeleton from '../components/PokemonGridSkeleton'
import SearchBar from '../components/SearchBar'
import StatCard from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { useDeletePokemon } from '../hooks/useDeletePokemon'
import { usePokemonCollection } from '../hooks/usePokemonCollection'
import { displayName, formatNumber, timeAgo } from '../utils/format'
import { collectionStats, filterPokemon } from '../utils/pokemonCollection'
import { getTypeMeta } from '../utils/pokemonTypes'

export default function Dashboard() {
  const { user } = useAuth()
  const { pokemon, loading, error, retry } = usePokemonCollection(user?.uid)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const deleteFlow = useDeletePokemon()

  const stats = useMemo(() => collectionStats(pokemon), [pokemon])
  const filtered = useMemo(
    () => filterPokemon(pokemon, search, typeFilter),
    [pokemon, search, typeFilter],
  )
  const recent = useMemo(() => pokemon.slice(0, 4), [pokemon])
  const visible = useMemo(() => filtered.slice(0, 6), [filtered])
  const firstName = displayName(user).split(' ')[0]

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('All')
  }

  return (
    <div className="page page--dashboard">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">
            <span className="live-dot" aria-hidden="true" />
            Trainer dashboard
          </p>
          <h1>
            Welcome back, <span className="gradient-text">{firstName}</span>.
          </h1>
          <p className="hero__lead">
            Your Pokédex holds <strong>{stats.total}</strong> Pokémon across{' '}
            <strong>{stats.typeCount}</strong> {stats.typeCount === 1 ? 'type' : 'types'}. Every
            card is synced live with Firebase Realtime Database.
          </p>
          <div className="hero__actions">
            <Link to="/pokemon/create" className="btn btn--primary btn--lg">
              <Icon name="plus" size={18} />
              Add a Pokémon
            </Link>
            <Link to="/pokemon" className="btn btn--secondary btn--lg">
              <Icon name="cards" size={18} />
              View collection
            </Link>
          </div>
          <div className="hero__meta">
            <span>
              <Icon name="user" size={15} />
              {user?.email}
            </span>
            <span>
              <span className="live-dot" aria-hidden="true" />
              Live Firebase sync
            </span>
          </div>
        </div>
        <div className="hero__art" aria-hidden="true">
          <span className="hero__ring hero__ring--one" />
          <span className="hero__ring hero__ring--two" />
          <Pokeball size={230} />
        </div>
      </section>

      <section className="stats-grid" aria-label="Collection statistics">
        <StatCard
          icon="🎴"
          label="Total Pokémon"
          value={stats.total}
          hint="stored in your Pokédex"
          tone="red"
        />
        <StatCard
          icon="🌈"
          label="Types collected"
          value={`${stats.typeCount}/18`}
          hint="unique Pokémon types"
          tone="blue"
        />
        <StatCard
          icon="📈"
          label="Average level"
          value={stats.avgLevel}
          hint="across all cards"
          tone="green"
        />
        <StatCard
          icon="⚔️"
          label="Total power"
          value={formatNumber(stats.totalPower)}
          hint="HP + Attack + Defense"
          tone="yellow"
        />
      </section>

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
              <p className="eyebrow">Syncing</p>
              <h2>Loading your Pokédex…</h2>
            </div>
          </div>
          <PokemonGridSkeleton count={3} />
        </section>
      ) : pokemon.length === 0 && !error ? (
        <section className="section">
          <EmptyState
            icon="🔴"
            title="Your Pokédex is empty"
            message="Catch your first Pokémon by filling out the creation form. It will be saved to Firebase and appear here instantly."
            action={
              <Link to="/pokemon/create" className="btn btn--primary btn--lg">
                <Icon name="plus" size={18} />
                Create your first Pokémon
              </Link>
            }
          />
        </section>
      ) : (
        <>
          <section className="panel recent-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Fresh catches</p>
                <h2>Recently added</h2>
              </div>
              <Link to="/pokemon" className="text-link">
                View all
                <Icon name="chevronRight" size={16} />
              </Link>
            </div>

            {recent.length > 0 ? (
              <div className="recent-list">
                {recent.map((item) => {
                  const meta = getTypeMeta(item.type)
                  return (
                    <Link key={item.id} to={`/pokemon/${item.id}`} className="recent-item">
                      <span
                        className="recent-item__icon"
                        style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.accent})` }}
                        aria-hidden="true"
                      >
                        {meta.icon}
                      </span>
                      <span className="recent-item__body">
                        <strong>{item.name}</strong>
                        <small>
                          {item.type} · Lv. {item.level}
                        </small>
                      </span>
                      <span className="recent-item__time">{timeAgo(item.createdAt)}</span>
                      <Icon name="chevronRight" size={16} />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="muted">Nothing to show yet. New cards will appear here.</p>
            )}
          </section>

          <section className="section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Your Pokédex</p>
                <h2>Collection</h2>
              </div>
              <Link to="/pokemon" className="text-link">
                Open full collection
                <Icon name="chevronRight" size={16} />
              </Link>
            </div>

            <SearchBar
              search={search}
              onSearchChange={setSearch}
              type={typeFilter}
              onTypeChange={setTypeFilter}
              onClear={clearFilters}
              total={pokemon.length}
              filtered={filtered.length}
            />

            {visible.length > 0 ? (
              <>
                <div className="card-grid">
                  {visible.map((item) => (
                    <PokemonCard
                      key={item.id}
                      pokemon={item}
                      onDelete={deleteFlow.requestDelete}
                    />
                  ))}
                </div>
                {filtered.length > visible.length && (
                  <div className="section-more">
                    <Link to="/pokemon" className="btn btn--secondary">
                      See all {filtered.length} Pokémon
                      <Icon name="chevronRight" size={17} />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon="🔍"
                title="No Pokémon match your search"
                message="Try a different name or type, or clear the filters to see your whole collection."
                action={
                  <button type="button" className="btn btn--secondary" onClick={clearFilters}>
                    Clear filters
                  </button>
                }
                compact
              />
            )}
          </section>
        </>
      )}

      {loading && (
        <p className="visually-hidden" role="status">
          Loading collection from Firebase
        </p>
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
