// src/components/Users/UserProfile.js
import React from 'react';
import { 
  FaPhone, FaGraduationCap, FaBook, FaCalendarAlt, FaSyncAlt, 
  FaChartBar, FaUser, FaEnvelope, FaIdCard, FaCrown, 
  FaCheckCircle, FaTimesCircle, FaBriefcase, FaUniversity 
} from 'react-icons/fa';

const UserProfile = ({ user }) => {
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-6">
            <FaUser className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Pengguna Tidak Ditemukan</h3>
          <p className="text-gray-600 mb-6">Data pengguna yang Anda cari tidak tersedia dalam sistem</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
      case 'DOSEN': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'MAHASISWA': return 'bg-gradient-to-r from-green-500 to-teal-600 text-white';
      case 'REVIEWER': return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
    }
  };

  const getStatusColor = (status) => {
    return status === 'AKTIF' 
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'ADMIN': 'Administrator',
      'DOSEN': 'Dosen',
      'MAHASISWA': 'Mahasiswa',
      'REVIEWER': 'Reviewer'
    };
    return labels[role] || role;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderStatCard = (value, label, icon, color) => (
    <div className={`${color} rounded-xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center">
        <div className="bg-white bg-opacity-20 rounded-xl p-3 mr-4">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm opacity-90">{label}</p>
        </div>
      </div>
    </div>
  );

  const renderInfoItem = (icon, label, value, color = "text-blue-500") => (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
      <div className={`${color} mt-1 mr-4 bg-blue-50 p-2 rounded-lg`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-gray-800 font-medium mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-6 mb-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full opacity-5">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="relative">
              <div className="bg-white bg-opacity-20 rounded-full p-1 w-32 h-32 flex items-center justify-center mb-4 md:mb-0 md:mr-8">
                <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">
                    {getInitials(user.nama)}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}>
                  {user.status === 'AKTIF' ? (
                    <span className="flex items-center">
                      <FaCheckCircle className="mr-1" /> AKTIF
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaTimesCircle className="mr-1" /> NONAKTIF
                    </span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.nama}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className={`px-4 py-2 rounded-full font-medium flex items-center ${getRoleColor(user.role)}`}>
                  <FaCrown className="mr-2" /> {getRoleLabel(user.role)}
                </span>
                {(user.nip || user.nim) && (
                  <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-medium">
                    {user.nip ? `NIP: ${user.nip}` : `NIM: ${user.nim}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informasi Utama */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <div className="flex items-center mb-8 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                  <FaUser className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Informasi Profil</h2>
              </div>
              
              <div className="space-y-2">
                {renderInfoItem(
                  <FaEnvelope className="h-5 w-5" />, 
                  "Email", 
                  user.email,
                  "text-pink-500"
                )}
                
                {user.no_telp && renderInfoItem(
                  <FaPhone className="h-5 w-5" />, 
                  "Nomor Telepon", 
                  user.no_telp,
                  "text-teal-500"
                )}
                
                {user.bidang_keahlian && renderInfoItem(
                  <FaBriefcase className="h-5 w-5" />, 
                  "Bidang Keahlian", 
                  user.bidang_keahlian,
                  "text-amber-500"
                )}
                
                {(user.jurusan || user.prodi) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-gray-100">
                    <div className="flex items-start">
                      <div className="text-blue-500 mt-1 mr-4 bg-blue-50 p-2 rounded-lg">
                        <FaUniversity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</p>
                        <p className="text-gray-800 font-medium mt-1">
                          {typeof user.jurusan === 'object' ? user.jurusan.nama : user.jurusan || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-blue-500 mt-1 mr-4 bg-blue-50 p-2 rounded-lg">
                        <FaGraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</p>
                        <p className="text-gray-800 font-medium mt-1">
                          {typeof user.prodi === 'object' ? user.prodi.nama : user.prodi || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                  <div className="flex items-start">
                    <div className="text-blue-500 mt-1 mr-4 bg-blue-50 p-2 rounded-lg">
                      <FaCalendarAlt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung Sejak</p>
                      <p className="text-gray-800 font-medium mt-1">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {user.updatedAt && (
                    <div className="flex items-start">
                      <div className="text-blue-500 mt-1 mr-4 bg-blue-50 p-2 rounded-lg">
                        <FaSyncAlt className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Terakhir Diperbarui</p>
                        <p className="text-gray-800 font-medium mt-1">
                          {new Date(user.updatedAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                  <FaBook className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Aktivitas Terbaru</h2>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Pengajuan Proposal Baru</p>
                    <span className="text-sm text-gray-500">2 jam lalu</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Judul: "Pengembangan Sistem Manajemen Skema Pendanaan"</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Review Proposal</p>
                    <span className="text-sm text-gray-500">1 hari lalu</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Proposal: "Inovasi Metode Pembelajaran Digital"</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Pembaruan Profil</p>
                    <span className="text-sm text-gray-500">3 hari lalu</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Menambahkan informasi bidang keahlian</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistik & Status */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                  <FaChartBar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Statistik Aktivitas</h2>
              </div>
              
              <div className="space-y-5">
                {renderStatCard(
                  user._count?.proposals || 0,
                  "Proposal Diajukan",
                  <FaBook className="h-6 w-6 text-blue-500" />,
                  "bg-gradient-to-r from-blue-400 to-blue-600"
                )}
                
                {renderStatCard(
                  user._count?.reviewedProposals || 0,
                  "Proposal Direview",
                  <FaCheckCircle className="h-6 w-6 text-green-500" />,
                  "bg-gradient-to-r from-green-400 to-green-600"
                )}
                
                {renderStatCard(
                  user._count?.reviews || 0,
                  "Review Diberikan",
                  <FaIdCard className="h-6 w-6 text-purple-500" />,
                  "bg-gradient-to-r from-purple-400 to-purple-600"
                )}
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${user.status === 'AKTIF' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Status Akun
                </h3>
                <p className="text-gray-700 mb-4">
                  Akun ini <span className="font-bold">{user.status === 'AKTIF' ? 'aktif' : 'nonaktif'}</span> dalam sistem. 
                  Pengguna {user.status === 'AKTIF' ? 'dapat' : 'tidak dapat'} mengakses fitur sistem sesuai perannya.
                </p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Kekuatan Akun</span>
                    <span className="text-sm font-medium text-gray-800">90%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-teal-500 w-[90%]"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-3">Keahlian</h3>
                <div className="flex flex-wrap gap-2">
                  {['Manajemen Proyek', 'Penelitian', 'Pengembangan Web', 'Analisis Data'].map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;