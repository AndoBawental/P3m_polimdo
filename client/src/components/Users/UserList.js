// client/src/components/Users/UserList.js
import React, { useState } from 'react';
import UserCard from './UserCard';
import Pagination from '../Common/Pagination';
import Loading from '../Common/Loading';
import { Search, Filter, ChevronDown, ChevronUp, User as UserIcon } from 'lucide-react';

const UserList = ({
  users,
  loading,
  onEdit,
  onDelete,
  onStatusToggle,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('SEMUA');
  const [statusFilter, setStatusFilter] = useState('SEMUA');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nip && user.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.nim && user.nim.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'SEMUA' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'SEMUA' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 rounded-full w-12 h-12"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded-lg mt-4 w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
          <UserIcon className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada pengguna</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Sistem belum memiliki pengguna terdaftar. Mulai dengan menambahkan pengguna baru.
        </p>
        <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md">
          Tambah Pengguna Baru
        </button>
      </div>
    );
  }

  const columns = [
    {
      key: 'info',
      label: 'Informasi User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow">
            {user.nama.charAt(0)}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {user.nama}
            </p>
            <p className="text-sm text-gray-600 truncate max-w-xs">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {user.nip && `NIP: ${user.nip}`}
              {user.nim && `NIM: ${user.nim}`}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => (
        <div className="flex flex-col">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
            user.role === 'DOSEN' ? 'bg-blue-100 text-blue-800' :
            user.role === 'MAHASISWA' ? 'bg-green-100 text-green-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {user.role}
          </span>
          {user.bidang_keahlian && (
            <span className="text-xs text-gray-500 mt-1 truncate max-w-xs">{user.bidang_keahlian}</span>
          )}
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Kontak & Institusi',
      sortable: false,
      render: (user) => (
        <div>
          {user.no_telp && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {user.no_telp}
            </div>
          )}
          {user.jurusan?.nama && (
            <p className="text-xs text-gray-500 truncate max-w-xs">
              Jurusan: {user.jurusan.nama}
            </p>
          )}
          {user.prodi?.nama && (
            <p className="text-xs text-gray-500 truncate max-w-xs">
              Prodi: {user.prodi.nama}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'stats',
      label: 'Statistik',
      sortable: true,
      render: (user) => (
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">{user._count?.proposals || 0}</div>
            <div className="text-xs text-gray-500">Proposal</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">{user._count?.reviewedProposals || 0}</div>
            <div className="text-xs text-gray-500">Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">{user._count?.reviews || 0}</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (user) => (
        <button
          onClick={() => onStatusToggle(user.id, user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF')}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm ${
            user.status === 'AKTIF' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${
            user.status === 'AKTIF' ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          {user.status}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      sortable: false,
      render: (user) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(user)}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="Edit User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Hapus User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Manajemen Pengguna</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 text-gray-500" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {filtersOpen && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['SEMUA', 'ADMIN', 'DOSEN', 'MAHASISWA', 'REVIEWER'].map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        roleFilter === role 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role === 'SEMUA' ? 'Semua Role' : role}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['SEMUA', 'AKTIF', 'NONAKTIF'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        statusFilter === status 
                          ? status === 'AKTIF' 
                            ? 'bg-green-600 text-white' 
                            : status === 'NONAKTIF' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'SEMUA' ? 'Semua Status' : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, rowIndex) => (
                <tr 
                  key={user.id}
                  className="transition-colors hover:bg-blue-50 group"
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        colIndex === 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {column.render(user)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="grid gap-4 p-4">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusToggle={onStatusToggle}
            />
          ))}
        </div>
      </div>

      {/* Pagination and Info */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          Menampilkan <span className="font-medium">{filteredUsers.length}</span> dari <span className="font-medium">{users.length}</span> pengguna
        </div>
        
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserList;