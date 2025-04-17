'use client';
import { createContext, useState } from 'react';

const ModalContext = createContext({ type: null, data: null });

function ModalContextProvider({ children }) {
  const [modal, setModal] = useState({ type: null, data: null });

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
