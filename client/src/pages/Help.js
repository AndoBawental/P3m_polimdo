// src/pages/Help.js
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import { ChevronDown, Mail, Phone, MapPin, MessageCircle, FileText, AlertCircle } from 'lucide-react';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('umum');
  const [openFaqs, setOpenFaqs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Toggle FAQ item
  const toggleFaq = (id) => {
    if (openFaqs.includes(id)) {
      setOpenFaqs(openFaqs.filter(faqId => faqId !== id));
    } else {
      setOpenFaqs([...openFaqs, id]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  // FAQ data
  const faqCategories = {
    umum: [
      { id: 1, question: 'Bagaimana cara mendaftar di sistem P3M POLIMDO?', answer: 'Untuk mendaftar, klik tombol "Daftar" di halaman depan sistem. Isi formulir pendaftaran dengan data yang valid. Setelah itu, Anda akan menerima email verifikasi untuk mengaktifkan akun.' },
      { id: 2, question: 'Apa saja persyaratan untuk mengajukan proposal penelitian?', answer: 'Persyaratan pengajuan proposal penelitian meliputi: formulir proposal lengkap, CV peneliti, surat pernyataan orisinalitas karya, dan surat pengantar dari departemen.' },
      { id: 3, question: 'Berapa lama proses review proposal?', answer: 'Proses review proposal biasanya memakan waktu 2-4 minggu, tergantung pada kompleksitas proposal dan ketersediaan reviewer.' },
      { id: 4, question: 'Bagaimana cara melacak status proposal saya?', answer: 'Anda dapat melacak status proposal di dashboard akun Anda. Sistem akan mengirimkan notifikasi setiap ada perubahan status.' },
    ],
    teknis: [
      { id: 5, question: 'Saya tidak bisa login ke akun saya, apa yang harus dilakukan?', answer: 'Pastikan Anda menggunakan email dan password yang benar. Jika lupa password, gunakan fitur "Lupa Password" di halaman login. Jika masalah berlanjut, hubungi tim dukungan teknis.' },
      { id: 6, question: 'Bagaimana cara mengunggah dokumen proposal?', answer: 'Setelah login, buka menu "Proposal" > "Ajukan Baru". Isi formulir dan unggah dokumen dalam format PDF dengan ukuran maksimal 10MB.' },
      { id: 7, question: 'Apa yang harus dilakukan jika terjadi error saat mengirim proposal?', answer: 'Pastikan koneksi internet stabil dan semua field terisi dengan benar. Jika error berlanjut, coba gunakan browser berbeda atau hubungi tim dukungan teknis.' },
    ],
    penelitian: [
      { id: 8, question: 'Apa saja jenis penelitian yang didukung oleh sistem P3M?', answer: 'Sistem mendukung berbagai jenis penelitian termasuk penelitian dasar, terapan, pengembangan, dan penelitian kolaboratif antara dosen dan mahasiswa.' },
      { id: 9, question: 'Bagaimana cara mengajukan revisi proposal?', answer: 'Jika proposal Anda memerlukan revisi, Anda akan menerima notifikasi dengan catatan reviewer. Anda dapat mengajukan revisi melalui menu "Proposal" > "Revisi".' },
      { id: 10, question: 'Apa yang harus dilakukan setelah proposal disetujui?', answer: 'Setelah proposal disetujui, Anda dapat melanjutkan ke tahap penelitian. Pastikan untuk mengunggah laporan kemajuan sesuai jadwal yang ditentukan.' },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pusat Bantuan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda atau hubungi tim dukungan kami untuk bantuan lebih lanjut.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Kategori Bantuan</h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('umum')}
                  className={`flex items-center w-full gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    activeCategory === 'umum'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                  Pertanyaan Umum
                </button>
                
                <button
                  onClick={() => setActiveCategory('teknis')}
                  className={`flex items-center w-full gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    activeCategory === 'teknis'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                
                </button>
                
                <button
                  onClick={() => setActiveCategory('penelitian')}
                  className={`flex items-center w-full gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    activeCategory === 'penelitian'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Penelitian & Proposal
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Dokumentasi</h2>
                
                <div className="space-y-4">
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                  >
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Panduan Pengguna Sistem</p>
                      <p className="text-sm text-blue-500">PDF • 2.5MB</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                  >
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Template Proposal Penelitian</p>
                      <p className="text-sm text-blue-500">DOCX • 150KB</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                  >
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Pedoman Publikasi</p>
                      <p className="text-sm text-blue-500">PDF • 1.1MB</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {activeCategory === 'umum' && 'Pertanyaan Umum'}
                  {activeCategory === 'teknis' && 'Masalah Teknis'}
                  {activeCategory === 'penelitian' && 'Penelitian & Proposal'}
                </h2>
                <p className="text-blue-200 mt-2">
                  Temukan jawaban untuk pertanyaan yang sering diajukan
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {faqCategories[activeCategory].map((faq) => (
                    <div 
                      key={faq.id}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="flex items-center justify-between w-full p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                            openFaqs.includes(faq.id) ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {openFaqs.includes(faq.id) && (
                        <div className="p-5 bg-white border-t border-gray-200 animate-fadeIn">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
                <h2 className="text-2xl font-bold text-white">Butuh Bantuan Lebih Lanjut?</h2>
                <p className="text-blue-200 mt-2">
                  Tim dukungan kami siap membantu Anda
                </p>
              </div>
              
              <div className="p-6">
                {submitSuccess && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Pesan Anda telah terkirim! Tim dukungan kami akan menghubungi Anda secepatnya.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Masukkan email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subjek
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Apa yang bisa kami bantu?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Jelaskan masalah atau pertanyaan Anda"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-12 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Hubungi Kami
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-600 p-4 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Email</h3>
                <p className="text-blue-200">bantuan@p3m-polimdo.ac.id</p>
                <p className="text-blue-200">support@p3m-polimdo.ac.id</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-600 p-4 rounded-full mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Telepon</h3>
                <p className="text-blue-200">(0431) 1234567</p>
                <p className="text-blue-200">(0431) 7654321</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-600 p-4 rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Lokasi</h3>
                <p className="text-blue-200">Jl. Kampus Politeknik Negeri Manado</p>
                <p className="text-blue-200">Manado, Sulawesi Utara</p>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-blue-600 text-center">
              <h3 className="text-lg font-medium text-white mb-4">Jam Operasional</h3>
              <p className="text-blue-200">
                Senin - Jumat: 08:00 - 16:00 WITA
              </p>
              <p className="text-blue-200 mt-1">
                Sabtu: 08:00 - 12:00 WITA
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white p-1 rounded-lg mr-3">
                <div className="h-8 w-8">
                  <img src="/logo polimdo.png" alt="Logo Polimdo" className="h-full w-full object-contain" />
                </div>
              </div>
              <div>
                <h3 className="font-bold">P3M POLIMDO</h3>
                <p className="text-xs text-gray-400">Penelitian, Pengabdian & Publikasi</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Politeknik Negeri Manado. Hak Cipta Dilindungi.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Versi Sistem: 2.1.5
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Help;