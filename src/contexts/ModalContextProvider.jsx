'use client';
import { createContext, useState } from 'react';

const ModalContext = createContext({ action: '', data: null });

function ModalContextProvider({ children }) {
  const [modal, setModal] = useState({ action: '', data: null });

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
