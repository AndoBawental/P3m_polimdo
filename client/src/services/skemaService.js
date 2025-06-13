// src/services/skemaService.js
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
        status: filters.status === 'Semua Status' ? null : filters.status
      };

      // Remove undefined/null values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get('/skema', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching skema:', error);
      throw error;
    }
  }

  async getSkemaById(id) {
    try {
      const response = await api.get(`/skema/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skema by ID:', error);
      throw error;
    }
  }

  // TAMBAHKAN METHOD UNTUK MENGAMBIL SKEMA AKTIF
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
        error: error.response?.data?.message || 'Failed to fetch active skema',
        data: []
      };
    }
  }

  // TAMBAHKAN METHOD UNTUK STATS SKEMA
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
        error: error.response?.data?.message || 'Failed to fetch skema stats',
        data: {}
      };
    }
  }

 async createSkema(skemaData) {
  try {
    console.log('Sending skema data:', skemaData); // Debug log
    
    // PERBAIKAN: Pastikan data yang dikirim sesuai format
    const payload = {
      kode: skemaData.kode,
      nama: skemaData.nama,
      kategori: skemaData.kategori, // Jangan ubah ke uppercase di sini, biarkan backend yang handle
      luaran_wajib: skemaData.luaran_wajib || null,
      dana_min: skemaData.dana_min ? parseFloat(skemaData.dana_min) : null,
      dana_max: skemaData.dana_max ? parseFloat(skemaData.dana_max) : null,
      batas_anggota: parseInt(skemaData.batas_anggota) || 5,
      tahun_aktif: skemaData.tahun_aktif,  // Pastikan ini dikirim
      tanggal_buka: skemaData.tanggal_buka || null,
      tanggal_tutup: skemaData.tanggal_tutup || null,
      status: skemaData.status || 'AKTIF'
    };

    // Remove null/undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
        if (!['luaran_wajib', 'dana_min', 'dana_max', 'tanggal_buka', 'tanggal_tutup'].includes(key)) {
          delete payload[key];
        }
      }
    });

    console.log('Final payload:', payload); // Debug log
   
    const response = await api.post('/skema', payload);
    
    console.log('Response:', response.data); // Debug log
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
    
  } catch (error) {
    console.error('Error creating skema:', error);
    console.error('Error response:', error.response?.data);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Gagal membuat skema',
      error: error.response?.data
    };
  }
}

 async updateSkema(id, skemaData) {
  try {
    const payload = {
      kode: skemaData.kode,
      nama: skemaData.nama,
      kategori: skemaData.kategori, // Hapus .toUpperCase() karena sudah dihandle di backend
      luaran_wajib: skemaData.luaran_wajib || null,
      dana_min: skemaData.dana_min ? parseFloat(skemaData.dana_min) : null,
      dana_max: skemaData.dana_max ? parseFloat(skemaData.dana_max) : null,
      batas_anggota: parseInt(skemaData.batas_anggota) || 5,
      tahun_aktif: skemaData.tahun_aktif,
      tanggal_buka: skemaData.tanggal_buka || null,
      tanggal_tutup: skemaData.tanggal_tutup || null,
      status: skemaData.status || 'AKTIF'
    };

    // Remove null/undefined values kecuali yang boleh null
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
      message: error.response?.data?.message || error.message || 'Gagal memperbarui skema',
      error: error.response?.data
    };
  }
}

  async deleteSkema(id) {
    try {
      const response = await api.delete(`/skema/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting skema:', error);
      throw error;
    }
  }
}

const skemaService = new SkemaService();
export default skemaService;