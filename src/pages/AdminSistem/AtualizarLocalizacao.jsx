// PokemonLocationUpdater.jsx
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ajuste o caminho conforme sua estrutura

const todasLocalizacoes = [
  'Floresta Norte',
  'Planície Vulcânica',
  'Montanha Vulcânica',
  'Costa Oeste',
  'Floresta Sul',
  'Vila no Campo',
  'Campos Floridos',
  'Deserto',
  'Piramides',
  'Região Industrial',
  'Cordilheira de Rochas',
  'Mansão Abandonada',
  'Lago Central',
  'Ilha Mal Assombrada',
  'Ilha Mistica',
  'Montanhas Gélidas',
  'Templo Antigo',
];

const PokemonLocationUpdater = () => {
  const [pokemonId, setPokemonId] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSelectChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedLocations(options);
  };

  const updatePokemonLocation = async (id, newLocations) => {
    const { error } = await supabase
      .from('pokemons')
      .update({ locations: newLocations })
      .eq('id', id);

    return { error };
  };

  const handleUpdate = async () => {
    const id = parseInt(pokemonId);
    if (!id || selectedLocations.length === 0) {
      setStatusMessage('Por favor, informe um ID válido e selecione ao menos uma localização.');
      return;
    }

    const { error } = await updatePokemonLocation(id, selectedLocations);

    if (error) {
      setStatusMessage(`Erro: ${error.message}`);
    } else {
      setStatusMessage(`Localização do Pokémon ${id} atualizada com sucesso!`);
      setPokemonId('');
      setSelectedLocations([]);
    }
  };

  return (
    <div>
      <h3>Atualizar Localização do Pokémon</h3>

      <label>ID do Pokémon:</label>
      <input
        type="number"
        value={pokemonId}
        onChange={(e) => setPokemonId(e.target.value)}
        placeholder="Ex: 25"
      />

      <br /><br />

      <label>Selecione localizações (ilimitadas):</label>
      <select
        multiple
        size={8}
        value={selectedLocations}
        onChange={handleSelectChange}
      >
        {todasLocalizacoes.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleUpdate}>Atualizar</button>

      <p>{statusMessage}</p>
    </div>
  );
};

export default PokemonLocationUpdater;
