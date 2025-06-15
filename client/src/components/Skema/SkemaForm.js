// src/components/Skema/SkemaForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SkemaForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const navigate = useNavigate();
  
  // State untuk form data
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    kategori: '',
    luaran_wajib: '',
    dana_min: '',
    dana_max: '',
    batas_anggota: 5,
    tahun_aktif: new Date().getFullYear().toString(),
    tanggal_buka: '',
    tanggal_tutup: '',
    status: 'AKTIF'
  });

  // Inisialisasi data jika ada initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        kode: initialData.kode || '',
        nama: initialData.nama || '',
        kategori: initialData.kategori || '',
        luaran_wajib: initialData.luaran_wajib || '',
        dana_min: initialData.dana_min || '',
        dana_max: initialData.dana_max || '',
        batas_anggota: initialData.batas_anggota || 5,
        tahun_aktif: initialData.tahun_aktif || new Date().getFullYear().toString(),
        tanggal_buka: initialData.tanggal_buka 
          ? new Date(initialData.tanggal_buka).toISOString().split('T')[0] 
          : '',
        tanggal_tutup: initialData.tanggal_tutup 
          ? new Date(initialData.tanggal_tutup).toISOString().split('T')[0] 
          : '',
        status: initialData.status || 'AKTIF'
      });
    }
  }, [initialData]);

  // State untuk validasi
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Options untuk dropdown
  const kategoriOptions = [
    { value: 'PENELITIAN', label: 'Penelitian' },
    { value: 'PENGABDIAN', label: 'Pengabdian' },
  ];

  const statusOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'NONAKTIF', label: 'Non Aktif' },
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear backend error saat mengubah input
    if (backendError) {
      setBackendError(null);
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.kode.trim()) {
      newErrors.kode = 'Kode skema wajib diisi';
    }

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama skema wajib diisi';
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori wajib dipilih';
    }

    if (!formData.tahun_aktif) {
      newErrors.tahun_aktif = 'Tahun aktif wajib diisi';
    } else if (!/^\d{4}$/.test(formData.tahun_aktif)) {
      newErrors.tahun_aktif = 'Tahun aktif harus 4 digit angka';
    }

    // Validasi dana
    if (formData.dana_min && formData.dana_max) {
      const danaMin = parseFloat(formData.dana_min);
      const danaMax = parseFloat(formData.dana_max);
      
      if (danaMin > danaMax) {
        newErrors.dana_max = 'Dana maksimum harus lebih besar dari dana minimum';
      }
    }

    // Validasi tanggal
    if (formData.tanggal_buka && formData.tanggal_tutup) {
      const tanggalBuka = new Date(formData.tanggal_buka);
      const tanggalTutup = new Date(formData.tanggal_tutup);
      
      if (tanggalBuka > tanggalTutup) {
        newErrors.tanggal_tutup = 'Tanggal tutup harus setelah tanggal buka';
      }
    }

    // Validasi batas anggota
    if (formData.batas_anggota < 1) {
      newErrors.batas_anggota = 'Batas anggota minimal 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data untuk dikirim
      const submitData = {
        ...formData,
        batas_anggota: parseInt(formData.batas_anggota),
        dana_min: formData.dana_min ? parseFloat(formData.dana_min) : null,
        dana_max: formData.dana_max ? parseFloat(formData.dana_max) : null,
        tanggal_buka: formData.tanggal_buka || null,
        tanggal_tutup: formData.tanggal_tutup || null
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setBackendError(
        error.response?.data?.message || 
        'Terjadi kesalahan saat menyimpan skema. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/skema');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Skema Pendanaan' : 'Tambah Skema Pendanaan Baru'}
          </h1>
          <p className="text-blue-100">
            {isEditing ? 'Perbarui informasi skema pendanaan' : 'Formulir untuk menambahkan skema pendanaan baru'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Tampilkan error backend jika ada */}
          {backendError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error!</span>
              </div>
              <p className="mt-2 text-sm text-red-700">{backendError}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="h-8 w-1 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-xl font-semibold text-gray-800">Informasi Dasar</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kode Skema */}
              <div>
                <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Skema <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="kode"
                    name="kode"
                    value={formData.kode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.kode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SK001"
                  />
                  {errors.kode && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.kode && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.kode}
                </p>}
              </div>

              {/* Kategori */}
              <div>
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition ${
                      errors.kategori ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.kategori && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.kategori}
                </p>}
              </div>

              {/* Nama Skema */}
              <div className="md:col-span-2">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Skema <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.nama ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nama lengkap skema pendanaan"
                  />
                  {errors.nama && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.nama && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nama}
                </p>}
              </div>

              {/* Luaran Wajib */}
              <div className="md:col-span-2">
                <label htmlFor="luaran_wajib" className="block text-sm font-medium text-gray-700 mb-2">
                  Luaran Wajib
                </label>
                <textarea
                  id="luaran_wajib"
                  name="luaran_wajib"
                  value={formData.luaran_wajib}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Deskripsi luaran yang wajib dihasilkan"
                />
                <p className="mt-1 text-xs text-gray-500">Contoh: Jurnal internasional, produk terstandar, buku ISBN, dll.</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="h-8 w-1 bg-green-600 rounded-full mr-3"></div>
              <h2 className="text-xl font-semibold text-gray-800">Informasi Keuangan</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dana Minimum */}
              <div>
                <label htmlFor="dana_min" className="block text-sm font-medium text-gray-700 mb-2">
                  Dana Minimum (Rp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="dana_min"
                    name="dana_min"
                    value={formData.dana_min}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2.5 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.dana_min ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">Rp</span>
                  </div>
                </div>
                {errors.dana_min && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.dana_min}
                </p>}
              </div>

              {/* Dana Maximum */}
              <div>
                <label htmlFor="dana_max" className="block text-sm font-medium text-gray-700 mb-2">
                  Dana Maksimum (Rp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="dana_max"
                    name="dana_max"
                    value={formData.dana_max}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2.5 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.dana_max ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  {errors.dana_max && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.dana_max && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.dana_max}
                </p>}
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="h-8 w-1 bg-purple-600 rounded-full mr-3"></div>
              <h2 className="text-xl font-semibold text-gray-800">Informasi Lainnya</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batas Anggota */}
              <div>
                <label htmlFor="batas_anggota" className="block text-sm font-medium text-gray-700 mb-2">
                  Batas Anggota
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="batas_anggota"
                    name="batas_anggota"
                    value={formData.batas_anggota}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.batas_anggota ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.batas_anggota && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.batas_anggota && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.batas_anggota}
                </p>}
                <p className="mt-1 text-xs text-gray-500">Jumlah maksimal anggota dalam satu proposal</p>
              </div>

              {/* Tahun Aktif */}
              <div>
                <label htmlFor="tahun_aktif" className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tahun_aktif"
                    name="tahun_aktif"
                    value={formData.tahun_aktif}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.tahun_aktif ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="2024"
                  />
                  {errors.tahun_aktif && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.tahun_aktif && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.tahun_aktif}
                </p>}
              </div>

              {/* Tanggal Buka */}
              <div>
                <label htmlFor="tanggal_buka" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Buka
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="tanggal_buka"
                    name="tanggal_buka"
                    value={formData.tanggal_buka}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.tanggal_buka ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                {errors.tanggal_buka && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.tanggal_buka}
                </p>}
              </div>

              {/* Tanggal Tutup */}
              <div>
                <label htmlFor="tanggal_tutup" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Tutup
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="tanggal_tutup"
                    name="tanggal_tutup"
                    value={formData.tanggal_tutup}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.tanggal_tutup ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                {errors.tanggal_tutup && <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.tanggal_tutup}
                </p>}
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Status skema saat ini</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Memperbarui...' : 'Menyimpan...'}
                </span>
              ) : isEditing ? 'Perbarui Skema' : 'Simpan Skema Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkemaForm;