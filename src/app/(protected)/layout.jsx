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
  const { lists, setLists, movies, setMovies } = useContext(DataContext);
  const [submitting, setSubmitting] = useState(false);

  async function handleAddList(name, listUsers, listMovies) {
    setSubmitting(true);

    const promises = [];

    promises.push(
      fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })
    );

    if (Object.keys(listMovies).length > 0) {
      promises.push(
        fetch('/api/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movies: Object.values(listMovies),
          }),
        })
      );
    }

    const responses = await Promise.all(promises);

    const { list, error: listError } = await responses[0].json();
    if (listError) return console.log(listError);

    let addedMovies = [];
    if (Object.keys(listMovies).length > 0) {
      const result = await responses[1].json();
      if (result.error) return console.log(result.error);
      addedMovies = result.movies;
      const _movies = { ...movies };
      addedMovies.forEach(
        (addedMovie) => (_movies[addedMovie.id] = addedMovie)
      );
      setMovies(_movies);
    }

    if (addedMovies.length > 0) {
      const response = await fetch('/api/list-movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          movies: addedMovies,
        }),
      });

      const { error } = await response.json();
      if (error) return console.log(error);
    }

    const ids = addedMovies.map((addedMovie) => addedMovie.id);
    const _lists = { ...lists, [list.id]: { ...list, movieIds: ids } };
    setLists(_lists);

    if (Object.keys(listUsers).length > 0) {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          users: Object.values(listUsers),
        }),
      });

      const { error } = await response.json();
      if (error) return console.log(error);
    }

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  async function handleEditList(name, listUsers, listMovies) {
    setSubmitting(true);

    const promises = [];

    promises.push(
      fetch(`/api/lists/${modal.data.list.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })
    );

    if (Object.keys(listMovies).length > 0) {
      promises.push(
        fetch('/api/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movies: Object.values(listMovies),
          }),
        })
      );
    }

    const responses = await Promise.all(promises);

    const { list, error: listError } = await responses[0].json();
    if (listError) return console.log(listError);

    let addedMovies = [];
    if (Object.keys(listMovies).length > 0) {
      const result = await responses[1].json();
      if (result.error) return console.log(result.error);
      addedMovies = result.movies;
      const _movies = { ...movies };
      addedMovies.forEach(
        (addedMovie) => (_movies[addedMovie.id] = addedMovie)
      );
      setMovies(_movies);
    }

    if (addedMovies.length > 0) {
      const response = await fetch('/api/list-movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          movies: addedMovies,
        }),
      });

      const { error } = await response.json();
      if (error) return console.log(error);
    }

    const _list = { ...list };
    if (addedMovies.length > 0) {
      const ids = addedMovies.map((addedMovie) => addedMovie.id);
      _list.movieIds = [...lists[list.id].movieIds, ...ids];
    }
    const _lists = { ...lists, [list.id]: _list };
    setLists(_lists);

    if (Object.keys(listUsers).length > 0) {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          users: Object.values(listUsers),
        }),
      });

      const { error } = await response.json();
      if (error) return console.log(error);
    }

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

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

    const { movies: addedMovies, error } = await response.json();

    if (error) return console.log(error);

    const _movies = {};
    addedMovies.forEach((movie) => (_movies[movie.id] = movie));

    setMovies({ ...movies, ..._movies });

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

    const _movies = {
      ...movies,
      [movie.id]: { ...movies[movie.id], rating: movie.rating },
    };
    setMovies({ ...movies, ..._movies });

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
      <div className="flex w-full flex-col gap-4">
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
