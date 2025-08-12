import React from 'react';

function PokemonSidebar({ selectedLocation, pokemons }) {
  return (
    <div className="pokemon-sidebar">
      {selectedLocation ? (
        <>
          <h2>{selectedLocation}:</h2>
          {pokemons.length > 0 ? (
            <div className="pokemon-scroll">
              {pokemons.map((p) => (
                <div key={p.id} className="pokemon-card">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                    alt={p.name}
                  />
                  <h3>{p.name}</h3>
                  <p>ID: {p.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Viajando até a região.</p>
          )}
        </>
      ) : (
        <p>Clique em uma região do mapa para ver os Pokémon disponíveis.</p>
      )}
    </div>
  );
}

export default PokemonSidebar;
