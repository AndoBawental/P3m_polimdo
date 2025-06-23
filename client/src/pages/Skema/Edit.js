// src/pages/Skema/Edit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import skemaService from '../../services/skemaService';
import SkemaForm from '../../components/Skema/SkemaForm';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaEdit, FaSync, FaExclamationTriangle } from 'react-icons/fa';

const SkemaEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [skema, setSkema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSkema = async () => {
      try {
        setLoading(true);
        const response = await skemaService.getSkemaById(id);
        
        if (response.success) {
          setSkema(response.data);
        } else {
          setError(response.message || 'Gagal memuat data skema');
          showToast('error', response.message || 'Gagal memuat data skema');
        }
      } catch (err) {
        console.error('Error fetching skema:', err);
        setError('Terjadi kesalahan saat memuat data skema');
        showToast('error', 'Terjadi kesalahan saat memuat data skema');
      } finally {
        setLoading(false);
      }
    };

    fetchSkema();
  }, [id, showToast]);

  const handleSubmit = async (skemaData) => {
    try {
      setIsSubmitting(true);
      const response = await skemaService.updateSkema(id, skemaData);
      
      if (response.success) {
        showToast('success', 'Skema berhasil diperbarui');
        navigate(`/skema/${id}`);
      } else {
        setError(response.message || 'Gagal memperbarui skema');
        showToast('error', response.message || 'Gagal memperbarui skema');
      }
    } catch (err) {
      console.error('Error updating skema:', err);
      setError('Terjadi kesalahan saat memperbarui skema');
      showToast('error', 'Terjadi kesalahan saat memperbarui skema');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animasi untuk transisi
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0, y: -20 }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-blue-600 text-5xl mb-6 mx-auto"
          >
            <FaSync />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Memuat Data Skema</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Sedang mengambil data skema dari server. Harap tunggu sebentar...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error && !skema) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
              <FaExclamationTriangle className="text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowLeft className="mr-2" /> Kembali
              </motion.button>
              <motion.button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSync className="mr-2" /> Coba Lagi
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!skema) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-6">
              <FaExclamationTriangle className="text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skema Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">
              Skema yang Anda coba edit tidak ditemukan. Mungkin sudah dihapus atau ID tidak valid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowLeft className="mr-2" /> Kembali
              </motion.button>
              <motion.button
                onClick={() => navigate('/skema')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Lihat Daftar Skema
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <motion.h1 
                  className="text-2xl md:text-3xl font-bold mb-2"
                  variants={itemVariants}
                >
                  Edit Skema Pendanaan
                </motion.h1>
                <motion.p 
                  className="text-blue-100 opacity-90"
                  variants={itemVariants}
                >
                  Memperbarui data skema: <span className="font-semibold">{skema.nama}</span>
                </motion.p>
              </div>
              <motion.div variants={itemVariants}>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-all"
                >
                  <FaArrowLeft className="mr-2" /> Kembali
                </button>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <motion.div 
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaExclamationTriangle className="mt-1 mr-3 text-red-600 flex-shrink-0" />
                <div>{error}</div>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
            >
              <SkemaForm 
                skema={skema} 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                submitButton={
                  <motion.button
                    type="submit"
                    className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center shadow-lg ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSync className="animate-spin mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </motion.button>
                }
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Informasi tambahan */}
        <motion.div 
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaEdit className="mr-2 text-blue-600" /> Tips Pengeditan Skema
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <p>Pastikan semua informasi yang diperlukan telah diisi dengan benar</p>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <p>Periksa kembali periode pendanaan untuk memastikan keakuratannya</p>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <p>Jika mengubah status skema, pastikan untuk memberi tahu pengguna terkait</p>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <p>Verifikasi besaran dana minimal dan maksimal sebelum menyimpan perubahan</p>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SkemaEdit;