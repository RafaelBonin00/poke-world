import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './EscolherEquipe.css';
import PokeCard from './components/PokeCard';
import PainelDetalhes from './components/PainelDetalhes';
import EquipeDisplay from './components/EquipeDisplay';

// Função utilitária fora do componente
function renderTipos(tipos) {
  if (!tipos || tipos.length === 0) return null;
  return (
    <div className="tipos">
      {tipos.map((tipo, i) => (
        <div key={i}>
          <span className={`tipo-badge tipo-${tipo}`}>
            {tipo}
          </span>
          <br />
        </div>
      ))}
    </div>
  );
}

export default function EscolherEquipe() {
  const [allMyPokes, setAllMyPokes] = useState([]);
  const [favoritePokes, setFavoritePokes] = useState([]);
  const [myEquipe, setMyEquipe] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortOption, setSortOption] = useState('level');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [lastPokemon, setLastPokemon] = useState(null);

  const [expandedPoke, setExpandedPoke] = useState(null);
  const [pokeDetails, setPokeDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [toast, setToast] = useState('');

  const [pokeDetailsMap, setPokeDetailsMap] = useState({});

  const panelRef = useRef(null);

  // Busca os dados do usuário e pokémons salvos
  useEffect(() => {
    fetchData();
  }, []);

  // Limpa toast automaticamente
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  async function fetchData() {
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
        .select('AllMyPokes, FavoritePokes, MyEquipe,LastPokemon')
        .eq('user_id', user.id)
        .maybeSingle();

      if (dErr) {
        setError('Erro ao buscar dados: ' + dErr.message);
      } else {
        setAllMyPokes(Array.isArray(data?.AllMyPokes) ? data.AllMyPokes : []);
        setFavoritePokes(Array.isArray(data?.FavoritePokes) ? data.FavoritePokes : []);
        setMyEquipe(Array.isArray(data?.MyEquipe) ? data.MyEquipe : []);
        setLastPokemon(data?.LastPokemon ?? null);
      }
    } catch (err) {
      console.error(err);
      setError('Falha na sincronização');
    } finally {
      setLoading(false);
    }
  }

  // Atualiza dados no supabase
  async function persist(newAll, newFav, newEquipe,newLastPokemon) {
    await supabase
      .from('Mypokes')
      .update({
        AllMyPokes: newAll ?? allMyPokes,
        FavoritePokes: newFav ?? favoritePokes,
        MyEquipe: newEquipe ?? myEquipe,
        LastPokemon: newLastPokemon ?? lastPokemon,
      })
      .eq('user_id', user.id);
    if (newLastPokemon !== undefined) setLastPokemon(newLastPokemon);
  }

  async function definirComoPrimeiro(uuid) {
  setLastPokemon(uuid);
  await persist(undefined, undefined, undefined, uuid);
  showToast('Pokémon definido para iniciar a batalha!!');
}

  // Adiciona ou remove uuid de uma lista, com limite opcional
