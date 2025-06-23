const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const ensureUploadDirs = () => {
  const uploadDirs = [
    'uploads/',
    'uploads/documents/',
    'uploads/proposals/',
    'uploads/reviews/',
    'uploads/images/',
    'uploads/pengumuman/',
    'uploads/temp/'
  ];

  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Jalankan saat server start
ensureUploadDirs();

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/documents/'; // default
    
    // Tentukan folder berdasarkan jenis upload
    if (req.originalUrl.includes('/proposals/')) {
      uploadPath = 'uploads/proposals/';
    } else if (req.originalUrl.includes('/reviews/')) {
      uploadPath = 'uploads/reviews/';
    } else if (req.originalUrl.includes('/pengumuman/')) {
      uploadPath = 'uploads/pengumuman/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter untuk validasi tipe file
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak diizinkan. Hanya PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG yang diperbolehkan.'), false);
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter
});

// Middleware untuk single file upload
const uploadSingle = (fieldName = 'file') => {
  return upload.single(fieldName);
};

// Error handler untuk multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File terlalu besar. Maksimal 10MB.'
      });
    }
  }
  
  if (error.message.includes('Tipe file tidak diizinkan')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

module.exports = {
  uploadSingle,
  handleUploadError,
  ensureUploadDirs
};