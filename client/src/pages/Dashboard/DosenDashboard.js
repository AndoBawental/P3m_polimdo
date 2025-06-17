import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import ProposalStatusCard from '../../components/Dashboard/ProposalStatusCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';

// Icon Components dengan animasi hover
const DocumentIcon = () => (
  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6 animate-pulse group-hover:animate-none group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6 group-hover:animate-bounce group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-6 h-6 group-hover:animate-wiggle group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-5 h-5 group-hover:animate-pulse group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const DosenDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myProposals: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0
  });
  const [recentProposals, setRecentProposals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      // Set timeout untuk animasi masuk setelah loading selesai
      setTimeout(() => setShowContent(true), 50);
    }
  }, [loading, error]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowContent(false);
      
      const [statsRes, proposalsRes, announcementsRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProposals(5),
        dashboardService.getAnnouncements(3)
      ]);

      if (statsRes.success) {
        setStats({
          myProposals: statsRes.data.myProposals || 0,
          pendingProposals: statsRes.data.pendingProposals || 0,
          approvedProposals: statsRes.data.approvedProposals || 0,
          rejectedProposals: statsRes.data.rejectedProposals || 0
        });
      }

      if (proposalsRes.success) {
        setRecentProposals(proposalsRes.data || []);
      }

      if (announcementsRes.success) {
        setAnnouncements(announcementsRes.data || []);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create':
        navigate('/dosen/proposals/create');
        break;
      case 'view-proposals':
        navigate('/dosen/proposals');
        break;
      case 'view-skema':
        navigate('/dosen/skema');
        break;
      default:
        break;
    }
  };

  const statsConfig = [
    { 
      title: 'Total Proposal', 
      value: stats.myProposals, 
      icon: <DocumentIcon />, 
      color: 'blue',
      description: 'Semua proposal yang telah dibuat',
      animation: 'animate-fade-in-up delay-100'
    },
    { 
      title: 'Proposal Pending', 
      value: stats.pendingProposals, 
      icon: <ClockIcon />, 
      color: 'yellow',
      description: 'Menunggu review',
      animation: 'animate-fade-in-up delay-200'
    },
    { 
      title: 'Proposal Disetujui', 
      value: stats.approvedProposals, 
      icon: <CheckCircleIcon />, 
      color: 'green',
      description: 'Proposal yang telah disetujui',
      animation: 'animate-fade-in-up delay-300'
    },
    { 
      title: 'Proposal Ditolak', 
      value: stats.rejectedProposals, 
      icon: <XCircleIcon />, 
      color: 'red',
      description: 'Proposal yang tidak disetujui',
      animation: 'animate-fade-in-up delay-400'
    }
  ];

  const quickActions = [
    {
      title: 'Buat Proposal Baru',
      description: 'Mulai membuat proposal penelitian',
      icon: <PlusIcon />,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      action: 'create',
      animation: 'animate-fade-in-up delay-200'
    },
    {
      title: 'Lihat Proposal Saya',
      description: 'Kelola proposal yang telah dibuat',
      icon: <EyeIcon />,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
      action: 'view-proposals',
      animation: 'animate-fade-in-up delay-300'
    },
    {
      title: 'Lihat Skema',
      description: 'Eksplor skema penelitian yang tersedia',
      icon: <BookOpenIcon />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
      action: 'view-skema',
      animation: 'animate-fade-in-up delay-400'
    }
  ];

  if (loading) return <LoadingSpinner message="Memuat dashboard..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6">
      {/* Animasi background floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-10 animate-pulse animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-yellow-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-3000"></div>
      </div>
      
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header dengan animasi */}
        <div className={`bg-white rounded-xl shadow-lg p-6 border border-indigo-100 transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-text-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Dosen
              </h1>
              <p className="text-gray-600">
                Selamat datang, <span className="font-semibold text-indigo-700">{user?.nama || 'Dosen'}</span>! Kelola proposal penelitian Anda dengan mudah.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200 rounded-lg px-4 py-2 shadow-sm">
                <p className="text-sm text-indigo-800">
                  <span className="font-semibold">Status:</span> Dosen Peneliti
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards dengan animasi bertahap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 transform transition-all duration-500 hover:scale-[1.03] hover:shadow-lg group ${showContent ? stat.animation : 'opacity-0'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 animate-countup">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 group-hover:bg-${stat.color}-200 transition-colors`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions dengan animasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className={`${action.color} rounded-xl p-6 text-left text-white transform transition-all duration-500 group ${showContent ? action.animation : 'opacity-0'} hover:shadow-xl hover:scale-[1.02]`}
            >
              <div className="flex items-center mb-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3 group-hover:bg-opacity-30 transition-all">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold">{action.title}</h3>
              </div>
              <p className="text-white text-opacity-90">{action.description}</p>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Proposals */}
          <div className={`bg-white rounded-xl shadow-md transform transition-all duration-500 ${showContent ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Proposal Terbaru Saya
                </h3>
                <button 
                  onClick={() => handleQuickAction('view-proposals')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group"
                >
                  Lihat Semua
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentProposals.length > 0 ? (
                <div className="space-y-4">
                  {recentProposals.map((proposal, index) => (
                    <div 
                      key={index} 
                      className={`transform transition-all duration-300 hover:-translate-y-1 hover:shadow-sm ${index > 0 ? 'mt-4' : ''}`}
                    >
                      <ProposalStatusCard proposal={proposal} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                    <DocumentIcon className="mx-auto text-gray-400 w-12 h-12" />
                  </div>
                  <p className="text-gray-500 mt-2">Belum ada proposal yang dibuat</p>
                  <button
                    onClick={() => handleQuickAction('create')}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Buat Proposal Baru
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className={`bg-white rounded-xl shadow-md transform transition-all duration-500 ${showContent ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pengumuman Terbaru
                </h3>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group"
                >
                  Lihat Semua
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <div 
                      key={index} 
                      className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-blue-50 rounded-r-lg transition-all transform hover:translate-x-1 duration-300 cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {announcement.judul}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {announcement.konten}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M7 8h10m0 0V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2m10 0v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8m10 0H7" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Belum ada pengumuman terbaru</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips & Guide dengan animasi */}
        <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 transform transition-all duration-500 ${showContent ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              Panduan untuk Dosen
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all transform hover:-translate-y-1 hover:shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <span className="inline-block mr-2 text-xl">📝</span> Pengajuan Proposal
              </h4>
              <p className="text-sm text-gray-600">
                Pastikan proposal mencantumkan anggaran yang jelas dan sesuai dengan skema yang dipilih. Lampirkan dokumen pendukung yang lengkap.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all transform hover:-translate-y-1 hover:shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <span className="inline-block mr-2 text-xl">📊</span> Pelaporan Penelitian
              </h4>
              <p className="text-sm text-gray-600">
                Lakukan pelaporan kemajuan penelitian sesuai jadwal yang ditentukan. Gunakan template laporan yang telah disediakan.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all transform hover:-translate-y-1 hover:shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <span className="inline-block mr-2 text-xl">🔍</span> Review Proposal
              </h4>
              <p className="text-sm text-gray-600">
                Sebagai reviewer, berikan ulasan yang konstruktif dan tepat waktu. Fokus pada kualitas metodologi dan kesesuaian dengan skema.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all transform hover:-translate-y-1 hover:shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <span className="inline-block mr-2 text-xl">💼</span> Manajemen Tim
              </h4>
              <p className="text-sm text-gray-600">
                Pastikan semua anggota tim memahami tanggung jawab masing-masing. Lakukan koordinasi rutin untuk memantau perkembangan penelitian.
              </p>
            </div>
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
        
        @keyframes wiggle {
          0%, 7% {
            transform: rotateZ(0);
          }
          15% {
            transform: rotateZ(-10deg);
          }
          20% {
            transform: rotateZ(8deg);
          }
          25% {
            transform: rotateZ(-6deg);
          }
          30% {
            transform: rotateZ(4deg);
          }
          35% {
            transform: rotateZ(-2deg);
          }
          40%, 100% {
            transform: rotateZ(0);
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
        
        .animate-wiggle {
          animation: wiggle 1s ease;
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
      `}</style>
    </div>
  );
};

export default DosenDashboard;