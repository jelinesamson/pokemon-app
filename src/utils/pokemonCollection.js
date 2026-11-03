export function filterPokemon(pokemon = [], search = '', type = 'All') {
  const term = String(search ?? '').trim().toLowerCase()
  return pokemon.filter((item) => {
    const matchesName = !term || String(item.name ?? '').toLowerCase().includes(term)
    const matchesType = type === 'All' || item.type === type
    return matchesName && matchesType
  })
}

export function sortByNewest(pokemon = []) {
  return [...pokemon].sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0))
}

export function collectionStats(pokemon = []) {
  const total = pokemon.length
  const types = new Set(pokemon.map((item) => item.type).filter(Boolean))
  const avgLevel = total
    ? Math.round(pokemon.reduce((sum, item) => sum + Number(item.level ?? 0), 0) / total)
    : 0
  const totalPower = pokemon.reduce(
    (sum, item) =>
      sum + Number(item.hp ?? 0) + Number(item.attack ?? 0) + Number(item.defense ?? 0),
    0,
  )

  return {
    total,
    typeCount: types.size,
    avgLevel,
    totalPower,
  }
}
