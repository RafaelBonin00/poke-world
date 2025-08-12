import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function useCapturaPokemon(showToast, pokemonInicial = null) {
  const [user, setUser] = useState(null);
  const [allMyPokes, setAllMyPokes] = useState([]);
  const [favoritePokes, setFavoritePokes] = useState([]);
  const [myEquipe, setMyEquipe] = useState([]);

  const [pokemonSorteado, setPokemonSorteado] = useState(pokemonInicial);
  const [pokebola, setPokebola] = useState('poke-ball');
  const [fruta, setFruta] = useState('');
  const [tentativas, setTentativas] = useState(1);

  const [miraAtiva, setMiraAtiva] = useState(false);
  const [barraPosicao, setBarraPosicao] = useState(0);
  const [alvoPosicao, setAlvoPosicao] = useState(50);
  const [miraBonus, setMiraBonus] = useState(1.0);

  const [resultadoCaptura, setResultadoCaptura] = useState(null);
  const [animandoIcone, setAnimandoIcone] = useState(false);

  const intervaloRef = useRef(null);
  const direcaoRef = useRef(1);

  const barraLargura = 2;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;

      setUser(authData.user);

      const { data, error } = await supabase
        .from('Mypokes')
        .select('AllMyPokes, FavoritePokes, MyEquipe')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (!error && data) {
        setAllMyPokes(Array.isArray(data.AllMyPokes) ? data.AllMyPokes : []);
        setFavoritePokes(Array.isArray(data.FavoritePokes) ? data.FavoritePokes : []);
        setMyEquipe(Array.isArray(data.MyEquipe) ? data.MyEquipe : []);
      }
    };

    fetchUserData();
  }, []);

  const persist = async (newAll, newFav, newEquipe) => {
    if (!user) return;

    const payload = {
      user_id: user.id,
      AllMyPokes: newAll,
      FavoritePokes: newFav,
      MyEquipe: newEquipe,
    };

    const { error } = await supabase
      .from('Mypokes')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) console.error('Erro ao persistir pokémons:', error);
  };

  const adicionarPokemonPokemonSorteado = () => {
    if (!user || !pokemonSorteado) return;

    const nameCapitalized = pokemonSorteado.name.charAt(0).toUpperCase() + pokemonSorteado.name.slice(1);
    

    const novoPokemon = {
      pokeUUID: crypto.randomUUID(),
      pokemon_id: pokemonSorteado.id,
      nickname: nameCapitalized,
      hpAtual:pokemonSorteado.hp,
      hpMax:pokemonSorteado.hp,
      level: pokemonSorteado.nivel || 1,
    };

    const novaLista = [...allMyPokes, novoPokemon];
    setAllMyPokes(novaLista);
    persist(novaLista, favoritePokes, myEquipe);
  };

  const sortearPokemon = async (idsDisponiveis = null) => {
    let id;
    if (Array.isArray(idsDisponiveis) && idsDisponiveis.length) {
      const idx = Math.floor(Math.random() * idsDisponiveis.length);
      id = idsDisponiveis[idx];
    } else {
      id = Math.floor(Math.random() * 251) + 1;
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const { data: dbData } = await supabase
      .from('pokemons')
      .select('dificuldade')
      .eq('id', data.id)
      .maybeSingle();

    const novoPokemon = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.front_default,
      tipos: data.types.map(t => t.type.name),
      dificuldade: dbData?.dificuldade || 1,
      nivel: Math.floor(Math.random() * 5) + (dbData?.dificuldade || 1) * 5,
      peso: data.weight / 10,
      felicidade: Math.floor(Math.random() * 100),
      sexoOposto: Math.random() > 0.5,
    };

    setPokemonSorteado(novoPokemon);
    setTentativas(1);
    setMiraBonus(1.0);

    iniciarMira();

    return novoPokemon;
  };

  const iniciarMira = () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);

    setMiraAtiva(true);
    setBarraPosicao(0);

    const novoAlvo = Math.random() * 70 + 15;
    setAlvoPosicao(novoAlvo);
    direcaoRef.current = 1;

    intervaloRef.current = setInterval(() => {
      setBarraPosicao(pos => {
        let novaPos = pos + direcaoRef.current * 0.4;

        if (novaPos <= 0) {
          novaPos = 0;
          direcaoRef.current = 1;
        } else if (novaPos >= 100 - barraLargura) {
          novaPos = 100 - barraLargura;
          direcaoRef.current = -1;
        }

        return novaPos;
      });
    }, 20);
  };


  const tentarCaptura = (pokemon, pokebola, tentativas = 1, jaCapturado = false, fruta = null, miraBonus = 1.0) => {
  if (!pokemon) return false;

  // Não permite usar poke-ball em pokemons com dificuldade maior que 4
  if (pokemon.dificuldade > 3 && pokebola === 'poke-ball') {
    console.log('Poké-ball não funciona para pokémons de dificuldade > 4');
    return false;
  }
    if (pokemon.dificuldade > 5 && pokebola === 'great-ball') {
    console.log('Poké-ball não funciona para pokémons de dificuldade > 4');
    return false;
  }

  // Taxas base de captura por dificuldade (exemplo ajustado)
  const taxasBase = {
    1: 0.7,
    2: 0.6,
    3: 0.5,
    4: 0.4,
    5: 0.3,
    6: 0.22,
    7: 0.18,
    8: 0.12,
    9: 0.7,
    10: 0.03,
  };

  const taxaBase = taxasBase[pokemon.dificuldade] || 0.01;

  const bonusPokebola = {
    'poke-ball': 1.0,
    'great-ball': 1.5,
    'ultra-ball': 2.0,
    'master-ball': 10.0,
    'quick-ball': 1.5,
    'repeat-ball': 1.3,
  };

  const bonusFruta = fruta === 'berry' ? 1.1 : 1.0;

  // Calcula a chance baseada na % da vida restante (vida atual / vida máxima)
  const hpRatio = (pokemon.hpAtual !== undefined ? pokemon.hpAtual : pokemon.hp) / (pokemon.hp || 1);
  // Quanto maior a vida, mais difícil capturar (1 - hpRatio)
  const valorA = (1 - hpRatio) * taxaBase * (bonusPokebola[pokebola] || 1) * bonusFruta * miraBonus;

  // Garante que chanceFinal esteja entre 0 e 1
  const chanceFinal = Math.min(Math.max(valorA, 0), 1);

  const valorAleatorio = Math.random();

  console.log(`Tentando capturar ${pokemon.name} (dif: ${pokemon.dificuldade})`);
  console.log(`Chance final: ${chanceFinal.toFixed(3)}, Valor aleatório: ${valorAleatorio.toFixed(3)}`);

  return valorAleatorio < chanceFinal;
};


