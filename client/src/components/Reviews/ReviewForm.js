import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, FileText, Download, Eye } from 'lucide-react';
import ReviewService from '../../services/reviewService';
import fileService from '../../services/fileService';
import { useAuth } from '../../hooks/useAuth';

const ReviewForm = ({ review, proposal, onClose, onSuccess, mode }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    skor_total: '',
    catatan: '',
    rekomendasi: 'REVISI'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Tentukan proposal yang akan ditampilkan
  const currentProposal = proposal || (review ? review.proposal : null);
  const currentReviewer = review ? review.reviewer : user;

  useEffect(() => {
    setIsVisible(true);
    
    if (mode === 'edit' && review) {
      setFormData({
        skor_total: review.skor_total || '',
        catatan: review.catatan || '',
        rekomendasi: review.rekomendasi || 'REVISI'
      });
    } else if (mode === 'create') {
      setFormData({
        skor_total: '',
        catatan: '',
        rekomendasi: 'REVISI'
      });
    }

    // Load documents when component mounts
    if (currentProposal?.id) {
      loadProposalDocuments();
    }
  }, [review, mode, currentProposal?.id]);

  const loadProposalDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await fileService.getProposalDocuments(currentProposal.id);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      setDownloadingId(documentId);
      await fileService.handleFileDownload(documentId, fileName);
    } catch (error) {
      console.error('Error downloading document:', error);
      setErrors(prev => ({
        ...prev,
        document: 'Gagal mengunduh dokumen'
      }));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

  const formatFileSize = (size) => {
    if (!size) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!currentProposal) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-gradient-to-br from-white to-gray-50 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'edit' ? 'Edit Review' : 'Buat Review Baru'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'edit' ? 'Perbarui review untuk proposal' : 'Buat review baru untuk proposal'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Proposal Info & Review Form */}
            <div className="space-y-6">
              {/* Proposal Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-blue-100 transition-all duration-200 hover:shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <div className="w-2 h-5 bg-blue-500 rounded-full mr-2"></div>
                  Informasi Proposal
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                    <span className="font-medium text-gray-700">Judul:</span>
                    <p className="text-gray-900 mt-1 font-medium">{currentProposal.judul}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                    <span className="font-medium text-gray-700">Ketua:</span>
                    <p className="text-gray-900 mt-1">{currentProposal.ketua.nama}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                      <span className="font-medium text-gray-700">Tahun:</span>
                      <p className="text-gray-900 mt-1">{currentProposal.tahun}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className={`mt-1 font-medium ${
                        currentProposal.status === 'DITERIMA' ? 'text-green-600' : 
                        currentProposal.status === 'DITOLAK' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        {currentProposal.status}
                      </p>
                    </div>
                  </div>
                  {currentProposal.skema && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                        <span className="font-medium text-gray-700">Skema:</span>
                        <p className="text-gray-900 mt-1">{currentProposal.skema.nama}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                        <span className="font-medium text-gray-700">Kategori:</span>
                        <p className="text-gray-900 mt-1">{currentProposal.skema.kategori}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 shadow-sm border border-indigo-100 transition-all duration-200 hover:shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <div className="w-2 h-5 bg-indigo-500 rounded-full mr-2"></div>
                  Informasi Reviewer
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                    <span className="font-medium text-gray-700">Nama:</span>
                    <p className="text-gray-900 mt-1 font-medium">{currentReviewer.nama}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900 mt-1">{currentReviewer.email || '-'}</p>
                  </div>
                  {currentReviewer.bidang_keahlian && (
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                      <span className="font-medium text-gray-700">Bidang Keahlian:</span>
                      <p className="text-gray-900 mt-1">{currentReviewer.bidang_keahlian}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start animate-pulse">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Score Input */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.skor_total ? 'border-red-300' : 'border-gray-300 hover:border-blue-300'
                    }`}
                    placeholder="Masukkan skor (opsional)"
                  />
                  {errors.skor_total && (
                    <p className="text-red-600 text-sm mt-1 animate-fadeIn">{errors.skor_total}</p>
                  )}
                </div>

                {/* Recommendation */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <label htmlFor="rekomendasi" className="block text-sm font-medium text-gray-700 mb-2">
                    Rekomendasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="rekomendasi"
                    name="rekomendasi"
                    value={formData.rekomendasi}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.rekomendasi ? 'border-red-300' : 'border-gray-300 hover:border-blue-300'
                    }`}
                    required
                  >
                    <option value="LAYAK">Layak</option>
                    <option value="TIDAK_LAYAK">Tidak Layak</option>
                    <option value="REVISI">Perlu Revisi</option>
                  </select>
                  {errors.rekomendasi && (
                    <p className="text-red-600 text-sm mt-1 animate-fadeIn">{errors.rekomendasi}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Review
                  </label>
                  <textarea
                    id="catatan"
                    name="catatan"
                    rows={6}
                    value={formData.catatan}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.catatan ? 'border-red-300' : 'border-gray-300 hover:border-blue-300'
                    }`}
                    placeholder="Masukkan catatan atau komentar untuk review ini..."
                    maxLength={1000}
                  />
                  {errors.catatan && (
                    <p className="text-red-600 text-sm mt-1 animate-fadeIn">{errors.catatan}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {formData.catatan.length}/1000 karakter
                  </p>
                </div>

                {/* Review Date Info - hanya untuk mode edit */}
                {mode === 'edit' && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 animate-pulse">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Informasi Review
                    </h4>
                    <p className="text-sm text-blue-800">
                      Tanggal Review: {formatDate(review?.tanggal_review)}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Review akan diperbarui dengan timestamp saat ini ketika disimpan
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
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

            {/* Right Column - Documents */}
            <div className="space-y-6">
              {/* Documents Section */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                      Dokumen Proposal
                    </h3>
                    <span className="px-2.5 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full font-medium">
                      {documents.length} dokumen
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Dokumen yang diupload untuk proposal ini
                  </p>
                </div>

                <div className="p-4">
                  {documentsLoading ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                      <p className="text-sm text-gray-500">Memuat dokumen...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 animate-fadeIn">
                      <FileText className="mx-auto h-14 w-14 text-gray-300 mb-4 opacity-75" />
                      <p className="text-sm">Belum ada dokumen yang diupload</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                {document.nama_file || document.name}
                              </h4>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                {document.ukuran_file && (
                                  <span>{formatFileSize(document.ukuran_file)}</span>
                                )}
                                {document.tipe_file && (
                                  <span className="uppercase px-1.5 py-0.5 bg-gray-100 rounded-md text-gray-600">
                                    {document.tipe_file}
                                  </span>
                                )}
                                <span className="text-gray-400">
                                  {formatDate(document.createdAt || document.uploadedAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleDownloadDocument(
                                document.id, 
                                document.nama_file || document.name
                              )}
                              disabled={downloadingId === document.id}
                              className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 disabled:opacity-50 group-hover:bg-indigo-100"
                              title="Download dokumen"
                            >
                              {downloadingId === document.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                              ) : (
                                <Download className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.document && (
                    <div className="mt-3 text-sm text-red-600 flex items-center animate-fadeIn">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.document}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Guidelines */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 transition-all duration-200 hover:shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <div className="w-2 h-5 bg-green-500 rounded-full mr-2"></div>
                  Panduan Review
                </h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start">
                    <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    </div>
                    <span>Unduh dan baca semua dokumen proposal sebelum memberikan review</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    </div>
                    <span>Berikan skor berdasarkan kriteria penilaian yang telah ditetapkan</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    </div>
                    <span>Tulis catatan yang konstruktif dan spesifik</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                    </div>
                    <span>Pilih rekomendasi yang sesuai dengan penilaian Anda</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReviewForm;