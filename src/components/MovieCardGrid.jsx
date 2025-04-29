function MovieCardGrid({ children }) {
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
      {children}
    </div>
  );
}

export default MovieCardGrid;
