// src/App.jsx
import Header from './componentes/Header';
import EscolherPokemonInicial from './pages/Inicio/Inicio';
import Rotas from './Rota/rotas';

function App() {

  return (
    <>
      <Header/>
      <main style={styles.main}>
        <Rotas />
      </main>
    </>
  );
}

const styles = {
  header: {
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc'
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  },
  main: {
    padding: '2rem'
  }
};

export default App;
