import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DocumentUploadSection from './DocumentUploadSection';
import TestCallSection from './TestCallSection';

export default function AgentModal({ agent, onClose, isOpen }) {
  const [activeTab, setActiveTab] = useState('details');
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    twilioPhoneNumber: '',
    greetingPhrase: '',
    systemMessage: ''
  });
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumbersLoading, setPhoneNumbersLoading] = useState(true);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        twilioPhoneNumber: agent.twilioPhoneNumber,
        greetingPhrase: agent.greetingPhrase,
        systemMessage: agent.systemMessage || ''
      });
    }
    fetchPhoneNumbers();
  }, [agent]);

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch('/api/twilio/phone-numbers');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch phone numbers');
      }

      setPhoneNumbers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setPhoneNumbersLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = agent 
        ? `/api/agents/${agent.id}`
        : '/api/agents';
        
      const response = await fetch(url, {
        method: agent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save agent');
      }

      onClose(true); // true indicates that we need to refresh the agents list
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'details':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter agent name"
              />
            </div>

            <div>
              <label htmlFor="twilioPhoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number {agent && <span className="text-gray-500 text-xs">(Non-editable after creation)</span>}
              </label>
              {agent ? (
                <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
                  {agent.twilioPhoneNumber}
                </div>
              ) : (
                <>
                  <select
                    id="twilioPhoneNumber"
                    name="twilioPhoneNumber"
                    value={formData.twilioPhoneNumber}
                    onChange={handleChange}
                    required
                    disabled={phoneNumbersLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a phone number</option>
                    {phoneNumbers.map((number) => (
                      <option key={number.sid} value={number.phoneNumber}>
                        {number.friendlyName} ({number.phoneNumber})
                      </option>
                    ))}
                  </select>
                  {phoneNumbersLoading && (
                    <p className="mt-1 text-sm text-gray-500">Loading phone numbers...</p>
                  )}
                </>
              )}
            </div>

            <div>
              <label htmlFor="greetingPhrase" className="block text-sm font-medium text-gray-700">
                Greeting Phrase
              </label>
              <textarea
                id="greetingPhrase"
                name="greetingPhrase"
                value={formData.greetingPhrase}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the greeting phrase for this agent"
              />
            </div>

            <div>
              <label htmlFor="systemMessage" className="block text-sm font-medium text-gray-700">
                System Message
                <span className="ml-1 text-gray-500 text-xs">(Instructions for agent behavior)</span>
              </label>
              <textarea
                id="systemMessage"
                name="systemMessage"
                value={formData.systemMessage}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter system instructions or context for the agent's behavior"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={loading || phoneNumbersLoading}
              >
                {loading ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
              </button>
            </div>
          </form>
        );
      case 'documents':
        return agent ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Supported Documents</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Text files (.txt)</li>
                      <li>PDF documents (.pdf)</li>
                      <li>Microsoft Word (.doc, .docx)</li>
                    </ul>
                    <p className="mt-2">Maximum file size: 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            <DocumentUploadSection agentId={agent.id} />
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Save the agent first to manage documents
          </div>
        );
      case 'testCall':
        return agent ? (
          <TestCallSection agent={agent} />
        ) : (
          <div className="text-center py-6 text-gray-500">
            Save the agent first to test calls
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {agent ? 'Edit Agent' : 'Create New Agent'}
          </h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Agent Details
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={!agent}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('testCall')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'testCall'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={!agent}
            >
              Test Call
            </button>
          </nav>
        </div>

        <div className="p-6">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
