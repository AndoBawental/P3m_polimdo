import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkemaForm from '../../components/Skema/SkemaForm';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Common/Loading';

const SkemaCreate = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (skemaData) => {
    try {
      setLoading(true);
      setError('');

      console.log('Submitting skema:', skemaData);

      const response = await skemaService.createSkema(skemaData);

      console.log('Service response:', response);

      if (response.success) {
        const successMessage = typeof response.message === 'string'
          ? response.message
          : 'Skema berhasil dibuat';

        showSuccess(successMessage);
        navigate('/skema');
      } else {
        const errorMessage = typeof response.message === 'string'
          ? response.message
          : 'Gagal membuat skema';

        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Error creating skema:', err);

      const errorMessage = typeof err.response?.data?.message === 'string'
        ? err.response.data.message
        : typeof err.message === 'string'
          ? err.message
          : 'Terjadi kesalahan saat membuat skema';

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Skema Baru</h1>
        <p className="text-gray-600">Isi formulir di bawah untuk menambahkan skema baru</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <SkemaForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SkemaCreate;
