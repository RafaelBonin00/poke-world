export default function EnemyDetails({ pokemon }) {
  return (
    <>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        alt={pokemon.name}
        className="pokemon-imagem"
      />
      <p><strong>{pokemon.name}</strong></p>
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
