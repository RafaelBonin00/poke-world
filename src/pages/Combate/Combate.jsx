import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Combate.css';
import EnemyDetails from './components/EnemyDetails';
import AcoesCombate from './components/AcoesCombate';
import MyPokemonDetails from './components/MyPokemonDetails';

export default function Combate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pokemon } = location.state || {};

  const [pokemonDetalhado, setPokemonDetalhado] = useState(null);
  const [meuPokemon, setMeuPokemon] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [turnoBloqueado, setTurnoBloqueado] = useState(false);

  const ataqueInimigoTimeoutRef = useRef(null);
  const curaInimigoTimeoutRef = useRef(null);

  // Função para salvar HP atual no Supabase
  const salvarHpAtualNoSupabase = async (pokeUUID, novoHpAtual) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;

    if (authError || !user) {
      console.error('Usuário não autenticado:', authError);
      return;
    }

    const { data: myPokesData, error: myPokesError } = await supabase
      .from('Mypokes')
      .select('AllMyPokes')
      .eq('user_id', user.id)
      .single();

    if (myPokesError || !myPokesData) {
      console.error('Erro ao buscar AllMyPokes:', myPokesError);
      return;
    }

    const allMyPokesAtualizado = myPokesData.AllMyPokes.map(poke => {
      if (poke.pokeUUID === pokeUUID) {
        return { ...poke, hpAtual: novoHpAtual };
      }
      return poke;
    });

    const { error: updateError } = await supabase
      .from('Mypokes')
      .update({ AllMyPokes: allMyPokesAtualizado })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Erro ao atualizar AllMyPokes:', updateError);
    } else {
      console.log('HP atualizado com sucesso no Supabase!');
    }
  };

  useEffect(() => {
    if (!pokemon) return;

    const fetchPokemonDetalhado = async () => {
      const { data, error } = await supabase
        .from('pokemons')
        .select('id, name, dificuldade, hp, attack, defense, speed')
        .eq('id', pokemon.id)
        .single();

      if (error) {
        console.error('Erro ao buscar Pokémon no Supabase:', error);
      } else {
        const dataComHpAtual = {
          ...data,
          hpAtual: pokemon?.hpAtual !== undefined ? pokemon.hpAtual : data.hp,
          level: pokemon.level || 1,
        };
        setPokemonDetalhado(dataComHpAtual);
      }
    };

    const fetchLastPokemon = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;

      if (authError || !user) {
        console.error('Usuário não autenticado');
        return;
      }

      const { data: myPokesData, error: myPokesError } = await supabase
        .from('Mypokes')
        .select('LastPokemon, AllMyPokes')
        .eq('user_id', user.id)
        .single();

      if (myPokesError || !myPokesData) {
        console.error('Erro ao buscar Mypokes:', myPokesError);
        return;
      }

      const lastPokeUUID = myPokesData.LastPokemon;
      const allMyPokesArray = myPokesData.AllMyPokes;

      if (!allMyPokesArray || !Array.isArray(allMyPokesArray)) {
        console.error('AllMyPokes não é um array válido');
        return;
      }

      const meuPoke = allMyPokesArray.find(poke => poke.pokeUUID === lastPokeUUID);

      if (!meuPoke) {
        console.error('LastPokemon não encontrado dentro de AllMyPokes');
        return;
      }

      const { data: basePokeData, error: basePokeError } = await supabase
        .from('pokemons')
        .select('id, name, dificuldade, hp, attack, defense, speed')
        .eq('id', meuPoke.pokemon_id)
        .single();

      if (basePokeError || !basePokeData) {
        console.error('Erro ao buscar dados base do Pokémon:', basePokeError);
        return;
      }

      const meuPokeCompleto = {
        ...basePokeData,
        ...meuPoke,
        hpAtual: meuPoke.hpAtual !== undefined ? meuPoke.hpAtual : basePokeData.hp,
        level: meuPoke.level || 1,
      };

      setMeuPokemon(meuPokeCompleto);
    };

    fetchPokemonDetalhado();
    fetchLastPokemon();

    // Cleanup timers caso o componente desmonte
    return () => {
      if (ataqueInimigoTimeoutRef.current) {
        clearTimeout(ataqueInimigoTimeoutRef.current);
      }
      if (curaInimigoTimeoutRef.current) {
        clearTimeout(curaInimigoTimeoutRef.current);
      }
    };
  }, [pokemon]);

  const mostrarMensagem = (texto, tempo = 1800) => {
    if (mostrarMensagem.timeoutId) {
      clearTimeout(mostrarMensagem.timeoutId);
    }

    setMensagem(texto);

    mostrarMensagem.timeoutId = setTimeout(() => {
      setMensagem('');
      mostrarMensagem.timeoutId = null;
    }, tempo);
  };

  const handleAtacar = () => {
    if (!pokemonDetalhado || !meuPokemon || turnoBloqueado) return;

    setTurnoBloqueado(true);

    const seuDanoBase = 5;
    const seuBonus = Math.floor(Math.random() * 5) + 1;
    const criticoSeu = Math.random() < 0.3;
    const bonusCriticoSeu = criticoSeu ? Math.floor(Math.random() * 5) + 1 : 0;

    const danoTotalSeu = seuDanoBase + seuBonus + bonusCriticoSeu;

    const novoHpInimigo = Math.max(pokemonDetalhado.hpAtual - danoTotalSeu, 0);

    if (criticoSeu) {
      mostrarMensagem(`Você atacou com um CRÍTICO! Dano total: ${danoTotalSeu}`);
    } else {
      mostrarMensagem(`Você atacou o inimigo e causou ${danoTotalSeu} de dano!`);
    }

    setPokemonDetalhado(prev => ({ ...prev, hpAtual: novoHpInimigo }));

    // Vitória instantânea, não executa contra-ataque
    if (novoHpInimigo === 0) {
      setTurnoBloqueado(false);
      return;
    }

    // Limpa timeout anterior se houver
    if (ataqueInimigoTimeoutRef.current) {
      clearTimeout(ataqueInimigoTimeoutRef.current);
    }

    // Inimigo contra-ataca depois de 2s
    ataqueInimigoTimeoutRef.current = setTimeout(() => {
      const danoBaseInimigo = 5;
      const bonusInimigo = Math.floor(Math.random() * 5) + 1;
      const criticoInimigo = Math.random() < 0.3;
      const bonusCriticoInimigo = criticoInimigo ? Math.floor(Math.random() * 5) + 1 : 0;

      const danoTotalInimigo = danoBaseInimigo + bonusInimigo + bonusCriticoInimigo;

      setMeuPokemon(meuPrev => {
        const novoHpMeu = Math.max(meuPrev.hpAtual - danoTotalInimigo, 0);

        if (criticoInimigo) {
          mostrarMensagem(`O inimigo atacou com um CRÍTICO! Causou ${danoTotalInimigo} de dano em você!`);
        } else {
          mostrarMensagem(`O inimigo atacou e causou ${danoTotalInimigo} de dano em você!`);
        }

        salvarHpAtualNoSupabase(meuPrev.pokeUUID, novoHpMeu);
        setTurnoBloqueado(false);
        return { ...meuPrev, hpAtual: novoHpMeu };
      });

      ataqueInimigoTimeoutRef.current = null;
    }, 2000);
  };

  const handleCurar = () => {
    if (!meuPokemon || turnoBloqueado) return;

    setTurnoBloqueado(true);

    const curaBase = 20;
    const bonus = Math.floor(Math.random() * 5) + 1;
    const critico = Math.random() < 0.3;
    const bonusCritico = critico ? Math.floor(Math.random() * 5) + 1 : 0;

    const curaTotal = curaBase + bonus + bonusCritico;

    setMeuPokemon(prev => {
      const novoHp = Math.min(prev.hpAtual + curaTotal, prev.hp);

      if (critico) {
        mostrarMensagem(`Cura CRÍTICA! Você recuperou ${curaTotal} de HP!`);
      } else {
        mostrarMensagem(`Você curou ${curaTotal} de HP!`);
      }

      salvarHpAtualNoSupabase(prev.pokeUUID, novoHp);

      return { ...prev, hpAtual: novoHp };
    });

    // Limpa timeout anterior se houver
    if (curaInimigoTimeoutRef.current) {
      clearTimeout(curaInimigoTimeoutRef.current);
    }

    // Inimigo ataca depois de 1.5s
    curaInimigoTimeoutRef.current = setTimeout(() => {
      const danoBaseInimigo = 5;
      const bonusInimigo = Math.floor(Math.random() * 5) + 1;
      const criticoInimigo = Math.random() < 0.3;
      const bonusCriticoInimigo = criticoInimigo ? Math.floor(Math.random() * 5) + 1 : 0;

      const danoTotalInimigo = danoBaseInimigo + bonusInimigo + bonusCriticoInimigo;

      setMeuPokemon(meuPrev => {
        const novoHpMeu = Math.max(meuPrev.hpAtual - danoTotalInimigo, 0);

        if (criticoInimigo) {
          mostrarMensagem(`O inimigo atacou com um CRÍTICO! Causou ${danoTotalInimigo} de dano!`);
        } else {
          mostrarMensagem(`O inimigo atacou e causou ${danoTotalInimigo} de dano!`);
        }

        salvarHpAtualNoSupabase(meuPrev.pokeUUID, novoHpMeu);
        setTurnoBloqueado(false);
        return { ...meuPrev, hpAtual: novoHpMeu };
      });

      curaInimigoTimeoutRef.current = null;
    }, 1500);
  };

  const handleCapturar = () => {
    navigate('/capturar', {
      state: { pokemon: pokemonDetalhado },
    });
  };

  const handleFugir = () => {
    navigate('/maps');
  };

  useEffect(() => {
    if (pokemonDetalhado?.hpAtual === 0) {
      mostrarMensagem('Você venceu o combate!', 3000);
      setTimeout(() => {
        navigate('/maps');
      }, 3000);
    }
  }, [pokemonDetalhado?.hpAtual, navigate]);

  useEffect(() => {
    if (meuPokemon?.hpAtual === 0) {
      mostrarMensagem('Seu Pokémon foi derrotado!', 3000);
      setTimeout(() => {
        navigate('/maps');
      }, 3000);
    }
  }, [meuPokemon?.hpAtual, navigate]);

  if (!pokemonDetalhado || !meuPokemon) return <p>Carregando dados do combate...</p>;

  return (
    <div className="combate-container">
      <h1>Combate Pokémon</h1>

      <div className="batalha-area">
        {/* Seu Pokémon no canto inferior esquerdo */}
        <div className="meu-pokemon-area">
          <MyPokemonDetails pokemon={meuPokemon} />
        </div>

        {/* Inimigo no canto superior direito */}
        <div className="inimigo-area">
          <EnemyDetails pokemon={pokemonDetalhado} />
        </div>
      </div>

      <div className="mensagem-combate">{mensagem || '\u00A0'}</div>

      <AcoesCombate
        pokemon={pokemonDetalhado}
        onAtacar={handleAtacar}
        onCapturar={handleCapturar}
        onFugir={handleFugir}
        onCurar={handleCurar}
        disabled={turnoBloqueado || pokemonDetalhado.hpAtual === 0}
      />
    </div>
  );
}
