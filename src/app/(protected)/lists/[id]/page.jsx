'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Pen } from 'lucide-react';
import MovieCardGrid from '@/components/MovieCardGrid';
import MovieCard from '@/components/MovieCard';
import Loading from '@/components/Loading';
import Message from '@/components/Message';
import Button from '@/components/Button';
import { useUser } from '@auth0/nextjs-auth0';
import { getData } from '@/helpers';
import EditListModal from '@/components/modals/EditListModal';
import EditMovieRatingModal from '@/components/modals/EditMovieRatingModal';
import MovieDetailsModal from '@/components/modals/MovieDetailsModal';

function List() {
  const { id } = useParams();
  const { user, isLoading } = useUser();
  const timerRef = useRef();
  const [isFetching, setIsFetching] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredMoviesTitle, setFilteredMoviesTitle] = useState('');
  const [list, setList] = useState(null);
  const [listMovies, setListMovies] = useState([]);
  const [showEditMovieModal, setShowEditMovieModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [listUsers, setListUsers] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { rows: userAddedLists } = await getData(
        `/api/user-added-lists/${id}`
      );

      if (userAddedLists[0]) {
        const { rows: userAddedMovies } = await getData(
          `/api/user-added-list-has-movies?userAddedListId=${userAddedLists[0].id}`
        );

        const _listMovies = {};

        userAddedMovies.forEach((movie) => {
          if (_listMovies[movie.movie_id]) {
            _listMovies[movie.movie_id].users[
              movie.user_added_movie_auth0_user_id
            ] = {
              user_added_movie_id: movie.user_added_movie_id,
              user_added_movie_rating: movie.user_added_movie_rating,
              user_added_movie_auth0_user_id:
                movie.user_added_movie_auth0_user_id,
            };
          } else {
            _listMovies[movie.movie_id] = {
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

        setListMovies(_listMovies);

        const { rows: userAddedListHasUsers } = await getData(
          `/api/user-added-list-has-users?userAddedListId=${id}`
        );

        let i = 0;
        const _listUsers = {};
        while (i < userAddedListHasUsers.length) {
          const userAddedListHasUser = userAddedListHasUsers[i];

          const data = await getData(
            `/api/search/users/${userAddedListHasUser.auth0_user_id}`
          );

          _listUsers[userAddedListHasUser.auth0_user_id] = data.rows[0];

          i++;
        }

        setListUsers(_listUsers);

        const _filteredMovies = Object.values(_listMovies).sort((m1, m2) => {
          if (m1.title < m2.title) {
            return -1;
          }
          if (m1.title > m2.title) {
            return 1;
          }
          return 0;
        });

        setFilteredMovies(_filteredMovies);

        setList(userAddedLists[0]);
      }

      setIsFetching(false);
    }

    if (!isLoading && user) fetchData();
  }, [isLoading, user]);

  useEffect(() => {
    if (!isFetching) {
      const _filteredMovies = Object.values(listMovies).sort((m1, m2) => {
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
  }, [isFetching, listMovies]);

  function handleSearchFilteredMovies(event) {
    const _searchTitle = event.currentTarget.value;
    setFilteredMoviesTitle(_searchTitle);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (_searchTitle.length === 0) {
        const _filteredMovies = Object.values(listMovies).sort((m1, m2) => {
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
        const _filteredMovies = Object.values(listMovies).filter((movie) =>
          movie.title.toLowerCase().includes(_searchTitle.trim().toLowerCase())
        );
        setFilteredMovies(_filteredMovies);
      }
    }, 500);
  }

  if (isFetching) {
    return <Loading />;
  }

  if (!isFetching && !list) {
    return <Message />;
  }

  if (!isFetching && list) {
    return (
      <>
        {showMovieDetailsModal && (
          <MovieDetailsModal
            showModal={showMovieDetailsModal}
            setShowModal={setShowMovieDetailsModal}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            listUsers={listUsers}
          />
        )}

        {showEditMovieModal && (
          <EditMovieRatingModal
            showModal={showEditMovieModal}
            setShowModal={setShowEditMovieModal}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            myMovies={listMovies}
            setMyMovies={setListMovies}
          />
        )}
        {showEditListModal && (
          <EditListModal
            showModal={showEditListModal}
            setShowModal={setShowEditListModal}
            list={list}
            setList={setList}
            myMovies={listMovies}
            setMyMovies={setListMovies}
          />
        )}
        <div className="flex w-full flex-col gap-4">


        {Object.keys(listMovies).length === 0 && (
            <Message>
              <h1>Whoa! Looks like you do not have any movies in this list &#128561;</h1>
              <p>Let's get you started by adding your first movie to this list!</p>
              <Button
                handleClick={() => setShowEditListModal(true)}
                rounded={true}
                color="sky"
              >
                <Pen />
              </Button>
            </Message>
          )}
          {Object.keys(listMovies).length > 0 && (
            <div className="flex w-full items-center justify-between gap-4">
              <h1>
                {list.name}{' '}
                <span className="font-montserrat font-normal">
                  ({Object.keys(listMovies).length})
                </span>
              </h1>
              <Button
                handleClick={() => setShowEditListModal(true)}
                rounded={true}
                color="sky"
              >
                <Pen />
              </Button>
            </div>
          )}
          <input
            type="text"
            value={filteredMoviesTitle}
            placeholder="Search Movies in List"
            onInput={handleSearchFilteredMovies}
            className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black placeholder-neutral-400 transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
          />
          <MovieCardGrid>
            {filteredMovies.map((movie, index) => (
              <MovieCard
                key={index}
                movie={listMovies[movie.movie_id]}
                setSelectedMovie={setSelectedMovie}
                setShowEditMovieModal={setShowEditMovieModal}
                setShowMovieDetailsModal={setShowMovieDetailsModal}
              />
            ))}
          </MovieCardGrid>
        </div>
      </>
    );
  }
}

export default List;
