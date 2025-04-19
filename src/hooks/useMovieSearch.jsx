'use client';
import { useEffect, useRef, useState } from 'react';

function useMovieSearch() {
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [fetchingMovies, setFetchingMovies] = useState(false);

  const timerRef = useRef();

  useEffect(() => {
    if (title.trim().length === 0) {
      setMovies([]);
      return;
    }
    setFetchingMovies(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      getMoviesOnTitleChange();
    }, [1000]);
  }, [title]);

  useEffect(() => {
    if (title.trim().length === 0 || page === 1) return;
    setFetchingMovies(true);
    getMoviesOnPageChange();
  }, [page]);

  async function getMoviesOnTitleChange() {
    try {
      const response = await fetch(`/api/search?title=${title}&page=1`);
      const data = await response.json();
      setMovies(data.movies);
      if (page > 1) setPage(1);
      setFetchingMovies(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMoviesOnPageChange() {
    try {
      const response = await fetch(`/api/search?title=${title}&page=${page}`);
      const data = await response.json();
      const _movies = [...movies, ...data.movies];
      setMovies(_movies);
      setFetchingMovies(false);
    } catch (error) {
      console.log(error);
    }
  }

  return [title, setTitle, page, setPage, movies, fetchingMovies];
}

export default useMovieSearch;
