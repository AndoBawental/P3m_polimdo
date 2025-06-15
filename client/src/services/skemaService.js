import api from './api';

class SkemaService {
  async getAllSkema(filters = {}) {
    try {
      // Convert frontend filters to backend compatible format
      const params = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        kategori: filters.kategori === 'Semua Kategori' ? null : filters.kategori,
        status: filters.status === 'Semua Status' ? null : filters.status,
        tahun_aktif: filters.tahun_aktif || null // Tambahkan filter tahun_aktif
      };

      // Remove undefined/null values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get('/skema', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching skema:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal memuat data skema',
        error: error.response?.data
      };
    }
  }

  async getSkemaById(id) {
    try {
      const response = await api.get(`/skema/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching skema by ID:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal mengambil detail skema',
        error: error.response?.data
      };
    }
  }

  async getActiveSkema() {
    try {
      const response = await api.get('/skema/active');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching active skema:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal memuat skema aktif',
        data: []
      };
    }
  }

  async getSkemaStats() {
    try {
      const response = await api.get('/skema/stats');
      return {
        success: true,
        data: response.data.data || {}
      };
    } catch (error) {
      console.error('Error fetching skema stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal mengambil statistik skema',
        data: {}
      };
    }
  }

  async createSkema(skemaData) {
    try {
      const payload = {
        kode: skemaData.kode,
        nama: skemaData.nama,
        kategori: skemaData.kategori,
        luaran_wajib: skemaData.luaran_wajib || null,
        dana_min: skemaData.dana_min ? parseFloat(skemaData.dana_min) : null,
        dana_max: skemaData.dana_max ? parseFloat(skemaData.dana_max) : null,
        batas_anggota: parseInt(skemaData.batas_anggota) || 5,
        tahun_aktif: skemaData.tahun_aktif,
        tanggal_buka: skemaData.tanggal_buka || null,
        tanggal_tutup: skemaData.tanggal_tutup || null,
        status: skemaData.status || 'AKTIF'
      };

      // Remove empty values except for allowed null fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
          if (!['luaran_wajib', 'dana_min', 'dana_max', 'tanggal_buka', 'tanggal_tutup'].includes(key)) {
            delete payload[key];
          }
        }
      });
      
      const response = await api.post('/skema', payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating skema:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal membuat skema',
        error: error.response?.data
      };
    }
  }

  async updateSkema(id, skemaData) {
    try {
      const payload = {
        kode: skemaData.kode,
        nama: skemaData.nama,
        kategori: skemaData.kategori,
        luaran_wajib: skemaData.luaran_wajib || null,
        dana_min: skemaData.dana_min ? parseFloat(skemaData.dana_min) : null,
        dana_max: skemaData.dana_max ? parseFloat(skemaData.dana_max) : null,
        batas_anggota: parseInt(skemaData.batas_anggota) || 5,
        tahun_aktif: skemaData.tahun_aktif,
        tanggal_buka: skemaData.tanggal_buka || null,
        tanggal_tutup: skemaData.tanggal_tutup || null,
        status: skemaData.status || 'AKTIF'
      };

      // Remove empty values except for allowed null fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
          if (!['luaran_wajib', 'dana_min', 'dana_max', 'tanggal_buka', 'tanggal_tutup'].includes(key)) {
            delete payload[key];
          }
        }
      });
      
      const response = await api.put(`/skema/${id}`, payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating skema:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal memperbarui skema',
        error: error.response?.data
      };
    }
  }

  async deleteSkema(id) {
    try {
      const response = await api.delete(`/skema/${id}`);
      return {
        success: true,
        message: response.data.message || 'Skema berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting skema:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal menghapus skema',
        error: error.response?.data
      };
    }
  }
}

const skemaService = new SkemaService();
export default skemaService;