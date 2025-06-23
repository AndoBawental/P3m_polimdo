// src/pages/Dashboard/ReviewerDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dashboardService from '../../services/dashboardService';
import StatsCard from '../../components/Dashboard/StatsCard';
import Loading from '../../components/Common/Loading';
import StatusBadge from '../../components/Common/StatusBadge';

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myReviews: 0,
    pendingReviews: 0,
    completedReviews: 0,
    totalAssignments: 0
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsResponse = await dashboardService.getDashboardStats();
      
      if (statsResponse.success) {
        setStats({
          myReviews: statsResponse.data.myReviews || 0,
          pendingReviews: statsResponse.data.pendingReviews || 0,
          completedReviews: statsResponse.data.completedReviews || 0,
          totalAssignments: (statsResponse.data.myReviews || 0) + (statsResponse.data.pendingReviews || 0)
        });
      }

      const reviewsResponse = await dashboardService.getRecentReviews(5);
      if (reviewsResponse.success) {
        setRecentReviews(reviewsResponse.data);
      }

      const announcementsResponse = await dashboardService.getAnnouncements(3);
      if (announcementsResponse.success) {
        setAnnouncements(announcementsResponse.data);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  const handleViewAllReviews = () => {
    navigate('/reviews');
  };

  // Stats configuration for reviewer
  const statsConfig = [
    {
      title: 'Total Penugasan',
      value: stats.totalAssignments,
      icon: '📋',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Review Pending',
      value: stats.pendingReviews,
      icon: '⏳',
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Review Selesai',
      value: stats.completedReviews,
      icon: '✅',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Animasi container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animasi item
  const item = {
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

  // Animasi float
  const floating = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-10"
          variants={floating}
          animate="float"
        ></motion.div>
        <motion.div 
          className="absolute top-1/3 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-10"
          variants={floating}
          animate="float"
          transition={{ delay: 0.5 }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-10"
          variants={floating}
          animate="float"
          transition={{ delay: 1 }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 right-1/3 w-12 h-12 bg-amber-200 rounded-full opacity-10"
          variants={floating}
          animate="float"
          transition={{ delay: 1.5 }}
        ></motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          variants={item}
        >
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <motion.div 
                  className="bg-white bg-opacity-20 p-3 rounded-xl mr-4 backdrop-blur-sm"
                  whileHover={{ rotate: 10 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                <div>
                  <motion.h1 
                    className="text-2xl md:text-3xl font-bold mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Dashboard Reviewer
                  </motion.h1>
                  <p className="text-blue-100">
                    Selamat datang, <span className="font-semibold">{user?.nama || 'Reviewer'}</span>! 
                    <span className="ml-2">
                      {new Date().toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <motion.div 
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30"
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="text-white text-sm font-medium">
                    Status: Reviewer Aktif
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Handling */}
        {error && (
          <motion.div 
            className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100 shadow-sm"
            variants={item}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={fetchDashboardData}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm transition-colors shadow-sm"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={container}
        >
          {statsConfig.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={item}
              whileHover={{ scale: 1.03 }}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                color={stat.color}
                icon={stat.icon}
                gradient={stat.gradient}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={container}
        >
          {/* Recent Reviews Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            variants={item}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Review Saya
                </h3>
                <motion.button
                  onClick={handleViewAllReviews}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  Lihat Semua
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              {recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <motion.div 
                      key={review.id}
                      className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-100 overflow-hidden"
                      onClick={() => handleViewReview(review.id)}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-lg mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 mb-1 truncate">
                            {review.proposal?.judul || 'Judul Tidak Tersedia'}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 truncate">
                            Peneliti: {review.proposal?.ketua?.nama || 'Tidak Diketahui'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(review.tanggal_review).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex-shrink-0">
                              <StatusBadge 
                                status={review.rekomendasi}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div 
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="bg-blue-100 p-4 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </motion.div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Tidak ada penugasan review
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto mb-4">
                    Anda akan menerima notifikasi ketika ada penugasan baru
                  </p>
                  <motion.button
                    onClick={handleViewAllReviews}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lihat Semua Review
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Announcements Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            variants={item}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Pengumuman Terbaru
              </h3>
            </div>
            
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <motion.div 
                      key={announcement.id || index} 
                      className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 mt-1 mr-3 ${
                          index === 0 ? 'text-blue-500' : 
                          index === 1 ? 'text-indigo-500' : 
                          'text-purple-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 mb-1 truncate">
                            {announcement.judul}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {announcement.konten}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                            {announcement.status && (
                              <div className="flex-shrink-0">
                                <StatusBadge 
                                  status={announcement.status}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div 
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                  </motion.div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Tidak ada pengumuman
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Pengumuman terbaru akan muncul di sini
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Tips & Guidelines Section */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm"
          variants={item}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Panduan Review untuk Reviewer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-lg">📝</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Kualitas Review</h4>
                  <p className="text-sm text-gray-600">
                    Berikan penilaian yang objektif dan konstruktif sesuai dengan kriteria yang telah ditetapkan.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <span className="text-amber-600 text-lg">⏰</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Tepat Waktu</h4>
                  <p className="text-sm text-gray-600">
                    Selesaikan review sesuai dengan tenggat waktu yang telah ditentukan.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-lg">📊</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Skor & Rekomendasi</h4>
                  <p className="text-sm text-gray-600">
                    Berikan skor yang sesuai dan rekomendasi yang jelas (Layak, Tidak Layak, atau Revisi).
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <span className="text-purple-600 text-lg">💬</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Catatan Konstruktif</h4>
                  <p className="text-sm text-gray-600">
                    Berikan catatan yang membantu peneliti untuk memperbaiki proposal mereka.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl"
          variants={item}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Siap untuk memulai review?</h3>
              <p className="text-green-100 max-w-md">
                Akses semua penugasan review Anda dan berikan penilaian yang berkualitas
              </p>
            </div>
            <motion.button
              onClick={handleViewAllReviews}
              className="bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Penugasan Saya
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReviewerDashboard;