
function Button({ children, handleClick, rounded, disabled, color, active, className }) {

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleClick}
      className={`flex ${rounded ? 'w-full max-w-[48px] min-w-[48px] aspect-square' : 'px-4 h-full max-h-[48px] min-h-[48px]'} cursor-pointer items-center justify-center rounded-full border-2 ${color === 'neutral' ? 'border-neutral-100 bg-neutral-100 text-black hover:border-neutral-200' : ''} ${color === 'sky' ? 'border-sky-500 bg-sky-500 text-white hover:border-sky-700' : ''} ${color === 'rose' ? 'border-rose-500 bg-rose-500 text-white hover:border-rose-700' : ''} ${color === 'amber' ? `border-amber-500 text-white hover:border-amber-700 ${active ? 'bg-amber-500' : 'bg-white'}` : ''}  transition-all duration-100  focus:border-black focus:ring-0 focus:outline-0 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
