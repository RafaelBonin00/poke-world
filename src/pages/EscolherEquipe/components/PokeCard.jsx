import React from 'react';
import './PokeCard.css';

function renderTipos(tipos) {
  if (!tipos || tipos.length === 0) return null;
  return (
    <div className="tipos">
      {tipos.map((tipo, i) => (
        <div key={i}>
          <span className={`tipo-badge tipo-${tipo}`}>
            {tipo}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PokeCard({
  poke,
  types,
  isFavorite,
  isInEquipe,
  onOpen,
  onToggleFavorite,
  onToggleEquipe,
  onRemove,
  onHeal,
}) {
  if (!poke) return null;

  const hpPorcentagem = (poke.hpAtual / poke.hpMax) * 100;
  const estaComHpCheio = poke.hpAtual === poke.hpMax;

  return (
    <div className="poke-card tipo">
      {/* Topo: Barra de Vida + Botão ❤️ */}
      <div className="top-bar">
        <div className="hp-container">
          <div className="hp-text">{poke.hpAtual} / {poke.hpMax}</div>
          <div className="hp-bar-outer">
            <div
              className="hp-bar-inner"
              style={{
                width: `${hpPorcentagem}%`,
                backgroundColor:
                  hpPorcentagem > 50 ? '#4caf50' :
                  hpPorcentagem > 20 ? '#ff9800' :
                  '#f44336',
              }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => onHeal && onHeal(poke.pokeUUID)}
          disabled={estaComHpCheio}
          className="heal-button"
          title={estaComHpCheio ? "Vida cheia" : "Curar Pokémon"}
        >
          ❤️
        </button>
      </div>

      {/* Imagem */}
      <div className="poke-img-container">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.pokemon_id}.png`}
          alt={poke.nickname}
          className="poke-img"
        />
      </div>

      {/* Nome e nível */}
      <p>{poke.nickname}</p>
      <p>Nv: {poke.level}</p>

      {/* Tipos */}
      {renderTipos(types)}

      {/* Ações */}
      <div className="poke-actions">
        <button onClick={() => onOpen(poke)}>⚙️</button>
        <button onClick={() => onToggleFavorite(poke.pokeUUID)}>
          {isFavorite ? '★' : '☆'}
        </button>
        <button
          onClick={() => onToggleEquipe(poke.pokeUUID)}
          title={isInEquipe ? "Remover da equipe" : "Adicionar à equipe"}
        >
          {isInEquipe ? '❌' : '➕'}
        </button>
        <button
          onClick={() => onRemove(poke.pokeUUID)}
          disabled={isInEquipe}
          title={isInEquipe ? "Remova da equipe antes de excluir" : "Excluir Pokémon"}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
