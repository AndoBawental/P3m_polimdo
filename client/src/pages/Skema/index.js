// src/pages/Skema/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import SkemaList from '../../components/Skema/SkemaList';
import skemaService from '../../services/skemaService';
import { motion } from 'framer-motion';
import { FaPlus, FaBook, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';

const SkemaIndex = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Handler untuk hapus skema
  const handleDelete = async (skema) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus skema "${skema.nama}"?`)) {
      return false;
    }
    
    try {
      const response = await skemaService.deleteSkema(skema.id);
      if (response.success) {
        showToast('success', 'Skema berhasil dihapus');
        return true;
      } else {
        showToast('error', response.message || 'Gagal menghapus skema');
        return false;
      }
    } catch (error) {
      showToast('error', 'Terjadi kesalahan saat menghapus skema');
      return false;
    }
  };

  // Animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 120 
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <FaBook className="text-3xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Kelola Skema Pendanaan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan dan kelola seluruh skema penelitian dan pengabdian masyarakat untuk mendukung inovasi
          </p>
        </motion.div>

        {/* Features Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg mr-4 bg-blue-100 text-blue-600">
                <FaChartLine className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Manajemen Terpusat</h3>
              </div>
            </div>
            <p className="text-gray-600">
              Kelola semua skema pendanaan dari berbagai sumber dalam satu platform terintegrasi
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg mr-4 bg-green-100 text-green-600">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Kolaborasi Efektif</h3>
              </div>
            </div>
            <p className="text-gray-600">
              Fasilitasi kerja sama antar peneliti dan mitra dengan fitur kolaborasi yang powerful
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg mr-4 bg-purple-100 text-purple-600">
                <FaLightbulb className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Inovasi Terbuka</h3>
              </div>
            </div>
            <p className="text-gray-600">
              Dukung terciptanya inovasi terbuka dengan sistem pendanaan yang transparan dan akuntabel
            </p>
          </motion.div>
        </motion.div>

        {/* Action Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daftar Skema Pendanaan</h2>
            <p className="text-gray-600 mt-1">
              Temukan dan kelola semua skema pendanaan yang tersedia
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/skema/create')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus className="mr-2" />
            Tambah Skema Baru
          </motion.button>
        </motion.div>

        {/* Gunakan komponen SkemaList yang sudah diperbaiki */}
        <SkemaList 
          showActions={true} 
          onDelete={handleDelete} 
          showFilters={true}
        />

        {/* Call to Action */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Tingkatkan Kualitas Penelitian Anda</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-8">
            Daftarkan skema pendanaan baru untuk menjangkau lebih banyak peneliti dan inovator
          </p>
          <motion.button
            onClick={() => navigate('/skema/create')}
            className="bg-white text-blue-600 hover:text-blue-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="inline mr-2" />
            Buat Skema Baru Sekarang
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SkemaIndex;