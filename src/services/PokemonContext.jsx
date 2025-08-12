// src/services/PokemonContext.jsx
import React, { createContext, useState } from "react";

export const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allMyPokes, setAllMyPokes] = useState([]);
  const [favoritePokes, setFavoritePokes] = useState([]);
  const [myEquipe, setMyEquipe] = useState([]);

  const persist = (novaLista, novosFavoritos, novaEquipe) => {
    setAllMyPokes(novaLista);
    setFavoritePokes(novosFavoritos);
    setMyEquipe(novaEquipe);
    // Pode salvar localStorage ou backend
  };

  return (
    <PokemonContext.Provider
      value={{
        user,
        setUser,
        allMyPokes,
        setAllMyPokes,
        favoritePokes,
        setFavoritePokes,
        myEquipe,
        setMyEquipe,
        persist,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
