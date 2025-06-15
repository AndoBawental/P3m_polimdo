import React from "react";
import { 
  FaTwitter, 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaUniversity
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <FaUniversity className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold">P3M POLIMDO</h3>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Sistem Penelitian, Pengabdian Masyarakat & Publikasi Politeknik Negeri Manado
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition">
                <FaFacebookF className="text-white" />
              </a>
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition">
                <FaLinkedinIn className="text-white" />
              </a>
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition">
                <FaInstagram className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-blue-700">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Panduan Penggunaan
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-blue-700">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-300 mt-1 flex-shrink-0" />
                <span className="text-blue-100">
                  Jl. Raya Politeknik, Kel. Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-300" />
                <span className="text-blue-100">(0431) 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-300" />
                <span className="text-blue-100">p3m@polimdo.ac.id</span>
              </li>
            </ul>
          </div>

         
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © {currentYear}{" "}
            <span className="text-white font-semibold hover:underline cursor-pointer">
              P3M Politeknik Negeri Manado
            </span>
            . All rights reserved.
          </p>
          <p className="text-blue-200 text-sm mt-2 md:mt-0">
            Versi 2.1.0 | Terakhir diperbarui: 15 Juni {currentYear}
          </p>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="w-full overflow-hidden mt-6">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-12 text-blue-800"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            opacity="0.25"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            opacity="0.5"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;