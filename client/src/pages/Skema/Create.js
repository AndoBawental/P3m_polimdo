import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkemaForm from '../../components/Skema/SkemaForm';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Common/Loading';

const SkemaCreate = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (skemaData) => {
    try {
      setLoading(true);
      setError('');

      console.log('Submitting skema:', skemaData);

      const response = await skemaService.createSkema(skemaData);

      console.log('Service response:', response);

      if (response.success) {
        const successMessage = typeof response.message === 'string'
          ? response.message
          : 'Skema berhasil dibuat';

        showSuccess(successMessage);
        navigate('/skema');
      } else {
        const errorMessage = typeof response.message === 'string'
          ? response.message
          : 'Gagal membuat skema';

        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Error creating skema:', err);

      const errorMessage = typeof err.response?.data?.message === 'string'
        ? err.response.data.message
        : typeof err.message === 'string'
          ? err.message
          : 'Terjadi kesalahan saat membuat skema';

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tambah Skema Pendanaan Baru</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Isi formulir di bawah ini untuk menambahkan skema pendanaan baru ke sistem. Pastikan semua informasi yang dimasukkan akurat dan lengkap.
          </p>
          
          {/* Progress Indicator */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <span className="text-blue-600 font-medium">Informasi Dasar</span>
              <span>Informasi Keuangan</span>
              <span>Detail Lainnya</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-1/3"></div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Sidebar with Info */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-indigo-50 p-6 border-r border-gray-100">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Panduan Pengisian
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Isi semua kolom yang wajib diisi (ditandai dengan *)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Pastikan kode skema unik dan belum pernah digunakan sebelumnya</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Periksa kembali rentang tanggal buka dan tutup</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Verifikasi nilai dana minimum dan maksimum</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Informasi Penting
                </h3>
                <p className="text-sm text-blue-700">
                  Setelah skema dibuat, beberapa informasi seperti kode skema dan kategori tidak dapat diubah. Pastikan data yang dimasukkan sudah benar.
                </p>
              </div>
            </div>
            
            {/* Main Form Content */}
            <div className="md:w-2/3 p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <SkemaForm onSubmit={handleSubmit} />
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <button 
              onClick={() => navigate('/skema')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar Skema
            </button>
            <div className="text-sm text-gray-500">
              Harap periksa kembali sebelum menyimpan
            </div>
          </div>
        </div>
        
        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Dokumentasi</h3>
            </div>
            <p className="text-sm text-gray-600">
              Pelajari lebih lanjut tentang membuat skema pendanaan melalui panduan kami.
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Dukungan Tim</h3>
            </div>
            <p className="text-sm text-gray-600">
              Butuh bantuan? Hubungi tim pendukung kami untuk panduan langsung.
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Skema Populer</h3>
            </div>
            <p className="text-sm text-gray-600">
              Lihat contoh skema pendanaan yang paling sering digunakan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkemaCreate;