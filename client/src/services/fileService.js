import api from './api';

class FileService {
  // Upload dokumen untuk proposal
  async uploadProposalDocument(proposalId, file) {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await api.post(`/files/proposals/${proposalId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get dokumen by proposal ID
  async getProposalDocuments(proposalId) {
    try {
      const response = await api.get(`/files/proposals/${proposalId}/documents`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Download file
  async downloadFile(documentId) {
    try {
      const response = await api.get(`/files/download/${documentId}`, {
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete file
  async deleteFile(documentId) {
    try {
      const response = await api.delete(`/files/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload general file
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle download dengan nama file
  async handleFileDownload(documentId, fileName) {
    try {
      const response = await this.downloadFile(documentId);
      
      // Create blob URL
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validate file before upload
  validateFile(file, maxSizeInMB = 10) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipe file tidak diizinkan. Hanya PDF, DOC, DOCX, XLS, XLSX, JPG, PNG yang diperbolehkan.');
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new Error(`File terlalu besar. Maksimal ${maxSizeInMB}MB.`);
    }

    return true;
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Handle error
  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('Terjadi kesalahan pada server');
  }
}

export default new FileService();