'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';

function Invite() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  /* 
    1. get the list_invite record based on id
    2. check if expired
    3. if expired, show no content
    4. if not expired, handle list, movies, and ratings, then set to expired
    5. show message to user saying they can check out their new list
  */

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h2>Please wait while we set up your new list!</h2>
        <Loading />
      </div>
    );
  }

  if (!loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <h2>All set! Visit your new list: {id}</h2>
      </div>
    );
  }
}

export default Invite;
