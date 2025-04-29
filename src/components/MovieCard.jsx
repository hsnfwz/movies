'use client';
import { useState } from 'react';
import { Ellipsis, Star } from 'lucide-react';
import Button from '@/components/Button';
import { useUser } from '@auth0/nextjs-auth0';

function MovieCard({
  movie,
  setShowEditMovieModal,
  setShowMovieDetailsModal,
  setSelectedMovie,
}) {
  const { user } = useUser();

  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <div
      id={`movie-${movie.movie_id}`}
      className="flex w-full flex-col gap-4 transition-all duration-100"
    >
      <img
        id={`img-${movie.movie_id}`}
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`
        }
        alt={movie.title}
        className={`w-full rounded-xl ${loadingImage ? 'hidden' : 'visible'}`}
        // onError={() => {
        //   const imageElement = document.getElementById(`img-${movie.movie_id}`);
        //   imageElement.onerror = null;
        //   imageElement.src = `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.title}&font=montserrat/`;
        // }}
        onLoad={() => setLoadingImage(false)}
      />
      <div
        className={`aspect-[2/3] w-full animate-pulse rounded-xl bg-neutral-100 ${loadingImage ? 'visible' : 'hidden'}`}
      ></div>
      <div className="flex w-full justify-end gap-2">
        <Button
          handleClick={() => {
            setSelectedMovie(movie);
            setShowMovieDetailsModal(true);
          }}
          color="neutral"
          rounded={true}
        >
          <Ellipsis />
        </Button>
        <Button
          handleClick={() => {
            setSelectedMovie(movie);
            setShowEditMovieModal(true);
          }}
          color="amber"
          active={
            movie.users[user.sub] &&
            movie.users[user.sub].user_added_movie_rating
          }
          activeColor="amber"
          rounded={true}
        >
          <Star
            fill="white"
            stroke={
              movie.users[user.sub] &&
              movie.users[user.sub].user_added_movie_rating
                ? 'white'
                : 'oklch(76.9% 0.188 70.08)'
            }
          />
        </Button>
      </div>
    </div>
  );
}

export default MovieCard;
