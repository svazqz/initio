'use client';
import Image from 'next/image';
import Logo from '../../public/assets/logo.png';
import User from '../../public/assets/User.svg';
import Menu from '../../public/assets/Menu.svg';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { name: 'Features', link: '#features' },
  { name: 'Github', link: 'https://github.com/svazqz/next-base' },
];

const Navbar = () => {
  return (
    <nav className="px-5 py-4 lg:px-0 lg:container flex justify-between items-center text-white">
      <div className="flex items-center gap-20">
        <Image width={200} height={90} src={Logo} alt="Logo" className="m-4" />
      </div>
      <div className="flex justify-between items-center gap-x-5 lg:gap-x-14">
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
    </nav>
  );
};

export default Navbar;
