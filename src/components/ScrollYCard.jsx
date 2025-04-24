'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import Button from '@/components/Button';

function ScrollYCard({ movie }) {
  const { modal, setModal } = useContext(ModalContext);
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <div id={`movie-${movie.id}`} className="flex w-full flex-col gap-4 transition-all duration-100">
      <img
        id={`img-${movie.id}`}
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt={movie.title}
        className={`w-full rounded-xl ${loadingImage ? 'hidden' : 'visible'}`}
        onError={() => {
          const imageElement = document.getElementById(`img-${movie.id}`);
          imageElement.onerror = null;
          imageElement.src = `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`;
        }}
        onLoad={() => setLoadingImage(false)}
      />
      <div
        className={`aspect-square w-full animate-pulse rounded-xl bg-neutral-100 ${loadingImage ? 'visible' : 'hidden'}`}
      ></div>
      {!loadingImage && (
        <>
          <div className="flex flex-col gap-2 rounded-xl bg-neutral-100 p-4">
            <h2 className="font-bold">{movie.title}</h2>
            <p>{movie.year}</p>
            <p className="text-amber-500">
              <span className="font-bold">
                {movie.rating ? movie.rating : '-'}
              </span>{' '}
              / 10
            </p>
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className="block self-start underline hover:text-sky-500 focus:text-sky-500 focus:ring-0 focus:outline-0"
              href={`https://www.imdb.com/title/${movie.imdb_id}`}
              target="_blank"
            >
              IMDb
            </Link>
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className="block self-start underline hover:text-sky-500 focus:text-sky-500 focus:ring-0 focus:outline-0"
              href={`https://letterboxd.com/imdb/${movie.imdb_id}`}
              target="_blank"
            >
              Letterboxd
            </Link>
          </div>
          <Button
            handleClick={() =>
              setModal({
                action: 'EDIT_MOVIE_RATING',
                data: { movie },
              })
            }
            color="amber"
            active={movie.rating}
            activeColor="amber"
            rounded={true}
            className="self-end"
          >
            <Star
              fill="white"
              stroke={movie.rating ? 'white' : 'oklch(76.9% 0.188 70.08)'}
            />
          </Button>
        </>
      )}
    </div>
  );
}

export default ScrollYCard;
