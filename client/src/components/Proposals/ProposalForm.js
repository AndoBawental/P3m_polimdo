import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import proposalService from '../../services/proposalService';
import skemaService from '../../services/skemaService';
import userService from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';
import FileManager from '../Files/FileManager';
import { getFromCache, setToCache } from '../../services/cacheService';

const ProposalForm = ({ proposalId = null, initialData = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!proposalId;
  
  // Form state
  const [formData, setFormData] = useState({
    judul: '',
    abstrak: '',
    kata_kunci: '',
    kategori: '',
    skemaId: '',
    dana_diusulkan: '',
    anggota: []
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [skemas, setSkemas] = useState([]);
  const [filteredSkemas, setFilteredSkemas] = useState([]);
  const [selectedSkema, setSelectedSkema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingData, setLoadingData] = useState(isEdit);
  const [showFileManager, setShowFileManager] = useState(false);
  const [skemaLoading, setSkemaLoading] = useState(false);

  // Load available skemas with caching
  const loadSkemas = useCallback(async () => {
    try {
      setSkemaLoading(true);
      const cacheKey = 'active-skemas-period';
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        setSkemas(cachedData);
        
        if (formData.kategori) {
          const filtered = cachedData.filter(skema => 
            skema.kategori === formData.kategori
          );
          setFilteredSkemas(filtered);
        }
        setSkemaLoading(false);
        return;
      }

      // Gunakan getActiveSkema untuk mendapatkan skema aktif dan dalam periode
      const result = await skemaService.getActiveSkema();
      if (result.success) {
        // Tambahkan status 'AKTIF' karena endpoint active tidak mengembalikan status
        let skemaList = result.data.map(skema => ({
          ...skema,
          status: 'AKTIF'
        }));

        setToCache(cacheKey, skemaList, 5 * 60 * 1000); // Cache for 5 minutes
        setSkemas(skemaList);
        
        if (formData.kategori) {
          const filtered = skemaList.filter(skema => 
            skema.kategori === formData.kategori
          );
          setFilteredSkemas(filtered);
        }
      } else {
        setSkemas([]);
        setFilteredSkemas([]);
      }
    } catch (err) {
      console.error('Gagal memuat skema:', err);
      setSkemas([]);
      setFilteredSkemas([]);
    } finally {
      setSkemaLoading(false);
    }
  }, [formData.kategori]);

  // Load available users with caching
  const loadUsers = useCallback(async () => {
    try {
      const cacheKey = `team-members-${user.id}`;
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        setAvailableUsers(cachedData);
        return;
      }

      const result = await userService.getTeamMembers();
      
      if (result.success) {
        const users = result.data || [];
        const filtered = users.filter(u => u.id !== user.id);
        setToCache(cacheKey, filtered, 10 * 60 * 1000); // Cache for 10 minutes
        setAvailableUsers(filtered);
      } else {
        setAvailableUsers([]);
      }
    } catch (err) {
      console.error('Gagal memuat users:', err);
      setAvailableUsers([]);
    }
  }, [user.id]);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      
      try {
        await Promise.all([loadSkemas(), loadUsers()]);
        
        if (initialData) {
          const newFormData = {
            judul: initialData.judul || '',
            abstrak: initialData.abstrak || '',
            kata_kunci: initialData.kata_kunci || '',
            kategori: initialData.kategori || '',
            skemaId: initialData.skemaId?.toString() || '',
            dana_diusulkan: initialData.dana_diusulkan || '',
            anggota: initialData.members?.filter(m => m.peran === 'ANGGOTA').map(m => m.userId) || []
          };
          
          setFormData(newFormData);
          
          // Cari skema yang sesuai setelah data dimuat
          if (initialData.skemaId && skemas.length > 0) {
            const selected = skemas.find(s => s.id.toString() === initialData.skemaId.toString());
            if (selected) {
              setSelectedSkema(selected);
            }
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [initialData, loadSkemas, loadUsers]);

  // Set selected skema when skemas are loaded (for edit mode)
  useEffect(() => {
    if (initialData && initialData.skemaId && skemas.length > 0) {
      const selected = skemas.find(s => s.id.toString() === initialData.skemaId.toString());
      if (selected) {
        setSelectedSkema(selected);
      }
    }
  }, [skemas, initialData]);

  // Update filtered skemas when category changes
  useEffect(() => {
    if (formData.kategori && skemas.length > 0) {
      const filtered = skemas.filter(skema => 
        skema.kategori === formData.kategori
      );
      setFilteredSkemas(filtered);
      
      if (selectedSkema && selectedSkema.kategori !== formData.kategori) {
        setSelectedSkema(null);
        setFormData(prev => ({ ...prev, skemaId: '' }));
      }
    } else {
      setFilteredSkemas([]);
      setSelectedSkema(null);
      setFormData(prev => ({ ...prev, skemaId: '' }));
    }
  }, [formData.kategori, skemas, selectedSkema]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle skema selection
  const handleSkemaChange = (e) => {
    const skemaId = e.target.value;
    setFormData(prev => ({
      ...prev,
      skemaId
    }));
    
    const skema = filteredSkemas.find(s => s.id.toString() === skemaId);
    setSelectedSkema(skema || null);
  };

  // Handle member toggle
  const handleMemberToggle = (userId) => {
    if (selectedSkema && 
        !formData.anggota.includes(userId) && 
        formData.anggota.length >= selectedSkema.batas_anggota - 1) {
      alert(`Batas anggota maksimal ${selectedSkema.batas_anggota} orang (termasuk ketua)`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      anggota: prev.anggota.includes(userId)
        ? prev.anggota.filter(id => id !== userId)
        : [...prev.anggota, userId]
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul proposal harus diisi';
    } else if (formData.judul.length < 10) {
      newErrors.judul = 'Judul minimal 10 karakter';
    }

    if (!formData.abstrak.trim()) {
      newErrors.abstrak = 'Abstrak harus diisi';
    } else if (formData.abstrak.length < 100) {
      newErrors.abstrak = 'Abstrak minimal 100 karakter';
    }

    if (!formData.kata_kunci.trim()) {
      newErrors.kata_kunci = 'Kata kunci harus diisi';
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori harus dipilih';
    }

    if (!formData.skemaId) {
      newErrors.skemaId = 'Skema harus dipilih';
    }

    // Dana validation
    if (formData.dana_diusulkan) {
      const dana = parseFloat(formData.dana_diusulkan);
      
      if (isNaN(dana)) {
        newErrors.dana_diusulkan = 'Dana harus berupa angka yang valid';
      } else if (selectedSkema) {
        if (selectedSkema.dana_min && dana < selectedSkema.dana_min) {
          newErrors.dana_diusulkan = `Dana minimal ${formatCurrency(selectedSkema.dana_min)}`;
        }
        
        if (selectedSkema.dana_max && dana > selectedSkema.dana_max) {
          newErrors.dana_diusulkan = `Dana maksimal ${formatCurrency(selectedSkema.dana_max)}`;
        }
      }
    }

    // Anggota validation
    if (selectedSkema && formData.anggota.length > selectedSkema.batas_anggota - 1) {
      newErrors.anggota = `Maksimal ${selectedSkema.batas_anggota - 1} anggota tambahan`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        skemaId: parseInt(formData.skemaId),
        dana_diusulkan: formData.dana_diusulkan ? parseFloat(formData.dana_diusulkan) : null,
        anggota: formData.anggota
      };

      const result = isEdit
        ? await proposalService.updateProposal(proposalId, submitData)
        : await proposalService.createProposal(submitData);

      if (result.success) {
        setShowFileManager(true);
        
        if (!isEdit) {
          navigate(`/proposals/edit/${result.data.id}`);
          alert('Proposal berhasil dibuat! Silakan unggah dokumen pendukung.');
        } else {
          alert('Proposal berhasil diperbarui!');
        }
      } else {
        alert(result.error || 'Terjadi kesalahan saat menyimpan proposal');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response?.status === 429) {
        alert('Terlalu banyak permintaan. Silakan tunggu beberapa saat.');
      } else {
        alert('Terjadi kesalahan saat menyimpan proposal');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get role label
  const getRoleLabel = (role) => {
    const roleLabels = {
      'DOSEN': 'Dosen',
      'MAHASISWA': 'Mahasiswa',
      'REVIEWER': 'Reviewer',
      'ADMIN': 'Admin'
    };
    return roleLabels[role] || role;
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      'DOSEN': 'bg-blue-100 text-blue-800',
      'MAHASISWA': 'bg-green-100 text-green-800',
      'REVIEWER': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-yellow-100 text-yellow-800'
    };
    return roleClasses[role] || 'bg-gray-100 text-gray-800';
  };

  // Group users by role
  const groupedUsers = useMemo(() => {
    return availableUsers.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = [];
      }
      acc[user.role].push(user);
      return acc;
    }, {});
  }, [availableUsers]);

  // Loading state
  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? 'Edit Proposal' : 'Buat Proposal Baru'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? 'Perbarui informasi proposal Anda' : 'Lengkapi form berikut untuk membuat proposal baru'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Kategori dan Skema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.kategori ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Kategori</option>
                <option value="PENELITIAN">Penelitian</option>
                <option value="PENGABDIAN">Pengabdian</option>
              </select>
              {errors.kategori && (
                <p className="mt-1.5 text-sm text-red-600">{errors.kategori}</p>
              )}
            </div>

            {/* Skema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skema Pendanaan <span className="text-red-500">*</span>
              </label>
              <select
                name="skemaId"
                value={formData.skemaId}
                onChange={handleSkemaChange}
                disabled={!formData.kategori || skemaLoading}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.skemaId ? 'border-red-300' : 'border-gray-300'
                } ${!formData.kategori ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Pilih Skema</option>
                
                {skemaLoading ? (
                  <option disabled>Memuat skema...</option>
                ) : !formData.kategori ? (
                  <option disabled>Pilih kategori terlebih dahulu</option>
                ) : filteredSkemas.length === 0 ? (
                  <option disabled>Tidak ada skema tersedia untuk kategori ini</option>
                ) : (
                  filteredSkemas.map((skema) => (
                    <option key={skema.id} value={skema.id}>
                      {skema.nama} ({skema.tahun_aktif})
                    </option>
                  ))
                )}
              </select>
              {errors.skemaId && (
                <p className="mt-1.5 text-sm text-red-600">{errors.skemaId}</p>
              )}
            </div>
          </div>

          {/* Skema Details */}
          {selectedSkema && (
            <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Detail Skema Terpilih
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  selectedSkema.status === 'AKTIF' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedSkema.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Kode</div>
                    <div className="w-2/3 font-medium">{selectedSkema.kode}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Nama</div>
                    <div className="w-2/3">{selectedSkema.nama}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Kategori</div>
                    <div className="w-2/3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        selectedSkema.kategori === 'PENELITIAN' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedSkema.kategori}
                      </span>
                    </div>
                    
                  </div>
                  
                 <div className="flex">
  <div className="w-1/3 text-sm font-medium text-blue-700">Luaran Wajib</div>
  <div className="w-2/3">
    {selectedSkema.luaran_wajib && selectedSkema.luaran_wajib.trim() ? (
      <div className="flex flex-wrap gap-1">
        {selectedSkema.luaran_wajib.split(',').map((luaran, index) => (
          <span 
            key={index} 
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1"
          >
            {luaran.trim()}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-sm text-gray-500 italic">Tidak ada luaran wajib</span>
    )}
  </div>
</div>
                </div>
                
                {/* Kolom Kanan */}
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Dana</div>
                    <div className="w-2/3">
                      {selectedSkema.dana_min 
                        ? `${formatCurrency(selectedSkema.dana_min)} - ${formatCurrency(selectedSkema.dana_max)}` 
                        : <span className="text-sm text-gray-500 italic">Tidak ditentukan</span>
                      }
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Batas Anggota</div>
                    <div className="w-2/3">
                      <span className="font-medium">{selectedSkema.batas_anggota} orang </span>
                      <span className="text-xs text-gray-500">(termasuk ketua)</span>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Periode</div>
                    <div className="w-2/3">
                      {selectedSkema.tanggal_buka 
                        ? `${formatDate(selectedSkema.tanggal_buka)} - ${formatDate(selectedSkema.tanggal_tutup)}` 
                        : <span className="text-sm text-gray-500 italic">Tidak ditentukan</span>
                      }
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm font-medium text-blue-700">Tahun Aktif</div>
                    <div className="w-2/3 font-medium">{selectedSkema.tahun_aktif}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-blue-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-blue-600">
                  Pastikan proposal Anda memenuhi semua persyaratan skema ini
                </p>
              </div>
            </div>
          )}

          {/* Judul */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Proposal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.judul ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan judul proposal..."
            />
            {errors.judul && (
              <p className="mt-1.5 text-sm text-red-600">{errors.judul}</p>
            )}
          </div>

          {/* Abstrak */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Abstrak <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${formData.abstrak.length < 100 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.abstrak.length}/100 karakter minimum
              </span>
            </div>
            <textarea
              name="abstrak"
              rows={6}
              value={formData.abstrak}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.abstrak ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Tuliskan abstrak proposal penelitian..."
            />
            {errors.abstrak && (
              <p className="mt-1.5 text-sm text-red-600">{errors.abstrak}</p>
            )}
          </div>

          {/* Kata Kunci dan Dana */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata Kunci <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kata_kunci"
                value={formData.kata_kunci}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.kata_kunci ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contoh: AI, machine learning, data science"
              />
              {errors.kata_kunci && (
                <p className="mt-1.5 text-sm text-red-600">{errors.kata_kunci}</p>
              )}
              <p className="mt-1.5 text-xs text-gray-500">
                Pisahkan dengan koma
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dana Diusulkan
                {selectedSkema?.dana_min && selectedSkema?.dana_max && (
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    (Rekomendasi: {formatCurrency(selectedSkema.dana_min)} - {formatCurrency(selectedSkema.dana_max)})
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">Rp</span>
                <input
                  type="number"
                  name="dana_diusulkan"
                  value={formData.dana_diusulkan}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dana_diusulkan ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
              </div>
              {errors.dana_diusulkan && (
                <p className="mt-1.5 text-sm text-red-600">{errors.dana_diusulkan}</p>
              )}
            </div>
          </div>

          {/* Anggota Tim */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Anggota Tim
                {selectedSkema && (
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    (Maksimal {selectedSkema.batas_anggota - 1} anggota tambahan)
                  </span>
                )}
              </label>
              {selectedSkema && (
                <span className={`text-xs ${
                  formData.anggota.length > selectedSkema.batas_anggota - 1 
                    ? 'text-red-500' 
                    : 'text-gray-500'
                }`}>
                  {formData.anggota.length} dari {selectedSkema.batas_anggota - 1} terpilih
                </span>
              )}
            </div>
            
            {/* Selected Members Preview */}
            {formData.anggota.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Anggota Terpilih:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.anggota.map(memberId => {
                    const member = availableUsers.find(u => u.id === memberId);
                    return member ? (
                      <div 
                        key={memberId} 
                        className="flex items-center bg-blue-50 rounded-full pl-3 pr-2 py-1"
                      >
                        <span className="text-sm text-blue-700 mr-1">
                          {member.nama} ({getRoleLabel(member.role)})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMemberToggle(memberId)}
                          className="ml-1 text-blue-600 hover:text-blue-800 text-lg"
                        >
                          &times;
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                {errors.anggota && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.anggota}</p>
                )}
              </div>
            )}

            <div className={`border border-gray-300 rounded-xl p-4 max-h-96 overflow-y-auto ${availableUsers.length === 0 ? 'flex items-center justify-center' : ''}`}>
              {availableUsers.length > 0 ? (
                <div className="space-y-5">
                  {Object.entries(groupedUsers).map(([role, users]) => (
                    <div key={role} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium mr-2 ${getRoleBadgeClass(role)}`}>
                          {getRoleLabel(role)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {users.length} {users.length > 1 ? 'anggota' : 'anggota'} tersedia
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {users.map(availableUser => (
                          <div 
                            key={availableUser.id} 
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              formData.anggota.includes(availableUser.id) 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            } ${
                              selectedSkema && 
                              formData.anggota.length >= selectedSkema.batas_anggota - 1 && 
                              !formData.anggota.includes(availableUser.id)
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                            onClick={() => {
                              if (!selectedSkema || 
                                  formData.anggota.length < selectedSkema.batas_anggota - 1 || 
                                  formData.anggota.includes(availableUser.id)) {
                                handleMemberToggle(availableUser.id);
                              }
                            }}
                          >
                            <div className="flex items-start">
                              <div className={`h-5 w-5 flex items-center justify-center rounded border mr-3 mt-0.5 ${
                                formData.anggota.includes(availableUser.id)
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'bg-white border-gray-300'
                              }`}>
                                {formData.anggota.includes(availableUser.id) && (
                                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {availableUser.nama}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <span>{availableUser.email}</span>
                                  {availableUser.nip && (
                                    <span className="ml-1.5">NIP: {availableUser.nip}</span>
                                  )}
                                  {availableUser.nim && (
                                    <span className="ml-1.5">NIM: {availableUser.nim}</span>
                                  )}
                                </div>
                                {availableUser.bidang_keahlian && (
                                  <div className="mt-1.5">
                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                      {availableUser.bidang_keahlian}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-3">
                    <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">Tidak ada anggota tersedia</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Tidak ditemukan anggota tim yang dapat ditambahkan.
                  </p>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Pilih anggota tim dari dosen dan mahasiswa yang tersedia.
            </p>
          </div>

          {/* File Manager Section */}
          {(showFileManager || isEdit) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dokumen Proposal</h2>
              <FileManager 
                proposalId={proposalId} 
                allowUpload={true}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/proposals')}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-white rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : isEdit ? (
                'Perbarui Proposal'
              ) : (
                'Buat Proposal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;