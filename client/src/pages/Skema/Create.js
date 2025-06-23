import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkemaForm from '../../components/Skema/SkemaForm';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import {  FaCheck, FaLightbulb, FaInfoCircle, FaExclamationTriangle, FaBook, FaUsers, FaChartLine } from 'react-icons/fa';

const SkemaCreate = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (skemaData) => {
    try {
      setLoading(true);
      setError('');

      const response = await skemaService.createSkema(skemaData);

      if (response.success) {
        const successMessage = typeof response.message === 'string'
          ? response.message
          : 'Skema berhasil dibuat';

        showSuccess(successMessage);
        navigate('/skema');
      } else {
        const errorMessage = typeof response.message === 'string'
          ? response.message
          : 'Gagal membuat skema';

        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Error creating skema:', err);

      const errorMessage = typeof err.response?.data?.message === 'string'
        ? err.response.data.message
        : typeof err.message === 'string'
          ? err.message
          : 'Terjadi kesalahan saat membuat skema';

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Animasi
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-6 shadow-lg"
            animate={{ 
              rotate: [0, 10, -10, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
          >
            <FaBook className="text-3xl" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-3"
            variants={itemVariants}
          >
            Tambah Skema Pendanaan Baru
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            variants={itemVariants}
          >
            Isi formulir di bawah ini untuk menambahkan skema pendanaan baru ke sistem
          </motion.p>
          
          
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:flex">
            {/* Sidebar with Info */}
            <motion.div 
              className="md:w-1/3 bg-gradient-to-b from-blue-50 to-indigo-50 p-6 border-r border-gray-100"
              variants={itemVariants}
            >
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaLightbulb className="text-yellow-500 mr-2" />
                  Panduan Pengisian
                </h3>
                
                <ul className="space-y-4">
                  <motion.li 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <FaCheck className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Kolom Wajib</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Isi semua kolom yang ditandai dengan tanda bintang (*)
                      </p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <FaCheck className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Kode Unik</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Pastikan kode skema unik dan belum pernah digunakan
                      </p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <FaCheck className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Periode Pendanaan</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Periksa kembali rentang tanggal buka dan tutup pendanaan
                      </p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <FaCheck className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Besaran Dana</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Verifikasi nilai dana minimum dan maksimum yang ditetapkan
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </div>
              
              <motion.div 
                className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                variants={itemVariants}
              >
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <FaInfoCircle className="text-blue-600 mr-2" />
                  Informasi Penting
                </h3>
                <p className="text-sm text-blue-700">
                  Setelah skema dibuat, beberapa informasi seperti kode skema dan kategori tidak dapat diubah. Pastikan data yang dimasukkan sudah benar.
                </p>
              </motion.div>
            </motion.div>
            
            {/* Main Form Content */}
            <motion.div 
              className="md:w-2/3 p-6"
              variants={itemVariants}
            >
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex-shrink-0 pt-0.5">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-md font-medium text-red-800">Terjadi Kesalahan</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              <SkemaForm 
                onSubmit={handleSubmit} 
                isSubmitting={loading}
                submitButton={
                  <motion.button
                    type="submit"
                    className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center shadow-lg ${
                      loading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Membuat Skema...
                      </>
                    ) : (
                      <>
                        Buat Skema Baru
                      </>
                    )}
                  </motion.button>
                }
              />
            </motion.div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
            
            
            <div className="text-sm text-gray-500 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" />
              Harap periksa kembali sebelum menyimpan
            </div>
          </div>
        </motion.div>
        
        {/* Resources Section */}
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FaChartLine className="text-xl text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-lg">Dokumentasi</h3>
            </div>
            <p className="text-gray-600">
              Pelajari lebih lanjut tentang membuat skema pendanaan melalui panduan kami.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FaUsers className="text-xl text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-lg">Dukungan Tim</h3>
            </div>
            <p className="text-gray-600">
              Butuh bantuan? Hubungi tim pendukung kami untuk panduan langsung.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <FaBook className="text-xl text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-lg">Skema Populer</h3>
            </div>
            <p className="text-gray-600">
              Lihat contoh skema pendanaan yang paling sering digunakan.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkemaCreate;