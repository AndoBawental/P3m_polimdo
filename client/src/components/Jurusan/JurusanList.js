import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import jurusanService from '../../services/jurusanService';
import Loading from '../Common/Loading';
import Modal from '../Common/Modal';
import { useAuth } from '../../hooks/useAuth';

const JurusanList = () => {
  const [jurusan, setJurusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nama: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchJurusan();
    
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchJurusan = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await jurusanService.getAllJurusan();
      
      if (response && response.success && response.data) {
        if (Array.isArray(response.data)) {
          setJurusan(response.data);
        } else {
          throw new Error('Data format tidak sesuai - data harus berupa array');
        }
      } else {
        throw new Error(response?.message || 'Response tidak valid dari server');
      }
    } catch (error) {
      let errorMessage = 'Gagal memuat data jurusan';
      
      if (error.message === 'Tidak dapat terhubung ke server') {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Endpoint tidak ditemukan. Periksa konfigurasi API.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Anda tidak memiliki akses. Silakan login kembali.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setJurusan([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      
      await jurusanService.deleteJurusan(id);
      
      setJurusan(prevJurusan => prevJurusan.filter(item => item.id !== id));
      setDeleteModal({ show: false, id: null, nama: '' });
      setSuccessMessage('Jurusan berhasil dihapus');
    } catch (error) {
      let errorMessage = 'Gagal menghapus jurusan';
      
      if (error.message.includes('masih memiliki')) {
        errorMessage = 'Tidak dapat menghapus jurusan yang masih memiliki data terkait (pengguna atau program studi)';
      } else if (error.message === 'Jurusan tidak ditemukan') {
        errorMessage = 'Jurusan tidak ditemukan atau sudah dihapus';
        fetchJurusan();
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const openDeleteModal = (id, nama) => {
    setDeleteModal({ show: true, id, nama });
    setError('');
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, nama: '' });
    setError('');
  };

  const handleRetry = () => {
    setError('');
    setSuccessMessage('');
    fetchJurusan();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <span>Daftar Jurusan</span>
            </h1>
            <p className="text-gray-600 mt-2">Kelola data jurusan di institusi pendidikan</p>
          </div>
          {user?.role === 'ADMIN' && (
            <Link
              to="/jurusan/create"
              className="flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Jurusan
            </Link>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 mb-6 flex items-center">
          <div className="flex-1 text-green-700">
            <strong className="font-medium">Sukses!</strong> {successMessage}
          </div>
          <button
            onClick={clearSuccessMessage}
            className="text-green-600 hover:text-green-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-6 flex items-center">
          <div className="flex-1 text-red-700">
            <strong className="font-medium">Terjadi kesalahan!</strong> {error}
          </div>
          <button
            onClick={handleRetry}
            className="text-red-600 hover:text-red-800 underline text-sm font-medium"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Jurusan Cards */}
      {jurusan.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error ? "Tidak dapat memuat data jurusan" : "Belum ada data jurusan"}
          </h3>
          <p className="text-gray-500 mb-4">
            {error 
              ? "Silakan coba lagi atau hubungi administrator" 
              : "Mulai dengan menambahkan jurusan pertama"}
          </p>
          <button
            onClick={handleRetry}
            className={`mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${error ? '' : 'hidden'}`}
          >
            Coba Lagi
          </button>
          {user?.role === 'ADMIN' && !error && (
            <Link
              to="/jurusan/create"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              Tambah Jurusan
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jurusan.map((item) => {
            const canDelete = !item._count?.prodis && !item._count?.users;
            
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl"
              >
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.nama}
                    </h3>
                    <div className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item._count?.prodis || 0} Prodi
                      </span>
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item._count?.users || 0} User
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/jurusan/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Detail
                    </Link>
                    
                    {user?.role === 'ADMIN' && (
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/jurusan/${item.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-800 flex items-center"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        
                        <button
                          onClick={() => canDelete ? openDeleteModal(item.id, item.nama) : null}
                          className={`flex items-center ${
                            canDelete
                              ? 'text-red-600 hover:text-red-800 cursor-pointer'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={
                            canDelete
                              ? 'Hapus'
                              : 'Tidak dapat dihapus karena masih memiliki data terkait'
                          }
                          disabled={!canDelete}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={closeDeleteModal}
        title={
          <div className="flex items-center text-red-600">
            <TrashIcon className="h-5 w-5 mr-2" />
            <span>Konfirmasi Hapus Jurusan</span>
          </div>
        }
      >
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <p className="text-center text-gray-700 mb-2">
            Apakah Anda yakin ingin menghapus jurusan ini?
          </p>
          <p className="text-center font-bold text-gray-900 text-lg mb-2">
            {deleteModal.nama}
          </p>
          <p className="text-center text-red-600 text-sm">
            Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
          </p>
        </div>

        {error && deleteModal.show && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={closeDeleteModal}
            className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => handleDelete(deleteModal.id)}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all shadow-md"
          >
            Ya, Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JurusanList;