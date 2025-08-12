import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCapturaPokemon from '../Capturar/componentes/useCapturaPokemon';

import InfoPokemonSorteado from '../../componentes/InfoPokemonSorteado';
import OpcoesCaptura from '../../componentes/OpcoesCaptura';
import Mira from '../../componentes/Mira';
import MensagemRetorno from '../../componentes/MensagemRetorno';
import AnimatedPokemonIcon from '../../componentes/AnimatedPokemonIcon';

function Capturar_Page() {
  const { state } = useLocation();
  const pokemon = state?.pokemon;
  const navigate = useNavigate();

  const toastRef = useRef();
  const showToast = (msg) => toastRef.current?.showToast(msg);

  const {
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
    animandoIcone,
  } = useCapturaPokemon(showToast, pokemon);

  const handleFimAnimacao = () => {
    if (resultadoCaptura === 'success') {
      showToast(`🎉 Capturou ${pokemonSorteado.name}!`);
      navigate('/maps');
    } else {
      showToast('😭 Falhou na captura');

    }
  };

    useEffect(() => {
      if (!pokemon) {

        navigate('/maps');
      }
    }, [pokemon, navigate]);




  if (!pokemon && !pokemonSorteado) {
    return (
      <div>
        <p>Nenhum Pokémon sorteado. Volte ao mapa para sortear.</p>
        <button onClick={() => navigate('/')}>Voltar ao Mapa</button>
      </div>
    );
  }

  return (
    <div className="captura-container">
      <h1>Captura de Pokémon</h1>

      <InfoPokemonSorteado pokemon={pokemonSorteado || pokemon} />

      <OpcoesCaptura
        pokebola={pokebola}
        setPokebola={setPokebola}
        fruta={fruta}
        setFruta={setFruta}
      />

      {animandoIcone ? (
        <AnimatedPokemonIcon
          sucesso={resultadoCaptura === 'success'}
          onFim={handleFimAnimacao}
        />
      ) : (
        <Mira
          miraAtiva={miraAtiva}
          alvoPosicao={alvoPosicao}
          barraPosicao={barraPosicao}
          barraLargura={barraLargura}
          pararMira={pararMira}
        />
      )}

      <MensagemRetorno ref={toastRef} />
    </div>
  );
}

export default Capturar_Page;
