'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Loading from '@/components/Loading';

function Welcome() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading) {
    return (
      <div className="flex h-[calc(100vh-32px)] w-full flex-col gap-4 items-center justify-center p-4">
        <h1>FilmFest</h1>
        {user && (
          <div className="flex gap-2">
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={` px-4 h-[48px] rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-100 bg-neutral-100 text-black hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
            href="/movies"
          >
            Movies
          </Link>
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={` px-4 h-[48px] rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-100 bg-neutral-100 text-black hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
            href="/lists"
          >
            Lists
          </Link>
          </div>
        )}
        {!user && (
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className="flex items-center justify-center h-[48px] rounded-full border-2 border-sky-500 bg-sky-500 px-4 text-white transition-all duration-100 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
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
