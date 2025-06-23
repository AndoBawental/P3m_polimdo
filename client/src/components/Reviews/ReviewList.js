import React, { useState, useEffect } from 'react';
import { X, CalendarDays, User, MessageSquare, Search, Eye, Edit, FileText, Users, Clock, CheckCircle, Star, Plus, Filter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ReviewService from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import Loading from '../Common/Loading';
import Pagination from '../Common/Pagination';
import { motion } from 'framer-motion';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [proposalsToReview, setProposalsToReview] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    layak: 0,
    tidak_layak: 0,
    revisi: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    reviewer: 'all',
    page: 1,
    limit: 10
  });

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedProposalForView, setSelectedProposalForView] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchReviewers();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchReviews(),
        (user?.role === 'REVIEWER' || user?.role === 'ADMIN') && fetchProposalsToReview()
      ]);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await ReviewService.getReviews(filters);
      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
      setStats(response.data.stats);
    } catch (err) {
      setError(err.message || 'Gagal memuat data review');
    }
  };

  const fetchProposalsToReview = async () => {
    try {
      const params = { 
        search: filters.search,
        reviewerId: user?.role === 'REVIEWER' ? user.id : undefined,
        status: 'SUBMITTED,REVIEW'
      };
      
      const response = await ReviewService.getProposalsToReview(params);
      setProposalsToReview(response.data.proposals || []);
    } catch (err) {
      console.error('Gagal mengambil proposal yang perlu direview:', err);
    }
  };

  const fetchReviewers = async () => {
    try {
      const response = await ReviewService.getReviewers();
      setReviewers(response.data || []);
    } catch (err) {
      console.error('Gagal mengambil data reviewer:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  const handleViewProposal = (proposal) => {
    setSelectedProposalForView(proposal);
    setShowProposalModal(true);
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setShowEditModal(true);
  };

  const handleCreateReview = (proposal) => {
    setSelectedProposal(proposal);
    setShowCreateModal(true);
  };

  const handleSuccess = () => {
    setShowEditModal(false);
    setShowCreateModal(false);
    setSelectedReview(null);
    setSelectedProposal(null);
    fetchData();
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'LAYAK':
      case 'APPROVED':
      case 'DITERIMA':
        return 'bg-green-100 text-green-800';
      case 'TIDAK_LAYAK':
      case 'REJECTED':
      case 'DITOLAK':
        return 'bg-red-100 text-red-800';
      case 'REVISI':
      case 'REVISION':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEW':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProposalStatusLabel = (status) => {
    const labels = {
      'SUBMITTED': 'Perlu Review',
      'REVIEW': 'Sedang Review',
      'APPROVED': 'Disetujui',
      'REJECTED': 'Ditolak',
      'REVISION': 'Perlu Revisi',
      'DRAFT': 'Draft'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'MAHASISWA':
        return 'Review Proposal Saya';
      case 'DOSEN':
        return 'Hasil Review Proposal';
      case 'REVIEWER':
        return 'Review Proposal';
      case 'ADMIN':
        return 'Kelola Review';
      default:
        return 'Review Proposal';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'MAHASISWA':
        return 'Lihat hasil review untuk proposal yang Anda ajukan';
      case 'DOSEN':
        return 'Lihat hasil review proposal penelitian dan pengabdian';
      case 'REVIEWER':
        return 'Buat dan kelola review untuk proposal yang ditugaskan';
      case 'ADMIN':
        return 'Kelola semua review proposal penelitian dan pengabdian';
      default:
        return 'Kelola review proposal';
    }
  };

  const canEditReview = (review) => {
    if (user?.role === 'ADMIN') return true;
    
    if (user?.role === 'REVIEWER' && review.reviewer.id === user.id) {
      const editableStatuses = ['REVIEW', 'SUBMITTED'];
      return editableStatuses.includes(review.proposal.status);
    }
    
    return false;
  };

  const canCreateReview = (proposal) => {
    if (user?.role === 'ADMIN') return true;
    
    if (user?.role === 'REVIEWER') {
      const reviewableStatuses = ['SUBMITTED', 'REVIEW'];
      const hasReviewed = proposal.reviews?.some(review => review.reviewer.id === user.id);
      return reviewableStatuses.includes(proposal.status) && !hasReviewed;
    }
    
    return false;
  };

  if (loading) return <Loading />;

  const combinedData = [
    ...reviews,
    ...proposalsToReview.map(proposal => ({
      id: null,
      proposal,
      status: 'PENDING_REVIEW',
      reviewer: proposal.reviewer || { id: user.id, nama: user.nama }
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{getPageTitle()}</h2>
            <p className="text-blue-100 mt-1">{getPageDescription()}</p>
          </div>
          
          {user?.role === 'REVIEWER' && proposalsToReview.length > 0 && (
            <motion.button
             
            >
            
             
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Reviews', 
            value: stats.total, 
            icon: <FileText className="h-6 w-6 text-blue-600" />,
            bg: 'bg-blue-100'
          },
          { 
            label: 'Layak', 
            value: stats.layak, 
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            bg: 'bg-green-100'
          },
          { 
            label: 'Perlu Revisi', 
            value: stats.revisi, 
            icon: <Clock className="h-6 w-6 text-yellow-600" />,
            bg: 'bg-yellow-100'
          },
          { 
            label: 'Tidak Layak', 
            value: stats.tidak_layak, 
            icon: <Users className="h-6 w-6 text-red-600" />,
            bg: 'bg-red-100'
          }
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center p-5">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">Filter Data</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul proposal..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="LAYAK">Layak</option>
            <option value="TIDAK_LAYAK">Tidak Layak</option>
            <option value="REVISI">Perlu Revisi</option>
          </select>

          {user?.role === 'ADMIN' && (
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={filters.reviewer}
              onChange={(e) => handleFilterChange('reviewer', e.target.value)}
            >
              <option value="all">Semua Reviewer</option>
              {reviewers.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.nama}
                </option>
              ))}
            </select>
          )}

          <select
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
          >
            <option value={10}>10 per halaman</option>
            <option value={20}>20 per halaman</option>
            <option value={50}>50 per halaman</option>
          </select>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Reviews Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Proposal
                </th>
                {(user?.role === 'ADMIN' || user?.role === 'DOSEN') && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Reviewer
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Skor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Rekomendasi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {combinedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <h4 className="text-lg font-medium text-gray-500 mb-1">
                        {user?.role === 'MAHASISWA' ? 
                          'Belum ada review untuk proposal Anda' : 
                          user?.role === 'REVIEWER' ?
                          'Belum ada proposal yang ditugaskan untuk direview' :
                          'Belum ada data review'
                        }
                      </h4>
                      <p className="text-sm text-gray-400">
                        Silakan coba filter yang berbeda atau tambahkan data baru
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                combinedData.map((item) => {
                  const isReview = item.id !== null;
                  
                  return (
                    <motion.tr 
                      key={isReview ? `review-${item.id}` : `proposal-${item.proposal.id}`}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-lg p-2 mr-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {item.proposal.judul}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              {user?.role !== 'MAHASISWA' && (
                                <span className="flex items-center mr-3">
                                  <User className="h-3 w-3 mr-1" />
                                  {item.proposal.ketua.nama}
                                </span>
                              )}
                              <span className="flex items-center">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                {item.proposal.tahun}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {(user?.role === 'ADMIN' || user?.role === 'DOSEN') && (
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-lg p-2 mr-3">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.reviewer?.nama || 'Belum ditugaskan'}
                              </div>
                              {item.reviewer?.bidang_keahlian && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.reviewer.bidang_keahlian}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.proposal.status)}`}>
                          {getProposalStatusLabel(item.proposal.status)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        {isReview && item.skor_total ? (
                          <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 w-fit">
                            <Star className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="text-sm font-medium text-blue-800">
                              {parseFloat(item.skor_total).toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">-</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        {isReview ? (
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.rekomendasi)}`}>
                            {ReviewService.getStatusLabel(item.rekomendasi)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">-</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {isReview ? 
                          formatDate(item.tanggal_review) : 
                          formatDate(item.proposal.createdAt)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {isReview ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleViewReview(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="h-5 w-5" />
                              </motion.button>
                              
                              {canEditReview(item) && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditReview(item)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit Review"
                                >
                                  <Edit className="h-5 w-5" />
                                </motion.button>
                              )}
                            </>
                          ) : (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleViewProposal(item.proposal)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Proposal"
                              >
                                <Eye className="h-5 w-5" />
                              </motion.button>
                              
                              {canCreateReview(item.proposal) && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleCreateReview(item.proposal)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Buat Review"
                                >
                                  <Plus className="h-5 w-5" />
                                </motion.button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* View Review Modal */}
      {showViewModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Detail Review</h3>
                <p className="text-blue-100 mt-1 flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(selectedReview.tanggal_review)}</span>
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-6 space-y-6">
              {/* Proposal Info */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Informasi Proposal</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Judul</span>
                    <p className="text-gray-900 font-medium mt-1 line-clamp-2">
                      {selectedReview.proposal.judul}
                    </p>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Ketua</span>
                    <p className="text-gray-900 font-medium mt-1">
                      {selectedReview.proposal.ketua.nama}
                    </p>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Tahun</span>
                    <p className="text-gray-900 font-medium mt-1">
                      {selectedReview.proposal.tahun}
                    </p>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <div className="mt-1">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusBadgeColor(selectedReview.proposal.status)
                      }`}>
                        {getProposalStatusLabel(selectedReview.proposal.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviewer Info */}
              {user?.role !== 'MAHASISWA' && (
                <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-indigo-600" />
                    <h4 className="text-lg font-semibold text-gray-800">Informasi Reviewer</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Nama</span>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedReview.reviewer.nama}
                      </p>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Email</span>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedReview.reviewer.email}
                      </p>
                    </div>
                    
                    {selectedReview.reviewer.bidang_keahlian && (
                      <div className="md:col-span-2 flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Bidang Keahlian</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {selectedReview.reviewer.bidang_keahlian.split(',').map((bidang, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {bidang.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Review Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex flex-col items-center">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Skor Total</h4>
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {selectedReview.skor_total ? parseFloat(selectedReview.skor_total).toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-full border-8 border-blue-100 opacity-30"></div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex flex-col items-center h-full justify-center">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Rekomendasi</h4>
                    <div className="text-center">
                      <span className={`inline-flex px-4 py-2 text-lg font-bold rounded-full ${
                        getStatusBadgeColor(selectedReview.rekomendasi)
                      }`}>
                        {ReviewService.getStatusLabel(selectedReview.rekomendasi)}
                      </span>
                      <p className="mt-3 text-gray-600 text-sm">
                        {selectedReview.rekomendasi === 'DITERIMA' 
                          ? 'Proposal memenuhi semua kriteria yang ditetapkan' 
                          : selectedReview.rekomendasi === 'DITOLAK'
                            ? 'Proposal belum memenuhi standar yang ditetapkan'
                            : 'Proposal memerlukan perbaikan untuk dapat disetujui'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Review Notes */}
              {selectedReview.catatan && (
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-800">Catatan Reviewer</h4>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedReview.catatan}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t p-4 bg-gray-50 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Tutup
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedReview && (
        <ReviewForm
          review={selectedReview}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Create Review Modal */}
      {showCreateModal && selectedProposal && (
        <ReviewForm
          proposal={selectedProposal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Proposal Detail Modal */}
      {showProposalModal && selectedProposalForView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Detail Proposal</h3>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-7 w-7" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow p-6 space-y-6">
              <div className="space-y-6">
                {/* Proposal Info */}
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-800">Informasi Proposal</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Judul</span>
                      <p className="text-gray-900 font-medium mt-1">{selectedProposalForView.judul}</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Ketua</span>
                      <p className="text-gray-900 font-medium mt-1">{selectedProposalForView.ketua.nama}</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Tahun</span>
                      <p className="text-gray-900 font-medium mt-1">{selectedProposalForView.tahun}</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedProposalForView.status)}`}>
                          {getProposalStatusLabel(selectedProposalForView.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Skema</span>
                      <p className="text-gray-900 font-medium mt-1">{selectedProposalForView.skema?.nama || '-'}</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Dana Diusulkan</span>
                      <p className="text-gray-900 font-medium mt-1">{formatCurrency(selectedProposalForView.dana_diusulkan)}</p>
                    </div>
                  </div>
                </div>

                {/* Reviewer Info */}
                {selectedProposalForView.reviewer && (
                  <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-indigo-600" />
                      <h4 className="text-lg font-semibold text-gray-800">Reviewer</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Nama</span>
                        <p className="text-gray-900 font-medium mt-1">{selectedProposalForView.reviewer.nama}</p>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Email</span>
                        <p className="text-gray-900 font-medium mt-1">{selectedProposalForView.reviewer.email}</p>
                      </div>
                      
                      {selectedProposalForView.reviewer.bidang_keahlian && (
                        <div className="md:col-span-2 flex flex-col">
                          <span className="text-sm font-medium text-gray-500">Bidang Keahlian</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {selectedProposalForView.reviewer.bidang_keahlian.split(',').map((bidang, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {bidang.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Abstrak */}
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-800">Abstrak</h4>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedProposalForView.abstrak || 'Tidak ada abstrak'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t p-4 bg-gray-50 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProposalModal(false)}
                className="px-5 py-2.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Tutup
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;