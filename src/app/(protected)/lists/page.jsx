'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';
import AddEditModal from '@/components/AddEditModal';

function Home() {
  const { modal, setModal } = useContext(ModalContext);

  const listsRef = useRef([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [fetchingLists, setFetchingLists] = useState(true);

  const searchTimerRef = useRef();
  const [name, setName] = useState('');

  const [submitting, setSubmitting] = useState(false);

  function handleSearch(event) {
    const _name = event.currentTarget.value;
    setName(_name);

    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (_name.length === 0) {
        setFilteredLists([...listsRef.current]);
      } else {
        const _filteredLists = listsRef.current.filter((list) =>
          list.name.toLowerCase().includes(_name.trim().toLowerCase())
        );
        setFilteredLists(_filteredLists);
      }
    }, 1000);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/lists');
      const { lists, error } = await response.json();
      if (error) console.log(error);
      setFilteredLists(lists);
      listsRef.current = lists;
      setFetchingLists(false);
    }

    fetchData();
  }, []);

  async function handleSubmit(listName, listUsers, listMovies) {
    setSubmitting(true);

    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName,
        listUsers,
        listMovies,
      }),
    });

    const { list, error } = await response.json();

    if (error) console.log(error);

    const _filteredLists = [...filteredLists];
    _filteredLists.push(list);
    setFilteredLists(_filteredLists);
    listsRef.current.push(list);
    setSubmitting(false);
    setModal('');
  }

  if (fetchingLists) {
    return <span>Loading...</span>;
  }

  if (!fetchingLists) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        {/* <Link
          onMouseDown={(event) => event.preventDefault()}
          className="absolute top-4 right-4 flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-neutral-100 bg-neutral-100 text-black transition-all duration-200 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0"
          href="/"
        >
          H
        </Link> */}
        {filteredLists.length === 0 && (
          <>
            <h1>You do not have any lists yet</h1>
            <p>Let's get you started by creating your first list!</p>
          </>
        )}
        {filteredLists.length > 0 && (
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
          onClick={() => setModal('ADD_LIST')}
          className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-white transition-all duration-200 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
        >
          <Plus />
        </button>
        <AddEditModal
          handleSubmit={handleSubmit}
          disabled={submitting}
          show={modal === 'ADD_LIST'}
        />
      </div>
    );
  }
}

export default Home;
