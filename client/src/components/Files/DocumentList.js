import React, { useState, useEffect } from 'react';
import { Download, Trash2, File, Calendar } from 'lucide-react';
import fileService from '../../services/fileService';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlertMessage from '../Common/AlertMessage';

const DocumentList = ({ proposalId, onDocumentDelete, refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [proposalId, refreshTrigger]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fileService.getProposalDocuments(proposalId);
      setDocuments(response.data.documents || []);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      setDownloadingId(documentId);
      await fileService.handleFileDownload(documentId, fileName);
    } catch (error) {
      setError(error.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      return;
    }

    try {
      setDeletingId(documentId);
      await fileService.deleteFile(documentId);
      
      // Update local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      if (onDocumentDelete) {
        onDocumentDelete(documentId);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <AlertMessage
        type="error"
        message={error}
        onClose={() => setError('')}
      />
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <File className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p>Belum ada dokumen yang diupload</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {document.name}
              </h4>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(document.uploadedAt)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Download Button */}
            <button
              onClick={() => handleDownload(document.id, document.name)}
              disabled={downloadingId === document.id}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
              title="Download"
            >
              {downloadingId === document.id ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(document.id)}
              disabled={deletingId === document.id}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Hapus"
            >
              {deletingId === document.id ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;