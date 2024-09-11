'use client';
import Image from 'next/image';
import Logo from '../../public/assets/logo.png';
import User from '../../public/assets/User.svg';
import Menu from '../../public/assets/Menu.svg';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { name: 'Features', link: '#features' },
  // { name: 'Faq', link: '#server-utils' },
  // { name: 'Pricing', link: '#pricing' },
  // { name: 'Enterprise', link: '#enterprise' },
  // { name: 'Careers', link: '#careers' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="px-5 py-4 lg:px-0 lg:container flex justify-between items-center text-white">
      <div className="flex items-center gap-20">
        <Image width={200} height={90} src={Logo} alt="Logo" className="m-4" />
        <ul className="hidden lg:flex gap-x-14">
          {navLinks.map((item, index) => (
            <li key={index}>
              <Link
                className="font-medium text-base text-primary"
                href={item.link}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* mobile menu */}
      {open && (
        <div className="lg:hidden fixed top-20 left-4 right-4 z-10 py-8 bg-white drop-shadow-md">
          <div className="flex flex-col items-center space-y-6 font-bold">
            {navLinks.map((item, index) => (
              <Link
                onClick={() => setOpen(!open)}
                key={index}
                className="font-medium text-base text-primary"
                href={item.link}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* mobile menu */}
      <div className="flex justify-between items-center gap-x-5 lg:gap-x-14">
        <div className="hidden lg:flex justify-between items-center gap-x-3">
          <Link
            className="font-medium text-[16px]"
            href="https://github.com/svazqz/next-base"
          >
            Github
          </Link>
        </div>
        <Image
          width={36}
          height={36}
          className="lg:hidden"
          src={User}
          alt="user"
        />
        <Image
          width={36}
          height={36}
          onClick={() => setOpen(!open)}
          className="lg:hidden"
          src={Menu}
          alt="menu"
        />
      </div>
    </nav>
  );
};

export default Navbar;
