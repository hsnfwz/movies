'use client';
import { useEffect, useRef, useState } from 'react';

function useMovieSearch() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [searchMovies, setSearchMovies] = useState([]);
  const [isSearchingMovies, setIsSearchingMovies] = useState(false);
  const [hasMoreSearchMovies, setHasMoreSearchMovies] = useState(true);

  const timerRef = useRef();

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (searchTitle.trim().length === 0) {
      setIsSearchingMovies(false);
      setSearchMovies([]);
    } else {
      timerRef.current = setTimeout(() => {
        getMoviesOnTitleChange();
      }, [500]);
    }
  }, [searchTitle]);

  useEffect(() => {
    if (searchTitle.trim().length > 0) getMoviesOnPageChange();
  }, [searchPage]);

  async function getMoviesOnTitleChange() {
    try {
      if (searchPage > 1) {
        setSearchPage(1);
      } else {
        setIsSearchingMovies(true);
        const response = await fetch(
          `/api/search/movies?title=${searchTitle}&page=1`
        );
        const { movies } = await response.json();

        if (movies.length < 20) {
          setHasMoreSearchMovies(false);
        } else {
          setHasMoreSearchMovies(true);
        }
        setSearchMovies(movies);
        setIsSearchingMovies(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getMoviesOnPageChange() {
    try {
      setIsSearchingMovies(true);
      const response = await fetch(
        `/api/search/movies?title=${searchTitle}&page=${searchPage}`
      );
      const { movies } = await response.json();

      if (movies.length < 20) {
        setHasMoreSearchMovies(false);
      } else {
        setHasMoreSearchMovies(true);
      }

      let _movies;

      if (searchPage === 1) {
        _movies = movies;
      } else {
        _movies = [...searchMovies, ...movies];
      }

      setSearchMovies(_movies);
      setIsSearchingMovies(false);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    searchTitle,
    setSearchTitle,
    searchPage,
    setSearchPage,
    searchMovies,
    setSearchMovies,
    isSearchingMovies,
    setIsSearchingMovies,
    hasMoreSearchMovies,
    setHasMoreSearchMovies,
  };
}

export default useMovieSearch;
