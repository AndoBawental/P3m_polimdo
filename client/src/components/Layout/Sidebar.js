import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  LayoutDashboard,
  User,
  Layers,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const { pathname } = useLocation();
  const roleUpper = role?.toUpperCase() || '';

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
          isActive 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
            : 'text-gray-600 hover:bg-blue-50'
        }`}
      >
        <div className={`p-2 rounded-lg ${
          isActive 
            ? 'bg-white text-blue-600' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        {label}
      </Link>
    );
  };

  const getRoleColor = () => {
    switch(roleUpper) {
      case 'ADMIN': return 'bg-gradient-to-r from-red-600 to-rose-700';
      case 'DOSEN': return 'bg-gradient-to-r from-blue-600 to-indigo-700';
      case 'MAHASISWA': return 'bg-gradient-to-r from-green-600 to-teal-700';
      case 'REVIEWER': return 'bg-gradient-to-r from-amber-600 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-white to-gray-50 border-r shadow-xl">
      

     

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Navigasi Utama
        </h3>
        
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

        {(roleUpper === 'ADMIN' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
          <>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2 mt-4">
              Proposal & Review
            </h3>
            <NavItem to="/proposals" icon={FileText} label="Proposals" />
          </>
        )}

        {(roleUpper === 'ADMIN' || roleUpper === 'REVIEWER' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
          <NavItem to="/reviews" icon={Layers} label="Reviews" />
        )}

        {roleUpper === 'ADMIN' && (
          <>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2 mt-4">
              Admin Panel
            </h3>
            <NavItem to="/admin/skema" icon={Layers} label="Skema" />
            <NavItem to="/admin/users" icon={Users} label="Users" />
            <NavItem to="/admin/jurusan" icon={BookOpen} label="Jurusan" />
            <NavItem to="/admin/prodi" icon={GraduationCap} label="Prodi" />
          </>
        )}
      </nav>


    </aside>
  );
};

export default Sidebar;