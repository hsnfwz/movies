'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import { DataContext } from '@/contexts/DataContextProvider';
import Loading from '@/components/Loading';

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
    return <Loading />;
  }

  if (!fetchingLists) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center gap-4">
          <h1>
            {Object.keys(lists).length === 0
              ? 'You do not have any lists yet'
              : 'My Lists'}
          </h1>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setModal({ action: 'ADD_LIST' })}
            className="ml-auto flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
          >
            <Plus />
          </button>
        </div>

        {Object.keys(lists).length === 0 && (
          <p>Let's get you started by creating your first list!</p>
        )}
        {Object.keys(lists).length > 0 && (
          <>
            <input
              type="text"
              placeholder="Search Lists"
              value={name}
              onInput={handleSearch}
              className="flex w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 py-2 text-black placeholder-neutral-400 transition-all duration-200 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
            />
            <div className="flex w-full flex-wrap gap-2">
              {filteredLists.map((list, index) => (
                <Link
                  key={index}
                  href={`/lists/${list.id}`}
                  className="block rounded-full border-2 border-sky-500 bg-sky-500 px-4 py-2 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
                >
                  {list.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Home;
