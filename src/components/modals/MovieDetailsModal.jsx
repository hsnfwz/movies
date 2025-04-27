'use client';
import Modal from "../Modal";
import { useUser } from "@auth0/nextjs-auth0";

function MovieDetailsModal({ showModal, setShowModal, selectedMovie }) {
  const { user } = useUser();

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h1 className="text-center">{selectedMovie.title}</h1>

<div className="w-full flex flex-col gap-4">
{Object.values(selectedMovie.users).map((value, index) => (
        <div key={index} className={`flex gap-2 justify-between bg-neutral-100 rounded-full p-4 ${user.sub === value.user_added_movie_auth0_user_id ? 'text-amber-500' : 'text-black'}`}>
          <p>{value.user_added_movie_auth0_user_id}</p>
          <p className="font-bold">{value.user_added_movie_rating ? value.user_added_movie_rating : '-'}</p>
        </div>
      ))}
</div>

    </Modal>
  );
}

export default MovieDetailsModal;
