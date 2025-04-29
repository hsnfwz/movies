'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { getData, postData, putData } from '@/helpers';
import SearchCard from '@/components/SearchCard';
import { Check, X } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0';
import useMovieSearch from '@/hooks/useMovieSearch';
import Modal from '@/components/Modal';
import useUserSearch from '@/hooks/useUserSearch';
import SearchCardUser from '../SearchCardUser';

function EditListModal({
  list,
  setList,
  showModal,
  setShowModal,
  myMovies,
  setMyMovies,
}) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(list.name);
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [selectedMovies, setSelectedMovies] = useState({});

  const {
    searchUsername,
    setSearchUsername,
    searchUsers,
    setSearchUsers,
    isSearchingUsers,
    setIsSearchingUsers,
  } = useUserSearch();

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

  async function handleEdit(name, selectedUsers, selectedMovies) {
    setIsSubmitting(true);

    const { rows: userAddedLists } = await putData(
      `/api/user-added-lists/${list.id}`,
      {
        name,
      }
    );

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

      console.log(userAddedMovies);

      if (myMovies) {
        const _myMovies = { ...myMovies };
        userAddedMovies.forEach((movie) => {
          _myMovies[movie.movie_id] = {
            movie_id: movie.movie_id,
            imdb_id: movie.imdb_id,
            tmdb_id: movie.tmdb_id,
            poster_path: movie.poster_path,
            title: movie.title,
            year: movie.year,
            users: {
              [movie.user_added_movie_auth0_user_id]: {
                user_added_movie_id: movie.user_added_movie_id,
                user_added_movie_rating: movie.user_added_movie_rating,
                user_added_movie_auth0_user_id:
                  movie.user_added_movie_auth0_user_id,
              },
            },
          };
        });
        setMyMovies(_myMovies);
      }

      postData('/api/user-added-list-has-movies', {
        userAddedListId: list.id,
        userAddedMovies,
      });
    }

    setList(userAddedLists[0]);

    if (Object.keys(selectedUsers).length > 0) {
      await postData('/api/invites', {
        userAddedListId: list.id,
        selectedUsers: Object.values(selectedUsers),
      });
    }

    setIsSubmitting(false);

    setShowModal(false);
  }

  return (
    <Modal setShowModal={setShowModal} disabled={isSubmitting}>
      <h1 className="text-center">Edit List</h1>
      <div className="flex flex-col gap-2">
        <label className="text-xs">* Name</label>
        <input
          type="text"
          value={name}
          onInput={(event) => setName(event.currentTarget.value)}
          className="flex h-[48px] rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs">Search and Add Users By Username</label>
        <input
          autoComplete="off"
          type="text"
          value={searchUsername}
          onInput={(event) => setSearchUsername(event.currentTarget.value)}
          className={`flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0`}
        />
        {Object.values(selectedUsers).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.values(selectedUsers).map((selectedUser, index) => (
              <Button
                key={index}
                handleClick={() => {
                  const _selectedUsers = { ...selectedUsers };
                  delete _selectedUsers[selectedUser.user_id];
                  setSelectedUsers(_selectedUsers);
                }}
                color="sky"
                className="gap-2 self-start"
              >
                <X />
                <span>{selectedUser.username}</span>
              </Button>
            ))}
          </div>
        )}
        {searchUsers && searchUsers.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {searchUsers.map((searchUser, index) => (
              <SearchCardUser
                key={index}
                user={searchUser}
                disabled={
                  selectedUsers[searchUser.user_id] ||
                  searchUser.user_id === user.sub
                }
                handleSelect={() => {
                  if (!selectedUsers[searchUser.user_id]) {
                    const _selectedUsers = { ...selectedUsers };
                    _selectedUsers[searchUser.user_id] = searchUser;
                    setSelectedUsers(_selectedUsers);
                  }
                }}
              />
            ))}
          </div>
        )}
        {isSearchingUsers && <Loading />}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs">Search and Add Movies by Title</label>
        <input
          autoComplete="off"
          type="text"
          value={searchTitle}
          onInput={(event) => setSearchTitle(event.currentTarget.value)}
          className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
        />
        {Object.values(selectedMovies).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.values(selectedMovies).map((movie, index) => (
              <Button
                key={index}
                handleClick={() => {
                  const _selectedMovies = { ...selectedMovies };
                  delete _selectedMovies[movie.imdb_id];
                  setSelectedMovies(_selectedMovies);
                }}
                color="sky"
                className="gap-2 self-start"
              >
                <X />
                <span>{movie.title}</span>
              </Button>
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
      <div className="flex gap-2 self-end">
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
            await handleEdit(name, selectedUsers, selectedMovies)
          }
          color="sky"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default EditListModal;
