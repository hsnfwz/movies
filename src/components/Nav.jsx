'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center gap-2">
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`${pathname === '/' ? 'bg-sky-500 text-white' : ''} px-4 h-[48px] rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-100 bg-neutral-100 text-black hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
            href="/"
          >
            Home
          </Link>
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`${pathname.includes('movies') ? 'bg-sky-500 text-white' : ''} px-4 h-[48px] rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-100 bg-neutral-100 text-black hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
            href="/movies"
          >
            Movies
          </Link>
          <Link
            onMouseDown={(event) => event.preventDefault()}
            className={`${pathname.includes('lists') ? 'bg-sky-500 text-white' : ''} px-4 h-[48px] rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-100 bg-neutral-100 text-black hover:bg-sky-500 hover:text-white focus:border-black focus:ring-0 focus:outline-0`}
            href="/lists"
          >
            Lists
          </Link>

        </nav>
  )
}

export default Nav;
