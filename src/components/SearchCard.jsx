'use client';
import { useState } from 'react';

function SearchCard({ movie, listMovies, setListMovies }) {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={() => {
      if (!listMovies[movie.imdbID]) {
        const _listMovies = { ...listMovies };
        _listMovies[movie.imdbID] = {
          title: movie.Title,
          poster: movie.Poster,
          imdb_id: movie.imdbID,
        };
        setListMovies(_listMovies);
      }
    }}
    className="group flex cursor-pointer flex-col gap-2 focus:ring-0 focus:outline-0"
  >
      <img
        id={`img-${movie.movie_id}`}
        src={movie.Poster}
        alt={movie.Title}
        className={`w-full rounded-3xl border-2 p-2 transition-all duration-200 group-hover:border-sky-500 group-focus:border-black group-focus:ring-0 group-focus:outline-0 ${listMovies[movie.imdbID] ? 'border-dotted border-sky-500 bg-sky-300' : 'border-transparent'} ${loadingImage ? 'hidden' : 'visible'}`}
        onError={() => {
          const imageElement = document.getElementById(`img-${movie.movie_id}`);
          imageElement.onerror = null;
          imageElement.src = `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`;
        }}
        onLoad={() => setLoadingImage(false)}
      />
      <div
        className={`aspect-square w-full animate-pulse rounded-3xl bg-neutral-100 ${loadingImage ? 'visible' : 'hidden'}`}
      ></div>
      {!loadingImage && <h2>{movie.Title}</h2>}
</button>
  );
}

export default SearchCard;
