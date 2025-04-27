'use client';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import Message from '@/components/Message';
import Link from 'next/link';
import { getData, putData, postData } from '@/helpers';

function Invite() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    async function getInvite() {
      const { rows: invites } = await getData(`/api/invites/${id}`);

      if (!invites[0]) {
        setLoading(false);
        setForbidden(true);
        return;
      }
      setInvite(invites[0]);

      const expiredAtMs = new Date(invites[0].expired_at).getTime();
      const todayMs = new Date().getTime();

      if (expiredAtMs < todayMs) {
        setLoading(false);
        setExpired(true);
        return;
      }

      await postData('/api/user-added-list-has-users', {
        userAddedListId: invites[0].user_added_list_id,
      });
      await putData(`/api/invites/${id}`, { expiredAt: new Date() });

      setLoading(false);
    }

    getInvite();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!loading && forbidden) {
    return (
      <Message>
        <h1>You cannot access this invite</h1>
      </Message>
    );
  }

  if (!loading && expired) {
    return (
      <Message>
        <h1>This invite has expired</h1>
      </Message>
    );
  }

  if (!loading && !expired && !forbidden) {
    return (
      <Message>
        <h1>Your list is ready!</h1>
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className={`flex h-[48px] items-center justify-center rounded-full border-2 border-transparent bg-white px-4 text-black transition-all duration-100 hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
          href={`/lists/${invite.user_added_list_id}`}
        >
          View List
        </Link>
      </Message>
    );
  }
}

export default Invite;
