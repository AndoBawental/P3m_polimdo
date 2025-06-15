import React, { useState } from 'react';
import { X } from 'lucide-react';
import reviewService from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth';

const AssignReviewerModal = ({ proposal, reviewers, onClose, onAssign }) => {
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 const handleAssign = async () => {
    if (!selectedReviewer) {
      setError('Pilih reviewer terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      // Panggil service untuk assign reviewer
      await reviewService.assignReviewer(proposal.id, selectedReviewer);
      
      // Dapatkan objek reviewer yang lengkap
      const reviewer = reviewers.find(r => r.id === selectedReviewer);
      if (!reviewer) {
        throw new Error('Reviewer tidak ditemukan di lokal data');
      }

      // Panggil callback dengan data lengkap
      onAssign(proposal.id, reviewer);
      onClose();
    } catch (err) {
      // Tangani error spesifik dari backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Gagal menugaskan reviewer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Tunjuk Reviewer
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Menugaskan reviewer untuk proposal:
            </p>
            <p className="font-semibold text-lg text-gray-900">
              {proposal.judul}
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Reviewer:
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedReviewer}
              onChange={(e) => setSelectedReviewer(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Pilih Reviewer --</option>
              {reviewers.map(reviewer => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.nama} - {reviewer.bidang_keahlian}
                </option>
              ))}
            </select>
          </div>
          
          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Batal
            </button>
            <button
              onClick={handleAssign}
              className={`px-4 py-2 text-white rounded-lg ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Menugaskan...' : 'Tugaskan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignReviewerModal;