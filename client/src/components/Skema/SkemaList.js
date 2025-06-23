import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/Common/Pagination';
import SearchBar from '../../components/Common/SearchBar';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrash, FaPlus, FaFileAlt, FaChartBar, FaClock, FaBan, FaCheck, FaSync } from 'react-icons/fa';

const SkemaList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State untuk data utama
  const [skemas, setSkemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State untuk filter
  const [filters, setFilters] = useState({
    search: '',
    kategori: '',
    status: '',
    tahun_aktif: '',
    page: 1,
    limit: 10
  });
  
  // State untuk pagination
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasPrev: false,
    hasNext: false,
    page: 1
  });

  // State untuk statistik
  const [stats, setStats] = useState({
    total: 0,
    aktif: 0,
    nonaktif: 0,
    berjalan: 0
  });

  // Animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 120 
      }
    }
  };

  // Fungsi untuk menghitung statistik berdasarkan periode
  const calculateStats = (skemaData, totalCount) => {
    const now = new Date();
    
    let aktif = 0;
    let nonaktif = 0;
    let berjalan = 0;

    skemaData.forEach(skema => {
      if (skema.status === 'NONAKTIF') {
        nonaktif++;
      } else {
        if (skema.tanggal_buka && skema.tanggal_tutup) {
          const tanggalBuka = new Date(skema.tanggal_buka);
          const tanggalTutup = new Date(skema.tanggal_tutup);
          
          if (now > tanggalTutup) {
            nonaktif++;
          } 
          else if (tanggalBuka <= now && now <= tanggalTutup) {
            aktif++;
            berjalan++;
          }
          else {
            aktif++;
          }
        } 
        else {
          aktif++;
        }
      }
    });
    
    return {
      total: totalCount || 0,
      aktif,
      nonaktif,
      berjalan
    };
  };

  // Fungsi untuk mengambil data skema
  const fetchSkemas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        ...filters,
        tahun_aktif: filters.tahun_aktif || undefined
      };
      
      const response = await skemaService.getAllSkema(params);
      
      if (response && response.success) {
        const skemaData = response.data?.skemas || [];
        const paginationData = response.data?.pagination || {};
        
        setSkemas(skemaData);
        
        setPagination({
          total: paginationData.total || 0,
          totalPages: paginationData.totalPages || 0,
          hasPrev: paginationData.hasPrev || false,
          hasNext: paginationData.hasNext || false,
          page: paginationData.page || 1
        });
        
        const newStats = calculateStats(skemaData, paginationData.total);
        setStats(newStats);
        
      } else {
        const errorMsg = response?.message || 'Gagal memuat data skema';
        setError(errorMsg);
        showToast('error', errorMsg);
        
        setSkemas([]);
        setPagination({ total: 0, totalPages: 0, hasPrev: false, hasNext: false, page: 1 });
        setStats({ total: 0, aktif: 0, nonaktif: 0, berjalan: 0 });
      }
    } catch (err) {
      console.error('Error fetching skemas:', err);
      const errorMsg = 'Terjadi kesalahan saat memuat data skema';
      setError(errorMsg);
      showToast('error', errorMsg);
      
      setSkemas([]);
      setPagination({ total: 0, totalPages: 0, hasPrev: false, hasNext: false, page: 1 });
      setStats({ total: 0, aktif: 0, nonaktif: 0, berjalan: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk mengambil data saat filter berubah
  useEffect(() => {
    fetchSkemas();
  }, [filters]);

  // Handler untuk pencarian
  const handleSearchChange = (value) => {
    setFilters(prev => ({ 
      ...prev, 
      search: value,
      page: 1
    }));
  };

  // Handler untuk filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: 1
    }));
  };

  // Handler untuk pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler untuk hapus skema
  const handleDelete = async (id, skemaName) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus skema "${skemaName}"?`;
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const response = await skemaService.deleteSkema(id);
      
      if (response && response.success) {
        showToast('success', 'Skema berhasil dihapus');
        fetchSkemas();
      } else {
        const errorMsg = response?.message || 'Gagal menghapus skema';
        showToast('error', errorMsg);
      }
    } catch (error) {
      console.error('Error deleting skema:', error);
      showToast('error', 'Terjadi kesalahan saat menghapus skema');
    }
  };

  // Fungsi helper untuk format currency
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '-';
    
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fungsi helper untuk mendapatkan label kategori
  const getKategoriLabel = (kategori) => {
    switch(kategori) {
      case 'PENELITIAN': return 'Penelitian';
      case 'PENGABDIAN': return 'Pengabdian';
      default: return kategori || '-';
    }
  };

  // Fungsi untuk menentukan status skema berdasarkan periode
  const getSkemaStatus = (skema) => {
    const now = new Date();
    
    if (skema.status === 'NONAKTIF') {
      return { label: 'Non-Aktif', class: 'bg-red-100 text-red-800', icon: <FaBan className="mr-1" /> };
    }
    
    if (skema.tanggal_buka && skema.tanggal_tutup) {
      const tanggalBuka = new Date(skema.tanggal_buka);
      const tanggalTutup = new Date(skema.tanggal_tutup);
      
      if (now > tanggalTutup) {
        return { label: 'Non-Aktif', class: 'bg-red-100 text-red-800', icon: <FaBan className="mr-1" /> };
      } 
      else if (tanggalBuka <= now && now <= tanggalTutup) {
        return { label: 'Berjalan', class: 'bg-green-100 text-green-800', icon: <FaClock className="mr-1" /> };
      }
      else {
        return { label: 'Aktif', class: 'bg-yellow-100 text-yellow-800', icon: <FaCheck className="mr-1" /> };
      }
    } 
    else {
      return { label: 'Aktif', class: 'bg-yellow-100 text-yellow-800', icon: <FaCheck className="mr-1" /> };
    }
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    
    try {
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return '-';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-blue-600 mb-6"
            >
              <FaSync className="h-16 w-16" />
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            >
              Memuat data skema...
            </motion.h2>
            <p className="text-gray-600">Harap tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
       
        {/* Statistik Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-lg mr-4 bg-blue-100 text-blue-600">
                <FaChartBar className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Skema</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-lg mr-4 bg-green-100 text-green-600">
                <FaCheck className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Skema Aktif</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.aktif}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg border border-red-100 hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-lg mr-4 bg-red-100 text-red-600">
                <FaBan className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Skema Non-Aktif</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.nonaktif}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-5 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-lg mr-4 bg-purple-100 text-purple-600">
                <FaClock className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Sedang Berjalan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.berjalan}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <SearchBar 
                placeholder="Cari nama atau kode skema..."
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Filter Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filters.kategori}
                onChange={(e) => handleFilterChange('kategori', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Semua Kategori</option>
                <option value="PENELITIAN">Penelitian</option>
                <option value="PENGABDIAN">Pengabdian</option>
              </select>
            </div>
            
            {/* Filter Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="NONAKTIF">Non-Aktif</option>
              </select>
            </div>
            
            {/* Filter Tahun Aktif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Aktif</label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={filters.tahun_aktif}
                onChange={(e) => handleFilterChange('tahun_aktif', e.target.value)}
                placeholder="Tahun"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          
          {/* Tombol Reset Filter */}
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Menampilkan {pagination.total > 0 ? skemas.length : 0} dari {pagination.total} skema
              {(filters.search || filters.kategori || filters.status || filters.tahun_aktif) && (
                <span> (terfilter)</span>
              )}
            </div>
            
            <button
              onClick={() => setFilters({
                search: '',
                kategori: '',
                status: '',
                tahun_aktif: '',
                page: 1,
                limit: 10
              })}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-all"
            >
              <FaSync className="mr-2" />
              Reset Filter
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 flex items-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex-shrink-0 mr-3">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Gagal memuat data</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Table Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {skemas.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600">
                <FaFileAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {filters.search || filters.kategori || filters.status || filters.tahun_aktif
                  ? 'Tidak ada skema yang sesuai'
                  : 'Belum ada skema pendanaan'
                }
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {filters.search || filters.kategori || filters.status || filters.tahun_aktif
                  ? 'Coba ubah filter pencarian Anda atau reset filter untuk melihat semua skema'
                  : 'Mulai dengan menambahkan skema pendanaan baru'
                }
              </p>
              <Link
                to="/skema/create"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FaPlus className="mr-2" />
                Tambah Skema Baru
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Informasi Skema
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dana
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposal
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skemas.map((skema, index) => {
                    const statusInfo = getSkemaStatus(skema);
                    const proposalCount = skema._count?.proposals || 0;
                    const canDelete = proposalCount === 0;
                    
                    return (
                      <motion.tr 
                        key={skema.id} 
                        className="hover:bg-blue-50 transition-colors"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                      >
                        {/* Informasi Skema */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-gray-900 text-base">{skema.nama}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">Kode: {skema.kode || '-'}</span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded">Tahun: {skema.tahun_aktif || '-'}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Kategori */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            skema.kategori === 'PENELITIAN' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {getKategoriLabel(skema.kategori)}
                          </span>
                        </td>
                        
                        {/* Dana */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {skema.dana_min || skema.dana_max ? (
                            <div className="text-sm">
                              <div className="font-medium">{formatCurrency(skema.dana_min)}</div>
                              {skema.dana_max && skema.dana_max !== skema.dana_min && (
                                <div className="text-xs text-gray-500 mt-1">
                                  hingga {formatCurrency(skema.dana_max)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        
                        {/* Periode */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium">
                              {skema.tanggal_buka 
                                ? formatDate(skema.tanggal_buka)
                                : '-'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              s/d {skema.tanggal_tutup 
                                ? formatDate(skema.tanggal_tutup) 
                                : '-'}
                            </div>
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center ${statusInfo.class}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </td>
                        
                        {/* Jumlah Proposal */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium inline-flex items-center">
                            <FaFileAlt className="mr-1.5" />
                            {proposalCount}
                          </span>
                        </td>
                        
                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {/* View Button */}
                            <Link
                              to={`/skema/${skema.id}`}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-100 rounded-full transition-colors"
                              title="Lihat Detail"
                            >
                              <FaEye className="text-lg" />
                            </Link>
                            
                            {/* Edit Button */}
                            <Link
                              to={`/skema/${skema.id}/edit`}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-100 rounded-full transition-colors"
                              title="Edit Skema"
                            >
                              <FaEdit className="text-lg" />
                            </Link>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(skema.id, skema.nama)}
                              className={`p-2 rounded-full transition-colors ${
                                canDelete 
                                  ? 'text-red-600 hover:text-red-900 hover:bg-red-100'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title={canDelete ? "Hapus Skema" : `Tidak dapat dihapus (${proposalCount} proposal terkait)`}
                              disabled={!canDelete}
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination 
              currentPage={filters.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SkemaList;