
import React, { useEffect, useState, useRef } from 'react';
import { insertAllPokemons,updateAllLocations,updateAllDificuldade,updateAllTypes } from './insertAll';
import PokemonLocationUpdater from '../AdminSistem/AtualizarLocalizacao';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../supabaseClient';


function AttBanco() {


  const [allMyPokes, setAllMyPokes] = useState([]);
  const [favoritePokes, setFavoritePokes] = useState([]); // array de UUIDs
  const [myEquipe, setMyEquipe] = useState([]); // array de UUIDs
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newPokeId, setNewPokeId] = useState('');


  const [toast, setToast] = useState('');


  const persist = async (newAll, newFav, newEquipe) => {
  const all = newAll ?? allMyPokes;
  const favs = newFav ?? favoritePokes;
  const equipe = newEquipe ?? myEquipe;

  await supabase
    .from('Mypokes')
    .update({
      AllMyPokes: { id: all },
      FavoritePokes: favs,
      MyEquipe: equipe,
    })
    .eq('user_id', user.id);
    };




  const traducaoTipos = {
    normal: "normal",
    fire: "fogo",
    water: "agua",
    grass: "grama",
    electric: "eletrico",
    ice: "gelo",
    fighting: "lutador",
    poison: "veneno",
    ground: "terra",
    flying: "voador",
    psychic: "psiquico",
    bug: "inseto",
    rock: "pedra",
    ghost: "fantasma",
    dragon: "dragao",
    dark: "sombrio",
    steel: "aco",
    fairy: "fada"
    };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleInserir = async () => {
    await insertAllPokemons();
  };
   const handleInserirLocalizacao = async () => {
    await updateAllLocations();
  };
  const handleInserirDificuldade = async () => {
    await updateAllDificuldade();
  };
  const handleInserirTipos = async () => {
    await updateAllTypes();
  };


  const fetchData = async () => {
  try {
    const { data: authData, error: uErr } = await supabase.auth.getUser();
    const user = authData?.user;
    if (uErr || !user) {
      setError('Usuário não autenticado.');
      return;
    }
    setUser(user);

    const { data, error: dErr } = await supabase
      .from('Mypokes')
      .select('AllMyPokes, FavoritePokes, MyEquipe')
      .eq('user_id', user.id)
      .maybeSingle();

    if (dErr) {
      setError('Erro ao buscar dados: ' + dErr.message);
    } else {
      setAllMyPokes(Array.isArray(data?.AllMyPokes?.id) ? data.AllMyPokes.id : []);
      setFavoritePokes(Array.isArray(data?.FavoritePokes) ? data.FavoritePokes : []);
      setMyEquipe(Array.isArray(data?.MyEquipe) ? data.MyEquipe : []);
    }
  } catch (err) {
    console.error(err);
    setError('Falha na sincronização');
  } finally {
    setLoading(false);
  }
};

const adicionarPokemon = async () => {
  if (!newPokeId) return;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokeId}`);
    const data = await res.json();
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    const tipos = data.types.map(t => t.type.name); // Sem tradução

    const novo = {
      pokeUUID: uuidv4(),
      pokemon_id: parseInt(newPokeId),
      level: 1,
      nickname: name,

    };

    setAllMyPokes((prevAll) => {
      const updated = [...prevAll, novo];
      persist(updated, favoritePokes, myEquipe);
      return updated;
    });

    setNewPokeId('');
    showToast(`Adicionado ${name}`);
  } catch (err) {
    console.error('Erro ao adicionar Pokémon:', err);
    showToast('Erro ao adicionar Pokémon');
  }
};


useEffect(() => {
    fetchData();
    }, []);


  return (
    <>
      <div>
        {toast && <div className="toast">{toast}</div>}
        <h1>Pokémon Inserção</h1>
        <button onClick={handleInserir} disabled={true}>Inserir Pokémons no Supabase</button>
        <button onClick={handleInserirLocalizacao} disabled={true}>Atualizar Localização dos Pokémons no Supabase</button>
        <button onClick={handleInserirDificuldade} disabled={true}>Atualizar Dificuldade dos Pokémons no Supabase</button>
        <button onClick={handleInserirTipos} disabled={false}>Atualizar Tipos Pokémons no Supabase</button>

      </div>
      <PokemonLocationUpdater/>
      <div className="controls">
          <input type="number" placeholder="ID Pokémon" value={newPokeId} onChange={e => setNewPokeId(e.target.value)} />
          <button onClick={adicionarPokemon}>Adicionar Pokémon</button>
        </div>
    </>
  );
}


export default AttBanco;
