import React, { useState } from "react";
import Link from "next/link";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow">
      <div className="w-full h-[76px] px-6 sm:px-[96px] flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img
            className="w-[50px] h-[50px] rounded-full"
            src="/assets/img/logo/logo_sq.png"
            alt="WiseOwl Logo"
          />
          <div className="ml-3 text-2xl font-bold text-[#161616] font-['Quicksand']">
            WiseOwl
          </div>
        </Link>
        <div className="hidden md:flex items-center">
          <div className="flex space-x-8">
            <Link href="/auth/login" className="text-black text-base font-bold font-['Quicksand']">
              Login
            </Link>
          </div>
          <Link 
            href="/auth/signup"
            className="ml-6 px-6 py-1.5 bg-[#264653] rounded-md text-white text-sm font-bold font-['Quicksand']"
          >
            Start for free
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleNavbar}
            className="text-gray-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/auth/login" 
              className="block px-3 py-2 rounded-md text-base font-bold font-['Quicksand'] text-black"
            >
              Login
            </Link>
            <Link 
              href="/auth/signup"
              className="block w-full px-3 py-2 mt-1 bg-[#264653] rounded-md text-white text-sm font-bold font-['Quicksand'] text-center"
            >
              Start for free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