const pararMira = () => {
  setMiraAtiva(false);
  if (intervaloRef.current) {
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
  }

  const distancia = Math.abs(barraPosicao - alvoPosicao);
  const overlapVermelho = distancia <= 4;
  const overlapAmarelo = distancia > 4 && distancia <= 10;

  let bonus = 1;

  if (overlapVermelho) {
    showToast("🎯 Acerto Perfeito!");
    bonus = 1.05;
  } else if (overlapAmarelo) {
    showToast("👍 Bom Acerto!");
    bonus = 1.025;
  } else {
    showToast("❌ Errou o Alvo!");
  }

  setMiraBonus(bonus);

  const jaCapturado = allMyPokes.some(poke => poke.pokemon_id === pokemonSorteado?.id);

  setAnimandoIcone(true);

  const capturou = tentarCaptura(
    pokemonSorteado,
    pokebola,
    tentativas, // se tirar tentativas, ajuste essa variável
    jaCapturado,
    fruta,
    bonus
  );

  setTimeout(() => {
    setAnimandoIcone(false);
    setResultadoCaptura(capturou ? 'success' : 'fail');

    setTimeout(() => {
      setResultadoCaptura(null);

        if (capturou) {
          showToast(`Parabéns, você capturou o ${pokemonSorteado.name}`);
          adicionarPokemonPokemonSorteado();
          setTimeout(() => navigate('/maps'), 1000);
        } else {
          // Chance de fuga entre 5% e 30% conforme dificuldade 1 a 10
          const minChance = 0.05;
          const maxChance = 0.30;
          const dificuldade = pokemonSorteado.dificuldade;

          const chanceFuga = minChance + ((dificuldade - 1) / 9) * (maxChance - minChance);
          const fugiu = Math.random() < chanceFuga;

          if (fugiu) {
            showToast('O Pokémon fugiu!');
            setTimeout(() => navigate('/maps'), 1000);
          } else {
            showToast(`Falhou na captura! Tente novamente.`);
            setTimeout(() => navigate('/combate', { state: { pokemon: pokemonSorteado } }), 1000);
          }
        }
    }, 3000);
  }, 1000);
};


  useEffect(() => {
    if (!pokemonSorteado) return;
    iniciarMira();
  }, [pokemonSorteado]);

  return {
    pokebola,
    setPokebola,
    fruta,
    setFruta,
    miraAtiva,
    barraPosicao,
    barraLargura,
    alvoPosicao,
    pararMira,
    iniciarMira,
    sortearPokemon,
    pokemonSorteado,
    resultadoCaptura,
    tentativas,
    animandoIcone,
  };
}
