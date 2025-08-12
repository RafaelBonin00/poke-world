import './Mira.css'; // Arquivo de estilos
import AnimatedPokemonIcon from './AnimatedPokemonIcon';

export default function Mira({ miraAtiva, alvoPosicao, barraPosicao, barraLargura, pararMira, animandoIcone, resultadoCaptura }) {
  if (!miraAtiva && !animandoIcone && !resultadoCaptura) return null;

  return (
    <>
      <div className="barra-wrapper">
        <div className="zona-amarela" style={{ left: `${alvoPosicao - 10}%` }} />
        <div className="zona-vermelha" style={{ left: `${alvoPosicao - 4}%` }} />
        <div
          className="barra-movel"
          style={{ left: `${barraPosicao}%`, width: `${barraLargura}%` }}
        >
          <AnimatedPokemonIcon resultadoCaptura={resultadoCaptura} animando={animandoIcone} />
        </div>
      </div>
      <button onClick={pararMira}>Parar Mira e Capturar</button>
    </>
  );
}