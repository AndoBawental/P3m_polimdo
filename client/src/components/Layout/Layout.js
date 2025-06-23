import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { X, Menu } from 'lucide-react';

const Layout = () => {
  const { user } = useAuth();
  const role = user?.role ? user.role.toUpperCase() : '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [window.location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden p-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span>Menu</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar for mobile (overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}>
            <div 
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar role={role} />
            </div>
          </div>
        )}

        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar role={role} className="w-64 h-[calc(100vh-4rem)] sticky top-16" />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[calc(100vh-8rem)]">
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;