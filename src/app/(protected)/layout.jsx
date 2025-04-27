'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Loading from '@/components/Loading';
import Message from '@/components/Message';
import Nav from '@/components/Nav';

function ProtectedLayout({ children }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !user) {
    return <Message />;
  }

  if (!isLoading && user) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Nav />
        {children}
      </div>
    );
  }
}

export default ProtectedLayout;
