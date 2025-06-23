// src/pages/Settings.js
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import { User, Lock, Bell, Moon, CreditCard, Globe, Info } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    weeklyReport: false,
  });
  const [theme, setTheme] = useState('light');
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [language, setLanguage] = useState('id');

  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Logic untuk mengubah password
    alert('Password berhasil diubah!');
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Pengaturan</h2>
              <nav>
               
                
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center w-full gap-3 px-4 py-3 text-sm rounded-lg mb-2 transition-all duration-200 ${
                    activeTab === 'preferences'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Preferensi
                </button>
                
             
                
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex items-center w-full gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                    activeTab === 'about'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  Tentang Sistem
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
             
    
              
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferensi Pengguna</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Tema</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 border rounded-xl flex flex-col items-center transition-all duration-300 ${
                            theme === 'light' 
                              ? 'border-blue-500 bg-blue-50 shadow-inner' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-32 mb-3 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 border border-gray-300"></div>
                          <span className="font-medium">Cahaya</span>
                        </button>
                        
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 border rounded-xl flex flex-col items-center transition-all duration-300 ${
                            theme === 'dark' 
                              ? 'border-blue-500 bg-blue-50 shadow-inner' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-32 mb-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"></div>
                          <span className="font-medium">Gelap</span>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Bahasa</h3>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => setLanguage('id')}
                          className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                            language === 'id' 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                              ID
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">Bahasa Indonesia</p>
                              <p className="text-sm text-gray-500">Indonesia</p>
                            </div>
                            {language === 'id' && (
                              <div className="ml-auto text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setLanguage('en')}
                          className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                            language === 'en' 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800">
                              EN
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">English</p>
                              <p className="text-sm text-gray-500">English</p>
                            </div>
                            {language === 'en' && (
                              <div className="ml-auto text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-lg mb-4">Tampilan Dashboard</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Tampilkan Widget Statistik</p>
                          <p className="text-sm text-gray-500">
                            Menampilkan grafik statistik di dashboard
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Pembayaran</h2>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-lg">Paket Premium</h3>
                        <p className="text-gray-600">Akses fitur premium hingga Desember 2023</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Aktif
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                        <p className="font-medium">15 Desember 2023</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Jumlah</p>
                        <p className="font-medium">Rp 500.000</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Metode Pembayaran</p>
                        <p className="font-medium">Transfer Bank</p>
                      </div>
                    </div>
                    
                    <button className="bg-white text-blue-600 font-medium py-2.5 px-6 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-300">
                      Lihat Detail Pembayaran
                    </button>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-medium text-lg mb-4">Metode Pembayaran</h3>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center mr-4">
                          <CreditCard className="w-5 h-5 text-blue-800" />
                        </div>
                        <div>
                          <p className="font-medium">Transfer Bank</p>
                          <p className="text-sm text-gray-500">BNI •••• 1234</p>
                        </div>
                        <div className="ml-auto flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Tambah Metode Pembayaran
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Riwayat Pembayaran</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Deskripsi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jumlah
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              15 Des 2023
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Pembayaran Paket Premium
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rp 500.000
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Berhasil
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              15 Nov 2023
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Pembayaran Paket Premium
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rp 500.000
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Berhasil
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              15 Okt 2023
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Pembayaran Paket Premium
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rp 500.000
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'about' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Tentang Sistem</h2>
                  
                  <div className="flex flex-col items-center text-center py-8 max-w-2xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-2xl w-24 h-24 flex items-center justify-center mb-6">
                      <div className="bg-white p-2 rounded-xl w-full h-full flex items-center justify-center">
                        <img src="/logo polimdo.png" alt="Logo P3M" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">P3M POLIMDO</h3>
                    <p className="text-xl text-gray-600 mb-6">Penelitian, Pengabdian & Publikasi</p>
                    
                    <div className="bg-gray-50 rounded-xl p-6 w-full mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-3xl font-bold text-blue-600">1.2</p>
                          <p className="text-gray-600">Versi Sistem</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-blue-600">2023</p>
                          <p className="text-gray-600">Tahun Rilis</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-blue-600">1.5K</p>
                          <p className="text-gray-600">Pengguna Aktif</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Sistem P3M POLIMDO adalah platform manajemen penelitian, pengabdian masyarakat, 
                      dan publikasi karya ilmiah untuk Politeknik Negeri Manado. Sistem ini dirancang 
                      untuk memudahkan dosen, mahasiswa, dan reviewer dalam mengelola kegiatan 
                      penelitian dan pengabdian dari proposal hingga publikasi.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                        Panduan Pengguna
                      </button>
                      <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                        Pusat Bantuan
                      </button>
                      <button className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                        Kebijakan Privasi
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;