async function toggleInList(uuid, list, setList, key, max = null) {
  const inList = list.includes(uuid);

  // ✅ Impede remover o único pokémon da equipe
  if (key === 'MyEquipe' && inList && list.length === 1) {
    return showToast("A equipe deve ter pelo menos 1 pokémon.");
  }

  if (!inList && max && list.length >= max)
    return showToast(`Máximo de ${max} pokémons`);

  const updated = inList ? list.filter(id => id !== uuid) : [...list, uuid];

  // Lógica especial para MyEquipe
  if (key === 'MyEquipe') {
    let updatedLast = lastPokemon;

    if (inList && uuid === lastPokemon) {
      updatedLast = updated[0] ?? null;
    }

    setList(updated);
    await persist(undefined, undefined, updated, updatedLast);
    showToast(inList ? 'Removido da equipe' : 'Adicionado à equipe');
    return;
  }

  // Para outras listas normalmente
  setList(updated);
  await persist(
    key === 'AllMyPokes' ? updated : undefined,
    key === 'FavoritePokes' ? updated : undefined,
    undefined
  );
  showToast(inList ? 'Removido' : 'Adicionado');
}

  // Abre painel de detalhes e busca dados detalhados do pokémon
  async function abrirPainel(poke) {
    setExpandedPoke(poke);
    setIsEditing(false);
    setEditNickname(poke.nickname);
    setPokeDetails(null);

    await RetornoApi(poke);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  // Busca detalhes do pokemon pelo id
  async function RetornoApi(pokemon) {
    try {
      const { data, error } = await supabase
        .from('pokemons')
        .select('name, hp, attack, defense, speed, special_attack, special_defense, types')
        .eq('id', pokemon.pokemon_id)
        .single();

      if (error) {
        showToast('Erro ao carregar stats');
        return;
      }
      setPokeDetails({
        name: data.name,
        hp: data.hp,
        attack: data.attack,
        defense: data.defense,
        speed: data.speed,
        specialAttack: data.special_attack,
        specialDefense: data.special_defense,
        types: data.types,
      });
    } catch (err) {
      console.error('Erro inesperado:', err);
      showToast('Erro ao carregar stats');
    }
  }

  // Salvar edição do nickname
  async function salvarEdicao() {
    if (!expandedPoke) return;
    const updatedAll = allMyPokes.map(p =>
      p.pokeUUID === expandedPoke.pokeUUID
        ? { ...p, nickname: editNickname.trim() || pokeDetails.name }
        : p
    );
    setAllMyPokes(updatedAll);
    await persist(updatedAll);
    setExpandedPoke({ ...expandedPoke, nickname: editNickname.trim() });
    setIsEditing(false);
    showToast('Dados salvos');
  }

  // Cancela edição
  function cancelarEdicao() {
    setIsEditing(false);
    if (expandedPoke) {
      setEditNickname(expandedPoke.nickname);
    }
  }

  // Remove pokemon da coleção
async function removerPokemon(uuid) {
  const poke = allMyPokes.find(p => p.pokeUUID === uuid);
  if (!poke) return;

  const confirmar = window.confirm(
    `Deseja realmente remover "${poke.nickname}" (Nível ${poke.level}) da sua coleção?`
  );
  if (!confirmar) return;

  const newAll = allMyPokes.filter(p => p.pokeUUID !== uuid);
  const newFav = favoritePokes.filter(id => id !== uuid);
  const newEquipe = myEquipe.filter(id => id !== uuid);

  // Se a equipe vai ficar vazia, forçamos LastPokemon = null
  // Caso contrário, se o pokémon removido era o LastPokemon, colocamos o primeiro da nova equipe
  let updatedLastPokemon = lastPokemon;
  if (newEquipe.length === 0) {
    updatedLastPokemon = null;
  } else if (uuid === lastPokemon) {
    updatedLastPokemon = newEquipe[0];
  }

  // Atualiza os estados locais
  setAllMyPokes(newAll);
  setFavoritePokes(newFav);
  setMyEquipe(newEquipe);
  setLastPokemon(updatedLastPokemon);

  // Salva tudo no Supabase
  await persist(newAll, newFav, newEquipe, updatedLastPokemon);

  if (expandedPoke?.pokeUUID === uuid) setExpandedPoke(null);
  showToast(`"${poke.nickname}" foi removido`);
}
async function curarPokemon(uuid) {
  const updated = allMyPokes.map(p => {
    if (p.pokeUUID === uuid) {
      return {
        ...p,
        hpAtual: p.hpMax, // Cura total
      };
    }
    return p;
  });

  setAllMyPokes(updated);
  await persist(updated); // Salva no Supabase
  showToast('Pokémon curado!');
}



  // Filtra e ordena seus pokémons conforme estado
  const filtered = allMyPokes.filter(p =>
    (!showOnlyFavorites || favoritePokes.includes(p.pokeUUID)) &&
    (p.nickname?.toLowerCase().includes(filterText.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'level') return b.level - a.level;
    if (sortOption === 'nickname') return a.nickname.localeCompare(b.nickname);
    return a.pokemon_id - b.pokemon_id;
  });

  // Busca os detalhes para todos os pokémons da lista (allMyPokes)
  useEffect(() => {
    let isMounted = true;

    async function fetchAllDetails() {
      const detailsPromises = allMyPokes.map(async (p) => {
        const { data, error } = await supabase
          .from('pokemons')
          .select('types, hp, attack, defense, speed, special_attack, special_defense')
          .eq('id', p.pokemon_id)
          .single();

        if (error) {
          console.error('Erro ao buscar detalhes', error);
          return null;
        }

        return [
          p.pokeUUID,
          {
            types: data.types,
            hp: data.hp,
            attack: data.attack,
            defense: data.defense,
            speed: data.speed,
            specialAttack: data.special_attack,
            specialDefense: data.special_defense,
          },
        ];
      });

      const detailsArray = await Promise.all(detailsPromises);
      const detailsObject = Object.fromEntries(detailsArray.filter(Boolean));
      if (isMounted) setPokeDetailsMap(detailsObject);
    }

    if (allMyPokes.length > 0) {
      fetchAllDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [allMyPokes]);

  return (
    <div className="container">
      <h2>Escolha sua Equipe</h2>
      {toast && <div className="toast">{toast}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <EquipeDisplay
            equipe={myEquipe}
            allMyPokes={allMyPokes}
            onToggleTeam={(uuid) => toggleInList(uuid, myEquipe, setMyEquipe, 'MyEquipe', 6)}
            lastPokemon={lastPokemon}
            onDefinirPrimeiro={definirComoPrimeiro}
          />

          {expandedPoke && (
            <div ref={panelRef}>
               <PainelDetalhes
                expandedPoke={expandedPoke}
                isEditing={isEditing}
                isFavorite={favoritePokes.includes(expandedPoke.pokeUUID)}
                editNickname={editNickname}
                pokeDetails={pokeDetailsMap[expandedPoke.pokeUUID] || pokeDetails} 
                isInTeam={myEquipe.includes(expandedPoke.pokeUUID)}
                isEquipeFull={myEquipe.length >= 6}

                onToggleTeam={() => toggleInList(expandedPoke.pokeUUID, myEquipe, setMyEquipe, 'MyEquipe', 6)}
                onToggleFavorite={() => toggleInList(expandedPoke.pokeUUID, favoritePokes, setFavoritePokes, 'FavoritePokes')}

                onEdit={() => setIsEditing(true)}
                onChangeNickname={(e) => setEditNickname(e.target.value)}
                onSave={salvarEdicao}
                onCancel={cancelarEdicao}
                onClose={() => setExpandedPoke(null)}
              />

            </div>
          )}

          <div className="controls">
            <input
              type="text"
              placeholder="Filtrar pelo apelido"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={showOnlyFavorites}
                onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
              />
              Mostrar favoritos
            </label>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="level">Ordenar por nível</option>
              <option value="nickname">Ordenar por apelido</option>
              <option value="pokemon_id">Ordenar por ID</option>
            </select>
          </div>

          <div className="poke-list">
            {sorted.length === 0 && <p>Nenhum pokémon encontrado.</p>}
            {sorted.map((p) => (
              <PokeCard
                key={p.pokeUUID}
                poke={p}
                types={pokeDetailsMap[p.pokeUUID]?.types}
                isFavorite={favoritePokes.includes(p.pokeUUID)}
                isInEquipe={myEquipe.includes(p.pokeUUID)}
                onOpen={() => abrirPainel(p)}
                onToggleFavorite={() => toggleInList(p.pokeUUID, favoritePokes, setFavoritePokes, 'FavoritePokes')}
                onToggleEquipe={() => toggleInList(p.pokeUUID, myEquipe, setMyEquipe, 'MyEquipe', 6)}
                onRemove={() => removerPokemon(p.pokeUUID)}
                equipeFull={myEquipe.length >= 6}
                 onHeal={(uuid) => curarPokemon(uuid)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
