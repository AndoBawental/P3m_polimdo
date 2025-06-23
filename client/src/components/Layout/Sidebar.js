import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Users,
  LayoutDashboard,
  User,
  Layers,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ role, className = '' }) => {
  const { pathname } = useLocation();
  const roleUpper = role?.toUpperCase() || '';
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleColor = () => {
    switch(roleUpper) {
      case 'ADMIN': return 'from-red-500 to-red-600';
      case 'DOSEN': return 'from-blue-500 to-indigo-600';
      case 'MAHASISWA': return 'from-green-500 to-teal-600';
      case 'REVIEWER': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getRoleLabel = () => {
    switch(roleUpper) {
      case 'ADMIN': return 'Administrator';
      case 'DOSEN': return 'Dosen';
      case 'MAHASISWA': return 'Mahasiswa';
      case 'REVIEWER': return 'Reviewer';
      default: return 'Pengguna';
    }
  };

  const NavItem = ({ to, icon: Icon, label, exact = false }) => {
    const isActive = exact ? pathname === to : pathname.startsWith(to);
    return (
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="mb-1"
      >
        <Link
          to={to}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden group ${
            isActive 
              ? 'bg-gradient-to-r text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-50'
          } ${isActive ? getRoleColor() : ''}`}
        >
          <div className={`p-2 rounded-lg transition-all ${
            isActive 
              ? 'bg-white/20' 
              : 'bg-gray-100 group-hover:bg-gray-200'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          {label}
          {!isActive && (
            <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 transition" />
          )}
          <AnimatePresence>
            {isActive && (
              <motion.div 
                className="absolute inset-0 bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              />
            )}
          </AnimatePresence>
        </Link>
      </motion.div>
    );
  };

  return (
    <aside 
      className={`w-64 flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 ${className}`}
      style={{
        height: 'calc(100vh - 4rem)',
        top: '4rem',
        position: 'sticky'
      }}
    >
      {/* Floating shadow effect */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-2 z-10"
        animate={{ 
          opacity: isScrolled ? 0.1 : 0,
          boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        transition={{ duration: 0.2 }}
      />

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-bl-full" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Akun Anda</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${getRoleColor()}`}>
                {getRoleLabel()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Navigasi Utama
        </h3>
        
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" exact={true} />

        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            Proposal & Review
          </h3>
          
          {(roleUpper === 'ADMIN' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
            <NavItem to="/proposals" icon={FileText} label="Proposals" />
          )}

          {(roleUpper === 'ADMIN' || roleUpper === 'REVIEWER' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
            <NavItem to="/reviews" icon={Layers} label="Reviews" />
          )}
        </div>

        {roleUpper === 'ADMIN' && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              Admin Panel
            </h3>
            <NavItem to="/admin/skema" icon={Award} label="Skema" />
            <NavItem to="/admin/users" icon={Users} label="Users" />
            <NavItem to="/admin/jurusan" icon={BookOpen} label="Jurusan" />
            <NavItem to="/admin/prodi" icon={GraduationCap} label="Prodi" />
            
          </div>
        )}

    
      </div>
    </aside>
  );
};

export default Sidebar;