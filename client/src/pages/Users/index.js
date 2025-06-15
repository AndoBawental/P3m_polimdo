import React, { useState, useEffect } from 'react';
import UserList from '../../components/Users/UserList';
import UserForm from '../../components/Users/UserForm';
import SearchBar from '../../components/Common/SearchBar';
import Modal from '../../components/Common/Modal';
import userService from '../../services/userService';
import { FiFilter, FiUserPlus, FiRefreshCw, FiEdit, FiTrash2, FiUser, FiCheck, FiX } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const roles = [
    { value: '', label: 'Semua Role', icon: <FiFilter className="mr-2" /> },
    { value: 'ADMIN', label: 'Admin', color: 'bg-purple-500' },
    { value: 'DOSEN', label: 'Dosen', color: 'bg-blue-500' },
    { value: 'MAHASISWA', label: 'Mahasiswa', color: 'bg-green-500' },
    { value: 'REVIEWER', label: 'Reviewer', color: 'bg-amber-500' }
  ];

  const statuses = [
    { value: '', label: 'Semua Status', icon: <FiFilter className="mr-2" /> },
    { value: 'AKTIF', label: 'Aktif', color: 'bg-green-500' },
    { value: 'NONAKTIF', label: 'Non-Aktif', color: 'bg-red-500' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: selectedRole,
        status: selectedStatus
      });

      if (result.success) {
        setUsers(result.data.users);
        setTotalPages(result.data.pagination.pages);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    setStatsLoading(true);
    try {
      const result = await userService.getUserStats();
      if (result.success) {
        setStats({
          total: result.data.totalUsers,
          active: result.data.activeUsers,
          inactive: result.data.inactiveUsers
        });
      } else {
        console.error('Gagal mengambil statistik user:', result.error);
      }
    } catch (err) {
      console.error('Gagal mengambil statistik user:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setModalMode('delete');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      const result = await userService.updateUserStatus(userId, newStatus);
      if (result.success) {
        fetchUsers();
        fetchUserStats();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal mengubah status user');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const result = modalMode === 'create'
        ? await userService.createUser(formData)
        : await userService.updateUser(selectedUser.id, formData);

      if (result.success) {
        fetchUsers();
        fetchUserStats();
        setShowModal(false);
        setSelectedUser(null);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Gagal ${modalMode === 'create' ? 'membuat' : 'mengupdate'} user`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      const result = await userService.deleteUser(selectedUser.id);
      if (result.success) {
        fetchUsers();
        fetchUserStats();
        setShowModal(false);
        setSelectedUser(null);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal menghapus user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError('');
  };

  const resetFilters = () => {
    setSelectedRole('');
    setSelectedStatus('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
            <p className="text-gray-600 mt-2">Kelola semua pengguna sistem dengan mudah</p>
          </div>
          <button
            onClick={handleCreateUser}
            className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiUserPlus className="mr-2 text-lg" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <strong className="font-medium">Terjadi kesalahan</strong>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <SearchBar 
              value={searchTerm}
              onChange={handleSearch} 
              placeholder="Cari pengguna..." 
              withIcon
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiFilter />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiFilter />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <FiRefreshCw className="mr-2" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <UserList
          users={users}
          loading={loading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onStatusToggle={handleStatusToggle}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleModalClose}
          title={
            modalMode === 'create' ? (
              <div className="flex items-center">
                <FiUserPlus className="mr-2 text-blue-600" />
                <span>Tambah User Baru</span>
              </div>
            ) : modalMode === 'edit' ? (
              <div className="flex items-center">
                <FiEdit className="mr-2 text-blue-600" />
                <span>Edit User</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FiTrash2 className="mr-2 text-red-600" />
                <span>Hapus User</span>
              </div>
            )
          }
          size={modalMode === 'delete' ? 'small' : 'large'}
        >
          {modalMode === 'delete' ? (
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-lg text-gray-700 mb-2">
                Apakah Anda yakin ingin menghapus user ini?
              </p>
              <p className="text-center text-gray-600 mb-6">
                <strong className="font-semibold text-red-600">{selectedUser?.nama}</strong> akan dihapus secara permanen.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleModalClose}
                  disabled={formLoading}
                  className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 transition-all shadow-md"
                >
                  {formLoading ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          ) : (
            <UserForm
              user={selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
              loading={formLoading}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Users;
