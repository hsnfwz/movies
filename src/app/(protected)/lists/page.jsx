'use client';
import { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { getData, postData } from '@/helpers';
import AddListModal from '@/components/modals/AddListModal';
import Message from '@/components/Message';

function Page() {
  const [myLists, setMyLists] = useState({});

  const timerRef = useRef();
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [filteredLists, setFilteredLists] = useState([]);

  function handleSearch(event) {
    const _name = event.currentTarget.value;
    setName(_name);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (_name.length === 0) {
        const _filteredLists = Object.values(myLists).sort((l1, l2) => {
          if (l1.name < l2.name) {
            return -1;
          }
          if (l1.name > l2.name) {
            return 1;
          }
          return 0;
        });
        setFilteredLists(_filteredLists);
      } else {
        const _filteredLists = Object.values(myLists).filter((list) =>
          list.name.toLowerCase().includes(_name.trim().toLowerCase())
        );
        setFilteredLists(_filteredLists);
      }
    }, 500);
  }

  useEffect(() => {
    async function fetchData() {
      const { rows: userAddedLists } = await getData('/api/user-added-lists');
      const _myLists = {};
      userAddedLists.forEach(
        (userAddedList) => (_myLists[userAddedList.id] = userAddedList)
      );

      const _filteredLists = Object.values(myLists).sort((l1, l2) => {
        if (l1.name < l2.name) {
          return -1;
        }
        if (l1.name > l2.name) {
          return 1;
        }
        return 0;
      });
      setFilteredLists(_filteredLists);
      setMyLists(_myLists);

      setIsFetching(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      const _filteredLists = Object.values(myLists).sort((l1, l2) => {
        if (l1.name < l2.name) {
          return -1;
        }
        if (l1.name > l2.name) {
          return 1;
        }
        return 0;
      });
      setFilteredLists(_filteredLists);
    }
  }, [isFetching, myLists]);

  if (isFetching) {
    return <Loading />;
  }

  if (!isFetching) {
    return (
      <>
        {showModal && (
          <AddListModal
            showModal={showModal}
            setShowModal={setShowModal}
            myLists={myLists}
            setMyLists={setMyLists}
          />
        )}
        <div className="flex w-full flex-col gap-4">
          {Object.keys(myLists).length === 0 && (
            <Message>
              <h1>Whoa! Looks like you do not have any lists &#128561;</h1>
              <p>Let's get you started by adding your first list!</p>
              <Button
                handleClick={() => setShowModal(true)}
                rounded={true}
                color="sky"
              >
                <Plus />
              </Button>
            </Message>
          )}
          {Object.keys(myLists).length > 0 && (
            <div className="flex w-full items-center justify-between gap-4">
              <h1>
                Lists{' '}
                <span className="font-montserrat font-normal">
                  ({Object.keys(myLists).length})
                </span>
              </h1>
              <Button
                handleClick={() => setShowModal(true)}
                rounded={true}
                color="sky"
              >
                <Plus />
              </Button>
            </div>
          )}
          {Object.keys(myLists).length > 0 && (
            <>
              <input
                type="text"
                placeholder="Search Lists"
                value={name}
                onInput={handleSearch}
                className="flex h-[48px] w-full rounded-full border-2 border-neutral-100 bg-neutral-100 px-4 text-black placeholder-neutral-400 transition-all duration-100 hover:border-neutral-200 focus:border-black focus:bg-white focus:ring-0 focus:outline-0"
              />
              <div className="flex w-full flex-wrap gap-2">
                {filteredLists.map((list, index) => (
                  <Link
                    key={index}
                    href={`/lists/${list.id}`}
                    className="flex h-[48px] items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 px-4 text-white transition-all duration-100 hover:border-sky-700 focus:border-black focus:ring-0 focus:outline-0"
                  >
                    {list.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Page;
