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
    { id: 1, title: 'Proposal Anda Diterima', description: 'Proposal "Pengembangan Sistem Manajemen" telah disetujui', time: '2 jam lalu', read: false },
    { id: 2, title: 'Review Baru', description: 'Anda mendapat permintaan review proposal baru', time: '1 hari lalu', read: true },
    { id: 3, title: 'Pembaruan Sistem', description: 'Versi baru sistem P3M telah tersedia', time: '3 hari lalu', read: true }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2"
            >
              <div className="bg-white p-2 rounded-lg">
                <div className="h-10 w-10">
  <img src="/logo polimdo.png" alt="Logo Polimdo" className="h-full w-full object-contain" />
</div>
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-xl tracking-tight">P3M POLIMDO</h1>
                <p className="text-xs text-blue-100 opacity-80 tracking-tight">Penelitian, Pengabdian & Publikasi</p>
              </div>
            </button>
          </div>

         

          {/* Right Section - Search, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Search Button (Mobile) */}
            <button className="md:hidden text-blue-100 hover:text-white">
              <Search className="h-5 w-5" />
            </button>


            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-1 rounded-full text-blue-100 hover:text-white hover:bg-blue-700 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
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
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-full focus:outline-none transition"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow">
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

              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  role="menu"
                >
                  {/* User Info in Dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.nama}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${getRoleColor(user?.role)}`}>
                        {getRoleLabel(user?.role)}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className={`flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition ${
                        location.pathname === '/profile' 
                          ? 'text-blue-600 bg-blue-50 font-medium' 
                          : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profil Saya
                    </button>
                    
                    <button
                      onClick={() => navigate('/settings')}
                      className={`flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition ${
                        location.pathname === '/settings' 
                          ? 'text-blue-600 bg-blue-50 font-medium' 
                          : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </button>
                    
                    <button
                      onClick={() => navigate('/help')}
                      className={`flex items-center w-full gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition ${
                        location.pathname === '/help' 
                          ? 'text-blue-600 bg-blue-50 font-medium' 
                          : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Bantuan
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-blue-100 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

     
     
    </header>
  );
};

export default Header;