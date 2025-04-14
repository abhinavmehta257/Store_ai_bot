import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';

export default function DocumentUploadSection({ agentId }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState({});

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  const handleDelete = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document? This will also delete all associated knowledge chunks.')) {
      return;
    }

    setIsDeleting(prev => ({ ...prev, [documentId]: true }));
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/documents/delete/${documentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete document');
      }

      // Show success message with chunk count
      setSuccess(`Document deleted successfully. ${data.deletedChunks} chunks were removed.`);

      // Refresh the documents list
      fetchDocuments();
    } catch (error) {
      setError(`Failed to delete document: ${error.message}`);
    } finally {
      setIsDeleting(prev => ({ ...prev, [documentId]: false }));
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents/${agentId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch documents');
      }

      setDocuments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [agentId]);

  const onDrop = async (acceptedFiles) => {
    setError(''); // Clear any previous errors
    setSuccess(''); // Clear any previous success messages
    
    for (const file of acceptedFiles) {
      try {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('agentId', agentId);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload document');
        }

        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));

        // Show success message
        setSuccess(`Document "${file.name}" uploaded successfully. Processing will begin shortly.`);

        // Refresh document list
        fetchDocuments();
      } catch (error) {
        setError(`Failed to upload ${file.name}: ${error.message}`);
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10485760 // 10MB
  });

  const renderDocumentStatus = (status) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Error
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
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
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>
                Drag and drop files here, or <span className="text-blue-500">browse</span>
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Document List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((document) => (
            <li key={document.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{document.name}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {format(new Date(document.uploadedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {renderDocumentStatus(document.status)}
                      {document.chunkCount !== undefined && (
                        <span className="ml-2 text-xs text-gray-500">
                          {document.chunkCount} chunks
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(document.id)}
                      disabled={isDeleting[document.id]}
                      className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      {isDeleting[document.id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress bar for uploading documents */}
                {uploadProgress[document.name] !== undefined && uploadProgress[document.name] < 100 && (
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${uploadProgress[document.name]}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
          
          {documents.length === 0 && !isLoading && (
            <li>
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No documents uploaded yet
              </div>
            </li>
          )}

          {isLoading && (
            <li>
              <div className="px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
