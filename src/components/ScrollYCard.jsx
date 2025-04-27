'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Info, Star } from 'lucide-react';
import Button from '@/components/Button';
import { useUser } from '@auth0/nextjs-auth0';
import { usePathname } from 'next/navigation';

function ScrollYCard({
  movie,
  setShowEditMovieModal,
  setShowMovieDetailsModal,
  setSelectedMovie,
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const [overallRating, setOverallRating] = useState(-1);
  const [overallRatingCount, setOverallRatingCount] = useState(-1);

  useEffect(() => {
    if (overallRating !== -1) setOverallRating(-1);
    if (overallRatingCount !== -1) setOverallRatingCount(-1);

    let i = 0;
    let count = 0;
    let sum = 0;
    const values = Object.values(movie.users);
    while (i < values.length) {
      const value = values[i];

      if (value.user_added_movie_rating) {
        count = count + 1;
        sum = sum + +value.user_added_movie_rating;
      }

      i++;
    }

    if (count > 0) {
      const average = +(sum / count).toFixed(1);
      setOverallRating(average);
    }
    setOverallRatingCount(count);
  }, [movie]);

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
      {!loadingImage && (
        <>
          <div className="flex flex-col gap-4 rounded-xl bg-neutral-100 p-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-bold">{movie.title}</h2>
              <p>{movie.year}</p>
              {movie.imdb_id && (
                <div className="flex flex-wrap gap-2">
                  <Link
                    onMouseDown={(event) => event.preventDefault()}
                    className="inline self-start underline hover:text-sky-500 focus:text-sky-500 focus:ring-0 focus:outline-0"
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                  >
                    IMDb
                  </Link>
                  &#183;
                  <Link
                    onMouseDown={(event) => event.preventDefault()}
                    className="inline self-start underline hover:text-sky-500 focus:text-sky-500 focus:ring-0 focus:outline-0"
                    href={`https://letterboxd.com/imdb/${movie.imdb_id}`}
                    target="_blank"
                  >
                    Letterboxd
                  </Link>
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-4 md:flex-row">
              <div className="flex flex-col gap-2 text-amber-500">
                <p className="text-2xl font-bold">
                  {movie.users[user.sub] &&
                  movie.users[user.sub].user_added_movie_rating
                    ? movie.users[user.sub].user_added_movie_rating
                    : '-'}
                </p>
                <p>My Rating</p>
              </div>
              {pathname.includes('lists') && (
                <div className="flex flex-col gap-2">
                  <p className="text-2xl font-bold">
                    {overallRating !== -1 ? overallRating : '-'}
                  </p>
                  <p>Overall ({overallRatingCount})</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end gap-2">
            <Button
              handleClick={() => {
                setSelectedMovie(movie);
                setShowMovieDetailsModal(true);
              }}
              color="neutral"
              rounded={true}
            >
              <Info />
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
        </>
      )}
    </div>
  );
}

export default ScrollYCard;
