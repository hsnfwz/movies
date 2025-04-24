import { useState, useContext, useRef, useEffect } from 'react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

function EditMovieRatingModal({ handleSubmit, show, disabled }) {
  const { modal, setModal } = useContext(ModalContext);
  const { movies } = useContext(DataContext);
  const [rating, setRating] = useState(null);

  const numbers = Array.from({ length: 101 }, (_, i) =>
    parseFloat((i * 0.1).toFixed(1))
  ).reverse();

  useEffect(() => {
    if (modal.data && modal.data.movie) {
      setRating(modal.data.movie.rating);
    }
  }, [modal]);

  return (
    <Modal
      show={show}
      handleReset={() => {
        setRating(null);
      }}
      disabled={disabled}
    >
      {modal.data && modal.data.movie && (
        <h1 className="text-center">Edit Rating</h1>
      )}

      {modal.data && modal.data.movie && (
        <h2 className="text-center">{movies[modal.data.movie.id].title}</h2>
      )}
      <div className="flex w-full flex-col gap-4">
        {numbers.map((number, index) => (
          <Button
            key={index}
            disabled={rating === number}
            handleClick={() => {
              setRating(number);
            }}
            active={rating === number}
            color="neutral"
            activeColor="amber"
          >
            {number}
          </Button>
        ))}
      </div>
      <div className="flex gap-4 self-end">
        <Button
          disabled={disabled}
          handleClick={() => {
            setRating(null);
            setModal({ action: '', data: null });
          }}
          color="neutral"
        >
          Cancel
        </Button>
        <Button
          disabled={
            disabled ||
            !rating ||
            (modal.data.movie && modal.data.movie.rating === rating)
          }
          handleClick={async () => {
            await handleSubmit(rating);
            setRating(null);
          }}
          color="sky"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default EditMovieRatingModal;
