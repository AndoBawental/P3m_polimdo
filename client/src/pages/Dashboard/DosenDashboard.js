// src/pages/Dosen/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProposalStatusCard from '../../components/Dashboard/ProposalStatusCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';
import dashboardService from '../../services/dashboardService';

// Animasi
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 14 
    }
  }
};

const floatingVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Icon Components dengan animasi
const DocumentIcon = () => (
  <motion.div variants={floatingVariants} animate="float">
    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  </motion.div>
);

const ClockIcon = () => (
  <motion.div variants={floatingVariants} animate="float">
    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </motion.div>
);

const CheckCircleIcon = () => (
  <motion.div variants={floatingVariants} animate="float">
    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </motion.div>
);

const XCircleIcon = () => (
  <motion.div variants={floatingVariants} animate="float">
    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </motion.div>
);

const ClipboardIcon = () => (
  <motion.div variants={floatingVariants} animate="float">
    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
    </svg>
  </motion.div>
);

const PlusIcon = () => (
  <motion.div whileHover={{ scale: 1.1 }}>
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </motion.div>
);

const EyeIcon = () => (
  <motion.div whileHover={{ scale: 1.1 }}>
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </motion.div>
);

const TagIcon = () => (
  <motion.div variants={floatingVariants} animate="float">
    <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  </motion.div>
);

const DosenDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProposals: 0,
    asKetua: 0,
    asAnggota: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0,
    revisionProposals: 0
  });
  const [recentProposals, setRecentProposals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, proposalsRes, announcementsRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProposals(5),
        dashboardService.getAnnouncements(3)
      ]);

      if (statsRes.success) {
        setStats({
          totalProposals: statsRes.data.totalProposals || 0,
          asKetua: statsRes.data.asKetua || 0,
          asAnggota: statsRes.data.asAnggota || 0,
          pendingProposals: statsRes.data.pendingProposals || 0,
          approvedProposals: statsRes.data.approvedProposals || 0,
          rejectedProposals: statsRes.data.rejectedProposals || 0,
          revisionProposals: statsRes.data.revisionProposals || 0
        });
      }

      if (proposalsRes.success && Array.isArray(proposalsRes.data)) {
        setRecentProposals(proposalsRes.data);
      } else {
        setRecentProposals([]);
      }

      if (announcementsRes.success && Array.isArray(announcementsRes.data)) {
        setAnnouncements(announcementsRes.data);
      } else {
        setAnnouncements([]);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
      setRecentProposals([]);
      setAnnouncements([]);
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
      default:
        break;
    }
  };

  const statsConfig = [
    { 
      title: 'Total Proposal', 
      value: stats.totalProposals, 
      icon: <DocumentIcon />, 
      color: 'blue',
      description: 'Semua proposal di sistem'
    },
    { 
      title: 'Proposal Saya', 
      value: stats.asKetua, 
      icon: <ClipboardIcon />, 
      color: 'purple',
      description: 'Proposal yang Anda ajukan'
    },
    { 
      title: 'Proposal Di-tag', 
      value: stats.asAnggota, 
      icon: <TagIcon />, 
      color: 'cyan',
      description: 'Proposal yang Anda ikuti'
    },
    { 
      title: 'Menunggu', 
      value: stats.pendingProposals, 
      icon: <ClockIcon />, 
      color: 'amber',
      description: 'Proposal dalam proses review'
    },
    { 
      title: 'Disetujui', 
      value: stats.approvedProposals, 
      icon: <CheckCircleIcon />, 
      color: 'green',
      description: 'Proposal yang telah disetujui'
    },
    { 
      title: 'Ditolak', 
      value: stats.rejectedProposals, 
      icon: <XCircleIcon />, 
      color: 'red',
      description: 'Proposal yang tidak disetujui'
    }
  ];

  const quickActions = [
    {
      title: 'Buat Proposal Baru',
      description: 'Mulai membuat proposal penelitian',
      icon: <PlusIcon />,
      color: 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      action: 'create'
    },
    {
      title: 'Lihat Proposal Saya',
      description: 'Kelola proposal yang telah dibuat',
      icon: <EyeIcon />,
      color: 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
      action: 'view-proposals'
    },
  ];

  if (loading) return <LoadingSpinner message="Memuat dashboard..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
        {/* Header dengan animasi gelombang */}
        <motion.div 
          className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white overflow-hidden"
          variants={itemVariants}
        >
          {/* Gelombang animasi */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[200%] -left-[50%] w-[200%] h-[200%] animate-spin-slow">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full"></div>
              <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full"></div>
              <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-gradient-to-r from-indigo-300/10 to-purple-300/10 rounded-full"></div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-3"
                variants={itemVariants}
              >
                Dashboard Dosen
              </motion.h1>
              <motion.p 
                className="text-indigo-100 max-w-2xl"
                variants={itemVariants}
              >
                Selamat datang, <span className="font-semibold text-white">{user?.nama || 'Dosen'}</span>! Kelola penelitian dan pantau perkembangan proposal Anda.
              </motion.p>
            </div>
            <motion.div 
             
            >
              <div className="flex items-center">
                <motion.div 
                 >
                 
                </motion.div>
                <div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6"
          variants={containerVariants}
        >
          {statsConfig.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl bg-white shadow-sm"
                  variants={floatingVariants}
                  animate="float"
                >
                  {stat.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className={`${action.color} rounded-2xl p-6 text-left text-white transform transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between h-full`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-white bg-opacity-30 p-2 rounded-xl mr-3"
                    whileHover={{ rotate: 90, transition: { duration: 0.5 } }}
                  >
                    {action.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold">{action.title}</h3>
                </div>
                <p className="text-indigo-100 pl-11">{action.description}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <motion.div 
                  className="bg-white bg-opacity-20 rounded-full p-2"
                  whileHover={{ rotate: 45 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Proposal Terbaru */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <motion.div 
                  className="mr-2"
                  variants={floatingVariants}
                  animate="float"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </motion.div>
                Proposal Terbaru Saya
              </h3>
              <motion.button 
                onClick={() => handleQuickAction('view-proposals')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                whileHover={{ x: 5 }}
              >
                Lihat Semua
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </motion.button>
            </div>
          </div>
          <div className="p-6">
            {recentProposals.length > 0 ? (
              <div className="space-y-5">
                {recentProposals.map((proposal, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProposalStatusCard proposal={proposal} user={user} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6"
                  variants={floatingVariants}
                  animate="float"
                >
                  <DocumentIcon />
                </motion.div>
                <p className="text-gray-600 text-lg mb-4">Belum ada proposal yang dibuat</p>
                <motion.button
                  onClick={() => handleQuickAction('create')}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusIcon />
                  <span className="ml-2">Buat Proposal Baru</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pengumuman Terbaru */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <motion.div 
                className="mr-2"
                variants={floatingVariants}
                animate="float"
              >
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
              </motion.div>
              Pengumuman Terbaru
            </h3>
          </div>
          <div className="p-6">
            {announcements.length > 0 ? (
              <div className="space-y-6">
                {announcements.map((announcement, index) => (
                  <motion.div 
                    key={index} 
                    className="border-l-4 border-purple-500 pl-4 py-4 bg-purple-50 bg-opacity-50 rounded-r-lg transition-colors hover:bg-purple-100"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">{announcement.judul}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {announcement.konten}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 mb-6"
                  variants={floatingVariants}
                  animate="float"
                >
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"></path>
                  </svg>
                </motion.div>
                <p className="text-gray-600 text-lg">Belum ada pengumuman terbaru</p>
                <p className="text-gray-500 mt-2">Cek kembali nanti untuk informasi terbaru</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Panduan untuk Dosen */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-indigo-100"
          variants={itemVariants}
        >
          <div className="flex items-center mb-6">
            <motion.div 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-xl mr-4"
              variants={pulseVariants}
              animate="pulse"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900">
              Panduan untuk Dosen
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { 
                number: 1, 
                title: "📝 Menulis Proposal", 
                content: "Pastikan proposal memiliki kontribusi ilmiah yang jelas. Sertakan metodologi penelitian yang solid dan rencana pelaksanaan yang rinci.",
                color: "indigo"
              },
              { 
                number: 2, 
                title: "🏷️ Proposal Tag", 
                content: "Proposal di-tag ketika Anda menjadi anggota tim. Pantau perkembangan dan berikan kontribusi aktif dalam penelitian.",
                color: "cyan"
              },
              { 
                number: 3, 
                title: "⏰ Manajemen Waktu", 
                content: "Siapkan timeline penelitian yang realistis. Alokasikan waktu untuk penelitian, publikasi, dan pengabdian masyarakat.",
                color: "purple"
              },
              { 
                number: 4, 
                title: "📊 Pelaporan", 
                content: "Lakukan pelaporan kemajuan sesuai jadwal. Dokumentasikan temuan dan kendala selama penelitian.",
                color: "indigo"
              },
              { 
                number: 5, 
                title: "👥 Bimbingan Mahasiswa", 
                content: "Bimbing mahasiswa dalam penelitian mereka. Jadwalkan pertemuan rutin untuk memantau perkembangan.",
                color: "blue"
              },
              { 
                number: 6, 
                title: "🔍 Publikasi Ilmiah", 
                content: "Publikasikan hasil penelitian di jurnal terindeks. Pertimbangkan konferensi nasional/internasional untuk diseminasi hasil.",
                color: "purple"
              }
            ].map((tip, index) => (
              <motion.div 
                key={index}
                className={`bg-white p-5 rounded-xl border border-${tip.color}-100 shadow-sm transition-all hover:shadow-md`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`bg-${tip.color}-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <span className={`text-${tip.color}-800 font-bold`}>{tip.number}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-gray-600">{tip.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Pencapaian Dosen */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6"
          variants={itemVariants}
        >
          <div className="flex items-center mb-6">
            <motion.div 
              className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-xl mr-4"
              variants={pulseVariants}
              animate="pulse"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900">
              Pencapaian & Motivasi
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Kualitas Penelitian",
                content: "Fokus pada penelitian yang berdampak tinggi. Kolaborasi dengan peneliti lain dapat meningkatkan kualitas dan dampak penelitian.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>,
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                title: "Pengabdian Masyarakat",
                content: "Integrasikan penelitian dengan pengabdian masyarakat. Hasil penelitian sebaiknya memberikan manfaat langsung bagi masyarakat.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>,
                gradient: "from-green-500 to-teal-500"
              },
              {
                title: "Pengembangan Diri",
                content: "Terus kembangkan kompetensi melalui pelatihan dan workshop. Ikuti perkembangan terbaru dalam bidang keilmuan Anda.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>,
                gradient: "from-amber-500 to-orange-500"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r rounded-full mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h4>
                <p className="text-gray-600">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DosenDashboard;