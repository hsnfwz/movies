'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { useEffect } from 'react';

function Welcome() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) console.log(user.sub);
  }, [user, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading) {
    return (
      <div className="flex h-[calc(100vh-32px)] w-full flex-col items-center justify-center gap-8 p-4 text-center">
        <h1>FilmFest</h1>
        <p>Track and rate movies and create collaborative lists with friends and family!</p>
        {user && (
          <div className="flex gap-2">
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className={`flex h-[48px] items-center justify-center rounded-full border-2 border-transparent bg-neutral-100 px-4 text-black transition-all duration-100 hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
              href="/movies"
            >
              Movies
            </Link>
            <Link
              onMouseDown={(event) => event.preventDefault()}
              className={`flex h-[48px] items-center justify-center rounded-full border-2 border-transparent bg-neutral-100 px-4 text-black transition-all duration-100 hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
              href="/lists"
            >
              Lists
            </Link>
          </div>
        )}
        {!user && (
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className="flex h-[48px] items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 px-4 text-white transition-all duration-100 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
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
