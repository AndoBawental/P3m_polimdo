import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, AcademicCapIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import prodiService from '../../services/prodiService';
import Loading from '../Common/Loading';
import Modal from '../Common/Modal';
import SearchBar from '../Common/SearchBar';

const ProdiList = () => {
  const [prodi, setProdi] = useState([]);
  const [filteredProdi, setFilteredProdi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nama: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProdi();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = prodi.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jurusan.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProdi(filtered);
    } else {
      setFilteredProdi(prodi);
    }
  }, [searchTerm, prodi]);

  const fetchProdi = async () => {
    try {
      setLoading(true);
      const response = await prodiService.getAllProdi();
      setProdi(response.data);
      setFilteredProdi(response.data);
    } catch (error) {
      console.error('Error fetching prodi:', error);
      alert('Gagal mengambil data prodi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, nama) => {
    setDeleteModal({ show: true, id, nama });
  };

  const handleDeleteConfirm = async () => {
    try {
      await prodiService.deleteProdi(deleteModal.id);
      setDeleteModal({ show: false, id: null, nama: '' });
      fetchProdi();
      alert('Prodi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting prodi:', error);
      alert(error.message || 'Gagal menghapus prodi');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, id: null, nama: '' });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <AcademicCapIcon className="h-10 w-10 text-white mr-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Program Studi</h1>
              <p className="text-blue-100 mt-1">Kelola data program studi di institusi Anda</p>
            </div>
          </div>
          <Link
            to="/prodi/create"
            className="flex items-center px-5 py-3 bg-white text-blue-600 font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Prodi
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Cari prodi atau jurusan..."
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm border border-green-100">
          <div className="text-green-600 font-semibold">Total Program Studi</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{prodi.length}</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-blue-100">
          <div className="text-blue-600 font-semibold">Jurusan Terbanyak</div>
          <div className="text-xl font-bold text-gray-800 mt-2">Teknik Informatika</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-5 shadow-sm border border-purple-100">
          <div className="text-purple-600 font-semibold">Prodi Populer</div>
          <div className="text-xl font-bold text-gray-800 mt-2">Sistem Informasi</div>
        </div>
      </div>

      {/* Prodi List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Program Studi</h2>
            <div className="text-sm text-gray-500">
              Menampilkan {filteredProdi.length} dari {prodi.length} prodi
            </div>
          </div>
        </div>
        
        {filteredProdi.length === 0 ? (
          <div className="py-16 text-center">
            <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">
              {searchTerm ? 'Prodi tidak ditemukan' : 'Belum ada data prodi'}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? 'Coba kata kunci lain atau tambahkan prodi baru' 
                : 'Mulai dengan menambahkan program studi pertama Anda'}
            </p>
            {!searchTerm && (
              <Link
                to="/prodi/create"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Tambah Prodi Pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredProdi.map((item) => (
              <div 
                key={item.id} 
                className="px-6 py-4 hover:bg-blue-50 transition-colors duration-150 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{item.nama}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-medium">Jurusan:</span> {item.jurusan.nama}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {item._count.users} pengguna
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/prodi/edit/${item.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(item.id, item.nama)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Hapus"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={handleDeleteCancel}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-6 p-4">
          <div className="bg-red-50 p-4 rounded-lg flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-red-100 rounded-full p-2">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Hapus Program Studi?</h3>
              <p className="text-red-700 mt-1">
                Anda akan menghapus prodi <span className="font-semibold">"{deleteModal.nama}"</span>. 
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batalkan
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Hapus Permanen
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProdiList;