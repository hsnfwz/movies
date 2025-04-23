'use client';
import { useContext, useState } from "react";
import Modal from '@/components/Modal';
import { ModalContext } from "@/contexts/ModalContextProvider";
import { X } from "lucide-react";
import SearchCard from '@/components/SearchCard';
import useMovieSearch from "@/hooks/useMovieSearch";
import Loading from "@/components/Loading";

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
      <h1 className="text-center">
        Add Movie
      </h1>
      
      <div className="flex flex-col gap-4">
        <label>* Search and Add Movie(s) by Title</label>
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={title}
            onInput={(event) => setTitle(event.currentTarget.value)}
            className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={async () => {
              setTitle('');
            }}
            className={`flex aspect-square w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-rose-500 bg-rose-500 text-white transition-all duration-100 hover:border-rose-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50`}
            disabled={title.length === 0}
          >
            <X />
          </button>
        </div>

        {Object.values(selectedMovies).length > 0 && (
          <div className="flex flex-wrap gap-2 border-2 border-black rounded-xl p-2 border-dotted">
            {Object.values(selectedMovies).map((movie, index) => (
              <div
                key={index}
                className="flex h-[48px] items-center gap-2 rounded-full bg-neutral-100 pr-2 pl-4"
              >
                <span>{movie.title}</span>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    const _selectedMovies = { ...selectedMovies };
                    delete _selectedMovies[movie.imdb_id];
                    setSelectedMovies(_selectedMovies);
                  }}
                  className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-neutral-200 text-black transition-all duration-100 hover:border-rose-500 hover:bg-rose-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0"
                >
                  <X />
                </button>
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
                disabled={selectedMovies[movie.imdbID]}
                handleSelect={() => {
                  if (!selectedMovies[movie.imdbID]) {
                    const _selectedMovies = { ...selectedMovies };
                    _selectedMovies[movie.imdbID] = {
                      title: movie.Title,
                      poster: movie.Poster,
                      imdb_id: movie.imdbID,
                    };
                    setSelectedMovies(_selectedMovies);
                  }
                }}
              />
            ))}
          </div>
        )}
        {fetchingMovies && <Loading />}

        {!fetchingMovies && movies.length > 0 && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setPage(page + 1)}
            className="h-[48px] cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
            disabled={fetchingMovies}
          >
            Show More
          </button>
        )}
      </div>
      <div className="flex gap-4 self-end">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setSelectedMovies({});
            setTitle('');
            setPage(1);
            setModal({ action: '', data: null });
          }}
          className="h-[48px] cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={
            disabled || Object.keys(selectedMovies).length === 0
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={async () => {
            await handleSubmit(selectedMovies);
            setSelectedMovies({});
            setTitle('');
            setPage(1);
          }}
          className="h-[48px] cursor-pointer rounded-full border-2 border-sky-500 bg-sky-500 px-4 text-white transition-all duration-100 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default AddMovieModal;
