import React, { useState } from 'react';

export default function TestCallSection({ agent }) {
  const [toNumber, setToNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleTestCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`/api/agents/test-call/${agent.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toNumber,
          from: agent.twilioPhoneNumber
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate test call');
      }

      setStatus({
        type: 'success',
        message: 'Test call initiated successfully'
      });
      setToNumber('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Test Call Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Make a test call using this agent's configured phone number.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleTestCall} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Number (Agent's Number)
          </label>
          <input
            type="text"
            value={agent.twilioPhoneNumber}
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="toNumber" className="block text-sm font-medium text-gray-700">
            To Number
          </label>
          <input
            type="tel"
            id="toNumber"
            value={toNumber}
            onChange={(e) => setToNumber(e.target.value)}
            required
            placeholder="+1234567890"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {status.message && (
          <div className={`p-3 rounded-md ${
            status.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              status.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {status.message}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !toNumber}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Initiating Call...' : 'Test Call'}
          </button>
        </div>
      </form>
    </div>
  );
}
