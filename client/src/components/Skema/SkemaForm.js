// src/components/Skema/SkemaForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SkemaForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const navigate = useNavigate();
  
  // State untuk form data
  const [formData, setFormData] = useState({
    kode: initialData?.kode || '',
    nama: initialData?.nama || '',
    kategori: initialData?.kategori || '',
    luaran_wajib: initialData?.luaran_wajib || '',
    dana_min: initialData?.dana_min || '',
    dana_max: initialData?.dana_max || '',
    batas_anggota: initialData?.batas_anggota || 5,
    tahun_aktif: initialData?.tahun_aktif || new Date().getFullYear().toString(),
    tanggal_buka: initialData?.tanggal_buka ? new Date(initialData.tanggal_buka).toISOString().split('T')[0] : '',
    tanggal_tutup: initialData?.tanggal_tutup ? new Date(initialData.tanggal_tutup).toISOString().split('T')[0] : '',
    status: initialData?.status || 'AKTIF'
  });

  // State untuk validasi
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options untuk dropdown
  const kategoriOptions = [
    { value: 'PENELITIAN', label: 'Penelitian' },
    { value: 'PENGABDIAN', label: 'Pengabdian' },
    { value: 'HIBAH_INTERNAL', label: 'Hibah Internal' },
    { value: 'HIBAH_EKSTERNAL', label: 'Hibah Eksternal' }
  ];

  const statusOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'NONAKTIF', label: 'Non Aktif' },
    { value: 'DRAFT', label: 'Draft' }
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
        newErrors.tanggal_tutup = 'Tanggal tutup harus lebih besar dari tanggal buka';
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/skema');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kode Skema */}
            <div>
              <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Skema <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kode"
                name="kode"
                value={formData.kode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.kode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contoh: SK001"
              />
              {errors.kode && <p className="mt-1 text-sm text-red-500">{errors.kode}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
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
              {errors.kategori && <p className="mt-1 text-sm text-red-500">{errors.kategori}</p>}
            </div>

            {/* Nama Skema */}
            <div className="md:col-span-2">
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Skema <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.nama ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nama lengkap skema"
              />
              {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Deskripsi luaran yang wajib dihasilkan"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Keuangan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dana Minimum */}
            <div>
              <label htmlFor="dana_min" className="block text-sm font-medium text-gray-700 mb-2">
                Dana Minimum (Rp)
              </label>
              <input
                type="number"
                id="dana_min"
                name="dana_min"
                value={formData.dana_min}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* Dana Maximum */}
            <div>
              <label htmlFor="dana_max" className="block text-sm font-medium text-gray-700 mb-2">
                Dana Maksimum (Rp)
              </label>
              <input
                type="number"
                id="dana_max"
                name="dana_max"
                value={formData.dana_max}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.dana_max ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.dana_max && <p className="mt-1 text-sm text-red-500">{errors.dana_max}</p>}
            </div>
          </div>
        </div>

        {/* Other Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Lainnya</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batas Anggota */}
            <div>
              <label htmlFor="batas_anggota" className="block text-sm font-medium text-gray-700 mb-2">
                Batas Anggota
              </label>
              <input
                type="number"
                id="batas_anggota"
                name="batas_anggota"
                value={formData.batas_anggota}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.batas_anggota ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.batas_anggota && <p className="mt-1 text-sm text-red-500">{errors.batas_anggota}</p>}
            </div>

            {/* Tahun Aktif */}
            <div>
              <label htmlFor="tahun_aktif" className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tahun_aktif"
                name="tahun_aktif"
                value={formData.tahun_aktif}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.tahun_aktif ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2024"
              />
              {errors.tahun_aktif && <p className="mt-1 text-sm text-red-500">{errors.tahun_aktif}</p>}
            </div>

            {/* Tanggal Buka */}
            <div>
              <label htmlFor="tanggal_buka" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Buka
              </label>
              <input
                type="date"
                id="tanggal_buka"
                name="tanggal_buka"
                value={formData.tanggal_buka}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Tutup */}
            <div>
              <label htmlFor="tanggal_tutup" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Tutup
              </label>
              <input
                type="date"
                id="tanggal_tutup"
                name="tanggal_tutup"
                value={formData.tanggal_tutup}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.tanggal_tutup ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tanggal_tutup && <p className="mt-1 text-sm text-red-500">{errors.tanggal_tutup}</p>}
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : (isEditing ? 'Perbarui' : 'Simpan')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkemaForm;