// src/pages/Skema/Detail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Common/Loading';
import StatusBadge from '../../components/Common/StatusBadge';
import { FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaFileAlt, FaInfoCircle } from 'react-icons/fa';

const SkemaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [skema, setSkema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkema = async () => {
      try {
        setLoading(true);
        const response = await skemaService.getSkemaById(id);
        
        if (response.success) {
          setSkema(response.data);
        } else {
          setError(response.message || 'Gagal memuat data skema');
          showToast('error', response.message || 'Gagal memuat data skema');
        }
      } catch (err) {
        console.error('Error fetching skema:', err);
        setError('Terjadi kesalahan saat memuat data skema');
        showToast('error', 'Terjadi kesalahan saat memuat data skema');
      } finally {
        setLoading(false);
      }
    };

    fetchSkema();
  }, [id, showToast]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus skema ini?')) {
      try {
        setLoading(true);
        const response = await skemaService.deleteSkema(id);
        
        if (response.success) {
          showToast('success', 'Skema berhasil dihapus');
          navigate('/skema');
        } else {
          setError(response.message || 'Gagal menghapus skema');
          showToast('error', response.message || 'Gagal menghapus skema');
        }
      } catch (err) {
        console.error('Error deleting skema:', err);
        setError('Terjadi kesalahan saat menghapus skema');
        showToast('error', 'Terjadi kesalahan saat menghapus skema');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getKategoriLabel = (kategori) => {
    const labels = {
      PENELITIAN: 'Penelitian',
      PENGABDIAN: 'Pengabdian',
      HIBAH_INTERNAL: 'Hibah Internal',
      HIBAH_EKSTERNAL: 'Hibah Eksternal'
    };
    return labels[kategori] || kategori;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!skema) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Skema tidak ditemukan
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
         
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Skema</h1>
            <p className="text-gray-600 mt-1 flex items-center">
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                Kode: {skema.kode}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/skema/${id}/edit`)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <FaTrash className="mr-2" />
            Hapus
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaInfoCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{skema.nama}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getKategoriLabel(skema.kategori)}
                </span>
                <StatusBadge status={skema.status} />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Tahun: {skema.tahun_aktif}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Informasi Umum
              </h3>
              <dl className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Nama Skema</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium text-right">{skema.nama}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Kategori</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium text-right">{getKategoriLabel(skema.kategori)}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Tahun Aktif</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium text-right">{skema.tahun_aktif}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Status</span>
                  </dt>
                  <dd className="text-sm font-medium text-right">
                    <StatusBadge status={skema.status} />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <FaMoneyBillWave className="mr-2 text-green-500" />
                Detail Pendanaan
              </h3>
              <dl className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Dana Minimum</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium text-right">{formatCurrency(skema.dana_min)}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Dana Maksimum</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium text-right">{formatCurrency(skema.dana_max)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-32">Batas Anggota</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium text-right">{skema.batas_anggota} orang</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <FaCalendarAlt className="mr-2 text-purple-500" />
                Periode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Tanggal Buka</h4>
                  <div className="text-lg font-semibold text-gray-900">{formatDate(skema.tanggal_buka)}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Tanggal Tutup</h4>
                  <div className="text-lg font-semibold text-gray-900">{formatDate(skema.tanggal_tutup)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <FaFileAlt className="mr-2 text-orange-500" />
                Luaran Wajib
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700">{skema.luaran_wajib || 'Tidak ada luaran wajib yang ditentukan'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default SkemaDetail;