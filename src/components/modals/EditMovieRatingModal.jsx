'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { getData, postData, putData } from '@/helpers';
import { useUser } from '@auth0/nextjs-auth0';
import Slider from '../Slider';

function EditMovieRatingModal({
  showModal,
  setShowModal,
  selectedMovie,
  setSelectedMovie,
  myMovies,
  setMyMovies,
}) {
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState(
    selectedMovie.users[user.sub] && selectedMovie.users[user.sub].user_added_movie_rating
      ? selectedMovie.users[user.sub].user_added_movie_rating
      : 10
  );
  async function handleEdit() {
    setIsSubmitting(true);

    let response;

    if (selectedMovie.users[user.sub]) {
      response = await putData(
        `/api/user-added-movies/${selectedMovie.users[user.sub].user_added_movie_id}`,
        { rating }
      );
    } else {
      response = await postData(`/api/user-added-movies`, {
        movies: [
          {
            id: selectedMovie.movie_id,
            rating,
          },
        ],
      });
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
          },
        },
      },
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
      <h1 className="text-center">{selectedMovie.title}</h1>
      <h3 className="font-bold text-amber-500 text-2xl w-[64px] h-[64px] text-center align-middle rounded-full border-2 border-amber-500 self-center aspect-square flex items-center justify-center">{rating}</h3>
      <Slider
        min={0}
        max={10}
        step={0.1}
        value={rating}
        handleInput={(event) => setRating(event.target.value)}
      />
      <div className="flex gap-2 self-end">
        <Button
          disabled={isSubmitting}
          handleClick={() => setShowModal(false)}
          color="neutral"
        >
          Cancel
        </Button>
        <Button
          disabled={
            isSubmitting ||
            !rating ||
            (selectedMovie.users[user.sub] &&
              selectedMovie.users[user.sub].user_added_movie_rating === rating)
          }
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
