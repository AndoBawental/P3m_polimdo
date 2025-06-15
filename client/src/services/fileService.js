// client/src/services/fileService.js
import api from './api';

const fileService = {
  // Upload document to a proposal
  uploadDocument: async (proposalId, file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add optional metadata (name, type, etc.)
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post(
        `/api/files/proposals/${proposalId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return {
        success: true,
        data: response.data,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 
               `File upload failed: ${error.message}`,
        status: error.response?.status
      };
    }
  },

  // Get documents by proposal
  getDocumentsByProposal: async (proposalId) => {
    try {
      const response = await api.get(
        `/api/files/proposals/${proposalId}/documents`
      );
      
      return {
        success: true,
        data: response.data,
        documents: response.data.documents || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 
               `Failed to fetch documents: ${error.message}`,
        status: error.response?.status
      };
    }
  },

  // Download document
  downloadDocument: async (documentId) => {
    try {
      const response = await api.get(
        `/api/files/documents/${documentId}`,
        {
          responseType: 'blob' // Important for file downloads
        }
      );
      
      // Create download URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return {
        success: true,
        url,
        fileName: response.headers['content-disposition']
                  ? response.headers['content-disposition'].split('filename=')[1]
                  : `document-${documentId}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 
               `Download failed: ${error.message}`,
        status: error.response?.status
      };
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(
        `/api/files/documents/${documentId}`
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Document deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 
               `Delete failed: ${error.message}`,
        status: error.response?.status
      };
    }
  }
};

export default fileService;