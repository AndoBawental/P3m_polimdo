import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegisterForm from '../components/Auth/RegisterForm';
import { authService } from '../services/authService';
import {  CheckCircle, AlertCircle } from 'lucide-react';

const BackgroundAnimation = () => {
  return (
    <>
      {/* Animasi untuk bagian atas */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden z-0">
        <div className="absolute -top-10 -left-20 w-64 h-64 bg-blue-100 opacity-20 rounded-full animate-move1"></div>
        <div className="absolute top-5 right-10 w-40 h-40 bg-indigo-100 opacity-20 rounded-full animate-move2"></div>
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-purple-100 opacity-20 rounded-full animate-move3"></div>
      </div>
      
      {/* Animasi untuk bagian tengah */}
      <div className="absolute top-1/3 left-0 right-0 h-96 overflow-hidden z-0">
        <div className="absolute top-20 left-1/4 w-24 h-24 bg-blue-100 opacity-10 rounded-full animate-move4"></div>
        <div className="absolute top-40 right-1/3 w-20 h-20 bg-indigo-100 opacity-10 rounded-full animate-move5"></div>
        <div className="absolute top-10 left-2/3 w-28 h-28 bg-purple-100 opacity-10 rounded-full animate-move6"></div>
        <div className="absolute top-60 left-10 w-32 h-32 bg-pink-100 opacity-10 rounded-full animate-move7"></div>
        
        {/* Animasi bentuk geometris */}
        <div className="absolute top-32 left-1/2 w-16 h-16 bg-blue-100 opacity-10 rotate-45 animate-pulse-slow"></div>
        <div className="absolute top-80 right-20 w-20 h-20 bg-indigo-100 opacity-10 rotate-12 animate-pulse-medium"></div>
        <div className="absolute top-20 left-20 w-12 h-12 bg-purple-100 opacity-10 rotate-30 animate-pulse-fast"></div>
      </div>
      
      {/* Animasi untuk bagian bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden z-0">
        <div className="absolute -bottom-10 left-20 w-48 h-48 bg-blue-100 opacity-20 rounded-full animate-move8"></div>
        <div className="absolute bottom-5 right-1/4 w-36 h-36 bg-indigo-100 opacity-20 rounded-full animate-move9"></div>
        <div className="absolute bottom-30 left-2/3 w-28 h-28 bg-purple-100 opacity-20 rounded-full animate-move10"></div>
      </div>
      
      {/* Styles for animations */}
      <style jsx>{`
        @keyframes move1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, 20px); }
        }
        @keyframes move2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 15px); }
        }
        @keyframes move3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(25px, -10px); }
        }
        @keyframes move4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, 30px); }
        }
        @keyframes move5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 25px); }
        }
        @keyframes move6 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(35px, -15px); }
        }
        @keyframes move7 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 40px); }
        }
        @keyframes move8 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(45px, -20px); }
        }
        @keyframes move9 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-35px, 10px); }
        }
        @keyframes move10 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1) rotate(45deg); opacity: 0.1; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 0.15; }
        }
        @keyframes pulse-medium {
          0%, 100% { transform: scale(1) rotate(12deg); opacity: 0.1; }
          50% { transform: scale(1.15) rotate(12deg); opacity: 0.15; }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1) rotate(30deg); opacity: 0.1; }
          50% { transform: scale(1.1) rotate(30deg); opacity: 0.15; }
        }
        .animate-move1 { animation: move1 8s infinite ease-in-out; }
        .animate-move2 { animation: move2 10s infinite ease-in-out; }
        .animate-move3 { animation: move3 12s infinite ease-in-out; }
        .animate-move4 { animation: move4 9s infinite ease-in-out; }
        .animate-move5 { animation: move5 11s infinite ease-in-out; }
        .animate-move6 { animation: move6 13s infinite ease-in-out; }
        .animate-move7 { animation: move7 10s infinite ease-in-out; }
        .animate-move8 { animation: move8 12s infinite ease-in-out; }
        .animate-move9 { animation: move9 9s infinite ease-in-out; }
        .animate-move10 { animation: move10 11s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-pulse-medium { animation: pulse-medium 4s infinite ease-in-out; }
        .animate-pulse-fast { animation: pulse-fast 3s infinite ease-in-out; }
      `}</style>
    </>
  );
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);
      
      if (response.success) {
        setSuccess(true);
        toast.success('Pendaftaran berhasil! Silakan login dengan akun Anda.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.message || 'Terjadi kesalahan saat mendaftar');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Data yang dimasukkan tidak valid');
      } else if (error.response?.status === 409) {
        toast.error('Email atau NIP/NIM sudah terdaftar');
      } else {
        toast.error('Terjadi kesalahan server. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
        <BackgroundAnimation />
        <div className="max-w-md w-full z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center backdrop-blur-sm bg-opacity-80">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pendaftaran Berhasil!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login dalam beberapa detik.
            </p>
            
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block transform hover:scale-105 transition-transform"
              >
                Login Sekarang
              </Link>
              
              <Link
                to="/"
                className="w-full text-gray-600 hover:text-gray-800 transition-colors inline-block"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <BackgroundAnimation />

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-opacity-80">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-5 left-10 w-16 h-16 bg-white rounded-full animate-move1"></div>
                <div className="absolute top-15 right-20 w-12 h-12 bg-white rounded-full animate-move2"></div>
                <div className="absolute bottom-5 left-1/4 w-10 h-10 bg-white rounded-full animate-move3"></div>
              </div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Daftar Akun Baru
                </h1>
                <p className="text-blue-100">
                  Bergabunglah dengan sistem manajemen proposal penelitian dan pengabdian
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 transform transition-transform hover:scale-[1.02]">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0 animate-pulse" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Informasi Penting:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Pastikan email yang digunakan masih aktif</li>
                      <li>Untuk mahasiswa, pilih jurusan dan program studi dengan benar</li>
                      <li>Untuk dosen dan reviewer, pastikan NIP sudah benar</li>
                      <li>Akun akan diverifikasi oleh admin sebelum dapat digunakan</li>
                    </ul>
                  </div>
                </div>
              </div>

              <RegisterForm onSubmit={handleRegister} loading={loading} />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
              Dengan mendaftar, Anda menyetujui{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                Syarat dan Ketentuan
              </Link>{' '}
              serta{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                Kebijakan Privasi
              </Link>{' '}
              kami.
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-lg shadow-md p-6 backdrop-blur-sm bg-opacity-80 transform transition-transform hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Peran Pengguna dalam Sistem
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center transform transition-transform hover:scale-105">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">M</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Mahasiswa</h4>
                  <p className="text-gray-600">
                    Dapat mengajukan proposal penelitian atau pengabdian sesuai dengan program studi
                  </p>
                </div>
                
                <div className="text-center transform transition-transform hover:scale-105">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">D</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Dosen</h4>
                  <p className="text-gray-600">
                    Dapat mengajukan proposal dan membimbing mahasiswa dalam penelitian
                  </p>
                </div>
                
                <div className="text-center transform transition-transform hover:scale-105">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">R</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Reviewer</h4>
                  <p className="text-gray-600">
                    Bertugas mengevaluasi dan memberikan penilaian terhadap proposal yang diajukan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;