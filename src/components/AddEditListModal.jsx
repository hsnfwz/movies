'use client';
import { useContext, useEffect, useState } from 'react';
import useMovieSearch from '@/hooks/useMovieSearch';
import useUserSearch from '@/hooks/useUserSearch';
import Modal from '@/components/Modal';
import { ModalContext } from '@/contexts/ModalContextProvider';
import SearchCard from './SearchCard';
import Loading from './Loading';

function AddEditListModal({ handleSubmit, show, disabled }) {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle, page, setPage, movies, fetchingMovies] =
    useMovieSearch();
  const [email, setEmail, users, fetchingUsers] = useUserSearch();

  const [listName, setListName] = useState('');
  const [listUsers, setListUsers] = useState({});
  const [listMovies, setListMovies] = useState({});

  useEffect(() => {
    if (modal.data && modal.data.list) {
      setListName(modal.data.list.name);
    }
  }, [modal]);

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
        {modal.data && modal.data.list ? 'Edit List' : 'Add List'}
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
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {movies.map((movie, index) => (
              <SearchCard
                key={index}
                movie={movie}
                listMovies={listMovies}
                setListMovies={setListMovies}
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
            className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
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
            setListName('');
            setListUsers({});
            setListMovies({});
            setTitle('');
            setPage(1);
            setModal({ action: '', data: null });
          }}
          className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={
            listName.length === 0 ||
            (modal.action === 'ADD_LIST' &&
              Object.values(listMovies).length === 0) ||
            (modal.data.list &&
              modal.data.list.name === listName &&
              Object.values(listMovies).length === 0) ||
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

export default AddEditListModal;
