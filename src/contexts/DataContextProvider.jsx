'use client';
import { createContext, useState } from 'react';

const DataContext = createContext({});

function DataContextProvider({ children }) {
  const [lists, setLists] = useState(null);
  const [fetchingLists, setFetchingLists] = useState(true);
  const [movies, setMovies] = useState({});
  const [ratings, setRatings] = useState({});

  return (
    <DataContext.Provider
      value={{
        lists,
        setLists,
        movies,
        setMovies,
        ratings,
        setRatings,
        fetchingLists,
        setFetchingLists,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
