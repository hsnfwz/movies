'use client';
import { createContext, useState } from 'react';

const DataContext = createContext({});

function DataContextProvider({ children }) {
  const [lists, setLists] = useState({}); // { [listId]: { name, movies: [movieId, movieId, movieId] } }
  const [movies, setMovies] = useState({}); // { [movieId]: { ... } }

  return (
    <DataContext.Provider
      value={{
        lists,
        setLists,
        movies,
        setMovies,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
