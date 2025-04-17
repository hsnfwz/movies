'use client';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import useMovieSearch from '@/hooks/useMovieSearch';
import useUserSearch from '@/hooks/useUserSearch';
import { ModalContext } from '@/contexts/ModalContextProvider';
import Modal from '@/components/Modal';

function Home() {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle, page, setPage, movies, fetchingMovies] = useMovieSearch();
  const [email, setEmail, users, fetchingUsers] = useUserSearch();

  const [listName, setListName] = useState('');
  const [listUsers, setListUsers] = useState({});
  const [listMovies, setListMovies] = useState({});

  const [lists, setLists] = useState([]);
  const [fetchingLists, setFetchingLists] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/home/lists');
      const { lists, error } = await response.json();
      if (error) console.log(error);
      setLists(lists);
      setFetchingLists(false);
    }

    fetchData();
  }, []);

  async function handleSubmit() {
    setSubmitting(true);

    const response = await fetch('/home/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listName,
        listUsers,
        listMovies,
      })
    });

    const { list, error } = await response.json();

    if (error) console.log(error);

    const _lists = [...lists];
    _lists.push(list);
    setLists(_lists);
    reset();
    setSubmitting(false);
    setModal({ type: null });
  }

  async function reset() {
    setTitle('');
    setPage(1);
    setListName('');
    setListUsers({});
    setListMovies({});
  }

  // TODO: limit number of movies and users that can be added at a given time to avoid reaching vercel function time limits (ex: 5 per submit)

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
      <Link
        onMouseDown={(event) => event.preventDefault()}
        className="absolute top-4 right-4 flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-neutral-100 bg-neutral-100 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0"
        href="/"
      >
        H
      </Link>
      {fetchingLists && <span>Loading...</span>}
      {(!fetchingLists && lists.length === 0) && (
        <>
          <h1>You do not have any lists yet</h1>
          <p>Let's get you started by creating your first list!</p>
        </>
      )}
      {(!fetchingLists && lists.length > 0) && (
        <>
          <h1>Your Lists</h1>
          {lists.map((list, index) => (
            <Link key={index} href={`/lists/${list.id}`} className="block rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0">{list.name}</Link>
          ))}
        </>
      )}
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setModal({ type: 'ADD_LIST' })}
        className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
      >
        <Plus />
      </button>
      <Modal
        show={modal && modal.type === 'ADD_LIST'}
        handleReset={reset}
        disabled={submitting}
      >
        <h1 className="text-center">Create List</h1>
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
                  className="group cursor-pointer focus:ring-0 focus:outline-0 flex flex-col gap-2"
                >
                  <img
                    id={`img-${index}`}
                    src={movie.Poster}
                    alt={movie.Title}
                    className={`w-full rounded-3xl border-2 p-2 transition-all duration-200 group-hover:border-sky-500 group-focus:border-black group-focus:ring-0 group-focus:outline-0 ${listMovies[movie.imdbID] ? 'border-dotted border-sky-500 bg-sky-300' : 'border-transparent'}`}
                    onError={() => {
                      const imageElement = document.getElementById(`img-${index}`);
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
              className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:opacity-50 disabled:pointer-events-none"
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
            disabled={submitting}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              handleCancel();
              setModal({ type: null });
            }}
            className="cursor-pointer rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={listName.length === 0 || Object.values(listMovies).length === 0 || submitting}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleSubmit}
            className="cursor-pointer rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
