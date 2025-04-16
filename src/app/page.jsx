'use client';

import { useUser } from "@auth0/nextjs-auth0";
import Profile from "@/components/Profile";

function Home() {
  const { user, isLoading } = useUser();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && user && (
        <>
          <Profile />
          <a href="/auth/logout">Logout</a>
        </>
      )}
      {!isLoading && !user && (
        <a href="/auth/login">Login</a>
      )}
    </div>
  );
}

export default Home;
