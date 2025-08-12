export default function InfoPokemonSorteado({ pokemon }) {
  if (!pokemon) return null;

  return (
    <div>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        alt={pokemon.name}
      />
      <h3>{pokemon.name} (Nível: {pokemon.nivel ?? 'Desconhecido'})</h3>
      <p>Dificuldade: {pokemon.dificuldade ?? 'Desconhecida'}</p>
      <p>HpAtual: {pokemon.hpAtual ?? 'Desconhecida'}</p>
      <p>
        Tipos: {Array.isArray(pokemon.types)
          ? pokemon.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
          : 'Tipo desconhecido'}
      </p>
    </div>
  );
}
