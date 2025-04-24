'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { DataContext } from '@/contexts/DataContextProvider';
import { Plus } from 'lucide-react';
import ScrollYCard from '@/components/ScrollYCard';
import ScrollYGrid from '@/components/ScrollYGrid';
import Loading from '@/components/Loading';
import { ModalContext } from '@/contexts/ModalContextProvider';
import Button from '@/components/Button';

function Movies() {
  const { modal, setModal } = useContext(ModalContext);
  const { movies, setMovies } = useContext(DataContext);
  const [fetchingData, setFetchingData] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const searchTimerRef = useRef();
  const [title, setTitle] = useState('');

  function handleSearch(event) {
    const _title = event.currentTarget.value;
    setTitle(_title);

    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (_title.length === 0) {
        const _filteredMovies = Object.values(movies);
        setFilteredMovies(_filteredMovies);
      } else {
        const _filteredMovies = Object.values(movies).filter((movie) =>
          movie.title.toLowerCase().includes(_title.trim().toLowerCase())
        );
        setFilteredMovies(_filteredMovies);
      }
    }, 500);
  }

  useEffect(() => {
    async function fetchData() {
      if (Object.keys(movies).length === 0) {
        const response = await fetch(`/api/movies`);
        const { movies: myMovies, error } = await response.json();

        if (error) {
          setFetchingData(false);
          return console.log(error);
        }

        const _myMovies = {};
        myMovies.forEach((movie) => (_myMovies[movie.id] = movie));
        setMovies(_myMovies);

        const _filteredMovies = Object.values(_myMovies).sort((m1, m2) => {
            if ( m1.title < m2.title ){
    return -1;
  }
  if ( m1.title > m2.title ){
    return 1;
  }
  return 0;
        });
        setFilteredMovies(_filteredMovies);
      } else {
        const _filteredMovies = Object.values(movies).sort((m1, m2) => {
            if ( m1.title < m2.title ){
    return -1;
  }
  if ( m1.title > m2.title ){
    return 1;
  }
  return 0;
        });
        setFilteredMovies(_filteredMovies);
      }

      setFetchingData(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!fetchingData) {
      const _filteredMovies = Object.values(movies).sort((m1, m2) => {
          if ( m1.title < m2.title ){
    return -1;
  }
  if ( m1.title > m2.title ){
    return 1;
  }
  return 0;
      });
      setFilteredMovies(_filteredMovies);
    }
  }, [fetchingData, movies]);

  if (fetchingData) {
    return <Loading />;
  }

  if (!fetchingData) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center gap-4">
          <h1 className="w-full">
            {Object.keys(movies).length === 0
              ? 'You do not have any movies yet'
              : 'My Movies'}
          </h1>
          <Button
            handleClick={() => setModal({ action: 'ADD_MOVIE' })}
            rounded={true}
            color="sky"
          >
            <Plus />
          </Button>
        </div>
        {Object.keys(movies).length === 0 && (
          <p>Let's get you started by adding your first movie!</p>
        )}
        {Object.keys(movies).length > 0 && (
          <>
            <input
              type="text"
              value={title}
              placeholder="Search Movies"
              onInput={handleSearch}
              className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black placeholder-neutral-400 transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
            />
            <ScrollYGrid>
              {filteredMovies.map((movie, index) => (
                <ScrollYCard key={index} movie={movie} />
              ))}
            </ScrollYGrid>
          </>
        )}
      </div>
    );
  }
}

export default Movies;
