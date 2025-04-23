'use client';
import { useContext, useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import AddEditListModal from '@/components/modals/AddEditListModal';
import EditMovieRatingModal from '@/components/modals/EditMovieRatingModal';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import AddMovieModal from '@/components/modals/AddMovieModal';
import Nav from '@/components/Nav';

function ProtectedLayout({ children }) {
  const { user, isLoading } = useUser();
  const { modal, setModal } = useContext(ModalContext);
  const {
    lists,
    setLists,
    movies,
    setMovies,
    setFetchingLists,
    moviesWithoutList, setMoviesWithoutList,
  } = useContext(DataContext);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!lists) {
        const response = await fetch('/api/lists');
        const { lists: userLists, error } = await response.json();

        if (error) return console.log(error);

        const _lists = {};
        userLists.forEach((list) => (_lists[list.id] = list));

        setLists(_lists);
      }
      setFetchingLists(false);
    }

    fetchData();
  }, []);

  async function handleAddMovie(selectedMovies) {
    setSubmitting(true);

    const response = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movies: Object.values(selectedMovies),
      }),
    });

    const { movies, error } = await response.json();

    if (error) return console.log(error);

    const _movies = {};
    movies.forEach((movie) => _movies[movie.id] = movie);

    setMoviesWithoutList({ ...moviesWithoutList, ..._movies });

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  async function handleAddList(listName, listUsers, listMovies) {
    setSubmitting(true);

    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName,
        listMovies,
      }),
    });

    const { list, error } = await response.json();

    if (error) return console.log(error);
    
    if (Object.keys(listUsers).length > 0) {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          listUsers,
        }),
      });
  
      const { message, error } = await response.json();
  
      if (error) return console.log(error);
    }

    const _lists = { ...lists, [list.id]: list };
    setLists(_lists);

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  async function handleEditList(listName, listUsers, listMovies) {
    setSubmitting(true);

    const response = await fetch('/api/lists', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName,
        listId: modal.data.list.id,
        listMovies,
      }),
    });

    const { list, addedMovies, error } = await response.json();

    if (error) return console.log(error);

    if (Object.keys(listUsers).length > 0) {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: modal.data.list.id,
          listUsers,
        }),
      });
  
      const { message, error } = await response.json();
  
      if (error) return console.log(error);
    }

    const _lists = { ...lists, [list.id]: list };

    const _listMovies = { ...movies[modal.data.list.id] };
    addedMovies.forEach((movie) => {
      _listMovies[movie.id] = movie;
    });

    setLists(_lists);
    setMovies({ ...movies, [modal.data.list.id]: _listMovies });

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  async function handleEditMovieRating(rating) {
    setSubmitting(true);

    const response = await fetch(`/api/movies/${modal.data.movie.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating,
      }),
    });

    const { movie, error } = await response.json();

    if (error) return console.log(error);

    const _movies = { ...moviesWithoutList, [movie.id]: { ...moviesWithoutList[movie.id], rating: movie.rating }};
    setMoviesWithoutList({ ...moviesWithoutList, ..._movies });

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !user) {
    return <Empty />;
  }

  if (!isLoading && user) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <Nav />
        <AddMovieModal
          handleSubmit={async (selectedMovies) => {
            await handleAddMovie(selectedMovies);
          }}
          disabled={submitting}
          show={modal.action === 'ADD_MOVIE'}
        />
        <EditMovieRatingModal
          handleSubmit={async (score) => {
            await handleEditMovieRating(score);
          }}
          disabled={submitting}
          show={modal.action === 'EDIT_MOVIE_RATING'}
        />
        <AddEditListModal
          handleSubmit={async (listName, listUsers, listMovies) => {
            if (modal.action === 'ADD_LIST') {
              await handleAddList(listName, listUsers, listMovies);
            } else if (modal.action === 'EDIT_LIST') {
              await handleEditList(listName, listUsers, listMovies);
            }
          }}
          disabled={submitting}
          show={modal.action === 'ADD_LIST' || modal.action === 'EDIT_LIST'}
        />

        {children}
      </div>
    );
  }
}

export default ProtectedLayout;
