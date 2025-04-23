'use client';
import { useContext, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ModalContext } from '@/contexts/ModalContextProvider';

function Modal({ children, disabled, show, handleReset }) {
  const { setModal } = useContext(ModalContext);

  const modalRef = useRef();

  useEffect(() => {
    if (show) {
      disableBodyScroll();

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();

      const handleTabKeyPress = (event) => {
        if (event.key === 'Tab') {
          if (
            lastElement.disabled &&
            document.activeElement.nextElementSibling === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          } else if (
            event.shiftKey &&
            document.activeElement === firstElement
          ) {
            event.preventDefault();
            lastElement.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleEscapeKeyPress = (event) => {
        if (event.key === 'Escape') {
          closeModal(false);
        }
      };

      modalRef.current.addEventListener('keydown', handleTabKeyPress);
      document.addEventListener('keydown', handleEscapeKeyPress);

      return () => {
        modalRef.current.removeEventListener('keydown', handleTabKeyPress);
        document.removeEventListener('keydown', handleEscapeKeyPress);
        enableBodyScroll();
      };
    }
  }, [show]);

  function enableBodyScroll() {
    const body = document.querySelector('body');
    body.classList.add('overflow-auto');
    body.classList.remove('overflow-hidden');
  }

  function disableBodyScroll() {
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden');
    body.classList.remove('overflow-auto');
  }

  function handleModalClickOutside(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function closeModal() {
    if (!disabled) {
      if (handleReset) handleReset();
      setModal({ action: '', data: null });
      enableBodyScroll();
    }
  }

  return (
    <div
      ref={modalRef}
      className={`fixed top-0 left-0 z-50 h-[100dvh] w-full overflow-y-auto bg-black/75 p-4 backdrop-blur-lg ${show ? 'block' : 'hidden'}`}
      onClick={handleModalClickOutside}
    >
      <div className="m-auto flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
        <button
          type="button"
          disabled={disabled}
          onClick={closeModal}
          onMouseDown={(event) => event.preventDefault()}
          className="flex h-[48px] w-[48px] cursor-pointer items-center justify-center self-end rounded-full border-2 border-neutral-100 bg-neutral-100 text-black transition-all duration-100 hover:border-neutral-200 focus:border-black focus:ring-0 focus:outline-0"
        >
          <X />
        </button>
        <div className="mx-auto flex h-full w-full max-w-[1024px] flex-col gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
