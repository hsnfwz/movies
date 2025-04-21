'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';

function Home() {
  const { modal, setModal } = useContext(ModalContext);
  const { lists, fetchingLists } = useContext(DataContext);
  const searchTimerRef = useRef();
  const [name, setName] = useState('');

  const [filteredLists, setFilteredLists] = useState([]);

  function handleSearch(event) {
    const _name = event.currentTarget.value;
    setName(_name);

    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (_name.length === 0) {
        setFilteredLists(Object.values(lists));
      } else {
        const _filteredLists = Object.values(lists).filter((list) =>
          list.name.toLowerCase().includes(_name.trim().toLowerCase())
        );
        setFilteredLists(_filteredLists);
      }
    }, 500);
  }

  useEffect(() => {
    if (!fetchingLists) {
      setFilteredLists(Object.values(lists));
    }
  }, [fetchingLists, lists]);

  if (fetchingLists) {
    return <span>Loading...</span>;
  }

  if (!fetchingLists) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        {Object.keys(lists).length === 0 && (
          <>
            <h1>You do not have any lists yet</h1>
            <p>Let's get you started by creating your first list!</p>
          </>
        )}
        {Object.keys(lists).length > 0 && (
          <>
            <h1>Your Lists</h1>
            <input
              type="text"
              placeholder="Search Lists"
              value={name}
              onInput={handleSearch}
              className="flex w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black placeholder-neutral-400 transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
            />
            {filteredLists.map((list, index) => (
              <Link
                key={index}
                href={`/lists/${list.id}`}
                className="block rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
              >
                {list.name}
              </Link>
            ))}
          </>
        )}
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setModal({ action: 'ADD_LIST' })}
          className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
        >
          <Plus />
        </button>
      </div>
    );
  }
}

export default Home;
