// client/src/components/Users/UserList.js
import React from 'react';
import UserCard from './UserCard';
import Pagination from '../Common/Pagination';
import Loading from '../Common/Loading';

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
  if (loading) {
    return <Loading />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data user</h3>
        <p className="text-gray-500">Belum ada user yang terdaftar dalam sistem</p>
      </div>
    );
  }

  const columns = [
    {
      key: 'info',
      label: 'Informasi User',
      render: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 border-2 border-dashed rounded-full flex items-center justify-center text-gray-500 font-medium">
            {user.nama.charAt(0)}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-gray-900">{user.nama}</p>
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
      render: (user) => (
        <button
          onClick={() => onStatusToggle(user.id, user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF')}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, rowIndex) => (
                <tr 
                  key={user.id}
                  className="transition-colors hover:bg-gray-50"
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
          {users.map(user => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;