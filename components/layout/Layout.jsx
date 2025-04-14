import React from 'react';
import Navbar from './Navbar';
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <div className="flex-1">
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
