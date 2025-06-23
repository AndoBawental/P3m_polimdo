// middlewares/uploadHandler.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/constants');

// === Storage Configuration ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(UPLOAD_DIR, file.fieldname || 'others');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// === File Filter ===
const fileFilter = (req, file, cb) => {
  // Accept only certain file types if needed
  // Example: accept only images
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Jenis file tidak diizinkan');
    error.statusCode = 400;
    return cb(error, false);
  }
  cb(null, true);
};

// === Upload Middleware ===
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseSize(process.env.MAX_FILE_SIZE || '10mb')
  }
});

// === Upload Error Handling Middleware ===
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Upload gagal: ${err.message}`
    });
  } else if (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Terjadi kesalahan saat mengunggah file'
    });
  }
  next();
};

// === Helper: Parse file size from string (e.g., '10mb') ===
function parseSize(sizeStr) {
  const sizeMap = { kb: 1 << 10, mb: 1 << 20, gb: 1 << 30 };
  const match = /^(\d+)(kb|mb|gb)$/i.exec(sizeStr);
  if (!match) return 10 * (1 << 20); // default 10MB
  const [, num, unit] = match;
  return parseInt(num, 10) * sizeMap[unit.toLowerCase()];
}

module.exports = {
  upload,
  handleUploadError
};
