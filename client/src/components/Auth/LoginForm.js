// src/components/Auth/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, ChevronDown } from 'lucide-react';
import { validateLoginForm, validateLoginCredentials } from '../../utils/validation';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, logout, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setFormData(prev => ({ ...prev, role: savedRole }));
    }
  }, []);

  const validateEmailFormat = (email) => {
    if (!email || email.trim() === '') return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Format email tidak valid. Contoh: user@example.com';
    }
    return '';
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.trim().toLowerCase() : value
    }));
    
    if (error) setError(null);
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (name === 'email') {
      const trimmedEmail = value.trim().toLowerCase();
      const emailValidationError = validateEmailFormat(trimmedEmail);
      setEmailError(emailValidationError);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData(prev => ({ ...prev, role: selectedRole }));
    localStorage.setItem('selectedRole', selectedRole);
    setRoleDropdownOpen(false);
    
    if (fieldErrors.role) {
      setFieldErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError('Mohon perbaiki kesalahan pada form');
      return;
    }

    setFieldErrors({});
    setEmailError('');
    setIsSubmitting(true);

    try {
      const result = await login(formData);
      
      if (result.success && result.user) {
        const credentialValidation = validateLoginCredentials(formData, result.user);

        if (!credentialValidation.isValid) {
          setFieldErrors(credentialValidation.errors);
          setError('Role yang dipilih tidak sesuai dengan akun Anda');
          logout();
          setIsSubmitting(false);
          return;
        }

        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Email atau password salah');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'DOSEN': return 'Dosen';
      case 'MAHASISWA': return 'Mahasiswa';
      case 'REVIEWER': return 'Reviewer';
      case 'ADMIN': return 'Admin';
      default: return 'Pilih Role';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'DOSEN': return '👨‍🏫';
      case 'MAHASISWA': return '🎓';
      case 'REVIEWER': return '📋';
      case 'ADMIN': return '⚙';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <div className="text-white text-4xl">🏛</div>
          </div>
          <h2 className="text-2xl font-bold text-white">Login P3M Polimdo</h2>
          <p className="text-blue-100 mt-1">
            Masuk ke sistem Penelitian, Pengabdian & Publikasi
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="animate-fade-in p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Pilih Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  disabled={loading || isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 flex justify-between items-center ${
                    fieldErrors.role ? 'border-red-300 bg-red-50' : 
                    formData.role ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-300'
                  }`}
                >
                  <span className={`flex items-center ${
                    formData.role ? 'text-blue-700 font-medium' : 'text-gray-400'
                  }`}>
                    {formData.role && <span className="mr-2">{getRoleIcon(formData.role)}</span>}
                    {getRoleLabel(formData.role)}
                  </span>
                  <ChevronDown className={`transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-dropdown">
                    {['DOSEN', 'MAHASISWA', 'REVIEWER', 'ADMIN'].map(role => (
                      <div
                        key={role}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center"
                        onClick={() => handleRoleSelect(role)}
                      >
                        <span className="mr-2">{getRoleIcon(role)}</span>
                        {getRoleLabel(role)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {fieldErrors.role && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.role}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 ${
                  emailError || fieldErrors.email
                    ? 'border-red-300 bg-red-50'
                    : formData.email
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
                placeholder="user@example.com"
              />
              {(emailError || fieldErrors.email) && (
                <p className="mt-2 text-sm text-red-600">{emailError || fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 ${
                    fieldErrors.password
                      ? 'border-red-300 bg-red-50'
                      : formData.password
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center"
                  disabled={loading || isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                isSubmitting || loading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <a href="/register" className="text-indigo-600 font-medium hover:underline">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
