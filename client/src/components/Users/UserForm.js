// client/src/components/Users/UserForm.js
import React, { useState, useEffect, useRef } from 'react';
import jurusanService from '../../services/jurusanService';
import prodiService from '../../services/prodiService';
import { User, Mail, Lock, Key, Phone, BookOpen, GraduationCap, Briefcase, School, Save, X } from 'lucide-react';
import { 
  validateField, 
  validateRegisterForm 
} from '../../utils/validation';

const UserForm = ({ user, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'MAHASISWA',
    nip: '',
    nim: '',
    no_telp: '',
    bidang_keahlian: '',
    jurusanId: '',
    prodiId: ''
  });

  const [errors, setErrors] = useState({});
  const [jurusanList, setJurusanList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [loadingJurusan, setLoadingJurusan] = useState(false);
  const [loadingProdi, setLoadingProdi] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const isInitialMount = useRef(true);

  // Load jurusan list on component mount
  useEffect(() => {
    loadJurusanList();
  }, []);

  // Load user data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        email: user.email || '',
        password: '', // Always empty for edit mode
        role: user.role || 'MAHASISWA',
        nip: user.nip || '',
        nim: user.nim || '',
        no_telp: user.no_telp || '',
        bidang_keahlian: user.bidang_keahlian || '',
        jurusanId: user.jurusan?.id?.toString() || '',
        prodiId: user.prodi?.id?.toString() || ''
      });

      // Load prodi list if jurusan is selected
      if (user.jurusan?.id) {
        loadProdiByJurusan(user.jurusan.id);
      }
    }
  }, [user]);

  // Load prodi when jurusan changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (formData.jurusanId) {
      loadProdiByJurusan(formData.jurusanId);
      // Reset prodi selection when jurusan changes
      setFormData(prev => ({ ...prev, prodiId: '' }));
    } else {
      setProdiList([]);
      setFormData(prev => ({ ...prev, prodiId: '' }));
    }
  }, [formData.jurusanId]);

  const loadJurusanList = async () => {
    setLoadingJurusan(true);
    try {
      const response = await jurusanService.getAllJurusan(true);
      if (response.success) {
        setJurusanList(response.data || []);
      } else {
        console.error('Failed to load jurusan:', response.message);
        setJurusanList([]);
      }
    } catch (error) {
      console.error('Error loading jurusan:', error);
      setJurusanList([]);
    } finally {
      setLoadingJurusan(false);
    }
  };

  const loadProdiByJurusan = async (jurusanId) => {
    if (!jurusanId) return;
    
    setLoadingProdi(true);
    try {
      const response = await prodiService.getProdiByJurusan(jurusanId);
      if (response.success) {
        setProdiList(response.data || []);
      } else {
        console.error('Failed to load prodi:', response.message);
        setProdiList([]);
      }
    } catch (error) {
      console.error('Error loading prodi:', error);
      setProdiList([]);
    } finally {
      setLoadingProdi(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedFormData = { ...prev, [name]: value };
      
      // Validasi real-time untuk field yang diubah
      if (name !== 'jurusanId' && name !== 'prodiId') {
        const error = validateField(name, value, updatedFormData);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
      }
      
      return updatedFormData;
    });

    // Clear NIP/NIM based on role change
    if (name === 'role') {
      if (value === 'MAHASISWA') {
        setFormData(prev => ({ ...prev, nip: '' }));
      } else {
        setFormData(prev => ({ ...prev, nim: '' }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleRoleChange = (roleValue) => {
    setFormData(prev => {
      const updatedFormData = { 
        ...prev, 
        role: roleValue,
        // Reset NIP/NIM saat role berubah
        nip: roleValue === 'MAHASISWA' ? '' : prev.nip,
        nim: roleValue !== 'MAHASISWA' ? '' : prev.nim
      };
      
      // Validasi role setelah berubah
      const roleError = validateField('role', roleValue, updatedFormData);
      setErrors(prevErrors => ({ ...prevErrors, role: roleError }));
      
      return updatedFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi semua field sebelum submit
    const formErrors = validateRegisterForm({ ...formData, confirmPassword });
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      // Clean up data before submitting
      const submitData = { ...formData };
      
      // Remove password if empty (for edit mode)
      if (!submitData.password) {
        delete submitData.password;
      }
      
      // Remove unnecessary fields based on role
      if (submitData.role === 'MAHASISWA') {
        delete submitData.nip;
      } else {
        delete submitData.nim;
      }

      // Convert jurusanId and prodiId to numbers or null
      submitData.jurusanId = submitData.jurusanId ? parseInt(submitData.jurusanId) : null;
      submitData.prodiId = submitData.prodiId ? parseInt(submitData.prodiId) : null;

      onSubmit(submitData);
    }
  };

  const roles = [
    { value: 'ADMIN', label: 'Admin', icon: <Key className="w-4 h-4" />, color: 'bg-red-500/10 text-red-600' },
    { value: 'DOSEN', label: 'Dosen', icon: <BookOpen className="w-4 h-4" />, color: 'bg-blue-500/10 text-blue-600' },
    { value: 'MAHASISWA', label: 'Mahasiswa', icon: <School className="w-4 h-4" />, color: 'bg-green-500/10 text-green-600' },
    { value: 'REVIEWER', label: 'Reviewer', icon: <Briefcase className="w-4 h-4" />, color: 'bg-purple-500/10 text-purple-600' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-5 px-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" />
          {user ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          {user ? 'Perbarui informasi pengguna' : 'Tambahkan pengguna baru ke sistem'}
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <User className="w-4 h-4 mr-1 text-gray-500" />
                Nama Lengkap <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.nama ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail className="w-4 h-4 mr-1 text-gray-500" />
                Email <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="contoh@email.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Lock className="w-4 h-4 mr-1 text-gray-500" />
                Password {!user && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder={user ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              {!errors.password && formData.password && (
                <p className="text-xs text-gray-500 mt-1">
                  Minimal 6 karakter
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Lock className="w-4 h-4 mr-1 text-gray-500" />
                Konfirmasi Password {!user && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => {
                    if (formData.password && confirmPassword !== formData.password) {
                      setErrors(prev => ({ ...prev, confirmPassword: 'Konfirmasi password tidak cocok' }));
                    } else {
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="Konfirmasi password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Key className="w-4 h-4 mr-1 text-gray-500" />
              Role <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roles.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleRoleChange(role.value)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-all transform hover:scale-[1.02] ${
                    formData.role === role.value
                      ? `border-blue-500 ${role.color} shadow-inner scale-[1.02]`
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    {role.icon}
                  </div>
                  <span className="font-medium">{role.label}</span>
                </button>
              ))}
            </div>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* NIP/NIM & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(formData.role === 'DOSEN' || formData.role === 'REVIEWER' || formData.role === 'ADMIN') && (
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1 text-gray-500" />
                  NIP {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') ? <span className="text-red-500 ml-1">*</span> : ''}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.nip ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Masukkan NIP (18 digit)"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
              </div>
            )}

            {formData.role === 'MAHASISWA' && (
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <School className="w-4 h-4 mr-1 text-gray-500" />
                  NIM <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.nim ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Masukkan NIM (8-15 karakter)"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
              </div>
            )}

            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Phone className="w-4 h-4 mr-1 text-gray-500" />
                No. Telepon
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.no_telp ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="Contoh: 08123456789"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.no_telp && <p className="text-red-500 text-xs mt-1">{errors.no_telp}</p>}
            </div>
          </div>

          {/* Bidang Keahlian for Dosen/Reviewer */}
          {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') && (
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Briefcase className="w-4 h-4 mr-1 text-gray-500" />
                Bidang Keahlian
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="bidang_keahlian"
                  value={formData.bidang_keahlian}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.bidang_keahlian ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="Masukkan bidang keahlian"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.bidang_keahlian && (
                <p className="text-red-500 text-xs mt-1">{errors.bidang_keahlian}</p>
              )}
            </div>
          )}

          {/* Jurusan & Prodi Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1 text-gray-500" />
                Jurusan
                {(formData.role === 'MAHASISWA' || formData.role === 'DOSEN') && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="relative">
                <select
                  name="jurusanId"
                  value={formData.jurusanId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loadingJurusan}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 appearance-none transition-all ${
                    errors.jurusanId ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <option value="">
                    {loadingJurusan ? 'Memuat jurusan...' : 'Pilih Jurusan'}
                  </option>
                  {jurusanList.map(jurusan => (
                    <option key={jurusan.id} value={jurusan.id}>
                      {jurusan.nama}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.jurusanId && <p className="text-red-500 text-xs mt-1">{errors.jurusanId}</p>}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <School className="w-4 h-4 mr-1 text-gray-500" />
                Program Studi
                {(formData.role === 'MAHASISWA' || formData.role === 'DOSEN') && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="relative">
                <select
                  name="prodiId"
                  value={formData.prodiId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!formData.jurusanId || loadingProdi}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 appearance-none transition-all ${
                    errors.prodiId ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <option value="">
                    {!formData.jurusanId 
                      ? 'Pilih jurusan terlebih dahulu' 
                      : loadingProdi 
                        ? 'Memuat program studi...' 
                        : 'Pilih Program Studi'
                    }
                  </option>
                  {prodiList.map(prodi => (
                    <option key={prodi.id} value={prodi.id}>
                      {prodi.nama}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="w-5 h-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.prodiId && <p className="text-red-500 text-xs mt-1">{errors.prodiId}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-md transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              <X className="w-5 h-5" />
              <span>Batal</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Menyimpan...' : user ? 'Update Pengguna' : 'Simpan Pengguna'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;