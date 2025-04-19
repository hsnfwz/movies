'use client';
import { useContext, useState } from 'react';
import useMovieSearch from '@/hooks/useMovieSearch';
import useUserSearch from '@/hooks/useUserSearch';
import Modal from '@/components/Modal';
import { ModalContext } from '@/contexts/ModalContextProvider';

function AddEditModal({
  handleSubmit,
  show,
  disabled,
  list,
  moviesRef,
  usersRef,
}) {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle, page, setPage, movies, fetchingMovies] =
    useMovieSearch();
  const [email, setEmail, users, fetchingUsers] = useUserSearch();

  const [listName, setListName] = useState('');
  const [listUsers, setListUsers] = useState({});
  const [listMovies, setListMovies] = useState({});

  return (
    <Modal
      show={show}
      handleReset={() => {
        setListName('');
        setListUsers({});
        setListMovies({});
        setTitle('');
        setPage(1);
      }}
      disabled={disabled}
    >
      <h1 className="text-center">
        {modal === 'ADD_LIST' ? 'Add' : 'Edit'} List
      </h1>
      <div className="flex flex-col gap-2">
        <label>*Name</label>
        <input
          type="text"
          value={listName}
          onInput={(event) => setListName(event.currentTarget.value)}
          className="flex rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Search User Email to Add to List</label>
        <input
          type="text"
          value={email}
          onInput={(event) => setEmail(event.currentTarget.value)}
          className="flex rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>*Search Movie Title to Add to List</label>
        <input
          type="text"
          value={title}
          onInput={(event) => setTitle(event.currentTarget.value)}
          className="flex rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
        {Object.values(listMovies).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.values(listMovies).map((movie, index) => (
              <button
                key={index}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const _listMovies = { ...listMovies };
                  delete _listMovies[movie.imdb_id];
                  setListMovies(_listMovies);
                }}
                className="cursor-pointer rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
              >
                {movie.title}
              </button>
            ))}
          </div>
        )}
        {movies.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {movies.map((movie, index) => (
              <button
                key={index}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (!listMovies[movie.imdbID]) {
                    const _listMovies = { ...listMovies };
                    _listMovies[movie.imdbID] = {
                      title: movie.Title,
                      poster: movie.Poster,
                      imdb_id: movie.imdbID,
                    };
                    setListMovies(_listMovies);
                  }
                }}
                className="group flex cursor-pointer flex-col gap-2 focus:ring-0 focus:outline-0"
              >
                <img
                  id={`img-${index}`}
                  src={movie.Poster}
                  alt={movie.Title}
                  className={`w-full rounded-3xl border-2 p-2 transition-all duration-200 group-hover:border-sky-500 group-focus:border-black group-focus:ring-0 group-focus:outline-0 ${listMovies[movie.imdbID] ? 'border-dotted border-sky-500 bg-sky-300' : 'border-transparent'}`}
                  onError={() => {
                    const imageElement = document.getElementById(
                      `img-${index}`
                    );
                    imageElement.onerror = null;
                    imageElement.src = `https://placehold.co/200/000000/FFFFFF/svg?text=${movie.Title}&font=montserrat/`;
                  }}
                />
                {movie.Title}
              </button>
            ))}
          </div>
        )}
        {movies.length > 0 && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setPage(page + 1)}
            className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
            disabled={fetchingMovies}
          >
            {!fetchingMovies && 'Show More'}
            {fetchingMovies && 'Loading...'}
          </button>
        )}
      </div>
      <div className="flex gap-4 self-end">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setListName('');
            setListUsers({});
            setListMovies({});
            setTitle('');
            setPage(1);
            setModal('');
          }}
          className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={
            listName.length === 0 ||
            Object.values(listMovies).length === 0 ||
            disabled
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={async () => {
            await handleSubmit(listName, listUsers, listMovies);
            setListName('');
            setListUsers({});
            setListMovies({});
            setTitle('');
            setPage(1);
          }}
          className="cursor-pointer rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default AddEditModal;
