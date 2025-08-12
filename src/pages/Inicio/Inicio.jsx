import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import MensagemRetorno from '../../componentes/MensagemRetorno'; // ajuste o caminho se necessário

const iniciais = [
  { name: "bulbasaur", id: 1 },
  { name: "chikorita", id: 152 },
  { name: "charmander", id: 4 },
  { name: "cyndaquil", id: 155 },
  { name: "squirtle", id: 7 },
  { name: "totodile", id: 158 },
];

function EscolherPokemonInicial({ user }) {
  const [selecionado, setSelecionado] = useState(null);
  const [allMyPokes, setAllMyPokes] = useState([]);
  const [favoritePokes, setFavoritePokes] = useState([]);
  const [myEquipe, setMyEquipe] = useState([]);
  const [jaTemInicial, setjaTemInical] = useState(false);
  const [inicialEscolhido, setInicialEscolhido] = useState(false);

  // Toast
  const toastRef = useRef();
  const showToast = (msg) => toastRef.current?.showToast(msg);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('Mypokes')
        .select('AllMyPokes, FavoritePokes, MyEquipe,PokemonInicio')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setAllMyPokes(Array.isArray(data.AllMyPokes) ? data.AllMyPokes : []);
        setFavoritePokes(Array.isArray(data.FavoritePokes) ? data.FavoritePokes : []);
        setMyEquipe(Array.isArray(data.MyEquipe) ? data.MyEquipe : []);
        setjaTemInical(data.PokemonInicio);
      }
    };

    fetchUserData();
  }, [user]);

  const persist = async (newAll, newFav, newEquipe, pokeUUID) => {
    if (!user) return;

    const payload = {
      user_id: user.id,
      AllMyPokes: newAll,
      FavoritePokes: newFav,
      MyEquipe: newEquipe,
      LastPokemon: pokeUUID,
      PokemonInicio: true
    };

    const { data, error } = await supabase
      .from('Mypokes')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error('Erro ao salvar pokémons no Supabase:', error);
    } else {
      console.log('Pokémons salvos com sucesso:', data);
    }
  };

  const escolherInicial = async () => {
    if (!selecionado) {
      showToast("⚠️ Selecione um Pokémon!");
      return;
    }
    if (jaTemInicial) {
      showToast("❌ Você já escolheu seu Pokémon inicial.");
      return;
    }
    if (!user) {
      showToast("🚫 Você precisa estar logado para escolher.");
      return;
    }

    const pokeUUID = crypto.randomUUID();

    const nameCapitalized = selecionado.name.charAt(0).toUpperCase() + selecionado.name.slice(1);
    const { data, error } = await supabase
      .from('pokemons')
      .select('hp')
      .eq('id', selecionado.id)
      .maybeSingle();

    if (error || !data) {
      showToast('Erro ao buscar HP do Pokémon');
      return;
    }

    const hp = data.hp;

    const novoPokemon = {
      pokeUUID,
      pokemon_id: selecionado.id,
      nickname: nameCapitalized,
      level: 1,
      hpAtual: hp,
      hpMax: hp,
      PokemonInicio: true,
    };

    const novaLista = [...allMyPokes, novoPokemon];
    const EquipeLista = [...myEquipe, pokeUUID];
    setAllMyPokes(novaLista);
    setMyEquipe(EquipeLista);

    await persist(novaLista, favoritePokes, EquipeLista, pokeUUID);

    showToast(`🎉 Você escolheu ${nameCapitalized} como seu Pokémon inicial!`);
    setInicialEscolhido(true); // impede interação após escolha
  };

  if (jaTemInicial) {
    return (
      <>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {iniciais.map(poke => {
            const isSelecionado = selecionado?.name === poke.name;
            return (
              <div
                key={poke.name}
                style={{
                  textAlign: "center",
                  border: isSelecionado ? "3px solid blue" : "1px solid gray",
                  borderRadius: "8px",
                  padding: "5px",
                  backgroundColor: isSelecionado ? "#e0f0ff" : "transparent",
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                  alt={poke.name}
                  width={96}
                  height={96}
                />
                <p>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</p>
              </div>
            );
          })}
        </div>
        <p>Você já escolheu seu Pokémon inicial.</p>
        <MensagemRetorno ref={toastRef} />
      </>
    );
  }

  return (
    <div>
      <h2>Escolha seu Pokémon inicial</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {iniciais.map(poke => {
          const isSelecionado = selecionado?.name === poke.name;
          return (
            <div
              key={poke.name}
              onClick={() => {
                if (!inicialEscolhido) setSelecionado(poke);
              }}
              style={{
                cursor: inicialEscolhido ? "default" : "pointer",
                textAlign: "center",
                border: isSelecionado ? "3px solid blue" : "1px solid gray",
                borderRadius: "8px",
                padding: "5px",
                backgroundColor: isSelecionado ? "#e0f0ff" : "transparent",
                opacity: inicialEscolhido ? 0.6 : 1,
                pointerEvents: inicialEscolhido ? "none" : "auto",
              }}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                alt={poke.name}
                width={96}
                height={96}
              />
              <p>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={escolherInicial}
        disabled={!selecionado || inicialEscolhido}
      >
        {selecionado
          ? `Confirmar escolha de ${selecionado.name.charAt(0).toUpperCase() + selecionado.name.slice(1)}`
          : "Escolha seu Pokémon"}
      </button>

      <MensagemRetorno ref={toastRef} />
    </div>
  );
}

export default EscolherPokemonInicial;
