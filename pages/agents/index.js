import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function Agents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch agents
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAgents();
    }
  }, [status]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      console.log('Fetched agents:', data); // Debugging line
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch agents');
      }

      setAgents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteClick = async (agentId) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      // Refresh the agents list
      fetchAgents();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalClose = (refreshNeeded = false) => {
    setIsModalOpen(false);
    setSelectedAgent(null);
    if (refreshNeeded) {
      fetchAgents();
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agents</h1>
          <p className="text-gray-600 mt-2">Manage your AI agents and their configurations.</p>
        </div>
        <Link
          href="/agents/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Agent
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length >= 1 ? agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{agent.twilioPhoneNumber}</p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/agents/${agent.id}`}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDeleteClick(agent.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 italic">
              "{agent.greetingPhrase}"
            </p>
          </div>
        )) : null}

        {agents.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No agents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new agent.
            </p>
            <div className="mt-6">
              <Link
                href="/agents/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add New Agent
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

Agents.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
