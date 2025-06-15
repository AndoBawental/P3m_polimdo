import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import ReviewService from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth'; // Tambahkan ini

const ReviewForm = ({ review, proposal, onClose, onSuccess, mode }) => {
  const { user } = useAuth(); // Dapatkan user dari konteks auth
  const [formData, setFormData] = useState({
    skor_total: '',
    catatan: '',
    rekomendasi: 'REVISI'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Tentukan proposal yang akan ditampilkan
  const currentProposal = proposal || (review ? review.proposal : null);
  const currentReviewer = review ? review.reviewer : user; // Untuk mode create, gunakan user sebagai reviewer

  useEffect(() => {
    if (mode === 'edit' && review) {
      setFormData({
        skor_total: review.skor_total || '',
        catatan: review.catatan || '',
        rekomendasi: review.rekomendasi || 'REVISI'
      });
    } else if (mode === 'create') {
      // Setel rekomendasi default untuk mode create
      setFormData({
        skor_total: '',
        catatan: '',
        rekomendasi: 'REVISI'
      });
    }
  }, [review, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const validation = ReviewService.validateReviewData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (mode === 'edit') {
        await ReviewService.updateReview(review.id, formData);
      } else {
        // Mode create: kirim proposalId dan formData
        await ReviewService.createReview({
          proposalId: currentProposal.id,
          ...formData
        });
      }
      onSuccess();
    } catch (error) {
      setErrors({
        submit: error.message || 'Terjadi kesalahan saat menyimpan review'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Jika tidak ada proposal (currentProposal) maka tidak render apa-apa
  if (!currentProposal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Review' : 'Buat Review Baru'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'edit' ? 'Perbarui review untuk proposal' : 'Buat review baru untuk proposal'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Proposal Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Informasi Proposal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Judul:</span>
                <p className="text-gray-900 mt-1">{currentProposal.judul}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Ketua:</span>
                <p className="text-gray-900 mt-1">{currentProposal.ketua.nama}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tahun:</span>
                <p className="text-gray-900 mt-1">{currentProposal.tahun}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="text-gray-900 mt-1">{currentProposal.status}</p>
              </div>
              {currentProposal.skema && (
                <>
                  <div>
                    <span className="font-medium text-gray-700">Skema:</span>
                    <p className="text-gray-900 mt-1">{currentProposal.skema.nama}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Kategori:</span>
                    <p className="text-gray-900 mt-1">{currentProposal.skema.kategori}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reviewer Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Informasi Reviewer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Nama:</span>
                <p className="text-gray-900 mt-1">{currentReviewer.nama}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900 mt-1">{currentReviewer.email || '-'}</p>
              </div>
              {currentReviewer.bidang_keahlian && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Bidang Keahlian:</span>
                  <p className="text-gray-900 mt-1">{currentReviewer.bidang_keahlian}</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Score Input */}
            <div>
              <label htmlFor="skor_total" className="block text-sm font-medium text-gray-700 mb-2">
                Skor Total (0-100)
              </label>
              <input
                type="number"
                id="skor_total"
                name="skor_total"
                min="0"
                max="100"
                step="0.1"
                value={formData.skor_total}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.skor_total ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan skor (opsional)"
              />
              {errors.skor_total && (
                <p className="text-red-600 text-sm mt-1">{errors.skor_total}</p>
              )}
            </div>

            {/* Recommendation */}
            <div>
              <label htmlFor="rekomendasi" className="block text-sm font-medium text-gray-700 mb-2">
                Rekomendasi <span className="text-red-500">*</span>
              </label>
              <select
                id="rekomendasi"
                name="rekomendasi"
                value={formData.rekomendasi}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rekomendasi ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="LAYAK">Layak</option>
                <option value="TIDAK_LAYAK">Tidak Layak</option>
                <option value="REVISI">Perlu Revisi</option>
              </select>
              {errors.rekomendasi && (
                <p className="text-red-600 text-sm mt-1">{errors.rekomendasi}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Review
              </label>
              <textarea
                id="catatan"
                name="catatan"
                rows={6}
                value={formData.catatan}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.catatan ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan catatan atau komentar untuk review ini..."
                maxLength={1000}
              />
              {errors.catatan && (
                <p className="text-red-600 text-sm mt-1">{errors.catatan}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {formData.catatan.length}/1000 karakter
              </p>
            </div>

            {/* Review Date Info - hanya untuk mode edit */}
            {mode === 'edit' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Informasi Review</h4>
                <p className="text-sm text-gray-600">
                  Tanggal Review: {formatDate(review?.tanggal_review)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Review akan diperbarui dengan timestamp saat ini ketika disimpan
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {mode === 'edit' ? 'Menyimpan...' : 'Membuat...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'edit' ? 'Simpan Review' : 'Buat Review'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;