'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

function Welcome() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1>FilmFest</h1>
        {user && (
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className="block rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
            href="/lists"
          >
            Your Lists
          </Link>
        )}
        {!user && (
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
}

export default Welcome;

// TODO: user metadata (username) to use for search
// TODO: search and add users to list
