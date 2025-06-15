//client/src/services/reviewService.js
import api from './api';

class ReviewService {
  // Get all reviews with pagination and filters
  static async getReviews(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`/reviews?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data review');
    }
  }

  // ✅ TAMBAHAN: Get proposals yang perlu direview
  static async getProposalsToReview(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`/reviews/proposals?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data proposal untuk review');
    }
  }

  // Create new review
  static async createReview(reviewData) {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data.message.includes('sudah memberikan review')) {
          throw new Error('Anda sudah memberikan review untuk proposal ini');
        }
      }
      throw new Error(error.response?.data?.message || 'Gagal membuat review');
    }
  }

  // ✅ PERBAIKAN: Cek apakah review bisa diedit
  static canEditReview(review, user) {
    // Admin selalu bisa edit
    if (user?.role === 'ADMIN') return true;
    
    // Reviewer hanya bisa edit milik sendiri dan belum final
    if (user?.role === 'REVIEWER' && review.reviewer.id === user.id) {
      const editableStatuses = ['REVIEW', 'SUBMITTED'];
      return editableStatuses.includes(review.proposal.status);
    }
    
    return false;
  }

  // Get review by ID
  static async getReviewById(id) {
    try {
      const response = await api.get(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil detail review');
    }
  }

  // ✅ PERBAIKAN: Update review dengan validasi status
  static async updateReview(id, reviewData) {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      // Handle specific error messages
      if (error.response?.status === 403) {
        if (error.response.data.message.includes('final')) {
          throw new Error('Review sudah final dan tidak dapat diedit lagi');
        }
        if (error.response.data.message.includes('sendiri')) {
          throw new Error('Anda hanya bisa mengedit review sendiri');
        }
      }
      throw new Error(error.response?.data?.message || 'Gagal memperbarui review');
    }
  }

  // ✅ TAMBAHAN: Get status edit message
  static getEditStatusMessage(review, user) {
    if (!this.canEditReview(review, user)) {
      if (user?.role === 'REVIEWER' && review.reviewer.id === user.id) {
        return 'Review sudah final dan tidak dapat diedit';
      }
      return 'Anda tidak memiliki akses untuk mengedit review ini';
    }
    return '';
  }

  // Delete review
  static async deleteReview(id) {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus review');
    }
  }

  // Get all reviewers
  static async getReviewers() {
    try {
      const response = await api.get('/reviews/reviewers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data reviewer');
    }
  }

  // Assign reviewer to proposal
  static async assignReviewer(proposalId, reviewerId) {
  try {
    const response = await api.post('/reviews/assign', {
      proposalId,
      reviewerId
    });
    return response.data;
  } catch (error) {
    // Tambahkan logging untuk debug
    console.error('Error assigning reviewer:', {
      status: error.response?.status,
      data: error.response?.data
    });
    
    throw new Error(error.response?.data?.message || 'Gagal menugaskan reviewer');
  }
}
  // Get review statistics
  static async getReviewStats() {
    try {
      const response = await api.get('/reviews/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting review stats:', error);
      // Return default stats if API fails
      return {
        data: {
          total: 0,
          pending: 0,
          averageScore: 0,
          statusBreakdown: {
            layak: 0,
            tidak_layak: 0,
            revisi: 0
          }
        }
      };
    }
  }

  // Helper method to format review status
  static getStatusLabel(status) {
    const statusLabels = {
      'LAYAK': 'Layak',
      'TIDAK_LAYAK': 'Tidak Layak',
      'REVISI': 'Perlu Revisi'
    };
    return statusLabels[status] || status;
  }

  // Helper method to get status color
  static getStatusColor(status) {
    const statusColors = {
      'LAYAK': 'green',
      'TIDAK_LAYAK': 'red',
      'REVISI': 'yellow'
    };
    return statusColors[status] || 'gray';
  }

  // Format score display
  static formatScore(score) {
    if (!score) return '-';
    return parseFloat(score).toFixed(2);
  }

  // ✅ PERBAIKAN: Validate review data dengan status check
  static validateReviewData(data, review = null, user = null) {
    const errors = {};

    // Validasi basic
    if (!data.rekomendasi) {
      errors.rekomendasi = 'Rekomendasi wajib dipilih';
    }

    if (data.skor_total && (data.skor_total < 0 || data.skor_total > 100)) {
      errors.skor_total = 'Skor harus antara 0-100';
    }

    if (data.catatan && data.catatan.length > 1000) {
      errors.catatan = 'Catatan maksimal 1000 karakter';
    }

    // ✅ TAMBAHAN: Validasi edit permission
    if (review && user && !this.canEditReview(review, user)) {
      errors.permission = this.getEditStatusMessage(review, user);
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ✅ TAMBAHAN: Check if user can review proposal
  static canReviewProposal(proposal, user) {
    // Admin bisa review semua proposal
    if (user?.role === 'ADMIN') return true;
    
    // Reviewer bisa review proposal yang statusnya SUBMITTED atau REVIEW
    if (user?.role === 'REVIEWER') {
      const reviewableStatuses = ['SUBMITTED', 'REVIEW'];
      return reviewableStatuses.includes(proposal.status);
    }
    
    return false;
  }

  // ✅ TAMBAHAN: Check if user already reviewed proposal
  static hasUserReviewed(proposal, user) {
    if (!proposal.reviews || !user) return false;
    return proposal.reviews.some(review => review.reviewer.id === user.id);
  }
}

export default ReviewService;