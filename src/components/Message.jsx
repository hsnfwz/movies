'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

function Message({ children }) {
  const { user } = useUser();

  return (
    <div
      className={`w-full self-center text-center ${user ? 'h-[calc(100vh-96px)]' : 'h-[calc(100vh-32px)]'} flex flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4`}
    >
      {!children && (
        <h1>Whoops! We could not find what you were looking for.</h1>
      )}
      {children}
    </div>
  );
}

export default Message;
