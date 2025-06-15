const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendError } = require('../utils/response');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Main uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
ensureDirectoryExists(uploadsDir);

// Permanent storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder based on file type/context
    let folder = 'documents/';
    
    if (file.fieldname === 'proposal') folder = 'proposals/';
    else if (file.fieldname === 'review') folder = 'reviews/';
    else if (file.fieldname.startsWith('image')) folder = 'images/';
    
    const destPath = path.join(uploadsDir, folder);
    ensureDirectoryExists(destPath);
    
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(ext, '').replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    cb(null, sanitizedName + '-' + uniqueSuffix + ext);
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',                                      // PDF
    'application/msword',                                   // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel',                             // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'image/jpeg',                                           // JPEG
    'image/png',                                            // PNG
    'image/jpg'                                             // JPG
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Jenis file tidak didukung. Ekstensi yang diizinkan: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`), false);
  }
};

// Configure multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Max 5 files per upload
  }
});

// Enhanced error handler
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return sendError(res, 'Ukuran file terlalu besar. Maksimal 10MB per file', 413);
        case 'LIMIT_FILE_COUNT':
          return sendError(res, 'Terlalu banyak file. Maksimal 5 file per upload', 413);
        case 'LIMIT_UNEXPECTED_FILE':
          return sendError(res, 'Jenis field file tidak diharapkan', 400);
        default:
          return sendError(res, `Terjadi kesalahan upload: ${err.message}`, 400);
      }
    } else {
      // Handle custom errors (like fileFilter errors)
      return sendError(res, err.message, 400);
    }
  }
  next();
};

module.exports = {
  upload,
  handleUploadError,
  uploadsDir // Export for use in controllers
};