'use client';
import { useContext, useState } from 'react';
import Modal from '@/components/Modal';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { X } from 'lucide-react';
import SearchCard from '@/components/SearchCard';
import useMovieSearch from '@/hooks/useMovieSearch';
import Loading from '@/components/Loading';
import Button from '@/components/Button';

function AddMovieModal({ show, disabled, handleSubmit }) {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle, page, setPage, movies, fetchingMovies] =
    useMovieSearch();
  const [selectedMovies, setSelectedMovies] = useState({});

  return (
    <Modal
      show={show}
      handleReset={() => {
        setSelectedMovies({});
        setTitle('');
        setPage(1);
      }}
      disabled={disabled}
    >
      <h1 className="text-center">Add Movie</h1>

      <div className="flex flex-col gap-4">
        <label>Search and Add Movies by Title</label>
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={title}
            onInput={(event) => setTitle(event.currentTarget.value)}
            className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
          />
          <Button
            handleClick={async () => {
              setTitle('');
            }}
            disabled={title.length === 0}
            color="rose"
            rounded={true}
          >
            <X />
          </Button>
        </div>

        {Object.values(selectedMovies).length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border-2 border-dotted border-black p-2">
            {Object.values(selectedMovies).map((movie, index) => (
              <div
                key={index}
                className="flex w-full items-center gap-2 rounded-full bg-neutral-100 px-4 py-2"
              >
                <p className="w-full">{movie.title}</p>
                <Button
                  handleClick={() => {
                    const _selectedMovies = { ...selectedMovies };
                    delete _selectedMovies[movie.imdb_id];
                    setSelectedMovies(_selectedMovies);
                  }}
                  color="rose"
                  rounded={true}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
        )}
        {movies.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {movies.map((movie, index) => (
              <SearchCard
                key={index}
                movie={movie}
                disabled={selectedMovies[movie.imdb_id]}
                handleSelect={() => {
                  if (!selectedMovies[movie.imdb_id]) {
                    const _selectedMovies = { ...selectedMovies };
                    _selectedMovies[movie.imdb_id] = movie;
                    setSelectedMovies(_selectedMovies);
                  }
                }}
              />
            ))}
          </div>
        )}
        {fetchingMovies && <Loading />}

        {!fetchingMovies && movies.length > 0 && (
          <Button
            handleClick={() => setPage(page + 1)}
            disabled={fetchingMovies}
            color="neutral"
          >
            Show More
          </Button>
        )}
      </div>
      <div className="flex gap-4 self-end">
        <Button
          disabled={disabled}
          handleClick={() => {
            setSelectedMovies({});
            setTitle('');
            setPage(1);
            setModal({ action: '', data: null });
          }}
          color="neutral"
        >
          Cancel
        </Button>
        <Button
          disabled={disabled || Object.keys(selectedMovies).length === 0}
          handleClick={async () => {
            await handleSubmit(selectedMovies);
            setSelectedMovies({});
            setTitle('');
            setPage(1);
          }}
          color="sky"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default AddMovieModal;
