// client/src/services/notificationService.js
import api from './api';
import { useAuth } from '../hooks/useAuth'; // Jika perlu akses user context

const notificationService = {
  /**
   * Mengirim permintaan persetujuan proposal ke anggota tim
   * @param {string} recipientEmail - Email penerima
   * @param {string} recipientName - Nama penerima
   * @param {number} proposalId - ID proposal
   * @param {string} proposalTitle - Judul proposal
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  sendApprovalRequest: async (recipientEmail, recipientName, proposalId, proposalTitle) => {
    try {
      const response = await api.post('/notifications/approval-request', {
        recipientEmail,
        recipientName,
        proposalId,
        proposalTitle
      });
      
      return {
        success: true,
        message: response.data.message || 'Permintaan persetujuan berhasil dikirim'
      };
    } catch (error) {
      console.error('Error sending approval request:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal mengirim permintaan persetujuan'
      };
    }
  },

  /**
   * Mengirim notifikasi status proposal berubah
   * @param {number} proposalId - ID proposal
   * @param {string} newStatus - Status baru proposal
   * @param {string} comment - Komentar opsional
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  sendStatusUpdate: async (proposalId, newStatus, comment = '') => {
    try {
      const response = await api.post('/notifications/status-update', {
        proposalId,
        newStatus,
        comment
      });
      
      return {
        success: true,
        message: response.data.message || 'Notifikasi status berhasil dikirim'
      };
    } catch (error) {
      console.error('Error sending status update:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal mengirim notifikasi status'
      };
    }
  },

  /**
   * Mengirim notifikasi penugasan reviewer
   * @param {number} proposalId - ID proposal
   * @param {number} reviewerId - ID reviewer
   * @param {string} reviewerName - Nama reviewer
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  sendReviewerAssignment: async (proposalId, reviewerId, reviewerName) => {
    try {
      const response = await api.post('/notifications/reviewer-assignment', {
        proposalId,
        reviewerId,
        reviewerName
      });
      
      return {
        success: true,
        message: response.data.message || 'Notifikasi penugasan reviewer berhasil dikirim'
      };
    } catch (error) {
      console.error('Error sending reviewer assignment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal mengirim notifikasi penugasan reviewer'
      };
    }
  },

  /**
   * Mengirim notifikasi sistem (untuk UI)
   * @param {string} type - Jenis notifikasi ('success', 'error', 'info', 'warning')
   * @param {string} message - Pesan notifikasi
   * @param {number} duration - Durasi tampilan (ms)
   * @returns {void}
   */
  showSystemNotification: (type, message, duration = 5000) => {
    // Ini akan dipanggil oleh UI component untuk menampilkan notifikasi
    // Diimplementasikan menggunakan context atau event bus
    const event = new CustomEvent('show-notification', {
      detail: {
        type,
        message,
        duration
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * Mendapatkan semua notifikasi untuk user saat ini
   * @returns {Promise<{success: boolean, notifications?: Array, error?: string}>}
   */
  getUserNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return {
        success: true,
        notifications: response.data.notifications
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Gagal mengambil notifikasi'
      };
    }
  },

  /**
   * Menandai notifikasi sebagai telah dibaca
   * @param {number|Array<number>} notificationIds - ID notifikasi
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  markAsRead: async (notificationIds) => {
    try {
      const response = await api.patch('/notifications/mark-read', {
        notificationIds: Array.isArray(notificationIds) 
          ? notificationIds 
          : [notificationIds]
      });
      
      return {
        success: true,
        message: response.data.message || 'Notifikasi ditandai sebagai dibaca'
      };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal menandai notifikasi sebagai dibaca'
      };
    }
  },

  /**
   * Mengirim notifikasi pengumuman
   * @param {string} title - Judul pengumuman
   * @param {string} content - Isi pengumuman
   * @param {string} category - Kategori pengumuman
   * @param {Array<number>} [userIds] - ID user tertentu (jika tidak diisi, broadcast ke semua)
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  sendAnnouncement: async (title, content, category, userIds = null) => {
    try {
      const response = await api.post('/notifications/announcement', {
        title,
        content,
        category,
        userIds
      });
      
      return {
        success: true,
        message: response.data.message || 'Pengumuman berhasil dikirim'
      };
    } catch (error) {
      console.error('Error sending announcement:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal mengirim pengumuman'
      };
    }
  },

   /**
   * Mengirim notifikasi penugasan reviewer
   */
  sendReviewerAssignment: async (reviewerId, proposalTitle) => {
    try {
      const response = await api.post('/notifications/reviewer-assignment', {
        reviewerId,
        proposalTitle
      });
      
      return {
        success: true,
        message: response.data.message || 'Notifikasi penugasan berhasil dikirim'
      };
    } catch (error) {
      console.error('Error sending reviewer assignment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal mengirim notifikasi'
      };
    }
  },


  /**
   * Mengirim notifikasi email
   * @param {string} recipientEmail - Email penerima
   * @param {string} subject - Subjek email
   * @param {string} content - Konten email (HTML)
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  sendEmailNotification: async (recipientEmail, subject, content) => {
    try {
      const response = await api.post('/notifications/send-email', {
        recipientEmail,
        subject,
        content
      });
      
      return {
        success: true,
        message: response.data.message || 'Email berhasil dikirim'
      };
    } catch (error) {
      console.error('Error sending email notification:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Gagal mengirim email'
      };
    }
  }
};

export default notificationService;