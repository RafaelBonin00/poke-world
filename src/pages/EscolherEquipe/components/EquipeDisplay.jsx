export default function EquipeDisplay({ equipe, allMyPokes, onToggleTeam, lastPokemon, onDefinirPrimeiro }) {
  return (
    <div className="my-equipe">
      <h3>Minha Equipe ({equipe.length}/6)</h3>
      <div className="equipe-list">
        {Array.from({ length: 6 }).map((_, i) => {
          const uuid = equipe[i];
          const p = uuid && allMyPokes.find(p => p.pokeUUID === uuid);
          return p ? (
            <div key={uuid} className={`equipe-card ${uuid === lastPokemon ? 'primeiro' : ''}`}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon_id}.png`} alt="" />
              <p>{p.nickname}</p>
              <div className="equipe-actions">
                <button onClick={() => onToggleTeam(uuid)} className="remover">❌</button>
                {uuid !== lastPokemon && (
                  <button onClick={() => onDefinirPrimeiro(uuid)} className="button_primeiro">🔰</button>
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="poke-card equipe-card equipe-slot vazio"></div>
          );
        })}
      </div>
    </div>
  );
}
