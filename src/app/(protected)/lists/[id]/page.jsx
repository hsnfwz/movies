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
  const {
    lists,
    setLists,
    movies,
    setMovies,
    fetchingLists,
  } = useContext(DataContext);
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
        const _filteredMovies = Object.values(movies[id]).filter(
          (listMovie) => listMovie.list_id == id
        );
        setFilteredMovies(_filteredMovies);
      } else {
        const _filteredMovies = Object.values(movies[id]).filter(
          (movie) =>
            movie.list_id == id &&
            movie.title.toLowerCase().includes(_title.trim().toLowerCase())
        );
        setFilteredMovies(_filteredMovies);
      }
    }, 500);
  }

  useEffect(() => {
    async function fetchData() {
      if (!fetchingLists) {
        if (!lists[id] || !movies[id]) {
          const response = await fetch(`/api/lists/${id}`);
          const { list, listMovies, error } =
            await response.json();

          if (error) {
            setFetchingData(false);
            return console.log(error);
          }

          const _listMovies = { [id]: {} };
          listMovies.forEach((movie) => {
            _listMovies[id][movie.movie_id] = movie;
          });

          setMovies({ ...movies, ..._listMovies });
          setLists({ ...lists, [id]: list });
        } else {
          const _filteredMovies = Object.values(movies[id]).filter(
            (listMovie) => listMovie.list_id == id
          );
          setFilteredMovies(_filteredMovies);
        }
      }
      setFetchingData(false);
    }

    fetchData();
  }, [fetchingLists]);

  useEffect(() => {
    if (!fetchingData && movies) {
      const _filteredMovies = Object.values(movies[id]).filter(
        (listMovie) => listMovie.list_id == id
      );
      setFilteredMovies(_filteredMovies);
    }
  }, [movies]);

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
          <h1>{lists[id].name}</h1>
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
          {filteredMovies.map((movie, index) => (
            <ScrollYCard key={index} movie={movie} />
          ))}
        </ScrollYGrid>
      </div>
    );
  }
}

export default List;
