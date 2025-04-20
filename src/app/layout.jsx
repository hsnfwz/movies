import { ModalContextProvider } from '@/contexts/ModalContextProvider';
import { DataContextProvider } from '@/contexts/DataContextProvider';
import './globals.css';

export const metadata = {
  title: 'Movies',
  description: 'Create collaborative lists to rate your movies with others.',
};

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="mx-auto w-full max-w-[1024px] p-4">
        <ModalContextProvider>
          <DataContextProvider>{children}</DataContextProvider>
        </ModalContextProvider>
      </body>
    </html>
  );
}

export default RootLayout;
