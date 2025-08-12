import React from 'react';

export default function OpcoesCaptura({ pokebola, setPokebola, fruta, setFruta }) {
  return (
    <div className="botoes">
      <label>
        Pokébola:
        <select value={pokebola} onChange={(e) => setPokebola(e.target.value)}>
          <option value="poke-ball">Pokébola</option>
          <option value="great-ball">Great Ball</option>
          <option value="ultra-ball">Ultra Ball</option>
          <option value="master-ball">Master Ball</option>
          <option value="quick-ball">Quick Ball</option>
          <option value="repeat-ball">Repeat Ball</option>
        </select>
      </label>
      <label>
        Fruta:
        <select value={fruta} onChange={(e) => setFruta(e.target.value)}>
          <option value="">Nenhuma</option>
          <option value="berry">Berry</option>
        </select>
      </label>
    </div>
  );
}
