import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';
import StatsCard from '../../components/Dashboard/StatsCard';
import Loading from '../../components/Common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProposals, setRecentProposals] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      setTimeout(() => setShowContent(true), 50);
    }
  }, [loading, error]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, proposalsRes, usersRes, announcementsRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProposals(5),
        dashboardService.getRecentUsers(5),
        dashboardService.getAnnouncements(3)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (proposalsRes.success) setRecentProposals(proposalsRes.data);
      if (usersRes.success) setRecentUsers(usersRes.data);
      if (announcementsRes.success) setAnnouncements(announcementsRes.data);

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Animasi background floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-10 animate-pulse animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-amber-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-3000"></div>
      </div>
      
      <div className={`container mx-auto px-4 py-6 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header dengan animasi */}
        <div className={`mb-8 transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-text-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Admin
              </h1>
              <p className="text-gray-600 mt-1">Selamat datang di sistem manajemen P3M Polimdo</p>
            </div>
          </div>
        </div>

        {error && (
          <div className={`mb-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100 shadow-sm transform transition-all duration-500 ${showContent ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards dengan animasi bertahap */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className={`transform transition-all duration-500 hover:scale-[1.03] ${showContent ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              <StatsCard
                title="Total Proposal"
                value={stats.totalProposals || 0}
                icon="📄"
                color="blue"
                className="hover:shadow-xl"
              />
            </div>
            <div className={`transform transition-all duration-500 hover:scale-[1.03] ${showContent ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              <StatsCard
                title="Total Pengguna"
                value={stats.totalUsers || 0}
                icon="👥"
                color="green"
                className="hover:shadow-xl"
              />
            </div>
            <div className={`transform transition-all duration-500 hover:scale-[1.03] ${showContent ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              <StatsCard
                title="Proposal Pending"
                value={stats.pendingProposals || 0}
                icon="⏳"
                color="amber"
                className="hover:shadow-xl"
              />
            </div>
            <div className={`transform transition-all duration-500 hover:scale-[1.03] ${showContent ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
              <StatsCard
                title="Total Review"
                value={stats.totalReviews || 0}
                icon="📝"
                color="purple"
                className="hover:shadow-xl"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Proposals dengan animasi */}
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-xl ${showContent ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Proposal Terbaru</h2>
              </div>
            </div>
            <div className="p-5">
              {recentProposals.length > 0 ? (
                <div className="space-y-4">
                  {recentProposals.map((proposal) => (
                    <div 
                      key={proposal.id} 
                      className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 bg-opacity-50 rounded-r-lg transition-all duration-200 hover:bg-blue-100 transform hover:-translate-y-0.5"
                    >
                      <h3 className="font-medium text-gray-900 truncate flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="truncate">{proposal.judul}</span>
                      </h3>
                      <p className="text-sm text-gray-600 ml-6 mt-1 truncate">
                        Oleh: {proposal.ketua?.nama || 'Unknown'}
                      </p>
                      <div className="flex items-center justify-between mt-3 ml-6">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(proposal.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mt-2">Belum ada proposal terbaru</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Users dengan animasi */}
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-xl ${showContent ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
            <div className="border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Pengguna Terbaru</h2>
              </div>
            </div>
            <div className="p-5">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100 transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl w-10 h-10 flex items-center justify-center text-white font-bold">
                          {user.nama.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{user.nama}</h3>
                          <p className="text-xs text-gray-600 truncate max-w-[120px] md:max-w-[160px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mt-2">Belum ada pengguna terbaru</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements dengan animasi */}
        {announcements.length > 0 && (
          <div className={`mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-xl ${showContent ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
            <div className="border-b border-gray-200 bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Pengumuman</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-5">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className="border-l-4 border-teal-400 pl-4 py-3 bg-gradient-to-r from-teal-50/30 to-white rounded-r-lg transition-all duration-200 hover:bg-teal-50 transform hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {announcement.judul}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2 ml-7 line-clamp-3">
                      {announcement.konten}
                    </p>
                    <div className="mt-3 ml-7">
                      <button className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors">
                        Baca selengkapnya →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        <div className={`mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm transform transition-all duration-500 ${showContent ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Tindakan Cepat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-center shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5">
              <div className="text-2xl mb-2">📋</div>
              <span className="font-medium">Kelola Proposal</span>
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-center shadow-md hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5">
              <div className="text-2xl mb-2">👥</div>
              <span className="font-medium">Kelola Pengguna</span>
            </button>
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-4 text-center shadow-md hover:from-amber-600 hover:to-orange-700 transition-all transform hover:-translate-y-0.5">
              <div className="text-2xl mb-2">📢</div>
              <span className="font-medium">Buat Pengumuman</span>
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-xl p-4 text-center shadow-md hover:from-purple-600 hover:to-fuchsia-700 transition-all transform hover:-translate-y-0.5">
              <div className="text-2xl mb-2">📊</div>
              <span className="font-medium">Lihat Laporan</span>
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl transform transition-all duration-500 ${showContent ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Butuh bantuan mengelola sistem?</h3>
              <p className="text-indigo-100 max-w-md">
                Tim dukungan kami siap membantu Anda kapan saja
              </p>
            </div>
            <button className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg transform hover:-translate-y-0.5">
              Hubungi Dukungan
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS untuk animasi */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes text-gradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-text-gradient {
          background-size: 200% auto;
          animation: text-gradient 3s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    REVIEW: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    REVISION: 'bg-orange-100 text-orange-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getRoleColor = (role) => {
  const colors = {
    ADMIN: 'bg-purple-100 text-purple-800',
    DOSEN: 'bg-blue-100 text-blue-800',
    MAHASISWA: 'bg-green-100 text-green-800',
    REVIEWER: 'bg-orange-100 text-orange-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

export default AdminDashboard;