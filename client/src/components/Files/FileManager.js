import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DocumentList from './DocumentList';
import AlertMessage from '../Common/AlertMessage';

const FileManager = ({ 
  proposalId, 
  title = "Dokumen Proposal",
  allowUpload = true,
  showTitle = true 
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUploadSuccess = (result) => {
    setMessage({ 
      type: 'success', 
      text: 'File berhasil diupload!' 
    });
    // Trigger refresh document list
    setRefreshTrigger(prev => prev + 1);
    
    // Auto hide message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleUploadError = (error) => {
    setMessage({ 
      type: 'error', 
      text: error.message || 'Gagal mengupload file' 
    });
  };

  const handleDocumentDelete = () => {
    setMessage({ 
      type: 'success', 
      text: 'Dokumen berhasil dihapus!' 
    });
    
    // Auto hide message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload dan kelola dokumen yang terkait dengan proposal
          </p>
        </div>
      )}

      {/* Alert Messages */}
      {message.text && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />
      )}

      {/* File Upload Section */}
      {allowUpload && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Upload Dokumen Baru
          </h4>
          <FileUpload
            proposalId={proposalId}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxSize={10}
          />
        </div>
      )}

      {/* Document List Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Dokumen Tersimpan
        </h4>
        <DocumentList
          proposalId={proposalId}
          onDocumentDelete={handleDocumentDelete}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default FileManager;