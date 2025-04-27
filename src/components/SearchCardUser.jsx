'use client';

import { useUser } from '@auth0/nextjs-auth0';

function SearchCardUser({ user, disabled, handleSelect }) {
  const { user: me } = useUser();

  return (
    <button
      disabled={disabled}
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleSelect}
      className={`flex cursor-pointer justify-between gap-2 rounded-xl border-2 border-neutral-100 p-4 transition-all duration-100 hover:border-black focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:border-dotted disabled:border-sky-500`}
    >
      <h2 className={`font-bold`}>
        {user.username} {user.user_id === me.sub && <span>(You)</span>}
      </h2>
    </button>
  );
}

export default SearchCardUser;
