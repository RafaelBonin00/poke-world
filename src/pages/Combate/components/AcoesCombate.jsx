export default function AcoesCombate({ pokemon, onAtacar, onCapturar, onFugir, onCurar, disabled }) {
  return (
    <div className="botoes">
      <button
        onClick={onAtacar}
        className="botao atacar"
        disabled={disabled || pokemon.hpAtual === 0}
      >
        Atacar
      </button>
      <button
        onClick={onCurar}
        className="botao curar"
        disabled={disabled || pokemon.hpAtual === 0}
      >
        Curar
      </button>
      <button
        onClick={onCapturar}
        className="botao capturar"
        disabled={disabled}
      >
        Capturar
      </button>
      <button
        onClick={onFugir}
        className="botao fugir"
        disabled={disabled}
      >
        Fugir
      </button>
    </div>
  );
}
