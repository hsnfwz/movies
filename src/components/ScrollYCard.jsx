'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';

function ScrollYCard({ movie }) {
  const { modal, setModal } = useContext(ModalContext);
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <div id={`movie-${movie.movie_id}`} className="flex w-full flex-col gap-4">
      <img
        id={`img-${movie.movie_id}`}
        src={movie.poster}
        alt={movie.title}
        className={`w-full rounded-xl ${loadingImage ? 'hidden' : 'visible'}`}
        onError={() => {
          const imageElement = document.getElementById(`img-${movie.movie_id}`);
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
            <p className="text-amber-500">
              <span className="font-bold">
                {movie.rating ? movie.rating : '-'}
              </span>{' '}
              / 10
            </p>
          </div>
          <div className="mt-auto flex gap-2 self-end">
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-neutral-100 bg-neutral-100 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0"
              href={`https://www.imdb.com/title/${movie.imdb_id}`}
              target="_blank"
            >
              <svg fill="#000000" viewBox="0 0 32 32">
                <g strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <g>
                    {' '}
                    <path d="M8.4,21.1H5.9V9.9h3.8l0.7,4.7h0.1L11,9.9h3.8v11.2h-2.5v-6.7h-0.1l-0.9,6.7H9.4l-1-6.7h0L8.4,21.1L8.4,21.1z"></path>{' '}
                    <path d="M15.8,9.8c0.4,0,3.2-0.1,4.7,0.1c1.2,0.1,1.8,1.1,1.9,2.3c0.1,2.2,0.1,4.4,0.1,6.6c0,0.2,0,0.5-0.1,0.8 c-0.2,0.9-0.7,1.4-1.9,1.5c-1.5,0.1-3,0.1-4.4,0.1c0,0-0.1,0-0.2,0V9.8z M18.8,11.9v7.2c0.5,0,0.8-0.2,0.8-0.7c0-1.9,0-3.9,0-5.9 C19.6,12,19.4,11.8,18.8,11.9z"></path>{' '}
                    <path d="M2,21.1V9.9h2.9v11.2H2z"></path>{' '}
                    <path d="M29.9,14.1c-0.1-0.8-0.6-1.2-1.4-1.4c-0.8-0.1-1.6,0-2.3,0.7V9.9h-2.8v11.2H26c0.1-0.2,0.1-0.4,0.2-0.5c0,0,0,0,0.1,0 c0.1,0.1,0.2,0.2,0.3,0.3c0.7,0.5,1.5,0.6,2.3,0.3c0.7-0.3,1-0.9,1-1.6c0-0.8,0.1-1.7,0.1-2.6C30,16,30,15,29.9,14.1L29.9,14.1z M27.1,19.1c0,0.2-0.2,0.4-0.4,0.4s-0.4-0.2-0.4-0.4v-4.3c0-0.2,0.2-0.4,0.4-0.4s0.4,0.2,0.4,0.4V19.1z"></path>{' '}
                  </g>{' '}
                </g>
              </svg>
            </Link>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                setModal({
                  action: 'EDIT_MOVIE_RATING',
                  data: { movie },
                })
              }
              className={`flex h-[48px] w-[48px] cursor-pointer items-center justify-center self-end rounded-full border-2 border-amber-500 transition-all duration-100 hover:border-amber-700 focus:border-black focus:ring-0 focus:outline-0 ${movie.rating ? 'bg-amber-500' : 'bg-white'}`}
            >
              <Star
                fill="white"
                stroke={
                  movie.rating ? 'white' : 'oklch(76.9% 0.188 70.08)'
                }
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ScrollYCard;
