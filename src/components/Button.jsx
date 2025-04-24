function Button({
  children,
  handleClick,
  rounded,
  disabled,
  color,
  activeColor,
  active,
  className,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleClick}
      className={`flex ${rounded ? 'aspect-square w-full max-w-[48px] min-w-[48px] hover:border-black' : 'h-full max-h-[48px] min-h-[48px] px-4'} cursor-pointer items-center justify-center rounded-full border-2 ${!active && color === 'neutral' ? 'border-neutral-100 bg-neutral-100 text-black' : ''} ${!active && color === 'sky' ? 'border-sky-500 bg-sky-500 text-white' : ''} ${!active && color === 'rose' ? 'border-rose-500 bg-rose-500 text-white' : ''} ${!active && color === 'amber' ? `border-amber-500 text-white` : ''} transition-all duration-100 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50 ${active && activeColor === 'amber' ? 'border-amber-500 bg-amber-500 text-white' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
