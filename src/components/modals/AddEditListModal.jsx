'use client';
import { useContext, useEffect, useState } from 'react';
import useMovieSearch from '@/hooks/useMovieSearch';
import Modal from '@/components/Modal';
import { ModalContext } from '@/contexts/ModalContextProvider';
import SearchCard from '@/components/SearchCard';
import Loading from '@/components/Loading';
import { Check, X } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0';
import Button from '@/components/Button';


function AddEditListModal({ handleSubmit, show, disabled }) {
  const { user, isLoading } = useUser();
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle, page, setPage, movies, fetchingMovies] =
    useMovieSearch();

  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(null);
  const [listName, setListName] = useState('');
  const [listUsers, setListUsers] = useState({});
  const [listMovies, setListMovies] = useState({});

  useEffect(() => {
    if (emailMessage) {
      setEmailMessage(null);
    }
  }, [email]);

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
      <div className="flex flex-col gap-4">
        <label>* Name</label>
        <input
          type="text"
          value={listName}
          onInput={(event) => setListName(event.currentTarget.value)}
          className="flex h-[48px] rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
      </div>
      <div className="flex flex-col gap-4">
        <label className={`${emailMessage ? 'text-rose-500' : ''}`}>Search and Add User(s) By Email</label>
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={email}
            onInput={(event) => setEmail(event.currentTarget.value)}
            className={`flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0 ${emailMessage ? 'border-rose-500' : ''}`}
          />
          <Button
            handleClick={async () => {
              const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
              });

              const { users, error } = await response.json();

              if (error) console.log(error);

              if (!users[0]) {
                setEmailMessage(`A user with email ${email} was not found.`);
              } else if (users[0].email === user.email) {
                setEmailMessage('You are already in this list.');
              } else {
                const _listUsers = { ...listUsers };
                _listUsers[email] = { user_id: users[0].user_id, email: users[0].email };
                setListUsers(_listUsers);
                setEmail('');
              }
            }}
            disabled={email.length === 0}
            color="sky"
            rounded={true}
          >
            <Check />
          </Button>
        </div>
        {emailMessage && (
          <p className="text-xs text-rose-500">{emailMessage}</p>
        )}
        {Object.values(listUsers).length > 0 && (
          <div className="flex gap-2 border-2 border-black rounded-xl p-2 border-dotted">
            {Object.values(listUsers).map((listUser, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full bg-neutral-100 w-full px-4 py-2"
              >
                <p className="w-full">{listUser.email}</p>
                <Button
                  handleClick={() => {
                    const _listUsers = { ...listUsers };
                    delete _listUsers[listUser.email];
                    setListUsers(_listUsers);
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
      </div>
      <div className="flex flex-col gap-4">
        <label>* Search and Add Movie(s) by Title</label>
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

        {Object.values(listMovies).length > 0 && (
          <div className="flex gap-2 border-2 border-black rounded-xl p-2 border-dotted">
            {Object.values(listMovies).map((movie, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full bg-neutral-100 w-full px-4 py-2"
              >
                <p className="w-full">{movie.title}</p>
                <Button
                  handleClick={() => {
                    const _listMovies = { ...listMovies };
                    delete _listMovies[movie.imdb_id];
                    setListMovies(_listMovies);
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
                disabled={listMovies[movie.imdbID]}
                handleSelect={() => {
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
            setListName('');
            setListUsers({});
            setListMovies({});
            setTitle('');
            setPage(1);
            setModal({ action: '', data: null });
          }}
          color="neutral"
        >
          Cancel
        </Button>
        <Button
          disabled={
            listName.length === 0 ||
            disabled
          }
          handleClick={async () => {
            await handleSubmit(listName, listUsers, listMovies);
            setListName('');
            setListUsers({});
            setListMovies({});
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

export default AddEditListModal;
