'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { Plus } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import MovieCardGrid from '@/components/MovieCardGrid';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { getData, postData, putData } from '@/helpers';
import AddMovieModal from '@/components/modals/AddMovieModal';
import EditMovieRatingModal from '@/components/modals/EditMovieRatingModal';
import MovieDetailsModal from '@/components/modals/MovieDetailsModal';

function Movies() {
  const [myMovies, setMyMovies] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showEditMovieModal, setShowEditMovieModal] = useState(false);
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredMoviesTitle, setFilteredMoviesTitle] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const timerRef = useRef();

  function handleSearchFilteredMovies(event) {
    const _searchTitle = event.currentTarget.value;
    setFilteredMoviesTitle(_searchTitle);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (_searchTitle.length === 0) {
        const _filteredMovies = Object.values(myMovies).sort((m1, m2) => {
          if (m1.title < m2.title) {
            return -1;
          }
          if (m1.title > m2.title) {
            return 1;
          }
          return 0;
        });
        setFilteredMovies(_filteredMovies);
      } else {
        const _filteredMovies = Object.values(myMovies).filter((movie) =>
          movie.title.toLowerCase().includes(_searchTitle.trim().toLowerCase())
        );
        setFilteredMovies(_filteredMovies);
      }
    }, 500);
  }

  useEffect(() => {
    async function fetchData() {
      const { rows: userAddedMovies } = await getData('/api/user-added-movies');

      const _myMovies = {};

      userAddedMovies.forEach((movie) => {
        if (_myMovies[movie.movie_id]) {
          _myMovies[movie.movie_id].users[
            movie.user_added_movie_auth0_user_id
          ] = {
            user_added_movie_id: movie.user_added_movie_id,
            user_added_movie_rating: movie.user_added_movie_rating,
            user_added_movie_auth0_user_id:
              movie.user_added_movie_auth0_user_id,
          };
        } else {
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
        }
      });

      setMyMovies(_myMovies);

      const _filteredMovies = Object.values(_myMovies).sort((m1, m2) => {
        if (m1.title < m2.title) {
          return -1;
        }
        if (m1.title > m2.title) {
          return 1;
        }
        return 0;
      });
      setFilteredMovies(_filteredMovies);
      setIsFetching(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      const _filteredMovies = Object.values(myMovies).sort((m1, m2) => {
        if (m1.title < m2.title) {
          return -1;
        }
        if (m1.title > m2.title) {
          return 1;
        }
        return 0;
      });
      setFilteredMovies(_filteredMovies);
    }
  }, [isFetching, myMovies]);

  if (isFetching) {
    return <Loading />;
  }

  if (!isFetching) {
    return (
      <>
        {showMovieDetailsModal && (
          <MovieDetailsModal
            showModal={showMovieDetailsModal}
            setShowModal={setShowMovieDetailsModal}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
          />
        )}
        {showAddMovieModal && (
          <AddMovieModal
            showModal={showAddMovieModal}
            setShowModal={setShowAddMovieModal}
            myMovies={myMovies}
            setMyMovies={setMyMovies}
          />
        )}
        {showEditMovieModal && selectedMovie && (
          <EditMovieRatingModal
            showModal={showEditMovieModal}
            setShowModal={setShowEditMovieModal}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            myMovies={myMovies}
            setMyMovies={setMyMovies}
          />
        )}
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-4">
            <h1 className="w-full">
              {Object.keys(myMovies).length === 0
                ? 'You do not have any movies yet'
                : 'My Movies'}
            </h1>
            <Button
              handleClick={() => setShowAddMovieModal(true)}
              rounded={true}
              color="sky"
            >
              <Plus />
            </Button>
          </div>
          {Object.keys(myMovies).length === 0 && (
            <p>Let's get you started by adding your first movie!</p>
          )}
          {Object.keys(myMovies).length > 0 && (
            <>
              <input
                type="text"
                value={filteredMoviesTitle}
                placeholder="Search Movies"
                onInput={handleSearchFilteredMovies}
                className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black placeholder-neutral-400 transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
              />
              <MovieCardGrid>
                {filteredMovies.map((movie, index) => (
                  <MovieCard
                    key={index}
                    movie={movie}
                    setShowEditMovieModal={setShowEditMovieModal}
                    setShowMovieDetailsModal={setShowMovieDetailsModal}
                    setSelectedMovie={setSelectedMovie}
                  />
                ))}
              </MovieCardGrid>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Movies;
