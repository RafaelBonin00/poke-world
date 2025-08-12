export default function MyPokemonDetails({ pokemon }) {
  return (
    <>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
        alt={pokemon.nickname || 'Seu Pokémon'}
        className="pokemon-imagem"
      />
      <p><strong>{pokemon.nickname || pokemon.name || 'Seu Pokémon'}</strong></p>
      <p>Level: {pokemon.level || 1}</p>

      <div className="barra-hp">
        <div
          className="barra-hp-verde"
          style={{ width: `${(pokemon.hpAtual / pokemon.hp) * 100}%` }}
        />
      </div>
      <p>HP: {pokemon.hpAtual} / {pokemon.hp}</p>
    </>
  );
}
