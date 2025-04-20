'use client';
import { useContext, useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import AddEditListModal from '@/components/AddEditListModal';
import AddEditRatingModal from '@/components/AddEditRatingModal';

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

  async function handleAddRating(score) {
    setSubmitting(true);

    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        movieId: modal.data.movie_id,
      }),
    });

    const { rating, error } = await response.json();

    console.log(rating);

    if (error) return console.log(error);

    const _ratings = { ...ratings, [rating.movie_id]: rating };
    setRatings(_ratings);

    setSubmitting(false);
    setModal({ action: '', data: null });
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!isLoading && !user) {
    return <div>No Content</div>;
  }

  if (!isLoading && user) {
    return (
      <>
        <AddEditListModal
          handleSubmit={handleAddList}
          disabled={submitting}
          show={modal.action === 'ADD_LIST'}
        />
        <AddEditRatingModal
          handleSubmit={handleAddRating}
          disabled={submitting}
          show={modal.action === 'ADD_RATING'}
        />
        {children}
      </>
    );
  }
}

export default ProtectedLayout;
