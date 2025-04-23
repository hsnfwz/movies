import { useState, useContext, useRef, useEffect } from 'react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import Modal from '@/components/Modal';

function EditMovieRatingModal({ handleSubmit, show, disabled }) {
  const { modal, setModal } = useContext(ModalContext);
  const { moviesWithoutList } = useContext(DataContext);
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
        <h2 className="text-center">
          {moviesWithoutList[modal.data.movie.id].title}
        </h2>
      )}
      <div className="flex w-full flex-col gap-4">
        {numbers.map((number, index) => (
          <button
            key={index}
            type="button"
            disabled={rating === number}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setRating(number);
            }}
            className={`h-[48px] cursor-pointer rounded-full border-2 px-4 transition-all duration-100 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50 ${rating === number ? 'pointer-events-none bg-amber-500 text-white' : 'border-neutral-100 bg-neutral-100 text-black hover:border-neutral-200'}`}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="flex gap-4 self-end">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setRating(null);
            setModal({ action: '', data: null });
          }}
          className="h-[48px] cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={
            disabled ||
            !rating ||
            (modal.data.movie && modal.data.movie.rating === rating)
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={async () => {
            await handleSubmit(rating);
            setRating(null);
          }}
          className="h-[48px] cursor-pointer rounded-full border-2 border-sky-500 bg-sky-500 px-4 text-white transition-all duration-100 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default EditMovieRatingModal;
