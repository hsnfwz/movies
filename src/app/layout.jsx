import { ModalContextProvider } from '@/contexts/ModalContextProvider';
import './globals.css';

export const metadata = {
  title: 'Movies',
  description: 'Create collaborative lists to rate your movies with others.',
};

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ModalContextProvider>{children}</ModalContextProvider>
      </body>
    </html>
  );
}

export default RootLayout;
