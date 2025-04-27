'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { getData, postData, putData } from '@/helpers';
import { useUser } from '@auth0/nextjs-auth0';

function EditMovieRatingModal({
  showModal,
  setShowModal,
  selectedMovie,
  setSelectedMovie,
  myMovies, setMyMovies
}) {
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState(selectedMovie.users[user.sub] ? selectedMovie.users[user.sub].user_added_movie_rating : null);
  const numbers = Array.from({ length: 101 }, (_, i) =>
    parseFloat((i * 0.1).toFixed(1))
  ).reverse();

  async function handleEdit() {
    setIsSubmitting(true);

    let response;

    if (selectedMovie.users[user.sub]) {
      response = await putData(
        `/api/user-added-movies/${selectedMovie.users[user.sub].user_added_movie_id}`,
        { rating }
      );
    } else {
      response = await postData(
        `/api/user-added-movies`,
        {
          movies: [{
            id: selectedMovie.movie_id,
            rating,
          }]
        }
      );
    }

    const { rows: userAddedMovies } = response;

    const _myMovies = {
      ...myMovies,
      [selectedMovie.movie_id]: {
        ...selectedMovie,
        users: {
          ...selectedMovie.users,
          [user.sub]: {
            user_added_movie_auth0_user_id: user.sub,
            user_added_movie_id: userAddedMovies[0].user_added_movie_id,
            user_added_movie_rating: userAddedMovies[0].user_added_movie_rating,
          }
        }
      }
    };

    setMyMovies(_myMovies);

    setIsSubmitting(false);

    setShowModal(false);
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      disabled={isSubmitting}
    >
      <h1 className="text-center">Edit Rating</h1>
      <h2 className="text-center">{selectedMovie.title}</h2>
      <div className="flex w-full flex-col gap-4">
        {numbers.map((number, index) => (
          <Button
            key={index}
            disabled={rating == number}
            handleClick={() => setRating(number)}
            active={rating == number}
            color="neutral"
            activeColor="amber"
          >
            {number}
          </Button>
        ))}
      </div>
      <div className="flex gap-4 self-end">
        <Button
          disabled={isSubmitting}
          handleClick={() => setShowModal(false)}
          color="neutral"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting || !rating || (selectedMovie.users[user.sub] && selectedMovie.users[user.sub].user_added_movie_rating === rating)}
          handleClick={async () => await handleEdit(rating)}
          color="sky"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default EditMovieRatingModal;
