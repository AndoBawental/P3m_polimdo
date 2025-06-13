// file validation.js
// Utility functions for form validation

/**
 * Check if email format is valid (simple check for real-time)
 * @param {string} email - Email string to validate
 * @returns {boolean} - True if valid format
 */
export const isValidEmailFormat = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates email format using comprehensive regex pattern
 * @param {string} email - Email string to validate
 * @returns {Object} - Object containing isValid boolean and error message
 */
export const validateEmail = (email) => {
  // Remove whitespace and convert to lowercase
  const cleanEmail = email.trim().toLowerCase();
  
  // Check if email is empty
  if (!cleanEmail) {
    return {
      isValid: false,
      error: 'Email wajib diisi'
    };
  }
  
  // Comprehensive email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
  
  // Test email format
  if (!emailRegex.test(cleanEmail)) {
    return {
      isValid: false,
      error: 'Format email tidak valid. Contoh: user@example.com'
    };
  }
  
  // Check email length (max 254 characters per RFC 5321)
  if (cleanEmail.length > 254) {
    return {
      isValid: false,
      error: 'Email terlalu panjang (maksimal 254 karakter)'
    };
  }
  
  // Check for consecutive dots
  if (cleanEmail.includes('..')) {
    return {
      isValid: false,
      error: 'Email tidak boleh mengandung titik berturut-turut'
    };
  }
  
  // Check if email starts or ends with dot
  if (cleanEmail.startsWith('.') || cleanEmail.endsWith('.')) {
    return {
      isValid: false,
      error: 'Email tidak boleh dimulai atau diakhiri dengan titik'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates password strength
 * @param {string} password - Password string to validate
 * @returns {Object} - Object containing isValid boolean and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password wajib diisi'
    };
  }
  
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password minimal 6 karakter'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates role selection
 * @param {string} role - Role string to validate
 * @returns {Object} - Object containing isValid boolean and error message
 */
export const validateRole = (role) => {
  const validRoles = ['DOSEN', 'MAHASISWA', 'REVIEWER', 'ADMIN'];
  
  if (!role) {
    return {
      isValid: false,
      error: 'Role wajib dipilih'
    };
  }
  
  if (!validRoles.includes(role)) {
    return {
      isValid: false,
      error: 'Role tidak valid'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates if selected role matches the user's registered role
 * @param {string} selectedRole - Role selected during login
 * @param {string} userRole - User's actual registered role
 * @returns {Object} - Object containing isValid boolean and error message
 */
export const validateRoleMatch = (selectedRole, userRole) => {
  if (!selectedRole || !userRole) {
    return {
      isValid: false,
      error: 'Role tidak dapat diverifikasi'
    };
  }

  if (selectedRole !== userRole) {
    const roleLabels = {
      'DOSEN': 'Dosen',
      'MAHASISWA': 'Mahasiswa', 
      'REVIEWER': 'Reviewer',
      'ADMIN': 'Admin'
    };

    return {
      isValid: false,
     error: `Akun Anda terdaftar sebagai ${roleLabels[userRole] || userRole}. Silakan pilih role yang sesuai.`

    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates entire login form
 * @param {Object} formData - Form data object containing email, password, and role
 * @returns {Object} - Object containing isValid boolean and errors object
 */
export const validateLoginForm = (formData) => {
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password);
  const roleValidation = validateRole(formData.role);
  
  const errors = {};
  
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  if (!roleValidation.isValid) {
    errors.role = roleValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates login credentials including role matching
 * This should be called after receiving user data from server
 * @param {Object} formData - Form data with selected role
 * @param {Object} userData - User data from server with registered role
 * @returns {Object} - Object containing isValid boolean and errors object
 */
export const validateLoginCredentials = (formData, userData) => {
  // First validate form data
  const formValidation = validateLoginForm(formData);
  
  if (!formValidation.isValid) {
    return formValidation;
  }

  // Then validate role matching if user data is available
  if (userData && userData.role) {
    const roleMatchValidation = validateRoleMatch(formData.role, userData.role);
    
    if (!roleMatchValidation.isValid) {
      return {
        isValid: false,
        errors: {
          role: roleMatchValidation.error
        }
      };
    }
  }

  return {
    isValid: true,
    errors: {}
  };
};

// src/utils/validation.js
/**
 * Validasi form registrasi
 * @param {Object} formData - Data form registrasi
 * @returns {Object} errors - Objek berisi pesan error untuk setiap field
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  // Required fields
  if (!formData.nama.trim()) {
    errors.nama = 'Nama lengkap harus diisi';
  } else if (formData.nama.trim().length < 2) {
    errors.nama = 'Nama minimal 2 karakter';
  } else if (formData.nama.trim().length > 100) {
    errors.nama = 'Nama maksimal 100 karakter';
  }

  // ✅ Validasi wajib memilih role
  if (!formData.role) {
    errors.role = 'Pilih role Anda';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email harus diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Format email tidak valid';
  } else if (formData.email.length > 100) {
    errors.email = 'Email maksimal 100 karakter';
  }

  if (!formData.password) {
    errors.password = 'Password harus diisi';
  } else if (formData.password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
  } else if (formData.password.length > 50) {
    errors.password = 'Password maksimal 50 karakter';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password harus diisi';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password tidak cocok';
  }

  if (!formData.role) {
    errors.role = 'Role harus dipilih';
  }

  // No Telepon validation (optional field)
  if (formData.no_telp && formData.no_telp.trim()) {
    const phoneRegex = /^(08|62)[0-9]{8,12}$/;
    if (!phoneRegex.test(formData.no_telp.trim())) {
      errors.no_telp = 'Format nomor telepon tidak valid (contoh: 08123456789)';
    }
  }

  // Role-specific validations
  if (formData.role === 'DOSEN') {
    if (!formData.nip.trim()) {
      errors.nip = 'NIP harus diisi untuk dosen';
    } else if (formData.nip.trim().length !== 18) {
      errors.nip = 'NIP harus terdiri dari 18 digit';
    } else if (!/^\d{18}$/.test(formData.nip.trim())) {
      errors.nip = 'NIP hanya boleh berisi angka';
    }
  }

  if (formData.role === 'REVIEWER') {
    if (!formData.nip.trim()) {
      errors.nip = 'NIP harus diisi untuk reviewer';
    } else if (formData.nip.trim().length !== 18) {
      errors.nip = 'NIP harus terdiri dari 18 digit';
    } else if (!/^\d{18}$/.test(formData.nip.trim())) {
      errors.nip = 'NIP hanya boleh berisi angka';
    }
  }

  if (formData.role === 'MAHASISWA') {
    if (!formData.nim.trim()) {
      errors.nim = 'NIM harus diisi untuk mahasiswa';
    } else if (formData.nim.trim().length < 8 || formData.nim.trim().length > 15) {
      errors.nim = 'NIM harus terdiri dari 8-15 karakter';
    } else if (!/^[A-Za-z0-9]+$/.test(formData.nim.trim())) {
      errors.nim = 'NIM hanya boleh berisi huruf dan angka';
    }
  }

  // Bidang Keahlian validation (optional for DOSEN and REVIEWER)
  if ((formData.role === 'DOSEN' || formData.role === 'REVIEWER') && formData.bidang_keahlian && formData.bidang_keahlian.trim()) {
    if (formData.bidang_keahlian.trim().length < 2) {
      errors.bidang_keahlian = 'Bidang keahlian minimal 2 karakter';
    } else if (formData.bidang_keahlian.trim().length > 100) {
      errors.bidang_keahlian = 'Bidang keahlian maksimal 100 karakter';
    }
  }

  // Jurusan and Prodi required for MAHASISWA and DOSEN
  if (formData.role === 'MAHASISWA' || formData.role === 'DOSEN') {
    if (!formData.jurusanId) {
      errors.jurusanId = 'Jurusan harus dipilih';
    }
    if (!formData.prodiId) {
      errors.prodiId = 'Program studi harus dipilih';
    }
  }

  return errors;
};

/**
 * Validasi kekuatan password
 * @param {string} password - Password yang akan divalidasi
 * @returns {Object} - Objek berisi status dan pesan
 */
export const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 'Lemah';
  let score = 0;

  if (password.length >= minLength) score++;
  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;

  if (score >= 4) strength = 'Kuat';
  else if (score >= 2) strength = 'Sedang';

  return {
    isValid: password.length >= minLength,
    strength,
    score,
    suggestions: [
      password.length < minLength && 'Minimal 6 karakter',
      !hasUpperCase && 'Tambahkan huruf besar',
      !hasLowerCase && 'Tambahkan huruf kecil',
      !hasNumbers && 'Tambahkan angka',
      !hasSpecialChar && 'Tambahkan karakter khusus'
    ].filter(Boolean)
  };
};

/**
 * Validasi field individual saat user mengetik (real-time validation)
 * @param {string} fieldName - Nama field yang divalidasi
 * @param {string} value - Nilai field
 * @param {Object} formData - Seluruh data form untuk validasi yang memerlukan field lain
 * @returns {string} error - Pesan error jika ada, kosong jika valid
 */
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'nama':
      if (!value.trim()) return 'Nama lengkap harus diisi';
      if (value.trim().length < 2) return 'Nama minimal 2 karakter';
      if (value.trim().length > 100) return 'Nama maksimal 100 karakter';
      return '';

    case 'email':
      if (!value.trim()) return 'Email harus diisi';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format email tidak valid';
      if (value.length > 100) return 'Email maksimal 100 karakter';
      return '';

    case 'password':
      if (!value) return 'Password harus diisi';
      if (value.length < 6) return 'Password minimal 6 karakter';
      if (value.length > 50) return 'Password maksimal 50 karakter';
      return '';

    case 'confirmPassword':
      if (!value) return 'Konfirmasi password harus diisi';
      if (formData.password !== value) return 'Konfirmasi password tidak cocok';
      return '';

    case 'role':
      if (!value) return 'Role harus dipilih';
      return '';

    case 'nim':
      if (formData.role === 'MAHASISWA') {
        if (!value.trim()) return 'NIM harus diisi untuk mahasiswa';
        if (value.trim().length < 8 || value.trim().length > 15) return 'NIM harus terdiri dari 8-15 karakter';
        if (!/^[A-Za-z0-9]+$/.test(value.trim())) return 'NIM hanya boleh berisi huruf dan angka';
      }
      return '';

    case 'nip':
      if (formData.role === 'DOSEN' || formData.role === 'REVIEWER') {
       if (!value.trim()) return `NIP harus diisi untuk ${formData.role.toLowerCase()}`;
        if (value.trim().length !== 18) return 'NIP harus terdiri dari 18 digit';
        if (!/^\d{18}$/.test(value.trim())) return 'NIP hanya boleh berisi angka';
      }
      return '';

    case 'jurusanId':
      if ((formData.role === 'MAHASISWA' || formData.role === 'DOSEN') && !value) {
        return 'Jurusan harus dipilih';
      }
      return '';

    case 'prodiId':
      if ((formData.role === 'MAHASISWA' || formData.role === 'DOSEN') && !value) {
        return 'Program studi harus dipilih';
      }
      return '';

    case 'no_telp':
      if (value && value.trim()) {
        const phoneRegex = /^(08|62)[0-9]{8,12}$/;
        if (!phoneRegex.test(value.trim())) {
          return 'Format nomor telepon tidak valid (contoh: 08123456789)';
        }
      }
      return '';

    case 'bidang_keahlian':
      if ((formData.role === 'DOSEN' || formData.role === 'REVIEWER') && value && value.trim()) {
        if (value.trim().length < 2) return 'Bidang keahlian minimal 2 karakter';
        if (value.trim().length > 100) return 'Bidang keahlian maksimal 100 karakter';
      }
      return '';

    default:
      return '';
  }
};

/**
 * Validasi apakah form data sudah lengkap sesuai role
 * @param {Object} formData - Data form
 * @returns {boolean} - True jika form lengkap
 */
export const isFormComplete = (formData) => {
  const requiredFields = ['nama', 'email', 'password', 'role'];
  
  // Check basic required fields
  for (const field of requiredFields) {
    if (!formData[field] || !formData[field].toString().trim()) {
      return false;
    }
  }

  // Check role-specific fields
  if (formData.role === 'MAHASISWA') {
    if (!formData.nim || !formData.nim.trim()) return false;
    if (!formData.jurusanId) return false;
    if (!formData.prodiId) return false;
  }

  if (formData.role === 'DOSEN') {
    if (!formData.nip || !formData.nip.trim()) return false;
    if (!formData.jurusanId) return false;
    if (!formData.prodiId) return false;
  }

  if (formData.role === 'REVIEWER') {
    if (!formData.nip || !formData.nip.trim()) return false;
  }

  return true;
};

/**
 * Sanitasi data form sebelum dikirim ke server
 * @param {Object} formData - Data form yang akan disanitasi
 * @returns {Object} - Data yang sudah disanitasi
 */
export const sanitizeFormData = (formData) => {
  const sanitized = {};

  // Sanitasi field yang wajib ada
  sanitized.nama = formData.nama ? formData.nama.trim() : '';
  sanitized.email = formData.email ? formData.email.trim().toLowerCase() : '';
  sanitized.password = formData.password || '';
  sanitized.role = formData.role || '';

  // Sanitasi field opsional
  if (formData.no_telp && formData.no_telp.trim()) {
    sanitized.no_telp = formData.no_telp.trim();
  }

  if (formData.bidang_keahlian && formData.bidang_keahlian.trim()) {
    sanitized.bidang_keahlian = formData.bidang_keahlian.trim();
  }

  // Sanitasi field khusus role
  if (formData.role === 'MAHASISWA') {
    sanitized.nim = formData.nim ? formData.nim.trim() : '';
    sanitized.jurusanId = formData.jurusanId ? parseInt(formData.jurusanId) : null;
    sanitized.prodiId = formData.prodiId ? parseInt(formData.prodiId) : null;
  }

  if (formData.role === 'DOSEN') {
    sanitized.nip = formData.nip ? formData.nip.trim() : '';
    sanitized.jurusanId = formData.jurusanId ? parseInt(formData.jurusanId) : null;
    sanitized.prodiId = formData.prodiId ? parseInt(formData.prodiId) : null;
  }

  if (formData.role === 'REVIEWER') {
    sanitized.nip = formData.nip ? formData.nip.trim() : '';
  }

  return sanitized;
};