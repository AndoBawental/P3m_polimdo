import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import { useAuth } from '../../hooks/useAuth';
import { 
  Search, 
  Eye,
  Edit,
  FileText,
  Users,
  Clock,
  CheckCircle,
  Star,
  Plus,
  Filter
} from 'lucide-react';
import ReviewService from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import Loading from '../Common/Loading';
import Pagination from '../Common/Pagination';

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
  const [showProposalModal, setShowProposalModal] = useState(false); // Modal baru untuk proposal
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedProposalForView, setSelectedProposalForView] = useState(null); // State baru untuk proposal yang dilihat

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
    // Fetch reviewers for admin filter
    if (user?.role === 'ADMIN') {
      fetchReviewers();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch reviews dan proposals untuk direview secara paralel
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
        // Reviewer hanya melihat proposal yang ditugaskan kepadanya
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

  // Fungsi baru untuk melihat detail proposal
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
        return 'bg-green-100 text-green-800';
      case 'TIDAK_LAYAK':
        return 'bg-red-100 text-red-800';
      case 'REVISI':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'REVISION':
        return 'bg-yellow-100 text-yellow-800';
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

  // Gabungkan data review dan proposal yang perlu direview
  const combinedData = [
    ...reviews,
    ...proposalsToReview.map(proposal => ({
      id: null, // Menandakan belum ada review
      proposal,
      status: 'PENDING_REVIEW',
      reviewer: proposal.reviewer || { id: user.id, nama: user.nama }
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
          <p className="text-gray-600">{getPageDescription()}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Layak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.layak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Perlu Revisi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revisi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tidak Layak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tidak_layak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul proposal..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="LAYAK">Layak</option>
            <option value="TIDAK_LAYAK">Tidak Layak</option>
            <option value="REVISI">Perlu Revisi</option>
          </select>

          {/* Reviewer Filter - Admin Only */}
          {user?.role === 'ADMIN' && (
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Items per page */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
          >
            <option value={10}>10 per halaman</option>
            <option value={20}>20 per halaman</option>
            <option value={50}>50 per halaman</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposal
                </th>
                {(user?.role === 'ADMIN' || user?.role === 'DOSEN') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewer
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rekomendasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {combinedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {user?.role === 'MAHASISWA' ? 
                      'Belum ada review untuk proposal Anda' : 
                      user?.role === 'REVIEWER' ?
                      'Belum ada proposal yang ditugaskan untuk direview' :
                      'Belum ada data review'
                    }
                  </td>
                </tr>
              ) : (
                combinedData.map((item) => {
                  const isReview = item.id !== null;
                  
                  return (
                    <tr key={isReview ? `review-${item.id}` : `proposal-${item.proposal.id}`} 
                        className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.proposal.judul}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {user?.role !== 'MAHASISWA' && `${item.proposal.ketua.nama} • `}
                            {item.proposal.tahun}
                          </div>
                        </div>
                      </td>
                      
                      {(user?.role === 'ADMIN' || user?.role === 'DOSEN') && (
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.reviewer?.nama || 'Belum ditugaskan'}
                            </div>
                            {item.reviewer?.bidang_keahlian && (
                              <div className="text-sm text-gray-500">
                                {item.reviewer.bidang_keahlian}
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.proposal.status)}`}>
                          {getProposalStatusLabel(item.proposal.status)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        {isReview ? (
                          item.skor_total ? 
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center w-fit">
                              <Star className="h-3 w-3 mr-1" />
                              {parseFloat(item.skor_total).toFixed(1)}
                            </span> 
                            : 
                            <span className="text-gray-400">Belum dinilai</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        {isReview ? (
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.rekomendasi)}`}>
                            {ReviewService.getStatusLabel(item.rekomendasi)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
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
                              <button
                                onClick={() => handleViewReview(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              
                              {canEditReview(item) && (
                                <button
                                  onClick={() => handleEditReview(item)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit Review"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleViewProposal(item.proposal)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Proposal"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              
                              {canCreateReview(item.proposal) && (
                                <button
                                  onClick={() => handleCreateReview(item.proposal)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Buat Review"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* View Modal */}
      {showViewModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Review
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Proposal Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Informasi Proposal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Judul:</span>
                      <p className="text-gray-900 mt-1">{selectedReview.proposal.judul}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ketua:</span>
                      <p className="text-gray-900 mt-1">{selectedReview.proposal.ketua.nama}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tahun:</span>
                      <p className="text-gray-900 mt-1">{selectedReview.proposal.tahun}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900 mt-1">{selectedReview.proposal.status}</p>
                    </div>
                  </div>
                </div>

                {/* Reviewer Info */}
                {user?.role !== 'MAHASISWA' && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Informasi Reviewer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nama:</span>
                        <p className="text-gray-900 mt-1">{selectedReview.reviewer.nama}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900 mt-1">{selectedReview.reviewer.email}</p>
                      </div>
                      {selectedReview.reviewer.bidang_keahlian && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Bidang Keahlian:</span>
                          <p className="text-gray-900 mt-1">{selectedReview.reviewer.bidang_keahlian}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Skor Total</h4>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedReview.skor_total ? parseFloat(selectedReview.skor_total).toFixed(1) : 'Belum dinilai'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Rekomendasi</h4>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(selectedReview.rekomendasi)}`}>
                      {ReviewService.getStatusLabel(selectedReview.rekomendasi)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tanggal Review</h4>
                  <p className="text-gray-900">{formatDate(selectedReview.tanggal_review)}</p>
                </div>
                
                {/* Catatan Review */}
                {selectedReview.catatan && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Catatan Review</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.catatan}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Proposal
                </h3>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Proposal Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Informasi Proposal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Judul:</span>
                      <p className="text-gray-900 mt-1">{selectedProposalForView.judul}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ketua:</span>
                      <p className="text-gray-900 mt-1">{selectedProposalForView.ketua.nama}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tahun:</span>
                      <p className="text-gray-900 mt-1">{selectedProposalForView.tahun}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900 mt-1">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedProposalForView.status)}`}>
                          {getProposalStatusLabel(selectedProposalForView.status)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Skema:</span>
                      <p className="text-gray-900 mt-1">{selectedProposalForView.skema?.nama || '-'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Dana Diusulkan:</span>
                      <p className="text-gray-900 mt-1">{formatCurrency(selectedProposalForView.dana_diusulkan)}</p>
                    </div>
                  </div>
                </div>

                {/* Reviewer Info */}
                {selectedProposalForView.reviewer && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Reviewer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nama:</span>
                        <p className="text-gray-900 mt-1">{selectedProposalForView.reviewer.nama}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900 mt-1">{selectedProposalForView.reviewer.email}</p>
                      </div>
                      {selectedProposalForView.reviewer.bidang_keahlian && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Bidang Keahlian:</span>
                          <p className="text-gray-900 mt-1">{selectedProposalForView.reviewer.bidang_keahlian}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Abstrak */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Abstrak</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedProposalForView.abstrak || 'Tidak ada abstrak'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;