'use client';
import { createContext, useState } from 'react';

const ModalContext = createContext('');

function ModalContextProvider({ children }) {
  const [modal, setModal] = useState('');

  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export { ModalContext, ModalContextProvider };
