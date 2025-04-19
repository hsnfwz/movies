'use client';
import { useState } from 'react';

function ScrollYCard({ movie }) {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <div id={`movie-${movie.id}`} className="flex w-full flex-col gap-2">
      <img
        id={`img-${movie.id}`}
        src={movie.poster}
        alt={movie.title}
        className={`w-full rounded-3xl ${loadingImage ? 'hidden' : 'visible'}`}
        onError={() => {
          const imageElement = document.getElementById(`img-${movie.id}`);
          imageElement.onerror = null;
          imageElement.src = `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`;
        }}
        onLoad={() => setLoadingImage(false)}
      />
      <div
        className={`aspect-square w-full animate-pulse rounded-3xl bg-neutral-100 ${loadingImage ? 'visible' : 'hidden'}`}
      ></div>
      {!loadingImage && <h2>{movie.title}</h2>}
    </div>
  );
}

export default ScrollYCard;
