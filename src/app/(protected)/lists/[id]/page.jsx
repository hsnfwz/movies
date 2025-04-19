'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import ScrollXGrid from '@/components/ScrollXGrid';
import ScrollXCard from '@/components/ScrollXCard';
import ScrollYGrid from '@/components/ScrollYGrid';
import ScrollYCard from '@/components/ScrollYCard';
import AddEditModal from '@/components/AddEditModal';

function List() {
  const { id } = useParams();
  const { modal, setModal } = useContext(ModalContext);

  const [list, setList] = useState(null);
  const moviesRef = useRef([]);
  const usersRef = useRef([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [scrolling, setScrolling] = useState(false);
  const [firstIntersected, setFirstIntersected] = useState(false);
  const [lastIntersected, setLastIntersected] = useState(false);
  const [activeMovie, setActiveMovie] = useState(null);

  const [scrollView, setScrollView] = useState('');
  const scrollRef = useRef('');

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSafari, setIsSafari] = useState(null);

  useEffect(() => {
    function getScrollView() {
      if (isSafari === null) {
        let safariAgent = window.navigator.userAgent.indexOf('Safari') > -1;
        let chromeAgent = window.navigator.userAgent.indexOf('Chrome') > -1;
        if (chromeAgent && safariAgent) safariAgent = false;
        setIsSafari(safariAgent);
      }

      if (window.innerWidth <= 512 && scrollRef.current !== 'X') {
        scrollRef.current = 'X';
        setScrollView('X');
      } else if (window.innerWidth > 512 && scrollRef.current !== 'Y') {
        scrollRef.current = 'Y';
        setScrollView('Y');
      }
    }

    getScrollView();

    window.addEventListener('resize', getScrollView);

    return () => window.removeEventListener('resize', getScrollView);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/lists/${id}`);
      const { list, movies, error } = await response.json();

      if (error) console.log(error);

      setList(list);
      setFilteredMovies(movies);
      moviesRef.current = movies;
      setFetchingData(false);
    }

    fetchData();
  }, []);

  if (fetchingData) {
    return <span>Loading...</span>;
  }

  if (!fetchingData && !list) {
    return <span>No Content</span>;
  }

  if (!fetchingData && list) {
    return (
      <div className="flex w-full flex-col gap-4">
        <h1>{list.name}</h1>
        {!isSafari && scrollView === 'X' && (
          <ScrollXGrid
            moviesRef={moviesRef}
            filteredMovies={filteredMovies}
            setFilteredMovies={setFilteredMovies}
            scrolling={scrolling}
            setScrolling={setScrolling}
            firstIntersected={firstIntersected}
            lastIntersected={lastIntersected}
            activeMovie={activeMovie}
          >
            {filteredMovies.map((movie, index) => (
              <ScrollXCard
                key={index}
                movie={movie}
                moviesRef={moviesRef}
                scrolling={scrolling}
                lastIntersected={lastIntersected}
                setLastIntersected={setLastIntersected}
                firstIntersected={firstIntersected}
                setFirstIntersected={setFirstIntersected}
                setActiveMovie={setActiveMovie}
              />
            ))}
          </ScrollXGrid>
        )}
        {(isSafari || scrollView === 'Y') && (
          <ScrollYGrid
            moviesRef={moviesRef}
            filteredMovies={filteredMovies}
            setFilteredMovies={setFilteredMovies}
          >
            {filteredMovies.map((movie, index) => (
              <ScrollYCard key={index} movie={movie} />
            ))}
          </ScrollYGrid>
        )}
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setModal('EDIT_LIST')}
          className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
        >
          <Plus />
        </button>
        <AddEditModal
          show={modal === 'EDIT_LIST'}
          handleSubmit={() => console.log('submit')}
          disabled={false}
          list={list}
          moviesRef={moviesRef}
          usersRef={usersRef}
        />
      </div>
    );
  }
}

export default List;
