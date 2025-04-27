'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { X } from 'lucide-react';
import SearchCard from '@/components/SearchCard';
import useMovieSearch from '@/hooks/useMovieSearch';
import { getData, postData, putData } from '@/helpers';

function AddMovieModal({ showModal, setShowModal, myMovies, setMyMovies }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function handleAdd(selectedMovies) {
    setIsSubmitting(true);

    const { rows: movies } = await postData('/api/movies', {
      selectedMovies: Object.values(selectedMovies),
    });

    const { rows: userAddedMovies } = await postData('/api/user-added-movies', {
      movies,
    });

    const _myMovies = { ...myMovies };

    userAddedMovies.forEach(movie => (
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
      }
    ));

    setMyMovies(_myMovies);

    setIsSubmitting(false);

    setShowModal(false);
  }

  return (
    <Modal
      disabled={isSubmitting}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h1 className="text-center">Add Movie</h1>

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
              disabled={isSearchingMovies}
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
          disabled={isSubmitting || Object.keys(selectedMovies).length === 0}
          handleClick={async () => await handleAdd(selectedMovies)}
          color="sky"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default AddMovieModal;
