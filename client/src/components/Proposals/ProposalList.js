import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProposalCard from './ProposalCard';
import Loading from '../Common/Loading';
import Pagination from '../Common/Pagination';
import SearchBar from '../Common/SearchBar';
import proposalService from '../../services/proposalService';
import skemaService from '../../services/skemaService';
import reviewService from '../../services/reviewService'; // Import review service
import { useAuth } from '../../hooks/useAuth';
import AssignReviewerModal from '../Reviews/AssignReviewerModal';

const ProposalList = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skemas, setSkemas] = useState([]);
  const [reviewers, setReviewers] = useState([]); // State for reviewers
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    skema: '',
    search: '',
    page: 1,
    limit: 12,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadProposals();
    loadSkemas();
    
    // Load reviewers if admin
    if (user?.role === 'ADMIN') {
      loadReviewers();
    }
  }, [filters]);

  const loadProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await proposalService.getProposals(filters);
      if (result.success) {
        setProposals(result.data.proposals || []);
        setPagination(result.data.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        });
      } else {
        setError(result.error || 'Gagal memuat proposal');
        setProposals([]);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat proposal');
      setProposals([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSkemas = async () => {
    try {
      const result = await skemaService.getAllSkema();
      const skemaList = result?.data?.items;
      if (Array.isArray(skemaList)) {
        setSkemas(skemaList);
      } else {
        console.error('Format data skemas tidak valid:', result);
        setSkemas([]);
      }
    } catch (err) {
      console.error('Gagal memuat skema:', err);
      setSkemas([]);
    }
  };

  // NEW: Load reviewers function
  const loadReviewers = async () => {
  try {
    const result = await reviewService.getReviewers();
    if (result && result.data) {
      setReviewers(result.data);
    } else {
      console.error('Format respons reviewer tidak valid:', result);
      setReviewers([]);
    }
  } catch (err) {
    console.error('Error loading reviewers:', err);
    // Tampilkan error ke user
    setError('Gagal memuat data reviewer. Silakan coba lagi.');
  }
};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = async (proposalId) => {
    try {
      const result = await proposalService.deleteProposal(proposalId);
      if (result.success) {
        loadProposals();
      } else {
        alert(result.error || 'Gagal menghapus proposal');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus proposal');
      console.error(err);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setProposals(prev =>
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
  };

  // NEW: Handle assign reviewer
  const handleAssignReviewer = (proposal) => {
    setSelectedProposal(proposal);
    setShowAssignModal(true);
  };

  // NEW: Handle reviewer assignment
  const handleReviewerAssigned = (proposalId, reviewer) => {
  setProposals(prev => 
    prev.map(p => 
      p.id === proposalId 
        ? { 
            ...p, 
            reviewer, 
            status: 'REVIEW' // Update status proposal
          } 
        : p
    )
  );
  setShowAssignModal(false);
};

  const canEdit = (proposal) => (
    user.role === 'ADMIN' ||
    (user.role === 'MAHASISWA' && proposal.ketuaId === user.id) ||
    (user.role === 'DOSEN' &&
      (proposal.ketuaId === user.id ||
        proposal.members?.some((m) => m.userId === user.id)))
  );

  const canDelete = (proposal) => {
    return (
      user.role === 'ADMIN' ||
      (proposal.ketuaId === user.id && !['APPROVED', 'REJECTED'].includes(proposal.status))
    );
  };

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Diajukan' },
    { value: 'REVIEW', label: 'Sedang Direview' },
    { value: 'APPROVED', label: 'Disetujui' },
    { value: 'REJECTED', label: 'Ditolak' },
    { value: 'REVISION', label: 'Perlu Revisi' },
  ];

  if (loading && proposals.length === 0) return <Loading />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header with improved styling */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            Proposal Penelitian
          </h1>
          <p className="text-gray-600 mt-1 max-w-xl">
            Kelola dan pantau proposal penelitian & Pengabdian Anda dengan mudah dan efisien
          </p>
        </div>
        {['DOSEN', 'MAHASISWA', 'ADMIN'].includes(user.role) && (
          <Link
            to="/proposals/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Buat Proposal Baru
          </Link>
        )}
      </div>

      {/* Filters with enhanced design */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Cari proposal berdasarkan judul, ketua, atau topik..."
              onChange={handleSearch}
              value={filters.search}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <select
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <select
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              value={filters.skema}
              onChange={(e) => handleFilterChange('skema', e.target.value)}
            >
              <option value="">Semua Skema</option>
              {Array.isArray(skemas) &&
                skemas.map((skema) => (
                  <option key={skema.id} value={skema.id}>
                    {skema.nama}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info and Limits with improved layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium">
            Menampilkan <span className="font-bold">{proposals.length}</span> dari <span className="font-bold">{pagination.total}</span> proposal
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Tampilkan per halaman:</label>
          <select
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Enhanced error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <strong className="font-medium">Terjadi kesalahan</strong>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Proposal Grid with enhanced card layout */}
      {proposals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onDelete={handleDelete}
                canEdit={canEdit(proposal)}
                canDelete={canDelete(proposal)}
                userRole={user.role}
                onStatusChange={handleStatusChange}
                onAssignReviewer={handleAssignReviewer} // NEW prop
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.search || filters.status || filters.skema
              ? 'Proposal tidak ditemukan'
              : 'Belum ada proposal'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {filters.search || filters.status || filters.skema
              ? 'Tidak ada proposal yang sesuai dengan filter pencarian Anda. Coba ubah kriteria pencarian.'
              : 'Mulai dengan membuat proposal penelitian atau Pengabdian baru.'}
          </p>
          {['DOSEN', 'MAHASISWA', 'ADMIN'].includes(user.role) && (
            <Link
              to="/proposals/create"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Buat Proposal Baru
            </Link>
          )}
        </div>
      )}

      {/* Pagination with improved styling */}
      {pagination.pages > 1 && (
        <div className="flex justify-center py-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* NEW: Assign Reviewer Modal */}
      {showAssignModal && selectedProposal && (
        <AssignReviewerModal
          proposal={selectedProposal}
          reviewers={reviewers}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleReviewerAssigned}
        />
      )}
    </div>
  );
};

export default ProposalList;