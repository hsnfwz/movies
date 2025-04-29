'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '../Modal';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';

function MovieDetailsModal({
  listUsers,
  showModal,
  setShowModal,
  selectedMovie,
}) {
  const { user } = useUser();
  const pathname = usePathname();

  const [overallRating, setOverallRating] = useState(-1);
  const [overallRatingCount, setOverallRatingCount] = useState(-1);

  useEffect(() => {
    if (overallRating !== -1) setOverallRating(-1);
    if (overallRatingCount !== -1) setOverallRatingCount(-1);

    let i = 0;
    let count = 0;
    let sum = 0;
    const values = Object.values(selectedMovie.users);
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
  }, [selectedMovie]);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <h1 className="text-center">
        {selectedMovie.title}{' '}
        {selectedMovie.year && (
          <span className="font-montserrat font-normal">
            ({selectedMovie.year})
          </span>
        )}
      </h1>
      <div className="flex flex-col gap-4 rounded-xl bg-neutral-100 p-4">
        {selectedMovie.imdb_id && (
          <div className="flex flex-wrap gap-2">
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className="inline self-start rounded-full bg-sky-500 px-4 py-2 text-white focus:ring-0 focus:outline-0"
              href={`https://www.imdb.com/title/${selectedMovie.imdb_id}`}
              target="_blank"
            >
              IMDb
            </Link>
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className="inline self-start rounded-full bg-sky-500 px-4 py-2 text-white focus:ring-0 focus:outline-0"
              href={`https://letterboxd.com/imdb/${selectedMovie.imdb_id}`}
              target="_blank"
            >
              Letterboxd
            </Link>
          </div>
        )}

        <div className="flex w-full flex-row justify-around md:justify-start gap-4 rounded-xl bg-white p-4 text-center">
          <div className="flex flex-col gap-2 text-amber-500">
            <p className="flex aspect-square h-[64px] w-[64px] items-center justify-center self-center rounded-full border-2 border-amber-500 text-center align-middle text-2xl font-bold text-amber-500">
              {selectedMovie.users[user.sub] &&
              selectedMovie.users[user.sub].user_added_movie_rating
                ? selectedMovie.users[user.sub].user_added_movie_rating
                : '-'}
            </p>
            <p>My Rating</p>
          </div>
          {pathname.includes('lists') && (
            <div className="flex flex-col gap-2">
              <p className="flex aspect-square h-[64px] w-[64px] items-center justify-center self-center rounded-full border-2 border-black text-center align-middle text-2xl font-bold">
                {overallRating !== -1 ? overallRating : '-'}
              </p>
              <p>Overall ({overallRatingCount})</p>
            </div>
          )}
        </div>
        {listUsers && (
          <div className="flex w-full flex-col gap-4">
          {Object.values(selectedMovie.users).map((value, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 rounded-xl bg-white p-4 ${user.sub === value.user_added_movie_auth0_user_id ? 'text-amber-500' : 'text-black'}`}
            >
              <p className="text-center align-middle">
                <span className="font-bold">{listUsers[value.user_added_movie_auth0_user_id].username}{' '}</span>
                <span className="text-base font-normal">
                  {value.user_added_movie_rating
                    ? 'rated this movie '
                    : 'did not rate this movie '}
                </span>{' '}
                <span className="font-bold">
                  {value.user_added_movie_rating
                    ? value.user_added_movie_rating
                    : '-'}
                </span>
              </p>
            </div>
          ))}
        </div>
        )}
        
      </div>
    </Modal>
  );
}

export default MovieDetailsModal;
