'use client';
import { createContext, useState } from 'react';

const DataContext = createContext({});

function DataContextProvider({ children }) {
  const [lists, setLists] = useState(null);
  const [fetchingLists, setFetchingLists] = useState(true);
  const [movies, setMovies] = useState({});
  const [moviesWithoutList, setMoviesWithoutList] = useState(null);

  return (
    <DataContext.Provider
      value={{
        lists,
        setLists,
        movies,
        setMovies,
        fetchingLists,
        setFetchingLists,
        moviesWithoutList, setMoviesWithoutList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
