// src/pages/Login.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';
import { motion } from 'framer-motion';

// Floating Elements Component
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full"
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute top-40 right-10 w-20 h-20 bg-indigo-400/10 rounded-full"
      animate={{
        y: [0, 15, 0],
        x: [0, -15, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
    <motion.div
      className="absolute bottom-32 left-10 w-16 h-16 bg-purple-400/10 rounded-full"
      animate={{
        y: [0, -10, 0],
        x: [0, 8, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white text-lg">{title}</h3>
      <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Panel - Branding & Features */}
        <div className="w-full lg:w-3/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative">
          <FloatingElements />
          
          <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between min-h-[600px]">
            
            {/* Header with Logo */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center lg:items-start"
            >
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="/logo polimdo.png" 
                  alt="P3M Polimdo Logo" 
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">
                    P3M Polimdo
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">
                    Sistem Penelitian, Pengabdian & Publikasi
                  </p>
                </div>
              </div>
              
              <p className="text-blue-100 text-center lg:text-left max-w-md leading-relaxed">
                Platform terintegrasi untuk mengelola seluruh aktivitas penelitian, 
                pengabdian masyarakat, dan publikasi ilmiah di Politeknik Negeri Manado.
              </p>
            </motion.div>
            
            {/* Central Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="flex justify-center items-center py-8"
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Kelola Penelitian Anda
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Sistem yang memudahkan proses penelitian dari proposal hingga publikasi
                    </p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-400/30 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
            
            {/* Features */}
            <div className="space-y-4">
              <FeatureCard
                delay={0.8}
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Keamanan Tingkat Tinggi"
                description="Data penelitian Anda dilindungi dengan enkripsi end-to-end dan sistem backup otomatis"
              />
              
              <FeatureCard
                delay={1.0}
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="Proses Terintegrasi"
                description="Kelola proposal, pelaksanaan, hingga publikasi dalam satu platform yang efisien"
              />
            </div>
          </div>
        </div>
        
        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Selamat Datang
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Masuk ke akun Anda untuk mengakses <br />
                <span className="font-semibold text-blue-600">P3M Polimdo</span>
              </p>
            </div>
            
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <LoginForm />
            </motion.div>
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-100"
          >
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                © {new Date().getFullYear()} P3M Polimdo. Hak Cipta Dilindungi.
              </p>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;