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

// TODO: skeleton for each search image - need a searchimage card component to make this work
// TODO: edit list
// TODO: search and add users to list
// TODO: alphabetical order and scroll travel
// TODO: add vercel url links to auth0 app dashboard when ready to deploy
// TODO: limit number of movies and users that can be added at a given time to avoid reaching vercel function time limits (ex: 5 per submit)
