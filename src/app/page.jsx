'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

function Welcome() {
  const { user, isLoading } = useUser();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
      <h1>FilmFest</h1>
      {isLoading && (
        <span className="border-2 border-transparent px-4 py-2">
          Loading...
        </span>
      )}
      {!isLoading && user && (
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className="block rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
          href="/home"
        >
          Home
        </Link>
      )}
      {!isLoading && !user && (
        <Link
          onMouseDown={(event) => event.preventDefault()}
          className="block rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
          href="/auth/login"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}

export default Welcome;
