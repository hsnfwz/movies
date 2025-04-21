'use client';
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import AddEditListModal from '@/components/AddEditListModal';
import AddEditRatingModal from '@/components/AddEditRatingModal';
import Loading from '@/components/Loading';

function ProtectedLayout({ children }) {
  const { user, isLoading } = useUser();
  const { modal, setModal } = useContext(ModalContext);
  const {
    lists,
    setLists,
    movies,
    setMovies,
    ratings,
    setRatings,
    setFetchingLists,
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

  async function handleAddList(listName, listUsers, listMovies) {
    setSubmitting(true);

    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName,
        listUsers,
        listMovies,
      }),
    });

    const { list, error } = await response.json();

    if (error) return console.log(error);

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

  async function handleAddRating(score) {
    setSubmitting(true);

    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        movieId: modal.data.movie.movie_id,
      }),
    });

    const { rating, error } = await response.json();

    if (error) return console.log(error);

    const _ratings = { ...ratings, [rating.movie_id]: rating };
    setRatings(_ratings);

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  async function handleEditRating(score) {
    setSubmitting(true);

    const response = await fetch('/api/ratings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        ratingId: modal.data.rating.id,
      }),
    });

    const { rating, error } = await response.json();

    if (error) return console.log(error);

    const _ratings = { ...ratings, [rating.movie_id]: rating };

    console.log(_ratings)

    setRatings(_ratings);

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !user) {
    return <div>No Content</div>;
  }

  if (!isLoading && user) {
    return (
      <div className="flex flex-col gap-4">
        <nav className="flex w-full items-center gap-4">
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`font-limelight block border-b-2 border-transparent transition-all duration-200 hover:border-b-sky-700 focus:border-black focus:ring-0 focus:outline-0`}
            href="/"
          >
            FilmFest
          </Link>
          {/* <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`${pathname === '/' ? 'border-sky-500' : 'border-transparent'} block border-b-2 py-2 transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0 font-limelight`}
            href="/"
          >
            FilmFest
          </Link> */}
          {/* <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`${pathname === '/lists' ? 'border-sky-500' : 'border-transparent'} block border-b-2 py-2 transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0`}
            href="/lists"
          >
            Lists
          </Link> */}
        </nav>
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
        <AddEditRatingModal
          handleSubmit={async (score) => {
            if (modal.action === 'ADD_RATING') {
              await handleAddRating(score);
            } else if (modal.action === 'EDIT_RATING') {
              await handleEditRating(score);
            }
          }}
          disabled={submitting}
          show={modal.action === 'ADD_RATING' || modal.action === 'EDIT_RATING'}
        />
        {children}
      </div>
    );
  }
}

export default ProtectedLayout;
