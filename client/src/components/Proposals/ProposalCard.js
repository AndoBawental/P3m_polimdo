import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProposalStatus from './ProposalStatus';
import proposalService from '../../services/proposalService';
import { Edit, UserPlus } from 'lucide-react';

const ProposalCard = ({ 
  proposal, 
  onDelete, 
  canEdit, 
  canDelete, 
  userRole, 
  onStatusChange,
  onAssignReviewer
}) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proposal ini?')) {
      onDelete(proposal.id);
    }
  };

  const handleSubmit = async () => {
    if (proposal.status !== 'DRAFT') return;
    setLoadingSubmit(true);
    try {
      const result = await proposalService.submitProposal(proposal.id);
      if (result.success) {
        onStatusChange(proposal.id, 'SUBMITTED');
      } else {
        alert(result.error || 'Gagal mengajukan proposal');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Terjadi kesalahan saat mengajukan proposal');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link 
              to={`/proposals/${proposal.id}`}
              className="text-xl font-bold text-gray-900 hover:text-blue-700 line-clamp-2 transition-colors"
            >
              {proposal.judul}
            </Link>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {proposal.skema?.nama || 'Skema tidak tersedia'}
              </span>
              <div className="ml-3">
                <ProposalStatus status={proposal.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-5">
          <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
            {proposal.abstrak || 'Tidak ada abstrak'}
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
          <div className="flex items-start">
            <div className="mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-gray-500 block">Ketua</span>
              <p className="font-medium text-gray-900">{proposal.ketua?.nama || 'Tidak tersedia'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-gray-500 block">Tahun</span>
              <p className="font-medium text-gray-900">{proposal.tahun}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-gray-500 block">Dana Diusulkan</span>
              <p className="font-medium text-gray-900">{formatCurrency(proposal.dana_diusulkan)}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div>
              <span className="text-gray-500 block">Anggota</span>
              <p className="font-medium text-gray-900">{proposal._count?.members || 0} orang</p>
            </div>
          </div>
        </div>

        {/* Keywords */}
        {proposal.kata_kunci && (
          <div className="mb-5">
            <div className="flex flex-wrap gap-2">
              {proposal.kata_kunci.split(',').slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviewer info */}
        {proposal.reviewer && (
          <div className="flex items-center bg-indigo-50 rounded-lg p-3 mb-4">
            <div className="mr-3 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-indigo-800 font-medium">
                Reviewer: <span className="font-semibold">{proposal.reviewer.nama}</span>
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-3 sm:mb-0">
            <span className="block sm:inline-block">Dibuat: {formatDate(proposal.createdAt)}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/proposals/${proposal.id}`}
              className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium rounded-lg transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Detail
            </Link>
            
            {canEdit && (
              <Link
                to={`/proposals/${proposal.id}/edit`}
                className="px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium rounded-lg transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            )}
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Hapus
              </button>
            )}

            {proposal.status === 'DRAFT' && canEdit && (
              <button
                onClick={handleSubmit}
                disabled={loadingSubmit}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                  loadingSubmit 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {loadingSubmit ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengajukan...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Ajukan
                  </>
                )}
              </button>
            )}
            
            {userRole === 'ADMIN' && proposal.status === 'SUBMITTED' && (
              <button
                onClick={() => onAssignReviewer(proposal)}
                disabled={loadingSubmit}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                  loadingSubmit 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {loadingSubmit ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menugaskan...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Reviewer
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;