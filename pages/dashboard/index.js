import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {session?.user?.name}</h1>
        <p className="text-gray-600 mt-2">Manage your bot and view insights from your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Conversations</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="text-gray-600 text-sm">
            No recent activity to display.
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/chat-history')}
              className="w-full px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              View Chat History
            </button>
            <button
              onClick={() => router.push('/twilio')}
              className="w-full px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Twilio Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
