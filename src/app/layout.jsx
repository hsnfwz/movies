import './globals.css';

export const metadata = {
  title: 'FilmFest',
  description: 'Create collaborative lists to rate movies.',
};

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-[768px] p-4">{children}</body>
    </html>
  );
}

export default RootLayout;
