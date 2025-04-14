import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function TwilioSetup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    accountSid: '',
    authToken: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/setup-twilio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to connect Twilio account');
      }

      setSuccess(true);
      // Wait a bit before redirecting to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Twilio Setup</h1>
        <p className="text-gray-600 mt-2">
          Connect your Twilio account to enable voice and messaging capabilities.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700">
              Account SID
            </label>
            <input
              type="text"
              id="accountSid"
              name="accountSid"
              value={formData.accountSid}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Twilio Account SID"
            />
          </div>

          <div>
            <label htmlFor="authToken" className="block text-sm font-medium text-gray-700">
              Auth Token
            </label>
            <input
              type="password"
              id="authToken"
              name="authToken"
              value={formData.authToken}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Twilio Auth Token"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Twilio account connected successfully! Redirecting...
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Account'}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Where to find these credentials?</h3>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>Log in to your Twilio Console at <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">www.twilio.com/console</a></li>
            <li>Your Account SID and Auth Token are displayed on the dashboard</li>
            <li>For security, make sure to use your Auth Token and not your API Key</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

TwilioSetup.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
