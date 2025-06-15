import api from './api';

const userService = {
  // Mendapatkan semua users dengan pagination
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`/users?${queryParams.toString()}`);
      
      // Handle response format
      let users = [];
      let pagination = { total: 0, pages: 0, page: 1, limit: 10 };
      
      if (response.data.data && response.data.data.users) {
        // Format: { data: { users: [...], pagination: {...} } }
        users = response.data.data.users;
        pagination = response.data.data.pagination;
      } else if (response.data.users) {
        // Format: { users: [...], pagination: {...} }
        users = response.data.users;
        pagination = response.data.pagination;
      } else if (Array.isArray(response.data)) {
        // Format: [...]
        users = response.data;
        pagination = {
          total: response.headers['x-total-count'] || users.length,
          pages: response.headers['x-total-pages'] || 1,
          page: parseInt(response.headers['x-current-page'] || 1),
          limit: parseInt(response.headers['x-per-page'] || 10)
        };
      } else {
        console.warn('Unexpected response format:', response.data);
        users = [];
      }

      return {
        success: true,
        data: {
          users,
          pagination
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users',
        data: { users: [], pagination: { total: 0, pages: 0, page: 1, limit: 10 } }
      };
    }
  },

  // Mendapatkan statistik user
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats');
      
      // Handle berbagai format respons
      let statsData = {};
      
      if (response.data.data) {
        // Format: { data: { totalUsers: ..., activeUsers: ..., inactiveUsers: ... } }
        statsData = response.data.data;
      } else if (response.data) {
        // Format: { totalUsers: ..., activeUsers: ..., inactiveUsers: ... }
        statsData = response.data;
      } else {
        console.warn('Unexpected stats response format:', response.data);
        statsData = {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0
        };
      }

      return {
        success: true,
        data: statsData
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user stats'
      };
    }
  },

  // Membuat user baru
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      
      // Handle response format
      const user = response.data.data || response.data;
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user'
      };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      
      // Handle response format
      const user = response.data.data || response.data;
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user'
      };
    }
  },

  // Update status user
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.put(`/users/${id}/status`, { status });
      
      // Handle response format
      const user = response.data.data || response.data;
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user status'
      };
    }
  },

  // Hapus user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      
      // Handle response format
      const result = response.data.data || response.data;
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user'
      };
    }
  },

  // Mendapatkan profil sendiri
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      
      // Handle response format
      const profile = response.data.data || response.data;
      
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update profil sendiri
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      
      // Handle response format
      const profile = response.data.data || response.data;
      
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Mendapatkan reviewers
  getReviewers: async () => {
    try {
      const response = await api.get('/users/reviewers');
      
      // Handle berbagai format respons
      let reviewers = [];
      
      if (response.data.data && response.data.data.reviewers) {
        reviewers = response.data.data.reviewers;
      } else if (response.data.reviewers) {
        reviewers = response.data.reviewers;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        reviewers = response.data.data;
      } else if (Array.isArray(response.data)) {
        reviewers = response.data;
      } else {
        console.warn('Unexpected reviewers response format:', response.data);
        reviewers = [];
      }

      return {
        success: true,
        data: reviewers
      };
    } catch (error) {
      console.error('Error fetching reviewers:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reviewers',
        data: []
      };
    }
  },

  // Mendapatkan team members
  getTeamMembers: async () => {
    try {
      console.log('🔄 Fetching team members...');
      const response = await api.get('/users/team-members');
      console.log('📥 Team members response:', response.data);
      
      let users = [];
      
      if (response.data.data && response.data.data.users) {
        users = response.data.data.users;
      } else if (response.data.users) {
        users = response.data.users;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        users = [];
      }

      console.log('✅ Processed team members:', users);
      
      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('❌ Error fetching team members:', error);
      
      let errorMessage = 'Failed to fetch team members';
      
      if (error.response) {
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error('Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: [],
        error: errorMessage
      };
    }
  }
};

export default userService;