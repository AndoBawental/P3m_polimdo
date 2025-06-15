import React from 'react';
import StatusBadge from '../Common/StatusBadge';

const UserCard = ({ user, onEdit, onDelete, onStatusToggle }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white';
      case 'DOSEN': return 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white';
      case 'MAHASISWA': return 'bg-gradient-to-br from-green-500 to-emerald-500 text-white';
      case 'REVIEWER': return 'bg-gradient-to-br from-amber-500 to-orange-500 text-white';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all duration-300">
      {/* Header with avatar */}
      <div className="flex items-start mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-14 h-14 flex items-center justify-center text-gray-500 font-bold text-xl">
          {user.nama.charAt(0)}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{user.nama}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <StatusBadge
              status={user.status}
              onClick={() => onStatusToggle(user.id, user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF')}
              clickable
            />
          </div>
          
          {(user.nip || user.nim) && (
            <p className="text-gray-500 text-xs mt-1">
              {user.nip && `NIP: ${user.nip}`}
              {user.nim && `NIM: ${user.nim}`}
            </p>
          )}
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {user.role}
        </span>
      </div>

      {/* Contact Info */}
      <div className="mb-4 space-y-2">
        {user.no_telp && (
          <div className="flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {user.no_telp}
          </div>
        )}
        
        {user.jurusan?.nama && (
          <div className="flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Jurusan: {user.jurusan.nama}
          </div>
        )}
        
        {user.prodi?.nama && (
          <div className="flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Prodi: {user.prodi.nama}
          </div>
        )}
        
        {user.bidang_keahlian && (
          <div className="flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Bidang: {user.bidang_keahlian}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-blue-50 rounded-xl p-2 border border-blue-100">
          <p className="font-bold text-lg text-blue-800">{user._count?.proposals || 0}</p>
          <p className="text-blue-600 text-xs">Proposal</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-2 border border-amber-100">
          <p className="font-bold text-lg text-amber-800">{user._count?.reviewedProposals || 0}</p>
          <p className="text-amber-600 text-xs">Reviewed</p>
        </div>
        <div className="bg-green-50 rounded-xl p-2 border border-green-100">
          <p className="font-bold text-lg text-green-800">{user._count?.reviews || 0}</p>
          <p className="text-green-600 text-xs">Reviews</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          Dibuat: {new Date(user.createdAt).toLocaleDateString('id-ID')}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors px-3 py-1.5 hover:bg-blue-50 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors px-3 py-1.5 hover:bg-red-50 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;