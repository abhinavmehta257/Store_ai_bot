import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Sidenav from './Sidenav';

export default function DashboardLayout({ children }) {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    console.log('Session status:', status);
    
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidenav />
        <main className="flex-1 p-4 ml-64 mt-[56px]">
          {children}
        </main>
      </div>
    </div>
  );
}
