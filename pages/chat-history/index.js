import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function ChatHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chat History</h1>
        <p className="text-gray-600 mt-2">View and manage your conversation history.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search and Filter Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="p-4">
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your chat history will appear here once you start having conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ChatHistory.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
