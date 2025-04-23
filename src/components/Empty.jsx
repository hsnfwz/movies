'use client';
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

function Empty() {
  const { user } = useUser();

  return (
    <div className={`self-center text-center w-full ${user ? 'h-[calc(100vh-96px)]' : 'h-[calc(100vh-32px)]'} flex flex-col gap-4 items-center justify-center rounded-xl bg-neutral-100 p-4`}>
      <h1>Whoops! We could not find what you were looking for.</h1>
      <Link
        onMouseDown={(event) => event.preventDefault()}
        className={`px-4 h-[48px] rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-100 bg-white text-black hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
        href="/"
      >
        Home
      </Link>
    </div>
  );
}

export default Empty;
