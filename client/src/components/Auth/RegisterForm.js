// src/components/Auth/RegisterForm.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegisterForm, validateField, sanitizeFormData } from '../../utils/validation';
import authService from '../../services/authService';
import jurusanService from '../../services/jurusanService';
import prodiService from '../../services/prodiService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jurusanList, setJurusanList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    nim: '',
    nip: '',
    no_telp: '',
    bidang_keahlian: '',
    jurusanId: '',
    prodiId: ''
  });

  useEffect(() => {
    const loadJurusan = async () => {
      try {
        const response = await jurusanService.getAllJurusan();
        if (response.success) {
          setJurusanList(response.data || []);
        }
      } catch (error) {
        console.error('Error loading jurusan:', error);
      }
    };
    loadJurusan();
  }, []);

  useEffect(() => {
    const loadProdi = async () => {
      if (formData.jurusanId) {
        try {
          const response = await prodiService.getProdiByJurusan(formData.jurusanId);
          if (response.success) {
            setProdiList(response.data || []);
          }
        } catch (error) {
          console.error('Error loading prodi:', error);
        }
      } else {
        setProdiList([]);
        setFormData(prev => ({ ...prev, prodiId: '' }));
      }
    };
    loadProdi();
  }, [formData.jurusanId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldError = validateField(name, value, { ...formData, [name]: value });
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const sanitizedData = sanitizeFormData(formData);
      const response = await authService.register(sanitizedData);
      if (response.success) {
        alert('Registrasi berhasil! Silakan login');
        navigate('/login');
      } else {
        alert(response.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center p-6 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-1">Daftar Akun Baru</h1>
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Peran */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Peran <span className="text-red-500">*</span></label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Pilih peran Anda</option>
                <option value="MAHASISWA">Mahasiswa</option>
                <option value="DOSEN">Dosen</option>
                <option value="REVIEWER">Reviewer</option>
             
                
              </select>
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
            </div>

            {/* Nama, NIM, NIP, Bidang Keahlian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap Anda"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.nama && <p className="text-sm text-red-600 mt-1">{errors.nama}</p>}
              </div>

              {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIP</label>
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    placeholder="Nomor Induk Pegawai"
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.nip ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.nip && <p className="text-sm text-red-600 mt-1">{errors.nip}</p>}
                </div>
              )}

              {formData.role === 'MAHASISWA' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIM</label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleInputChange}
                    placeholder="Nomor Induk Mahasiswa"
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.nim ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.nim && <p className="text-sm text-red-600 mt-1">{errors.nim}</p>}
                </div>
              )}

              {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bidang Keahlian</label>
                  <input
                    type="text"
                    name="bidang_keahlian"
                    value={formData.bidang_keahlian}
                    onChange={handleInputChange}
                    placeholder="Bidang keahlian Anda"
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.bidang_keahlian ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.bidang_keahlian && <p className="text-sm text-red-600 mt-1">{errors.bidang_keahlian}</p>}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@contoh.com"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password & Konfirmasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 6 karakter"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Ulangi password"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* No Telepon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">No. Telepon</label>
              <input
                type="text"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleInputChange}
                placeholder="Contoh: 08123456789"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.no_telp ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.no_telp && <p className="text-sm text-red-600 mt-1">{errors.no_telp}</p>}
            </div>

            {/* Jurusan & Prodi */}
            {(formData.role === 'MAHASISWA' || formData.role === 'DOSEN') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jurusan <span className="text-red-500">*</span></label>
                  <select
                    name="jurusanId"
                    value={formData.jurusanId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.jurusanId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Pilih jurusan</option>
                    {jurusanList.map(j => (
                      <option key={j.id} value={j.id}>{j.nama}</option>
                    ))}
                  </select>
                  {errors.jurusanId && <p className="text-sm text-red-600 mt-1">{errors.jurusanId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Program Studi <span className="text-red-500">*</span></label>
                  <select
                    name="prodiId"
                    value={formData.prodiId}
                    onChange={handleInputChange}
                    disabled={!formData.jurusanId}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.prodiId ? 'border-red-500' : 'border-gray-300'} ${!formData.jurusanId ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">{formData.jurusanId ? 'Pilih program studi' : 'Pilih jurusan terlebih dahulu'}</option>
                    {prodiList.map(p => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                  {errors.prodiId && <p className="text-sm text-red-600 mt-1">{errors.prodiId}</p>}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
