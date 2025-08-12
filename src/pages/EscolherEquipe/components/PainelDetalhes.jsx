import React from 'react';

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


export default function PainelDetalhes({
  expandedPoke,
  isEditing,
  isFavorite,
  onToggleTeam,
  onToggleFavorite,
  onEdit,
  editNickname,
  pokeDetails,
  onClose,
  onSave,
  onCancel,
  onEditToggle,
  onToggleEquipe,
  isInTeam,
  isEquipeFull,
  setEditNickname,
  onChangeNickname
}) {
  return (
    <div className="panel">
      <button className="close-btn" onClick={onClose}>✖ Fechar</button>
      <div className="panel-content">
        <div className="sprite-large">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${expandedPoke.pokemon_id}.png`}
            alt=""
          />
        </div>
        <div className="info">
          <h2>
            {isEditing ? (
              <input value={editNickname} onChange={onChangeNickname} maxLength={20} />

            ) : expandedPoke.nickname}
          </h2>          

          <div className="panel-buttons">
            {isEditing ? (
              <>
                <button onClick={onSave}>Salvar</button>
                <button onClick={onCancel}>Cancelar</button>
              </>
            ) : (
              <button onClick={onEdit}>Editar</button>
            )}
            <button onClick={onToggleTeam} disabled={!isInTeam && isEquipeFull}>
              {isInTeam ? 'Remover da Equipe' : 'Adicionar à Equipe'}
            </button>
            <button onClick={() => onToggleFavorite(expandedPoke.pokeUUID)}>
                {isFavorite ? '★' : '☆'}
            </button>
          </div>

          <p>ID: {expandedPoke.pokemon_id}</p>
          <p>Nível: {expandedPoke.level}</p>

          {renderTipos(expandedPoke.tipo)}

          <div className="stats">
            {pokeDetails ? (
              <ul>
                <li>HP: {pokeDetails.hp}</li>
                <li>Attack: {pokeDetails.attack}</li>
                <li>Defense: {pokeDetails.defense}</li>
                <li>Speed: {pokeDetails.speed}</li>
                <li>Sp. Attack: {pokeDetails.specialAttack}</li>
                <li>Sp. Defense: {pokeDetails.specialDefense}</li>
              </ul>
            ) : (
              <p>Carregando stats...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
