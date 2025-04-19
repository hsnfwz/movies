import { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function ScrollXGrid({
  children,
  moviesRef,
  setFilteredMovies,
  scrolling,
  setScrolling,
  firstIntersected,
  lastIntersected,
  activeMovie,
}) {
  const parentRef = useRef();
  const searchTimerRef = useRef();
  const [title, setTitle] = useState('');

  function handleSearch(event) {
    const _title = event.currentTarget.value;
    setTitle(_title);

    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (_title.length === 0) {
        setFilteredMovies([...moviesRef.current]);
      } else {
        const _filteredMovies = moviesRef.current.filter((movie) =>
          movie.title.toLowerCase().includes(_title.trim().toLowerCase())
        );
        setFilteredMovies(_filteredMovies);
      }
    }, 1000);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-4">
        <input
          type="text"
          value={title}
          placeholder="Search Movies in List"
          onInput={handleSearch}
          className="flex w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black placeholder-neutral-400 transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={firstIntersected}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              activeMovie.target.previousElementSibling.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            disabled={lastIntersected}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              activeMovie.target.nextElementSibling.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div
        ref={parentRef}
        onScroll={() => {
          if (!scrolling) {
            setScrolling(true);
          }
        }}
        onScrollEnd={() => setScrolling(false)}
        className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-4 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
      >
        {children}
      </div>
    </div>
  );
}

export default ScrollXGrid;
