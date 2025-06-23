import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Edit, 
  Send, 
  Trash2, 
  Download, 
  Calendar, 
  User, 
  DollarSign,
  Clock,
  FileText,
  Users,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Key,
  BookOpen,
  UserCheck,
  FilePlus,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ProposalStatus from './ProposalStatus';
import FileManager from '../Files/FileManager';
import proposalService from '../../services/proposalService';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlertMessage from '../Common/AlertMessage';

const ProposalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showAbstract, setShowAbstract] = useState(true);
  const [statusForm, setStatusForm] = useState({
    status: '',
    komentar: ''
  });

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await proposalService.getProposalById(id);
      if (response.success) {
        setProposal(response.data);
        setStatusForm({
          status: response.data.status,
          komentar: ''
        });
      } else {
        setError(response.error || 'Gagal memuat proposal');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat memuat proposal');
      console.error('Error fetching proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Tidak disebutkan';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = () => {
    if (!proposal || !user) return false;
    return user.role === 'ADMIN' || 
           proposal.ketuaId === user.id || 
           proposal.members?.some(m => m.userId === user.id);
  };

  const canDelete = () => {
    if (!proposal || !user) return false;
    return user.role === 'ADMIN' || 
           (proposal.ketuaId === user.id && !['APPROVED', 'REJECTED'].includes(proposal.status));
  };

  const canUpdateStatus = () => {
    if (!proposal || !user) return false;
    return user.role === 'ADMIN' || 
           (user.role === 'REVIEWER' && proposal.reviewerId === user.id);
  };

  const canSubmit = () => {
    if (!proposal) return false;
    return proposal.status === 'DRAFT' && canEdit();
  };

  const handleSubmit = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengajukan proposal ini?')) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await proposalService.submitProposal(proposal.id);
      
      if (result.success) {
        setProposal(result.data);
        setError('');
        alert('Proposal berhasil diajukan!');
      } else {
        setError(result.error || 'Gagal mengajukan proposal');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengajukan proposal');
      console.error('Error submitting proposal:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      const result = await proposalService.updateProposalStatus(proposal.id, statusForm);
      
      if (result.success) {
        setProposal(result.data);
        setShowStatusForm(false);
        setError('');
        alert('Status proposal berhasil diperbarui!');
      } else {
        setError(result.error || 'Gagal memperbarui status');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat memperbarui status');
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus proposal ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await proposalService.deleteProposal(proposal.id);
      
      if (result.success) {
        alert('Proposal berhasil dihapus!');
        navigate('/proposals');
      } else {
        setError(result.error || 'Gagal menghapus proposal');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat menghapus proposal');
      console.error('Error deleting proposal:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const statusOptions = [
    { value: 'SUBMITTED', label: 'Diajukan', icon: Send, color: 'bg-blue-100 text-blue-800' },
    { value: 'REVIEW', label: 'Sedang Direview', icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'APPROVED', label: 'Disetujui', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'REJECTED', label: 'Ditolak', icon: XCircle, color: 'bg-red-100 text-red-800' },
    { value: 'REVISION', label: 'Perlu Revisi', icon: Edit, color: 'bg-purple-100 text-purple-800' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-blue-600" />
          <p className="mt-4 text-gray-600">Memuat detail proposal...</p>
        </div>
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/proposals')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Proposal Tidak Ditemukan</h3>
          <p className="mt-2 text-gray-600">
            Proposal yang Anda cari tidak ditemukan atau mungkin telah dihapus.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/proposals')}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/proposals')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Daftar Proposal
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <AlertMessage
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {proposal.judul}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <BookOpen className="h-4 w-4 mr-1 text-blue-700" />
                  <span className="text-sm font-medium text-blue-800">
                    {proposal.skema?.nama || 'Tidak ada skema'}
                  </span>
                </div>
                
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4 mr-1 text-gray-700" />
                  <span className="text-sm font-medium text-gray-800">
                    {proposal.tahun}
                  </span>
                </div>
                
                <ProposalStatus status={proposal.status} size="lg" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            {canEdit() && proposal.status === 'DRAFT' && (
              <Link
                to={`/proposals/${proposal.id}/edit`}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Proposal
              </Link>
            )}
            
            {canSubmit() && (
              <button
                onClick={handleSubmit}
                disabled={actionLoading}
                className={`inline-flex items-center px-4 py-2.5 text-white rounded-xl transition-colors shadow-md hover:shadow-lg ${
                  actionLoading 
                    ? 'bg-green-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {actionLoading ? 'Mengajukan...' : 'Ajukan Proposal'}
              </button>
            )}

            {canUpdateStatus() && (
              <button
                onClick={() => setShowStatusForm(!showStatusForm)}
                className="inline-flex items-center px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg"
              >
                <Clock className="h-5 w-5 mr-2" />
                Update Status
              </button>
            )}

            {canDelete() && (
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className={`inline-flex items-center px-4 py-2.5 text-white rounded-xl transition-colors shadow-md hover:shadow-lg ${
                  actionLoading 
                    ? 'bg-red-500 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Trash2 className="h-5 w-5 mr-2" />
                )}
                {actionLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            )}
          </div>
        </div>

        {/* Status Update Form */}
        {showStatusForm && canUpdateStatus() && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
            <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-amber-600" />
              Update Status Proposal
            </h3>
            <form onSubmit={handleStatusUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Baru
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {statusOptions.map(option => (
                    <label 
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        statusForm.status === option.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={statusForm.status === option.value}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`${option.color} p-2 rounded-full mb-2`}>
                        <option.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 text-center">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komentar (Opsional)
                </label>
                <textarea
                  rows={4}
                  value={statusForm.komentar}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, komentar: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Berikan komentar atau catatan..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                    actionLoading
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {actionLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Menyimpan...
                    </div>
                  ) : 'Update Status'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusForm(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Abstrak - Fixed with proper text containment */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowAbstract(!showAbstract)}>
                <div className="flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Abstrak</h2>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  {showAbstract ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              
              {showAbstract && (
                <div className="overflow-x-hidden">
                  <div className="bg-blue-50 rounded-xl p-5 max-h-[500px] overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {proposal.abstrak || 'Tidak ada abstrak'}
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-gray-500 flex justify-between">
                    <span>{proposal.abstrak?.split(' ').length || 0} kata</span>
                    <span>{proposal.abstrak?.length || 0} karakter</span>
                  </div>
                </div>
              )}
            </div>

            {/* Kata Kunci */}
            {proposal.kata_kunci && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                  <Key className="h-6 w-6 mr-3 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Kata Kunci</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proposal.kata_kunci.split(',').map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Komentar Reviewer */}
            {proposal.komentar_reviewer && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 mr-3 text-amber-600" />
                  <h2 className="text-xl font-bold text-amber-800">Komentar Reviewer</h2>
                </div>
                <div className="bg-amber-100 rounded-xl p-4">
                  <p className="text-amber-700 leading-relaxed whitespace-pre-wrap break-words">
                    {proposal.komentar_reviewer}
                  </p>
                </div>
              </div>
            )}

            {/* File Manager */}
            <FileManager
              proposalId={proposal.id}
              title="Dokumen Proposal"
              allowUpload={canEdit()}
              showTitle={true}
            />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                <User className="h-6 w-6 mr-3 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Informasi Dasar</h2>
              </div>
              <div className="space-y-5">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>Ketua Peneliti</span>
                  </div>
                  <p className="font-medium text-lg">{proposal.ketua?.nama || 'Tidak ada'}</p>
                  <p className="text-gray-600 text-sm mt-1">{proposal.ketua?.email || ''}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center text-gray-500 mb-2">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Dana Diusulkan</span>
                  </div>
                  <p className="font-medium text-lg">{formatCurrency(proposal.dana_diusulkan)}</p>
                </div>
                
                {proposal.reviewer && (
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <div className="flex items-center text-indigo-600 mb-2">
                      <UserCheck className="h-4 w-4 mr-2" />
                      <span>Reviewer</span>
                    </div>
                    <p className="font-medium text-lg">{proposal.reviewer.nama}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Anggota Tim */}
            {proposal.members && proposal.members.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                  <Users className="h-6 w-6 mr-3 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Anggota Tim ({proposal.members.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {proposal.members.map(member => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.user?.nama || 'Nama tidak tersedia'}</p>
                        <p className="text-sm text-gray-600 mt-1">{member.user?.email || ''}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.peran === 'KETUA' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {member.peran}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
                <Clock className="h-6 w-6 mr-3 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
              </div>
              <div className="relative pl-8 border-l-2 border-blue-200">
                <div className="mb-6 relative">
                  <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <FilePlus className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-medium text-gray-900">Dibuat</p>
                    <p className="text-gray-600 text-sm mt-1">{formatDate(proposal.createdAt)}</p>
                  </div>
                </div>
                
                {proposal.tanggal_submit && (
                  <div className="mb-6 relative">
                    <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Send className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="font-medium text-gray-900">Diajukan</p>
                      <p className="text-gray-600 text-sm mt-1">{formatDate(proposal.tanggal_submit)}</p>
                    </div>
                  </div>
                )}
                
                {proposal.tanggal_review && (
                  <div className="mb-6 relative">
                    <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="font-medium text-gray-900">Direview</p>
                      <p className="text-gray-600 text-sm mt-1">{formatDate(proposal.tanggal_review)}</p>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                    <Edit className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-medium text-gray-900">Diperbarui</p>
                    <p className="text-gray-600 text-sm mt-1">{formatDate(proposal.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;