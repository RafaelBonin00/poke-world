import { MdCatchingPokemon } from 'react-icons/md';
import './AnimatedPokemonIcon.css'; // Estilos abaixo

export default function AnimatedPokemonIcon({ animando, resultadoCaptura }) {
  let className = 'pokemon-icone';

  if (animando) className += ' animando';
  if (resultadoCaptura === 'success') className += ' sucesso';
  if (resultadoCaptura === 'fail') className += ' falha';

  return <MdCatchingPokemon className={className} size={48} />;
}
