'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/Button';

function Modal({ children, disabled, setShowModal }) {
  const modalRef = useRef();

  useEffect(() => {
    disableBodyScroll();

    let handleTabKeyPress;
    let handleEscapeKeyPress;

    if (modalRef && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();

      handleTabKeyPress = (event) => {
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

      handleEscapeKeyPress = (event) => {
        if (!disabled && event.key === 'Escape') {
          enableBodyScroll();
          setShowModal(false);
        }
      };

      modalRef.current.addEventListener('keydown', handleTabKeyPress);
      document.addEventListener('keydown', handleEscapeKeyPress);
    }

    return () => {
      if (modalRef && modalRef.current) {
        modalRef.current.removeEventListener('keydown', handleTabKeyPress);
        document.removeEventListener('keydown', handleEscapeKeyPress);
      }

      enableBodyScroll();
    };
  }, []);

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

  return (
    <div
      ref={modalRef}
      className={`fixed top-0 left-0 z-50 h-[100dvh] w-full overflow-y-auto bg-black/75 p-4 backdrop-blur-lg`}
      onClick={(event) => {
        if (!disabled && event.target === event.currentTarget) {
          enableBodyScroll();
          setShowModal(false);
        }
      }}
    >
      <div className="m-auto flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
        <Button
          disabled={disabled}
          handleClick={() => {
            if (!disabled) {
              enableBodyScroll();
              setShowModal(false);
            }
          }}
          rounded={true}
          color="neutral"
          className="self-end"
        >
          <X />
        </Button>
        <div className="mx-auto flex h-full w-full max-w-[768px] flex-col gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
