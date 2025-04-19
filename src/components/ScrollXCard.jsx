'use client';
import { useEffect, useState } from 'react';
import useIntersection from '@/hooks/useIntersection';

function ScrollXCard({
  movie,
  moviesRef,
  scrolling,
  firstIntersected,
  setFirstIntersected,
  lastIntersected,
  setLastIntersected,
  setActiveMovie,
}) {
  const [elementRef, elementIntersected] = useIntersection();
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (!scrolling && elementIntersected) {
      setActiveMovie(elementIntersected);

      if (elementIntersected.target.id == `movie-${moviesRef.current[0].id}`) {
        setFirstIntersected(true);
      } else {
        if (firstIntersected) {
          setFirstIntersected(false);
        }
      }

      if (
        elementIntersected.target.id ==
        `movie-${moviesRef.current[moviesRef.current.length - 1].id}`
      ) {
        setLastIntersected(true);
      } else {
        if (lastIntersected) {
          setLastIntersected(false);
        }
      }
    }
  }, [scrolling, elementIntersected]);

  return (
    <div
      id={`movie-${movie.id}`}
      ref={elementRef}
      className={`flex w-[256px] snap-center flex-col gap-2 ${!scrolling && elementIntersected ? 'opacity-100' : 'opacity-50'} transition-all duration-200`}
    >
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
      {!scrolling && elementIntersected && !loadingImage && (
        <h2>{movie.title}</h2>
      )}
    </div>
  );
}

export default ScrollXCard;
