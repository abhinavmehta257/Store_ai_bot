import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DocumentUploadSection from './DocumentUploadSection';
import TestCallSection from './TestCallSection';

export default function AgentForm({ agent }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');
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
  const [errorType, setErrorType] = useState(null);

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
        if (data.code) {
          setErrorType(data.code);
          setError(data.message);
          return;
        }
        throw new Error(data.message || 'Failed to save agent');
      }

      // Redirect to agent list on success
      router.push('/agents');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
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
                  {formData.twilioPhoneNumber}
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

            {errorType && (
              <div className={`p-4 ${
                errorType === 'TWILIO_NOT_CONFIGURED' ? 'bg-yellow-50 border-yellow-200' :
                errorType === 'WEBHOOK_CONFIG_FAILED' || errorType === 'WEBHOOK_VERIFY_FAILED' ? 'bg-orange-50 border-orange-200' :
                'bg-red-50 border-red-200'
              } border rounded-md`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${
                      errorType === 'TWILIO_NOT_CONFIGURED' ? 'text-yellow-400' :
                      errorType === 'WEBHOOK_CONFIG_FAILED' || errorType === 'WEBHOOK_VERIFY_FAILED' ? 'text-orange-400' :
                      'text-red-400'
                    }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      errorType === 'TWILIO_NOT_CONFIGURED' ? 'text-yellow-800' :
                      errorType === 'WEBHOOK_CONFIG_FAILED' || errorType === 'WEBHOOK_VERIFY_FAILED' ? 'text-orange-800' :
                      'text-red-800'
                    }`}>
                      {errorType === 'TWILIO_NOT_CONFIGURED' ? 'Twilio Configuration Required' :
                       errorType === 'WEBHOOK_CONFIG_FAILED' ? 'Webhook Configuration Failed' :
                       errorType === 'WEBHOOK_VERIFY_FAILED' ? 'Webhook Verification Failed' :
                       errorType === 'PHONE_NUMBER_TAKEN' ? 'Phone Number Already in Use' :
                       'Error Creating Agent'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      errorType === 'TWILIO_NOT_CONFIGURED' ? 'text-yellow-700' :
                      errorType === 'WEBHOOK_CONFIG_FAILED' || errorType === 'WEBHOOK_VERIFY_FAILED' ? 'text-orange-700' :
                      'text-red-700'
                    }`}>
                      <p>{error}</p>
                      {errorType === 'TWILIO_NOT_CONFIGURED' && (
                        <button
                          onClick={() => router.push('/twilio')}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Configure Twilio
                        </button>
                      )}
                      {(errorType === 'WEBHOOK_CONFIG_FAILED' || errorType === 'WEBHOOK_VERIFY_FAILED') && (
                        <div className="mt-2">
                          <p className="font-medium">Troubleshooting steps:</p>
                          <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Verify your Twilio credentials are correct</li>
                            <li>Ensure the phone number is active in your Twilio account</li>
                            <li>Check if the phone number supports voice capabilities</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/agents"
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
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
          <div className="max-w-2xl mx-auto">
            <TestCallSection agent={agent} />
          </div>
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
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="sm:hidden" aria-label="Back">
            <Link
              href="/agents"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <svg className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back
            </Link>
          </nav>
          <nav className="hidden sm:flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <Link href="/agents" className="text-gray-400 hover:text-gray-500">
                    Agents
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {agent ? 'Edit Agent' : 'Create New Agent'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {agent ? 'Edit Agent' : 'Create New Agent'}
            </h2>
          </div>
        </div>

        {agent && (
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('details')}
                className={`${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('testCall')}
                className={`${
                  activeTab === 'testCall'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Test Call
              </button>
            </nav>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}
