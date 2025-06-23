// src/components/Layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ChevronDown, LogOut, User as UserIcon, Settings, HelpCircle, Bell, Search, Menu } from 'lucide-react';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const getRoleLabel = (role) => {
    return {
      ADMIN: 'Administrator',
      DOSEN: 'Dosen',
      MAHASISWA: 'Mahasiswa',
      REVIEWER: 'Reviewer'
    }[role?.toUpperCase()] || 'User';
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      DOSEN: 'bg-blue-100 text-blue-800',
      MAHASISWA: 'bg-green-100 text-green-800',
      REVIEWER: 'bg-purple-100 text-purple-800'
    };
    return colors[role?.toUpperCase()] || 'bg-gray-100 text-gray-800';
  };

  const notifications = [
    // 
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <>
      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animated-gradient {
          background: linear-gradient(270deg, #1e3a8a, #3b82f6, #6366f1, #1e3a8a);
          background-size: 400% 400%;
          animation: gradientMove 10s ease infinite;
        }
      `}</style>
      
      <header className="animated-gradient text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo - Dipercantik dengan animasi dan shadow */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 group"
              >
                <div className="bg-white p-1.5 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <div className="h-10 w-10 flex items-center justify-center">
                    <img 
                      src="/logo polimdo.png" 
                      alt="Logo Polimdo" 
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:rotate-12" 
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <h1 className="font-bold text-xl tracking-tight text-white drop-shadow-md">P3M POLIMDO</h1>
                  <p className="text-xs text-blue-100 opacity-90 tracking-tight mt-0.5">
                    Penelitian, Pengabdian & Publikasi
                  </p>
                </div>
              </button>
            </div>

            {/* Right Section - Dirapikan dengan tata letak yang lebih baik */}
            <div className="flex items-center space-x-3">
              {/* Search Button (Mobile) */}
              <button className="md:hidden text-blue-100 hover:text-white transition-colors p-1.5 rounded-full hover:bg-blue-600/30">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-1.5 rounded-full text-blue-100 hover:text-white hover:bg-blue-600/30 relative transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <div 
                  className={`origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 transform ${
                    notificationOpen 
                      ? 'scale-100 opacity-100' 
                      : 'scale-95 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.read ? 'bg-white' : 'bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 mt-1 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`}>
                              <Bell className="h-4 w-4" />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="py-2 px-4 text-center bg-gray-50">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Dropdown - Diperindah dengan efek glassmorphism */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/70 hover:bg-blue-700/80 backdrop-blur-sm rounded-full focus:outline-none transition-all duration-300 group"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-white max-w-32 truncate">
                      {user?.nama || 'User'}
                    </p>
                    <p className={`text-xs font-medium text-blue-100`}>
                      {getRoleLabel(user?.role)}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform text-blue-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 z-50 transition-all duration-200 ${
                    dropdownOpen
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-0 pointer-events-none'
                  }`}
                  role="menu"
                >
                  {/* User Info in Dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100/50 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.nama}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1.5 ${getRoleColor(user?.role)}`}>
                        {getRoleLabel(user?.role)}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className={`flex items-center w-full gap-3 px-4 py-3 text-sm transition-colors ${
                        location.pathname === '/profile' 
                          ? 'text-blue-600 bg-blue-50 font-medium' 
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                      role="menuitem"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profil Saya</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/settings')}
                      className={`flex items-center w-full gap-3 px-4 py-3 text-sm transition-colors ${
                        location.pathname === '/settings' 
                          ? 'text-blue-600 bg-blue-50 font-medium' 
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Pengaturan</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/help')}
                      className={`flex items-center w-full gap-3 px-4 py-3 text-sm transition-colors ${
                        location.pathname === '/help' 
                          ? 'text-blue-600 bg-blue-50 font-medium' 
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                      role="menuitem"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Bantuan</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-blue-100 hover:text-white transition-colors p-1.5 rounded-full hover:bg-blue-600/30"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;