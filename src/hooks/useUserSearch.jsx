'use client';
import { useEffect, useRef, useState } from 'react';

function useUserSearch() {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  // const [hasMoreSearchUsers, setHasMoreSearchUsers] = useState(true);

  const timerRef = useRef();

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (searchUsername.trim().length === 0) {
      setIsSearchingUsers(false);
      setSearchUsers([]);
    } else {
      timerRef.current = setTimeout(() => {
        getUsersOnUsernameChange();
      }, [500]);
    }
  }, [searchUsername]);

  async function getUsersOnUsernameChange() {
    try {
      setIsSearchingUsers(true);
      const response = await fetch(
        `/api/search/users?username=${searchUsername}`
      );
      const { users } = await response.json();
      // if (users.length < 20) {
      //   setHasMoreSearchUsers(false);
      // } else {
      //   setHasMoreSearchUsers(true);
      // }
      setSearchUsers(users);
      setIsSearchingUsers(false);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    searchUsername,
    setSearchUsername,
    searchUsers,
    setSearchUsers,
    isSearchingUsers,
    setIsSearchingUsers,
    // hasMoreSearchUsers,
    // setHasMoreSearchUsers,
  };
}

export default useUserSearch;
