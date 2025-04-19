import { useState, useRef } from 'react';

function ScrollYGrid({ children, moviesRef, setFilteredMovies }) {
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
      <input
        type="text"
        value={title}
        placeholder="Search Movies in List"
        onInput={handleSearch}
        className="flex w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black placeholder-neutral-400 transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
      />
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

export default ScrollYGrid;
