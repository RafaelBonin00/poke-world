

const ReturnApi = async (request) => {
  const url = `https://pokeapi.co/api/v2/${request}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Requisição falhou! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Aqui você pode logar o erro ou tratar de outra forma
    throw new Error(`Erro na requisição: ${error.message}`);
  }
};

export default ReturnApi;
