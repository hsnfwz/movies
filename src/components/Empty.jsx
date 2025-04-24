'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

function Empty() {
  const { user } = useUser();

  return (
    <div
      className={`w-full self-center text-center ${user ? 'h-[calc(100vh-96px)]' : 'h-[calc(100vh-32px)]'} flex flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4`}
    >
      <h1>Whoops! We could not find what you were looking for.</h1>
      <Link
        onMouseDown={(event) => event.preventDefault()}
        className={`flex h-[48px] items-center justify-center rounded-full border-2 border-transparent bg-white px-4 text-black transition-all duration-100 hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
        href="/"
      >
        Home
      </Link>
    </div>
  );
}

export default Empty;
