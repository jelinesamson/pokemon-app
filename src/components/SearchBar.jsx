import Icon from './Icon'
import { POKEMON_TYPES } from '../utils/pokemonTypes'

export default function SearchBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  onClear,
  total = 0,
  filtered = 0,
  disabled = false,
  placeholder = 'Search Pokémon by name…',
}) {
  const hasFilters = Boolean(search.trim()) || type !== 'All'

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <Icon name="search" className="filter-bar__search-icon" size={18} />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Search Pokémon by name"
          disabled={disabled}
        />
        {search && (
          <button
            type="button"
            className="filter-bar__search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search text"
          >
            <Icon name="close" size={15} />
          </button>
        )}
      </div>

      <div className="filter-bar__type">
        <label htmlFor="type-filter">Type</label>
        <select
          id="type-filter"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          disabled={disabled}
        >
          <option value="All">All types</option>
          {POKEMON_TYPES.map((pokemonType) => (
            <option key={pokemonType} value={pokemonType}>
              {pokemonType}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="btn btn--ghost btn--sm filter-bar__clear"
        onClick={onClear}
        disabled={!hasFilters || disabled}
      >
        Clear filters
      </button>

      <p className="filter-bar__results">
        Showing <strong>{filtered}</strong> of {total}
      </p>
    </div>
  )
}
