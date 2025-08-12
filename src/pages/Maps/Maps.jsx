import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Maps.css';
import PokemonLocationUpdater from '../AdminSistem/AtualizarLocalizacao';
import locations from './componentes/locations.json';

import MapSVG from './componentes/MapSVG';
import PokemonSidebar from './componentes/PokemonSidebar';

import useCapturaPokemon from '../Capturar/componentes/useCapturaPokemon';

// Componente para texto com pontos animados
function LoadingDots({ text }) {
  const [dots, setDots] = React.useState('');
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  return <p className="loading-message">{text + dots}</p>;
}

function Maps() {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [user, setUser] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toastRef = useRef();
  const showToast = (msg) => toastRef.current?.showToast(msg);

  const fetchPokemonsByLocation = async (locationName) => {
    setSelectedLocation(locationName);
    setPokemons([]);
    setLoadingMessage('Viajando até o local');
    setIsLoading(true);


    await new Promise((r) => setTimeout(r, 1500));

    const { data, error } = await supabase
      .from('pokemons')
      .select('id, name, locations, dificuldade')
      .contains('locations', [locationName]);

    if (error) {
      console.error('Erro ao buscar pokémons:', error);
      showToast('Erro ao buscar pokémons');
      setLoadingMessage('');
      setIsLoading(false);
    } else {
      setPokemons(data);
      setLoadingMessage('');
      setIsLoading(false);
    }
  };

  const fetchLastPosition = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) return;

    setUser(authData.user);

    const { data, error } = await supabase
      .from('Mypokes')
      .select('LastPosition')
      .eq('user_id', authData.user.id)
      .single();

    if (error) {
      showToast('Erro ao carregar o último lugar');
    } else {
      if (data?.LastPosition) {
        fetchPokemonsByLocation(data.LastPosition);
      }
    }
  };

  const handleMapClick = async (newLocation) => {
  if (!user) {
    showToast('Usuário não autenticado');
    return;
  }

  const { data, error } = await supabase
    .from('Mypokes')
    .select('LastPosition')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar a última posição:', error);
    showToast('Erro ao verificar local anterior');
    return;
  }

  const lastPosition = data?.LastPosition;

  if (lastPosition === newLocation) {
    console.log('Já está neste local. Ignorando clique.');
    return;
  }

  const { error: updateError } = await supabase
    .from('Mypokes')
    .update({ LastPosition: newLocation })
    .eq('user_id', user.id);

  if (updateError) {
    showToast('Erro ao atualizar posição');
    return;
  }

  fetchPokemonsByLocation(newLocation);
};



  const handleSortearPokemonLocal = async () => {
    if (pokemons.length === 0) {
      showToast('Nenhum Pokémon nesta localização.');
      return;
    }

    const validPokemons = pokemons.filter((p) => typeof p.dificuldade === 'number');

    if (validPokemons.length === 0) {
      showToast('Nenhum Pokémon com dificuldade definida.');
      return;
    }

    const dificuldadesUnicas = [...new Set(validPokemons.map((p) => p.dificuldade))].sort((a, b) => a - b);

    const dificuldadePesoMap = {};
    const maxPeso = 10;
    dificuldadesUnicas.forEach((dificuldade, index) => {
      dificuldadePesoMap[dificuldade] = maxPeso - index;
    });

    const pesos = validPokemons.map((pokemon) => {
      const weight = dificuldadePesoMap[pokemon.dificuldade] || 1;
      return { ...pokemon, weight };
    });

    const totalPeso = pesos.reduce((sum, p) => sum + p.weight, 0);
    const weightedList = pesos.flatMap((p) => Array(p.weight).fill(p));
    const sorteado = weightedList[Math.floor(Math.random() * weightedList.length)];

    if (!sorteado) {
      showToast('Erro ao sortear Pokémon.');
      return;
    }

    const chancePorDificuldade = {};
    pesos.forEach((p) => {
      if (!chancePorDificuldade[p.dificuldade]) {
        chancePorDificuldade[p.dificuldade] = 0;
      }
      chancePorDificuldade[p.dificuldade] += p.weight;
    });

    console.log('--- Sorteio de Pokémon ---');
    console.log('Chances por dificuldade:');
    Object.entries(chancePorDificuldade)
      .sort((a, b) => a[0] - b[0])
      .forEach(([dificuldade, peso]) => {
        const chance = ((peso / totalPeso) * 100).toFixed(2);
        console.log(`Dificuldade ${dificuldade} → ${chance}%`);
      });

    setLoadingMessage('Procurando pokémons na área');
    setIsLoading(true);

    const minDelay = 1000; // 2 segundos
    const maxDelay = 7000; // 8 segundos
    const dificuldade = sorteado.dificuldade || 1;
    const delay = minDelay + ((dificuldade - 1) / 9) * (maxDelay - minDelay);

    await new Promise((r) => setTimeout(r, delay));

    setLoadingMessage('');
    setIsLoading(false);

    navigate('/combate', { state: { pokemon: sorteado } });
  };


    useEffect(() => {
      fetchLastPosition()
    }, []);


  return (
    <div className="maps-container">
      <PokemonLocationUpdater />
      <h1>Mapa da Pokédex</h1>

      <div className="map-layout">
        <MapSVG
          locations={locations}
          selectedLocation={selectedLocation}
          hoveredLocation={hoveredLocation}
          setHoveredLocation={setHoveredLocation}
          fetchPokemonsByLocation={handleMapClick}
        />
        <PokemonSidebar selectedLocation={selectedLocation} pokemons={pokemons} />
      </div>

      <div className="captura-maps">
        <h2>Captura no Local</h2>
        {isLoading ? (
          <LoadingDots text={loadingMessage} />
        ) : (
          <button onClick={handleSortearPokemonLocal} disabled={isLoading}>
            Sortear Pokémon Aqui
          </button>
        )}
      </div>
    </div>
  );
}

export default Maps;
