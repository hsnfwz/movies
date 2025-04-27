'use client';
import { useState } from 'react';

function SearchCard({ movie, disabled, handleSelect }) {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <button
      disabled={disabled}
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleSelect}
      className={`flex cursor-pointer justify-between gap-2 rounded-xl border-2 border-neutral-100 p-4 transition-all duration-100 hover:border-black focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:border-dotted disabled:border-black`}
    >
      <img
        id={`img-${movie.id}`}
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`
        }
        alt={movie.title}
        className={`w-full max-w-[100px] rounded-xl ${loadingImage ? 'hidden' : 'visible'}`}
        // onError={() => {
        //   const imageElement = document.getElementById(`img-${movie.id}`);
        //   imageElement.onerror = null;
        //   imageElement.src = `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`;
        // }}
        onLoad={() => setLoadingImage(false)}
      />
      <div
        className={`aspect-[2/3] w-full max-w-[100px] animate-pulse rounded-xl bg-neutral-100 ${loadingImage ? 'visible' : 'hidden'}`}
      ></div>
      <div className="flex flex-col gap-2 self-center text-right">
        <h2 className={`font-bold`}>{movie.title}</h2>
        <p>{movie.year}</p>
      </div>
    </button>
  );
}

export default SearchCard;
