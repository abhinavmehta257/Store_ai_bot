import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      if (response.ok) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md h-16 fixed w-full top-0 z-50">
      <div className="h-full px-4 flex justify-between items-center">
        {/* Logo section */}
        <div className="flex items-center">
          <Image
            src="/assets/img/logo/logo_sq.png"
            alt="Shshboar Logo"
            width={40}
            height={40}
            className="cursor-pointer rounded-full"
          />
          <span className="ml-2 text-xl font-semibold">WiseOwl</span>
        </div>

        {/* User section */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
