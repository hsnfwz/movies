'use client';

import { useUser } from '@auth0/nextjs-auth0';

function ProtectedLayout({ children }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!isLoading && !user) {
    return <div>No Content</div>;
  }

  if (!isLoading && user) {
    return <>{children}</>;
  }
}

export default ProtectedLayout;
