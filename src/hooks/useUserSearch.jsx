'use client';
import { useEffect, useRef, useState } from 'react';

function useUserSearch() {
  const [email, setEmail] = useState('');
  // const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // const timerRef = useRef();

  // useEffect(() => {
  //   if (title.trim().length === 0) {
  //     setMovies([]);
  //     return;
  //   }
  //   setFetchingMovies(true);
  //   clearTimeout(timerRef.current);
  //   timerRef.current = setTimeout(() => {
  //     getMoviesOnTitleChange();
  //   }, [1000]);
  // }, [title]);

  // useEffect(() => {
  //   if (title.trim().length === 0 || page === 1) return;
  //   setFetchingMovies(true);
  //   getMoviesOnPageChange();
  // }, [page]);

  // async function getMoviesOnTitleChange() {
  //   try {
  //     const data = await fetch(`/search/api?title=${title}&page=1`);
  //     const result = await data.json();
  //     setMovies(result.movies);
  //     if (page > 1) setPage(1);
  //     setFetchingMovies(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function getMoviesOnPageChange() {
  //   try {
  //     const data = await fetch(`/search/api?title=${title}&page=${page}`);
  //     const result = await data.json();
  //     const _movies = [...movies, ...result.movies];
  //     setMovies(_movies);
  //     setFetchingMovies(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return [email, setEmail, users, fetchingUsers];
}

export default useUserSearch;
