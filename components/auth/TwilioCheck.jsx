import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TwilioCheck({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showTwilioPrompt, setShowTwilioPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkTwilioAccount();
  }, []);

  const checkTwilioAccount = async () => {
    try {
      const response = await fetch('/api/auth/check-twilio');
      const data = await response.json();

      if (!data.hasTwilioAccount && !router.pathname.startsWith('/twilio')) {
        setShowTwilioPrompt(true);
      }
    } catch (error) {
      console.error('Failed to check Twilio account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showTwilioPrompt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Connect Your Twilio Account</h2>
          <p className="text-gray-600 mb-6">
            To use all features of Shshboar, you need to connect your Twilio account.
            This is required for handling voice and messaging capabilities.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push('/twilio')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Connect Twilio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
