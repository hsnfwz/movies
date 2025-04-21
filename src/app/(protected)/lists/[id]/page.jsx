'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Pen } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import ScrollYGrid from '@/components/ScrollYGrid';
import ScrollYCard from '@/components/ScrollYCard';
import Loading from '@/components/Loading';

function List() {
  const { id } = useParams();
  const { modal, setModal } = useContext(ModalContext);
  const {
    lists,
    setLists,
    movies,
    setMovies,
    ratings,
    setRatings,
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
        if (!lists[id] || !movies[id] || !ratings[id]) {
          const response = await fetch(`/api/lists/${id}`);
          const { list, listMovies, listRatings, error } =
            await response.json();

          if (error) {
            setFetchingData(false);
            return console.log(error);
          }

          const _listMovies = { [id]: {} };
          listMovies.forEach((movie) => {
            _listMovies[id][movie.movie_id] = movie;
          });

          listRatings.forEach((rating) => (ratings[rating.movie_id] = rating));

          setMovies({ ...movies, ..._listMovies });
          setRatings({ ...ratings, ...listRatings });
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
    return <span>No Content</span>;
  }

  if (!fetchingData && lists && lists[id]) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center gap-4">
          <h1>{lists[id].name}</h1>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              setModal({ action: 'EDIT_LIST', data: { list: lists[id] } })
            }
            className="ml-auto flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
          >
            <Pen />
          </button>
        </div>
        <input
          type="text"
          value={title}
          placeholder="Search Movies in List"
          onInput={handleSearch}
          className="flex w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black placeholder-neutral-400 transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
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
