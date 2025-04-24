'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Pen } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import ScrollYGrid from '@/components/ScrollYGrid';
import ScrollYCard from '@/components/ScrollYCard';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import Button from '@/components/Button';

function List() {
  const { id } = useParams();
  const { modal, setModal } = useContext(ModalContext);
  const { lists, setLists, movies, setMovies } = useContext(DataContext);
  const [fetchingData, setFetchingData] = useState(true);
  const [filteredMovieIds, setFilteredMovieIds] = useState([]);

  const searchTimerRef = useRef();
  const [title, setTitle] = useState('');

  function handleSearch(event) {
    const _title = event.currentTarget.value;
    setTitle(_title);

    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (_title.length === 0) {
        setFilteredMovieIds(lists[id].movieIds);
      } else {
        const _filteredMovieIds = lists[id].movieIds.filter((movieId) =>
          movies[movieId].title
            .toLowerCase()
            .includes(_title.trim().toLowerCase())
        );
        setFilteredMovieIds(_filteredMovieIds);
      }
    }, 500);
  }

  useEffect(() => {
    async function fetchData() {
      if (Object.keys(lists).length === 0 || !lists[id] || !lists[id].movies) {
        const response = await fetch(`/api/lists/${id}`);
        const { list, listMovies, error } = await response.json();

        if (error) {
          setFetchingData(false);
          return console.log(error);
        }

        const _listMovies = {};
        listMovies.forEach((movie) => {
          _listMovies[movie.id] = movie;
        });
        setMovies({ ...movies, ..._listMovies });

        const ids = listMovies.map((listMovie) => listMovie.id);
        setLists({ ...lists, [id]: { ...list, movieIds: ids } });
        setFilteredMovieIds(ids);
      } else {
        setFilteredMovieIds(lists[id].movieIds);
      }
      setFetchingData(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!fetchingData) {
      setFilteredMovieIds(lists[id].movieIds);
    }
  }, [fetchingData, lists]);

  if (fetchingData) {
    return <Loading />;
  }

  if (!fetchingData && lists && !lists[id]) {
    return <Empty />;
  }

  if (!fetchingData && lists && lists[id]) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center gap-4">
          <h1 className="w-full">{lists[id].name}</h1>
          <Button
            rounded={true}
            handleClick={() =>
              setModal({ action: 'EDIT_LIST', data: { list: lists[id] } })
            }
            color="sky"
          >
            <Pen />
          </Button>
        </div>
        <input
          type="text"
          value={title}
          placeholder="Search Movies in List"
          onInput={handleSearch}
          className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black placeholder-neutral-400 transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
        <ScrollYGrid>
          {filteredMovieIds.map((movieId, index) => (
            <ScrollYCard key={index} movie={movies[movieId]} />
          ))}
        </ScrollYGrid>
      </div>
    );
  }
}

export default List;
