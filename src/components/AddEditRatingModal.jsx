import { useState, useContext, useRef, useEffect } from 'react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import Modal from './Modal';

function AddEditRatingModal({ handleSubmit, show, disabled }) {
  const { modal, setModal } = useContext(ModalContext);
  const { movies } = useContext(DataContext);
  const [score, setScore] = useState(null);

  const numbers = Array.from({ length: 101 }, (_, i) =>
    parseFloat((i * 0.1).toFixed(1))
  ).reverse();

  useEffect(() => {
    if (modal.data && modal.data.rating) {
      setScore(+modal.data.rating.score);
    }
  }, [modal]);

  return (
    <Modal
      show={show}
      handleReset={() => {
        setScore(null);
      }}
      disabled={disabled}
    >
      <h1 className="text-center">
        {modal.data && modal.data.rating ? 'Edit Rating' : 'Add Rating'}
      </h1>
      {modal.data && modal.data.movie && (
        <h2 className="text-center">
          {movies[modal.data.movie.list_id][modal.data.movie.movie_id].title}
        </h2>
      )}
      <div className="flex h-[256px] w-full flex-col gap-4 overflow-y-scroll">
        {numbers.map((number, index) => (
          <button
            key={index}
            type="button"
            disabled={score === number}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setScore(number);
            }}
            className={`cursor-pointer rounded-full border-2 px-4 py-2 transition-all duration-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50 ${score === number ? 'pointer-events-none bg-amber-500 text-white' : 'border-neutral-100 bg-neutral-100 text-black hover:border-neutral-200'}`}
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
            setScore(null);
            setModal({ action: '', data: null });
          }}
          className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={disabled || !score || (modal.data.rating && modal.data.rating.score == score)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={async () => {
            await handleSubmit(score);
            setScore(null);
          }}
          className="cursor-pointer rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default AddEditRatingModal;
