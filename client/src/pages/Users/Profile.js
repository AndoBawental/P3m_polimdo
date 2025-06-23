import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
<<<<<<< HEAD
import { User, Edit, Save, X, Eye, EyeOff, Phone, Lock, GraduationCap, BookOpen, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
=======
import { User, Edit, Save, X, Eye, EyeOff, Lock, Smartphone, BookOpen, GraduationCap, Mail, Key, Award } from 'lucide-react';
>>>>>>> bbe1cfc47962c01f3bcc35627bf202e52b8cb0b6

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telp: '',
    bidang_keahlian: '',
    password: '',
    jurusanId: '',
    prodiId: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowContent(true), 50);
    }
  }, [loading]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          nama: userData.nama || '',
          email: userData.email || '',
          no_telp: userData.no_telp || '',
          bidang_keahlian: userData.bidang_keahlian || '',
          jurusanId: userData.jurusan?.id || '',
          prodiId: userData.prodi?.id || '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = { 
        nama: formData.nama,
        no_telp: formData.no_telp,
        bidang_keahlian: formData.bidang_keahlian,
        jurusanId: formData.jurusanId || null,
        prodiId: formData.prodiId || null
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await userService.updateProfile(updateData);
      if (response.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        updateUser(updatedUser);
        setIsEditing(false);
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      nama: user.nama || '',
      no_telp: user.no_telp || '',
      bidang_keahlian: user.bidang_keahlian || '',
      jurusanId: user.jurusan?.id || '',
      prodiId: user.prodi?.id || '',
      password: ''
    });
    setIsEditing(false);
  };

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Administrator',
      DOSEN: 'Dosen',
      MAHASISWA: 'Mahasiswa',
      REVIEWER: 'Reviewer'
    };
    return roles[role] || 'User';
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-gradient-to-r from-red-500 to-orange-500',
      DOSEN: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      MAHASISWA: 'bg-gradient-to-r from-green-500 to-emerald-500',
      REVIEWER: 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
    };
    return colors[role] || 'bg-gradient-to-r from-gray-500 to-gray-700';
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
            </div>
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
=======
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 animate-pulse">
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="space-y-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="border-b pb-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
>>>>>>> bbe1cfc47962c01f3bcc35627bf202e52b8cb0b6
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    Profil Saya
                  </h1>
                  <p className="text-blue-100 mt-1">Kelola informasi akun Anda</p>
=======
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-10 animate-pulse animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-amber-200 rounded-full opacity-10 animate-pulse animate-float animation-delay-3000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className={`bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Profile Header with Gradient */}
          <div className={`${getRoleColor(user?.role)} py-6 px-8 text-white`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Profil Saya</h1>
                  <p className="text-blue-100">Kelola informasi profil Anda</p>
>>>>>>> bbe1cfc47962c01f3bcc35627bf202e52b8cb0b6
                </div>
              </div>
              
              {!isEditing && (
<<<<<<< HEAD
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profil
                </motion.button>
=======
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-lg transform hover:-translate-y-0.5"
                >
                  <Edit className="w-5 h-5" />
                  <span className="font-medium">Edit Profil</span>
                </button>
>>>>>>> bbe1cfc47962c01f3bcc35627bf202e52b8cb0b6
              )}
            </div>
          </div>

<<<<<<< HEAD
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Nama */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Nama Lengkap
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 text-lg font-medium">{user?.nama || '-'}</p>
                  )}
                </div>

                {/* Email */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </label>
                  <p className="text-gray-900 text-lg">{user?.email || '-'}</p>
                </div>

                {/* NIP/NIM */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {user?.role === 'MAHASISWA' ? 'NIM' : 'NIP'}
                  </label>
                  <p className="text-gray-900 text-lg">
                    {user?.role === 'MAHASISWA' ? user?.nim : user?.nip || '-'}
                  </p>
                </div>

                {/* Role */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Role
                  </label>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getRoleLabel(user?.role)}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* No Telepon */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    No. Telepon
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="no_telp"
                      value={formData.no_telp}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{user?.no_telp || '-'}</p>
                  )}
                </div>

                {/* Bidang Keahlian */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Bidang Keahlian
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bidang_keahlian"
                      value={formData.bidang_keahlian}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{user?.bidang_keahlian || '-'}</p>
                  )}
                </div>

                {/* Jurusan */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Jurusan
                  </label>
                  <p className="text-gray-900 text-lg">
                    {user?.jurusan?.nama || '-'}
                  </p>
                </div>

                {/* Program Studi */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Program Studi
                  </label>
                  <p className="text-gray-900 text-lg">
                    {user?.prodi?.nama || '-'}
                  </p>
                </div>

                {/* Password - Only when editing */}
                {isEditing && (
                  <div className="border-b border-gray-200 pb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Password Baru (Kosongkan jika tidak ingin mengubah)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-4 pt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
=======
          {/* Profile Content */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grid Layout for Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Informasi Pribadi
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Nama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        Nama Lengkap
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 text-lg font-medium">{user?.nama || '-'}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        Email
                      </label>
                      <p className="text-gray-900">{user?.email || '-'}</p>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-gray-500" />
                        Role
                      </label>
                      <p className="text-gray-900">{getRoleLabel(user?.role)}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    Kontak & Keahlian
                  </h2>
                  
                  <div className="space-y-4">
                    {/* No Telepon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                        No. Telepon
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="no_telp"
                          value={formData.no_telp}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.no_telp || '-'}</p>
                      )}
                    </div>

                    {/* Bidang Keahlian */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                        Bidang Keahlian
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="bidang_keahlian"
                          value={formData.bidang_keahlian}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.bidang_keahlian || '-'}</p>
                      )}
                    </div>

                    {/* NIP/NIM */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                        {user?.role === 'MAHASISWA' ? 'NIM' : 'NIP'}
                      </label>
                      <p className="text-gray-900">
                        {user?.role === 'MAHASISWA' ? user?.nim : user?.nip || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    Informasi Akademik
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Jurusan */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jurusan
                      </label>
                      <p className="text-gray-900">
                        {user?.jurusan?.nama || '-'}
                      </p>
                    </div>

                    {/* Program Studi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program Studi
                      </label>
                      <p className="text-gray-900">
                        {user?.prodi?.nama || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Password Card - Only when editing */}
                {isEditing && (
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-500" />
                      Keamanan Akun
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Key className="w-4 h-4 mr-2 text-gray-500" />
                        Password Baru (Kosongkan jika tidak ingin mengubah)
                      </label>
                      <div className="relative mt-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Minimal 8 karakter dengan kombinasi huruf dan angka
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Batal</span>
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
>>>>>>> bbe1cfc47962c01f3bcc35627bf202e52b8cb0b6
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Profile;