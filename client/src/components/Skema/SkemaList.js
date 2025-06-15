// client/src/components/Skema/SkemaList.js
import React, { useState, useEffect } from 'react';
import SkemaCard from './SkemaCard';
import SearchBar from '../Common/SearchBar';
import Pagination from '../Common/Pagination';
import skemaService from '../../services/skemaService';

const SkemaList = ({ 
  showActions = true, 
  onEdit, 
  onDelete, 
  filters: externalFilters = {},
  showFilters = true 
}) => {
  const [skemas, setSkemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byKategori: {}
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Local filters
  const [filters, setFilters] = useState({
    search: '',
    kategori: 'Semua Kategori',
    status: 'Semua Status',
    tahun_aktif: '',
    ...externalFilters
  });

  const kategoriOptions = [
    'Semua Kategori',
    'Penelitian',
    'Pengabdian',
  ];

  const statusOptions = [
    'Semua Status',
    'AKTIF',
    'NONAKTIF'
  ];

  // Generate tahun options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const tahunOptions = [''].concat(
    Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
  );

  const fetchStats = async () => {
    try {
      const response = await skemaService.getSkemaStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching skema stats:', error);
    }
  };

  const fetchSkemas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = {
        ...filters,
        ...externalFilters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await skemaService.getAllSkema(queryFilters);
      
      if (response.success) {
        setSkemas(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.pages || 0
        }));
      } else {
        setError(response.message || 'Gagal memuat data skema');
      }
    } catch (error) {
      console.error('Error fetching skemas:', error);
      setError('Terjadi kesalahan saat memuat data skema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSkemas();
  }, []);

  useEffect(() => {
    fetchSkemas();
  }, [pagination.page, filters, externalFilters]);

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (skema) => {
    if (onEdit) {
      onEdit(skema);
    }
  };

  const handleDelete = async (skema) => {
    if (onDelete) {
      const success = await onDelete(skema);
      if (success) {
        fetchSkemas(); // Refresh data after delete
        fetchStats(); // Refresh stats after delete
      }
    }
  };

  if (loading && skemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Memuat data skema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Statistik */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Skema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">Total Skema</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.total || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-800">Penelitian</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.byKategori?.PENELITIAN || 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-800">Pengabdian</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.byKategori?.PENGABDIAN || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Cari nama, kode, atau tahun skema..."
                onSearch={handleSearch}
                value={filters.search}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">
                Kategori
                {stats.byKategori && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({stats.byKategori.PENELITIAN || 0} Penelitian, {stats.byKategori.PENGABDIAN || 0} Pengabdian)
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  value={filters.kategori}
                  onChange={(e) => handleFilterChange('kategori', e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition"
                >
                  {kategoriOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">
                Status
              </label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">
                Tahun Aktif
              </label>
              <div className="relative">
                <select
                  value={filters.tahun_aktif}
                  onChange={(e) => handleFilterChange('tahun_aktif', e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition"
                >
                  <option value="">Semua Tahun</option>
                  {tahunOptions.slice(1).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Info and Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Menampilkan <span className="font-medium mx-1">{skemas.length}</span> dari <span className="font-medium mx-1">{pagination.total}</span> skema
        </div>
        
        <div className="flex items-center">
          {loading && (
            <div className="text-sm text-blue-600 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat data...
            </div>
          )}
          
          <button 
            onClick={() => {
              fetchStats();
              fetchSkemas();
            }}
            className="ml-3 flex items-center text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Segarkan
          </button>
        </div>
      </div>

      {/* Skema Grid */}
      {skemas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skemas.map(skema => (
            <SkemaCard
              key={skema.id}
              skema={skema}
              showActions={showActions}
              onEdit={showActions ? handleEdit : undefined}
              onDelete={showActions ? handleDelete : undefined}
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto max-w-md">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada skema ditemukan</h3>
            <p className="mt-2 text-gray-500">
              Tidak ada skema yang sesuai dengan filter Anda. Coba ubah kriteria pencarian atau tambah skema baru.
            </p>
            {showActions && (
              <button
                onClick={() => window.location.href = '/skema/create'}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Skema Baru
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={5}
            className="rounded-lg shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default SkemaList;