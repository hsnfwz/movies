'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { getData, postData } from '@/helpers';
import SearchCard from '@/components/SearchCard';
import { Check, X } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0';
import useMovieSearch from '@/hooks/useMovieSearch';
import Modal from '@/components/Modal';

function AddListModal({ showModal, setShowModal, myLists, setMyLists }) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [selectedMovies, setSelectedMovies] = useState({});

  const {
    searchTitle,
    setSearchTitle,
    searchPage,
    setSearchPage,
    searchMovies,
    setSearchMovies,
    isSearchingMovies,
    setIsSearchingMovies,
    hasMoreSearchMovies,
    setHasMoreSearchMovies,
  } = useMovieSearch();

  useEffect(() => {
    if (emailMessage) {
      setEmailMessage(null);
    }
  }, [email]);

  async function handleAdd(name, selectedUsers, selectedMovies) {
    setIsSubmitting(true);

    const _myLists = { ...myLists };

    const { rows: userAddedLists } = await postData('/api/user-added-lists', {
      name,
    });

    _myLists[userAddedLists[0].id] = userAddedLists[0];

    if (Object.keys(selectedMovies).length > 0) {
      const { rows: movies } = await postData('/api/movies', {
        selectedMovies: Object.values(selectedMovies),
      });

      const { rows: userAddedMovies } = await postData(
        '/api/user-added-movies',
        {
          movies,
        }
      );
      
      postData('/api/user-added-list-has-movies', {
        userAddedListId: userAddedLists[0].id,
        userAddedMovies,
      });
    }

    setMyLists(_myLists);

    if (Object.keys(selectedUsers).length > 0) {
      await postData('/api/invites', {
        userAddedListId: userAddedLists[0].id,
        selectedUsers: Object.values(selectedUsers),
      });
    }

    setIsSubmitting(false);

    setShowModal(false);
  }

  return (
    <Modal setShowModal={setShowModal} disabled={isSubmitting}>
      <h1 className="text-center">{selectedList ? 'Edit List' : 'Add List'}</h1>
      <div className="flex flex-col gap-4">
        <label>* Name</label>
        <input
          type="text"
          value={name}
          onInput={(event) => setName(event.currentTarget.value)}
          className="flex h-[48px] rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
      </div>
      <div className="flex flex-col gap-4">
        <label className={`${emailMessage ? 'text-rose-500' : ''}`}>
          Search and Add Users By Email
        </label>
        <div className="flex w-full items-center gap-2">
          <input
            autoComplete="off"
            type="text"
            value={email}
            onInput={(event) => setEmail(event.currentTarget.value)}
            className={`flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0 ${emailMessage ? 'border-rose-500' : ''}`}
          />
          <Button
            handleClick={async () => {
              const response = await fetch(`/api/search/users?email=${email}`);

              const { users, error } = await response.json();

              if (error) console.error(error);

              if (!users[0]) {
                setEmailMessage(`A user with email ${email} was not found.`);
              } else if (users[0].email === user.email) {
                setEmailMessage('You are already in this list.');
              } else {
                const _selectedUsers = { ...selectedUsers };
                _selectedUsers[email] = {
                  user_id: users[0].user_id,
                  email: users[0].email,
                };
                setSelectedUsers(_selectedUsers);
                setEmail('');
              }
            }}
            disabled={email.length === 0}
            color="sky"
          >
            Apply
          </Button>
        </div>
        {emailMessage && (
          <p className="text-xs text-rose-500">{emailMessage}</p>
        )}
        {Object.values(selectedUsers).length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border-2 border-dotted border-black p-2">
            {Object.values(selectedUsers).map((listUser, index) => (
              <div
                key={index}
                className="flex w-full items-center gap-2 rounded-full bg-neutral-100 px-4 py-2"
              >
                <p className="w-full">{listUser.email}</p>
                <Button
                  handleClick={() => {
                    const _selectedUsers = { ...selectedUsers };
                    delete _selectedUsers[listUser.email];
                    setSelectedUsers(_selectedUsers);
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
        <label>Search and Add Movies by Title</label>
        <div className="flex w-full items-center gap-2">
          <input
            autoComplete="off"
            type="text"
            value={searchTitle}
            onInput={(event) => setSearchTitle(event.currentTarget.value)}
            className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
          />
          <Button
            handleClick={() => setSearchTitle('')}
            disabled={searchTitle.length === 0}
            color="rose"
          >
            Clear
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
        {searchMovies.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {searchMovies.map((movie, index) => (
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
        {isSearchingMovies && <Loading />}
        {!isSearchingMovies &&
          searchMovies.length > 0 &&
          hasMoreSearchMovies && (
            <Button
              handleClick={() => setSearchPage(searchPage + 1)}
              color="neutral"
            >
              Show More
            </Button>
          )}
      </div>
      <div className="flex gap-4 self-end">
        <Button
          disabled={isSubmitting}
          handleClick={() => setShowModal(false)}
          color="neutral"
        >
          Cancel
        </Button>
        <Button
          disabled={name.length === 0 || isSubmitting}
          handleClick={async () =>
            await handleAdd(name, selectedUsers, selectedMovies)
          }
          color="sky"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default AddListModal;
